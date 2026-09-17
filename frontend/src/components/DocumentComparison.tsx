"use client";

import React, { useState } from "react";

interface DocumentComparisonProps {
  initialMode?: "verified" | "adversarial";
}

export default function DocumentComparison({ initialMode = "verified" }: DocumentComparisonProps) {
  const [mode, setMode] = useState<"verified" | "adversarial">(initialMode);

  return (
    <div
      style={{
        background: "white",
        borderRadius: 16,
        border: "1px solid #e2e8f0",
        padding: "26px 24px",
        boxShadow: "0 8px 24px rgba(0,0,0,0.05)",
        marginTop: 24,
      }}
    >
      {/* Header with Mode Toggle */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: 16,
          marginBottom: 20,
          borderBottom: "1px solid #f1f5f9",
          paddingBottom: 16,
        }}
      >
        <div>
          <div style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: 1.2, color: "#2563eb", fontWeight: 700 }}>
            Real-Time Cross-Document Synthesis Engine
          </div>
          <h3 style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", margin: "4px 0 6px 0" }}>
            DOCUMENT CONSISTENCY MATRIX
          </h3>
          <p style={{ margin: 0, fontSize: 13, color: "#64748b" }}>
            Automated multi-certificate field correlation and adversarial tamper detection.
          </p>
        </div>

        {/* Mode Selector Buttons */}
        <div
          style={{
            background: "#f1f5f9",
            padding: 4,
            borderRadius: 10,
            display: "inline-flex",
            gap: 4,
          }}
        >
          <button
            type="button"
            onClick={() => setMode("verified")}
            style={{
              background: mode === "verified" ? "#ffffff" : "transparent",
              color: mode === "verified" ? "#166534" : "#64748b",
              border: mode === "verified" ? "1px solid #bbf7d0" : "none",
              boxShadow: mode === "verified" ? "0 2px 4px rgba(0,0,0,0.06)" : "none",
              borderRadius: 8,
              padding: "8px 14px",
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
          >
            ✓ Authentic Bundle (100% Match)
          </button>
          <button
            type="button"
            onClick={() => setMode("adversarial")}
            style={{
              background: mode === "adversarial" ? "#ffffff" : "transparent",
              color: mode === "adversarial" ? "#991b1b" : "#64748b",
              border: mode === "adversarial" ? "1px solid #fecaca" : "none",
              boxShadow: mode === "adversarial" ? "0 2px 4px rgba(0,0,0,0.06)" : "none",
              borderRadius: 8,
              padding: "8px 14px",
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
          >
            ⚡ Test Adversarial Mismatch
          </button>
        </div>
      </div>

      {/* Comparison Matrix Table */}
      <div style={{ overflowX: "auto", marginBottom: 20 }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
          <thead>
            <tr style={{ background: "#f8fafc", borderBottom: "2px solid #e2e8f0", textAlign: "center" }}>
              <th style={{ padding: "12px 16px", textAlign: "left", color: "#475569", fontWeight: 700, width: "28%" }}>
                ATTRIBUTE
              </th>
              <th style={{ padding: "12px 16px", color: "#0f172a", fontWeight: 700, width: "24%" }}>
                📄 Bonafide Certificate
              </th>
              <th
                style={{
                  padding: "12px 16px",
                  color: mode === "adversarial" ? "#dc2626" : "#0f172a",
                  fontWeight: 700,
                  width: "24%",
                  background: mode === "adversarial" ? "#fef2f2" : "transparent",
                }}
              >
                📊 Fee Letter {mode === "adversarial" && "(Tampered)"}
              </th>
              <th style={{ padding: "12px 16px", color: "#0f172a", fontWeight: 700, width: "24%" }}>
                🎓 Admission Letter
              </th>
            </tr>
          </thead>
          <tbody>
            {/* Row 1: Student ID */}
            <tr style={{ borderBottom: "1px solid #f1f5f9" }}>
              <td style={{ padding: "12px 16px", fontWeight: 700, color: "#1e293b" }}>Student ID</td>
              <td style={{ padding: "12px 16px", textAlign: "center" }}>
                <span style={{ color: "#166534", fontWeight: 800, fontSize: 16 }}>✓</span>
                <span style={{ fontSize: 11, color: "#64748b", display: "block" }}>261FA04001</span>
              </td>
              <td
                style={{
                  padding: "12px 16px",
                  textAlign: "center",
                  background: mode === "adversarial" ? "#fff1f2" : "transparent",
                }}
              >
                {mode === "verified" ? (
                  <>
                    <span style={{ color: "#166534", fontWeight: 800, fontSize: 16 }}>✓</span>
                    <span style={{ fontSize: 11, color: "#64748b", display: "block" }}>261FA04001</span>
                  </>
                ) : (
                  <>
                    <span style={{ color: "#dc2626", fontWeight: 900, fontSize: 16 }}>✗ MISMATCH</span>
                    <span style={{ fontSize: 11, color: "#dc2626", fontWeight: 700, display: "block" }}>
                      241FA04195
                    </span>
                  </>
                )}
              </td>
              <td style={{ padding: "12px 16px", textAlign: "center" }}>
                <span style={{ color: "#166534", fontWeight: 800, fontSize: 16 }}>✓</span>
                <span style={{ fontSize: 11, color: "#64748b", display: "block" }}>261FA04001</span>
              </td>
            </tr>

            {/* Row 2: Student Name */}
            <tr style={{ borderBottom: "1px solid #f1f5f9", background: "#fbfcfe" }}>
              <td style={{ padding: "12px 16px", fontWeight: 700, color: "#1e293b" }}>Student Name</td>
              <td style={{ padding: "12px 16px", textAlign: "center" }}>
                <span style={{ color: "#166534", fontWeight: 800, fontSize: 16 }}>✓</span>
                <span style={{ fontSize: 11, color: "#64748b", display: "block" }}>Tejasai</span>
              </td>
              <td
                style={{
                  padding: "12px 16px",
                  textAlign: "center",
                  background: mode === "adversarial" ? "#fff1f2" : "transparent",
                }}
              >
                {mode === "verified" ? (
                  <>
                    <span style={{ color: "#166534", fontWeight: 800, fontSize: 16 }}>✓</span>
                    <span style={{ fontSize: 11, color: "#64748b", display: "block" }}>Tejasai</span>
                  </>
                ) : (
                  <>
                    <span style={{ color: "#dc2626", fontWeight: 900, fontSize: 16 }}>✗ MISMATCH</span>
                    <span style={{ fontSize: 11, color: "#dc2626", fontWeight: 700, display: "block" }}>
                      K. Jagadeesh
                    </span>
                  </>
                )}
              </td>
              <td style={{ padding: "12px 16px", textAlign: "center" }}>
                <span style={{ color: "#166534", fontWeight: 800, fontSize: 16 }}>✓</span>
                <span style={{ fontSize: 11, color: "#64748b", display: "block" }}>Tejasai</span>
              </td>
            </tr>

            {/* Row 3: Course */}
            <tr style={{ borderBottom: "1px solid #f1f5f9" }}>
              <td style={{ padding: "12px 16px", fontWeight: 700, color: "#1e293b" }}>Course / Program</td>
              <td style={{ padding: "12px 16px", textAlign: "center" }}>
                <span style={{ color: "#166534", fontWeight: 800, fontSize: 16 }}>✓</span>
                <span style={{ fontSize: 11, color: "#64748b", display: "block" }}>B.Tech CSE</span>
              </td>
              <td
                style={{
                  padding: "12px 16px",
                  textAlign: "center",
                  background: mode === "adversarial" ? "#fff1f2" : "transparent",
                }}
              >
                <span style={{ color: "#166534", fontWeight: 800, fontSize: 16 }}>✓</span>
                <span style={{ fontSize: 11, color: "#64748b", display: "block" }}>B.Tech CSE</span>
              </td>
              <td style={{ padding: "12px 16px", textAlign: "center" }}>
                <span style={{ color: "#166534", fontWeight: 800, fontSize: 16 }}>✓</span>
                <span style={{ fontSize: 11, color: "#64748b", display: "block" }}>B.Tech CSE</span>
              </td>
            </tr>

            {/* Row 4: Academic Year */}
            <tr style={{ borderBottom: "1px solid #f1f5f9", background: "#fbfcfe" }}>
              <td style={{ padding: "12px 16px", fontWeight: 700, color: "#1e293b" }}>Academic Year</td>
              <td style={{ padding: "12px 16px", textAlign: "center" }}>
                <span style={{ color: "#166534", fontWeight: 800, fontSize: 16 }}>✓</span>
                <span style={{ fontSize: 11, color: "#64748b", display: "block" }}>2026–27</span>
              </td>
              <td
                style={{
                  padding: "12px 16px",
                  textAlign: "center",
                  background: mode === "adversarial" ? "#fff1f2" : "transparent",
                }}
              >
                <span style={{ color: "#166534", fontWeight: 800, fontSize: 16 }}>✓</span>
                <span style={{ fontSize: 11, color: "#64748b", display: "block" }}>2026–27</span>
              </td>
              <td style={{ padding: "12px 16px", textAlign: "center" }}>
                <span style={{ color: "#166534", fontWeight: 800, fontSize: 16 }}>✓</span>
                <span style={{ fontSize: 11, color: "#64748b", display: "block" }}>2026–27</span>
              </td>
            </tr>

            {/* Row 5: Fee Amount */}
            <tr>
              <td style={{ padding: "12px 16px", fontWeight: 700, color: "#1e293b" }}>Total Approved Fee</td>
              <td style={{ padding: "12px 16px", textAlign: "center" }}>
                <span style={{ color: "#94a3b8", fontWeight: 800, fontSize: 16 }}>—</span>
                <span style={{ fontSize: 11, color: "#94a3b8", display: "block" }}>Not on Bonafide</span>
              </td>
              <td
                style={{
                  padding: "12px 16px",
                  textAlign: "center",
                  background: mode === "adversarial" ? "#fff1f2" : "transparent",
                }}
              >
                <span style={{ color: "#166534", fontWeight: 800, fontSize: 16 }}>✓</span>
                <span style={{ fontSize: 11, color: "#64748b", display: "block" }}>₹20,00,000</span>
              </td>
              <td style={{ padding: "12px 16px", textAlign: "center" }}>
                <span style={{ color: "#166534", fontWeight: 800, fontSize: 16 }}>✓</span>
                <span style={{ fontSize: 11, color: "#64748b", display: "block" }}>₹20,00,000</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Outcome Banner */}
      {mode === "verified" ? (
        <div
          style={{
            background: "#f0fdf4",
            border: "1.5px solid #86efac",
            borderRadius: 12,
            padding: "16px 20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#166534" }}>
              ✓ Cross-Document Consistency: <span style={{ fontSize: 18, fontWeight: 900 }}>100%</span>
            </div>
            <div style={{ fontSize: 12, color: "#15803d", marginTop: 2 }}>
              All 3 institutional documents correlate perfectly with master ledger: <strong>261FA04001 (Tejasai)</strong>.
            </div>
          </div>

          <span
            style={{
              background: "#dcfce7",
              color: "#166534",
              padding: "6px 14px",
              borderRadius: 9999,
              fontSize: 12,
              fontWeight: 800,
              border: "1px solid #bbf7d0",
            }}
          >
            🛡️ BUNDLE APPROVED FOR BANK DISBURSEMENT
          </span>
        </div>
      ) : (
        /* Adversarial Mismatch Warning Box */
        <div
          style={{
            background: "#fff1f2",
            border: "2px solid #f43f5e",
            borderRadius: 12,
            padding: "20px",
            boxShadow: "0 4px 14px rgba(244,63,94,0.12)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <span style={{ fontSize: 24 }}>⚠️</span>
            <div>
              <h4 style={{ margin: 0, fontSize: 18, fontWeight: 900, color: "#9f1239", textTransform: "uppercase", letterSpacing: 0.5 }}>
                DISCREPANCY DETECTED
              </h4>
              <div style={{ fontSize: 12, color: "#be123c", fontWeight: 600 }}>
                Live trigger of test: <code>test_bundle_synthesis_adversarial_mismatch_detected()</code>
              </div>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 14,
              marginBottom: 16,
            }}
          >
            <div style={{ background: "white", padding: "12px 14px", borderRadius: 8, border: "1px solid #fecdd3" }}>
              <div style={{ fontSize: 11, color: "#9f1239", fontWeight: 700, textTransform: "uppercase" }}>
                Expected Student ID
              </div>
              <div style={{ fontSize: 17, fontWeight: 900, color: "#0f172a", marginTop: 4, fontFamily: "monospace" }}>
                261FA04001
              </div>
              <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>Applicant: Tejasai</div>
            </div>

            <div style={{ background: "#ffe4e6", padding: "12px 14px", borderRadius: 8, border: "1.5px solid #f43f5e" }}>
              <div style={{ fontSize: 11, color: "#9f1239", fontWeight: 800, textTransform: "uppercase" }}>
                Found in Fee Structure
              </div>
              <div style={{ fontSize: 17, fontWeight: 900, color: "#be123c", marginTop: 4, fontFamily: "monospace" }}>
                241FA04195
              </div>
              <div style={{ fontSize: 11, color: "#9f1239", fontWeight: 700, marginTop: 2 }}>
                Conflicting Student: K. Jagadeesh
              </div>
            </div>

            <div style={{ background: "#881337", color: "white", padding: "12px 14px", borderRadius: 8 }}>
              <div style={{ fontSize: 11, color: "#fecdd3", fontWeight: 700, textTransform: "uppercase" }}>
                Action
              </div>
              <div style={{ fontSize: 16, fontWeight: 900, color: "white", marginTop: 4 }}>
                DOCUMENT FLAGGED
              </div>
              <div style={{ fontSize: 11, color: "#fda4af", marginTop: 2 }}>Fraud / Cross-Student Splicing Flagged</div>
            </div>
          </div>

          <div style={{ fontSize: 12.5, color: "#881337", background: "white", padding: "10px 14px", borderRadius: 8, border: "1px solid #fecdd3", lineHeight: 1.5 }}>
            🛡️ <strong>Why did the AI catch this?</strong> Dimension 2 of our cross-document synthesis engine checks every document's extracted alphanumeric tokens against the applicant's authorized ID. When <code>241FA04195</code> was found in the fee structure alongside <code>261FA04001</code> on the bonafide certificate, the system automatically downgraded the bundle to <strong>REJECTED</strong> and alerted the branch credit manager.
          </div>
        </div>
      )}
    </div>
  );
}
