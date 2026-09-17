/**
 * Education Loan Support Agent - API Client
 * Connects Next.js UI directly to FastAPI Backend
 */

export interface Student {
  id: number;
  student_id: string;
  name: string;
  course: string;
  year: string;
  admission_year: string;
  total_fee: number;
  is_loan_dependent: number | boolean;
  loan_bank?: string;
  sanctioned_amount?: number;
  loan_status?: string;
  paid_fee?: number;
}

export interface DocumentRequest {
  id: number;
  student_id: string;
  student_name?: string;
  document_type: string;
  description?: string;
  request_date: string;
  status: "Pending" | "Approved" | "Rejected" | "Issued";
  issued_date?: string | null;
  approval_date?: string | null;
  turnaround_hours?: number;
}

export interface IssuedDocument {
  id: number;
  request_id: number;
  student_id: string;
  document_type: string;
  verification_code: string;
  issued_date: string;
  file_path: string;
}

export interface BankScheme {
  id: number;
  bank_name: string;
  scheme_name: string;
  max_loan_amount: number;
  interest_rate: number;
  moratorium_period: string;
  collateral_required: boolean;
  processing_fee: string;
  special_features?: string;
}

export interface Disbursement {
  id: number;
  student_id: string;
  student_name?: string;
  bank_name: string;
  utr_reference?: string;
  amount: number;
  disbursement_date: string;
  status: string;
  academic_year?: string;
}

export interface VerificationResultData {
  success: boolean;
  verified: boolean;
  doc_type?: string;
  student_name?: string;
  student_id?: string;
  roll_number?: string;
  course?: string;
  year?: string;
  fee_total?: number;
  fee_balance?: number;
  bank_name?: string;
  verification_code?: string;
  issued_date?: string;
  security_seal_detected?: boolean;
  tamper_risk?: "LOW" | "MEDIUM" | "HIGH";
  tamper_reasons?: string[];
  cross_doc_synthesis?: {
    synthesis_score?: number;
    dimensions_matched?: number;
    total_dimensions?: number;
    claims_verified?: string[];
    mismatches?: string[];
    authoritative_statement?: string;
  };
  raw_extracted_text?: string;
  error?: string;
  details?: any;
}

export interface BundleEvaluationData {
  id: number;
  student_id: string;
  student_name: string;
  status: "VERIFIED" | "REVIEW" | "REJECTED";
  synthesized_confidence_score: number;
  cross_doc_identity_match: boolean;
  fraud_anomaly_detected: boolean;
  eligible_schemes?: any[];
  audit_log?: string[];
  created_at: string;
  dimensions_evaluated?: {
    identity?: boolean;
    academic?: boolean;
    financial?: boolean;
    seal?: boolean;
    barcode?: boolean;
  };
  cross_doc_synthesis?: any;
}

export interface RepaymentEstimate {
  loan_amount: number;
  interest_rate: number;
  monthly_emi: number;
  total_interest: number;
  total_payable: number;
  moratorium_years: number;
  repayment_years: number;
  is_csis_subsidized?: boolean;
  service_interest_during_moratorium?: boolean;
}

// Dynamic API Base URL resolution
export function getApiBaseUrl(): string {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("API_URL");
    if (saved && saved.trim()) return saved.trim().replace(/\/$/, "");
  }
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "");
  }
  if (process.env.NEXT_PUBLIC_API_BASE_URL) {
    return process.env.NEXT_PUBLIC_API_BASE_URL.replace(/\/$/, "");
  }
  return "https://patients-original-carroll-sphere.trycloudflare.com";
}

export function setApiBaseUrl(url: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem("API_URL", url.trim().replace(/\/$/, ""));
  }
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}${path}`;
  
  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        Accept: "application/json",
        ...(options?.headers || {}),
      },
    });

    if (!res.ok) {
      const errText = await res.text();
      let msg = `HTTP ${res.status} ${res.statusText}`;
      try {
        const errJson = JSON.parse(errText);
        msg = errJson.detail || errJson.message || msg;
      } catch {}
      throw new Error(msg);
    }

    return await res.json();
  } catch (err: any) {
    console.error(`API request error on ${url}:`, err);
    throw err;
  }
}

export const api = {
  async checkHealth(): Promise<{ status: string; app?: string; timestamp?: string }> {
    return request("/health");
  },

  async getAiStatus(): Promise<any> {
    return request("/ai/status");
  },

  async getStudents(): Promise<Student[]> {
    return request<Student[]>("/students");
  },

  async getStudent(studentId: string): Promise<Student> {
    return request<Student>(`/students/${encodeURIComponent(studentId)}`);
  },

  async getLoanStatus(studentId: string): Promise<any> {
    return request(`/students/${encodeURIComponent(studentId)}/loan-status`);
  },

  async getDocumentRequests(studentId?: string): Promise<DocumentRequest[]> {
    const query = studentId ? `?student_id=${encodeURIComponent(studentId)}` : "";
    return request<DocumentRequest[]>(`/document-requests${query}`);
  },

  async createDocumentRequest(data: {
    student_id: string;
    document_type: string;
    description?: string;
  }): Promise<{ message: string; request_id: number }> {
    return request("/document-requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  },

  async generateDocument(requestId: number): Promise<{
    message: string;
    document_id: number;
    verification_code: string;
    file_path: string;
    download_url: string;
  }> {
    return request("/documents/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ request_id: requestId }),
    });
  },

  async getDocuments(): Promise<IssuedDocument[]> {
    return request<IssuedDocument[]>("/documents");
  },

  getDocumentDownloadUrl(documentId: number): string {
    return `${getApiBaseUrl()}/documents/${documentId}/download`;
  },

  async verifyCode(code: string): Promise<VerificationResultData> {
    return request<VerificationResultData>(`/verify/${encodeURIComponent(code)}`);
  },

  async uploadSingleDocument(
    file: File,
    studentId: string,
    documentType: string,
    backFile?: File | null
  ): Promise<VerificationResultData> {
    const baseUrl = getApiBaseUrl();
    const formData = new FormData();
    formData.append("student_id", studentId);
    formData.append("document_type", documentType);
    formData.append("file", file);
    if (backFile) {
      formData.append("back_file", backFile);
    }

    const res = await fetch(`${baseUrl}/verification/upload`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const errText = await res.text();
      let msg = `Upload verification failed: ${res.status}`;
      try {
        const errJson = JSON.parse(errText);
        msg = errJson.detail || msg;
      } catch {}
      throw new Error(msg);
    }

    return await res.json();
  },

  async uploadBundleEligibility(params: {
    studentId: string;
    targetLoanAmount?: number;
    familyIncome?: number;
    files: { [docType: string]: File };
  }): Promise<BundleEvaluationData> {
    const baseUrl = getApiBaseUrl();
    const formData = new FormData();
    formData.append("student_id", params.studentId);
    formData.append("target_loan_amount", String(params.targetLoanAmount || 0));
    formData.append("family_income", String(params.familyIncome || 0));

    if (params.files["bonafide"]) formData.append("bonafide_file", params.files["bonafide"]);
    if (params.files["fee_structure"]) formData.append("fee_structure_file", params.files["fee_structure"]);
    if (params.files["admission_letter"]) formData.append("admission_letter_file", params.files["admission_letter"]);
    if (params.files["academic_marksheet"]) formData.append("academic_marksheet_file", params.files["academic_marksheet"]);
    if (params.files["fee_receipt"]) formData.append("fee_receipt_file", params.files["fee_receipt"]);
    if (params.files["income_cert"]) formData.append("income_cert_file", params.files["income_cert"]);

    const res = await fetch(`${baseUrl}/verification/bundle-eligibility`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const errText = await res.text();
      let msg = `Bundle analysis failed: ${res.status}`;
      try {
        const errJson = JSON.parse(errText);
        msg = errJson.detail || msg;
      } catch {}
      throw new Error(msg);
    }

    return await res.json();
  },

  async getBundleEvaluation(evaluationId: number): Promise<BundleEvaluationData> {
    return request<BundleEvaluationData>(`/verification/bundle-eligibility/${evaluationId}`);
  },

  async getBundleEvaluationByStudent(studentId: string): Promise<BundleEvaluationData> {
    return request<BundleEvaluationData>(`/verification/bundle-eligibility/student/${encodeURIComponent(studentId)}`);
  },

  getDossierPdfUrl(evaluationId: number): string {
    return `${getApiBaseUrl()}/verification/bundle-eligibility/${evaluationId}/dossier-pdf`;
  },

  async getSchemes(): Promise<BankScheme[]> {
    return request<BankScheme[]>("/schemes");
  },

  async getDisbursements(): Promise<Disbursement[]> {
    return request<Disbursement[]>("/disbursements");
  },

  async calculateRepayment(payload: {
    loan_amount: number;
    interest_rate?: number;
    study_type?: string;
    moratorium_years?: number;
    repayment_years?: number;
    family_income?: number;
    service_interest_during_moratorium?: boolean;
    is_csis_subsidized?: boolean;
    student_name?: string;
    student_id?: string;
  }): Promise<RepaymentEstimate> {
    return request<RepaymentEstimate>("/calculator/repayment-estimate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  },

  async getReportsSummary(): Promise<any> {
    return request("/reports/summary");
  },

  async getTurnaroundTime(): Promise<any> {
    return request("/reports/turnaround");
  },
};

