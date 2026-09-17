"use client";

import React, { useState, useEffect } from "react";
import StatusTracker from "../../components/StatusTracker";
import DocumentUpload from "../../components/DocumentUpload";
import VerificationResult from "../../components/VerificationResult";
import AuditTrail from "../../components/AuditTrail";
import { api, Student, RepaymentEstimate, VerificationResultData, BundleEvaluationData } from "../../lib/api";

type StudentTab = "profile" | "request" | "upload" | "track";

export default function StudentPortalPage() {
  const [activeTab, setActiveTab] = useState<StudentTab>("profile");
  const [student, setStudent] = useState<Student | null>(null);

  // Request Form
  const [docType, setDocType] = useState("Fee Structure Letter with Year-wise Breakdown");
  const [bankTarget, setBankTarget] = useState("State Bank of India");
  const [requestSubmitting, setRequestSubmitting] = useState(false);
  const [requestSuccess, setRequestSuccess] = useState<string | null>(null);
  const [requestError, setRequestError] = useState<string | null>(null);

  // Upload Result
  const [uploadResult, setUploadResult] = useState<VerificationResultData | BundleEvaluationData | null>(null);

  // Repayment Calculator State
  const [calcLoan, setCalcLoan] = useState("2000000");
  const [calcRate, setCalcRate] = useState("8.5");
  const [calcMoratorium, setCalcMoratorium] = useState("4.5");
  const [calcRepayment, setCalcRepayment] = useState("10");
  const [serviceInterest, setServiceInterest] = useState(false);
  const [isCsis, setIsCsis] = useState(false);
  const [calcResult, setCalcResult] = useState<RepaymentEstimate | null>(null);
  const [calcLoading, setCalcLoading] = useState(false);

  useEffect(() => {
    loadStudent();
  }, []);

  async function loadStudent() {
    try {
      const data = await api.getStudent("261FA04001");
      setStudent(data);
    } catch {
      setStudent({
        id: 1,
        student_id: "261FA04001",
        name: "Tejasai",
        course: "B.Tech Computer Science and Engineering",
        year: "1st Year",
        admission_year: "2026",
        total_fee: 2000000.0,
        is_loan_dependent: 1,
        loan_bank: "State Bank of India",
        sanctioned_amount: 2000000.0,
        loan_status: "Approved",
        paid_fee: 0.0,
      });
    }
  }

  async function handleRequestSubmit(e: React.FormEvent) {
    e.preventDefault();
    setRequestSubmitting(true);
    setRequestSuccess(null);
    setRequestError(null);

    try {
      const res = await api.createDocumentRequest({
        student_id: "261FA04001",
        document_type: docType,
        description: bankTarget,
      });
      setRequestSuccess(`Request logged successfully! Tracking ID #${res.request_id}. Prioritized under loan SLA.`);
    } catch (err: any) {
      setRequestError(err.message || "Failed to submit request.");
    } finally {
      setRequestSubmitting(false);
    }
  }

  async function handleCalculate(e: React.FormEvent) {
    e.preventDefault();
    setCalcLoading(true);
    try {
      const res = await api.calculateRepayment({
        loan_amount: Number(calcLoan) || 2000000,
        interest_rate: Number(calcRate) || 8.5,
        moratorium_years: Number(calcMoratorium) || 4.5,
        repayment_years: Number(calcRepayment) || 10,
        service_interest_during_moratorium: serviceInterest,
        is_csis_subsidized: isCsis,
        student_name: student?.name || "Tejasai",
        student_id: "261FA04001",
      });
      setCalcResult(res);
    } catch {
      const P = Number(calcLoan) || 2000000;
      const r = (Number(calcRate) || 8.5) / 100 / 12;
      const n = (Number(calcRepayment) || 10) * 12;
      const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      const total = emi * n;
      setCalcResult({
        loan_amount: P,
        interest_rate: Number(calcRate) || 8.5,
        monthly_emi: Math.round(emi),
        total_interest: Math.round(total - P),
        total_payable: Math.round(total),
        moratorium_years: Number(calcMoratorium) || 4.5,
        repayment_years: Number(calcRepayment) || 10,
      });
    } finally {
      setCalcLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 16px" }}>
      {/* Role Header */}
      <div
        style={{
          background: "linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)",
          borderRadius: 16,
          padding: "26px 24px",
          color: "white",
          marginBottom: 24,
          boxShadow: "0 6px 20px rgba(37,99,235,0.18)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <div>
            <div style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: 1.2, color: "#bfdbfe", fontWeight: 700 }}>
              Role: Student / Borrower
            </div>
            <h1 style={{ fontSize: 26, fontWeight: 800, margin: "4px 0 6px 0" }}>
              Student Self-Service Desk
            </h1>
            <p style={{ margin: 0, fontSize: 14, color: "#dbeafe" }}>
              Logged in: <strong>{student ? student.name : "Tejasai"}</strong> (Reg No: <strong>261FA04001</strong>) · B.Tech CSE 1st Year
            </p>
          </div>
          <span
            style={{
              background: "rgba(255,255,255,0.15)",
              border: "1px solid rgba(255,255,255,0.25)",
              padding: "6px 14px",
              borderRadius: 9999,
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            🛡️ Fee Hold Immunity Active
          </span>
        </div>
      </div>

      {/* Student 4-Section Sub-Navigation */}
      <div
        style={{
          display: "flex",
          gap: 8,
          borderBottom: "1px solid #e2e8f0",
          paddingBottom: 12,
          marginBottom: 24,
          flexWrap: "wrap",
        }}
      >
        {[
          { id: "profile", label: "👤 My Profile" },
          { id: "request", label: "📝 Request Documents" },
          { id: "upload", label: "📤 Upload Documents" },
          { id: "track", label: "📍 Track Application & Moratorium" },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as StudentTab)}
            style={{
              background: activeTab === tab.id ? "#2563eb" : "#f1f5f9",
              color: activeTab === tab.id ? "white" : "#475569",
              border: "none",
              borderRadius: 8,
              padding: "10px 18px",
              fontSize: 14,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* SECTION 1: MY PROFILE */}
      {activeTab === "profile" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: 24 }}>
          <div style={{ background: "white", borderRadius: 14, padding: 24, border: "1px solid #e2e8f0" }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: "#0f172a", marginBottom: 16 }}>
              🎓 Official Academic Enrollment Record
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, fontSize: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #f1f5f9", paddingBottom: 8 }}>
                <span style={{ color: "#64748b" }}>Full Name:</span>
                <strong style={{ color: "#0f172a" }}>{student?.name || "Tejasai"}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #f1f5f9", paddingBottom: 8 }}>
                <span style={{ color: "#64748b" }}>Register Number:</span>
                <strong style={{ color: "#2563eb", fontFamily: "monospace" }}>{student?.student_id || "261FA04001"}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #f1f5f9", paddingBottom: 8 }}>
                <span style={{ color: "#64748b" }}>Course / Branch:</span>
                <strong>{student?.course || "B.Tech Computer Science and Engineering"}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #f1f5f9", paddingBottom: 8 }}>
                <span style={{ color: "#64748b" }}>Current Academic Year:</span>
                <strong>{student?.year || "1st Year"} (Batch {student?.admission_year || "2026"})</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#64748b" }}>Institution:</span>
                <strong>VFSTR Deemed to be University, Guntur</strong>
              </div>
            </div>
          </div>

          <div style={{ background: "white", borderRadius: 14, padding: 24, border: "1px solid #e2e8f0" }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: "#0f172a", marginBottom: 16 }}>
              🏦 Education Loan Ledger & Hold Immunity
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, fontSize: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #f1f5f9", paddingBottom: 8 }}>
                <span style={{ color: "#64748b" }}>Approved Program Fee:</span>
                <strong style={{ color: "#0f172a" }}>₹{student?.total_fee?.toLocaleString("en-IN") || "20,00,000"}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #f1f5f9", paddingBottom: 8 }}>
                <span style={{ color: "#64748b" }}>Sanctioned Loan:</span>
                <strong style={{ color: "#059669" }}>₹{student?.sanctioned_amount?.toLocaleString("en-IN") || "20,00,000"}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #f1f5f9", paddingBottom: 8 }}>
                <span style={{ color: "#64748b" }}>Lending Partner:</span>
                <strong>{student?.loan_bank || "State Bank of India"}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #f1f5f9", paddingBottom: 8 }}>
                <span style={{ color: "#64748b" }}>Loan Status:</span>
                <span style={{ background: "#dcfce7", color: "#166534", padding: "2px 8px", borderRadius: 4, fontWeight: 700, fontSize: 12 }}>
                  ✓ {student?.loan_status || "Approved"}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#64748b" }}>Hold Immunity Status:</span>
                <strong style={{ color: "#0284c7" }}>ACTIVE 🛡️ (Protected from fee holds)</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: REQUEST DOCUMENTS */}
      {activeTab === "request" && (
        <div style={{ background: "white", borderRadius: 14, padding: 24, border: "1px solid #e2e8f0", maxWidth: 700 }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: "#0f172a", marginBottom: 6 }}>
            📝 Institutional Certificate Requisition
          </h3>
          <p style={{ fontSize: 13, color: "#64748b", marginBottom: 18 }}>
            Requests are immediately routed to the Registrar and Accounts cell under fast-track loan SLAs (&lt; 24 hrs).
          </p>

          {requestSuccess && (
            <div style={{ background: "#ecfdf5", color: "#065f46", padding: 12, borderRadius: 8, marginBottom: 16, fontSize: 13, border: "1px solid #a7f3d0" }}>
              ✓ {requestSuccess}
            </div>
          )}

          {requestError && (
            <div style={{ background: "#fef2f2", color: "#991b1b", padding: 12, borderRadius: 8, marginBottom: 16, fontSize: 13, border: "1px solid #fecaca" }}>
              ⚠️ {requestError}
            </div>
          )}

          <form onSubmit={handleRequestSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#334155", marginBottom: 6 }}>
                Certificate Type
              </label>
              <select
                value={docType}
                onChange={(e) => setDocType(e.target.value)}
                style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 14, background: "white" }}
              >
                <option value="Fee Structure Letter with Year-wise Breakdown">Fee Structure Letter with Year-wise Breakdown</option>
                <option value="Bonafide Certificate">Bonafide Certificate</option>
                <option value="Course Estimation & Expenditure Certificate">Course Estimation & Expenditure Certificate</option>
                <option value="Hostel & Boarding Fee Certificate">Hostel & Boarding Fee Certificate</option>
              </select>
            </div>

            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#334155", marginBottom: 6 }}>
                Target Lending Bank
              </label>
              <input
                type="text"
                value={bankTarget}
                onChange={(e) => setBankTarget(e.target.value)}
                placeholder="State Bank of India / Canara Bank"
                style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 14, boxSizing: "border-box" }}
              />
            </div>

            <button
              type="submit"
              disabled={requestSubmitting}
              style={{
                background: requestSubmitting ? "#94a3b8" : "#2563eb",
                color: "white",
                padding: "12px",
                borderRadius: 8,
                border: "none",
                fontSize: 14,
                fontWeight: 700,
                cursor: requestSubmitting ? "not-allowed" : "pointer",
              }}
            >
              {requestSubmitting ? "Processing..." : "🚀 Submit Official Certificate Request"}
            </button>
          </form>
        </div>
      )}

      {/* SECTION 3: UPLOAD DOCUMENTS */}
      {activeTab === "upload" && (
        <div>
          <div style={{ marginBottom: 16 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: "#0f172a", margin: "0 0 4px 0" }}>
              📤 Document Upload & AI Pre-Verification
            </h3>
            <p style={{ margin: 0, fontSize: 13, color: "#64748b" }}>
              Upload individual certificates or full multi-certificate loan bundles to verify seal integrity and detect discrepancies before bank submission.
            </p>
          </div>

          <DocumentUpload
            onVerificationComplete={(res) => setUploadResult(res)}
            defaultStudentId="261FA04001"
          />

          {uploadResult && (
            <VerificationResult
              result={uploadResult}
              onReset={() => setUploadResult(null)}
            />
          )}
        </div>
      )}

      {/* SECTION 4: TRACK APPLICATION & MORATORIUM */}
      {activeTab === "track" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {/* Status Tracker */}
          <StatusTracker studentId="261FA04001" />

          {/* Moratorium & Repayment Calculator */}
          <div style={{ background: "white", borderRadius: 14, padding: 24, border: "1px solid #e2e8f0" }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: "#0f172a", marginBottom: 6 }}>
              🧮 Loan Moratorium & EMI Repayment Simulator
            </h3>
            <p style={{ fontSize: 13, color: "#64748b", marginBottom: 16 }}>
              Calculates post-moratorium monthly installments (4-year study + 6-month grace period).
            </p>

            <form onSubmit={handleCalculate} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14, marginBottom: 16 }}>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#334155", marginBottom: 4 }}>
                  Principal Loan (₹)
                </label>
                <input
                  type="number"
                  value={calcLoan}
                  onChange={(e) => setCalcLoan(e.target.value)}
                  style={{ width: "100%", padding: "9px 12px", borderRadius: 6, border: "1px solid #cbd5e1", fontSize: 13, boxSizing: "border-box" }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#334155", marginBottom: 4 }}>
                  Interest Rate (% p.a.)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={calcRate}
                  onChange={(e) => setCalcRate(e.target.value)}
                  style={{ width: "100%", padding: "9px 12px", borderRadius: 6, border: "1px solid #cbd5e1", fontSize: 13, boxSizing: "border-box" }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#334155", marginBottom: 4 }}>
                  Moratorium (Yrs)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={calcMoratorium}
                  onChange={(e) => setCalcMoratorium(e.target.value)}
                  style={{ width: "100%", padding: "9px 12px", borderRadius: 6, border: "1px solid #cbd5e1", fontSize: 13, boxSizing: "border-box" }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#334155", marginBottom: 4 }}>
                  Repayment (Yrs)
                </label>
                <input
                  type="number"
                  value={calcRepayment}
                  onChange={(e) => setCalcRepayment(e.target.value)}
                  style={{ width: "100%", padding: "9px 12px", borderRadius: 6, border: "1px solid #cbd5e1", fontSize: 13, boxSizing: "border-box" }}
                />
              </div>
              <div style={{ display: "flex", alignItems: "flex-end" }}>
                <button
                  type="submit"
                  disabled={calcLoading}
                  style={{
                    width: "100%",
                    background: "#059669",
                    color: "white",
                    padding: "10px",
                    borderRadius: 6,
                    border: "none",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  {calcLoading ? "Computing..." : "📊 Compute EMI"}
                </button>
              </div>
            </form>

            {calcResult && (
              <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 8, padding: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 13, color: "#166534", fontWeight: 700 }}>Estimated Monthly EMI:</span>
                  <strong style={{ fontSize: 20, color: "#166534" }}>
                    ₹{calcResult.monthly_emi?.toLocaleString("en-IN")} / mo
                  </strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#15803d", marginTop: 4 }}>
                  <span>Total Repayable (Principal + Interest):</span>
                  <strong>₹{calcResult.total_payable?.toLocaleString("en-IN")}</strong>
                </div>
              </div>
            )}
          </div>

          {/* Student Document Security Audit Trail */}
          <div style={{ marginTop: 24 }}>
            <AuditTrail initialUserId="261FA04001" showTamperExplanation={false} />
          </div>
        </div>
      )}
    </div>
  );
}
