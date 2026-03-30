import React, { createContext, useContext, useState, ReactNode } from "react";

export interface ContractVersion {
  id: string;
  label: string;
  startDate: Date;
  endDate?: Date;
  signedByEmployee: boolean;
  signedByCompany: boolean;
  signatureData?: string;
  signedAt?: Date;
  status: "active" | "extended" | "expired";
}

export type ApprovalStatus = "none" | "pending" | "approved";

export interface EmergencyContact {
  name: string;
  phone: string;
  phoneCode: string;
  relationship: string;
}

export interface DependentChild {
  fullName: string;
  gender: string;
  dateOfBirth: Date | undefined;
}

export interface OnboardingData {
  // Stage 1
  title: string;
  firstName: string;
  lastName: string;
  birthName: string;
  dateOfBirth: Date | undefined;
  placeOfBirth: string;
  birthDepartmentNumber: string;
  gender: string;
  nationality: string;
  email: string;
  emailForADP: boolean;
  mobileCode: string;
  mobileNumber: string;
  jobRole: string;
  contractType: string;
  startDate: Date | undefined;
  storeLocation: string;
  // Quick Fill
  quickFillDocType: string;
  quickFillDoc: File[];
  // Address split
  streetNumber: string;
  buildingIdentifier: string;
  streetName: string;
  streetAddress: string;
  city: string;
  postalCode: string;
  country: string;
  emergencyContacts: EmergencyContact[];
  socialSecurityNumber: string;
  hasSocialSecurity: string;
  socialSecurityReason: string;
  socialSecurityProof: File[];
  previousSSNs: Array<{ number: string; gender: string; changedAt: Date }>;
  // Family Composition
  maritalStatus: string;
  maritalStatusType: string;
  numberOfDependentChildren: number;
  dependentChildren: DependentChild[];
  // Additional Declarations
  rqthRecognition: string;
  rqthDocument: File[];
  firstAidTraining: string;
  firstAidDocument: File[];
  electricalSafetyTraining: string;
  electricalSafetyDocument: File[];
  solidarityDayCertificate: string;
  solidarityDayDocument: File[];
  // Stage 2
  identityDocType: string;
  identityDoc: File[];
  identityDocFront: File[];
  identityDocBack: File[];
  identityDocNumber: string;
  identityDocExpiry: Date | undefined;
  identityDocCountry: string;
  identityUploadMethod: "upload" | "manual";
  isForeignWorker: string;
  workPermit: File[];
  workPermitExpiry: Date | undefined;
  workPermitNumber: string;
  workPermitIssuedBy: string;
  criminalRecord: File[];
  cpamProof: File[];
  documentsConfirmed: boolean;
  // Stage 3
  iban: string;
  ibanCountryCode: string;
  ibanCheckDigits: string;
  ibanBBAN: string;
  bic: string;
  accountHoldingBranch: string;
  ribDocument: File[];
  accountHolderName: string;
  bankCountry: string;
  bankEntryMethod: "upload" | "manual";
  // Stage 4
  contractSigned: boolean;
  dataProtectionAccepted: boolean;
  managerSigned: boolean;
  contractHistory: ContractVersion[];
  activeContractId: string;
  // Stage 4 - policy fields
  internalRulesConfirmed: boolean;
  codeOfConductConfirmed: boolean;
  contractDocConfirmed: boolean;
  dataProtectionCharterConfirmed: boolean;
  policyAgreed: boolean;
  // Stage 5
  enrollHealthInsurance: string;
  coverageType: string;
  dependents: Array<{ name: string; relationship: string; dob: Date | undefined }>;
  notEnrollingReason: string;
  insuranceProof: File[];
  enrollRestaurantTicket: string;
  // Insurance terms checkboxes (Yes path)
  insurancePracticalGuideChecked: boolean;
  insuranceMembershipTermsChecked: boolean;
  insuranceEmployeeContactChecked: boolean;
  insuranceTermsUnderstood: boolean;
  // Insurance exemption (No path)
  insuranceExemptionReason: string;
  insuranceExemptionProof: File[];
  cmuEndDate: Date | undefined;
  individualContractEndDate: Date | undefined;
  // Lunch ticket
  lunchTicketFormGenerated: boolean;
  // Declaration section
  declarationAgreed: boolean;
  certificateAccepted: boolean | null;
  // New bank details (pending approval)
  newBankDetails?: {
    iban: string;
    ribDocument: File[];
    accountHolderName: string;
    bankCountry: string;
  };
  // Approval & Status
  stageApprovalStatus: Record<number, ApprovalStatus>;
  contractExtended: boolean;
  needsResign: boolean;
  // Removed fields
  acknowledgementConfirmed: boolean;
  // Document rejection tracking
  rejectedDocuments: Record<string, { rejected: boolean; reason: string; fileName: string }>;
  // Stage 5 - health insurance doc read tracking
  healthInsuranceDocRead: boolean;
  // Stage 6 - doc read tracking
  providentDocsRead: Record<string, boolean>;
  digiposteDocsRead: Record<string, boolean>;
  acknowledgementDocRead: boolean;
}

const defaultData: OnboardingData = {
  title: "", firstName: "John", lastName: "Doe", birthName: "",
  dateOfBirth: undefined, placeOfBirth: "", birthDepartmentNumber: "",
  gender: "", nationality: "", email: "john.doe@smythstoys.com", emailForADP: true,
  mobileCode: "+33", mobileNumber: "612345678",
  jobRole: "Sales Associate", contractType: "Seasonal-Part Time",
  startDate: new Date("2026-03-01"), storeLocation: "Paris - Les Halles",
  quickFillDocType: "", quickFillDoc: [],
  streetNumber: "", buildingIdentifier: "", streetName: "",
  streetAddress: "", city: "", postalCode: "", country: "France",
  emergencyContacts: [{ name: "", phone: "", phoneCode: "+33", relationship: "" }],
  socialSecurityNumber: "", hasSocialSecurity: "", socialSecurityReason: "", socialSecurityProof: [],
  previousSSNs: [],
  maritalStatus: "", maritalStatusType: "", numberOfDependentChildren: 0, dependentChildren: [],
  rqthRecognition: "", rqthDocument: [], firstAidTraining: "", firstAidDocument: [],
  electricalSafetyTraining: "", electricalSafetyDocument: [],
  solidarityDayCertificate: "", solidarityDayDocument: [],
  identityDocType: "", identityDoc: [], identityDocFront: [], identityDocBack: [],
  identityDocNumber: "",
  identityDocExpiry: undefined, identityDocCountry: "", identityUploadMethod: "upload",
  isForeignWorker: "",
  workPermit: [], workPermitExpiry: undefined, workPermitNumber: "", workPermitIssuedBy: "",
  criminalRecord: [], cpamProof: [], documentsConfirmed: false,
  iban: "", ibanCountryCode: "", ibanCheckDigits: "", ibanBBAN: "",
  bic: "", accountHoldingBranch: "",
  ribDocument: [], accountHolderName: "", bankCountry: "France", bankEntryMethod: "upload",
  contractSigned: false, dataProtectionAccepted: false, managerSigned: false,
  contractHistory: [], activeContractId: "",
  internalRulesConfirmed: false, codeOfConductConfirmed: false,
  contractDocConfirmed: false,
  dataProtectionCharterConfirmed: false, policyAgreed: false,
  enrollHealthInsurance: "", coverageType: "", dependents: [],
  notEnrollingReason: "", insuranceProof: [], enrollRestaurantTicket: "",
  insurancePracticalGuideChecked: false, insuranceMembershipTermsChecked: false,
  insuranceEmployeeContactChecked: false, insuranceTermsUnderstood: false,
  insuranceExemptionReason: "", insuranceExemptionProof: [],
  cmuEndDate: undefined, individualContractEndDate: undefined,
  lunchTicketFormGenerated: false,
  declarationAgreed: false, certificateAccepted: null,
  acknowledgementConfirmed: false,
  rejectedDocuments: {
    identityDoc: { rejected: true, reason: "Document is blurry / unreadable", fileName: "id-card-front.jpg" },
  },
  newBankDetails: undefined,
  stageApprovalStatus: { 1: "none", 2: "none", 3: "none", 4: "none", 5: "none" },
  contractExtended: false, needsResign: false,
  healthInsuranceDocRead: false,
  providentDocsRead: {},
  digiposteDocsRead: {},
  acknowledgementDocRead: false,
};

interface OnboardingContextType {
  data: OnboardingData;
  updateData: (updates: Partial<OnboardingData>) => void;
  currentStage: number;
  setCurrentStage: (stage: number) => void;
  completedStages: number[];
  completeStage: (stage: number) => void;
  isOnboardingComplete: boolean;
  setOnboardingComplete: (val: boolean) => void;
  isEditMode: boolean;
  setEditMode: (val: boolean) => void;
  editSection: number;
  setEditSection: (val: number) => void;
  handleGenderChange: (newGender: string) => void;
  markStagePending: (stage: number) => void;
  markStageApproved: (stage: number) => void;
  simulateContractExtension: () => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export const OnboardingProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<OnboardingData>(defaultData);
  const [currentStage, setCurrentStage] = useState(1);
  const [completedStages, setCompletedStages] = useState<number[]>([]);
  const [isOnboardingComplete, setOnboardingComplete] = useState(false);
  const [isEditMode, setEditMode] = useState(false);
  const [editSection, setEditSection] = useState(0);

  const updateData = (updates: Partial<OnboardingData>) => {
    setData(prev => ({ ...prev, ...updates }));
  };

  const completeStage = (stage: number) => {
    setCompletedStages(prev => prev.includes(stage) ? prev : [...prev, stage]);
  };

  const handleGenderChange = (newGender: string) => {
    if (isOnboardingComplete && data.gender && data.gender !== newGender && data.socialSecurityNumber) {
      setData(prev => ({
        ...prev,
        gender: newGender,
        previousSSNs: [
          ...prev.previousSSNs,
          { number: prev.socialSecurityNumber, gender: prev.gender, changedAt: new Date() },
        ],
        socialSecurityNumber: "",
        hasSocialSecurity: "yes",
      }));
    } else {
      setData(prev => ({ ...prev, gender: newGender }));
    }
  };

  const markStagePending = (stage: number) => {
    setData(prev => ({
      ...prev,
      stageApprovalStatus: { ...prev.stageApprovalStatus, [stage]: "pending" as const },
    }));
  };

  const markStageApproved = (stage: number) => {
    setData(prev => ({
      ...prev,
      stageApprovalStatus: { ...prev.stageApprovalStatus, [stage]: "approved" as const },
    }));
  };

  const simulateContractExtension = () => {
    const now = new Date();
    const newContract: ContractVersion = {
      id: `c${Date.now()}`,
      label: "Extended Contract",
      startDate: new Date(now.getFullYear(), now.getMonth(), 1),
      endDate: undefined,
      signedByEmployee: false,
      signedByCompany: false,
      status: "active",
    };

    const existingHistory = (prev: OnboardingData) => {
      if (prev.contractHistory.length === 0) {
        return [{
          id: "c1", label: "Initial Contract",
          startDate: prev.startDate || new Date("2026-01-01"),
          endDate: new Date(now.getFullYear(), now.getMonth() - 1, 28),
          signedByEmployee: true, signedByCompany: true,
          signatureData: undefined, signedAt: new Date("2026-01-01"),
          status: "expired" as const,
        }];
      }
      return prev.contractHistory.map(c => ({
        ...c, status: "expired" as const, signedByCompany: true,
        endDate: c.endDate || new Date(now.getFullYear(), now.getMonth() - 1, 28),
      }));
    };

    setData(prev => ({
      ...prev,
      contractHistory: [...existingHistory(prev), newContract],
      activeContractId: newContract.id,
      contractSigned: false, dataProtectionAccepted: false, managerSigned: false,
      contractExtended: true, needsResign: true,
      stageApprovalStatus: { ...prev.stageApprovalStatus, 4: "pending" as const },
    }));
  };

  return (
    <OnboardingContext.Provider value={{
      data, updateData, currentStage, setCurrentStage,
      completedStages, completeStage, isOnboardingComplete, setOnboardingComplete,
      isEditMode, setEditMode, editSection, setEditSection,
      handleGenderChange, markStagePending, markStageApproved, simulateContractExtension,
    }}>
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => {
  const ctx = useContext(OnboardingContext);
  if (!ctx) throw new Error("useOnboarding must be used within OnboardingProvider");
  return ctx;
};
