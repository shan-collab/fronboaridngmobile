import { useOnboarding } from "@/context/OnboardingContext";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, FileText, Shield, CreditCard, AlertCircle, Sparkles } from "lucide-react";
import MultiFileUpload from "./MultiFileUpload";
import { useState, useMemo, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import idFrontSample from "@/assets/id-front-sample.png";
import idBackSample from "@/assets/id-back-sample.png";
import passportFrontSample from "@/assets/passport-front-sample.png";
import passportBackSample from "@/assets/passport-back-sample.png";

interface StageTwoProps { onNext: () => void; onBack: () => void; }

const IDSampleGuide = ({ type }: { type: string }) => {
  const { t } = useLanguage();
  const slides = type === "national_id"
    ? [{ src: idFrontSample, alt: "ID Front", label: t("front_side") }, { src: idBackSample, alt: "ID Back", label: t("back_side") }]
    : [{ src: passportFrontSample, alt: "Passport Front", label: t("photo_page") }, { src: passportBackSample, alt: "Passport Back", label: t("back_side") }];

  return (
    <div className="space-y-2 mb-3">
      <p className="text-[10px] text-muted-foreground font-medium">📋 {t("sample_doc_hint")}</p>
      <Carousel className="w-full" opts={{ loop: true }}>
        <CarouselContent>
          {slides.map((slide, i) => (
            <CarouselItem key={i}>
              <div className="border border-border rounded-xl overflow-hidden shadow-sm mx-1">
                <img src={slide.src} alt={slide.alt} className="w-full h-auto object-contain" />
                <p className="text-[10px] text-center text-muted-foreground py-1.5 bg-muted/30 font-medium">{slide.label}</p>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {slides.length > 1 && (
          <>
            <CarouselPrevious className="left-1 h-7 w-7 bg-background/80 backdrop-blur-sm" />
            <CarouselNext className="right-1 h-7 w-7 bg-background/80 backdrop-blur-sm" />
          </>
        )}
      </Carousel>
      {slides.length > 1 && <p className="text-[9px] text-muted-foreground text-center">◀ {t("slide_hint")} ▶</p>}
      <p className="text-[9px] text-muted-foreground">💡 {t("no_blur_hint")}</p>
    </div>
  );
};

const Field = ({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) => (
  <div className="space-y-1">
    <Label className="text-xs text-muted-foreground">{label}{required && <span className="text-destructive ml-0.5">*</span>}</Label>
    {children}
  </div>
);

const StageTwo = ({ onNext, onBack }: StageTwoProps) => {
  const { data, updateData } = useOnboarding();
  const { t } = useLanguage();
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Auto-carry document from Quick Fill in Stage 1
  useEffect(() => {
    if (data.quickFillDocType && data.quickFillDoc.length > 0 && !data.identityDocType) {
      updateData({
        identityDocType: data.quickFillDocType,
        identityDoc: data.quickFillDoc,
        identityUploadMethod: "upload",
      });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleUpdate = (updates: Partial<typeof data>) => {
    updateData(updates);
    if (Object.keys(errors).length > 0) setErrors({});
  };

  const isForeignWorker = data.isForeignWorker === "yes";

  const isValid = useMemo(() => {
    const hasIdentity = data.identityDocType && (
      (data.identityUploadMethod === "upload" && data.identityDocFront.length > 0 && data.identityDocBack.length > 0) ||
      (data.identityUploadMethod === "manual" && data.identityDocNumber && data.identityDocExpiry && data.identityDocCountry)
    );
    // Manual entry is always mandatory
    const hasManualEntry = data.identityDocNumber && data.identityDocExpiry && data.identityDocCountry;
    const hasCriminal = data.criminalRecord.length > 0;
    const hasForeignWorkerAnswer = !!data.isForeignWorker;
    return !!(hasIdentity && hasManualEntry && hasCriminal && hasForeignWorkerAnswer);
  }, [data]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!data.identityDocType) e.identityDocType = t("required");
    if (data.identityUploadMethod === "upload") {
      if (data.identityDocFront.length === 0) e.identityDocFront = t("required");
      if (data.identityDocBack.length === 0) e.identityDocBack = t("required");
    }
    if (!data.identityDocNumber) e.identityDocNumber = t("required");
    if (!data.identityDocExpiry) e.identityDocExpiry = t("required");
    if (!data.identityDocCountry) e.identityDocCountry = t("required");
    if (data.criminalRecord.length === 0) e.criminalRecord = t("required");
    if (!data.isForeignWorker) e.isForeignWorker = t("required");
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const countryOptions = [
    { value: "France", key: "france" }, { value: "Germany", key: "germany" },
    { value: "UK", key: "uk" }, { value: "Spain", key: "spain" },
    { value: "Italy", key: "italy" }, { value: "Other", key: "other" },
  ];

  const hasCarriedOver = data.quickFillDocType && data.quickFillDoc.length > 0;

  return (
    <div className="space-y-4">
      {/* Carried over notice */}
      {hasCarriedOver && (
        <div className="flex items-center gap-1.5 p-2 bg-emerald-50 rounded-lg border border-emerald-200">
          <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
          <span className="text-[10px] font-medium text-emerald-700">{t("doc_carried_over")}</span>
        </div>
      )}

      {/* Identity Proof */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center"><CreditCard className="w-3.5 h-3.5 text-primary" /></div>
          <h3 className="font-semibold text-sm text-card-foreground">{t("identity_proof")}</h3>
        </div>

        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">{t("doc_type")} <span className="text-destructive">*</span></Label>
          <Select value={data.identityDocType} onValueChange={v => handleUpdate({ identityDocType: v })}>
            <SelectTrigger className={cn("h-9 text-xs", errors.identityDocType && !data.identityDocType && "border-destructive")}><SelectValue placeholder={t("select")} /></SelectTrigger>
            <SelectContent>
              <SelectItem value="national_id">{t("national_id")}</SelectItem>
              <SelectItem value="passport">{t("passport")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {data.identityDocType && <IDSampleGuide type={data.identityDocType} />}

        {/* Upload and Manual Entry - both shown by default */}
        {data.identityDocType && (
          <div className="space-y-3">
            {/* Front and Back uploads - compact inline */}
            <div className="grid grid-cols-2 gap-2">
              <MultiFileUpload label={t("front_image")} files={data.identityDocFront} onFilesChange={f => handleUpdate({ identityDocFront: f })} hint={t("upload_front_hint")} error={errors.identityDocFront} compact />
              <MultiFileUpload label={t("back_image")} files={data.identityDocBack} onFilesChange={f => handleUpdate({ identityDocBack: f })} hint={t("upload_back_hint")} error={errors.identityDocBack} compact />
            </div>

            {/* Manual entry fields - always visible and mandatory */}
            <div className="border border-border rounded-xl bg-card p-3 space-y-2">
              <p className="text-[10px] font-semibold text-card-foreground">{t("manual_entry_details")} <span className="text-destructive">*</span></p>
              <Field label={t("doc_number")} required>
                <Input value={data.identityDocNumber} onChange={e => handleUpdate({ identityDocNumber: e.target.value })} className={cn("h-9", errors.identityDocNumber && !data.identityDocNumber && "border-destructive")} />
              </Field>
              <Field label={t("expiry_date")} required>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("w-full justify-start h-9 text-xs", !data.identityDocExpiry && "text-muted-foreground")}>
                      <CalendarIcon className="mr-2 h-3.5 w-3.5" />{data.identityDocExpiry ? format(data.identityDocExpiry, "PPP") : t("select_date")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={data.identityDocExpiry} onSelect={d => handleUpdate({ identityDocExpiry: d })} className="p-3 pointer-events-auto" /></PopoverContent>
                </Popover>
              </Field>
              <Field label={t("issuing_country")} required>
                <Select value={data.identityDocCountry} onValueChange={v => handleUpdate({ identityDocCountry: v })}>
                  <SelectTrigger className={cn("h-9 text-xs", errors.identityDocCountry && !data.identityDocCountry && "border-destructive")}><SelectValue placeholder={t("select")} /></SelectTrigger>
                  <SelectContent>{countryOptions.map(c => <SelectItem key={c.value} value={c.value}>{t(c.key)}</SelectItem>)}</SelectContent>
                </Select>
              </Field>
            </div>
          </div>
        )}
      </div>

      {/* Work Authorization - Foreign Worker Question */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center"><Shield className="w-3.5 h-3.5 text-primary" /></div>
          <h3 className="font-semibold text-sm text-card-foreground">{t("work_authorization")}</h3>
        </div>
        <Field label={t("foreign_worker_question")} required>
          <RadioGroup value={data.isForeignWorker || ""} onValueChange={v => handleUpdate({ isForeignWorker: v })} className="flex gap-4 pt-1">
            <label className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-lg cursor-pointer transition-all text-xs", data.isForeignWorker === "yes" ? "text-primary font-semibold" : "text-muted-foreground")}>
              <RadioGroupItem value="yes" id="fw-yes" className="h-3.5 w-3.5" />
              <span>{t("yes")}</span>
            </label>
            <label className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-lg cursor-pointer transition-all text-xs", data.isForeignWorker === "no" ? "text-primary font-semibold" : "text-muted-foreground")}>
              <RadioGroupItem value="no" id="fw-no" className="h-3.5 w-3.5" />
              <span>{t("no")}</span>
            </label>
          </RadioGroup>
          {errors.isForeignWorker && <p className="text-[11px] text-destructive">{errors.isForeignWorker}</p>}
        </Field>

        {isForeignWorker && (
          <div className="space-y-2 border border-border rounded-xl bg-card p-3">
            <Field label={t("residence_permit_number")}>
              <Input value={data.workPermitNumber} onChange={e => handleUpdate({ workPermitNumber: e.target.value })} className="h-9" placeholder={t("enter_permit_number")} />
            </Field>
            <Field label={t("expiry_date")}>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start h-9 text-xs", !data.workPermitExpiry && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-3.5 w-3.5" />{data.workPermitExpiry ? format(data.workPermitExpiry, "PPP") : t("select_date")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={data.workPermitExpiry} onSelect={d => handleUpdate({ workPermitExpiry: d })} className="p-3 pointer-events-auto" /></PopoverContent>
              </Popover>
            </Field>
            <Field label={t("issued_by")}>
              <Input value={data.workPermitIssuedBy} onChange={e => handleUpdate({ workPermitIssuedBy: e.target.value })} className="h-9" placeholder={t("enter_issued_by")} />
            </Field>
            <MultiFileUpload label={t("upload_work_permit")} files={data.workPermit} onFilesChange={f => handleUpdate({ workPermit: f })} hint={t("clear_photo_hint")} />
          </div>
        )}
      </div>

      {/* Criminal Record Certificate */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center"><FileText className="w-3.5 h-3.5 text-primary" /></div>
          <h3 className="font-semibold text-sm text-card-foreground">{t("criminal_record")} <span className="text-destructive">*</span></h3>
        </div>
        <MultiFileUpload label={t("upload_certificate")} files={data.criminalRecord} onFilesChange={f => handleUpdate({ criminalRecord: f })} hint={t("recent_cert_hint")} error={errors.criminalRecord} />
        <div className="flex items-start gap-2 p-2 bg-amber-50 rounded-lg border border-amber-200">
          <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-[10px] text-amber-700 leading-relaxed">{t("criminal_record_alert")}</p>
        </div>
      </div>

      <div className="flex gap-2">
        <Button variant="outline" onClick={onBack} className="flex-1 h-9 rounded-lg text-xs">{t("back")}</Button>
        <Button onClick={() => validate() && onNext()} disabled={!isValid} className="flex-1 h-9 rounded-lg text-xs font-semibold disabled:opacity-40">{t("submit_continue")}</Button>
      </div>
    </div>
  );
};

export default StageTwo;
