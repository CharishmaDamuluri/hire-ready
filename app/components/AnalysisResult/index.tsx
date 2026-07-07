import ScoreCard from "./ScoreCard";
import SkillsGrid from "./SkillsGrid";
import CoverLetter from "./CoverLetter";
import ResumeHighlights from "./ResumeHighlights";
import { AnalysisOutput } from "@/app/types/analysis";

interface AnalysisResultProps {
  result: AnalysisOutput;
}

export default function AnalysisResult({ result }: AnalysisResultProps) {
  return (
    <section aria-label="Analysis results" className="space-y-4">
      <div className="transition-opacity duration-300 delay-100">
        <ScoreCard
          matchScore={result.matchScore}
          verdict={result.verdict}
          summary={result.summary}
        />
      </div>
      <div className="transition-opacity duration-300 delay-200">
        <SkillsGrid
          matchedSkills={result.matchedSkills}
          missingSkills={result.missingSkills}
        />
      </div>
      <div className="transition-opacity duration-300 delay-300">
        <ResumeHighlights highlights={result.resumeHighlights} />
      </div>
      <div className="transition-opacity duration-300 delay-400">
        <CoverLetter coverLetter={result.coverLetter} />
      </div>
    </section>
  );
}
