"use client";

import React, { useState } from "react";
import DocumentUpload from "../../components/DocumentUpload";
import VerificationResult from "../../components/VerificationResult";
import { api, VerificationResultData, BundleEvaluationData } from "../../lib/api";

export default function BankVerificationPage() {
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
          padding: "28px 24px",
          color: "white",
          marginBottom: 24,
          boxShadow: "0 6px 20px rgba(4,120,87,0.2)",
        }}
      >
        <div style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: 1.2, color: "#a7f3d0", fontWeight: 700 }}>
          Direct Bank Document Verification Portal
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 800, margin: "6px 0 8px 0" }}>
          Authenticity & Cross-Document Synthesis Engine
        </h1>
        <p style={{ margin: 0, fontSize: 15, color: "#d1fae5", maxWidth: 700 }}>
          For SBI, Canara Bank, Union Bank, and Vidya Lakshmi Portal Officers. Verify official VFSTR documents in real-time.
        </p>
      </div>

      {/* Quick Code Lookup Form */}
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
          Enter the official 12-character verification code printed beneath the QR seal (e.g., <strong>ELN-261FA04001</strong>).
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

      {/* Verification Result Showcase */}
      {verifResult && (
        <VerificationResult
          result={verifResult}
          onReset={() => setVerifResult(null)}
        />
      )}

      {/* AI Document & Bundle Uploader */}
      <div style={{ marginTop: 28 }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: "#0f172a", marginBottom: 12 }}>
          📷 AI Document Image / Multi-Certificate Bundle Scanner
        </h3>
        <DocumentUpload
          onVerificationComplete={(res) => setVerifResult(res)}
          defaultStudentId="261FA04001"
        />
      </div>
    </div>
  );
}
