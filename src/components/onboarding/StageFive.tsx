import { useOnboarding } from "@/context/OnboardingContext";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, Heart, UtensilsCrossed, Plus, Trash2, Download, ExternalLink, FileText, CheckCircle2, Shield } from "lucide-react";
import MultiFileUpload from "./MultiFileUpload";
import PDFViewerDialog from "./PDFViewerDialog";
import HelpIcon from "./HelpIcon";
import { useState, useMemo, useEffect } from "react";

interface StageFiveProps { onComplete: () => void; onBack: () => void; }

const DocFileLink = ({ title }: { title: string }) => {
  const { t } = useLanguage();
  return (
    <div className="flex items-center justify-between py-1.5">
      <PDFViewerDialog
        title={title}
        trigger={
          <button className="text-xs text-primary underline hover:text-primary/80 text-left font-medium flex items-center gap-1.5">
            <ExternalLink className="w-3 h-3 shrink-0" />
            {title}
          </button>
        }
        showDownload
      />
    </div>
  );
};

const StageFive = ({ onComplete, onBack }: StageFiveProps) => {
  const { data, updateData } = useOnboarding();
  const { t } = useLanguage();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleUpdate = (updates: Partial<typeof data>) => {
    updateData(updates);
    if (Object.keys(errors).length > 0) setErrors({});
  };

  useEffect(() => {
    if (data.coverageType === "family" && data.dependentChildren.length > 0 && data.dependents.length === 0) {
      const autoPopulated = data.dependentChildren.map(child => ({
        name: child.fullName,
        relationship: "Child",
        dob: child.dateOfBirth,
      }));
      handleUpdate({ dependents: autoPopulated });
    }
  }, [data.coverageType]); // eslint-disable-line react-hooks/exhaustive-deps

  const needsCmuDate = data.insuranceExemptionReason === "exemption_cmu_acs";
  const needsIndividualDate = data.insuranceExemptionReason === "exemption_new_hire";

  const isValid = useMemo(() => {
    if (!data.enrollHealthInsurance || !data.enrollRestaurantTicket) return false;
    if (data.enrollHealthInsurance === "yes") {
      if (!data.coverageType) return false;
    }
    if (data.enrollHealthInsurance === "no") {
      if (!data.insuranceExemptionReason || data.insuranceExemptionProof.length === 0) return false;
      if (needsCmuDate && !data.cmuEndDate) return false;
      if (needsIndividualDate && !data.individualContractEndDate) return false;
    }
    return true;
  }, [data, needsCmuDate, needsIndividualDate]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!data.enrollHealthInsurance) e.health = t("required");
    if (data.enrollHealthInsurance === "yes" && !data.coverageType) e.coverage = t("required");
    if (data.enrollHealthInsurance === "no" && !data.insuranceExemptionReason) e.reason = t("required");
    if (data.enrollHealthInsurance === "no" && data.insuranceExemptionProof.length === 0) e.proof = t("required");
    if (!data.enrollRestaurantTicket) e.restaurant = t("required");
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const addDependent = () => handleUpdate({ dependents: [...data.dependents, { name: "", relationship: "", dob: undefined }] });
  const updateDependent = (idx: number, field: string, value: any) => {
    const deps = [...data.dependents];
    deps[idx] = { ...deps[idx], [field]: value };
    handleUpdate({ dependents: deps });
  };
  const removeDependent = (idx: number) => handleUpdate({ dependents: data.dependents.filter((_, i) => i !== idx) });

  const exemptionReasons = [
    { value: "exemption_cdd_less_12", key: "exemption_cdd_less_12" },
    { value: "exemption_cdd_more_12", key: "exemption_cdd_more_12" },
    { value: "exemption_spouse_covered", key: "exemption_spouse_covered" },
    { value: "exemption_other_employer", key: "exemption_other_employer" },
    { value: "exemption_cmu_acs", key: "exemption_cmu_acs" },
    { value: "exemption_new_hire", key: "exemption_new_hire" },
    { value: "exemption_part_time", key: "exemption_part_time" },
    { value: "exemption_enim_sncf", key: "exemption_enim_sncf" },
    { value: "exemption_couple_same_company", key: "exemption_couple_same_company" },
  ];

  return (
    <div className="space-y-5">
      {/* ============ HEALTH INSURANCE ============ */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center"><Heart className="w-3.5 h-3.5 text-primary" /></div>
          <h3 className="font-semibold text-sm text-card-foreground">{t("health_insurance")}</h3>
          <HelpIcon content={t("help_health_insurance")} />
        </div>

        {/* Reference documents - compact */}
        <div className="border border-border rounded-lg bg-muted/20 p-2.5 space-y-0.5">
          <p className="text-[10px] font-medium text-muted-foreground mb-1">{t("reference_documents")}</p>
          <DocFileLink title={t("practical_guide")} />
          <DocFileLink title={t("membership_terms")} />
          <DocFileLink title={t("employee_contact_verspieren")} />
        </div>

        {/* Enrollment question - card style */}
        <div className="bg-card border border-border rounded-xl p-3 space-y-3">
          <div className="space-y-1">
            <Label className="text-xs font-medium">{t("enroll_health")} <span className="text-destructive">*</span></Label>
            <RadioGroup value={data.enrollHealthInsurance} onValueChange={v => handleUpdate({ enrollHealthInsurance: v })} className="flex gap-4 pt-1">
              <label className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-lg cursor-pointer transition-all text-xs", data.enrollHealthInsurance === "yes" ? "text-primary font-semibold" : "text-muted-foreground")}>
                <RadioGroupItem value="yes" id="hi-yes" className="h-3.5 w-3.5" />
                <span>{t("yes")}</span>
              </label>
              <label className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-lg cursor-pointer transition-all text-xs", data.enrollHealthInsurance === "no" ? "text-primary font-semibold" : "text-muted-foreground")}>
                <RadioGroupItem value="no" id="hi-no" className="h-3.5 w-3.5" />
                <span>{t("no")}</span>
              </label>
            </RadioGroup>
            {errors.health && <p className="text-[11px] text-destructive">{errors.health}</p>}
          </div>

          {/* YES path */}
          {data.enrollHealthInsurance === "yes" && (
            <div className="space-y-3 pt-1 border-t border-border">
              <div className="space-y-1 pt-2">
                <Label className="text-xs font-medium">{t("coverage_type")} <span className="text-destructive">*</span></Label>
                <RadioGroup value={data.coverageType} onValueChange={v => handleUpdate({ coverageType: v })} className="flex gap-4 pt-1">
                  <label className={cn("flex items-center gap-2 px-3 py-1.5 rounded-lg border cursor-pointer text-xs transition-all", data.coverageType === "individual" ? "border-primary bg-primary/5" : "border-border")}>
                    <RadioGroupItem value="individual" id="cov-ind" />
                    {t("individual")}
                  </label>
                  <label className={cn("flex items-center gap-2 px-3 py-1.5 rounded-lg border cursor-pointer text-xs transition-all", data.coverageType === "family" ? "border-primary bg-primary/5" : "border-border")}>
                    <RadioGroupItem value="family" id="cov-fam" />
                    {t("family")}
                  </label>
                </RadioGroup>
                {errors.coverage && <p className="text-[11px] text-destructive">{errors.coverage}</p>}
              </div>

              {data.coverageType === "family" && (
                <div className="space-y-2">
                  {data.dependentChildren.length > 0 && data.dependents.length > 0 && (
                    <div className="flex items-center gap-1.5 p-2 bg-blue-50 rounded-lg border border-blue-200">
                      <FileText className="w-3.5 h-3.5 text-blue-500" />
                      <span className="text-[10px] font-medium text-blue-700">{t("dependent_details_auto")}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-medium">{t("dependents")}</Label>
                    <Button variant="outline" size="sm" onClick={addDependent} className="gap-1 h-7 text-[10px]"><Plus className="w-3 h-3" /> {t("add")}</Button>
                  </div>
                  {data.dependents.map((dep, idx) => (
                    <div key={idx} className="bg-muted/20 rounded-lg p-2.5 space-y-2 border border-border/50">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-medium text-muted-foreground">{t("dependents")} {idx + 1}</span>
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeDependent(idx)}><Trash2 className="w-3 h-3" /></Button>
                      </div>
                      <Input placeholder={t("full_name")} value={dep.name} onChange={e => updateDependent(idx, "name", e.target.value)} className="h-8 text-xs" />
                      <Select value={dep.relationship} onValueChange={v => updateDependent(idx, "relationship", v)}>
                        <SelectTrigger className="h-8 text-xs"><SelectValue placeholder={t("relationship")} /></SelectTrigger>
                        <SelectContent>
                          {[{ value: "Spouse", key: "spouse" }, { value: "Child", key: "child" }, { value: "Other", key: "other" }].map(r =>
                            <SelectItem key={r.value} value={r.value}>{t(r.key)}</SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className={cn("w-full justify-start h-8 text-xs", !dep.dob && "text-muted-foreground")}>
                            <CalendarIcon className="mr-1.5 h-3 w-3" />
                            {dep.dob ? format(dep.dob, "dd/MM/yyyy") : t("date_of_birth")}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar mode="single" selected={dep.dob} onSelect={d => updateDependent(idx, "dob", d)} className="p-3 pointer-events-auto" />
                        </PopoverContent>
                      </Popover>
                    </div>
                  ))}
                </div>
              )}

              {/* Enrollment summary */}
              {data.coverageType && (
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    <span className="text-xs font-semibold text-card-foreground">{t("insurance_enrollment_form")}</span>
                  </div>
                  <div className="text-xs space-y-1 pl-6">
                    <div className="flex justify-between"><span className="text-muted-foreground">{t("employee")}</span><span className="font-medium text-card-foreground">{data.firstName} {data.lastName}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">{t("coverage_type")}</span><span className="font-medium text-card-foreground capitalize">{t(data.coverageType)}</span></div>
                    {data.dependents.length > 0 && <div className="flex justify-between"><span className="text-muted-foreground">{t("dependents")}</span><span className="font-medium text-card-foreground">{data.dependents.length}</span></div>}
                  </div>
                  <Button variant="outline" size="sm" className="w-full gap-1 h-7 text-[10px] border-primary/30 text-primary hover:bg-primary/10"><Download className="w-3 h-3" /> {t("download_enrollment_pdf")}</Button>
                </div>
              )}
            </div>
          )}

          {/* NO path */}
          {data.enrollHealthInsurance === "no" && (
            <div className="space-y-3 pt-1 border-t border-border">
              <div className="space-y-1 pt-2">
                <Label className="text-xs font-medium">{t("exemption_reason")} <span className="text-destructive">*</span></Label>
                <Select value={data.insuranceExemptionReason} onValueChange={v => handleUpdate({ insuranceExemptionReason: v })}>
                  <SelectTrigger className={cn("h-auto min-h-[36px] text-xs", errors.reason && "border-destructive")}>
                    <SelectValue placeholder={t("select")} />
                  </SelectTrigger>
                  <SelectContent className="max-w-[calc(100vw-2rem)]">
                    {exemptionReasons.map(r => (
                      <SelectItem key={r.value} value={r.value} className="text-xs whitespace-normal">
                        {t(r.key)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.reason && <p className="text-[11px] text-destructive">{errors.reason}</p>}
              </div>

              {needsCmuDate && (
                <div className="space-y-1">
                  <Label className="text-xs">{t("cmu_end_date")} <span className="text-destructive">*</span></Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className={cn("w-full justify-start h-8 text-xs", !data.cmuEndDate && "text-muted-foreground")}>
                        <CalendarIcon className="mr-1.5 h-3 w-3" />
                        {data.cmuEndDate ? format(data.cmuEndDate, "dd/MM/yyyy") : t("select_date")}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={data.cmuEndDate} onSelect={d => handleUpdate({ cmuEndDate: d })} className="p-3 pointer-events-auto" />
                    </PopoverContent>
                  </Popover>
                </div>
              )}

              {needsIndividualDate && (
                <div className="space-y-1">
                  <Label className="text-xs">{t("individual_contract_end_date")} <span className="text-destructive">*</span></Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className={cn("w-full justify-start h-8 text-xs", !data.individualContractEndDate && "text-muted-foreground")}>
                        <CalendarIcon className="mr-1.5 h-3 w-3" />
                        {data.individualContractEndDate ? format(data.individualContractEndDate, "dd/MM/yyyy") : t("select_date")}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={data.individualContractEndDate} onSelect={d => handleUpdate({ individualContractEndDate: d })} className="p-3 pointer-events-auto" />
                    </PopoverContent>
                  </Popover>
                </div>
              )}

              <MultiFileUpload label={t("upload_exemption_proof")} files={data.insuranceExemptionProof} onFilesChange={f => handleUpdate({ insuranceExemptionProof: f })} error={errors.proof} />
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-border" />

      {/* ============ LUNCH TICKET ============ */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center"><UtensilsCrossed className="w-3.5 h-3.5 text-primary" /></div>
          <h3 className="font-semibold text-sm text-card-foreground">{t("lunch_ticket")}</h3>
          <HelpIcon content={t("help_lunch_ticket")} />
        </div>

        <div className="bg-card border border-border rounded-xl p-3 space-y-3">
          <div className="space-y-1">
            <Label className="text-xs font-medium">{t("enroll_lunch_ticket")} <span className="text-destructive">*</span></Label>
            <RadioGroup value={data.enrollRestaurantTicket} onValueChange={v => {
              handleUpdate({ enrollRestaurantTicket: v, lunchTicketFormGenerated: v === "yes" });
            }} className="flex gap-4 pt-1">
              <label className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-lg cursor-pointer transition-all text-xs", data.enrollRestaurantTicket === "yes" ? "text-primary font-semibold" : "text-muted-foreground")}>
                <RadioGroupItem value="yes" id="rt-yes" className="h-3.5 w-3.5" />
                <span>{t("yes")}</span>
              </label>
              <label className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-lg cursor-pointer transition-all text-xs", data.enrollRestaurantTicket === "no" ? "text-primary font-semibold" : "text-muted-foreground")}>
                <RadioGroupItem value="no" id="rt-no" className="h-3.5 w-3.5" />
                <span>{t("no")}</span>
              </label>
            </RadioGroup>
            {errors.restaurant && <p className="text-[11px] text-destructive">{errors.restaurant}</p>}
          </div>

          {data.enrollRestaurantTicket === "yes" && (
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                <span className="text-xs font-semibold text-card-foreground">{t("lunch_ticket_form")}</span>
              </div>
              <div className="text-xs space-y-1 pl-6">
                <div className="flex justify-between"><span className="text-muted-foreground">{t("employee")}</span><span className="font-medium text-card-foreground">{data.firstName} {data.lastName}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">{t("contract_type")}</span><span className="font-medium text-card-foreground">{data.contractType}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">{t("location")}</span><span className="font-medium text-card-foreground">{data.storeLocation}</span></div>
              </div>
              <Button variant="outline" size="sm" className="w-full gap-1 h-7 text-[10px] border-primary/30 text-primary hover:bg-primary/10"><Download className="w-3 h-3" /> {t("download_lunch_ticket_pdf")}</Button>
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-2">
        <Button variant="outline" onClick={onBack} className="flex-1 h-9 rounded-lg text-xs">{t("back")}</Button>
        <Button onClick={() => validate() && onComplete()} disabled={!isValid} className="flex-1 h-9 rounded-lg text-xs font-semibold bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-40">
          {t("save_continue")}
        </Button>
      </div>
    </div>
  );
};

export default StageFive;
