import React, { createContext, useContext, useState, ReactNode } from "react";

type Lang = "en" | "fr";

const translations: Record<string, Record<Lang, string>> = {
  // Dashboard
  "welcome_back": { en: "Welcome back", fr: "Bienvenue" },
  "onboarding": { en: "Onboarding Details", fr: "Détails d'intégration" },
  "learning": { en: "Learning", fr: "Formation" },
  "complete_profile": { en: "Complete your profile to get started", fr: "Complétez votre profil pour commencer" },
  "completed_view": { en: "Completed — View your details", fr: "Terminé — Voir vos détails" },
  "locked_msg": { en: "Unlock by completing onboarding", fr: "Débloquez en complétant l'intégration" },
  "start_training": { en: "Start your training modules", fr: "Commencez vos modules de formation" },
  "progress": { en: "Progress", fr: "Progression" },
  "smyths_360": { en: "Smyths 360", fr: "Smyths 360" },
  "employee_portal": { en: "Employee Self-Service Portal", fr: "Portail libre-service employé" },
  "new_starter": { en: "New Starter", fr: "Nouveau" },
  "new_label": { en: "New", fr: "Nouveau" },

  // Login & OTP
  "welcome_back_login": { en: "Welcome Back", fr: "Bienvenue" },
  "sign_in": { en: "Sign in to continue", fr: "Connectez-vous pour continuer" },
  "request_otp": { en: "Request OTP", fr: "Demander un OTP" },
  "verify_email": { en: "Verify Your Email", fr: "Vérifiez votre e-mail" },
  "code_sent": { en: "Code sent to", fr: "Code envoyé à" },
  "verify_continue": { en: "Verify & Continue", fr: "Vérifier et continuer" },
  "resend_code": { en: "Resend Code", fr: "Renvoyer le code" },

  // Buttons
  "save_continue": { en: "Save & Continue", fr: "Enregistrer et continuer" },
  "back": { en: "Back", fr: "Retour" },
  "submit_continue": { en: "Submit & Continue", fr: "Soumettre et continuer" },
  "save_complete": { en: "Save & Complete", fr: "Enregistrer et terminer" },
  "proceed_benefits": { en: "Proceed to Benefits", fr: "Passer aux avantages" },
  "edit": { en: "Edit", fr: "Modifier" },
  "save": { en: "Save", fr: "Enregistrer" },
  "cancel": { en: "Cancel", fr: "Annuler" },
  "confirm_change": { en: "Confirm Change", fr: "Confirmer le changement" },
  "download_pdf": { en: "Download PDF", fr: "Télécharger PDF" },
  "download_signed_pdf": { en: "Download Signed PDF", fr: "Télécharger PDF signé" },
  "download_enrollment_pdf": { en: "Download Enrollment PDF", fr: "Télécharger PDF d'inscription" },
  "clear": { en: "Clear", fr: "Effacer" },
  "confirm_signature": { en: "Confirm Signature", fr: "Confirmer la signature" },
  "sign_this_contract": { en: "Sign This Contract", fr: "Signer ce contrat" },
  "confirm": { en: "Confirm", fr: "Confirmer" },
  "confirm_read": { en: "I have read and confirm", fr: "J'ai lu et je confirme" },
  "document_confirmed": { en: "Document confirmed", fr: "Document confirmé" },
  "previous": { en: "Previous", fr: "Précédent" },
  "next_page": { en: "Next", fr: "Suivant" },
  "page": { en: "Page", fr: "Page" },
  "agree_policy": { en: "Agree", fr: "Accepter" },

  // Stage Names
  "stage_basic_details": { en: "Basic Details", fr: "Informations de base" },
  "stage_documents": { en: "Documents", fr: "Documents" },
  "stage_bank_details": { en: "Bank Details", fr: "Coordonnées bancaires" },
  "stage_contract": { en: "Contract", fr: "Contrat" },
  "stage_benefits": { en: "Benefits & Declaration", fr: "Avantages & Déclaration" },
  "stage_declaration": { en: "Declaration", fr: "Déclaration" },

  // Stage Indicator short labels
  "stage_short_details": { en: "Details", fr: "Détails" },
  "stage_short_docs": { en: "Docs", fr: "Docs" },
  "stage_short_bank": { en: "Bank", fr: "Banque" },
  "stage_short_contract": { en: "Contract", fr: "Contrat" },
  "stage_short_benefits": { en: "Benefits", fr: "Avantages" },
  "stage_short_declaration": { en: "Declare", fr: "Déclarer" },

  // Section Titles
  "personal_info": { en: "Personal Information", fr: "Informations personnelles" },
  "job_info": { en: "Job Information", fr: "Informations professionnelles" },
  "address": { en: "Address", fr: "Adresse" },
  "emergency_contact": { en: "Emergency Contact", fr: "Contact d'urgence" },
  "payroll": { en: "Payroll", fr: "Paie" },
  "social_security_detail": { en: "Social Security Detail", fr: "Détail de sécurité sociale" },
  "identity_proof": { en: "Identity Proof", fr: "Justificatif d'identité" },
  "work_authorization": { en: "Work Authorization", fr: "Autorisation de travail" },
  "work_authorization_foreign": { en: "Work Authorization (Foreign Worker Only)", fr: "Autorisation de travail (Travailleur étranger uniquement)" },
  "criminal_record": { en: "Criminal Record Certificate", fr: "Extrait de casier judiciaire" },
  "social_security_proof": { en: "Social Security Proof", fr: "Justificatif de sécurité sociale" },
  "bank_info": { en: "Bank Information", fr: "Informations bancaires" },
  "contract": { en: "Employment Contract", fr: "Contrat de travail" },
  "health_insurance": { en: "Health Insurance (Mutuelle)", fr: "Assurance santé (Mutuelle)" },
  "restaurant_ticket": { en: "Lunch Ticket", fr: "Ticket déjeuner" },
  "lunch_ticket": { en: "Lunch Ticket", fr: "Ticket déjeuner" },
  "enroll_lunch_ticket": { en: "Enroll in Lunch Ticket Program?", fr: "S'inscrire au programme ticket déjeuner ?" },
  "family_composition": { en: "Family Composition", fr: "Composition familiale" },
  "additional_declarations": { en: "Additional Declarations", fr: "Déclarations supplémentaires" },
  "additional_details": { en: "Additional Details", fr: "Détails supplémentaires" },

  // Field Labels
  "first_name": { en: "First Name", fr: "Prénom" },
  "first_name_given": { en: "First Name (Given Name)", fr: "Prénom (Nom donné)" },
  "last_name": { en: "Last Name", fr: "Nom" },
  "last_name_surname": { en: "Last Name (Surname)", fr: "Nom de famille" },
  "birth_name": { en: "Birth Name (Maiden Name)", fr: "Nom de naissance (Nom de jeune fille)" },
  "birth_name_placeholder": { en: "If different from current name", fr: "Si différent du nom actuel" },
  "date_of_birth": { en: "Date of Birth", fr: "Date de naissance" },
  "place_of_birth": { en: "Place of Birth (City)", fr: "Lieu de naissance (Ville)" },
  "birth_department_number": { en: "Birth Department Number", fr: "Numéro de département de naissance" },
  "gender": { en: "Gender", fr: "Genre" },
  "nationality": { en: "Nationality", fr: "Nationalité" },
  "nationality_placeholder": { en: "Enter your nationality", fr: "Entrez votre nationalité" },
  "email": { en: "Email Address", fr: "Adresse e-mail" },
  "email_for_adp": { en: "Personal email address can be used for ADP", fr: "L'adresse e-mail personnelle peut être utilisée pour ADP" },
  "mobile": { en: "Mobile Number", fr: "Numéro de mobile" },
  "job_role": { en: "Job Role", fr: "Poste" },
  "contract_type": { en: "Contract Type", fr: "Type de contrat" },
  "start_date": { en: "Start Date", fr: "Date de début" },
  "location": { en: "Location", fr: "Lieu" },
  "street": { en: "Street Address", fr: "Adresse" },
  "street_number": { en: "Street Number", fr: "Numéro de rue" },
  "building_identifier": { en: "Building / Block / Unit", fr: "Bâtiment / Bloc / Unité" },
  "street_name": { en: "Street Name", fr: "Nom de la rue" },
  "city": { en: "City", fr: "Ville" },
  "postal_code": { en: "Postal Code", fr: "Code postal" },
  "country": { en: "Country", fr: "Pays" },
  "contact_name": { en: "Contact Name", fr: "Nom du contact" },
  "contact_phone": { en: "Contact Phone", fr: "Téléphone du contact" },
  "relationship": { en: "Relationship", fr: "Relation" },
  "ssn_question": { en: "Do you have a Social Security Number?", fr: "Avez-vous un numéro de sécurité sociale ?" },
  "ssn": { en: "Social Security Number (NIR)", fr: "Numéro de sécurité sociale (NIR)" },
  "doc_type": { en: "Document Type", fr: "Type de document" },
  "national_id": { en: "National ID Card", fr: "Carte nationale d'identité" },
  "passport": { en: "Passport", fr: "Passeport" },
  "doc_number": { en: "Document Number", fr: "Numéro du document" },
  "expiry_date": { en: "Expiry Date", fr: "Date d'expiration" },
  "issuing_country": { en: "Issuing Country", fr: "Pays de délivrance" },
  "permit_expiry": { en: "Permit Expiry", fr: "Expiration du permis" },
  "iban": { en: "IBAN Number", fr: "Numéro IBAN" },
  "account_holder": { en: "Account Holder Name", fr: "Nom du titulaire du compte" },
  "bank_country": { en: "Bank Country", fr: "Pays de la banque" },
  "rib_document": { en: "RIB Document", fr: "Document RIB" },
  "coverage_type": { en: "Coverage Type", fr: "Type de couverture" },
  "individual": { en: "Individual", fr: "Individuel" },
  "family": { en: "Family", fr: "Famille" },
  "dependents": { en: "Dependents", fr: "Personnes à charge" },
  "full_name": { en: "Full Name", fr: "Nom complet" },
  "enroll_health": { en: "Enroll in Company Health Insurance?", fr: "S'inscrire à la mutuelle d'entreprise ?" },
  "enroll_restaurant": { en: "Enroll in Restaurant Ticket Program?", fr: "S'inscrire au programme ticket restaurant ?" },
  "not_enrolled": { en: "Not enrolled", fr: "Non inscrit" },
  "enrolled": { en: "Enrolled", fr: "Inscrit" },
  "reason": { en: "Reason", fr: "Raison" },
  "covered_by_spouse": { en: "Covered by spouse", fr: "Couvert par le conjoint" },
  "private_insurance": { en: "Private insurance", fr: "Assurance privée" },

  // Family Composition
  "marital_status_question": { en: "Marital Status", fr: "Situation matrimoniale" },
  "marital_status_type": { en: "Marital Status Type", fr: "Type de situation matrimoniale" },
  "single": { en: "Single", fr: "Célibataire" },
  "married": { en: "Married", fr: "Marié(e)" },
  "cohabiting": { en: "Cohabiting / Living Together", fr: "Concubinage / Union libre" },
  "civil_partnership": { en: "Civil Partnership (PACS)", fr: "Partenariat civil (PACS)" },
  "divorced": { en: "Divorced", fr: "Divorcé(e)" },
  "number_of_dependent_children": { en: "Number of Dependent Children", fr: "Nombre d'enfants à charge" },

  // Additional Declarations
  "all_fields_optional": { en: "All fields in this section are optional.", fr: "Tous les champs de cette section sont facultatifs." },
  "rqth_recognition": { en: "RQTH Recognition (Disability Status)", fr: "Reconnaissance RQTH (Statut handicap)" },
  "first_aid_training": { en: "Workplace First Aid Training", fr: "Formation premiers secours en entreprise" },
  "electrical_safety_training": { en: "Electrical Safety Authorization Training", fr: "Formation habilitation électrique" },
  "solidarity_day_certificate": { en: "Solidarity Day — completed with a previous employer this year?", fr: "Journée de solidarité — effectuée chez un précédent employeur cette année ?" },
  "upload_solidarity_doc": { en: "Upload Solidarity Day Certificate", fr: "Télécharger le certificat de journée de solidarité" },
  "upload_rqth_doc": { en: "Upload RQTH Document", fr: "Télécharger le document RQTH" },
  "upload_first_aid_doc": { en: "Upload First Aid Certificate", fr: "Télécharger le certificat de premiers secours" },
  "upload_electrical_doc": { en: "Upload Electrical Safety Certificate", fr: "Télécharger le certificat habilitation électrique" },

  // Tooltips for additional details
  "tooltip_rqth": { en: "RQTH is the official recognition of disability status in France. If you have this recognition, upload the document for workplace accommodations.", fr: "La RQTH est la reconnaissance officielle du statut de handicap en France. Si vous avez cette reconnaissance, téléchargez le document pour les aménagements." },
  "tooltip_first_aid": { en: "If you've completed workplace first aid training (SST), upload your valid certificate. This helps in emergency response planning.", fr: "Si vous avez suivi une formation SST, téléchargez votre certificat valide. Cela aide à la planification des réponses d'urgence." },
  "tooltip_electrical": { en: "Electrical safety authorization (habilitation électrique) is required for roles involving electrical equipment. Upload your certification if applicable.", fr: "L'habilitation électrique est requise pour les postes impliquant des équipements électriques. Téléchargez votre certification si applicable." },
  "tooltip_solidarity": { en: "If you've already completed the Solidarity Day with a previous employer this year, upload the certificate to avoid a second deduction.", fr: "Si vous avez déjà effectué la journée de solidarité chez un précédent employeur cette année, téléchargez le certificat pour éviter une double retenue." },

  // Nationality options
  "nat_french": { en: "French", fr: "Française" },
  "nat_german": { en: "German", fr: "Allemande" },
  "nat_british": { en: "British", fr: "Britannique" },
  "nat_spanish": { en: "Spanish", fr: "Espagnole" },
  "nat_italian": { en: "Italian", fr: "Italienne" },
  "nat_portuguese": { en: "Portuguese", fr: "Portugaise" },
  "nat_belgian": { en: "Belgian", fr: "Belge" },
  "nat_dutch": { en: "Dutch", fr: "Néerlandaise" },
  "nat_polish": { en: "Polish", fr: "Polonaise" },
  "nat_romanian": { en: "Romanian", fr: "Roumaine" },
  "nat_american": { en: "American", fr: "Américaine" },
  "nat_canadian": { en: "Canadian", fr: "Canadienne" },
  "nat_moroccan": { en: "Moroccan", fr: "Marocaine" },
  "nat_algerian": { en: "Algerian", fr: "Algérienne" },
  "nat_tunisian": { en: "Tunisian", fr: "Tunisienne" },
  "nat_turkish": { en: "Turkish", fr: "Turque" },
  "nat_indian": { en: "Indian", fr: "Indienne" },
  "nat_chinese": { en: "Chinese", fr: "Chinoise" },
  "nat_brazilian": { en: "Brazilian", fr: "Brésilienne" },

  // Work Authorization fields
  "residence_permit_number": { en: "Residence Permit Number", fr: "Numéro de titre de séjour" },
  "issued_by": { en: "Issued By", fr: "Délivré par" },
  "enter_permit_number": { en: "Enter permit number", fr: "Entrez le numéro de permis" },
  "enter_issued_by": { en: "Enter issuing authority", fr: "Entrez l'autorité de délivrance" },
  "upload_work_permit": { en: "Upload Document", fr: "Télécharger le document" },

  // Criminal record alert
  "criminal_record_alert": { en: "The certificate must be issued within the last 3 months from the current date.", fr: "Le certificat doit avoir été délivré dans les 3 derniers mois à compter de la date actuelle." },

  // Upload & Actions
  "upload": { en: "Upload", fr: "Télécharger" },
  "manual_entry": { en: "Manual Entry", fr: "Saisie manuelle" },
  "upload_id": { en: "Upload ID/Passport", fr: "Télécharger pièce d'identité" },
  "upload_certificate": { en: "Upload Certificate", fr: "Télécharger le certificat" },
  "upload_rib": { en: "Upload your RIB document showing IBAN location", fr: "Téléchargez votre document RIB indiquant l'emplacement IBAN" },
  "upload_insurance_proof": { en: "Upload Insurance/Exemption Proof", fr: "Télécharger le justificatif d'assurance/exemption" },
  "upload_signature": { en: "Upload your signature image", fr: "Télécharger votre image de signature" },
  "upload_ss_proof": { en: "Upload Attestation", fr: "Télécharger l'attestation" },
  "residence_permit": { en: "Residence / Work Permit", fr: "Titre de séjour / Permis de travail" },
  "cpam_proof": { en: "CPAM Proof / Attestation", fr: "Justificatif CPAM / Attestation" },

  // Contract
  "employee": { en: "Employee", fr: "Employé" },
  "role": { en: "Role", fr: "Poste" },
  "view_contract": { en: "View Contract", fr: "Voir le contrat" },
  "view_current_contract": { en: "View Current Contract", fr: "Voir le contrat actuel" },
  "view_signed_contract": { en: "View Signed Contract", fr: "Voir le contrat signé" },
  "employee_signature": { en: "Employee Signature", fr: "Signature de l'employé" },
  "company_signature": { en: "Company Signature", fr: "Signature de l'entreprise" },
  "signed_by_employee": { en: "Signed by Employee", fr: "Signé par l'employé" },
  "signed_by_company": { en: "Signed by Company", fr: "Signé par l'entreprise" },
  "pending": { en: "Pending", fr: "En attente" },
  "pending_manager": { en: "Pending — Manager signs on or before joining date", fr: "En attente — Le manager signe à ou avant la date d'arrivée" },
  "employee_signature_pending": { en: "Employee Signature — Pending", fr: "Signature employé — En attente" },
  "company_signature_pending": { en: "Company Signature — Pending", fr: "Signature entreprise — En attente" },
  "data_protection": { en: "I agree to the Data Protection and Privacy Policy.", fr: "J'accepte la politique de protection des données et de confidentialité." },
  "sign_contract": { en: "Sign Contract", fr: "Signer le contrat" },
  "draw": { en: "Draw", fr: "Dessiner" },
  "contract_history": { en: "Contract History", fr: "Historique des contrats" },
  "initial_contract": { en: "Initial Contract", fr: "Contrat initial" },
  "active": { en: "Active", fr: "Actif" },
  "extended": { en: "Extended", fr: "Prolongé" },
  "expired": { en: "Expired", fr: "Expiré" },
  "period": { en: "Period", fr: "Période" },
  "ongoing": { en: "Ongoing", fr: "En cours" },
  "employment_contract_title": { en: "EMPLOYMENT CONTRACT", fr: "CONTRAT DE TRAVAIL" },
  "contract_intro": { en: "This Employment Contract is made effective as of the start date of the Employee's employment with Smyths Toys France.", fr: "Ce contrat de travail prend effet à la date de début de l'emploi du salarié chez Smyths Toys France." },
  "signature_will_appear": { en: "Signature will appear here", fr: "La signature apparaîtra ici" },
  "insurance_enrollment_form": { en: "Insurance Enrollment Form", fr: "Formulaire d'inscription à l'assurance" },
  "ready_to_send": { en: "Ready to send", fr: "Prêt à envoyer" },
  "status": { en: "Status", fr: "Statut" },

  // Stage 4 - Policy & Rules
  "regulations_and_contracts": { en: "Regulations and Contracts", fr: "Règlements et contrats" },
  "internal_rules": { en: "Internal Rules and Regulations of Smyths Toys", fr: "Règlement intérieur de Smyths Toys" },
  "code_of_conduct": { en: "Internal Code of Conduct", fr: "Code de conduite interne" },
  "contract_document": { en: "Contract", fr: "Contrat" },
  "data_protection_charter": { en: "Data Protection Charter", fr: "Charte de protection des données" },
  "data_protection_section": { en: "Data Protection", fr: "Protection des données" },
  "agree_policy_to_continue": { en: "Please check all documents above, then click Agree to enable signing.", fr: "Veuillez cocher tous les documents ci-dessus, puis cliquez sur Accepter pour activer la signature." },
  "policy_agreed": { en: "Policy Agreed", fr: "Politique acceptée" },

  // Quick Fill
  "quick_fill": { en: "Quick Fill", fr: "Remplissage rapide" },
  "quick_fill_desc": { en: "Upload your National ID or Passport to auto-fill basic details", fr: "Téléchargez votre carte d'identité ou passeport pour remplir automatiquement les informations" },
  "quick_fill_note": { en: "Auto-fills name, date of birth, and nationality from your document", fr: "Remplit automatiquement le nom, la date de naissance et la nationalité à partir de votre document" },
  "national_id_preferred": { en: "National ID preferred", fr: "Carte d'identité de préférence" },
  "select_doc_type": { en: "Select document type", fr: "Sélectionnez le type de document" },
  "upload_for_autofill": { en: "Upload for auto-fill", fr: "Télécharger pour remplissage auto" },
  "autofill_applied": { en: "Auto-filled from document", fr: "Rempli automatiquement depuis le document" },

  // Hints
  "no_blur_hint": { en: "No blur, no cut edges, good lighting", fr: "Pas de flou, pas de bords coupés, bon éclairage" },
  "sample_doc_hint": { en: "Sample — how your document should look:", fr: "Exemple — comment votre document doit se présenter :" },
  "slide_hint": { en: "Slide to view Front & Back", fr: "Glissez pour voir recto et verso" },
  "front_side": { en: "Front Side", fr: "Recto" },
  "back_side": { en: "Back Side", fr: "Verso" },
  "photo_page": { en: "Photo Page", fr: "Page photo" },
  "hr_review_required": { en: "HR Review Required", fr: "Vérification RH requise" },
  "iban_hint": { en: "Enter your IBAN (starts with FR…)", fr: "Entrez votre IBAN (commence par FR…)" },
  "confirm_docs": { en: "I confirm these documents are valid and accurate.", fr: "Je confirme que ces documents sont valides et exacts." },
  "add_ssn_later": { en: "You can add your SSN later once received.", fr: "Vous pourrez ajouter votre SSN plus tard." },
  "reupload_hint": { en: "Re-upload if document was incorrect / new documents", fr: "Re-téléchargez si le document était incorrect / nouveaux documents" },
  "sig_hint": { en: "PNG or JPG with transparent/white background", fr: "PNG ou JPG avec fond transparent/blanc" },
  "clear_photo_hint": { en: "Clear photo — no blur, no cut edges", fr: "Photo nette — pas de flou, pas de bords coupés" },
  "recent_cert_hint": { en: "Upload a recent certificate", fr: "Téléchargez un certificat récent" },

  // SSN
  "no_ssn_reason": { en: "Reason for not having SSN", fr: "Raison de l'absence de SSN" },
  "first_job": { en: "First Job", fr: "Premier emploi" },
  "foreigner_applied": { en: "Foreigner – Applied", fr: "Étranger – Demande en cours" },
  "will_add_later": { en: "I will add my SSN later when received", fr: "J'ajouterai mon SSN plus tard" },
  "not_provided": { en: "Not provided", fr: "Non fourni" },
  "not_at_this_time": { en: "Not at this time", fr: "Pas pour le moment" },
  "previous_ssn_records": { en: "Previous SSN Records", fr: "Anciens numéros SSN" },

  // Data Protection
  "data_protection_note": { en: "All details are protected under government data protection regulations and company policy.", fr: "Tous les détails sont protégés par les réglementations gouvernementales de protection des données et la politique de l'entreprise." },
  "bank_security_note": { en: "Bank details are securely stored under government data protection regulations and company policy.", fr: "Les coordonnées bancaires sont stockées de manière sécurisée conformément aux réglementations de protection des données et à la politique de l'entreprise." },

  // Gender options
  "male": { en: "Male", fr: "Homme" },
  "female": { en: "Female", fr: "Femme" },
  "non_binary": { en: "Non-binary", fr: "Non-binaire" },
  "prefer_not_to_say": { en: "Prefer not to say", fr: "Préfère ne pas dire" },

  // Nationality options
  "france": { en: "France", fr: "France" },
  "eu_country": { en: "EU Country", fr: "Pays UE" },
  "non_eu_country": { en: "Non-EU Country", fr: "Pays hors UE" },

  // Relationship options
  "spouse": { en: "Spouse", fr: "Conjoint(e)" },
  "parent": { en: "Parent", fr: "Parent" },
  "sibling": { en: "Sibling", fr: "Frère/Sœur" },
  "friend": { en: "Friend", fr: "Ami(e)" },
  "other": { en: "Other", fr: "Autre" },
  "child": { en: "Child", fr: "Enfant" },

  // Country options
  "germany": { en: "Germany", fr: "Allemagne" },
  "uk": { en: "UK", fr: "Royaume-Uni" },
  "spain": { en: "Spain", fr: "Espagne" },
  "italy": { en: "Italy", fr: "Italie" },

  // Generic
  "select": { en: "Select", fr: "Sélectionner" },
  "select_date": { en: "Select date", fr: "Sélectionner une date" },
  "select_reason": { en: "Select reason", fr: "Sélectionner une raison" },
  "yes": { en: "Yes", fr: "Oui" },
  "no": { en: "No", fr: "Non" },
  "details": { en: "Details", fr: "Détails" },
  "docs": { en: "Docs", fr: "Documents" },
  "bank": { en: "Bank", fr: "Banque" },
  "benefits": { en: "Benefits", fr: "Avantages" },
  "name": { en: "Name", fr: "Nom" },
  "phone": { en: "Phone", fr: "Téléphone" },
  "type": { en: "Type", fr: "Type" },
  "add": { en: "Add", fr: "Ajouter" },
  "required": { en: "Required", fr: "Requis" },
  "editing": { en: "Editing", fr: "Modification" },

  // OnboardingView
  "my_onboarding": { en: "My Onboarding", fr: "Mon intégration" },
  "personal": { en: "Personal", fr: "Personnel" },
  "changes_saved": { en: "Changes saved", fr: "Modifications enregistrées" },
  "changes_saved_desc": { en: "Your details have been updated successfully.", fr: "Vos informations ont été mises à jour avec succès." },
  "gender_change_title": { en: "Gender Change — New SSN Required", fr: "Changement de genre — Nouveau SSN requis" },
  "gender_change_desc": { en: "Changing your gender requires a new Social Security Number. Your current SSN will be retained as a historical record.", fr: "Le changement de genre nécessite un nouveau numéro de sécurité sociale. Votre SSN actuel sera conservé en tant qu'historique." },
  "not_uploaded": { en: "Not uploaded", fr: "Non téléchargé" },

  // Banner
  "thank_you": { en: "Thank You!", fr: "Merci !" },
  "contract_signed_success": { en: "Your contract has been signed successfully!", fr: "Votre contrat a été signé avec succès !" },
  "manager_final_contract": { en: "Your manager will issue the final contract on your date of joining.", fr: "Votre manager émettra le contrat final à votre date d'arrivée." },
  "welcome_onboard": { en: "Welcome Onboard!", fr: "Bienvenue à bord !" },
  "to_smyths": { en: "to Smyths Toys Superstores", fr: "chez Smyths Toys Superstores" },
  "continue_benefits": { en: "Continue to Benefits", fr: "Passer aux avantages" },
  "go_to_dashboard": { en: "Go to Dashboard", fr: "Aller au tableau de bord" },
  "go_to_home_screen": { en: "Go to Home Screen", fr: "Aller à l'écran d'accueil" },
  "welcome_on_board": { en: "Welcome On Board!", fr: "Bienvenue à bord !" },
  "thrilled_to_join": { en: "We're thrilled to have you join the team!", fr: "Nous sommes ravis de vous accueillir dans l'équipe !" },
  "employee_id_msg": { en: "Once all your details are verified, you will receive your", fr: "Une fois vos informations vérifiées, vous recevrez votre" },
  "employee_id": { en: "Employee ID", fr: "Identifiant employé" },
  "hr_in_touch": { en: "Your HR / Payroll / Manager will be in touch with you shortly with next steps.", fr: "Votre RH / Paie / Manager vous contactera prochainement avec les prochaines étapes." },
  "lets_make_amazing": { en: "Let's make it amazing!", fr: "Ensemble, faisons de grandes choses !" },
  "smyths_family": { en: "Smyths Toys Superstores Family", fr: "La famille Smyths Toys Superstores" },

  // Completion Banner
  "details_submitted": { en: "Your details have been submitted successfully.", fr: "Vos informations ont été soumises avec succès." },
  "manager_review_note": { en: "Your Manager / HR will review your details and approve them. You will be notified via email once the review is complete.", fr: "Votre Manager / RH examinera vos informations et les approuvera. Vous serez notifié(e) par e-mail une fois l'examen terminé." },

  // Onboarding header
  "onboarding_title": { en: "Onboarding", fr: "Intégration" },

  // Stage 4 specifics
  "please_sign": { en: "Please sign the contract", fr: "Veuillez signer le contrat" },
  "please_accept_dp": { en: "Please accept data protection", fr: "Veuillez accepter la protection des données" },
  "employee_sig_pending": { en: "Employee Signature Pending", fr: "Signature de l'employé en attente" },
  "company_sig_pending": { en: "Company Signature — Pending", fr: "Signature de l'entreprise — En attente" },

  // Approval & Status
  "pending_approval": { en: "Pending Approval", fr: "En attente d'approbation" },
  "approved": { en: "Approved", fr: "Approuvé" },
  "resign_required": { en: "Re-sign Required", fr: "Re-signature requise" },
  "contract_extended_resign": { en: "Your contract has been extended — please re-sign", fr: "Votre contrat a été prolongé — veuillez re-signer" },
  "contract_extended_title": { en: "Contract Extended", fr: "Contrat prolongé" },
  "contract_extended_desc": { en: "Your contract has been extended. Please review and sign the new contract below.", fr: "Votre contrat a été prolongé. Veuillez examiner et signer le nouveau contrat ci-dessous." },
  "simulate_extension": { en: "Simulate Contract Extension", fr: "Simuler une extension de contrat" },
  "changes_pending_approval": { en: "Your changes are pending manager approval.", fr: "Vos modifications sont en attente d'approbation du manager." },
  "ssn_required_title": { en: "SSN Required", fr: "SSN requis" },
  "ssn_required_desc": { en: "Please enter your new Social Security Number before saving.", fr: "Veuillez entrer votre nouveau numéro de sécurité sociale avant d'enregistrer." },
  "ssn_mandatory_after_gender": { en: "New SSN is mandatory after gender change", fr: "Un nouveau SSN est obligatoire après un changement de genre" },

  // Stage 2 Banner
  "stage2_banner_title": { en: "Welcome!", fr: "Bienvenue !" },
  "stage2_banner_subtitle": { en: "Your documents have been submitted successfully.", fr: "Vos documents ont été soumis avec succès." },
  "stage2_see_you_on": { en: "Let's meet on", fr: "Rendez-vous le" },
  "stage2_keep_in_touch": { en: "We'll stay in touch and keep you updated before your start date.", fr: "Nous resterons en contact et vous tiendrons informé avant votre date de début." },
  "stage2_learning_cta": { en: "Meanwhile, start your Learning!", fr: "En attendant, commencez votre formation !" },
  "stage2_learning_desc": { en: "Complete your training modules in the application to be ready on Day 1.", fr: "Complétez vos modules de formation dans l'application pour être prêt le jour J." },
  "stage2_continue_btn": { en: "Continue Onboarding", fr: "Continuer l'intégration" },

  // Contract re-sign
  "reagree_contract": { en: "Re-agree Contract", fr: "Re-signer le contrat" },
  "reagree_contract_desc": { en: "Your contract has been extended. Please review and re-sign below.", fr: "Votre contrat a été prolongé. Veuillez examiner et re-signer ci-dessous." },
  "contract_submitted": { en: "Contract Submitted", fr: "Contrat soumis" },
  "contract_submitted_desc": { en: "Your signed contract has been submitted for manager approval.", fr: "Votre contrat signé a été soumis pour approbation du manager." },
  "submit_contract": { en: "Submit Contract", fr: "Soumettre le contrat" },
  "employee_contract_info": { en: "Employee Contract Information", fr: "Informations du contrat employé" },
  "date_of_joining": { en: "Date of Joining", fr: "Date d'entrée" },
  "employee_signed_contract": { en: "Employee Signed Contract", fr: "Contrat signé par l'employé" },
  "view_employee_contract": { en: "View Employee Signed Document", fr: "Voir le document signé par l'employé" },
  "company_cosigned_contract": { en: "Company Co-signed Contract", fr: "Contrat cosigné par l'entreprise" },
  "view_company_contract": { en: "View Company Co-signed Document", fr: "Voir le document cosigné par l'entreprise" },
  "company_cosigned_copy": { en: "Co-signed Copy", fr: "Copie cosignée" },

  // Multi-file & contacts
  "add_more_files": { en: "Add more files", fr: "Ajouter des fichiers" },
  "upload_or_photo": { en: "Upload or take a photo", fr: "Télécharger ou prendre une photo" },
  "add_contact": { en: "Add Contact", fr: "Ajouter un contact" },
  "contact": { en: "Contact", fr: "Contact" },
  "remove": { en: "Remove", fr: "Supprimer" },
  "add_new_bank": { en: "Add New Bank Details", fr: "Ajouter de nouvelles coordonnées bancaires" },
  "new_bank_details": { en: "New Bank Details", fr: "Nouvelles coordonnées bancaires" },
  "submit_bank": { en: "Submit Bank Details", fr: "Soumettre les coordonnées bancaires" },
  "bank_submitted": { en: "Bank Details Submitted", fr: "Coordonnées bancaires soumises" },
  "bank_submitted_desc": { en: "Your new bank details are pending manager approval.", fr: "Vos nouvelles coordonnées bancaires sont en attente d'approbation." },
  "waiting_approval": { en: "Waiting for Approval", fr: "En attente d'approbation" },
  "current_bank_details": { en: "Current Bank Details", fr: "Coordonnées bancaires actuelles" },
  "new_bank_fields": { en: "New Bank Details", fr: "Nouvelles coordonnées bancaires" },
  "add_ssn_now": { en: "Add Social Security Number", fr: "Ajouter le numéro de sécurité sociale" },
  "ssn_received_desc": { en: "You can now add your Social Security Number below.", fr: "Vous pouvez maintenant ajouter votre numéro de sécurité sociale ci-dessous." },
  "rehire": { en: "Rehire", fr: "Réembaucher" },
  "contract_extension_alert": { en: "Contract Extension", fr: "Extension de contrat" },
  "contract_extension_alert_desc": { en: "This employee's contract is eligible for extension/rehire.", fr: "Le contrat de cet employé peut être prolongé/réembauché." },
  "view_contract_template": { en: "View Contract Template", fr: "Voir le modèle de contrat" },
  "signature_confirmation": { en: "Signature Confirmation", fr: "Confirmation de signature" },
  "view_final_employee_contract": { en: "View Final Employee Contract", fr: "Voir le contrat final de l'employé" },
  "old_contract_details": { en: "Previous Contract", fr: "Contrat précédent" },
  "new_iban": { en: "New IBAN Number", fr: "Nouveau numéro IBAN" },
  "new_account_holder": { en: "New Account Holder Name", fr: "Nouveau nom du titulaire" },
  "new_rib_document": { en: "New RIB Document", fr: "Nouveau document RIB" },
  "new_bank_country": { en: "New Bank Country", fr: "Nouveau pays de la banque" },
  "max_contacts_reached": { en: "Maximum 2 emergency contacts allowed", fr: "Maximum 2 contacts d'urgence autorisés" },

  // Insurance - Yes path labels
  "practical_guide": { en: "Practical Guide and Guarantees – Health Insurance", fr: "Guide pratique et garanties – Assurance santé" },
  "membership_terms": { en: "Membership Terms and Contributions 2026 – Verspieren", fr: "Conditions d'adhésion et cotisations 2026 – Verspieren" },
  "employee_contact_verspieren": { en: "Verspieren Employee Contact", fr: "Contact employé Verspieren" },
  "understand_terms": { en: "I understand the terms and conditions", fr: "Je comprends les termes et conditions" },

  // Insurance - No path exemption reasons
  "exemption_cdd_less_12": { en: "Fixed-term contract (CDD) of less than 12 months", fr: "Contrat à durée déterminée (CDD) de moins de 12 mois" },
  "exemption_cdd_more_12": { en: "Fixed-term contract (CDD) of more than 12 months and already covered by individual health insurance that complies with the requirements of a \"responsible contract\"", fr: "Contrat à durée déterminée (CDD) de plus de 12 mois et déjà couvert par une assurance santé individuelle conforme aux exigences d'un « contrat responsable »" },
  "exemption_spouse_covered": { en: "Employee covered as a dependent under the mandatory family collective scheme of their spouse", fr: "Salarié couvert en tant qu'ayant droit dans le cadre du régime collectif obligatoire familial de son conjoint" },
  "exemption_other_employer": { en: "Employee covered under a mandatory collective scheme with another employer", fr: "Salarié couvert par un régime collectif obligatoire chez un autre employeur" },
  "exemption_cmu_acs": { en: "Beneficiary of CMU or ACS", fr: "Bénéficiaire de la CMU ou de l'ACS" },
  "exemption_new_hire": { en: "Newly hired employee already covered by individual health insurance (temporary exemption)", fr: "Salarié nouvellement embauché déjà couvert par une assurance santé individuelle (dispense temporaire)" },
  "exemption_part_time": { en: "Part-time employee and/or apprentice, where contribution is ≥ 10% of gross salary", fr: "Salarié à temps partiel et/ou apprenti, dont la cotisation est ≥ 10% du salaire brut" },
  "exemption_enim_sncf": { en: "Employee affiliated with ENIM or CPRPSNCF", fr: "Salarié affilié à l'ENIM ou à la CPRPSNCF" },
  "exemption_couple_same_company": { en: "Couple employed within the same company", fr: "Couple employé au sein de la même entreprise" },
  "cmu_end_date": { en: "End date of CMU coverage", fr: "Date de fin de couverture CMU" },
  "individual_contract_end_date": { en: "End date of individual contract coverage", fr: "Date de fin de couverture du contrat individuel" },
  "upload_exemption_proof": { en: "Upload Insurance Exemption Proof", fr: "Télécharger le justificatif de dispense d'assurance" },
  "exemption_reason": { en: "Exemption Reason", fr: "Motif de dispense" },

  // Lunch ticket
  "lunch_ticket_form": { en: "Lunch Ticket Enrollment Form", fr: "Formulaire d'inscription ticket déjeuner" },
  "download_lunch_ticket_pdf": { en: "Download Lunch Ticket PDF", fr: "Télécharger PDF ticket déjeuner" },

  // Acknowledgement
  "acknowledgement_section": { en: "Acknowledgement of Receipt of Documents", fr: "Accusé de réception des documents" },
  "acknowledgement_note": { en: "The signature added in the contract section will be used for the Insurance, Lunch Ticket, and all attestations.", fr: "La signature ajoutée dans la section contrat sera utilisée pour l'assurance, le ticket déjeuner et toutes les attestations." },
  "agree_terms_conditions": { en: "Agree to Terms and Conditions", fr: "Accepter les termes et conditions" },
  "confirm_submit": { en: "Confirm & Submit", fr: "Confirmer et soumettre" },

  // Bank verification
  "iban_matched": { en: "IBAN Number Verified", fr: "Numéro IBAN vérifié" },
  "account_holder_matched": { en: "Account Holder Name Verified", fr: "Nom du titulaire vérifié" },
  "bank_verification_note": { en: "Bank details verified from the uploaded document.", fr: "Coordonnées bancaires vérifiées à partir du document téléchargé." },

  // Declaration section
  "declaration": { en: "Declaration", fr: "Déclaration" },
  "provident_insurance": { en: "Provident Insurance", fr: "Prévoyance" },
  "provident_booklet": { en: "Provident Insurance Benefits and Services Booklet", fr: "Livret de prestations et services de prévoyance" },
  "provident_beneficiary": { en: "Provident Insurance – Beneficiary Designation", fr: "Prévoyance – Désignation de bénéficiaire" },
  "provident_due": { en: "Unilateral Decision – DUE Provident Insurance for Non-Executive Staff", fr: "Décision unilatérale – DUE Prévoyance pour le personnel non-cadre" },
  "digiposte_action_logement": { en: "Digiposte and Action Logement", fr: "Digiposte et Action Logement" },
  "action_logement_sheet": { en: "Action Logement – Summary Sheet", fr: "Action Logement – Fiche synthétique" },
  "digiposte_letter": { en: "DIGIPOSTE – Information Letter", fr: "DIGIPOSTE – Lettre d'information" },
  "acknowledgement_documents": { en: "Acknowledgement of Documents", fr: "Accusé de réception des documents" },
  "certificate_delivery": { en: "Certificate of Document Delivery", fr: "Certificat de remise de documents" },
  "accept": { en: "Accept", fr: "Accepter" },
  "refuse": { en: "Refuse", fr: "Refuser" },
  "accepted": { en: "Accepted", fr: "Accepté" },
  "refused": { en: "Refused", fr: "Refusé" },
  "signature_note_declaration": { en: "The signature added in the contract section will be used for all attestations and declarations.", fr: "La signature ajoutée dans la section contrat sera utilisée pour toutes les attestations et déclarations." },
  "dependent_details_auto": { en: "Dependent details have been auto-populated from Basic Details.", fr: "Les détails des personnes à charge ont été remplis automatiquement depuis les informations de base." },
  "doc_carried_over": { en: "Document carried over from Quick Fill", fr: "Document repris depuis le remplissage rapide" },

  // Sidebar
  "sidebar_home": { en: "Home", fr: "Accueil" },
  "sidebar_docs_policies": { en: "Documents & Policies", fr: "Documents et Politiques" },
  "sidebar_regulation_code": { en: "Regulation & Code", fr: "Règlement et Code" },
  "sidebar_health_insurance": { en: "Health Insurance", fr: "Assurance Santé" },
  "sidebar_provident_insurance": { en: "Provident Insurance", fr: "Prévoyance" },
  "sidebar_digiposte_logement": { en: "Digiposte & Action Logement", fr: "Digiposte & Action Logement" },
  "sidebar_contracts": { en: "Contract Agreement", fr: "Accord contractuel" },
  "sidebar_contracts_manager": { en: "Contract (Manager only)", fr: "Contrat (Manager uniquement)" },

  // Contracts tile
  "contracts_tile_desc": { en: "Review and sign employee contracts", fr: "Consulter et signer les contrats employés" },

  // Contract management
  "contract_management": { en: "Contract Management", fr: "Gestion des contrats" },
  "contract_mgmt_desc": { en: "Pending manager signatures for employee contracts", fr: "Signatures manager en attente pour les contrats employés" },
  "total_employees": { en: "Total", fr: "Total" },
  "pending_sign": { en: "Pending", fr: "En attente" },
  "signed": { en: "Signed", fr: "Signé" },
  "search_employee": { en: "Search by name or ID...", fr: "Rechercher par nom ou ID..." },
  "all_roles": { en: "All Roles", fr: "Tous les rôles" },
  "all_dates": { en: "All Dates", fr: "Toutes les dates" },
  "overdue": { en: "Overdue", fr: "En retard" },
  "manager_signed": { en: "Signed", fr: "Signé" },
  "no_results": { en: "No employees found", fr: "Aucun employé trouvé" },
  "employee_id_label": { en: "Employee ID", fr: "ID Employé" },

  // Contract detail
  "contract_review": { en: "Contract Review", fr: "Revue du contrat" },
  "manager_sign_contract": { en: "Review and sign employee contract", fr: "Revue et signature du contrat employé" },
  "manager_signature": { en: "Manager Signature", fr: "Signature Manager" },
  "confirm_manager_sign": { en: "Confirm & Sign", fr: "Confirmer et signer" },
  "manager_signed_success": { en: "Contract Signed Successfully!", fr: "Contrat signé avec succès !" },
  "redirecting": { en: "Redirecting...", fr: "Redirection..." },
  "back_to_contracts": { en: "Back to Contracts", fr: "Retour aux contrats" },
  "dual_signed_contract": { en: "Both employee and manager have signed this contract", fr: "L'employé et le manager ont tous deux signé ce contrat" },

  // Declaration note
  "declaration_email_note": { en: "The declaration file and contract will be sent to your registered email address.", fr: "Le fichier de déclaration et le contrat seront envoyés à votre adresse e-mail enregistrée." },

  // Help icons
  "help_personal_info": { en: "Enter your legal name, date of birth, gender, and nationality. These details must match your official documents.", fr: "Entrez votre nom légal, date de naissance, genre et nationalité. Ces détails doivent correspondre à vos documents officiels." },
  "help_social_security": { en: "Your French Social Security Number (NIR) is a 15-digit number found on your Carte Vitale or CPAM attestation.", fr: "Votre numéro de sécurité sociale (NIR) est un numéro à 15 chiffres figurant sur votre Carte Vitale ou attestation CPAM." },
  "help_job_info": { en: "These fields are pre-filled from your job offer and cannot be modified. Contact HR if corrections are needed.", fr: "Ces champs sont pré-remplis depuis votre offre d'emploi et ne peuvent pas être modifiés. Contactez les RH si des corrections sont nécessaires." },
  "help_address": { en: "Enter your current residential address including street number, building name, and street. This will be used for payroll and official correspondence.", fr: "Entrez votre adresse résidentielle actuelle incluant numéro, bâtiment et rue. Elle sera utilisée pour la paie et la correspondance officielle." },
  "help_family": { en: "Provide your marital status and dependent children details for payroll tax and benefits calculations.", fr: "Indiquez votre situation familiale et les détails des enfants à charge pour le calcul des impôts et avantages." },
  "help_emergency": { en: "Provide at least one emergency contact (max 2). This person will be contacted in case of an emergency at work.", fr: "Fournissez au moins un contact d'urgence (max 2). Cette personne sera contactée en cas d'urgence au travail." },
  "help_additional_details": { en: "These fields help us accommodate any special needs or certifications you may have. All fields are optional.", fr: "Ces champs nous aident à prendre en compte vos besoins spécifiques ou certifications. Tous les champs sont facultatifs." },
  "help_health_insurance": { en: "Choose whether to enroll in the company health insurance (mutuelle). If you decline, you must provide a valid exemption reason and supporting documents.", fr: "Choisissez de vous inscrire ou non à la mutuelle d'entreprise. Si vous refusez, vous devez fournir un motif de dispense valide et les justificatifs." },
  "help_lunch_ticket": { en: "The lunch ticket program provides daily meal vouchers. Enrollment is optional.", fr: "Le programme de tickets restaurant fournit des bons repas quotidiens. L'inscription est facultative." },
  "reference_documents": { en: "Reference Documents", fr: "Documents de référence" },
  "help_provident_insurance": { en: "Review the provident insurance booklet, beneficiary designation, and unilateral decision documents. These cover disability, death, and incapacity benefits.", fr: "Consultez le livret de prévoyance, la désignation de bénéficiaire et les documents de décision unilatérale. Ils couvrent les prestations d'invalidité, de décès et d'incapacité." },
  "help_digiposte_logement": { en: "Digiposte is your digital safe for pay slips. Action Logement provides housing assistance for employees.", fr: "Digiposte est votre coffre-fort numérique pour les bulletins de paie. Action Logement fournit une aide au logement pour les salariés." },
  "help_acknowledgement": { en: "Confirm receipt of all documents provided during onboarding. Your contract signature will be used for all attestations.", fr: "Confirmez la réception de tous les documents fournis lors de l'intégration. Votre signature de contrat sera utilisée pour toutes les attestations." },

  // Contract review notes
  "review_ack_before_signing": { en: "Please review the Acknowledgement of document file before signing", fr: "Veuillez consulter le dossier d'accusé de réception des documents avant de signer" },
  "review_contract_before_signing": { en: "Please review the Contract details before signing", fr: "Veuillez consulter les détails du contrat avant de signer" },
  "review_employee_contract_before_signing": { en: "Please review the Employee contract details before signing", fr: "Veuillez consulter les détails du contrat de l'employé avant de signer" },
  "final_contract": { en: "Final Contract", fr: "Contrat final" },
  "view_final_contract": { en: "View Final Contract", fr: "Voir le contrat final" },
  // Document rejection
  "identity_proof_rejected": { en: "Identity Proof Rejected", fr: "Justificatif d'identité rejeté" },
  "rejection_reason": { en: "Reason", fr: "Motif" },
  "rejected": { en: "Rejected", fr: "Rejeté" },
  "please_upload_new_doc": { en: "Please upload a new, clear document to continue.", fr: "Veuillez télécharger un nouveau document lisible pour continuer." },
  "upload_new_identity_doc": { en: "Upload New Identity Document", fr: "Télécharger un nouveau justificatif d'identité" },
  "clear_unblurred_photo_hint": { en: "Ensure the photo is clear, unblurred, and all text is readable", fr: "Assurez-vous que la photo est nette, non floue et que tout le texte est lisible" },
  "new_document_required": { en: "A new document is required", fr: "Un nouveau document est requis" },
  "doc_rejected_action_needed": { en: "Action needed", fr: "Action requise" },
  "signatures": { en: "Signatures", fr: "Signatures" },
  "store_manager": { en: "Store Manager", fr: "Responsable de magasin" },

  // Stage 1 - New fields
  "phone_number": { en: "Phone Number", fr: "Numéro de téléphone" },
  "enter_phone_number": { en: "Enter phone number", fr: "Entrez le numéro de téléphone" },
  "underage_block_title": { en: "Onboarding Cannot Be Processed", fr: "L'intégration ne peut pas être traitée" },
  "underage_block_desc": { en: "You must be at least 16 years old to proceed with onboarding. Please contact your manager for further details.", fr: "Vous devez avoir au moins 16 ans pour procéder à l'intégration. Veuillez contacter votre manager pour plus de détails." },
  "underage_block_contact": { en: "Age under 16 — Contact your manager for further details", fr: "Moins de 16 ans — Contactez votre manager pour plus de détails" },

  // Stage 2 - New fields
  "front_image": { en: "Front Image", fr: "Image recto" },
  "back_image": { en: "Back Image", fr: "Image verso" },
  "upload_front_hint": { en: "Upload front side of your document", fr: "Téléchargez le recto de votre document" },
  "upload_back_hint": { en: "Upload back side of your document", fr: "Téléchargez le verso de votre document" },
  "manual_entry_details": { en: "Document Details (Manual Entry)", fr: "Détails du document (Saisie manuelle)" },
  "foreign_worker_question": { en: "Are you a foreign worker? (Outside of Schengen space)", fr: "Êtes-vous un travailleur étranger ? (Hors espace Schengen)" },

  // Stage 3 - New IBAN fields
  "iban_country_code": { en: "Country Code", fr: "Code pays" },
  "iban_check_digits": { en: "Check Digits", fr: "Clé de contrôle" },
  "iban_bban": { en: "BBAN", fr: "BBAN" },
  "bic_code": { en: "BIC / SWIFT Code", fr: "Code BIC / SWIFT" },
  "account_holding_branch": { en: "Account-Holding Branch", fr: "Agence teneur de compte" },
  "enter_branch_name": { en: "Enter branch name", fr: "Entrez le nom de l'agence" },

  // Verification banner
  "verification_submitted_title": { en: "Details Submitted for Verification", fr: "Détails soumis pour vérification" },
  "verification_submitted_desc": { en: "Your basic details, documents and bank information have been submitted to your Manager / HR for verification. They will review and approve your details soon.", fr: "Vos informations de base, documents et coordonnées bancaires ont été soumis à votre Manager / RH pour vérification. Ils examineront et approuveront vos détails prochainement." },
  "verification_email_note": { en: "You will be notified via email once the verification is complete.", fr: "Vous serez notifié(e) par e-mail une fois la vérification terminée." },
  "continue_to_contract": { en: "Continue to Contract", fr: "Continuer vers le contrat" },

  // Auto-tick docs
  "read_all_pages_to_tick": { en: "Read all pages of each document to automatically mark as completed.", fr: "Lisez toutes les pages de chaque document pour le marquer automatiquement comme lu." },
  "read_docs_to_agree": { en: "Please read all documents above (all pages) to enable the Agree button.", fr: "Veuillez lire tous les documents ci-dessus (toutes les pages) pour activer le bouton Accepter." },
  "read_all_docs_to_sign": { en: "Please read all documents above (all pages) before signing.", fr: "Veuillez lire tous les documents ci-dessus (toutes les pages) avant de signer." },
  "read_health_doc_first": { en: "Please read the health insurance document (all pages) before proceeding.", fr: "Veuillez lire le document d'assurance santé (toutes les pages) avant de continuer." },
  "insurance_download_note": { en: "The health insurance form must be downloaded and sent directly to the insurance company.", fr: "Le formulaire d'assurance santé doit être téléchargé et envoyé directement à la compagnie d'assurance." },

  // Completion banner
  "onboarding_complete_title": { en: "Onboarding Complete!", fr: "Intégration terminée !" },
  "onboarding_complete_desc": { en: "Your onboarding process has been completed successfully. We look forward to seeing you on your first day in store!", fr: "Votre processus d'intégration est terminé avec succès. Nous avons hâte de vous voir lors de votre premier jour en magasin !" },
  "see_you_first_day": { en: "See you on your first day!", fr: "À bientôt pour votre premier jour !" },

  // Document rejection
  "rejected_file": { en: "Rejected file", fr: "Fichier rejeté" },
  "upload_new_certificate": { en: "Upload new certificate", fr: "Télécharger un nouveau certificat" },
  "upload_new_work_permit": { en: "Upload new work permit", fr: "Télécharger un nouveau permis de travail" },
  "work_auth_blocked_title": { en: "Work Authorization Invalid", fr: "Autorisation de travail invalide" },
  "work_auth_blocked_desc": { en: "Your work authorization has been rejected and is invalid. The onboarding process cannot proceed further.", fr: "Votre autorisation de travail a été rejetée et est invalide. Le processus d'intégration ne peut pas continuer." },
  "work_auth_blocked_contact": { en: "Please contact your manager or HR department for further assistance.", fr: "Veuillez contacter votre manager ou le service RH pour plus d'assistance." },
  "profile_rejected_title": { en: "Profile Rejected", fr: "Profil rejeté" },
  "profile_rejected_desc": { en: "Your onboarding profile has been rejected by the manager. Please contact your manager for more details.", fr: "Votre profil d'intégration a été rejeté par le manager. Veuillez contacter votre manager pour plus de détails." },
  "profile_rejected_contact": { en: "Contact your manager or HR for further details and next steps.", fr: "Contactez votre manager ou les RH pour plus de détails et les prochaines étapes." },
};

interface LanguageContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLang] = useState<Lang>("fr");
  const t = (key: string) => translations[key]?.[lang] || key;

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
};
