import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Mail } from "lucide-react";
import smythsLogo from "@/assets/smyths-logo.png";
import { useEffect, useState } from "react";
import confetti from "@/lib/confetti";
import { useLanguage } from "@/context/LanguageContext";

type BannerVariant = "contract" | "completion";

interface Props {
  onContinue: () => void;
  variant?: BannerVariant;
}

const ContractWelcomeBanner = ({ onContinue, variant = "contract" }: Props) => {
  const [show, setShow] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    setShow(true);
    confetti();
    const timer = setTimeout(() => confetti(), 1500);
    return () => clearTimeout(timer);
  }, []);

  const isCompletion = variant === "completion";

  return (
    <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center px-6 transition-all duration-700 ${show ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
      style={{ background: "linear-gradient(135deg, hsl(217 72% 50%) 0%, hsl(217 72% 38%) 50%, hsl(250 60% 35%) 100%)" }}>

      <div className="relative z-10 text-center space-y-6 max-w-sm">
        <img src={smythsLogo} alt="Smyths" className="w-24 h-24 mx-auto object-contain drop-shadow-2xl" />

        {isCompletion ? (
          <div className="space-y-4">
            <h1 className="text-2xl font-black text-white">
              {t("welcome_on_board")} 🎉
            </h1>
            <p className="text-white/90 text-sm font-medium leading-relaxed">
              {t("details_submitted")}
            </p>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <p className="text-white font-semibold text-sm">{t("pending_approval")}</p>
                  <p className="text-white/70 text-xs">{t("manager_review_note")}</p>
                </div>
              </div>
            </div>

            <p className="text-yellow-300 font-bold text-lg tracking-wide">{t("lets_make_amazing")} 🚀</p>
          </div>
        ) : (
          <div className="space-y-4">
            <h1 className="text-2xl font-black text-white">🎉 {t("thank_you")}</h1>
            <p className="text-white/90 text-base font-medium leading-relaxed">{t("contract_signed_success")}</p>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
              <p className="text-white/80 text-sm leading-relaxed">{t("manager_final_contract")}</p>
            </div>
            <p className="text-yellow-300 font-bold text-xl tracking-wide">{t("welcome_onboard")} 🧸</p>
          </div>
        )}

        <Button onClick={onContinue} className="h-10 px-8 rounded-xl bg-white text-primary font-bold shadow-lg hover:bg-white/90 gap-2 text-sm">
          {isCompletion ? t("go_to_home_screen") : t("continue_benefits")} <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default ContractWelcomeBanner;
