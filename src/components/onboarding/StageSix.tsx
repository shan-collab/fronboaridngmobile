import { useOnboarding } from "@/context/OnboardingContext";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { FileCheck, ShieldCheck, Building, ExternalLink, FileText, PenTool, Upload, Info } from "lucide-react";
import PDFViewerDialog from "./PDFViewerDialog";
import HelpIcon from "./HelpIcon";
import { useState, useMemo, useRef, useCallback } from "react";

interface StageSixProps { onComplete: () => void; onBack: () => void; }

const DocFileLink = ({ title }: { title: string }) => (
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

const StageSix = ({ onComplete, onBack }: StageSixProps) => {
  const { data, updateData } = useOnboarding();
  const { t } = useLanguage();
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Employee signature state
  const [signatureMode, setSignatureMode] = useState<"draw" | "upload">("draw");
  const [signatureData, setSignatureData] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const handleUpdate = (updates: Partial<typeof data>) => {
    updateData(updates);
    if (Object.keys(errors).length > 0) setErrors({});
  };

  const isValid = useMemo(() => {
    if (!signatureData) return false;
    if (!data.declarationAgreed) return false;
    return true;
  }, [signatureData, data.declarationAgreed]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!signatureData) e.signature = t("required");
    if (!data.declarationAgreed) e.declaration = t("required");
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const startDraw = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setIsDrawing(true);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = "touches" in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = "touches" in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    ctx.beginPath();
    ctx.moveTo(x, y);
  }, []);

  const draw = useCallback((e: React.MouseEvent | React.TouchEvent) => {
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
  }, [isDrawing]);

  const endDraw = useCallback(() => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) setSignatureData(canvas.toDataURL());
  }, []);

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    setSignatureData(null);
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setSignatureData(reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-4">
      {/* Provident Insurance */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center"><ShieldCheck className="w-3.5 h-3.5 text-primary" /></div>
          <h3 className="font-semibold text-sm text-card-foreground">{t("provident_insurance")}</h3>
          <HelpIcon content={t("help_provident_insurance")} />
        </div>
        <div className="border border-border rounded-xl bg-card p-3 space-y-1">
          <DocFileLink title={t("provident_booklet")} />
          <DocFileLink title={t("provident_beneficiary")} />
          <DocFileLink title={t("provident_due")} />
        </div>
      </div>

      <div className="border-t border-border" />

      {/* Digiposte and Action Logement */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center"><Building className="w-3.5 h-3.5 text-primary" /></div>
          <h3 className="font-semibold text-sm text-card-foreground">{t("digiposte_action_logement")}</h3>
          <HelpIcon content={t("help_digiposte_logement")} />
        </div>
        <div className="border border-border rounded-xl bg-card p-3 space-y-1">
          <DocFileLink title={t("action_logement_sheet")} />
          <DocFileLink title={t("digiposte_letter")} />
        </div>
      </div>

      <div className="border-t border-border" />

      {/* Acknowledgement of Documents */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center"><FileText className="w-3.5 h-3.5 text-primary" /></div>
          <h3 className="font-semibold text-sm text-card-foreground">{t("acknowledgement_documents")}</h3>
          <HelpIcon content={t("help_acknowledgement")} />
        </div>
        <div className="border border-border rounded-xl bg-card p-3 space-y-1">
          <DocFileLink title={t("certificate_delivery")} />
        </div>
      </div>

      <div className="border-t border-border" />

      {/* Employee Signature */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center"><PenTool className="w-3.5 h-3.5 text-primary" /></div>
          <h3 className="font-semibold text-sm text-card-foreground">{t("employee_signature")}</h3>
        </div>

        {/* Review note */}
        <div className="flex items-start gap-2 p-2.5 bg-amber-50 rounded-lg border border-amber-200">
          <Info className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-[10px] text-amber-700 leading-relaxed font-medium">{t("review_ack_before_signing")}</p>
        </div>

        <div className="bg-card rounded-xl border border-border p-3 space-y-3">
          {/* Draw / Upload Toggle */}
          <div className="grid grid-cols-2 rounded-lg border border-border overflow-hidden">
            <button
              onClick={() => setSignatureMode("draw")}
              className={`flex items-center justify-center gap-1.5 py-2 text-xs font-medium transition-colors ${
                signatureMode === "draw" ? "bg-primary text-primary-foreground" : "bg-muted/30 text-muted-foreground hover:bg-muted/50"
              }`}
            >
              <PenTool className="w-3 h-3" /> {t("draw")}
            </button>
            <button
              onClick={() => setSignatureMode("upload")}
              className={`flex items-center justify-center gap-1.5 py-2 text-xs font-medium transition-colors ${
                signatureMode === "upload" ? "bg-primary text-primary-foreground" : "bg-muted/30 text-muted-foreground hover:bg-muted/50"
              }`}
            >
              <Upload className="w-3 h-3" /> {t("upload")}
            </button>
          </div>

          {signatureMode === "draw" && (
            <div className="space-y-2">
              <div className="border border-border rounded-lg bg-muted/20 relative overflow-hidden">
                <canvas
                  ref={canvasRef}
                  width={320}
                  height={100}
                  className="w-full touch-none cursor-crosshair"
                  onMouseDown={startDraw}
                  onMouseMove={draw}
                  onMouseUp={endDraw}
                  onMouseLeave={endDraw}
                  onTouchStart={startDraw}
                  onTouchMove={draw}
                  onTouchEnd={endDraw}
                />
                {!signatureData && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="text-[10px] text-muted-foreground">{t("signature_will_appear")}</span>
                  </div>
                )}
              </div>
              <Button variant="outline" size="sm" onClick={clearSignature} className="text-xs h-7">{t("clear")}</Button>
            </div>
          )}

          {signatureMode === "upload" && (
            <div className="space-y-2">
              <label className="flex flex-col items-center gap-1.5 p-3 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/40 transition-colors">
                <Upload className="w-4 h-4 text-muted-foreground" />
                <span className="text-[10px] text-muted-foreground">{t("upload_signature")}</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
              </label>
              {signatureData && (
                <div className="border border-border rounded-lg p-2 bg-muted/20">
                  <img src={signatureData} alt="Signature" className="max-h-16 mx-auto" />
                </div>
              )}
            </div>
          )}
        </div>
        {errors.signature && <p className="text-[11px] text-destructive">{errors.signature}</p>}
      </div>

      {/* Agree Terms */}
      <div className="flex items-center gap-2">
        <Checkbox
          id="declaration-agree"
          checked={data.declarationAgreed}
          onCheckedChange={(checked) => handleUpdate({ declarationAgreed: !!checked })}
        />
        <Label htmlFor="declaration-agree" className="text-xs cursor-pointer">
          {t("agree_terms_conditions")}
        </Label>
      </div>
      {data.declarationAgreed && (
        <div className="flex items-start gap-2 p-2.5 bg-primary/5 rounded-lg border border-primary/10">
          <FileCheck className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
          <p className="text-[10px] text-muted-foreground leading-relaxed">{t("declaration_email_note")}</p>
        </div>
      )}
      {errors.declaration && <p className="text-[11px] text-destructive">{errors.declaration}</p>}

      <div className="flex gap-2">
        <Button variant="outline" onClick={onBack} className="flex-1 h-9 rounded-lg text-xs">{t("back")}</Button>
        <Button onClick={() => validate() && onComplete()} disabled={!isValid} className="flex-1 h-9 rounded-lg text-xs font-semibold bg-emerald-500 hover:bg-emerald-600 text-white disabled:opacity-40">
          {t("confirm_submit")}
        </Button>
      </div>
    </div>
  );
};

export default StageSix;
