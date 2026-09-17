"use client";

import React, { useState } from "react";
import DocumentUpload from "../../components/DocumentUpload";
import VerificationResult from "../../components/VerificationResult";
import DocumentComparison from "../../components/DocumentComparison";
import { api, VerificationResultData, BundleEvaluationData } from "../../lib/api";

type BankTab = "code" | "report" | "consistency";

export default function BankVerificationPage() {
  const [activeTab, setActiveTab] = useState<BankTab>("code");
  const [lookupCode, setLookupCode] = useState("ELN-261FA04001");
  const [lookingUp, setLookingUp] = useState(false);
  const [verifResult, setVerifResult] = useState<VerificationResultData | BundleEvaluationData | null>(null);
  const [lookupError, setLookupError] = useState<string | null>(null);

  async function handleCodeLookup(e: React.FormEvent) {
    e.preventDefault();
    if (!lookupCode.trim()) return;

    setLookingUp(true);
    setLookupError(null);
    setVerifResult(null);

    try {
      const res = await api.verifyCode(lookupCode.trim());
      setVerifResult(res);
      setActiveTab("report");
    } catch (err: any) {
      setLookupError(err.message || "Document verification failed");
    } finally {
      setLookingUp(false);
    }
  }

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 16px" }}>
      {/* Header */}
      <div
        style={{
          background: "linear-gradient(135deg, #064e3b 0%, #047857 100%)",
          borderRadius: 16,
          padding: "26px 24px",
          color: "white",
          marginBottom: 24,
          boxShadow: "0 6px 20px rgba(4,120,87,0.2)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <div>
            <div style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: 1.2, color: "#a7f3d0", fontWeight: 700 }}>
              Role: Bank Officer / Lending Authority
            </div>
            <h1 style={{ fontSize: 26, fontWeight: 800, margin: "4px 0 6px 0" }}>
              Direct Bank Document Verification Portal
            </h1>
            <p style={{ margin: 0, fontSize: 14, color: "#d1fae5" }}>
              Verify Institutional Document · Authenticate official VFSTR certificates without campus visits
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
            🏛️ VFSTR Institutional Trust Gateway
          </span>
        </div>
      </div>

      {/* Bank 3-Section Sub-Navigation */}
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
        <button
          type="button"
          onClick={() => setActiveTab("code")}
          style={{
            background: activeTab === "code" ? "#047857" : "#f1f5f9",
            color: activeTab === "code" ? "white" : "#475569",
            border: "none",
            borderRadius: 8,
            padding: "10px 18px",
            fontSize: 14,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          🔍 Verification Code Lookup
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("report")}
          style={{
            background: activeTab === "report" ? "#047857" : "#f1f5f9",
            color: activeTab === "report" ? "white" : "#475569",
            border: "none",
            borderRadius: 8,
            padding: "10px 18px",
            fontSize: 14,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          🛡️ Authenticity Report {verifResult && "✓"}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("consistency")}
          style={{
            background: activeTab === "consistency" ? "#047857" : "#f1f5f9",
            color: activeTab === "consistency" ? "white" : "#475569",
            border: "none",
            borderRadius: 8,
            padding: "10px 18px",
            fontSize: 14,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          📊 Document Consistency & Adversarial Test
        </button>
      </div>

      {/* SECTION 1: VERIFICATION CODE LOOKUP */}
      {activeTab === "code" && (
        <div>
          <div
            style={{
              background: "white",
              borderRadius: 14,
              padding: 24,
              border: "1px solid #e2e8f0",
              marginBottom: 24,
            }}
          >
            <h3 style={{ fontSize: 18, fontWeight: 700, color: "#0f172a", marginBottom: 6 }}>
              🔍 Instant Document Code Verification
            </h3>
            <p style={{ fontSize: 13, color: "#64748b", marginBottom: 16 }}>
              Enter the official 12-character verification code printed beneath the university seal (e.g. <strong>ELN-261FA04001</strong>).
            </p>

            <form onSubmit={handleCodeLookup} style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <input
                type="text"
                value={lookupCode}
                onChange={(e) => setLookupCode(e.target.value)}
                placeholder="ELN-261FA04001"
                style={{
                  flex: 1,
                  minWidth: 260,
                  padding: "11px 16px",
                  borderRadius: 8,
                  border: "1px solid #cbd5e1",
                  fontSize: 15,
                  fontFamily: "monospace",
                  fontWeight: 600,
                }}
              />
              <button
                type="submit"
                disabled={lookingUp}
                style={{
                  background: lookingUp ? "#94a3b8" : "#047857",
                  color: "white",
                  padding: "11px 22px",
                  borderRadius: 8,
                  border: "none",
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: lookingUp ? "not-allowed" : "pointer",
                }}
              >
                {lookingUp ? "Validating..." : "🛡️ Verify Code"}
              </button>
            </form>

            {lookupError && (
              <div style={{ marginTop: 14, background: "#fef2f2", color: "#991b1b", padding: 12, borderRadius: 8, fontSize: 13 }}>
                ⚠️ {lookupError}
              </div>
            )}
          </div>

          {/* Document Upload Option */}
          <div style={{ marginTop: 24 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: "#0f172a", marginBottom: 12 }}>
              📷 Or Upload Physical Certificate Scan / Image
            </h3>
            <DocumentUpload
              onVerificationComplete={(res) => {
                setVerifResult(res);
                setActiveTab("report");
              }}
              defaultStudentId="261FA04001"
            />
          </div>
        </div>
      )}

      {/* SECTION 2: AUTHENTICITY REPORT */}
      {activeTab === "report" && (
        <div>
          {verifResult ? (
            <VerificationResult
              result={verifResult}
              onReset={() => {
                setVerifResult(null);
                setActiveTab("code");
              }}
            />
          ) : (
            <div style={{ background: "white", padding: 32, borderRadius: 14, border: "1px solid #e2e8f0", textAlign: "center" }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>🛡️</div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: "#0f172a", margin: "0 0 6px 0" }}>
                No Certificate Evaluated Yet
              </h3>
              <p style={{ fontSize: 13, color: "#64748b", maxWidth: 500, margin: "0 auto 18px auto" }}>
                Please enter a verification code (e.g. <strong>ELN-261FA04001</strong>) or upload a certificate scan in the lookup tab.
              </p>
              <button
                type="button"
                onClick={() => {
                  setLookupCode("ELN-261FA04001");
                  setActiveTab("code");
                }}
                style={{
                  background: "#047857",
                  color: "white",
                  border: "none",
                  padding: "10px 18px",
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Go to Verification Code Lookup →
              </button>
            </div>
          )}
        </div>
      )}

      {/* SECTION 3: DOCUMENT CONSISTENCY & ADVERSARIAL TEST */}
      {activeTab === "consistency" && (
        <div>
          <DocumentComparison />
        </div>
      )}
    </div>
  );
}
