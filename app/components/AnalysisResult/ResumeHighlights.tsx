interface ResumeHighlightsProps {
  highlights: string[];
}

export default function ResumeHighlights({
  highlights,
}: ResumeHighlightsProps) {
  return (
    <div className="bg-white border rounded-xl p-5 space-y-3">
      <h3 className="font-semibold text-gray-800 text-sm">
        💡 Resume Highlights to Emphasize
      </h3>
      {highlights.length === 0 ? (
        <p className="text-xs text-gray-400">No highlights found</p>
      ) : (
        <ul className="space-y-2">
          {highlights.map((highlight, i) => (
            <li
              key={i}
              className="flex items-start gap-2 text-sm text-gray-700"
            >
              <span
                className="text-blue-400 mt-0.5 shrink-0"
                aria-hidden="true"
              >
                →
              </span>
              <span>{highlight}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
