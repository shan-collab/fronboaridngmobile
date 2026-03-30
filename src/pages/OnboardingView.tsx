import { useNavigate } from "react-router-dom";
import { useOnboarding, ApprovalStatus, EmergencyContact, DependentChild } from "@/context/OnboardingContext";
import { useLanguage } from "@/context/LanguageContext";
import {
  ArrowLeft, User, FileText, Landmark, PenTool, Heart, Pencil, Save, X, Eye,
  CheckCircle2, Clock, Building2, Download, AlertTriangle, Shield, CreditCard,
  Briefcase, MapPin, Phone, UtensilsCrossed, ChevronDown, History, Upload, RefreshCw, Plus, Trash2, CalendarIcon,
  Users, ClipboardList, AlertCircle, BookOpen, ExternalLink, Building, ShieldCheck
} from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import smythsLogo from "@/assets/smyths-logo.png";
import { useState, useEffect, useRef } from "react";
import { format } from "date-fns";
import MaskedInput from "@/components/onboarding/MaskedInput";
import MultiFileUpload from "@/components/onboarding/MultiFileUpload";
import FileUpload from "@/components/onboarding/FileUpload";
import PDFViewerDialog from "@/components/onboarding/PDFViewerDialog";
import { toast } from "@/hooks/use-toast";

const DocViewLink = ({ title }: { title: string }) => (
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

const sectionConfig = [
  { icon: User, labelKey: "details" },
  { icon: FileText, labelKey: "docs" },
  { icon: Landmark, labelKey: "bank" },
  { icon: PenTool, labelKey: "stage_short_contract" },
  { icon: Heart, labelKey: "benefits" },
  { icon: Shield, labelKey: "stage_short_declaration" },
];

const Field = ({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) => (
  <div className="space-y-1">
    <Label className="text-[11px] text-muted-foreground">{label}{required && <span className="text-destructive ml-0.5">*</span>}</Label>
    {children}
  </div>
);

const SectionBlock = ({ icon: Icon, title, children }: { icon: any; title: string; children: React.ReactNode }) => (
  <div className="space-y-3">
    <div className="flex items-center gap-2">
      <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center">
        <Icon className="w-3.5 h-3.5 text-primary" />
      </div>
      <h3 className="font-semibold text-xs text-card-foreground">{title}</h3>
    </div>
    <div className="space-y-2.5">{children}</div>
  </div>
);

const ReadOnlyRow = ({ label, value }: { label: string; value?: string }) => (
  value ? (
    <div className="flex justify-between text-sm py-2 border-b border-border/30 last:border-0">
      <span className="text-muted-foreground text-xs">{label}</span>
      <span className="text-card-foreground font-medium text-xs text-right max-w-[60%] break-words">{value}</span>
    </div>
  ) : null
);

const StatusBadge = ({
  status,
  t,
  rejected = false,
}: {
  status: ApprovalStatus;
  t: (k: string) => string;
  rejected?: boolean;
}) => {
  if (rejected) {
    return (
      <Badge className="bg-destructive/10 text-destructive border-destructive/40 text-[9px] h-5 gap-1">
        <AlertTriangle className="w-3 h-3" /> {t("rejected")}
      </Badge>
    );
  }
  if (status === "none") return null;
  return status === "pending" ? (
    <Badge className="bg-yellow-100 text-yellow-700 border-yellow-300 text-[9px] h-5 gap-1">
      <Clock className="w-3 h-3" /> {t("pending_approval")}
    </Badge>
  ) : (
    <Badge className="bg-emerald-100 text-emerald-700 border-emerald-300 text-[9px] h-5 gap-1">
      <CheckCircle2 className="w-3 h-3" /> {t("approved")}
    </Badge>
  );
};

const OnboardingView = () => {
  const navigate = useNavigate();
  const { data, updateData, handleGenderChange, markStagePending, simulateContractExtension } = useOnboarding();
  const { t } = useLanguage();
  const [activeSection, setActiveSection] = useState(0);
  const [editing, setEditing] = useState(false);
  const [contractResigning, setContractResigning] = useState(false);
  const [bankAdding, setBankAdding] = useState(false);
  const [showContractHistory, setShowContractHistory] = useState(false);
  const [genderChangePrompt, setGenderChangePrompt] = useState(false);
  const [pendingGender, setPendingGender] = useState("");
  const [hasChanges, setHasChanges] = useState(false);
  const [ssnRequired, setSsnRequired] = useState(false);
  const [addingSsn, setAddingSsn] = useState(false);
  const [newSsn, setNewSsn] = useState("");

  // New bank details state (separate from existing)
  const [newBankIban, setNewBankIban] = useState("");
  const [newBankRib, setNewBankRib] = useState<File[]>([]);
  const [newBankHolder, setNewBankHolder] = useState("");
  const [newBankCountry, setNewBankCountry] = useState("France");

  // Contract signing state
  const [signatureData, setSignatureData] = useState<string | null>(null);
  const [signatureFile, setSignatureFile] = useState<File | null>(null);
  const [signMethod, setSignMethod] = useState<"draw" | "upload">("draw");
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // File previews for arrays
  const [filePreviews, setFilePreviews] = useState<Record<string, string>>({});

  useEffect(() => {
    const previews: Record<string, string> = {};
    const fileFields = ["identityDoc", "workPermit", "criminalRecord", "cpamProof", "socialSecurityProof", "ribDocument", "insuranceProof"] as const;
    fileFields.forEach(field => {
      const files = data[field] as File[];
      files.forEach((file, i) => {
        if (file.type?.startsWith("image/")) {
          previews[`${field}_${i}`] = URL.createObjectURL(file);
        }
      });
    });
    setFilePreviews(previews);
    return () => Object.values(previews).forEach(URL.revokeObjectURL);
  }, [data]);

  // Auto-navigate to rejected section
  useEffect(() => {
    const hasRejectedDocs = Object.values(data.rejectedDocuments || {}).some(d => d.rejected);
    if (hasRejectedDocs) {
      setActiveSection(1);
    }
  }, [data.rejectedDocuments]);

  const FilesView = ({ files, fieldPrefix }: { files: File[]; fieldPrefix: string }) => {
    if (files.length === 0) return <span className="text-[10px] text-muted-foreground italic">{t("not_uploaded")}</span>;
    return (
      <div className="space-y-1.5">
        {files.map((file, i) => {
          const preview = filePreviews[`${fieldPrefix}_${i}`];
          return (
            <div key={i} className="flex items-center gap-2 bg-muted/30 rounded-lg p-2 mt-1">
              {preview ? (
                <Dialog>
                  <DialogTrigger asChild>
                    <button className="flex items-center gap-2 text-sm text-card-foreground hover:opacity-80">
                      <img src={preview} alt="" className="w-8 h-8 rounded object-cover" />
                      <span className="truncate text-xs">{file.name}</span>
                      <Eye className="w-3.5 h-3.5 shrink-0 text-primary" />
                    </button>
                  </DialogTrigger>
                  <DialogContent className="max-w-sm">
                    <img src={preview} alt="Preview" className="w-full rounded-lg" />
                  </DialogContent>
                </Dialog>
              ) : (
                <button onClick={() => window.open(URL.createObjectURL(file), '_blank')} className="text-xs text-muted-foreground flex items-center gap-2 hover:opacity-80">
                  <FileText className="w-4 h-4" /> {file.name} <Eye className="w-3 h-3 text-primary" />
                </button>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const handleDataUpdate = (updates: Partial<typeof data>) => {
    updateData(updates);
    setHasChanges(true);
  };

  const handleSave = () => {
    if (ssnRequired && !data.socialSecurityNumber) {
      toast({ title: t("ssn_required_title"), description: t("ssn_required_desc"), variant: "destructive" });
      return;
    }
    if (!hasChanges) { setEditing(false); return; }
    markStagePending(activeSection + 1);
    setEditing(false);
    setHasChanges(false);
    setSsnRequired(false);
    toast({ title: t("changes_saved"), description: t("changes_pending_approval") });
  };

  const handleGenderUpdate = (newGender: string) => {
    if (data.gender && data.gender !== newGender && data.socialSecurityNumber) {
      setPendingGender(newGender);
      setGenderChangePrompt(true);
    } else {
      handleGenderChange(newGender);
      setHasChanges(true);
    }
  };

  const confirmGenderChange = () => {
    handleGenderChange(pendingGender);
    setGenderChangePrompt(false);
    setPendingGender("");
    setSsnRequired(true);
    setHasChanges(true);
  };

  // Canvas drawing
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
    ctx.lineWidth = 2; ctx.lineCap = "round"; ctx.strokeStyle = "#1a1a1a";
    ctx.lineTo(x, y); ctx.stroke();
  };
  const endDraw = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) setSignatureData(canvas.toDataURL());
  };
  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (canvas) { const ctx = canvas.getContext("2d"); if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height); }
    setSignatureData(null);
  };
  const handleSignatureUpload = (file: File | null) => {
    setSignatureFile(file);
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => setSignatureData(e.target?.result as string);
      reader.readAsDataURL(file);
    } else { setSignatureData(null); }
  };
  const confirmSign = () => {
    if (signatureData) {
      // Also update the active contract in history to mark as employee-signed
      const updatedHistory = data.contractHistory.map(c =>
        c.id === data.activeContractId ? { ...c, signedByEmployee: true, signatureData: signatureData || undefined, signedAt: new Date() } : c
      );
      updateData({ contractSigned: true, needsResign: false, contractHistory: updatedHistory });
      markStagePending(4);
    }
  };

  const contractHistory = data.contractHistory.length > 0 ? data.contractHistory : [
    {
      id: "c1", label: t("initial_contract"),
      startDate: data.startDate || new Date("2026-03-01"),
      endDate: undefined,
      signedByEmployee: true, signedByCompany: true,
      signatureData: undefined, signedAt: new Date(),
      status: "active" as const,
    },
  ];

  const genderOptions = [
    { value: "Male", key: "male" }, { value: "Female", key: "female" },
    { value: "Non-binary", key: "non_binary" }, { value: "Prefer not to say", key: "prefer_not_to_say" },
  ];
  const nationalityOptions = [
    { value: "France", key: "france" }, { value: "EU Country", key: "eu_country" }, { value: "Non-EU Country", key: "non_eu_country" },
  ];
  const relationshipOptions = [
    { value: "Spouse", key: "spouse" }, { value: "Parent", key: "parent" },
    { value: "Sibling", key: "sibling" }, { value: "Friend", key: "friend" }, { value: "Other", key: "other" },
  ];
  const countryOptions = [
    { value: "France", key: "france" }, { value: "Germany", key: "germany" },
    { value: "UK", key: "uk" }, { value: "Spain", key: "spain" }, { value: "Italy", key: "italy" },
  ];
  const maritalStatusOptions = [
    { value: "Single", key: "single" }, { value: "Married", key: "married" },
    { value: "Cohabiting", key: "cohabiting" }, { value: "Civil Partnership (PACS)", key: "civil_partnership" },
    { value: "Divorced", key: "divorced" },
  ];

  const updateEmergencyContact = (idx: number, field: keyof EmergencyContact, value: string) => {
    const contacts = [...data.emergencyContacts];
    contacts[idx] = { ...contacts[idx], [field]: value };
    handleDataUpdate({ emergencyContacts: contacts });
  };
  const addEmergencyContact = () => {
    handleDataUpdate({ emergencyContacts: [...data.emergencyContacts, { name: "", phone: "", phoneCode: "+33", relationship: "" }] });
  };
  const removeEmergencyContact = (idx: number) => {
    handleDataUpdate({ emergencyContacts: data.emergencyContacts.filter((_, i) => i !== idx) });
  };

  // Dependent children handlers for post-onboarding edit
  const handleChildrenCountChange = (count: number) => {
    const current = data.dependentChildren;
    if (count > current.length) {
      const newChildren = [...current];
      for (let i = current.length; i < count; i++) {
        newChildren.push({ fullName: "", gender: "", dateOfBirth: undefined });
      }
      handleDataUpdate({ numberOfDependentChildren: count, dependentChildren: newChildren });
    } else {
      handleDataUpdate({ numberOfDependentChildren: count, dependentChildren: current.slice(0, count) });
    }
  };

  const updateDependentChild = (idx: number, field: keyof DependentChild, value: any) => {
    const children = [...data.dependentChildren];
    children[idx] = { ...children[idx], [field]: value };
    handleDataUpdate({ dependentChildren: children });
  };

  // ──────── SECTION RENDERERS ────────

  const cityOptionsMap: Record<string, Array<{ value: string; label: string }>> = {
    France: [
      { value: "Paris", label: "Paris" }, { value: "Lyon", label: "Lyon" }, { value: "Marseille", label: "Marseille" },
      { value: "Toulouse", label: "Toulouse" }, { value: "Nice", label: "Nice" }, { value: "Nantes", label: "Nantes" },
      { value: "Strasbourg", label: "Strasbourg" }, { value: "Bordeaux", label: "Bordeaux" }, { value: "Lille", label: "Lille" },
      { value: "Rennes", label: "Rennes" },
    ],
    Germany: [
      { value: "Berlin", label: "Berlin" }, { value: "Munich", label: "Munich" }, { value: "Hamburg", label: "Hamburg" },
      { value: "Frankfurt", label: "Frankfurt" }, { value: "Cologne", label: "Cologne" },
    ],
    UK: [
      { value: "London", label: "London" }, { value: "Manchester", label: "Manchester" }, { value: "Birmingham", label: "Birmingham" },
      { value: "Edinburgh", label: "Edinburgh" }, { value: "Glasgow", label: "Glasgow" },
    ],
    Spain: [
      { value: "Madrid", label: "Madrid" }, { value: "Barcelona", label: "Barcelona" }, { value: "Valencia", label: "Valencia" },
      { value: "Seville", label: "Seville" }, { value: "Bilbao", label: "Bilbao" },
    ],
    Italy: [
      { value: "Rome", label: "Rome" }, { value: "Milan", label: "Milan" }, { value: "Naples", label: "Naples" },
      { value: "Turin", label: "Turin" }, { value: "Florence", label: "Florence" },
    ],
  };

  const editCityOptions = cityOptionsMap[data.country] || [];

  const renderPersonalEdit = () => (
    <div className="space-y-4">
      <SectionBlock icon={User} title={t("personal_info")}>
        <div className="grid grid-cols-2 gap-2.5">
          <Field label={t("first_name_given")} required><Input value={data.firstName} onChange={e => handleDataUpdate({ firstName: e.target.value })} className="h-9" /></Field>
          <Field label={t("last_name_surname")} required><Input value={data.lastName} onChange={e => handleDataUpdate({ lastName: e.target.value })} className="h-9" /></Field>
        </div>
        <Field label={t("gender")} required>
          <Select value={data.gender} onValueChange={handleGenderUpdate}>
            <SelectTrigger className="h-9 text-xs"><SelectValue placeholder={t("select")} /></SelectTrigger>
            <SelectContent>{genderOptions.map(g => <SelectItem key={g.value} value={g.value}>{t(g.key)}</SelectItem>)}</SelectContent>
          </Select>
        </Field>
        <div className="grid grid-cols-2 gap-2.5">
          <Field label={t("date_of_birth")} required>
            <Popover><PopoverTrigger asChild>
              <Button variant="outline" className={cn("w-full justify-start text-left font-normal h-9 text-xs", !data.dateOfBirth && "text-muted-foreground")}>
                {data.dateOfBirth ? format(data.dateOfBirth, "dd/MM/yyyy") : t("select")}
              </Button>
            </PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={data.dateOfBirth} onSelect={d => handleDataUpdate({ dateOfBirth: d })} className="p-3 pointer-events-auto" /></PopoverContent></Popover>
          </Field>
          <Field label={t("place_of_birth")}><Input value={data.placeOfBirth} onChange={e => handleDataUpdate({ placeOfBirth: e.target.value })} className="h-9" /></Field>
        </div>
        <Field label={t("birth_department_number")}><Input value={data.birthDepartmentNumber} onChange={e => handleDataUpdate({ birthDepartmentNumber: e.target.value })} className="h-9" placeholder="e.g. 75" /></Field>
        <Field label={t("nationality")} required>
          <Input value={data.nationality} onChange={e => handleDataUpdate({ nationality: e.target.value })} className="h-9" placeholder={t("nationality_placeholder")} />
        </Field>
        <Field label={t("email")} required><Input type="email" value={data.email} onChange={e => handleDataUpdate({ email: e.target.value })} className="h-9" /></Field>
        <Field label={t("mobile")} required>
          <div className="flex gap-2">
            <Select value={data.mobileCode} onValueChange={v => handleDataUpdate({ mobileCode: v })}>
              <SelectTrigger className="w-20 h-9 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>{["+33", "+44", "+49", "+34", "+39", "+1"].map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
            </Select>
            <Input value={data.mobileNumber} onChange={e => handleDataUpdate({ mobileNumber: e.target.value })} className="flex-1 h-9" />
          </div>
        </Field>
      </SectionBlock>
      <div className="border-t border-border" />
      <SectionBlock icon={CreditCard} title={t("social_security_detail")}>
        <Field label={t("ssn")} required={ssnRequired}>
          {data.hasSocialSecurity === "yes" || ssnRequired ? (
            <MaskedInput value={data.socialSecurityNumber} onChange={v => handleDataUpdate({ socialSecurityNumber: v })} placeholder="Enter your NIR" />
          ) : (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground italic">{t("not_provided")} — {data.socialSecurityReason || t("pending")}</p>
              {!addingSsn && (
                <Button variant="outline" size="sm" onClick={() => setAddingSsn(true)} className="w-full gap-1 h-7 text-xs border-primary/30 text-primary">
                  <Plus className="w-3 h-3" /> {t("add_ssn_now")}
                </Button>
              )}
              {addingSsn && (
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-2.5 space-y-2">
                  <p className="text-[10px] text-primary font-medium">{t("ssn_received_desc")}</p>
                  <MaskedInput value={newSsn} onChange={v => { setNewSsn(v); setHasChanges(true); }} placeholder="Enter your NIR" />
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => { setAddingSsn(false); setNewSsn(""); }} className="text-[10px] h-7">{t("cancel")}</Button>
                    <Button size="sm" disabled={!newSsn} onClick={() => { handleDataUpdate({ socialSecurityNumber: newSsn, hasSocialSecurity: "yes" }); setAddingSsn(false); }} className="flex-1 h-7 text-[10px]">
                      <Save className="w-3 h-3 mr-1" /> {t("save")}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </Field>
        {ssnRequired && !data.socialSecurityNumber && (
          <p className="text-[11px] text-destructive">{t("ssn_mandatory_after_gender")}</p>
        )}
        {data.previousSSNs.length > 0 && (
          <div className="bg-muted/30 rounded-lg p-2.5 space-y-1.5">
            <p className="text-[10px] font-semibold text-muted-foreground">{t("previous_ssn_records")}</p>
            {data.previousSSNs.map((ssn, i) => (
              <div key={i} className="flex justify-between text-[10px]">
                <span className="text-muted-foreground">{"•".repeat(Math.max(0, ssn.number.length - 4))}{ssn.number.slice(-4)} ({ssn.gender})</span>
                <span className="text-muted-foreground">{format(ssn.changedAt, "dd/MM/yyyy")}</span>
              </div>
            ))}
          </div>
        )}
      </SectionBlock>
      <div className="border-t border-border" />
      <SectionBlock icon={Briefcase} title={t("job_info")}>
        <div className="grid grid-cols-2 gap-2.5">
          <Field label={t("job_role")}><Input value={data.jobRole} readOnly className="h-8 bg-muted text-muted-foreground text-xs" /></Field>
          <Field label={t("contract_type")}><Input value={data.contractType} readOnly className="h-8 bg-muted text-muted-foreground text-xs" /></Field>
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          <Field label={t("start_date")}><Input value={data.startDate ? format(data.startDate, "dd/MM/yyyy") : ""} readOnly className="h-8 bg-muted text-muted-foreground text-xs" /></Field>
          <Field label={t("location")}><Input value={data.storeLocation} readOnly className="h-8 bg-muted text-muted-foreground text-xs" /></Field>
        </div>
      </SectionBlock>
      <div className="border-t border-border" />
      <SectionBlock icon={MapPin} title={t("address")}>
        <Field label={t("street")} required><Textarea value={data.streetAddress} onChange={e => handleDataUpdate({ streetAddress: e.target.value })} rows={2} className="resize-none text-xs" /></Field>
        <Field label={t("country")}>
          <Select value={data.country} onValueChange={v => { handleDataUpdate({ country: v, city: "" }); }}>
            <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>{countryOptions.map(c => <SelectItem key={c.value} value={c.value}>{t(c.key)}</SelectItem>)}</SelectContent>
          </Select>
        </Field>
        <div className="grid grid-cols-2 gap-2.5">
          <Field label={t("city")} required>
            <Select value={data.city} onValueChange={v => handleDataUpdate({ city: v })}>
              <SelectTrigger className="h-8 text-xs"><SelectValue placeholder={t("select")} /></SelectTrigger>
              <SelectContent>{editCityOptions.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}</SelectContent>
            </Select>
          </Field>
          <Field label={t("postal_code")} required><Input value={data.postalCode} onChange={e => handleDataUpdate({ postalCode: e.target.value })} className="h-8 text-xs" /></Field>
        </div>
      </SectionBlock>
      <div className="border-t border-border" />
      <SectionBlock icon={Users} title={t("family_composition")}>
        <Field label={t("marital_status_question")}>
          <Select value={data.maritalStatusType} onValueChange={v => handleDataUpdate({ maritalStatus: "yes", maritalStatusType: v })}>
            <SelectTrigger className="h-8 text-xs"><SelectValue placeholder={t("select")} /></SelectTrigger>
            <SelectContent>{maritalStatusOptions.map(m => <SelectItem key={m.value} value={m.value}>{t(m.key)}</SelectItem>)}</SelectContent>
          </Select>
        </Field>
        <Field label={t("number_of_dependent_children")}>
          <Select value={String(data.numberOfDependentChildren)} onValueChange={v => handleChildrenCountChange(parseInt(v))}>
            <SelectTrigger className="h-8 text-xs w-24"><SelectValue /></SelectTrigger>
            <SelectContent>
              {Array.from({ length: 16 }, (_, i) => (
                <SelectItem key={i} value={String(i)}>{i}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        {data.dependentChildren.map((child, idx) => (
          <div key={idx} className="bg-muted/20 rounded-lg p-2.5 space-y-2 border border-border/50">
            <span className="text-[10px] font-semibold text-muted-foreground">{t("child")} {idx + 1}</span>
            <Field label={t("full_name")}><Input value={child.fullName} onChange={e => updateDependentChild(idx, "fullName", e.target.value)} className="h-8 text-xs" /></Field>
            <Field label={t("gender")}>
              <Select value={child.gender} onValueChange={v => updateDependentChild(idx, "gender", v)}>
                <SelectTrigger className="h-8 text-xs"><SelectValue placeholder={t("select")} /></SelectTrigger>
                <SelectContent>{genderOptions.map(g => <SelectItem key={g.value} value={g.value}>{t(g.key)}</SelectItem>)}</SelectContent>
              </Select>
            </Field>
            <Field label={t("date_of_birth")}>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start text-left font-normal h-8 text-xs", !child.dateOfBirth && "text-muted-foreground")}>
                    <CalendarIcon className="mr-1.5 h-3.5 w-3.5" />
                    {child.dateOfBirth ? format(child.dateOfBirth, "dd/MM/yyyy") : t("select_date")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={child.dateOfBirth} onSelect={d => updateDependentChild(idx, "dateOfBirth", d)} className="p-3 pointer-events-auto" />
                </PopoverContent>
              </Popover>
            </Field>
          </div>
        ))}
      </SectionBlock>
      <div className="border-t border-border" />
      <SectionBlock icon={Phone} title={t("emergency_contact")}>
        {data.emergencyContacts.map((contact, idx) => (
          <div key={idx} className="bg-muted/20 rounded-lg p-2.5 space-y-2 border border-border/50">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-semibold text-muted-foreground">{t("contact")} {idx + 1}</span>
              {data.emergencyContacts.length > 1 && (
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeEmergencyContact(idx)}>
                  <Trash2 className="w-3 h-3 text-destructive" />
                </Button>
              )}
            </div>
            <Field label={t("contact_name")} required><Input value={contact.name} onChange={e => updateEmergencyContact(idx, "name", e.target.value)} className="h-8 text-xs" /></Field>
            <Field label={t("contact_phone")} required>
              <div className="flex gap-2">
                <Select value={contact.phoneCode} onValueChange={v => updateEmergencyContact(idx, "phoneCode", v)}>
                  <SelectTrigger className="w-20 h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>{["+33", "+44", "+49", "+34", "+39", "+1"].map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
                <Input value={contact.phone} onChange={e => updateEmergencyContact(idx, "phone", e.target.value)} className="flex-1 h-8 text-xs" />
              </div>
            </Field>
            <Field label={t("relationship")} required>
              <Select value={contact.relationship} onValueChange={v => updateEmergencyContact(idx, "relationship", v)}>
                <SelectTrigger className="h-8 text-xs"><SelectValue placeholder={t("select")} /></SelectTrigger>
                <SelectContent>{relationshipOptions.map(r => <SelectItem key={r.value} value={r.value}>{t(r.key)}</SelectItem>)}</SelectContent>
              </Select>
            </Field>
          </div>
        ))}
        <Button variant="outline" size="sm" onClick={addEmergencyContact} className="w-full gap-1 h-7 text-xs">
          <Plus className="w-3 h-3" /> {t("add_contact")}
        </Button>
      </SectionBlock>
      <div className="border-t border-border" />
      <SectionBlock icon={ClipboardList} title={t("additional_declarations")}>
        <p className="text-[10px] text-muted-foreground italic">{t("all_fields_optional")}</p>
        <Field label={t("rqth_recognition")}>
          <RadioGroup value={data.rqthRecognition} onValueChange={v => handleDataUpdate({ rqthRecognition: v })} className="flex gap-4">
            <div className="flex items-center gap-1.5"><RadioGroupItem value="yes" id="edit-rqth-yes" /><Label htmlFor="edit-rqth-yes" className="text-xs">{t("yes")}</Label></div>
            <div className="flex items-center gap-1.5"><RadioGroupItem value="no" id="edit-rqth-no" /><Label htmlFor="edit-rqth-no" className="text-xs">{t("no")}</Label></div>
          </RadioGroup>
        </Field>
        {data.rqthRecognition === "yes" && (
          <MultiFileUpload label={t("upload_rqth_doc")} files={data.rqthDocument} onFilesChange={f => handleDataUpdate({ rqthDocument: f })} />
        )}
        <Field label={t("first_aid_training")}>
          <RadioGroup value={data.firstAidTraining} onValueChange={v => handleDataUpdate({ firstAidTraining: v })} className="flex gap-4">
            <div className="flex items-center gap-1.5"><RadioGroupItem value="yes" id="edit-fa-yes" /><Label htmlFor="edit-fa-yes" className="text-xs">{t("yes")}</Label></div>
            <div className="flex items-center gap-1.5"><RadioGroupItem value="no" id="edit-fa-no" /><Label htmlFor="edit-fa-no" className="text-xs">{t("no")}</Label></div>
          </RadioGroup>
        </Field>
        {data.firstAidTraining === "yes" && (
          <MultiFileUpload label={t("upload_first_aid_doc")} files={data.firstAidDocument} onFilesChange={f => handleDataUpdate({ firstAidDocument: f })} />
        )}
        <Field label={t("electrical_safety_training")}>
          <RadioGroup value={data.electricalSafetyTraining} onValueChange={v => handleDataUpdate({ electricalSafetyTraining: v })} className="flex gap-4">
            <div className="flex items-center gap-1.5"><RadioGroupItem value="yes" id="edit-es-yes" /><Label htmlFor="edit-es-yes" className="text-xs">{t("yes")}</Label></div>
            <div className="flex items-center gap-1.5"><RadioGroupItem value="no" id="edit-es-no" /><Label htmlFor="edit-es-no" className="text-xs">{t("no")}</Label></div>
          </RadioGroup>
        </Field>
        {data.electricalSafetyTraining === "yes" && (
          <MultiFileUpload label={t("upload_electrical_doc")} files={data.electricalSafetyDocument} onFilesChange={f => handleDataUpdate({ electricalSafetyDocument: f })} />
        )}
      </SectionBlock>
    </div>
  );

  const renderPersonalView = () => (
    <div className="space-y-4">
      <SectionBlock icon={User} title={t("personal_info")}>
        <ReadOnlyRow label={t("first_name_given")} value={data.firstName} />
        <ReadOnlyRow label={t("last_name_surname")} value={data.lastName} />
        <ReadOnlyRow label={t("birth_name")} value={data.birthName} />
        <ReadOnlyRow label={t("gender")} value={data.gender} />
        <ReadOnlyRow label={t("date_of_birth")} value={data.dateOfBirth ? format(data.dateOfBirth, "dd/MM/yyyy") : ""} />
        <ReadOnlyRow label={t("place_of_birth")} value={data.placeOfBirth} />
        <ReadOnlyRow label={t("birth_department_number")} value={data.birthDepartmentNumber} />
        <ReadOnlyRow label={t("nationality")} value={data.nationality} />
        <ReadOnlyRow label={t("email")} value={data.email} />
        <ReadOnlyRow label={t("phone")} value={`${data.mobileCode} ${data.mobileNumber}`} />
      </SectionBlock>
      <div className="border-t border-border" />
      <SectionBlock icon={CreditCard} title={t("social_security_detail")}>
        <ReadOnlyRow label={t("ssn")} value={data.socialSecurityNumber ? `${"•".repeat(Math.max(0, data.socialSecurityNumber.length - 4))}${data.socialSecurityNumber.slice(-4)}` : t("not_provided")} />
        {data.previousSSNs.length > 0 && (
          <div className="bg-muted/30 rounded-lg p-2.5 space-y-1.5 mt-2">
            <p className="text-[10px] font-semibold text-muted-foreground">{t("previous_ssn_records")}</p>
            {data.previousSSNs.map((ssn, i) => (
              <div key={i} className="flex justify-between text-[10px]">
                <span className="text-muted-foreground">{"•".repeat(Math.max(0, ssn.number.length - 4))}{ssn.number.slice(-4)} ({ssn.gender})</span>
                <span className="text-muted-foreground">{format(ssn.changedAt, "dd/MM/yyyy")}</span>
              </div>
            ))}
          </div>
        )}
      </SectionBlock>
      <div className="border-t border-border" />
      <SectionBlock icon={Briefcase} title={t("job_info")}>
        <ReadOnlyRow label={t("role")} value={data.jobRole} />
        <ReadOnlyRow label={t("contract_type")} value={data.contractType} />
        <ReadOnlyRow label={t("start_date")} value={data.startDate ? format(data.startDate, "dd/MM/yyyy") : ""} />
        <ReadOnlyRow label={t("location")} value={data.storeLocation} />
      </SectionBlock>
      <div className="border-t border-border" />
      <SectionBlock icon={MapPin} title={t("address")}>
        <ReadOnlyRow label={t("street_number")} value={data.streetNumber} />
        <ReadOnlyRow label={t("building_identifier")} value={data.buildingIdentifier} />
        <ReadOnlyRow label={t("street_name")} value={data.streetName} />
        <ReadOnlyRow label={t("country")} value={data.country} />
        <ReadOnlyRow label={t("city")} value={data.city} />
        <ReadOnlyRow label={t("postal_code")} value={data.postalCode} />
      </SectionBlock>
      <div className="border-t border-border" />
      <SectionBlock icon={Users} title={t("family_composition")}>
        <ReadOnlyRow label={t("marital_status_question")} value={data.maritalStatusType || ""} />
        <ReadOnlyRow label={t("number_of_dependent_children")} value={String(data.numberOfDependentChildren)} />
        {data.dependentChildren.map((child, idx) => (
          <div key={idx} className="bg-muted/20 rounded-lg p-2.5 space-y-0 border border-border/50">
            <span className="text-[10px] font-semibold text-muted-foreground">{t("child")} {idx + 1}</span>
            <ReadOnlyRow label={t("full_name")} value={child.fullName} />
            <ReadOnlyRow label={t("gender")} value={child.gender} />
            <ReadOnlyRow label={t("date_of_birth")} value={child.dateOfBirth ? format(child.dateOfBirth, "dd/MM/yyyy") : ""} />
          </div>
        ))}
      </SectionBlock>
      <div className="border-t border-border" />
      <SectionBlock icon={Phone} title={t("emergency_contact")}>
        {data.emergencyContacts.map((contact, idx) => (
          <div key={idx} className={cn("space-y-0", idx > 0 && "mt-2 pt-2 border-t border-border/30")}>
            <ReadOnlyRow label={`${t("contact")} ${idx + 1} — ${t("name")}`} value={contact.name} />
            <ReadOnlyRow label={t("phone")} value={`${contact.phoneCode} ${contact.phone}`} />
            <ReadOnlyRow label={t("relationship")} value={contact.relationship} />
          </div>
        ))}
      </SectionBlock>
      <div className="border-t border-border" />
      <SectionBlock icon={ClipboardList} title={t("additional_declarations")}>
        <ReadOnlyRow label={t("rqth_recognition")} value={data.rqthRecognition === "yes" ? t("yes") : data.rqthRecognition === "no" ? t("no") : ""} />
        {data.rqthRecognition === "yes" && <FilesView files={data.rqthDocument} fieldPrefix="rqthDocument" />}
        <ReadOnlyRow label={t("first_aid_training")} value={data.firstAidTraining === "yes" ? t("yes") : data.firstAidTraining === "no" ? t("no") : ""} />
        {data.firstAidTraining === "yes" && <FilesView files={data.firstAidDocument} fieldPrefix="firstAidDocument" />}
        <ReadOnlyRow label={t("electrical_safety_training")} value={data.electricalSafetyTraining === "yes" ? t("yes") : data.electricalSafetyTraining === "no" ? t("no") : ""} />
        {data.electricalSafetyTraining === "yes" && <FilesView files={data.electricalSafetyDocument} fieldPrefix="electricalSafetyDocument" />}
      </SectionBlock>
    </div>
  );

  const RejectionAlert = ({ docKey }: { docKey: string }) => {
    const rejection = data.rejectedDocuments?.[docKey];
    if (!rejection?.rejected) return null;
    return (
      <div className="flex items-center gap-2 p-1.5 bg-destructive/5 border border-destructive/30 rounded-lg">
        <AlertTriangle className="w-3 h-3 text-destructive shrink-0" />
        <span className="text-[10px] text-destructive font-medium flex-1 truncate">
          {t("rejected")}: {rejection.reason}
        </span>
        <Badge className="bg-destructive/15 text-destructive border-destructive/30 text-[8px] h-4 px-1.5">{t("rejected")}</Badge>
      </div>
    );
  };

  const RejectedFileReadOnly = ({ docKey, files }: { docKey: string; files: File[] }) => {
    const rejection = data.rejectedDocuments?.[docKey];
    if (!rejection?.rejected || files.length === 0) return null;
    return (
      <div className="opacity-60">
        <p className="text-[10px] text-destructive font-medium mb-1">{t("rejected_file")}:</p>
        <MultiFileUpload label="" files={files} onFilesChange={() => {}} readOnly />
      </div>
    );
  };

  const renderDocumentsEdit = () => {
    const identityRejection = data.rejectedDocuments?.identityDoc;
    const criminalRejection = data.rejectedDocuments?.criminalRecord;
    const workPermitRejection = data.rejectedDocuments?.workPermit;

    // If work auth is blocked, show block screen
    if (data.workAuthBlocked && workPermitRejection?.rejected) {
      return (
        <div className="space-y-4">
          <div className="flex flex-col items-center gap-4 text-center py-6">
            <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-destructive" />
            </div>
            <h2 className="text-lg font-bold text-card-foreground">{t("work_auth_blocked_title")}</h2>
            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">{t("work_auth_blocked_desc")}</p>
            <div className="bg-destructive/5 border border-destructive/20 rounded-xl p-4 max-w-xs">
              <p className="text-xs text-destructive font-medium">{t("work_auth_blocked_contact")}</p>
            </div>
          </div>
        </div>
      );
    }

    return (
    <div className="space-y-4">
      <SectionBlock icon={CreditCard} title={t("identity_proof")}>
        <RejectionAlert docKey="identityDoc" />
        <Field label={t("doc_type")}>
          <Select value={data.identityDocType} onValueChange={v => handleDataUpdate({ identityDocType: v })}>
            <SelectTrigger className="h-9 text-xs"><SelectValue placeholder={t("select")} /></SelectTrigger>
            <SelectContent>
              <SelectItem value="national_id">{t("national_id")}</SelectItem>
              <SelectItem value="passport">{t("passport")}</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        {identityRejection?.rejected && (
          <RejectedFileReadOnly docKey="identityDoc" files={data.identityDocFront.length > 0 ? data.identityDocFront : data.identityDoc} />
        )}
        <MultiFileUpload 
          label={identityRejection?.rejected ? t("upload_new_identity_doc") : t("upload_id")} 
          files={identityRejection?.rejected ? [] : data.identityDoc}
          onFilesChange={f => {
            handleDataUpdate({ identityDoc: f });
          }} 
          hint={identityRejection?.rejected ? t("clear_unblurred_photo_hint") : t("reupload_hint")} 
        />
      </SectionBlock>
      <div className="border-t border-border" />
      <SectionBlock icon={FileText} title={t("criminal_record")}>
        <RejectionAlert docKey="criminalRecord" />
        {criminalRejection?.rejected && (
          <RejectedFileReadOnly docKey="criminalRecord" files={data.criminalRecord} />
        )}
        <MultiFileUpload 
          label={criminalRejection?.rejected ? t("upload_new_certificate") : t("upload_certificate")} 
          files={criminalRejection?.rejected ? [] : data.criminalRecord} 
          onFilesChange={f => handleDataUpdate({ criminalRecord: f })} 
        />
        <div className="flex items-start gap-2 p-2 bg-amber-50 rounded-lg border border-amber-200">
          <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-[10px] text-amber-700 leading-relaxed">{t("criminal_record_alert")}</p>
        </div>
      </SectionBlock>
      <div className="border-t border-border" />
      <SectionBlock icon={Shield} title={t("work_authorization_foreign")}>
        <RejectionAlert docKey="workPermit" />
        <Field label={t("residence_permit_number")}>
          <Input value={data.workPermitNumber} onChange={e => handleDataUpdate({ workPermitNumber: e.target.value })} className="h-9" placeholder={t("enter_permit_number")} />
        </Field>
        <Field label={t("expiry_date")}>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className={cn("w-full justify-start h-9 text-xs", !data.workPermitExpiry && "text-muted-foreground")}>
                <CalendarIcon className="mr-2 h-3.5 w-3.5" />{data.workPermitExpiry ? format(data.workPermitExpiry, "PPP") : t("select_date")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={data.workPermitExpiry} onSelect={d => handleDataUpdate({ workPermitExpiry: d })} className="p-3 pointer-events-auto" /></PopoverContent>
          </Popover>
        </Field>
        <Field label={t("issued_by")}>
          <Input value={data.workPermitIssuedBy} onChange={e => handleDataUpdate({ workPermitIssuedBy: e.target.value })} className="h-9" placeholder={t("enter_issued_by")} />
        </Field>
        {workPermitRejection?.rejected && (
          <RejectedFileReadOnly docKey="workPermit" files={data.workPermit} />
        )}
        <MultiFileUpload 
          label={workPermitRejection?.rejected ? t("upload_new_work_permit") : t("upload_work_permit")} 
          files={workPermitRejection?.rejected ? [] : data.workPermit} 
          onFilesChange={f => handleDataUpdate({ workPermit: f })} 
        />
      </SectionBlock>
    </div>
    );
  };

  const renderDocumentsView = () => (
    <div className="space-y-4">
      <SectionBlock icon={CreditCard} title={t("identity_proof")}>
        <ReadOnlyRow label={t("type")} value={data.identityDocType === "national_id" ? t("national_id") : data.identityDocType === "passport" ? t("passport") : ""} />
        <FilesView files={data.identityDoc} fieldPrefix="identityDoc" />
      </SectionBlock>
      <div className="border-t border-border" />
      <SectionBlock icon={FileText} title={t("criminal_record")}>
        <FilesView files={data.criminalRecord} fieldPrefix="criminalRecord" />
        <div className="flex items-start gap-2 p-2 bg-amber-50 rounded-lg border border-amber-200">
          <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-[10px] text-amber-700 leading-relaxed">{t("criminal_record_alert")}</p>
        </div>
      </SectionBlock>
      <div className="border-t border-border" />
      <SectionBlock icon={Shield} title={t("work_authorization_foreign")}>
        <ReadOnlyRow label={t("residence_permit_number")} value={data.workPermitNumber} />
        <ReadOnlyRow label={t("expiry_date")} value={data.workPermitExpiry ? format(data.workPermitExpiry, "PPP") : ""} />
        <ReadOnlyRow label={t("issued_by")} value={data.workPermitIssuedBy} />
        <FilesView files={data.workPermit} fieldPrefix="workPermit" />
      </SectionBlock>
    </div>
  );

  const renderBankEdit = () => (
    <div className="space-y-4">
      <SectionBlock icon={Landmark} title={t("bank_info")}>
        <Field label={t("iban")} required><MaskedInput value={data.iban} onChange={v => handleDataUpdate({ iban: v })} placeholder="FR76 XXXX XXXX XXXX XXXX XXXX XXX" /></Field>
        <MultiFileUpload label={t("rib_document")} files={data.ribDocument} onFilesChange={f => handleDataUpdate({ ribDocument: f })} />
      </SectionBlock>
    </div>
  );

  const renderBankView = () => {
    const hasPendingNew = data.stageApprovalStatus[3] === "pending" && data.newBankDetails;

    return (
      <div className="space-y-4">
        <SectionBlock icon={Landmark} title={t("bank_info")}>
          <ReadOnlyRow label={t("iban")} value={data.iban ? `${"•".repeat(Math.max(0, data.iban.length - 4))}${data.iban.slice(-4)}` : ""} />
          <FilesView files={data.ribDocument} fieldPrefix="ribDocument" />
        </SectionBlock>

        {/* Show new bank details with pending status if submitted */}
        {hasPendingNew && data.newBankDetails && (
          <div className="border border-yellow-300 rounded-xl overflow-hidden bg-yellow-50/50">
            <div className="p-2.5 border-b border-yellow-200 flex items-center justify-between bg-yellow-50">
              <div className="flex items-center gap-2">
                <Plus className="w-3.5 h-3.5 text-yellow-700" />
                <span className="text-xs font-semibold text-yellow-800">{t("new_bank_details")}</span>
              </div>
              <Badge className="bg-yellow-100 text-yellow-700 border-yellow-300 text-[9px] h-5 gap-1">
                <Clock className="w-3 h-3" /> {t("waiting_approval")}
              </Badge>
            </div>
            <div className="p-3 space-y-0">
              <ReadOnlyRow label={t("iban")} value={data.newBankDetails.iban ? `${"•".repeat(Math.max(0, data.newBankDetails.iban.length - 4))}${data.newBankDetails.iban.slice(-4)}` : ""} />
              <ReadOnlyRow label={t("account_holder")} value={data.newBankDetails.accountHolderName} />
              <ReadOnlyRow label={t("country")} value={data.newBankDetails.bankCountry} />
              {data.newBankDetails.ribDocument.length > 0 && <FilesView files={data.newBankDetails.ribDocument} fieldPrefix="newBankRib" />}
            </div>
          </div>
        )}

        {data.stageApprovalStatus[3] === "pending" && !hasPendingNew && (
          <div className="flex items-center gap-1.5 p-2.5 bg-yellow-50 rounded-lg border border-yellow-200">
            <Clock className="w-4 h-4 text-yellow-600" />
            <span className="text-[11px] text-yellow-700 font-medium">{t("waiting_approval")}</span>
          </div>
        )}
      </div>
    );
  };

  const renderBankAddFlow = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2 p-3 bg-primary/5 rounded-xl border border-primary/20">
        <Landmark className="w-5 h-5 text-primary shrink-0" />
        <div>
          <p className="text-xs font-semibold text-card-foreground">{t("new_bank_details")}</p>
          <p className="text-[10px] text-muted-foreground">{t("bank_security_note")}</p>
        </div>
      </div>

      {/* Show current (old) bank details as read-only */}
      <SectionBlock icon={Landmark} title={t("current_bank_details")}>
        <ReadOnlyRow label={t("iban")} value={data.iban ? `${"•".repeat(Math.max(0, data.iban.length - 4))}${data.iban.slice(-4)}` : ""} />
        <ReadOnlyRow label={t("account_holder")} value={data.accountHolderName} />
        <ReadOnlyRow label={t("country")} value={data.bankCountry} />
        <FilesView files={data.ribDocument} fieldPrefix="ribDocument" />
      </SectionBlock>

      <div className="border-t border-border" />

      {/* New bank details entry */}
      <SectionBlock icon={Plus} title={t("new_bank_fields")}>
        <Field label={t("new_iban")} required><MaskedInput value={newBankIban} onChange={v => setNewBankIban(v)} placeholder="FR76 XXXX XXXX XXXX XXXX XXXX XXX" /></Field>
        <MultiFileUpload label={t("new_rib_document")} files={newBankRib} onFilesChange={f => setNewBankRib(f)} hint={t("upload_rib")} />
        <Field label={t("new_account_holder")} required><Input value={newBankHolder} onChange={e => setNewBankHolder(e.target.value)} className="h-9" /></Field>
        <Field label={t("new_bank_country")} required>
          <Select value={newBankCountry} onValueChange={v => setNewBankCountry(v)}>
            <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>{countryOptions.map(c => <SelectItem key={c.value} value={c.value}>{t(c.key)}</SelectItem>)}</SelectContent>
          </Select>
        </Field>
      </SectionBlock>
      <Button
        onClick={() => {
          updateData({ newBankDetails: { iban: newBankIban, ribDocument: newBankRib, accountHolderName: newBankHolder, bankCountry: newBankCountry } });
          markStagePending(3);
          setBankAdding(false);
          setNewBankIban(""); setNewBankRib([]); setNewBankHolder(""); setNewBankCountry("France");
          toast({ title: t("bank_submitted"), description: t("bank_submitted_desc") });
        }}
        disabled={!newBankIban || !newBankHolder}
        className="w-full h-10 rounded-lg text-xs font-semibold gap-1.5 disabled:opacity-40"
      >
        <CheckCircle2 className="w-4 h-4" /> {t("submit_bank")}
      </Button>
    </div>
  );

  const renderContractResignFlow = () => {
    // Get old contracts (all except the newest active one)
    const sortedAll = [...contractHistory].sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
    const oldContracts = sortedAll.filter(c => c.status === "expired" || (c.status === "active" && c.signedByEmployee && c.signedByCompany));

    return (
      <div className="space-y-4">
        {/* Employee Contract Info */}
        <SectionBlock icon={Briefcase} title={t("employee_contract_info")}>
          <div className="border border-border rounded-xl bg-muted/10 p-3 space-y-1.5">
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
        </SectionBlock>

        {/* View Contract Template */}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full gap-1.5 h-9 text-xs"><Eye className="w-3.5 h-3.5" /> {t("view_contract_template")}</Button>
          </DialogTrigger>
          <DialogContent className="max-w-sm max-h-[80vh] overflow-y-auto p-0">
            <div className="bg-white text-gray-800 p-5 space-y-4 text-xs">
              <div className="text-center border-b border-gray-200 pb-4">
                <img src={smythsLogo} alt="Smyths" className="w-16 h-16 mx-auto mb-2 object-contain" />
                <h4 className="font-bold text-base tracking-wide">{t("employment_contract_title")}</h4>
              </div>
              <p className="text-[11px] leading-relaxed">{t("contract_intro")}</p>
              <p className="text-[11px] leading-relaxed">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            </div>
            <div className="p-3">
              <Button variant="outline" size="sm" className="w-full gap-1 h-8 text-xs"><Download className="w-3 h-3" /> {t("download_pdf")}</Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Employee Signature or Upload */}
        {!data.contractSigned ? (
          <div className="border border-border rounded-xl overflow-hidden">
            <div className="p-3 border-b border-border bg-muted/20">
              <p className="text-xs font-semibold text-card-foreground">{t("employee_signature")}</p>
            </div>
            <div className="p-3 space-y-3">
              <Tabs value={signMethod} onValueChange={v => setSignMethod(v as "draw" | "upload")} className="w-full">
                <TabsList className="w-full h-8">
                  <TabsTrigger value="draw" className="flex-1 text-[11px] gap-1 h-7"><PenTool className="w-3 h-3" /> {t("draw")}</TabsTrigger>
                  <TabsTrigger value="upload" className="flex-1 text-[11px] gap-1 h-7"><Upload className="w-3 h-3" /> {t("upload")}</TabsTrigger>
                </TabsList>
                <TabsContent value="draw" className="mt-2 space-y-2">
                  <div className="border border-border rounded-lg bg-white overflow-hidden">
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
          </div>
        ) : (
          <>
            {/* Signature confirmation */}
            <div className="flex items-center gap-1.5 p-2.5 bg-emerald-50 rounded-lg border border-emerald-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span className="text-[11px] font-semibold text-emerald-700">{t("signature_confirmation")}</span>
            </div>

            {/* View Final Employee Contract */}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full gap-1.5 h-9 text-xs"><Eye className="w-3.5 h-3.5" /> {t("view_final_employee_contract")}</Button>
              </DialogTrigger>
              <DialogContent className="max-w-sm max-h-[80vh] overflow-y-auto p-0">
                <div className="bg-white text-gray-800 p-5 space-y-4 text-xs">
                  <div className="text-center border-b border-gray-200 pb-4">
                    <img src={smythsLogo} alt="Smyths" className="w-16 h-16 mx-auto mb-2 object-contain" />
                    <h4 className="font-bold text-base tracking-wide">{t("employment_contract_title")}</h4>
                  </div>
                  <p className="text-[11px] leading-relaxed">{t("contract_intro")}</p>
                  <div className="pt-4 mt-2 border-t border-gray-200">
                    <p className="text-[11px] text-gray-500 text-center mb-2">{t("employee_signature")}</p>
                    <div className="border border-dashed border-gray-300 rounded-lg p-2 mx-auto max-w-[200px]">
                      {signatureData ? (
                        <img src={signatureData} alt="Signature" className="w-full h-16 object-contain" />
                      ) : (
                        <p className="text-[10px] text-emerald-600 text-center">✅ {t("signed_by_employee")}</p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="p-3">
                  <Button variant="outline" size="sm" className="w-full gap-1 h-8 text-xs"><Download className="w-3 h-3" /> {t("download_pdf")}</Button>
                </div>
              </DialogContent>
            </Dialog>
          </>
        )}

        {/* Company Signature Status */}
        <div className="flex items-center gap-1.5 p-2.5 rounded-lg border border-yellow-200 bg-yellow-50">
          <Clock className="w-4 h-4 text-yellow-600" />
          <span className="text-[11px] text-yellow-700 font-medium">{t("company_signature_pending")}</span>
        </div>


        {/* Submit */}
        {data.contractSigned && (
          <Button
            onClick={() => {
              markStagePending(4);
              setContractResigning(false);
              toast({ title: t("contract_submitted"), description: t("contract_submitted_desc") });
            }}
            className="w-full h-10 rounded-lg text-xs font-semibold gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" /> {t("submit_contract")}
          </Button>
        )}

        {/* Old Contract History */}
        {oldContracts.length > 0 && (
          <div className="border-t border-border pt-4 space-y-3">
            <p className="text-xs font-semibold text-muted-foreground">{t("contract_history")}</p>
            {oldContracts.map((contract) => (
              <div key={contract.id} className="border border-border rounded-xl bg-muted/10 overflow-hidden">
                <div className="p-3 border-b border-border/50 flex items-center justify-between">
                  <span className="text-xs font-semibold text-card-foreground">
                    {contract.label} — {format(contract.startDate, "dd MMM yyyy")} {contract.endDate ? `to ${format(contract.endDate, "dd MMM yyyy")}` : ""}
                  </span>
                  <Badge variant="secondary" className="text-[9px] h-4">{t(contract.status)}</Badge>
                </div>
                <div className="p-3 space-y-2">
                  {contractDocDialog(t("view_employee_contract"), <FileText className="w-3.5 h-3.5" />, false, contract)}
                  {contractDocDialog(t("view_company_contract"), <Building2 className="w-3.5 h-3.5" />, true, contract)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const contractDocDialog = (title: string, icon: React.ReactNode, showCompanySig: boolean, contract: typeof contractHistory[0]) => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full gap-1.5 h-8 text-xs">{icon} {title}</Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm max-h-[80vh] overflow-y-auto p-0">
        <div className="bg-white text-gray-800 p-5 space-y-4 text-xs">
          <div className="text-center border-b border-gray-200 pb-4">
            <img src={smythsLogo} alt="Smyths" className="w-16 h-16 mx-auto mb-2 object-contain" />
            <h4 className="font-bold text-base tracking-wide">{t("employment_contract_title")}</h4>
            {showCompanySig && <p className="text-[10px] text-gray-500 mt-1">{t("company_cosigned_copy")}</p>}
          </div>
          <p className="text-[11px] leading-relaxed">{t("contract_intro")}</p>
          <p className="text-[11px] leading-relaxed">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          <div className="pt-6 mt-4 border-t border-gray-200 space-y-3">
            <div>
              <p className="text-[11px] text-gray-500 text-center mb-2">{t("employee_signature")}</p>
              <div className="border border-dashed border-gray-300 rounded-lg p-2 mx-auto max-w-[200px]">
                {contract.signedByEmployee ? (
                  signatureData ? (
                    <img src={signatureData} alt="Signature" className="w-full h-16 object-contain" />
                  ) : (
                    <p className="text-[10px] text-emerald-600 text-center">✅ {t("signed_by_employee")}</p>
                  )
                ) : (
                  <p className="text-[10px] text-gray-400 text-center">{t("signature_will_appear")}</p>
                )}
              </div>
            </div>
            {showCompanySig && (
              <div>
                <p className="text-[11px] text-gray-500 text-center mb-2">{t("company_signature")}</p>
                <div className="border border-dashed border-gray-300 rounded-lg p-2 mx-auto max-w-[200px]">
                  {contract.signedByCompany ? (
                    <p className="text-[10px] text-emerald-600 text-center">✅ {t("signed_by_company")}</p>
                  ) : (
                    <p className="text-[10px] text-gray-400 text-center">⏳ {t("pending_manager")}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="p-3">
          <Button variant="outline" size="sm" className="w-full gap-1 h-8 text-xs"><Download className="w-3 h-3" /> {t("download_pdf")}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  const renderContractSection = () => {
    const sortedContracts = [...contractHistory].sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());

    // Determine if extension alert should show:
    // Show when no contract extension has happened yet (no expired contracts in history)
    // OR when needsResign is true (extension triggered but not yet signed)
    const hasSignedRehire = data.contractExtended && data.contractSigned && !data.needsResign;
    const showExtensionAlert = !hasSignedRehire && !data.contractExtended;

    return (
      <div className="space-y-4">
        {/* Employee Contract Info */}
        <SectionBlock icon={Briefcase} title={t("employee_contract_info")}>
          <div className="border border-border rounded-xl bg-muted/10 p-3 space-y-1.5">
            {[
              [t("employee"), `${data.firstName} ${data.lastName}`],
              [t("role"), data.jobRole],
              [t("contract_type"), data.contractType],
              [t("date_of_joining"), data.startDate ? format(data.startDate, "dd/MM/yyyy") : ""],
              [t("location"), data.storeLocation],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between text-xs">
                <span className="text-muted-foreground">{label}</span>
                <span className="font-medium text-card-foreground">{value}</span>
              </div>
            ))}
          </div>
        </SectionBlock>
        <div className="border-t border-border" />

        {/* Regulations and Contracts */}
        <SectionBlock icon={BookOpen} title={t("regulations_and_contracts")}>
          <div className="border border-border rounded-xl bg-card p-3 space-y-1">
            <DocViewLink title={t("internal_rules")} />
            <DocViewLink title={t("code_of_conduct")} />
            <DocViewLink title={t("contract_document")} />
          </div>
        </SectionBlock>
        <div className="border-t border-border" />

        {/* Data Protection */}
        <SectionBlock icon={Shield} title={t("data_protection_section")}>
          <div className="border border-border rounded-xl bg-card p-3 space-y-1">
            <DocViewLink title={t("data_protection_charter")} />
          </div>
        </SectionBlock>

        {/* Contract Tiles */}
        <div className="space-y-3">
          {sortedContracts.map((contract, idx) => {
            const isNewest = idx === 0;
            const periodLabel = contract.endDate
              ? `${format(contract.startDate, "MMM yyyy")} to ${format(contract.endDate, "MMM yyyy")}`
              : format(contract.startDate, "dd MMM yyyy");

            return (
              <div key={contract.id} className={cn(
                "border rounded-xl overflow-hidden",
                isNewest ? "border-primary/40 bg-primary/5" : "border-border bg-muted/10"
              )}>
                <div className="p-3 border-b border-border/50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-primary" />
                    <span className="text-xs font-semibold text-card-foreground">
                      {isNewest && sortedContracts.length > 1 ? contract.label : contract.label} — {periodLabel}
                    </span>
                  </div>
                  <Badge variant={contract.status === "active" ? "default" : "secondary"} className="text-[9px] h-4">{t(contract.status)}</Badge>
                </div>
                <div className="p-3 space-y-2">
                  {/* Employee Document */}
                  {contract.signedByEmployee ? (
                    contractDocDialog(t("view_employee_contract"), <FileText className="w-3.5 h-3.5" />, false, contract)
                  ) : (
                    <div className="flex items-center gap-1.5 p-2 bg-yellow-50 rounded-lg border border-yellow-200">
                      <Clock className="w-3.5 h-3.5 text-yellow-600" />
                      <span className="text-[11px] text-yellow-700">{t("employee_signature_pending")}</span>
                    </div>
                  )}
                  {/* Company Document */}
                  {contract.signedByCompany ? (
                    contractDocDialog(t("view_company_contract"), <Building2 className="w-3.5 h-3.5" />, true, contract)
                  ) : contract.signedByEmployee ? (
                    <div className="flex items-center gap-1.5 p-2 bg-yellow-50 rounded-lg border border-yellow-200">
                      <Clock className="w-3.5 h-3.5 text-yellow-600" />
                      <span className="text-[11px] text-yellow-700">{t("company_signature_pending")}</span>
                    </div>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>

        {/* Contract Extension Alert removed as requested */}
      </div>
    );
  };

  const renderBenefitsView = () => (
    <div className="space-y-4">
      <SectionBlock icon={Heart} title={t("health_insurance")}>
        {/* Insurance document links */}
        <div className="border border-border rounded-xl bg-card p-3 space-y-1">
          <DocViewLink title={t("practical_guide")} />
          <DocViewLink title={t("membership_terms")} />
          <DocViewLink title={t("employee_contact_verspieren")} />
        </div>
        <ReadOnlyRow label={t("enrolled")} value={data.enrollHealthInsurance === "yes" ? t("yes") : data.enrollHealthInsurance === "no" ? t("no") : ""} />
        {data.enrollHealthInsurance === "yes" && <ReadOnlyRow label={t("coverage_type")} value={data.coverageType ? t(data.coverageType) : ""} />}
        {data.enrollHealthInsurance === "no" && (
          <>
            <ReadOnlyRow label={t("reason")} value={data.notEnrollingReason === "spouse" ? t("covered_by_spouse") : data.notEnrollingReason === "private" ? t("private_insurance") : ""} />
            <FilesView files={data.insuranceProof} fieldPrefix="insuranceProof" />
          </>
        )}
        {data.dependents.length > 0 && (
          <div className="bg-muted/30 rounded-lg p-2.5 space-y-1">
            <p className="text-[10px] font-semibold text-muted-foreground">{t("dependents")} ({data.dependents.length})</p>
            {data.dependents.map((dep, i) => (
              <div key={i} className="flex justify-between text-[10px]">
                <span className="text-card-foreground">{dep.name}</span>
                <span className="text-muted-foreground">{dep.relationship}</span>
              </div>
            ))}
          </div>
        )}
      </SectionBlock>
      <div className="border-t border-border" />
      <SectionBlock icon={UtensilsCrossed} title={t("lunch_ticket")}>
        <ReadOnlyRow label={t("enrolled")} value={data.enrollRestaurantTicket === "yes" ? t("yes") : data.enrollRestaurantTicket === "no" ? t("no") : ""} />
      </SectionBlock>
    </div>
  );

  const renderDeclarationView = () => (
    <div className="space-y-4">
      {/* Provident Insurance */}
      <SectionBlock icon={ShieldCheck} title={t("provident_insurance")}>
        <div className="border border-border rounded-xl bg-card p-3 space-y-1">
          <DocViewLink title={t("provident_booklet")} />
          <DocViewLink title={t("provident_beneficiary")} />
          <DocViewLink title={t("provident_due")} />
        </div>
      </SectionBlock>
      <div className="border-t border-border" />

      {/* Digiposte and Action Logement */}
      <SectionBlock icon={Building} title={t("digiposte_action_logement")}>
        <div className="border border-border rounded-xl bg-card p-3 space-y-1">
          <DocViewLink title={t("action_logement_sheet")} />
          <DocViewLink title={t("digiposte_letter")} />
        </div>
      </SectionBlock>
      <div className="border-t border-border" />

      {/* Acknowledgement of Documents */}
      <SectionBlock icon={FileText} title={t("acknowledgement_documents")}>
        <div className="border border-border rounded-xl bg-card p-3 space-y-2">
          <DocViewLink title={t("certificate_delivery")} />
          <ReadOnlyRow label={t("certificate_delivery")} value={data.certificateAccepted === true ? t("accepted") : data.certificateAccepted === false ? t("refused") : ""} />
        </div>
      </SectionBlock>
      <div className="border-t border-border" />

      <ReadOnlyRow label={t("agree_terms_conditions")} value={data.declarationAgreed ? t("yes") : t("no")} />
    </div>
  );

  const renderBenefitsEdit = () => (
    <div className="space-y-4">
      <SectionBlock icon={Heart} title={t("health_insurance")}>
        <Field label={t("enroll_health")}>
          <RadioGroup value={data.enrollHealthInsurance} onValueChange={v => handleDataUpdate({ enrollHealthInsurance: v })} className="flex gap-4">
            <div className="flex items-center gap-1.5"><RadioGroupItem value="yes" id="v-hi-yes" /><Label htmlFor="v-hi-yes" className="text-xs">{t("yes")}</Label></div>
            <div className="flex items-center gap-1.5"><RadioGroupItem value="no" id="v-hi-no" /><Label htmlFor="v-hi-no" className="text-xs">{t("no")}</Label></div>
          </RadioGroup>
        </Field>
        {data.enrollHealthInsurance === "yes" && (
          <>
            <Field label={t("coverage_type")}>
              <RadioGroup value={data.coverageType} onValueChange={v => handleDataUpdate({ coverageType: v })} className="flex gap-4">
                <div className="flex items-center gap-1.5"><RadioGroupItem value="individual" id="v-cov-ind" /><Label htmlFor="v-cov-ind" className="text-xs">{t("individual")}</Label></div>
                <div className="flex items-center gap-1.5"><RadioGroupItem value="family" id="v-cov-fam" /><Label htmlFor="v-cov-fam" className="text-xs">{t("family")}</Label></div>
              </RadioGroup>
            </Field>

            {data.coverageType === "family" && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs">{t("dependents")}</Label>
                  <Button variant="outline" size="sm" onClick={() => handleDataUpdate({ dependents: [...data.dependents, { name: "", relationship: "", dob: undefined }] })} className="gap-1 h-7 text-[10px]"><Plus className="w-3 h-3" /> {t("add")}</Button>
                </div>
                {data.dependents.map((dep, idx) => (
                  <div key={idx} className="bg-muted/30 rounded-lg p-2.5 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-medium text-muted-foreground">{t("dependents")} {idx + 1}</span>
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleDataUpdate({ dependents: data.dependents.filter((_, i) => i !== idx) })}><Trash2 className="w-3 h-3" /></Button>
                    </div>
                    <Input placeholder={t("full_name")} value={dep.name} onChange={e => { const deps = [...data.dependents]; deps[idx] = { ...deps[idx], name: e.target.value }; handleDataUpdate({ dependents: deps }); }} className="h-8 text-xs" />
                    <Select value={dep.relationship} onValueChange={v => { const deps = [...data.dependents]; deps[idx] = { ...deps[idx], relationship: v }; handleDataUpdate({ dependents: deps }); }}>
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
                        <Calendar mode="single" selected={dep.dob} onSelect={d => { const deps = [...data.dependents]; deps[idx] = { ...deps[idx], dob: d }; handleDataUpdate({ dependents: deps }); }} className="p-3 pointer-events-auto" />
                      </PopoverContent>
                    </Popover>
                  </div>
                ))}
              </div>
            )}

            {data.coverageType && (
              <div className="border border-border rounded-xl bg-muted/20 overflow-hidden">
                <div className="bg-primary/5 p-2.5 text-center border-b border-border">
                  <img src={smythsLogo} alt="" className="w-8 h-8 mx-auto mb-1 object-contain" />
                  <h4 className="font-bold text-xs text-card-foreground">{t("insurance_enrollment_form")}</h4>
                </div>
                <div className="p-2.5 text-xs space-y-1">
                  <div className="flex justify-between"><span className="text-muted-foreground">{t("employee")}</span><span className="font-medium">{data.firstName} {data.lastName}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">{t("coverage_type")}</span><span className="font-medium capitalize">{t(data.coverageType)}</span></div>
                  {data.dependents.length > 0 && <div className="flex justify-between"><span className="text-muted-foreground">{t("dependents")}</span><span className="font-medium">{data.dependents.length}</span></div>}
                  <div className="flex justify-between"><span className="text-muted-foreground">{t("status")}</span><span className="font-medium text-accent">{t("ready_to_send")}</span></div>
                </div>
                <div className="border-t border-border p-2">
                  <Button variant="outline" size="sm" className="w-full gap-1 h-7 text-[10px]"><Download className="w-3 h-3" /> {t("download_enrollment_pdf")}</Button>
                </div>
              </div>
            )}
          </>
        )}
        {data.enrollHealthInsurance === "no" && (
          <>
            <Field label={t("reason")}>
              <Select value={data.notEnrollingReason} onValueChange={v => handleDataUpdate({ notEnrollingReason: v })}>
                <SelectTrigger className="h-9 text-xs"><SelectValue placeholder={t("select")} /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="spouse">{t("covered_by_spouse")}</SelectItem>
                  <SelectItem value="private">{t("private_insurance")}</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <MultiFileUpload label={t("upload_insurance_proof")} files={data.insuranceProof} onFilesChange={f => handleDataUpdate({ insuranceProof: f })} />
          </>
        )}
      </SectionBlock>
      <div className="border-t border-border" />
      <SectionBlock icon={UtensilsCrossed} title={t("lunch_ticket")}>
        <Field label={t("enroll_lunch_ticket")}>
          <RadioGroup value={data.enrollRestaurantTicket} onValueChange={v => handleDataUpdate({ enrollRestaurantTicket: v })} className="flex gap-4">
            <div className="flex items-center gap-1.5"><RadioGroupItem value="yes" id="v-rt-yes" /><Label htmlFor="v-rt-yes" className="text-sm">{t("yes")}</Label></div>
            <div className="flex items-center gap-1.5"><RadioGroupItem value="no" id="v-rt-no" /><Label htmlFor="v-rt-no" className="text-sm">{t("no")}</Label></div>
          </RadioGroup>
        </Field>
      </SectionBlock>
    </div>
  );

  const sectionContent = [
    { view: renderPersonalView, edit: renderPersonalEdit },
    { view: renderDocumentsView, edit: renderDocumentsEdit },
    { view: renderBankView, edit: renderBankEdit },
    { view: renderContractSection, edit: renderContractSection },
    { view: renderBenefitsView, edit: renderBenefitsEdit },
    { view: renderDeclarationView, edit: renderDeclarationView },
  ];

  const canEdit = activeSection !== 3 && activeSection !== 5;
  const stageNum = activeSection + 1;
  const approvalStatus = data.stageApprovalStatus[stageNum] || "none";
  const hasRejectedIdentity = Boolean(data.rejectedDocuments?.identityDoc?.rejected);

  return (
    <div className="min-h-screen bg-card flex flex-col">
      <div className="sticky top-0 z-20 smyths-gradient px-4 pt-3 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => {
              if (contractResigning) { setContractResigning(false); return; }
              if (bankAdding) { setBankAdding(false); return; }
              if (editing) { setEditing(false); setHasChanges(false); setSsnRequired(false); return; }
              navigate("/dashboard");
            }} className="w-7 h-7 rounded-full bg-primary-foreground/15 flex items-center justify-center">
              <ArrowLeft className="w-3.5 h-3.5 text-primary-foreground" />
            </button>
            <img src={smythsLogo} alt="Smyths" className="w-8 h-8 object-contain" />
            <h1 className="text-primary-foreground font-bold text-sm">
              {contractResigning ? t("reagree_contract") : bankAdding ? t("new_bank_details") : t("my_onboarding")}
            </h1>
          </div>
          {!editing && !contractResigning && !bankAdding && canEdit && (
            <button onClick={() => setEditing(true)} className="h-7 px-3 rounded-full bg-primary-foreground/15 flex items-center justify-center gap-1">
              <Pencil className="w-3 h-3 text-primary-foreground" />
              <span className="text-[10px] font-semibold text-primary-foreground">{t("edit")}</span>
            </button>
          )}
        </div>
      </div>

      {contractResigning ? (
        <div className="px-0 flex-1">
          <div className="bg-card rounded-none sm:rounded-2xl shadow-xl p-4 min-h-[calc(100vh-60px)]">
            {renderContractResignFlow()}
            <div className="flex gap-2 mt-6">
              <Button variant="outline" onClick={() => setContractResigning(false)} className="flex-1 h-9 rounded-lg text-xs gap-1">
                <X className="w-3.5 h-3.5" /> {t("back")}
              </Button>
            </div>
          </div>
        </div>
      ) : bankAdding ? (
        <div className="px-0 flex-1">
          <div className="bg-card rounded-none sm:rounded-2xl shadow-xl p-4 min-h-[calc(100vh-60px)]">
            {renderBankAddFlow()}
            <div className="flex gap-2 mt-6">
              <Button variant="outline" onClick={() => setBankAdding(false)} className="flex-1 h-9 rounded-lg text-xs gap-1">
                <X className="w-3.5 h-3.5" /> {t("back")}
              </Button>
            </div>
          </div>
        </div>
      ) : editing ? (
        <div className="px-0 flex-1">
          <div className="bg-card rounded-none sm:rounded-2xl shadow-xl p-4 min-h-[calc(100vh-60px)]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-sm text-card-foreground">{t(sectionConfig[activeSection].labelKey)} {t("details")}</h2>
              <div className="flex items-center gap-1.5">
                {activeSection === 1 && hasRejectedIdentity && (
                  <Badge className="bg-destructive/10 text-destructive border-destructive/40 text-[9px] h-5 gap-1">
                    <AlertTriangle className="w-3 h-3" /> {t("rejected")}
                  </Badge>
                )}
                <Badge variant="outline" className="text-[9px] h-5 border-primary text-primary">{t("editing")}</Badge>
              </div>
            </div>
            {sectionContent[activeSection].edit()}
            <div className="flex gap-2 mt-6">
              <Button variant="outline" onClick={() => { setEditing(false); setHasChanges(false); setSsnRequired(false); }} className="flex-1 h-9 rounded-lg text-xs gap-1">
                <X className="w-3.5 h-3.5" /> {t("cancel")}
              </Button>
              <Button onClick={handleSave} disabled={ssnRequired && !data.socialSecurityNumber} className="flex-1 h-9 rounded-lg text-xs font-semibold gap-1">
                <Save className="w-3.5 h-3.5" /> {t("save")}
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-1 overflow-hidden">
          <div className="w-16 border-r border-border bg-card shrink-0 sticky top-0 self-start h-[calc(100vh-60px)]">
            {sectionConfig.map(({ icon: Icon, labelKey }, i) => {
              const sStatus = data.stageApprovalStatus[i + 1] || "none";
              return (
                <button
                  key={labelKey}
                  onClick={() => setActiveSection(i)}
                  className={`w-full py-4 flex flex-col items-center gap-1 transition-all border-l-2 relative ${
                    activeSection === i ? "bg-primary/5 border-primary text-primary" : "border-transparent text-muted-foreground hover:bg-muted/50"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-[8px] font-medium leading-tight text-center">{t(labelKey)}</span>
                  {sStatus === "pending" && <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-yellow-400" />}
                  {sStatus === "approved" && <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-400" />}
                  {i === 3 && data.needsResign && <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500 animate-pulse" />}
                  {i === 1 && data.rejectedDocuments?.identityDoc?.rejected && <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-destructive animate-pulse" />}
                </button>
              );
            })}
          </div>

          <div className="flex-1 p-4 overflow-y-auto h-[calc(100vh-60px)]">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-xs text-card-foreground">{t(sectionConfig[activeSection].labelKey)} {t("details")}</h2>
              <StatusBadge status={approvalStatus} t={t} rejected={activeSection === 1 && hasRejectedIdentity} />
            </div>
            <div className="bg-card rounded-xl border border-border p-3">
              {sectionContent[activeSection].view()}
            </div>
          </div>
        </div>
      )}

      <Dialog open={genderChangePrompt} onOpenChange={setGenderChangePrompt}>
        <DialogContent className="max-w-sm">
          <div className="space-y-4 text-center">
            <div className="w-12 h-12 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-bold text-sm">{t("gender_change_title")}</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">{t("gender_change_desc")}</p>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setGenderChangePrompt(false)} className="flex-1 text-xs h-9">{t("cancel")}</Button>
              <Button onClick={confirmGenderChange} className="flex-1 text-xs h-9">{t("confirm_change")}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OnboardingView;
