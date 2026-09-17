"use client";

import React, { useState } from "react";
import { api, VerificationResultData, BundleEvaluationData } from "../lib/api";

interface DocumentUploadProps {
  onVerificationComplete: (result: VerificationResultData | BundleEvaluationData) => void;
  defaultStudentId?: string;
}

export default function DocumentUpload({
  onVerificationComplete,
  defaultStudentId = "261FA04001",
}: DocumentUploadProps) {
  const [activeTab, setActiveTab] = useState<"single" | "bundle">("single");
  const [studentId, setStudentId] = useState(defaultStudentId);
  const [docType, setDocType] = useState("Bonafide Certificate");
  const [singleFile, setSingleFile] = useState<File | null>(null);
  const [backFile, setBackFile] = useState<File | null>(null);

  // Bundle files
  const [targetLoan, setTargetLoan] = useState("2000000");
  const [familyIncome, setFamilyIncome] = useState("450000");
  const [bundleFiles, setBundleFiles] = useState<{ [key: string]: File }>({});

  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSingleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!singleFile) {
      setError("Please select a document file to verify.");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const res = await api.uploadSingleDocument(singleFile, studentId, docType, backFile);
      onVerificationComplete(res);
    } catch (err: any) {
      setError(err.message || "Failed to verify document");
    } finally {
      setUploading(false);
    }
  }

  async function handleBundleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const count = Object.keys(bundleFiles).length;
    if (count === 0) {
      setError("Please select at least one document for bundle synthesis.");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const res = await api.uploadBundleEligibility({
        studentId,
        targetLoanAmount: Number(targetLoan) || 2000000,
        familyIncome: Number(familyIncome) || 450000,
        files: bundleFiles,
      });
      onVerificationComplete(res);
    } catch (err: any) {
      setError(err.message || "Failed to analyze bundle");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div style={{ background: "white", borderRadius: 14, padding: 24, border: "1px solid #e2e8f0" }}>
      {/* Tab Switcher */}
      <div style={{ display: "flex", gap: 10, borderBottom: "1px solid #e2e8f0", paddingBottom: 14, marginBottom: 20 }}>
        <button
          type="button"
          onClick={() => setActiveTab("single")}
          style={{
            background: activeTab === "single" ? "#2563eb" : "#f1f5f9",
            color: activeTab === "single" ? "white" : "#475569",
            border: "none",
            borderRadius: 8,
            padding: "8px 16px",
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          📄 Single Certificate AI Verification
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("bundle")}
          style={{
            background: activeTab === "bundle" ? "#2563eb" : "#f1f5f9",
            color: activeTab === "bundle" ? "white" : "#475569",
            border: "none",
            borderRadius: 8,
            padding: "8px 16px",
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          🗂️ Complete 6-Document Loan Bundle Synthesis
        </button>
      </div>

      {error && (
        <div style={{ background: "#fef2f2", color: "#991b1b", padding: 12, borderRadius: 8, marginBottom: 16, fontSize: 13 }}>
          ⚠️ {error}
        </div>
      )}

      {/* Single Upload Form */}
      {activeTab === "single" ? (
        <form onSubmit={handleSingleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14 }}>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#334155", marginBottom: 6 }}>
                Student Registration No.
              </label>
              <input
                type="text"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                placeholder="261FA04001"
                required
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
                <option value="Bonafide Certificate">Bonafide Certificate</option>
                <option value="Fee Structure Letter">Fee Structure Letter with Breakdown</option>
                <option value="Student ID Card">Student ID Card (Front & Back)</option>
                <option value="Admission Letter">Admission Offer Letter</option>
                <option value="Tuition Fee Receipt">Tuition Fee Receipt</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#334155", marginBottom: 6 }}>
              Upload Document File (PDF or Image)
            </label>
            <input
              type="file"
              accept=".pdf,.png,.jpg,.jpeg"
              onChange={(e) => setSingleFile(e.target.files?.[0] || null)}
              required
              style={{
                width: "100%",
                padding: "10px",
                border: "2px dashed #cbd5e1",
                borderRadius: 8,
                background: "#f8fafc",
                boxSizing: "border-box",
              }}
            />
          </div>

          {docType === "Student ID Card" && (
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#334155", marginBottom: 6 }}>
                ID Card Back (Barcode & Address - Optional)
              </label>
              <input
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={(e) => setBackFile(e.target.files?.[0] || null)}
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "2px dashed #cbd5e1",
                  borderRadius: 8,
                  background: "#f8fafc",
                  boxSizing: "border-box",
                }}
              />
            </div>
          )}

          <button
            type="submit"
            disabled={uploading}
            style={{
              background: uploading ? "#94a3b8" : "#2563eb",
              color: "white",
              padding: "12px 20px",
              borderRadius: 8,
              border: "none",
              fontSize: 14,
              fontWeight: 700,
              cursor: uploading ? "not-allowed" : "pointer",
              marginTop: 8,
            }}
          >
            {uploading ? "Analyzing with Gemini Vision AI..." : "🔍 Run 5-Stage AI Document Verification"}
          </button>
        </form>
      ) : (
        /* Bundle Upload Form */
        <form onSubmit={handleBundleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14 }}>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#334155", marginBottom: 6 }}>
                Registration No.
              </label>
              <input
                type="text"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                placeholder="261FA04001"
                required
                style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 14, boxSizing: "border-box" }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#334155", marginBottom: 6 }}>
                Target Loan (₹)
              </label>
              <input
                type="number"
                value={targetLoan}
                onChange={(e) => setTargetLoan(e.target.value)}
                style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 14, boxSizing: "border-box" }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#334155", marginBottom: 6 }}>
                Family Annual Income (₹)
              </label>
              <input
                type="number"
                value={familyIncome}
                onChange={(e) => setFamilyIncome(e.target.value)}
                style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 14, boxSizing: "border-box" }}
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14 }}>
            {[
              { id: "bonafide", label: "1. Bonafide Certificate" },
              { id: "fee_structure", label: "2. Fee Structure Breakdown" },
              { id: "admission_letter", label: "3. Admission Offer Letter" },
              { id: "academic_marksheet", label: "4. Academic Marksheet / Rank Card" },
              { id: "fee_receipt", label: "5. Fee Payment / Advance Receipt" },
              { id: "income_cert", label: "6. Income Certificate / ITR" },
            ].map((slot) => (
              <div key={slot.id} style={{ background: "#f8fafc", padding: 12, borderRadius: 8, border: "1px solid #e2e8f0" }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#334155", marginBottom: 6 }}>
                  {slot.label}
                </label>
                <input
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setBundleFiles((prev) => ({ ...prev, [slot.id]: file }));
                    } else {
                      setBundleFiles((prev) => {
                        const copy = { ...prev };
                        delete copy[slot.id];
                        return copy;
                      });
                    }
                  }}
                  style={{ fontSize: 12, width: "100%" }}
                />
              </div>
            ))}
          </div>

          <button
            type="submit"
            disabled={uploading}
            style={{
              background: uploading ? "#94a3b8" : "#059669",
              color: "white",
              padding: "12px 20px",
              borderRadius: 8,
              border: "none",
              fontSize: 14,
              fontWeight: 700,
              cursor: uploading ? "not-allowed" : "pointer",
              marginTop: 8,
            }}
          >
            {uploading ? "Synthesizing Cross-Document Bundle..." : "🚀 Synthesize Bundle & Generate Bank Dossier"}
          </button>
        </form>
      )}
    </div>
  );
}
