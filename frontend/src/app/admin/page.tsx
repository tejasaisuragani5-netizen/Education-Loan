"use client";

import React, { useState, useEffect } from "react";
import { api, DocumentRequest, Student, IssuedDocument, Disbursement } from "../../lib/api";

export default function AdminPortalPage() {
  const [requests, setRequests] = useState<DocumentRequest[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [documents, setDocuments] = useState<IssuedDocument[]>([]);
  const [disbursements, setDisbursements] = useState<Disbursement[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  useEffect(() => {
    loadAdminData();
  }, []);

  async function loadAdminData() {
    setLoading(true);
    try {
      const [reqList, studList, docList, disbList] = await Promise.allSettled([
        api.getDocumentRequests(),
        api.getStudents(),
        api.getDocuments(),
        api.getDisbursements(),
      ]);

      if (reqList.status === "fulfilled") setRequests(reqList.value);
      if (studList.status === "fulfilled") setStudents(studList.value);
      if (docList.status === "fulfilled") setDocuments(docList.value);
      if (disbList.status === "fulfilled") setDisbursements(disbList.value);
    } catch {
      console.error("Failed to load admin data");
    } finally {
      setLoading(false);
    }
  }

  async function handleApproveAndIssue(requestId: number) {
    try {
      setActionMessage(`Generating cryptosealed certificate for Request #${requestId}...`);
      const res = await api.generateDocument(requestId);
      setActionMessage(`✓ Success: ${res.message}! Verification Code: ${res.verification_code}`);
      loadAdminData();
    } catch (err: any) {
      setActionMessage(`⚠️ Failed: ${err.message}`);
    }
  }

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 16px" }}>
      {/* Header */}
      <div
        style={{
          background: "linear-gradient(135deg, #0f172a 0%, #334155 100%)",
          borderRadius: 16,
          padding: "28px 24px",
          color: "white",
          marginBottom: 24,
          boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
        }}
      >
        <div style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: 1.2, color: "#94a3b8", fontWeight: 700 }}>
          Registrar & Institutional Accounts Portal
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 800, margin: "6px 0 8px 0" }}>
          Document Issuance & Compliance Administration
        </h1>
        <p style={{ margin: 0, fontSize: 15, color: "#cbd5e1" }}>
          Execute cryptographic document approvals, maintain loan-dependent rosters, and audit bank disbursements.
        </p>
      </div>

      {actionMessage && (
        <div
          style={{
            background: "#eff6ff",
            color: "#1e40af",
            padding: 14,
            borderRadius: 8,
            border: "1px solid #bfdbfe",
            marginBottom: 20,
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          {actionMessage}
        </div>
      )}

      {/* Pending Approval Queue */}
      <div style={{ background: "white", borderRadius: 14, padding: 24, border: "1px solid #e2e8f0", marginBottom: 28 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: "#0f172a", margin: 0 }}>
            ⚡ Document Approval & Digital Seal Queue
          </h3>
          <button
            onClick={loadAdminData}
            style={{
              background: "#f1f5f9",
              border: "1px solid #cbd5e1",
              borderRadius: 6,
              padding: "6px 12px",
              fontSize: 12,
              cursor: "pointer",
            }}
          >
            🔄 Refresh
          </button>
        </div>

        {loading ? (
          <div style={{ padding: 20, textAlign: "center", color: "#64748b" }}>Loading queue...</div>
        ) : requests.length === 0 ? (
          <div style={{ padding: 20, textAlign: "center", color: "#64748b" }}>No requests pending.</div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
              <thead>
                <tr style={{ background: "#f8fafc", borderBottom: "2px solid #e2e8f0", textAlign: "left" }}>
                  <th style={{ padding: 12 }}>Req ID</th>
                  <th style={{ padding: 12 }}>Student</th>
                  <th style={{ padding: 12 }}>Document Type</th>
                  <th style={{ padding: 12 }}>Target Bank</th>
                  <th style={{ padding: 12 }}>Requested</th>
                  <th style={{ padding: 12 }}>Status</th>
                  <th style={{ padding: 12 }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((req) => (
                  <tr key={req.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={{ padding: 12, fontWeight: 700 }}>#{req.id}</td>
                    <td style={{ padding: 12 }}>
                      <strong>{req.student_name || "Tejasai"}</strong>
                      <div style={{ fontSize: 12, color: "#64748b" }}>{req.student_id}</div>
                    </td>
                    <td style={{ padding: 12 }}>{req.document_type}</td>
                    <td style={{ padding: 12 }}>{req.description || "State Bank of India"}</td>
                    <td style={{ padding: 12, fontSize: 13, color: "#64748b" }}>{req.request_date}</td>
                    <td style={{ padding: 12 }}>
                      <span
                        style={{
                          padding: "3px 10px",
                          borderRadius: 9999,
                          fontSize: 12,
                          fontWeight: 700,
                          background: req.status === "Approved" || req.status === "Issued" ? "#dcfce7" : "#fef3c7",
                          color: req.status === "Approved" || req.status === "Issued" ? "#166534" : "#92400e",
                        }}
                      >
                        {req.status}
                      </span>
                    </td>
                    <td style={{ padding: 12 }}>
                      {req.status === "Pending" ? (
                        <button
                          onClick={() => handleApproveAndIssue(req.id)}
                          style={{
                            background: "#059669",
                            color: "white",
                            border: "none",
                            borderRadius: 6,
                            padding: "6px 12px",
                            fontSize: 12,
                            fontWeight: 700,
                            cursor: "pointer",
                          }}
                        >
                          ✓ Approve & Issue PDF
                        </button>
                      ) : (
                        <span style={{ fontSize: 12, color: "#059669", fontWeight: 600 }}>
                          ✓ Issued (ELN-261FA04001)
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Student Loan Registry */}
      <div style={{ background: "white", borderRadius: 14, padding: 24, border: "1px solid #e2e8f0" }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: "#0f172a", marginBottom: 16 }}>
          🎓 Official Student Loan Registry & Fee Status
        </h3>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr style={{ background: "#f8fafc", borderBottom: "2px solid #e2e8f0", textAlign: "left" }}>
                <th style={{ padding: 12 }}>Reg No.</th>
                <th style={{ padding: 12 }}>Name</th>
                <th style={{ padding: 12 }}>Program</th>
                <th style={{ padding: 12 }}>Total Fee</th>
                <th style={{ padding: 12 }}>Sanctioned Loan</th>
                <th style={{ padding: 12 }}>Loan Bank</th>
                <th style={{ padding: 12 }}>Immunity Status</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <td style={{ padding: 12, fontWeight: 700, color: "#2563eb" }}>{s.student_id}</td>
                  <td style={{ padding: 12, fontWeight: 600 }}>{s.name}</td>
                  <td style={{ padding: 12 }}>{s.course} ({s.year})</td>
                  <td style={{ padding: 12, fontWeight: 600 }}>₹{s.total_fee?.toLocaleString("en-IN")}</td>
                  <td style={{ padding: 12, fontWeight: 700, color: "#059669" }}>
                    ₹{s.sanctioned_amount?.toLocaleString("en-IN")}
                  </td>
                  <td style={{ padding: 12 }}>{s.loan_bank}</td>
                  <td style={{ padding: 12 }}>
                    <span
                      style={{
                        padding: "3px 10px",
                        borderRadius: 9999,
                        fontSize: 11,
                        fontWeight: 700,
                        background: "#dbeafe",
                        color: "#1e40af",
                      }}
                    >
                      🛡️ Immunity Active
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
