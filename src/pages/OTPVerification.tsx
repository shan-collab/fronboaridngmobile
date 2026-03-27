import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { ArrowRight, RotateCcw } from "lucide-react";
import smythsLogo from "@/assets/smyths-logo.png";
import { useLanguage } from "@/context/LanguageContext";

const OTPVerification = () => {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const email = (location.state as any)?.email || "user@smythstoys.com";
  const { t } = useLanguage();

  return (
    <div className="min-h-screen smyths-gradient relative overflow-hidden flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-6 relative z-10">
        <img src={smythsLogo} alt="Smyths 360" className="w-14 h-14 object-contain mb-3 drop-shadow-2xl" />
        <div className="w-full max-w-xs bg-white rounded-2xl p-4 space-y-3 shadow-2xl">
          <div className="text-center">
            <h2 className="text-foreground text-base font-bold">{t("verify_email")}</h2>
            <p className="text-muted-foreground text-[11px] mt-0.5">
              {t("code_sent")}<br />
              <span className="font-semibold text-foreground text-xs">{email}</span>
            </p>
          </div>
          <div className="flex justify-center">
            <InputOTP maxLength={4} value={otp} onChange={setOtp}>
              <InputOTPGroup className="gap-2">
                {[0, 1, 2, 3].map(i => (
                  <InputOTPSlot
                    key={i}
                    index={i}
                    className="w-11 h-11 rounded-xl bg-white border-2 border-border text-foreground text-lg font-bold focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/30"
                  />
                ))}
              </InputOTPGroup>
            </InputOTP>
          </div>
          <Button
            onClick={() => otp.length === 4 && navigate("/dashboard")}
            disabled={otp.length < 4}
            className="w-full h-9 rounded-xl bg-accent text-accent-foreground font-bold text-xs shadow-lg hover:bg-accent/90 disabled:opacity-40 gap-2"
          >
            {t("verify_continue")} <ArrowRight className="w-3.5 h-3.5" />
          </Button>
          <button className="w-full flex items-center justify-center gap-1.5 text-muted-foreground text-[11px] hover:text-foreground transition-colors">
            <RotateCcw className="w-3 h-3" /> {t("resend_code")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;
