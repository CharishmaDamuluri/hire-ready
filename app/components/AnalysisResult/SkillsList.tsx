interface SkillsListProps {
  title: string;
  skills: string[];
  chipClass: string;
  emptyMessage: string;
}

export default function SkillsList({
  title,
  skills,
  chipClass,
  emptyMessage,
}: SkillsListProps) {
  return (
    <div className="bg-white border rounded-xl p-5 space-y-3">
      <h3 className="font-semibold text-gray-800 text-sm">{title}</h3>
      {skills.length === 0 ? (
        <p className="text-xs text-gray-400">{emptyMessage}</p>
      ) : (
        <ul className="flex flex-wrap gap-2" aria-label={title}>
          {skills.map((skill) => (
            <li
              key={skill}
              className={`text-xs px-3 py-1 rounded-full border ${chipClass}`}
            >
              {skill}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
