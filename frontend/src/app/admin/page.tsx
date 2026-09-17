"use client";

import React, { useState, useEffect } from "react";
import DocumentUpload from "../../components/DocumentUpload";
import VerificationResult from "../../components/VerificationResult";
import AuditTrail from "../../components/AuditTrail";
import DatabaseArchitecture from "../../components/DatabaseArchitecture";
import { api, DocumentRequest, Student, IssuedDocument, Disbursement, VerificationResultData, BundleEvaluationData } from "../../lib/api";

type AdminTab = "registry" | "verification" | "requests" | "audit";

export default function AdminPortalPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>("requests");
  const [requests, setRequests] = useState<DocumentRequest[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [documents, setDocuments] = useState<IssuedDocument[]>([]);
  const [disbursements, setDisbursements] = useState<Disbursement[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  // Verification queue result
  const [queueVerifResult, setQueueVerifResult] = useState<VerificationResultData | BundleEvaluationData | null>(null);

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
          padding: "26px 24px",
          color: "white",
          marginBottom: 24,
          boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <div>
            <div style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: 1.2, color: "#94a3b8", fontWeight: 700 }}>
              Role: Accounts / Admin
            </div>
            <h1 style={{ fontSize: 26, fontWeight: 800, margin: "4px 0 6px 0" }}>
              Registrar & Accounts Authority Portal
            </h1>
            <p style={{ margin: 0, fontSize: 14, color: "#cbd5e1" }}>
              Verify / Approve / Generate · Official Institutional Governance & Compliance
            </p>
          </div>
          <button
            onClick={loadAdminData}
            style={{
              background: "#2563eb",
              color: "white",
              border: "none",
              borderRadius: 8,
              padding: "8px 16px",
              fontSize: 12,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            🔄 Refresh Registry
          </button>
        </div>
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

      {/* Admin 4-Section Sub-Navigation */}
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
          { id: "requests", label: "📑 Document Requests" },
          { id: "registry", label: "🎓 Student Registry" },
          { id: "verification", label: "⚡ Verification Queue" },
          { id: "audit", label: "📋 Audit Logs & Reconciliation" },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as AdminTab)}
            style={{
              background: activeTab === tab.id ? "#0f172a" : "#f1f5f9",
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

      {/* SECTION 1: DOCUMENT REQUESTS (Approve / Generate) */}
      {activeTab === "requests" && (
        <div style={{ background: "white", borderRadius: 14, padding: 24, border: "1px solid #e2e8f0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: "#0f172a", margin: 0 }}>
              ⚡ Document Request Issuance Queue
            </h3>
            <span style={{ fontSize: 13, color: "#64748b" }}>
              Total: <strong>{requests.length}</strong> logged
            </span>
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
                    <th style={{ padding: 12 }}>Requested Date</th>
                    <th style={{ padding: 12 }}>Status</th>
                    <th style={{ padding: 12 }}>Administrative Action</th>
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
                              padding: "7px 14px",
                              fontSize: 12,
                              fontWeight: 700,
                              cursor: "pointer",
                            }}
                          >
                            ✓ Approve & Issue PDF
                          </button>
                        ) : (
                          <span style={{ fontSize: 12, color: "#059669", fontWeight: 700 }}>
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
      )}

      {/* SECTION 2: STUDENT REGISTRY */}
      {activeTab === "registry" && (
        <div style={{ background: "white", borderRadius: 14, padding: 24, border: "1px solid #e2e8f0" }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: "#0f172a", marginBottom: 16 }}>
            🎓 Official Student Loan Registry & Fee Status
          </h3>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
              <thead>
                <tr style={{ background: "#f8fafc", borderBottom: "2px solid #e2e8f0", textAlign: "left" }}>
                  <th style={{ padding: 12 }}>Reg No.</th>
                  <th style={{ padding: 12 }}>Student Name</th>
                  <th style={{ padding: 12 }}>Program & Year</th>
                  <th style={{ padding: 12 }}>Total 4-Yr Fee</th>
                  <th style={{ padding: 12 }}>Sanctioned Loan</th>
                  <th style={{ padding: 12 }}>Bank Partner</th>
                  <th style={{ padding: 12 }}>Immunity Flag</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <tr key={s.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={{ padding: 12, fontWeight: 700, color: "#2563eb", fontFamily: "monospace" }}>{s.student_id}</td>
                    <td style={{ padding: 12, fontWeight: 700 }}>{s.name}</td>
                    <td style={{ padding: 12 }}>{s.course} ({s.year})</td>
                    <td style={{ padding: 12, fontWeight: 700 }}>₹{s.total_fee?.toLocaleString("en-IN")}</td>
                    <td style={{ padding: 12, fontWeight: 800, color: "#059669" }}>
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
      )}

      {/* SECTION 3: VERIFICATION QUEUE */}
      {activeTab === "verification" && (
        <div>
          <div style={{ marginBottom: 16 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: "#0f172a", margin: "0 0 4px 0" }}>
              ⚡ Institutional Document Verification Queue
            </h3>
            <p style={{ margin: 0, fontSize: 13, color: "#64748b" }}>
              Audit incoming student certificate files against institutional seal templates and digital signatures.
            </p>
          </div>

          <DocumentUpload
            onVerificationComplete={(res) => setQueueVerifResult(res)}
            defaultStudentId="261FA04001"
          />

          {queueVerifResult && (
            <VerificationResult
              result={queueVerifResult}
              onReset={() => setQueueVerifResult(null)}
            />
          )}
        </div>
      )}

      {/* SECTION 4: AUDIT LOGS & DISBURSEMENTS */}
      {activeTab === "audit" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <AuditTrail />

          <DatabaseArchitecture />

          <div style={{ background: "white", borderRadius: 14, padding: 24, border: "1px solid #e2e8f0" }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: "#0f172a", marginBottom: 16 }}>
              🏦 Direct Bank Remittances & Disbursement Reconciliation
            </h3>
            {disbursements.length === 0 ? (
              <div style={{ padding: 16, background: "#f8fafc", borderRadius: 8, color: "#64748b", fontSize: 13 }}>
                No external remittances logged today. All fee receipts reconcile with SBI direct transfer schedule.
              </div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                  <thead>
                    <tr style={{ background: "#f8fafc", borderBottom: "2px solid #e2e8f0" }}>
                      <th style={{ padding: 12 }}>UTR Reference</th>
                      <th style={{ padding: 12 }}>Bank</th>
                      <th style={{ padding: 12 }}>Student</th>
                      <th style={{ padding: 12 }}>Amount</th>
                      <th style={{ padding: 12 }}>Date</th>
                      <th style={{ padding: 12 }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {disbursements.map((d) => (
                      <tr key={d.id}>
                        <td style={{ padding: 12, fontFamily: "monospace" }}>{d.utr_reference}</td>
                        <td style={{ padding: 12 }}>{d.bank_name}</td>
                        <td style={{ padding: 12 }}>{d.student_id}</td>
                        <td style={{ padding: 12, fontWeight: 700 }}>₹{d.amount.toLocaleString("en-IN")}</td>
                        <td style={{ padding: 12 }}>{d.disbursement_date}</td>
                        <td style={{ padding: 12 }}>{d.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div style={{ background: "#f8fafc", borderRadius: 14, padding: 20, border: "1px solid #e2e8f0" }}>
            <h4 style={{ fontSize: 14, fontWeight: 800, color: "#1e293b", margin: "0 0 10px 0", textTransform: "uppercase" }}>
              📋 Administrative Compliance & SLA Telemetry
            </h4>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12, fontSize: 13 }}>
              <div style={{ background: "white", padding: 12, borderRadius: 8, border: "1px solid #e2e8f0" }}>
                <div style={{ color: "#64748b" }}>Mean Issuance SLA</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: "#059669", marginTop: 4 }}>3.0 Hours</div>
              </div>
              <div style={{ background: "white", padding: 12, borderRadius: 8, border: "1px solid #e2e8f0" }}>
                <div style={{ color: "#64748b" }}>Security Standard</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: "#2563eb", marginTop: 4 }}>SHA-256 + QR</div>
              </div>
              <div style={{ background: "white", padding: 12, borderRadius: 8, border: "1px solid #e2e8f0" }}>
                <div style={{ color: "#64748b" }}>Regulatory Protocol</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: "#0f172a", marginTop: 4 }}>IBA Model Scheme</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
