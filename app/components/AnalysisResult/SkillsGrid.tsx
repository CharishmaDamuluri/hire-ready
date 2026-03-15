import SkillsList from "./SkillsList";

interface SkillsGridProps {
  matchedSkills: string[];
  missingSkills: string[];
}

export default function SkillsGrid({
  matchedSkills,
  missingSkills,
}: SkillsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <SkillsList
        title="✅ Matched Skills"
        skills={matchedSkills}
        chipClass="bg-green-50 text-green-700 border-green-200"
        emptyMessage="No matched skills found"
      />
      <SkillsList
        title="❌ Missing Skills"
        skills={missingSkills}
        chipClass="bg-red-50 text-red-700 border-red-200"
        emptyMessage="No missing skills — great match!"
      />
    </div>
  );
}
