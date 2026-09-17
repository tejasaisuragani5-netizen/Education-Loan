"use client";

import React, { useState, useEffect } from "react";
import StatusTracker from "../../components/StatusTracker";
import { api, Student, RepaymentEstimate } from "../../lib/api";

export default function StudentPortalPage() {
  const [student, setStudent] = useState<Student | null>(null);
  const [docType, setDocType] = useState("Fee Structure Letter with Year-wise Breakdown");
  const [bankTarget, setBankTarget] = useState("State Bank of India");
  const [requestSubmitting, setRequestSubmitting] = useState(false);
  const [requestSuccess, setRequestSuccess] = useState<string | null>(null);
  const [requestError, setRequestError] = useState<string | null>(null);

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
      // Fallback student profile
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
      setRequestSuccess(`Request logged successfully! Tracking ID #${res.request_id}. Department review is active.`);
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
      // Offline fallback math
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
      {/* Student Welcome Header */}
      <div
        style={{
          background: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)",
          borderRadius: 16,
          padding: "28px 24px",
          color: "white",
          marginBottom: 24,
          boxShadow: "0 6px 20px rgba(37,99,235,0.2)",
        }}
      >
        <div style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: 1.2, color: "#bfdbfe", fontWeight: 700 }}>
          Student Self-Service Desk
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 800, margin: "6px 0 8px 0" }}>
          Welcome, {student ? student.name : "Tejasai"}!
        </h1>
        <p style={{ margin: 0, fontSize: 15, color: "#dbeafe", maxWidth: 650 }}>
          Reg No: <strong>{student?.student_id || "261FA04001"}</strong> · {student?.course || "B.Tech CSE 1st Year"} · Bank: {student?.loan_bank || "State Bank of India"}
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: 24, marginBottom: 28 }}>
        {/* Request New Document Form */}
        <div style={{ background: "white", borderRadius: 14, padding: 24, border: "1px solid #e2e8f0" }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: "#0f172a", marginBottom: 6 }}>
            📝 Submit New Certificate Request
          </h3>
          <p style={{ fontSize: 13, color: "#64748b", marginBottom: 18 }}>
            Requests are automatically prioritized under institutional loan-dependent SLAs.
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

          <form onSubmit={handleRequestSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#334155", marginBottom: 6 }}>
                Certificate Type
              </label>
              <select
                value={docType}
                onChange={(e) => setDocType(e.target.value)}
                style={{
                  width: "100%",
                  padding: "9px 12px",
                  borderRadius: 8,
                  border: "1px solid #cbd5e1",
                  fontSize: 14,
                  boxSizing: "border-box",
                  background: "white",
                }}
              >
                <option value="Fee Structure Letter with Year-wise Breakdown">
                  Fee Structure Letter with Year-wise Breakdown
                </option>
                <option value="Bonafide Certificate">Bonafide Certificate</option>
                <option value="Course Estimation & Expenditure Certificate">
                  Course Estimation & Expenditure Certificate
                </option>
                <option value="Hostel & Boarding Fee Certificate">
                  Hostel & Boarding Fee Certificate
                </option>
              </select>
            </div>

            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#334155", marginBottom: 6 }}>
                Target Bank / Financial Institution
              </label>
              <input
                type="text"
                value={bankTarget}
                onChange={(e) => setBankTarget(e.target.value)}
                placeholder="State Bank of India / Canara Bank"
                style={{
                  width: "100%",
                  padding: "9px 12px",
                  borderRadius: 8,
                  border: "1px solid #cbd5e1",
                  fontSize: 14,
                  boxSizing: "border-box",
                }}
              />
            </div>

            <button
              type="submit"
              disabled={requestSubmitting}
              style={{
                background: requestSubmitting ? "#94a3b8" : "#2563eb",
                color: "white",
                padding: "11px 18px",
                borderRadius: 8,
                border: "none",
                fontSize: 14,
                fontWeight: 700,
                cursor: requestSubmitting ? "not-allowed" : "pointer",
                marginTop: 6,
              }}
            >
              {requestSubmitting ? "Submitting..." : "🚀 Submit Official Certificate Request"}
            </button>
          </form>
        </div>

        {/* Moratorium & Repayment Calculator */}
        <div style={{ background: "white", borderRadius: 14, padding: 24, border: "1px solid #e2e8f0" }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: "#0f172a", marginBottom: 6 }}>
            🧮 Loan Moratorium & EMI Calculator
          </h3>
          <p style={{ fontSize: 13, color: "#64748b", marginBottom: 18 }}>
            Simulate repayment after 4-year study + 6-month grace period.
          </p>

          <form onSubmit={handleCalculate} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#334155", marginBottom: 4 }}>
                  Loan Principal (₹)
                </label>
                <input
                  type="number"
                  value={calcLoan}
                  onChange={(e) => setCalcLoan(e.target.value)}
                  style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: "1px solid #cbd5e1", fontSize: 13, boxSizing: "border-box" }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#334155", marginBottom: 4 }}>
                  Interest Rate (% p.a.)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={calcRate}
                  onChange={(e) => setCalcRate(e.target.value)}
                  style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: "1px solid #cbd5e1", fontSize: 13, boxSizing: "border-box" }}
                />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#334155", marginBottom: 4 }}>
                  Moratorium Period (Yrs)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={calcMoratorium}
                  onChange={(e) => setCalcMoratorium(e.target.value)}
                  style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: "1px solid #cbd5e1", fontSize: 13, boxSizing: "border-box" }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#334155", marginBottom: 4 }}>
                  Repayment Tenure (Yrs)
                </label>
                <input
                  type="number"
                  value={calcRepayment}
                  onChange={(e) => setCalcRepayment(e.target.value)}
                  style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: "1px solid #cbd5e1", fontSize: 13, boxSizing: "border-box" }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={calcLoading}
              style={{
                background: "#059669",
                color: "white",
                padding: "10px",
                borderRadius: 8,
                border: "none",
                fontSize: 13,
                fontWeight: 700,
                cursor: "pointer",
                marginTop: 4,
              }}
            >
              {calcLoading ? "Computing..." : "📊 Calculate Estimated Monthly EMI"}
            </button>
          </form>

          {calcResult && (
            <div style={{ marginTop: 16, padding: 14, background: "#f0fdf4", borderRadius: 8, border: "1px solid #bbf7d0" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 13, color: "#166534" }}>Estimated Monthly EMI:</span>
                <strong style={{ fontSize: 18, color: "#166534" }}>
                  ₹{calcResult.monthly_emi?.toLocaleString("en-IN")} / mo
                </strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#15803d" }}>
                <span>Total Payable (Principal + Interest):</span>
                <span>₹{calcResult.total_payable?.toLocaleString("en-IN")}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Lifecycle & Status Tracker Component */}
      <StatusTracker studentId="261FA04001" />
    </div>
  );
}
