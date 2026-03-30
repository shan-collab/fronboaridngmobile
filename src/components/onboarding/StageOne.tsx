import { useOnboarding, EmergencyContact, DependentChild } from "@/context/OnboardingContext";
import { useLanguage } from "@/context/LanguageContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { format, differenceInYears } from "date-fns";
import { CalendarIcon, User, Briefcase, MapPin, Phone, CreditCard, Shield, Plus, Trash2, Users, ClipboardList, Zap, Sparkles, AlertTriangle } from "lucide-react";
import MultiFileUpload from "./MultiFileUpload";
import MaskedInput from "./MaskedInput";
import HelpIcon from "./HelpIcon";
import { useState, useMemo, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface StageOneProps { onNext: () => void; }

const Section = ({ icon: Icon, title, helpText, children }: { icon: any; title: string; helpText?: string; children: React.ReactNode }) => (
  <div className="space-y-3">
    <div className="flex items-center gap-2">
      <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center">
        <Icon className="w-3.5 h-3.5 text-primary" />
      </div>
      <h3 className="font-semibold text-xs text-card-foreground">{title}</h3>
      {helpText && <HelpIcon content={helpText} />}
    </div>
    <div className="space-y-2.5">{children}</div>
  </div>
);

const Field = ({ label, required, tooltip, children }: { label: string; required?: boolean; tooltip?: string; children: React.ReactNode }) => (
  <div className="space-y-1">
    <div className="flex items-center gap-1">
      <Label className="text-[11px] text-muted-foreground">{label}{required && <span className="text-destructive ml-0.5">*</span>}</Label>
      {tooltip && <HelpIcon content={tooltip} />}
    </div>
    {children}
  </div>
);

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

const StageOne = ({ onNext }: StageOneProps) => {
  const { data, updateData } = useOnboarding();
  const { t } = useLanguage();
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [showQuickFill, setShowQuickFill] = useState(false);
  const [underageBlocked, setUnderageBlocked] = useState(false);

  useEffect(() => {
    if (!data.birthName && data.firstName && data.lastName) {
      updateData({ birthName: `${data.firstName} ${data.lastName}` });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const touch = (field: string) => setTouched(prev => ({ ...prev, [field]: true }));

  const handleUpdate = (updates: Partial<typeof data>) => {
    updateData(updates);
  };

  // Check age when DOB changes
  useEffect(() => {
    if (data.dateOfBirth) {
      const age = differenceInYears(new Date(), data.dateOfBirth);
      setUnderageBlocked(age < 16);
    } else {
      setUnderageBlocked(false);
    }
  }, [data.dateOfBirth]);

  const addEmergencyContact = () => {
    if (data.emergencyContacts.length >= 2) return;
    handleUpdate({
      emergencyContacts: [...data.emergencyContacts, { name: "", phone: "", phoneCode: "+33", relationship: "" }],
    });
  };

  const updateEmergencyContact = (idx: number, field: keyof EmergencyContact, value: string) => {
    const contacts = [...data.emergencyContacts];
    contacts[idx] = { ...contacts[idx], [field]: value };
    handleUpdate({ emergencyContacts: contacts });
  };

  const removeEmergencyContact = (idx: number) => {
    handleUpdate({ emergencyContacts: data.emergencyContacts.filter((_, i) => i !== idx) });
  };

  const handleChildrenCountChange = (count: number) => {
    const current = data.dependentChildren;
    if (count > current.length) {
      const newChildren = [...current];
      for (let i = current.length; i < count; i++) {
        newChildren.push({ fullName: "", gender: "", dateOfBirth: undefined });
      }
      handleUpdate({ numberOfDependentChildren: count, dependentChildren: newChildren });
    } else {
      handleUpdate({ numberOfDependentChildren: count, dependentChildren: current.slice(0, count) });
    }
  };

  const updateDependentChild = (idx: number, field: keyof DependentChild, value: any) => {
    const children = [...data.dependentChildren];
    children[idx] = { ...children[idx], [field]: value };
    handleUpdate({ dependentChildren: children });
  };

  const isValid = useMemo(() => {
    if (underageBlocked) return false;
    const hasEmergency = data.emergencyContacts.length > 0 &&
      data.emergencyContacts[0].name && data.emergencyContacts[0].phone && data.emergencyContacts[0].relationship;
    const hasAddress = data.streetName;
    const hasSS = data.hasSocialSecurity === "yes"
      ? (data.socialSecurityNumber && data.socialSecurityProof.length > 0)
      : data.hasSocialSecurity === "no"
        ? true
        : false;
    return !!(data.firstName && data.lastName && data.birthName && data.dateOfBirth && data.placeOfBirth && data.gender &&
      data.nationality && data.email && data.mobileNumber && hasAddress &&
      data.city && data.postalCode && hasEmergency && hasSS);
  }, [data, underageBlocked]);

  const showErr = (field: string, value: any) => touched[field] && !value;

  const genderOptions = [
    { value: "Male", key: "male" }, { value: "Female", key: "female" },
  ];
  const relationshipOptions = [
    { value: "Spouse", key: "spouse" }, { value: "Parent", key: "parent" },
    { value: "Sibling", key: "sibling" }, { value: "Friend", key: "friend" }, { value: "Other", key: "other" },
  ];
  const maritalStatusOptions = [
    { value: "Single", key: "single" }, { value: "Married", key: "married" },
    { value: "Cohabiting", key: "cohabiting" }, { value: "Civil Partnership (PACS)", key: "civil_partnership" },
    { value: "Divorced", key: "divorced" },
  ];

  const cityOptions = cityOptionsMap[data.country] || [];

  // Underage block screen
  if (underageBlocked) {
    return (
      <div className="space-y-6 py-8">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-destructive" />
          </div>
          <h2 className="text-lg font-bold text-card-foreground">{t("underage_block_title")}</h2>
          <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">{t("underage_block_desc")}</p>
          <div className="bg-destructive/5 border border-destructive/20 rounded-xl p-4 max-w-xs">
            <p className="text-xs text-destructive font-medium">{t("underage_block_contact")}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Personal Information */}
      <Section icon={User} title={t("personal_info")} helpText={t("help_personal_info")}>
        {/* Quick Fill Feature */}
        <div className="border border-dashed border-primary/20 rounded-lg bg-gradient-to-r from-primary/5 to-accent/5 overflow-hidden">
          <button
            onClick={() => setShowQuickFill(!showQuickFill)}
            className="w-full flex items-center gap-2 px-3 py-2 hover:bg-primary/5 transition-colors"
          >
            <div className="relative shrink-0">
              <div className="w-6 h-6 rounded-md bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Zap className="w-3 h-3 text-primary-foreground" />
              </div>
              <Sparkles className="w-2.5 h-2.5 text-accent absolute -top-0.5 -right-0.5 animate-pulse" />
            </div>
            <span className="text-[11px] font-semibold text-card-foreground">{t("quick_fill")}</span>
            {data.quickFillDoc.length > 0 && (
              <span className="text-[9px] text-emerald-600 font-medium ml-1">✓ {t("autofill_applied")}</span>
            )}
            <div className={cn("w-4 h-4 rounded-full border flex items-center justify-center ml-auto transition-transform shrink-0", showQuickFill ? "border-primary rotate-180" : "border-muted-foreground/30")}>
              <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </div>
          </button>

          {showQuickFill && (
            <div className="px-3 pb-2.5 space-y-2 border-t border-primary/10">
              <div className="pt-2">
                <Field label={t("select_doc_type")} required>
                  <Select value={data.quickFillDocType} onValueChange={v => handleUpdate({ quickFillDocType: v })}>
                    <SelectTrigger className="h-8 text-xs"><SelectValue placeholder={t("select")} /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="national_id">{t("national_id")}</SelectItem>
                      <SelectItem value="passport">{t("passport")}</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              </div>
              {data.quickFillDocType && (
                <MultiFileUpload
                  label={t("upload_for_autofill")}
                  files={data.quickFillDoc}
                  onFilesChange={f => {
                    handleUpdate({ quickFillDoc: f });
                    if (f.length > 0 && !data.gender) {
                      handleUpdate({
                        quickFillDoc: f,
                        gender: "Male",
                        dateOfBirth: new Date("1993-05-31"),
                        placeOfBirth: "Lyon",
                        birthDepartmentNumber: "69",
                        nationality: "French",
                        streetNumber: "12",
                        streetName: "Rue de la République",
                        city: "Lyon",
                        postalCode: "69002",
                        country: "France",
                      });
                      setShowQuickFill(false);
                      toast.success(t("autofill_applied"), { duration: 3000 });
                    }
                  }}
                  hint={t("clear_photo_hint")}
                />
              )}
              <p className="text-[9px] text-muted-foreground">💡 {t("quick_fill_note")}</p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <Field label={t("first_name_given")} required>
            <Input value={data.firstName} onChange={e => handleUpdate({ firstName: e.target.value })} onBlur={() => touch("firstName")} className={cn("h-8 text-xs", showErr("firstName", data.firstName) && "border-destructive")} />
          </Field>
          <Field label={t("last_name_surname")} required>
            <Input value={data.lastName} onChange={e => handleUpdate({ lastName: e.target.value })} onBlur={() => touch("lastName")} className={cn("h-8 text-xs", showErr("lastName", data.lastName) && "border-destructive")} />
          </Field>
        </div>
        <Field label={t("birth_name")} required>
          <Input value={data.birthName} onChange={e => handleUpdate({ birthName: e.target.value })} onBlur={() => touch("birthName")} className={cn("h-8 text-xs", showErr("birthName", data.birthName) && "border-destructive")} placeholder={t("birth_name_placeholder")} />
        </Field>
        <Field label={t("gender")} required>
          <Select value={data.gender} onValueChange={v => handleUpdate({ gender: v })}>
            <SelectTrigger className="h-8 text-xs"><SelectValue placeholder={t("select")} /></SelectTrigger>
            <SelectContent>{genderOptions.map(g => <SelectItem key={g.value} value={g.value}>{t(g.key)}</SelectItem>)}</SelectContent>
          </Select>
        </Field>
        <div className="grid grid-cols-2 gap-2.5">
          <Field label={t("date_of_birth")} required>
            <Popover>
              <PopoverTrigger asChild>
                 <Button variant="outline" className={cn("w-full justify-start text-left font-normal h-8 text-xs", !data.dateOfBirth && "text-muted-foreground")}>
                   <CalendarIcon className="mr-1.5 h-3.5 w-3.5" />
                   {data.dateOfBirth ? format(data.dateOfBirth, "dd/MM/yyyy") : t("select")}
                 </Button>
               </PopoverTrigger>
               <PopoverContent className="w-auto p-0" align="start">
                 <Calendar mode="single" selected={data.dateOfBirth} onSelect={d => handleUpdate({ dateOfBirth: d })} className="p-3 pointer-events-auto" />
               </PopoverContent>
             </Popover>
           </Field>
           <Field label={t("place_of_birth")} required>
             <Input value={data.placeOfBirth} onChange={e => handleUpdate({ placeOfBirth: e.target.value })} onBlur={() => touch("placeOfBirth")} className={cn("h-8 text-xs", showErr("placeOfBirth", data.placeOfBirth) && "border-destructive")} placeholder={t("city")} />
          </Field>
        </div>
        <Field label={t("birth_department_number")}>
          <Input value={data.birthDepartmentNumber} onChange={e => handleUpdate({ birthDepartmentNumber: e.target.value })} className="h-8 text-xs" placeholder="e.g. 75" />
        </Field>
        <Field label={t("nationality")} required>
          <Select value={data.nationality} onValueChange={v => { handleUpdate({ nationality: v }); touch("nationality"); }}>
            <SelectTrigger className={cn("h-8 text-xs", showErr("nationality", data.nationality) && "border-destructive")}><SelectValue placeholder={t("select")} /></SelectTrigger>
            <SelectContent>
              {[
                { value: "French", key: "nat_french" },
                { value: "German", key: "nat_german" },
                { value: "British", key: "nat_british" },
                { value: "Spanish", key: "nat_spanish" },
                { value: "Italian", key: "nat_italian" },
                { value: "Portuguese", key: "nat_portuguese" },
                { value: "Belgian", key: "nat_belgian" },
                { value: "Dutch", key: "nat_dutch" },
                { value: "Polish", key: "nat_polish" },
                { value: "Romanian", key: "nat_romanian" },
                { value: "American", key: "nat_american" },
                { value: "Canadian", key: "nat_canadian" },
                { value: "Moroccan", key: "nat_moroccan" },
                { value: "Algerian", key: "nat_algerian" },
                { value: "Tunisian", key: "nat_tunisian" },
                { value: "Turkish", key: "nat_turkish" },
                { value: "Indian", key: "nat_indian" },
                { value: "Chinese", key: "nat_chinese" },
                { value: "Brazilian", key: "nat_brazilian" },
                { value: "Other", key: "other" },
              ].map(n => <SelectItem key={n.value} value={n.value}>{t(n.key)}</SelectItem>)}
            </SelectContent>
          </Select>
        </Field>
        <Field label={t("email")} required>
          <Input type="email" value={data.email} onChange={e => handleUpdate({ email: e.target.value })} onBlur={() => touch("email")} className={cn("h-8 text-xs", showErr("email", data.email) && "border-destructive")} />
        </Field>
        <div className="flex items-center gap-2">
          <Checkbox
            id="email-adp"
            checked={data.emailForADP}
            onCheckedChange={(checked) => handleUpdate({ emailForADP: !!checked })}
          />
          <Label htmlFor="email-adp" className="text-[11px] text-muted-foreground cursor-pointer">
            {t("email_for_adp")}
          </Label>
        </div>
        <Field label={t("phone_number")} required>
          <Input value={data.mobileNumber} onChange={e => handleUpdate({ mobileNumber: e.target.value })} className="h-8 text-xs" placeholder={t("enter_phone_number")} />
        </Field>
      </Section>

      <div className="border-t border-border" />

      {/* Address Section */}
      <Section icon={MapPin} title={t("address")} helpText={t("help_address")}>
        <div className="grid grid-cols-2 gap-2.5">
          <Field label={t("street_number")}>
            <Input value={data.streetNumber} onChange={e => handleUpdate({ streetNumber: e.target.value })} className="h-8 text-xs" placeholder="e.g. 12" />
          </Field>
          <Field label={t("building_identifier")}>
            <Input value={data.buildingIdentifier} onChange={e => handleUpdate({ buildingIdentifier: e.target.value })} className="h-8 text-xs" placeholder="e.g. Bât. A" />
          </Field>
        </div>
        <Field label={t("street_name")} required>
          <Textarea 
            value={data.streetName} 
            onChange={e => handleUpdate({ streetName: e.target.value })} 
            onBlur={() => touch("streetName")} 
            className={cn("text-xs min-h-[5rem] resize-none", showErr("streetName", data.streetName) && "border-destructive")} 
            placeholder="e.g. Rue de la République" 
            rows={3}
          />
        </Field>
        <Field label={t("country")}>
          <Select value={data.country} onValueChange={v => { handleUpdate({ country: v, city: "" }); }}>
            <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              {[{ value: "France", key: "france" }, { value: "Germany", key: "germany" }, { value: "UK", key: "uk" }, { value: "Spain", key: "spain" }, { value: "Italy", key: "italy" }].map(c =>
                <SelectItem key={c.value} value={c.value}>{t(c.key)}</SelectItem>
              )}
            </SelectContent>
          </Select>
        </Field>
        <div className="grid grid-cols-2 gap-2.5">
           <Field label={t("city")} required>
             <Select value={data.city} onValueChange={v => handleUpdate({ city: v })}>
               <SelectTrigger className={cn("h-8 text-xs", showErr("city", data.city) && "border-destructive")}>
                 <SelectValue placeholder={t("select")} />
               </SelectTrigger>
               <SelectContent>
                 {cityOptions.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
               </SelectContent>
             </Select>
           </Field>
           <Field label={t("postal_code")} required><Input value={data.postalCode} onChange={e => handleUpdate({ postalCode: e.target.value })} onBlur={() => touch("postalCode")} className={cn("h-8 text-xs", showErr("postalCode", data.postalCode) && "border-destructive")} /></Field>
        </div>
      </Section>

      <div className="border-t border-border" />

      {/* Job Information */}
      <Section icon={Briefcase} title={t("job_info")} helpText={t("help_job_info")}>
        <div className="grid grid-cols-2 gap-2.5">
           <Field label={t("job_role")}><Input value={data.jobRole} readOnly className="h-8 bg-muted text-muted-foreground text-xs" /></Field>
           <Field label={t("contract_type")}><Input value={data.contractType} readOnly className="h-8 bg-muted text-muted-foreground text-xs" /></Field>
         </div>
         <div className="grid grid-cols-2 gap-2.5">
           <Field label={t("start_date")}><Input value={data.startDate ? format(data.startDate, "dd/MM/yyyy") : ""} readOnly className="h-8 bg-muted text-muted-foreground text-xs" /></Field>
           <Field label={t("location")}><Input value={data.storeLocation} readOnly className="h-8 bg-muted text-muted-foreground text-xs" /></Field>
        </div>
      </Section>

      <div className="border-t border-border" />

      {/* Social Security Detail */}
      <Section icon={CreditCard} title={t("social_security_detail")} helpText={t("help_social_security")}>
        <Field label={t("ssn_question")} required>
          <RadioGroup value={data.hasSocialSecurity} onValueChange={v => handleUpdate({ hasSocialSecurity: v })} className="space-y-2">
            <div className="flex items-center gap-2"><RadioGroupItem value="yes" id="ss-yes" /><Label htmlFor="ss-yes" className="text-xs cursor-pointer">{t("yes")}</Label></div>
            <div className="flex items-center gap-2"><RadioGroupItem value="no" id="ss-no" /><Label htmlFor="ss-no" className="text-xs cursor-pointer">{t("no")}</Label></div>
          </RadioGroup>
        </Field>
        {data.hasSocialSecurity === "yes" && (
          <div className="space-y-2">
            <Field label={t("ssn")} required>
              <MaskedInput value={data.socialSecurityNumber} onChange={v => handleUpdate({ socialSecurityNumber: v })} placeholder="Enter your NIR" />
            </Field>
            <MultiFileUpload label={t("upload_ss_proof")} files={data.socialSecurityProof} onFilesChange={f => handleUpdate({ socialSecurityProof: f })} hint={t("cpam_proof")} />
          </div>
        )}
        {data.hasSocialSecurity === "no" && (
          <div className="flex items-start gap-2 p-2.5 bg-muted/30 rounded-lg border border-border">
            <Shield className="w-3.5 h-3.5 text-muted-foreground shrink-0 mt-0.5" />
            <p className="text-[10px] text-muted-foreground leading-relaxed">{t("add_ssn_later")}</p>
          </div>
        )}
        <div className="flex items-start gap-2 p-2.5 bg-primary/5 rounded-lg border border-primary/10">
          <Shield className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
          <p className="text-[10px] text-muted-foreground leading-relaxed">{t("data_protection_note")}</p>
        </div>
      </Section>

      <div className="border-t border-border" />

      {/* Family Composition */}
      <Section icon={Users} title={t("family_composition")} helpText={t("help_family")}>
        <Field label={t("marital_status_question")}>
          <Select value={data.maritalStatusType} onValueChange={v => handleUpdate({ maritalStatus: "yes", maritalStatusType: v })}>
            <SelectTrigger className="h-8 text-xs"><SelectValue placeholder={t("select")} /></SelectTrigger>
            <SelectContent>{maritalStatusOptions.map(m => <SelectItem key={m.value} value={m.value}>{t(m.key)}</SelectItem>)}</SelectContent>
          </Select>
        </Field>
        <Field label={t("number_of_dependent_children")}>
          <Select value={String(data.numberOfDependentChildren)} onValueChange={v => handleChildrenCountChange(parseInt(v))}>
            <SelectTrigger className="h-8 text-xs w-24">
              <SelectValue>{data.numberOfDependentChildren}</SelectValue>
            </SelectTrigger>
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
            <Field label={t("full_name")}>
              <Input value={child.fullName} onChange={e => updateDependentChild(idx, "fullName", e.target.value)} className="h-8 text-xs" />
            </Field>
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
      </Section>

      <div className="border-t border-border" />

      {/* Emergency Contact */}
      <Section icon={Phone} title={t("emergency_contact")} helpText={t("help_emergency")}>
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
            <Field label={t("contact_name")} required>
              <Input value={contact.name} onChange={e => updateEmergencyContact(idx, "name", e.target.value)} className="h-8 text-xs" />
            </Field>
            <Field label={t("phone_number")} required>
              <Input value={contact.phone} onChange={e => updateEmergencyContact(idx, "phone", e.target.value)} className="h-8 text-xs" placeholder={t("enter_phone_number")} />
            </Field>
            <Field label={t("relationship")} required>
              <Select value={contact.relationship} onValueChange={v => updateEmergencyContact(idx, "relationship", v)}>
                <SelectTrigger className="h-8 text-xs"><SelectValue placeholder={t("select")} /></SelectTrigger>
                <SelectContent>{relationshipOptions.map(r => <SelectItem key={r.value} value={r.value}>{t(r.key)}</SelectItem>)}</SelectContent>
              </Select>
            </Field>
          </div>
        ))}
        {data.emergencyContacts.length < 2 ? (
          <Button variant="outline" size="sm" onClick={addEmergencyContact} className="w-full gap-1 h-8 text-xs">
            <Plus className="w-3 h-3" /> {t("add_contact")}
          </Button>
        ) : (
          <p className="text-[10px] text-muted-foreground text-center">{t("max_contacts_reached")}</p>
        )}
      </Section>

      <div className="border-t border-border" />

      {/* Additional Details */}
      <Section icon={ClipboardList} title={t("additional_details")} helpText={t("help_additional_details")}>
        <Field label={t("rqth_recognition")} tooltip={t("tooltip_rqth")}>
          <RadioGroup value={data.rqthRecognition} onValueChange={v => handleUpdate({ rqthRecognition: v })} className="flex gap-4">
            <div className="flex items-center gap-1.5"><RadioGroupItem value="yes" id="rqth-yes" /><Label htmlFor="rqth-yes" className="text-xs">{t("yes")}</Label></div>
            <div className="flex items-center gap-1.5"><RadioGroupItem value="no" id="rqth-no" /><Label htmlFor="rqth-no" className="text-xs">{t("no")}</Label></div>
          </RadioGroup>
        </Field>
        {data.rqthRecognition === "yes" && (
          <MultiFileUpload label={t("upload_rqth_doc")} files={data.rqthDocument} onFilesChange={f => handleUpdate({ rqthDocument: f })} />
        )}

        <Field label={t("first_aid_training")} tooltip={t("tooltip_first_aid")}>
          <RadioGroup value={data.firstAidTraining} onValueChange={v => handleUpdate({ firstAidTraining: v })} className="flex gap-4">
            <div className="flex items-center gap-1.5"><RadioGroupItem value="yes" id="fa-yes" /><Label htmlFor="fa-yes" className="text-xs">{t("yes")}</Label></div>
            <div className="flex items-center gap-1.5"><RadioGroupItem value="no" id="fa-no" /><Label htmlFor="fa-no" className="text-xs">{t("no")}</Label></div>
          </RadioGroup>
        </Field>
        {data.firstAidTraining === "yes" && (
          <MultiFileUpload label={t("upload_first_aid_doc")} files={data.firstAidDocument} onFilesChange={f => handleUpdate({ firstAidDocument: f })} />
        )}

        <Field label={t("electrical_safety_training")} tooltip={t("tooltip_electrical")}>
          <RadioGroup value={data.electricalSafetyTraining} onValueChange={v => handleUpdate({ electricalSafetyTraining: v })} className="flex gap-4">
            <div className="flex items-center gap-1.5"><RadioGroupItem value="yes" id="es-yes" /><Label htmlFor="es-yes" className="text-xs">{t("yes")}</Label></div>
            <div className="flex items-center gap-1.5"><RadioGroupItem value="no" id="es-no" /><Label htmlFor="es-no" className="text-xs">{t("no")}</Label></div>
          </RadioGroup>
        </Field>
        {data.electricalSafetyTraining === "yes" && (
          <MultiFileUpload label={t("upload_electrical_doc")} files={data.electricalSafetyDocument} onFilesChange={f => handleUpdate({ electricalSafetyDocument: f })} />
        )}

        <Field label={t("solidarity_day_certificate")} tooltip={t("tooltip_solidarity")}>
          <RadioGroup value={data.solidarityDayCertificate} onValueChange={v => handleUpdate({ solidarityDayCertificate: v })} className="flex gap-4">
            <div className="flex items-center gap-1.5"><RadioGroupItem value="yes" id="sd-yes" /><Label htmlFor="sd-yes" className="text-xs">{t("yes")}</Label></div>
            <div className="flex items-center gap-1.5"><RadioGroupItem value="no" id="sd-no" /><Label htmlFor="sd-no" className="text-xs">{t("no")}</Label></div>
          </RadioGroup>
        </Field>
        {data.solidarityDayCertificate === "yes" && (
          <MultiFileUpload label={t("upload_solidarity_doc")} files={data.solidarityDayDocument} onFilesChange={f => handleUpdate({ solidarityDayDocument: f })} />
        )}
      </Section>

      <Button onClick={onNext} disabled={!isValid} className="w-full h-8 rounded-lg text-xs font-semibold disabled:opacity-40">
        {t("save_continue")}
      </Button>
    </div>
  );
};

export default StageOne;
