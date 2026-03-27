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

import { ArrowLeft, HelpCircle } from "lucide-react";
import { useState } from "react";
import confetti from "@/lib/confetti";

const stageHelpKeys = ["help_personal_info", "help_personal_info", "help_social_security", "help_job_info", "help_family", "help_additional_details"];
const stageNameKeys = ["stage_basic_details", "stage_documents", "stage_bank_details", "stage_contract", "stage_benefits", "stage_declaration"];

const Onboarding = () => {
  const navigate = useNavigate();
  const { data, currentStage, setCurrentStage, completedStages, completeStage, setOnboardingComplete } = useOnboarding();
  const { t } = useLanguage();
  const [showContractWelcome, setShowContractWelcome] = useState(false);
  const [showCompletionBanner, setShowCompletionBanner] = useState(false);
  // Stage 2 banner removed - welcome banner now shows after contract signing only
  

  const handleNext = (stage: number) => {
    completeStage(stage);
    if (stage === 4) {
      // No welcome banner after contract sign - proceed directly
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

  if (showCompletionBanner) return <ContractWelcomeBanner variant="completion" onContinue={handleDismissCompletion} />;
  
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
