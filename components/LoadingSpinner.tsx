import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  className?: string;
  text?: string;
}

export const LoadingSpinner = ({ className = "", text }: LoadingSpinnerProps) => {
  return (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      <Loader2 className="h-8 w-8 animate-spin text-primary" aria-label="Loading" />
      {text && <p className="text-sm text-muted-foreground">{text}</p>}
    </div>
  );
};
