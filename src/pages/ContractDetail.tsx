import { useNavigate, useParams } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import { ArrowLeft, FileText, PenTool, Upload, CheckCircle2, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import PDFViewerDialog from "@/components/onboarding/PDFViewerDialog";
import { useState, useRef, useCallback } from "react";

import contractTemplate from "@/assets/contract-template.png";
import smythsLogo from "@/assets/smyths-logo.png";

const employeeMap: Record<string, { name: string; employeeId: string; role: string; dateOfJoining: string; contractType: string; location: string }> = {
  "1": { name: "Marie Dupont", employeeId: "EMP-2026-001", role: "Sales Assistant", dateOfJoining: "01/03/2026", contractType: "Seasonal-Part Time", location: "Paris - Les Halles" },
  "2": { name: "Jean-Pierre Martin", employeeId: "EMP-2026-002", role: "Expert", dateOfJoining: "02/03/2026", contractType: "Full Time", location: "Paris - Les Halles" },
  "3": { name: "Sophie Lemaire", employeeId: "EMP-2026-003", role: "Sales Assistant", dateOfJoining: "05/03/2026", contractType: "Full Time", location: "Lyon" },
  "4": { name: "Thomas Bernard", employeeId: "EMP-2026-004", role: "Expert", dateOfJoining: "10/03/2026", contractType: "Full Time", location: "Marseille" },
  "5": { name: "Camille Rousseau", employeeId: "EMP-2026-005", role: "Sales Assistant", dateOfJoining: "15/03/2026", contractType: "Full Time", location: "Paris - Rivoli" },
  "6": { name: "Lucas Moreau", employeeId: "EMP-2026-006", role: "Sales Assistant", dateOfJoining: "03/03/2026", contractType: "Seasonal-Part Time", location: "Lille" },
  "7": { name: "Emma Lefevre", employeeId: "EMP-2026-007", role: "Expert", dateOfJoining: "20/03/2026", contractType: "Part Time", location: "Nantes" },
};

const ContractDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const emp = employeeMap[id || ""] || { name: "Unknown", employeeId: "N/A", role: "N/A", dateOfJoining: "N/A", contractType: "N/A", location: "N/A" };

  const [signatureMode, setSignatureMode] = useState<"draw" | "upload">("draw");
  const [signatureData, setSignatureData] = useState<string | null>(null);
  const [signed, setSigned] = useState(false);
  const [showFinalContract, setShowFinalContract] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const isPreSigned = id === "5";

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

  const confirmSign = () => {
    if (!signatureData || !showFinalContract) return;
    setSigned(true);
  };

  // Contract preview content (View Contract)
  const contractPreviewContent = (
    <div className="space-y-4 py-2">
      <img src={contractTemplate} alt="Employment Contract" className="w-full rounded-lg" />
    </div>
  );

  // Final contract content (with both signatures displayed simultaneously)
  const finalContractContent = (
    <div className="space-y-0 py-2">
      <div className="text-center border-b border-border pb-3 mb-3">
        <img src={smythsLogo} alt="Smyths 360" className="w-12 h-12 mx-auto mb-2 object-contain" />
        <h3 className="font-bold text-sm text-foreground">{t("employment_contract_title")}</h3>
      </div>
      <p className="text-[11px] leading-relaxed text-muted-foreground mb-2">
        This Employment Contract is made effective as of the start date of the Employee's employment with Smyths Toys France.
      </p>
      <p className="text-[11px] leading-relaxed text-muted-foreground mb-2">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas quis suscipit ex.
      </p>
      <p className="text-[11px] leading-relaxed text-muted-foreground mb-4">
        Pellentesque tincidunt ornare libero, ut vestibulum metus interdum ut.
      </p>
      {/* Dual signatures side by side */}
      <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border">
        <div className="space-y-1.5">
          <p className="text-[10px] text-center text-muted-foreground font-medium italic">{t("employee_signature")}</p>
          <div className="border border-border rounded-lg p-3 bg-muted/10 flex items-center justify-center min-h-[70px]">
            <svg width="60" height="30" viewBox="0 0 80 40" className="text-foreground">
              <path d="M5 30 Q10 5, 20 25 Q25 35, 30 15 Q35 5, 45 25 Q50 32, 55 18 Q60 8, 70 22" stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <p className="text-[9px] text-center text-muted-foreground">{emp.name}</p>
        </div>
        <div className="space-y-1.5">
          <p className="text-[10px] text-center text-muted-foreground font-medium italic">{t("manager_signature")}</p>
          <div className="border border-border rounded-lg p-3 bg-muted/10 flex items-center justify-center min-h-[70px]">
            {signatureData ? (
              <img src={signatureData} alt="Manager Signature" className="max-h-[55px] max-w-full object-contain" />
            ) : isPreSigned ? (
              <svg width="60" height="30" viewBox="0 0 80 40" className="text-foreground">
                <path d="M6 24 Q12 8, 20 20 Q26 30, 33 14 Q39 8, 48 23 Q56 34, 64 18 Q70 10, 75 22" stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" />
              </svg>
            ) : (
              <span className="text-xs text-muted-foreground">—</span>
            )}
          </div>
          <p className="text-[9px] text-center text-muted-foreground">{t("store_manager")}</p>
        </div>
      </div>
    </div>
  );

  // Signed success banner
  if (signed) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
        <div className="text-center space-y-3 max-w-xs">
          <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6 text-emerald-600" />
          </div>
          <h2 className="text-sm font-bold text-card-foreground">{t("manager_signed_success")}</h2>
          <div className="bg-muted/30 rounded-lg p-2.5 text-xs space-y-1">
            <div className="flex justify-between"><span className="text-muted-foreground">{t("employee")}</span><span className="font-medium">{emp.name}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">{t("employee_id_label")}</span><span className="font-medium">{emp.employeeId}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">{t("role")}</span><span className="font-medium">{emp.role}</span></div>
          </div>
          <PDFViewerDialog
            title={t("final_contract")}
            trigger={
              <Button variant="outline" className="w-full h-8 text-xs gap-2 border-primary/30 text-primary hover:bg-primary/5">
                <FileText className="w-3.5 h-3.5" />
                {t("view_final_contract")}
              </Button>
            }
            showDownload
            contractContent={finalContractContent}
          />
          <Button onClick={() => navigate("/contracts")} className="w-full h-8 text-xs rounded-lg bg-primary hover:bg-primary/90 mt-2">
            {t("back_to_contracts")}
          </Button>
        </div>
      </div>
    );
  }

  // Already signed view
  if (isPreSigned) {
    return (
      <div className="min-h-screen bg-background">
        <div className="smyths-gradient px-4 pt-3 pb-3">
          <div className="flex items-center gap-2 mb-1">
            <button onClick={() => navigate("/contracts")} className="w-7 h-7 rounded-full bg-primary-foreground/15 flex items-center justify-center">
              <ArrowLeft className="w-3.5 h-3.5 text-primary-foreground" />
            </button>
            <h1 className="text-primary-foreground text-sm font-bold flex-1">{t("contract_review")}</h1>
          </div>
        </div>
        <div className="px-4 pt-3 space-y-3 pb-6">
          <div className="bg-card rounded-xl border border-border p-3 space-y-1.5">
            <div className="flex items-center gap-2 mb-1">
              <FileText className="w-3.5 h-3.5 text-primary" />
              <span className="font-semibold text-xs text-card-foreground">{t("employee_contract_info")}</span>
            </div>
            <div className="text-xs space-y-1">
              <div className="flex justify-between"><span className="text-muted-foreground">{t("employee")}</span><span className="font-semibold text-card-foreground">{emp.name}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">{t("role")}</span><span className="font-medium">{emp.role}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">{t("contract_type")}</span><span className="font-medium">{emp.contractType}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">{t("location")}</span><span className="font-semibold text-primary">{emp.location}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">{t("start_date")}</span><span className="font-medium">{emp.dateOfJoining}</span></div>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2.5 bg-emerald-50 rounded-xl border border-emerald-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-medium text-emerald-700">{t("dual_signed_contract")}</span>
          </div>
          <PDFViewerDialog
            title={t("employment_contract_title")}
            trigger={
              <Button variant="outline" className="w-full h-8 text-xs gap-2">
                <FileText className="w-3.5 h-3.5" />
                {t("view_signed_contract")}
              </Button>
            }
            showDownload
            contractContent={finalContractContent}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="smyths-gradient px-4 pt-3 pb-3">
        <div className="flex items-center gap-2 mb-1">
          <button onClick={() => navigate("/contracts")} className="w-7 h-7 rounded-full bg-primary-foreground/15 flex items-center justify-center">
            <ArrowLeft className="w-3.5 h-3.5 text-primary-foreground" />
          </button>
          <h1 className="text-primary-foreground text-sm font-bold flex-1">{t("contract_review")}</h1>
        </div>
      </div>

      <div className="px-4 pt-3 space-y-3 pb-6">
        {/* Employee Info */}
        <div className="bg-card rounded-xl border border-border p-3 space-y-1.5">
          <div className="flex items-center gap-2 mb-1">
            <FileText className="w-3.5 h-3.5 text-primary" />
            <span className="font-semibold text-xs text-card-foreground">{t("employee_contract_info")}</span>
          </div>
          <div className="text-xs space-y-1">
            <div className="flex justify-between"><span className="text-muted-foreground">{t("employee")}</span><span className="font-semibold text-card-foreground">{emp.name}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">{t("role")}</span><span className="font-medium">{emp.role}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">{t("contract_type")}</span><span className="font-medium">{emp.contractType}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">{t("location")}</span><span className="font-semibold text-primary">{emp.location}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">{t("start_date")}</span><span className="font-medium">{emp.dateOfJoining}</span></div>
          </div>
        </div>

        {/* Contract View */}
        <PDFViewerDialog
          title={t("employment_contract_title")}
          trigger={
            <Button variant="outline" className="w-full h-8 text-xs gap-2">
              <FileText className="w-3.5 h-3.5" />
              {t("view_contract")}
            </Button>
          }
          showDownload
          contractContent={contractPreviewContent}
        />

        {/* Manager Signature */}
        <div className="bg-card rounded-xl border border-border p-3 space-y-3">
          <div className="flex items-center gap-2">
            <PenTool className="w-3.5 h-3.5 text-primary" />
            <span className="font-semibold text-xs text-card-foreground">{t("manager_signature")}</span>
          </div>

          {/* Review note */}
          <div className="flex items-start gap-2 p-2.5 bg-amber-50 rounded-lg border border-amber-200">
            <Info className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-[10px] text-amber-700 leading-relaxed font-medium">{t("review_employee_contract_before_signing")}</p>
          </div>

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

        {/* Final Contract - only visible after signature */}
        {signatureData && (
          <div className="space-y-3">
            <PDFViewerDialog
              title={t("final_contract")}
              trigger={
                <Button
                  variant="outline"
                  className="w-full h-8 text-xs gap-2 border-primary/30 text-primary hover:bg-primary/5"
                  onClick={() => setShowFinalContract(true)}
                >
                  <FileText className="w-3.5 h-3.5" />
                  {t("view_final_contract")}
                </Button>
              }
              showDownload
              contractContent={finalContractContent}
            />
          </div>
        )}

        {/* Confirm & Sign */}
        <Button
          onClick={confirmSign}
          disabled={!signatureData || !showFinalContract}
          className="w-full h-8 text-xs font-semibold bg-emerald-500 hover:bg-emerald-600 text-white disabled:opacity-40"
        >
          {t("confirm_manager_sign")}
        </Button>
      </div>
    </div>
  );
};

export default ContractDetail;
