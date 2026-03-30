import { useOnboarding } from "@/context/OnboardingContext";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, PenTool, CheckCircle2, Download, Clock, Building2, Upload, Eye, BookOpen, Shield, ExternalLink, Info } from "lucide-react";
import { useState, useMemo, useRef } from "react";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import FileUpload from "./FileUpload";
import PDFViewerDialog from "./PDFViewerDialog";
import { Label } from "@/components/ui/label";

interface StageFourProps { onNext: () => void; onBack: () => void; }

const StageFour = ({ onNext, onBack }: StageFourProps) => {
  const { data, updateData, completedStages } = useOnboarding();
  const { t } = useLanguage();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [signatureData, setSignatureData] = useState<string | null>(null);
  const [signatureFile, setSignatureFile] = useState<File | null>(null);
  const [showContract, setShowContract] = useState(false);
  const [signMethod, setSignMethod] = useState<"draw" | "upload">("draw");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const isRevisiting = completedStages.includes(4);
  const managerSigned = isRevisiting || data.managerSigned;

  const allDocsChecked = data.internalRulesConfirmed && data.codeOfConductConfirmed && data.contractDocConfirmed && data.dataProtectionCharterConfirmed;
  const canSign = data.policyAgreed;

  const isValid = useMemo(() => {
    return data.contractSigned && data.policyAgreed;
  }, [data.contractSigned, data.policyAgreed]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!data.contractSigned) e.contract = t("please_sign");
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = "touches" in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = "touches" in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = "touches" in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = "touches" in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.strokeStyle = "hsl(var(--foreground))";
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const endDraw = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) setSignatureData(canvas.toDataURL());
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    setSignatureData(null);
  };

  const handleSignatureUpload = (file: File | null) => {
    setSignatureFile(file);
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => setSignatureData(e.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      setSignatureData(null);
    }
  };

  const confirmSign = () => {
    if (signatureData) {
      updateData({ contractSigned: true });
      setErrors({});
    }
  };

  // Auto-tick handler for documents
  const handleDocRead = (field: "internalRulesConfirmed" | "codeOfConductConfirmed" | "contractDocConfirmed" | "dataProtectionCharterConfirmed") => {
    if (!data.policyAgreed) {
      updateData({ [field]: !data[field] });
    }
  };

  const contractTemplate = (showSignature = false) => (
    <div className="bg-background text-foreground p-5 space-y-4 text-xs">
      <div className="text-center border-b border-border pb-4">
        <h4 className="font-bold text-base tracking-wide">{t("employment_contract_title")}</h4>
      </div>
      <p className="text-[11px] leading-relaxed">{t("contract_intro")}</p>
      <p className="text-[11px] leading-relaxed text-muted-foreground">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas quis suscipit ex.
      </p>
      <p className="text-[11px] leading-relaxed text-muted-foreground">
        Pellentesque tincidunt ornare libero, ut vestibulum metus interdum ut.
      </p>
      <div className="pt-6 mt-4 border-t border-border">
        <p className="text-[11px] text-muted-foreground text-center mb-2">{t("employee_signature")}</p>
        {showSignature && signatureData ? (
          <div className="border border-dashed border-border rounded-lg p-2 mx-auto max-w-[200px]">
            <img src={signatureData} alt="Signature" className="w-full h-16 object-contain" />
          </div>
        ) : (
          <div className="border border-dashed border-border rounded-lg p-4 mx-auto max-w-[200px]">
            <p className="text-[10px] text-muted-foreground text-center">{t("signature_will_appear")}</p>
          </div>
        )}
      </div>
    </div>
  );

  const DocLink = ({ title, field }: { title: string; field: "internalRulesConfirmed" | "codeOfConductConfirmed" | "contractDocConfirmed" | "dataProtectionCharterConfirmed" }) => (
    <div className="flex items-center gap-2 group">
      <PDFViewerDialog
        title={title}
        trigger={
          <button className="text-xs text-primary underline hover:text-primary/80 text-left font-medium flex items-center gap-1">
            <ExternalLink className="w-3 h-3" />
            {title}
          </button>
        }
        showDownload
        onAllPagesRead={() => handleDocRead(field)}
      />
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center">
          <FileText className="w-3.5 h-3.5 text-primary" />
        </div>
        <h3 className="font-semibold text-sm text-card-foreground">{t("contract")}</h3>
      </div>

      {/* Employee Details Card */}
      <div className="border border-border rounded-xl bg-card p-3 space-y-1.5">
        {[
          [t("employee"), `${data.firstName} ${data.lastName}`],
          [t("role"), data.jobRole],
          [t("contract_type"), data.contractType],
          [t("location"), data.storeLocation],
          [t("start_date"), data.startDate ? format(data.startDate, "dd/MM/yyyy") : ""],
        ].map(([label, value]) => (
          <div key={label} className="flex justify-between text-xs">
            <span className="text-muted-foreground">{label}</span>
            <span className="font-medium text-card-foreground">{value}</span>
          </div>
        ))}
      </div>

      {/* Regulations and Contracts Section */}
      <div className="border border-border rounded-xl bg-card p-3 space-y-3">
        <div className="flex items-center gap-2">
          <BookOpen className="w-3.5 h-3.5 text-primary" />
          <span className="text-xs font-semibold text-card-foreground">{t("regulations_and_contracts")}</span>
        </div>

        <div className="space-y-2.5">
          {/* Internal Rules */}
          <div className="flex items-center gap-2.5">
            <Checkbox
              id="internal-rules"
              checked={data.internalRulesConfirmed}
              onCheckedChange={(v) => handleDocRead("internalRulesConfirmed")}
              disabled={data.policyAgreed}
            />
            <DocLink title={t("internal_rules")} field="internalRulesConfirmed" />
          </div>

          {/* Code of Conduct */}
          <div className="flex items-center gap-2.5">
            <Checkbox
              id="code-conduct"
              checked={data.codeOfConductConfirmed}
              onCheckedChange={(v) => handleDocRead("codeOfConductConfirmed")}
              disabled={data.policyAgreed}
            />
            <DocLink title={t("code_of_conduct")} field="codeOfConductConfirmed" />
          </div>

          {/* Contract */}
          <div className="flex items-center gap-2.5">
            <Checkbox
              id="contract-doc"
              checked={data.contractDocConfirmed}
              onCheckedChange={(v) => handleDocRead("contractDocConfirmed")}
              disabled={data.policyAgreed}
            />
            <PDFViewerDialog
              title={t("contract_document")}
              trigger={
                <button className="text-xs text-primary underline hover:text-primary/80 text-left font-medium flex items-center gap-1">
                  <ExternalLink className="w-3 h-3" />
                  {t("contract_document")}
                </button>
              }
              showDownload
              contractContent={contractTemplate(data.contractSigned)}
            />
          </div>
        </div>
      </div>

      {/* Data Protection Section */}
      <div className="border border-border rounded-xl bg-card p-3 space-y-3">
        <div className="flex items-center gap-2">
          <Shield className="w-3.5 h-3.5 text-primary" />
          <span className="text-xs font-semibold text-card-foreground">{t("data_protection_section")}</span>
        </div>

        <div className="flex items-center gap-2.5">
          <Checkbox
            id="data-protection-charter"
            checked={data.dataProtectionCharterConfirmed}
            onCheckedChange={(v) => handleDocRead("dataProtectionCharterConfirmed")}
            disabled={data.policyAgreed}
          />
          <DocLink title={t("data_protection_charter")} field="dataProtectionCharterConfirmed" />
        </div>
      </div>

      {/* Agree Button */}
      {!data.policyAgreed ? (
        <div className="space-y-2">
          {!allDocsChecked && (
            <p className="text-[10px] text-muted-foreground text-center">{t("read_docs_to_agree")}</p>
          )}
          <Button
            onClick={() => updateData({ policyAgreed: true })}
            disabled={!allDocsChecked}
            className="w-full h-9 text-xs font-semibold disabled:opacity-40"
          >
            {t("agree_policy")}
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-1.5 p-2 bg-emerald-50 rounded-lg border border-emerald-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          <span className="text-[11px] font-semibold text-emerald-700">{t("policy_agreed")}</span>
        </div>
      )}

      {/* Signature Section - only enabled after agree */}
      {canSign && (
        <div className="border border-border rounded-xl overflow-hidden">
          <div className="p-3 border-b border-border bg-muted/20">
            <p className="text-xs font-semibold text-card-foreground">{t("employee_signature")}</p>
          </div>

          {!data.contractSigned ? (
            <div className="p-3 space-y-3">
              <div className="flex items-start gap-2 p-2.5 bg-amber-50 rounded-lg border border-amber-200">
                <Info className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-[10px] text-amber-700 leading-relaxed font-medium">{t("review_contract_before_signing")}</p>
              </div>
              <Tabs value={signMethod} onValueChange={v => setSignMethod(v as "draw" | "upload")} className="w-full">
                <TabsList className="w-full h-8">
                  <TabsTrigger value="draw" className="flex-1 text-[11px] gap-1 h-7">
                    <PenTool className="w-3 h-3" /> {t("draw")}
                  </TabsTrigger>
                  <TabsTrigger value="upload" className="flex-1 text-[11px] gap-1 h-7">
                    <Upload className="w-3 h-3" /> {t("upload")}
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="draw" className="mt-2 space-y-2">
                  <div className="border border-border rounded-lg bg-background overflow-hidden">
                    <canvas ref={canvasRef} width={280} height={80} className="w-full cursor-crosshair touch-none"
                      onMouseDown={startDraw} onMouseMove={draw} onMouseUp={endDraw} onMouseLeave={endDraw}
                      onTouchStart={startDraw} onTouchMove={draw} onTouchEnd={endDraw}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={clearSignature} className="text-[10px] h-7">{t("clear")}</Button>
                    <Button size="sm" onClick={confirmSign} disabled={!signatureData} className="flex-1 gap-1 h-7 text-[10px]">
                      <PenTool className="w-3 h-3" /> {t("confirm_signature")}
                    </Button>
                  </div>
                </TabsContent>
                <TabsContent value="upload" className="mt-2 space-y-2">
                  <FileUpload label={t("upload_signature")} file={signatureFile} onFileChange={handleSignatureUpload} accept="image/*" hint={t("sig_hint")} />
                  {signatureData && signMethod === "upload" && (
                    <Button size="sm" onClick={confirmSign} className="w-full gap-1 h-7 text-[10px]">
                      <CheckCircle2 className="w-3 h-3" /> {t("confirm_signature")}
                    </Button>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          ) : (
            <div className="p-3 space-y-2">
              <div className="flex items-center gap-1.5 p-2 bg-emerald-50 rounded-lg border border-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span className="text-[11px] font-semibold text-emerald-700">{t("signed_by_employee")}</span>
              </div>
              {signatureData && (
                <div className="border border-border rounded-lg p-1 bg-background">
                  <img src={signatureData} alt="Signature" className="w-full h-12 object-contain" />
                </div>
              )}
            </div>
          )}

          {/* Company Signature */}
          <div className="border-t border-border p-3">
            <p className="text-[10px] text-muted-foreground font-medium mb-2">{t("company_signature")}</p>
            {managerSigned ? (
              <div className="flex items-center gap-1.5 p-2 bg-emerald-50 rounded-lg border border-emerald-200">
                <Building2 className="w-4 h-4 text-emerald-500" />
                <span className="text-[11px] font-semibold text-emerald-700">{t("signed_by_company")}</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 p-2 bg-muted/50 rounded-lg">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-[11px] text-muted-foreground">{t("pending_manager")}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* View signed contract */}
      {data.contractSigned && (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="w-full gap-1.5 h-8 text-xs">
              <FileText className="w-3.5 h-3.5" /> {t("view_signed_contract")}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-sm max-h-[80vh] overflow-y-auto p-0">
            {contractTemplate(true)}
            <div className="p-3">
              <Button variant="outline" size="sm" className="w-full gap-1 h-8 text-xs">
                <Download className="w-3 h-3" /> {t("download_signed_pdf")}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {errors.contract && <p className="text-[11px] text-destructive">{errors.contract}</p>}

      <div className="flex gap-2">
        <Button variant="outline" onClick={onBack} className="flex-1 h-9 rounded-lg text-xs">{t("back")}</Button>
        <Button onClick={() => validate() && onNext()} disabled={!isValid} className="flex-1 h-9 rounded-lg text-xs font-semibold disabled:opacity-40">
          {t("proceed_benefits")}
        </Button>
      </div>
    </div>
  );
};

export default StageFour;
