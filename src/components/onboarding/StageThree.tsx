import { useOnboarding } from "@/context/OnboardingContext";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Landmark, Shield, CheckCircle2 } from "lucide-react";
import MultiFileUpload from "./MultiFileUpload";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";

interface StageThreeProps { onNext: () => void; onBack: () => void; }

const StageThree = ({ onNext, onBack }: StageThreeProps) => {
  const { data, updateData } = useOnboarding();
  const { t } = useLanguage();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleUpdate = (updates: Partial<typeof data>) => {
    updateData(updates);
    if (Object.keys(errors).length > 0) setErrors({});
  };

  const isValid = useMemo(() => {
    return !!(data.ibanCountryCode && data.ibanCheckDigits && data.ibanBBAN && data.bic && data.accountHoldingBranch && data.ribDocument.length > 0);
  }, [data.ibanCountryCode, data.ibanCheckDigits, data.ibanBBAN, data.bic, data.accountHoldingBranch, data.ribDocument]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!data.ibanCountryCode) e.ibanCountryCode = t("required");
    if (!data.ibanCheckDigits) e.ibanCheckDigits = t("required");
    if (!data.ibanBBAN) e.ibanBBAN = t("required");
    if (!data.bic) e.bic = t("required");
    if (!data.accountHoldingBranch) e.accountHoldingBranch = t("required");
    if (data.ribDocument.length === 0) e.ribDocument = t("required");
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const showBankVerification = data.ribDocument.length > 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center"><Landmark className="w-3.5 h-3.5 text-primary" /></div>
        <h3 className="font-semibold text-sm text-card-foreground">{t("bank_info")}</h3>
      </div>

      {/* IBAN in 3 boxes */}
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">{t("iban")} <span className="text-destructive">*</span></Label>
        <div className="grid grid-cols-3 gap-2">
          <div className="space-y-1">
            <Label className="text-[10px] text-muted-foreground">{t("iban_country_code")}</Label>
            <Input 
              value={data.ibanCountryCode} 
              onChange={e => handleUpdate({ ibanCountryCode: e.target.value.toUpperCase().slice(0, 2) })} 
              placeholder="FR" 
              maxLength={2}
              className={cn("h-8 text-xs text-center uppercase", errors.ibanCountryCode && "border-destructive")} 
            />
          </div>
          <div className="space-y-1">
            <Label className="text-[10px] text-muted-foreground">{t("iban_check_digits")}</Label>
            <Input 
              value={data.ibanCheckDigits} 
              onChange={e => handleUpdate({ ibanCheckDigits: e.target.value.replace(/\D/g, "").slice(0, 2) })} 
              placeholder="76" 
              maxLength={2}
              className={cn("h-8 text-xs text-center", errors.ibanCheckDigits && "border-destructive")} 
            />
          </div>
          <div className="space-y-1">
            <Label className="text-[10px] text-muted-foreground">{t("iban_bban")}</Label>
            <Input 
              value={data.ibanBBAN} 
              onChange={e => handleUpdate({ ibanBBAN: e.target.value.toUpperCase() })} 
              placeholder="XXXX XXXX XXXX" 
              className={cn("h-8 text-xs", errors.ibanBBAN && "border-destructive")} 
            />
          </div>
        </div>
        <p className="text-[10px] text-muted-foreground">{t("iban_hint")}</p>
      </div>

      {/* BIC */}
      <div className="space-y-1">
        <Label className="text-xs text-muted-foreground">{t("bic_code")} <span className="text-destructive">*</span></Label>
        <Input 
          value={data.bic} 
          onChange={e => handleUpdate({ bic: e.target.value.toUpperCase() })} 
          placeholder="e.g. BNPAFRPP" 
          className={cn("h-8 text-xs uppercase", errors.bic && "border-destructive")} 
        />
      </div>

      {/* Account Holding Branch */}
      <div className="space-y-1">
        <Label className="text-xs text-muted-foreground">{t("account_holding_branch")} <span className="text-destructive">*</span></Label>
        <Input 
          value={data.accountHoldingBranch} 
          onChange={e => handleUpdate({ accountHoldingBranch: e.target.value })} 
          placeholder={t("enter_branch_name")} 
          className={cn("h-8 text-xs", errors.accountHoldingBranch && "border-destructive")} 
        />
      </div>

      {/* RIB Document - Mandatory */}
      <MultiFileUpload label={`${t("rib_document")} *`} files={data.ribDocument} onFilesChange={f => handleUpdate({ ribDocument: f })} hint={t("upload_rib")} error={errors.ribDocument} />

      {/* Bank Verification - hardcoded green tick after upload */}
      {showBankVerification && (
        <div className="space-y-2 p-3 bg-emerald-50 rounded-xl border border-emerald-200">
          <p className="text-[10px] font-medium text-emerald-700 mb-2">{t("bank_verification_note")}</p>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span className="text-xs font-medium text-emerald-700">{t("iban_matched")}</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span className="text-xs font-medium text-emerald-700">{t("account_holder_matched")}</span>
          </div>
        </div>
      )}

      <div className="flex items-start gap-2 p-2.5 bg-primary/5 rounded-lg border border-primary/10">
        <Shield className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
        <p className="text-[10px] text-muted-foreground leading-relaxed">{t("bank_security_note")}</p>
      </div>

      <div className="flex gap-2">
        <Button variant="outline" onClick={onBack} className="flex-1 h-9 rounded-lg text-xs">{t("back")}</Button>
        <Button onClick={() => validate() && onNext()} disabled={!isValid} className="flex-1 h-9 rounded-lg text-xs font-semibold disabled:opacity-40">{t("save_continue")}</Button>
      </div>
    </div>
  );
};

export default StageThree;
