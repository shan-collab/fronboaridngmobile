import { useNavigate } from "react-router-dom";
import { useOnboarding } from "@/context/OnboardingContext";
import { useLanguage } from "@/context/LanguageContext";
import HelpIcon from "@/components/onboarding/HelpIcon";
import StageIndicator from "@/components/onboarding/StageIndicator";
import StageOne from "@/components/onboarding/StageOne";
import StageTwo from "@/components/onboarding/StageTwo";
import StageThree from "@/components/onboarding/StageThree";
import StageFour from "@/components/onboarding/StageFour";
import StageFive from "@/components/onboarding/StageFive";
import StageSix from "@/components/onboarding/StageSix";
import ContractWelcomeBanner from "@/components/onboarding/ContractWelcomeBanner";

import { ArrowLeft, CheckCircle2, Mail, Clock } from "lucide-react";
import { useState } from "react";
import confetti from "@/lib/confetti";
import { Button } from "@/components/ui/button";

const stageHelpKeys = ["help_personal_info", "help_personal_info", "help_social_security", "help_job_info", "help_family", "help_additional_details"];
const stageNameKeys = ["stage_basic_details", "stage_documents", "stage_bank_details", "stage_contract", "stage_benefits", "stage_declaration"];

const Onboarding = () => {
  const navigate = useNavigate();
  const { data, currentStage, setCurrentStage, completedStages, completeStage, setOnboardingComplete } = useOnboarding();
  const { t } = useLanguage();
  const [showContractWelcome, setShowContractWelcome] = useState(false);
  const [showCompletionBanner, setShowCompletionBanner] = useState(false);
  const [showVerificationBanner, setShowVerificationBanner] = useState(false);

  const handleNext = (stage: number) => {
    completeStage(stage);
    // After completing stage 3 (Bank), show verification banner
    if (stage === 3) {
      setShowVerificationBanner(true);
      return;
    }
    if (stage === 4) {
      setCurrentStage(stage + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (stage < 6) {
      setCurrentStage(stage + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setOnboardingComplete(true);
      setShowCompletionBanner(true);
    }
  };

  const handleDismissVerification = () => {
    setShowVerificationBanner(false);
    setCurrentStage(4);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDismissContractWelcome = () => {
    setShowContractWelcome(false);
    setCurrentStage(6);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDismissCompletion = () => {
    setShowCompletionBanner(false);
    confetti();
    navigate("/dashboard");
  };

  if (showCompletionBanner) return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center px-6"
      style={{ background: "linear-gradient(135deg, hsl(217 72% 50%) 0%, hsl(217 72% 38%) 50%, hsl(250 60% 35%) 100%)" }}>
      <div className="relative z-10 text-center space-y-6 max-w-sm">
        <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-2xl font-black text-white">{t("onboarding_complete_title")} 🎉</h1>
        <p className="text-white/90 text-sm font-medium leading-relaxed">{t("onboarding_complete_desc")}</p>
        <p className="text-yellow-300 font-bold text-lg tracking-wide">{t("see_you_first_day")} 🧸</p>
        <Button onClick={handleDismissCompletion} className="h-10 px-8 rounded-xl bg-white text-primary font-bold shadow-lg hover:bg-white/90 gap-2 text-sm">
          {t("go_to_home_screen")}
        </Button>
      </div>
    </div>
  );

  // Verification banner after stages 1-3
  if (showVerificationBanner) return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 smyths-gradient">
      <div className="bg-card rounded-2xl shadow-2xl p-6 max-w-sm w-full space-y-5 text-center">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
          <Clock className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-lg font-bold text-card-foreground">{t("verification_submitted_title")}</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">{t("verification_submitted_desc")}</p>
        <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-xl border border-primary/10">
          <Mail className="w-5 h-5 text-primary shrink-0" />
          <p className="text-xs text-muted-foreground text-left">{t("verification_email_note")}</p>
        </div>
        <Button onClick={handleDismissVerification} className="w-full h-10 rounded-xl font-semibold text-sm">
          {t("continue_to_contract")}
        </Button>
      </div>
    </div>
  );
  
  if (showContractWelcome) return <ContractWelcomeBanner onContinue={handleDismissContractWelcome} />;

  return (
    <div className="min-h-screen flex flex-col smyths-gradient">
      {/* Compact header */}
      <div className="sticky top-0 z-10 smyths-gradient border-b border-primary-foreground/10">
          <div className="flex items-center gap-3 px-4 pt-2 pb-1">
          <button onClick={() => navigate("/dashboard")} className="w-7 h-7 rounded-full bg-primary-foreground/15 flex items-center justify-center">
            <ArrowLeft className="w-3.5 h-3.5 text-primary-foreground" />
          </button>
          <div className="flex-1">
            <h1 className="text-primary-foreground font-bold text-sm leading-tight">
              {t("onboarding_title")} — {t(stageNameKeys[currentStage - 1])}
            </h1>
          </div>
          <HelpIcon content={t(stageHelpKeys[currentStage - 1])} />
        </div>
        <div className="px-4 pb-1">
          <StageIndicator currentStage={currentStage} completedStages={completedStages} onStageClick={setCurrentStage} />
        </div>
      </div>

      {/* Full-width form area */}
      <div className="px-0 flex-1">
        <div className="bg-card rounded-none sm:rounded-2xl shadow-xl p-4 min-h-[calc(100vh-80px)]">
          {currentStage === 1 && <StageOne onNext={() => handleNext(1)} />}
          {currentStage === 2 && <StageTwo onNext={() => handleNext(2)} onBack={() => setCurrentStage(1)} />}
          {currentStage === 3 && <StageThree onNext={() => handleNext(3)} onBack={() => setCurrentStage(2)} />}
          {currentStage === 4 && <StageFour onNext={() => handleNext(4)} onBack={() => setCurrentStage(3)} />}
          {currentStage === 5 && <StageFive onComplete={() => handleNext(5)} onBack={() => setCurrentStage(4)} />}
          {currentStage === 6 && <StageSix onComplete={() => handleNext(6)} onBack={() => setCurrentStage(5)} />}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
