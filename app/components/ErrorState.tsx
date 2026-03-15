interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export default function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center space-y-3">
      <p className="text-2xl">⚠️</p>
      <p className="text-sm font-medium text-red-700">{message}</p>
      <button
        onClick={onRetry}
        className="text-sm text-red-600 hover:text-red-800 underline"
      >
        Try again
      </button>
    </div>
  );
}
