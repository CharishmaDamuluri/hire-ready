import { AnalysisOutput } from "@/app/types/analysis";
import ScoreCard from "./ScoreCard";
import SkillsGrid from "./SkillsGrid";

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
    </section>
  );
}
