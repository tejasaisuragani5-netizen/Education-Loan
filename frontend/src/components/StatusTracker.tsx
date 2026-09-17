"use client";

import React, { useEffect, useState } from "react";
import { api, DocumentRequest } from "../lib/api";

interface StatusTrackerProps {
  studentId?: string;
  onRequestUpdated?: () => void;
}

export default function StatusTracker({ studentId = "261FA04001", onRequestUpdated }: StatusTrackerProps) {
  const [requests, setRequests] = useState<DocumentRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadRequests();
  }, [studentId]);

  async function loadRequests() {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getDocumentRequests(studentId);
      setRequests(data);
    } catch (err: any) {
      setError(err.message || "Failed to load document requests");
    } finally {
      setLoading(false);
    }
  }

  const steps = [
    { title: "1. Request Lodged", desc: "Submitted by student" },
    { title: "2. Accounts Audit", desc: "Fee & sanction check" },
    { title: "3. Digital Seal & QR", desc: "Registrar cryptoseal" },
    { title: "4. Issued & Verifiable", desc: "Ready for bank submission" },
  ];

  function getActiveStepIndex(status: string) {
    switch (status) {
      case "Pending":
        return 1; // At Accounts Audit
      case "Approved":
      case "Issued":
        return 3; // Fully Issued
      case "Rejected":
        return 0;
      default:
        return 1;
    }
  }

  return (
    <div style={{ background: "white", borderRadius: 14, padding: 24, border: "1px solid #e2e8f0" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: "#0f172a", margin: "0 0 4px 0" }}>
            📑 Document Request Lifecycle & SLA Tracker
          </h3>
          <p style={{ margin: 0, fontSize: 13, color: "#64748b" }}>
            Student: <strong style={{ color: "#2563eb" }}>{studentId}</strong> · Live Institutional Registry
          </p>
        </div>
        <button
          onClick={loadRequests}
          style={{
            background: "#f1f5f9",
            border: "1px solid #cbd5e1",
            borderRadius: 8,
            padding: "6px 12px",
            fontSize: 12,
            fontWeight: 600,
            cursor: "pointer",
            color: "#334155",
          }}
        >
          🔄 Refresh
        </button>
      </div>

      {/* Hold Immunity Banner */}
      <div
        style={{
          background: "#f0fdf4",
          border: "1px solid #bbf7d0",
          borderRadius: 10,
          padding: "12px 16px",
          marginBottom: 20,
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <div style={{ fontSize: 24 }}>🛡️</div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#166534" }}>
            Hold Immunity Protocol Active
          </div>
          <div style={{ fontSize: 12, color: "#15803d" }}>
            Student has verified education loan dependence with State Bank of India. Registration, attendance, and hall ticket access are protected from fee-related holds.
          </div>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: 24, textAlign: "center", color: "#64748b", fontSize: 14 }}>
          Loading document requests...
        </div>
      ) : error ? (
        <div style={{ padding: 16, background: "#fef2f2", color: "#991b1b", borderRadius: 8, fontSize: 13 }}>
          ⚠️ {error}
        </div>
      ) : requests.length === 0 ? (
        <div style={{ padding: 24, textAlign: "center", color: "#64748b", fontSize: 14 }}>
          No document requests found for student {studentId}.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {requests.map((req) => {
            const activeStep = getActiveStepIndex(req.status);
            return (
              <div
                key={req.id}
                style={{
                  border: "1px solid #e2e8f0",
                  borderRadius: 12,
                  padding: 18,
                  background: "#fafafa",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 10, marginBottom: 14 }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 16, fontWeight: 700, color: "#0f172a" }}>
                        #{req.id} · {req.document_type}
                      </span>
                      <span
                        style={{
                          padding: "3px 10px",
                          borderRadius: 9999,
                          fontSize: 11,
                          fontWeight: 700,
                          background:
                            req.status === "Approved" || req.status === "Issued"
                              ? "#dcfce7"
                              : req.status === "Pending"
                              ? "#fef3c7"
                              : "#fee2e2",
                          color:
                            req.status === "Approved" || req.status === "Issued"
                              ? "#166534"
                              : req.status === "Pending"
                              ? "#92400e"
                              : "#991b1b",
                        }}
                      >
                        {req.status}
                      </span>
                    </div>
                    <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>
                      Requested: {req.request_date} · Target Bank: {req.description || "State Bank of India"}
                    </div>
                  </div>

                  {req.status === "Approved" && (
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: "#059669",
                        background: "#ecfdf5",
                        padding: "4px 10px",
                        borderRadius: 6,
                        border: "1px solid #a7f3d0",
                      }}
                    >
                      ✓ SLA Met (&lt; 3 hrs)
                    </span>
                  )}
                </div>

                {/* Progress Bar / Steps */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginTop: 12 }}>
                  {steps.map((step, idx) => {
                    const isDone = idx <= activeStep;
                    const isCurrent = idx === activeStep && req.status !== "Approved";
                    return (
                      <div
                        key={idx}
                        style={{
                          background: isDone ? "#dbeafe" : "#f1f5f9",
                          border: isDone ? "1px solid #bfdbfe" : "1px solid #e2e8f0",
                          borderRadius: 8,
                          padding: "8px 10px",
                        }}
                      >
                        <div
                          style={{
                            fontSize: 11,
                            fontWeight: 700,
                            color: isDone ? "#1e40af" : "#64748b",
                          }}
                        >
                          {step.title}
                        </div>
                        <div style={{ fontSize: 10, color: isDone ? "#3b82f6" : "#94a3b8", marginTop: 2 }}>
                          {step.desc}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Issued Certificate Actions */}
                {(req.status === "Approved" || req.status === "Issued") && (
                  <div
                    style={{
                      marginTop: 14,
                      paddingTop: 12,
                      borderTop: "1px dashed #cbd5e1",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: 10,
                    }}
                  >
                    <div style={{ fontSize: 13, color: "#334155" }}>
                      Verification Key: <strong style={{ color: "#2563eb", fontFamily: "monospace" }}>ELN-261FA04001</strong>
                    </div>
                    <div style={{ display: "flex", gap: 10 }}>
                      <a
                        href="/verification"
                        style={{
                          background: "#2563eb",
                          color: "white",
                          padding: "6px 14px",
                          borderRadius: 6,
                          fontSize: 12,
                          fontWeight: 600,
                          textDecoration: "none",
                        }}
                      >
                        🔍 Verify Authenticity
                      </a>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
