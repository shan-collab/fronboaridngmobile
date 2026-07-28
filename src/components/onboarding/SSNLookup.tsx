import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Search, ShieldCheck, UserPlus, Loader2, CheckCircle2, Info } from "lucide-react";

export type LookupState = "idle" | "found" | "new";

interface SSNLookupProps {
  value: string;
  onChange: (v: string) => void;
  state: LookupState;
  onFound: (ssn: string) => void;
  onNewHire: (ssn: string) => void;
  onReset: () => void;
  labels: {
    title: string;
    subtitle: string;
    ssnLabel: string;
    placeholder: string;
    search: string;
    noSsn: string;
    foundTitle: string;
    foundDesc: string;
    newTitle: string;
    newDesc: string;
    change: string;
    format: string;
  };
}

// Demo directory of already-registered employees
const KNOWN_RECORDS = ["193053169123491", "1930531691234"];

const formatNir = (raw: string) => {
  const d = raw.replace(/\D/g, "").slice(0, 15);
  const parts = [d.slice(0, 1), d.slice(1, 3), d.slice(3, 5), d.slice(5, 7), d.slice(7, 10), d.slice(10, 13), d.slice(13, 15)];
  return parts.filter(Boolean).join(" ");
};

const SSNLookup = ({ value, onChange, state, onFound, onNewHire, onReset, labels }: SSNLookupProps) => {
  const [searching, setSearching] = useState(false);
  const digits = value.replace(/\D/g, "");
  const canSearch = digits.length >= 13;

  const runSearch = () => {
    setSearching(true);
    setTimeout(() => {
      setSearching(false);
      if (KNOWN_RECORDS.includes(digits)) onFound(digits);
      else onNewHire(digits);
    }, 900);
  };

  if (state !== "idle") {
    const found = state === "found";
    return (
      <div className={cn("rounded-xl border p-3 flex items-start gap-2.5",
        found ? "border-emerald-500/30 bg-emerald-500/5" : "border-primary/20 bg-primary/5")}>
        {found
          ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          : <UserPlus className="w-4 h-4 text-primary shrink-0 mt-0.5" />}
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-semibold text-card-foreground">{found ? labels.foundTitle : labels.newTitle}</p>
          <p className="text-[10px] text-muted-foreground leading-relaxed mt-0.5">{found ? labels.foundDesc : labels.newDesc}</p>
          {digits && (
            <p className="text-[10px] font-mono tracking-wider text-card-foreground mt-1.5">
              {"•".repeat(Math.max(digits.length - 4, 0))}{digits.slice(-4)}
            </p>
          )}
        </div>
        <Button variant="ghost" size="sm" className="h-6 px-2 text-[10px] shrink-0" onClick={onReset}>
          {labels.change}
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5 p-3.5 space-y-3">
      <div className="flex items-start gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
          <ShieldCheck className="w-4 h-4 text-primary" />
        </div>
        <div>
          <h3 className="text-xs font-bold text-card-foreground">{labels.title}</h3>
          <p className="text-[10px] text-muted-foreground leading-relaxed mt-0.5">{labels.subtitle}</p>
        </div>
      </div>

      <div className="space-y-1">
        <Label className="text-[11px] text-muted-foreground">{labels.ssnLabel}<span className="text-destructive ml-0.5">*</span></Label>
        <div className="flex gap-2">
          <Input
            value={formatNir(value)}
            onChange={e => onChange(e.target.value.replace(/\D/g, ""))}
            placeholder={labels.placeholder}
            inputMode="numeric"
            className="h-9 text-xs font-mono tracking-wider"
          />
          <Button onClick={runSearch} disabled={!canSearch || searching} className="h-9 px-3 text-xs gap-1.5 shrink-0">
            {searching ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
            {labels.search}
          </Button>
        </div>
        <p className="text-[9px] text-muted-foreground flex items-center gap-1"><Info className="w-2.5 h-2.5" /> {labels.format}</p>
      </div>

      <button
        onClick={() => onNewHire("")}
        className="w-full text-[10px] font-medium text-primary underline underline-offset-2 py-1"
      >
        {labels.noSsn}
      </button>
    </div>
  );
};

export default SSNLookup;
