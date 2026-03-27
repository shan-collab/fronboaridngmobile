import { Button } from "@/components/ui/button";
import { ArrowRight, CalendarDays, GraduationCap, Sparkles } from "lucide-react";
import smythsLogo from "@/assets/smyths-logo.png";
import { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { format } from "date-fns";

interface Props {
  startDate?: Date;
  onContinue: () => void;
}

const StageTwoBanner = ({ startDate, onContinue }: Props) => {
  const [show, setShow] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    setShow(true);
  }, []);

  const joiningDate = startDate ? format(startDate, "dd MMMM yyyy") : "";

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center px-6 transition-all duration-700 ${show ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
      style={{ background: "linear-gradient(135deg, hsl(217 72% 50%) 0%, hsl(217 72% 38%) 50%, hsl(250 60% 35%) 100%)" }}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full opacity-10"
            style={{
              width: Math.random() * 80 + 20,
              height: Math.random() * 80 + 20,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: `hsl(${Math.random() * 60 + 200} 80% 70%)`,
              animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 text-center space-y-5 max-w-sm">
        <div className="flex justify-center gap-3 mb-2">
          <CalendarDays className="w-6 h-6 text-yellow-300 animate-pulse" />
          <Sparkles className="w-8 h-8 text-yellow-300 animate-bounce" />
          <GraduationCap className="w-6 h-6 text-yellow-300 animate-pulse" style={{ animationDelay: "0.5s" }} />
        </div>

        <img src={smythsLogo} alt="Smyths" className="w-24 h-24 mx-auto object-contain drop-shadow-2xl" />

        <div>
          <h1 className="text-2xl font-black text-white mb-2">👋 {t("stage2_banner_title")}</h1>
          <p className="text-white/90 text-base font-medium leading-relaxed">{t("stage2_banner_subtitle")}</p>

          <div className="mt-4 bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 space-y-3">
            <div className="flex items-center justify-center gap-2">
              <CalendarDays className="w-5 h-5 text-yellow-300" />
              <p className="text-white font-bold text-base">
                {t("stage2_see_you_on")} {joiningDate}
              </p>
            </div>
            <p className="text-white/80 text-sm leading-relaxed">{t("stage2_keep_in_touch")}</p>
            <div className="border-t border-white/15 pt-3">
              <div className="flex items-center justify-center gap-2">
                <GraduationCap className="w-5 h-5 text-yellow-300" />
                <p className="text-yellow-300 font-semibold text-sm">{t("stage2_learning_cta")}</p>
              </div>
              <p className="text-white/70 text-xs mt-1">{t("stage2_learning_desc")}</p>
            </div>
          </div>
        </div>

        <Button onClick={onContinue} className="h-10 px-8 rounded-xl bg-white text-primary font-bold shadow-lg hover:bg-white/90 gap-2 text-sm">
          {t("stage2_continue_btn")} <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default StageTwoBanner;
