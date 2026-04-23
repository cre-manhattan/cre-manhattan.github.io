/*
 * Design: Obsidian Atlas — Dark Cartographic Intelligence Platform
 * PasscodeLock: Full-screen passcode gate with 4-digit PIN input
 */
import { useState, useRef, useEffect } from "react";
import { Building2, Lock, ShieldCheck } from "lucide-react";

const CORRECT_CODE = "2289";

export default function PasscodeLock({ children }: { children: React.ReactNode }) {
  const [unlocked, setUnlocked] = useState(() => {
    return sessionStorage.getItem("cre_unlocked") === "true";
  });
  const [digits, setDigits] = useState(["", "", "", ""]);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!unlocked) {
      inputRefs.current[0]?.focus();
    }
  }, [unlocked]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newDigits = [...digits];
    newDigits[index] = value.slice(-1);
    setDigits(newDigits);
    setError(false);

    // Auto-advance to next input
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }

    // Check code when all 4 digits entered
    const code = newDigits.join("");
    if (code.length === 4) {
      if (code === CORRECT_CODE) {
        setSuccess(true);
        setTimeout(() => {
          sessionStorage.setItem("cre_unlocked", "true");
          setUnlocked(true);
        }, 600);
      } else {
        setError(true);
        setTimeout(() => {
          setDigits(["", "", "", ""]);
          inputRefs.current[0]?.focus();
        }, 800);
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 4);
    if (pasted.length === 4) {
      const newDigits = pasted.split("");
      setDigits(newDigits);
      inputRefs.current[3]?.focus();
      if (pasted === CORRECT_CODE) {
        setSuccess(true);
        setTimeout(() => {
          sessionStorage.setItem("cre_unlocked", "true");
          setUnlocked(true);
        }, 600);
      } else {
        setError(true);
        setTimeout(() => {
          setDigits(["", "", "", ""]);
          inputRefs.current[0]?.focus();
        }, 800);
      }
    }
  };

  if (unlocked) return <>{children}</>;

  return (
    <div className="fixed inset-0 z-[100] bg-background flex items-center justify-center">
      {/* Subtle grid background */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,229,160,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,160,0.3) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative flex flex-col items-center gap-8 px-6">
        {/* Logo */}
        <div className="flex flex-col items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-sm bg-teal/10 border border-teal/30">
            <Building2 className="h-8 w-8 text-teal" />
          </div>
          <div className="text-center">
            <h1 className="text-xl font-semibold tracking-wide text-foreground">
              CRE PREDICTION ENGINE
            </h1>
            <p className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground mt-1">
              Manhattan Off-Market Intelligence
            </p>
          </div>
        </div>

        {/* Lock icon & instruction */}
        <div className="flex flex-col items-center gap-2">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 ${
              success
                ? "bg-teal/20 border border-teal/50"
                : error
                ? "bg-red-500/20 border border-red-500/50"
                : "bg-secondary/50 border border-border/50"
            }`}
          >
            {success ? (
              <ShieldCheck className="h-5 w-5 text-teal animate-pulse" />
            ) : (
              <Lock
                className={`h-5 w-5 transition-colors ${
                  error ? "text-red-400" : "text-muted-foreground"
                }`}
              />
            )}
          </div>
          <p
            className={`text-sm font-medium transition-colors ${
              success
                ? "text-teal"
                : error
                ? "text-red-400"
                : "text-muted-foreground"
            }`}
          >
            {success
              ? "Access Granted"
              : error
              ? "Incorrect Code"
              : "Enter Access Code"}
          </p>
        </div>

        {/* PIN inputs */}
        <div className="flex gap-3" onPaste={handlePaste}>
          {digits.map((digit, i) => (
            <input
              key={i}
              ref={(el) => { inputRefs.current[i] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={2}
              value={digit ? "\u2022" : ""}
              onInput={(e) => {
                const target = e.target as HTMLInputElement;
                // The bullet char isn't a digit, so strip it; only digits remain
                const raw = target.value.replace(/[^0-9]/g, "");
                if (raw) handleChange(i, raw);
              }}
              onChange={() => { /* controlled via onInput */ }}
              onKeyDown={(e) => handleKeyDown(i, e)}
              className={`w-14 h-16 text-center text-2xl font-mono font-bold rounded-sm border-2 bg-secondary/30 outline-none transition-all duration-200 select-none ${
                success
                  ? "border-teal/60 text-teal bg-teal/5"
                  : error
                  ? "border-red-500/60 text-red-400 bg-red-500/5 animate-[shake_0.3s_ease-in-out]"
                  : digit
                  ? "border-teal/40 text-foreground"
                  : "border-border/50 text-foreground focus:border-teal/50"
              }`}
              autoComplete="off"
            />
          ))}
        </div>

        {/* Footer */}
        <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground/50">
          Authorized Personnel Only
        </p>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-8px); }
          75% { transform: translateX(8px); }
        }
      `}</style>
    </div>
  );
}
