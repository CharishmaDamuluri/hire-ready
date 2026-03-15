import { AnalysisOutput } from "@/app/types/analysis";
import ScoreCard from "./ScoreCard";
import SkillsGrid from "./SkillsGrid";
import CoverLetter from "./CoverLetter";
import ResumeHighlights from "./ResumeHighlights";

interface AnalysisResultProps {
  result: AnalysisOutput;
}

export default function AnalysisResult({ result }: AnalysisResultProps) {
  return (
    <section aria-label="Analysis results" className="space-y-4">
      <ScoreCard
        matchScore={result.matchScore}
        verdict={result.verdict}
        summary={result.summary}
      />
      <SkillsGrid
        matchedSkills={result.matchedSkills}
        missingSkills={result.missingSkills}
      />
      <ResumeHighlights highlights={result.resumeHighlights} />
      <CoverLetter coverLetter={result.coverLetter} />
    </section>
  );
}
