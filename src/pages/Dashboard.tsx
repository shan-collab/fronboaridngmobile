import { useNavigate } from "react-router-dom";
import { ClipboardList, GraduationCap, ChevronRight, Sparkles, AlertCircle, CheckCircle2, Clock, Globe, FileSignature, Lock } from "lucide-react";
import { useOnboarding } from "@/context/OnboardingContext";
import { useLanguage } from "@/context/LanguageContext";
import smythsLogo from "@/assets/smyths-logo.png";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Menu } from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const { isOnboardingComplete, completedStages, data } = useOnboarding();
  const { lang, setLang, t } = useLanguage();
  const progress = Math.round((completedStages.length / 6) * 100);

  const hasPending = Object.values(data.stageApprovalStatus).some(s => s === "pending");
  const allApproved = isOnboardingComplete && Object.values(data.stageApprovalStatus).every(s => s === "approved" || s === "none");
  const needsResign = data.needsResign;

  const pendingContractCount = 7;

  return (
    <div className="min-h-screen smyths-gradient relative overflow-hidden">
      <div className="relative z-10 px-5 pt-4 pb-8">
        {/* Top bar: sidebar trigger left, language right */}
        <div className="flex items-center justify-between mb-5">
          <SidebarTrigger className="text-primary-foreground hover:bg-primary-foreground/10 h-8 w-8">
            <Menu className="w-5 h-5" />
          </SidebarTrigger>
          <Select value={lang} onValueChange={(v) => setLang(v as "en" | "fr")}>
            <SelectTrigger className="h-7 w-[110px] rounded-full bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground text-[11px] font-semibold gap-1">
              <Globe className="w-3 h-3" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="fr">Français</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Logo & Welcome */}
        <div className="flex items-center gap-3 mb-5">
          <img src={smythsLogo} alt="Smyths 360" className="w-11 h-11 object-contain drop-shadow-lg" />
          <div>
            <h1 className="text-primary-foreground text-base font-bold">{t("smyths_360")}</h1>
            <p className="text-primary-foreground/60 text-xs">{t("welcome_back")}, John 👋</p>
          </div>
        </div>

        {/* Menu Tiles */}
        <div className="space-y-2.5">
          {/* 1. Onboarding Tile - always first, always enabled */}
          <button
            onClick={() => navigate(isOnboardingComplete ? "/onboarding/view" : "/onboarding")}
            className="w-full bg-white rounded-2xl p-3.5 text-left shadow-lg hover:shadow-xl transition-all active:scale-[0.98] group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                {isOnboardingComplete ? (
                  <Sparkles className="w-5 h-5 text-primary" />
                ) : (
                  <ClipboardList className="w-5 h-5 text-primary" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-foreground text-sm font-bold">{t("onboarding")}</h3>
                  {needsResign && (
                    <Badge className="bg-amber-100 text-amber-700 border-amber-200 text-[9px] h-4 gap-0.5">
                      <AlertCircle className="w-2.5 h-2.5" /> {t("resign_required")}
                    </Badge>
                  )}
                  {hasPending && !needsResign && (
                    <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200 text-[9px] h-4 gap-0.5">
                      <Clock className="w-2.5 h-2.5" /> {t("pending_approval")}
                    </Badge>
                  )}
                  {allApproved && !hasPending && !needsResign && isOnboardingComplete && (
                    <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 text-[9px] h-4 gap-0.5">
                      <CheckCircle2 className="w-2.5 h-2.5" /> {t("approved")}
                    </Badge>
                  )}
                </div>
                {!isOnboardingComplete && (
                  <p className="text-[10px] text-muted-foreground mt-0.5">{t("complete_profile")}</p>
                )}
                {isOnboardingComplete && (
                  <p className="text-[10px] text-muted-foreground mt-0.5">{t("completed_view")}</p>
                )}
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            {!isOnboardingComplete && progress > 0 && (
              <div className="mt-2 ml-13">
                <div className="flex justify-between text-[10px] text-muted-foreground mb-0.5">
                  <span>{t("progress")}</span><span>{progress}%</span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${progress}%` }} />
                </div>
              </div>
            )}
          </button>

          {/* 2. Contract (Manager only) - disabled until onboarding complete */}
          <button
            onClick={() => isOnboardingComplete ? navigate("/contracts") : undefined}
            className={`w-full bg-white rounded-2xl p-3.5 text-left shadow-lg transition-all group ${
              !isOnboardingComplete ? "opacity-50 cursor-not-allowed" : "hover:shadow-xl active:scale-[0.98]"
            }`}
            disabled={!isOnboardingComplete}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <FileSignature className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-foreground text-sm font-bold">{t("sidebar_contracts_manager")}</h3>
                  {isOnboardingComplete && (
                    <Badge className="bg-destructive/10 text-destructive border-destructive/20 text-[9px] h-4">{pendingContractCount}</Badge>
                  )}
                </div>
                {!isOnboardingComplete && (
                  <div className="flex items-center gap-1 mt-0.5">
                    <Lock className="w-2.5 h-2.5 text-muted-foreground" />
                    <p className="text-[10px] text-muted-foreground">{t("locked_msg")}</p>
                  </div>
                )}
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
          </button>

          {/* 3. Learning - disabled until onboarding complete */}
          <button
            onClick={() => isOnboardingComplete ? undefined : undefined}
            className={`w-full bg-white rounded-2xl p-3.5 text-left shadow-lg transition-all group ${
              !isOnboardingComplete ? "opacity-50 cursor-not-allowed" : "hover:shadow-xl active:scale-[0.98]"
            }`}
            disabled={!isOnboardingComplete}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <GraduationCap className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-foreground text-sm font-bold">{t("learning")}</h3>
                {!isOnboardingComplete && (
                  <div className="flex items-center gap-1 mt-0.5">
                    <Lock className="w-2.5 h-2.5 text-muted-foreground" />
                    <p className="text-[10px] text-muted-foreground">{t("locked_msg")}</p>
                  </div>
                )}
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
