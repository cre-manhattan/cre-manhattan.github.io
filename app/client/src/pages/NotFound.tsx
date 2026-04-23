import { AlertCircle, ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";

export default function NotFound() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background">
      <div className="text-center px-6">
        <div className="flex justify-center mb-6">
          <div className="h-16 w-16 rounded-sm bg-destructive/10 border border-destructive/30 flex items-center justify-center">
            <AlertCircle className="h-8 w-8 text-destructive" />
          </div>
        </div>

        <h1 className="text-6xl font-bold font-mono text-foreground mb-2">404</h1>

        <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
          The page you are looking for does not exist or has been moved.
        </p>

        <button
          onClick={() => setLocation("/")}
          className="inline-flex items-center gap-2 px-6 py-3 bg-teal text-background font-semibold text-sm rounded-sm hover:bg-teal/90 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}
