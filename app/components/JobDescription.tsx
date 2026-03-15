interface JobInputProps {
  value: string;
  onChange: (text: string) => void;
}

export default function JobInput({ value, onChange }: JobInputProps) {
  return (
    <section
      aria-label="Job description input"
      className="bg-white border rounded-xl p-5 space-y-4"
    >
      <h2 className="font-semibold text-gray-800 text-sm">Job Description</h2>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Paste the full job description here including requirements, responsibilities, and nice-to-haves..."
        aria-label="Job description"
        rows={8}
        className="w-full text-sm border rounded-xl p-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
      />

      {value && (
        <p className="text-xs text-gray-400" aria-live="polite">
          {value.length.toLocaleString()} characters
        </p>
      )}
    </section>
  );
}
