// components/shared/LoadingSpinner.tsx

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
}

export function LoadingSpinner({ size = "md" }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4 border-2",
    md: "h-8 w-8 border-b-2",
    lg: "h-12 w-12 border-b-3",
  };

  return (
    <div className="flex items-center justify-center">
      <div
        className={`animate-spin rounded-full border-primary ${sizeClasses[size]}`}
      ></div>
    </div>
  );
}
