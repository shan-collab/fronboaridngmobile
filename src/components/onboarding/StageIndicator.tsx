import { Check } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface StageIndicatorProps {
  currentStage: number;
  completedStages: number[];
  onStageClick: (stage: number) => void;
}

const stageLabelKeys = ["stage_short_details", "stage_short_docs", "stage_short_bank", "stage_short_contract", "stage_short_benefits", "stage_short_declaration"];

const StageIndicator = ({ currentStage, completedStages, onStageClick }: StageIndicatorProps) => {
  const maxCompleted = Math.max(...completedStages, 0);
  const { t } = useLanguage();

  return (
    <div className="flex items-center w-full py-2">
      {stageLabelKeys.map((key, i) => {
        const stage = i + 1;
        const isComplete = completedStages.includes(stage);
        const isActive = currentStage === stage;
        const canNavigate = isComplete || stage <= maxCompleted + 1;

        return (
          <div key={stage} className="flex items-center flex-1 last:flex-initial">
            <div className="flex flex-col items-center gap-1">
              <button
                onClick={() => canNavigate && onStageClick(stage)}
                disabled={!canNavigate}
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold transition-all duration-300 ${
                  isComplete
                    ? "bg-emerald-400 text-white shadow-[0_0_8px_rgba(52,211,153,0.5)]"
                    : isActive
                    ? "bg-primary-foreground text-primary shadow-md ring-2 ring-primary-foreground/30 ring-offset-1 ring-offset-transparent"
                    : canNavigate
                    ? "bg-primary-foreground/25 text-primary-foreground/80"
                    : "bg-primary-foreground/10 text-primary-foreground/30"
                }`}
              >
                {isComplete ? <Check className="w-3 h-3" strokeWidth={3} /> : stage}
              </button>
              <span className={`text-[8px] font-medium leading-none ${
                isActive ? "text-primary-foreground" : isComplete ? "text-emerald-300" : "text-primary-foreground/40"
              }`}>
                {t(key)}
              </span>
            </div>
            {i < stageLabelKeys.length - 1 && (
              <div className={`flex-1 h-[2px] mx-1 -mt-3 rounded-full transition-all duration-500 ${
                completedStages.includes(stage) ? "bg-emerald-400/70" : "bg-primary-foreground/15"
              }`} />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default StageIndicator;
