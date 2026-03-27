import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, ArrowRight, Globe } from "lucide-react";
import smythsLogo from "@/assets/smyths-logo.png";
import { useLanguage } from "@/context/LanguageContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Login = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const { lang, setLang, t } = useLanguage();

  return (
    <div className="min-h-screen smyths-gradient relative overflow-hidden flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-6 relative z-10">
        {/* Language Toggle */}
        <div className="absolute top-4 right-4">
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

        <img src={smythsLogo} alt="Smyths 360" className="w-16 h-16 object-contain mb-3 drop-shadow-2xl" />
        <div className="w-full max-w-xs bg-white rounded-2xl p-4 space-y-3 shadow-2xl">
          <div className="text-center">
            <h2 className="text-foreground text-base font-bold">{t("welcome_back_login")}</h2>
            <p className="text-muted-foreground text-[11px] mt-0.5">{t("sign_in")}</p>
          </div>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-3.5 h-3.5" />
            <Input
              type="email"
              placeholder="your.email@smythstoys.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="pl-8 bg-white border-border text-foreground placeholder:text-muted-foreground h-9 rounded-xl focus:border-primary text-xs"
            />
          </div>
          <Button
            onClick={() => navigate("/otp", { state: { email: email || "user@smythstoys.com" } })}
            className="w-full h-9 rounded-xl bg-accent text-accent-foreground font-bold text-xs shadow-lg hover:bg-accent/90 gap-2"
          >
            {t("request_otp")} <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
      <p className="text-center text-primary-foreground/40 text-[10px] pb-3">© 2026 Smyths Toys Superstores</p>
    </div>
  );
};

export default Login;
