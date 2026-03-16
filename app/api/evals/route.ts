import { NextRequest, NextResponse } from "next/server";
import { createGateway } from "@ai-sdk/gateway";
import {
  generateText,
  streamText,
  convertToModelMessages,
  UIMessage,
  stepCountIs,
} from "ai";
import { sql } from "@vercel/postgres";
import { evalDataset, EvalTestCase } from "@/app/lib/eval-dataset";
import {
  extractJobRequirementsTool,
  searchResumeTool,
  generateAnalysisTool,
} from "@/app/lib/agent-tools";
import { chunkText } from "@/app/lib/chunker";
import { insertChunk } from "@/app/lib/db";
import { embedBatch } from "@/app/lib/embeddings";

const gateway = createGateway({
  apiKey: process.env.AI_GATEWAY_API_KEY,
});

function getMatchScore(result: Record<string, unknown>) {
  const raw =
    (result.matchScore as unknown) ??
    (result.matchscore as unknown) ??
    (result.match_score as unknown);

  if (typeof raw === "number") {
    return raw;
  }

  if (typeof raw === "string") {
    const parsed = Number(raw);
    return Number.isFinite(parsed) ? parsed : undefined;
  }

  return undefined;
}

function scoreReference(
  result: Record<string, unknown>,
  testCase: EvalTestCase,
) {
  const scores: Record<string, unknown> = {};

  // 1. Score range check
  const score = getMatchScore(result);
  const [min, max] = testCase.expected.scoreRange;
  scores.scoreInRange =
    typeof score === "number" && score >= min && score <= max;
  scores.actualScore = score;
  scores.expectedRange = `${min}-${max}`;

  // 2. Matched skills precision
  const matchedSkills = (result.matchedSkills as string[]).map((s) =>
    s.toLowerCase(),
  );
  const mustHave = testCase.expected.mustHaveSkills.map((s) => s.toLowerCase());
  const foundMustHave = mustHave.filter((skill) =>
    matchedSkills.some((ms) => ms.includes(skill) || skill.includes(ms)),
  );
  scores.skillPrecision =
    mustHave.length > 0
      ? Math.round((foundMustHave.length / mustHave.length) * 100)
      : 100;
  scores.missingExpectedSkills = mustHave.filter(
    (s) => !foundMustHave.includes(s),
  );

  // 3. Missing skills recall
  const missingSkills = (result.missingSkills as string[]).map((s) =>
    s.toLowerCase(),
  );
  const mustMiss = testCase.expected.mustMissSkills.map((s) => s.toLowerCase());
  const foundMustMiss = mustMiss.filter((skill) =>
    missingSkills.some((ms) => ms.includes(skill) || skill.includes(ms)),
  );
  scores.missingSkillRecall =
    mustMiss.length > 0
      ? Math.round((foundMustMiss.length / mustMiss.length) * 100)
      : 100;

  // 4. Verdict check
  scores.verdictCorrect = testCase.expected.verdict.includes(
    result.verdict as string,
  );
  scores.actualVerdict = result.verdict;
  scores.expectedVerdicts = testCase.expected.verdict;

  return scores;
}

async function scoreWithLLM(
  result: Record<string, unknown>,
  testCase: EvalTestCase,
) {
  const matchScore = getMatchScore(result);
  const prompt = `You are an expert evaluator for AI job matching systems.

Evaluate the following analysis output on three dimensions.
Return ONLY a JSON object with no explanation.

RESUME:
${testCase.resume}

JOB DESCRIPTION:
${testCase.jobDescription}

AGENT OUTPUT:
Match Score: ${matchScore}
Matched Skills: ${JSON.stringify(result.matchedSkills)}
Missing Skills: ${JSON.stringify(result.missingSkills)}
Resume Highlights: ${JSON.stringify(result.resumeHighlights)}
Cover Letter: ${result.coverLetter}
Verdict: ${result.verdict}
Summary: ${result.summary}

Evaluate and return this exact JSON:
{
  "highlightSpecificity": <1-5, are highlights specific to THIS resume or generic?>,
  "highlightSpecificityReason": "<one sentence>",
  "coverLetterGrounding": <1-5, is the cover letter grounded in actual resume content?>,
  "coverLetterGroundingReason": "<one sentence>",
  "overallQuality": <1-5, overall quality of the analysis>,
  "overallQualityReason": "<one sentence>",
  "hallucinations": <true/false, does the output contain claims not in the resume?>,
  "hallucinationExamples": ["<example if any>"]
}`;

  const { text } = await generateText({
    model: gateway("openai/gpt-4o-mini"),
    prompt,
  });

  try {
    const clean = text.replace(/```json|```/g, "").trim();
    return JSON.parse(clean);
  } catch {
    return { error: "Failed to parse LLM judge response", raw: text };
  }
}

async function runTestCase(testCase: EvalTestCase) {
  // Clear DB and ingest the test resume
  await sql`DELETE FROM document_chunks`;
  const chunks = chunkText(testCase.resume);
  const embeddings = await embedBatch(chunks.map((c) => c.content));
  for (let i = 0; i < chunks.length; i++) {
    await insertChunk({
      content: chunks[i].content,
      source: `eval-${testCase.id}`,
      chunkIndex: chunks[i].index,
      embedding: embeddings[i],
    });
  }

  // Run the agent
  const messageText = `Analyze this resume against the job description.
    RESUME: ${testCase.resume}
    JOB DESCRIPTION: ${testCase.jobDescription}`;

  const messages: UIMessage[] = [
    {
      id: "1",
      role: "user",
      parts: [{ type: "text", text: messageText }],
    },
  ];

  // Collect tool results from the stream
  let analysisResult: Record<string, unknown> | null = null;

  const result = streamText({
    model: gateway("openai/gpt-4o-mini"),
    stopWhen: stepCountIs(10),
    system: `You are an expert career coach. Analyze the resume against the job description.
    Always follow these steps in order:
        1. Call extractJobRequirements first
        2. Call searchResume 3 times with different queries
        3. Call generateAnalysis last`,
    messages: await convertToModelMessages(messages),
    tools: {
      extractJobRequirements: extractJobRequirementsTool,
      searchResume: searchResumeTool,
      generateAnalysis: generateAnalysisTool,
    },
    onStepFinish: ({ toolResults }) => {
      for (const tr of toolResults ?? []) {
        if (tr.toolName === "generateAnalysis") {
          analysisResult = (
            tr as unknown as {
              toolName: string;
              output: Record<string, unknown>;
            }
          ).output;
        }
      }
    },
  });

  // Wait for stream to complete
  await result.text;

  if (!analysisResult) {
    return { testId: testCase.id, error: "Agent did not complete analysis" };
  }

  // Score the result
  const referenceScores = scoreReference(analysisResult, testCase);
  const llmScores = await scoreWithLLM(analysisResult, testCase);
  const matchScore = getMatchScore(analysisResult);

  // Calculate overall pass/fail
  const passed =
    referenceScores.scoreInRange &&
    (referenceScores.skillPrecision as number) >= 70 &&
    referenceScores.verdictCorrect &&
    (typeof matchScore === "number" && matchScore < 20
      ? true
      : (llmScores.overallQuality ?? 0) >= 3 && !llmScores.hallucinations);

  return {
    testId: testCase.id,
    description: testCase.description,
    passed,
    agentOutput: analysisResult,
    referenceScores,
    llmScores,
  };
}

export async function GET(req: NextRequest) {
  const testId = req.nextUrl.searchParams.get("testId");

  try {
    // Run single test or all tests
    const testsToRun = testId
      ? evalDataset.filter((t) => t.id === testId)
      : evalDataset;

    if (testsToRun.length === 0) {
      return NextResponse.json(
        { error: `Test ${testId} not found` },
        { status: 404 },
      );
    }

    const results = [];
    for (const testCase of testsToRun) {
      const result = await runTestCase(testCase);
      results.push(result);
    }

    // Summary stats
    const passed = results.filter((r) => r.passed).length;
    const summary = {
      total: results.length,
      passed,
      failed: results.length - passed,
      passRate: `${Math.round((passed / results.length) * 100)}%`,
    };

    return NextResponse.json({ summary, results });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
