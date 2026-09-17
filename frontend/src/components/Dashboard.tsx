"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { api, Student, DocumentRequest } from "../lib/api";

export default function Dashboard() {
  const [students, setStudents] = useState<Student[]>([]);
  const [requests, setRequests] = useState<DocumentRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [backendHealth, setBackendHealth] = useState<string>("checking");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    setError(null);
    try {
      const [healthRes, studList, reqList] = await Promise.allSettled([
        api.checkHealth(),
        api.getStudents(),
        api.getDocumentRequests(),
      ]);

      if (healthRes.status === "fulfilled") {
        setBackendHealth("connected");
      } else {
        setBackendHealth("degraded");
      }

      if (studList.status === "fulfilled") {
        setStudents(studList.value);
      }
      if (reqList.status === "fulfilled") {
        setRequests(reqList.value);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  }

  const activeStudent = students.find((s) => s.student_id === "261FA04001") || students[0];
  const pendingRequests = requests.filter((r) => r.status === "Pending").length;
  const approvedRequests = requests.filter((r) => r.status === "Approved" || r.status === "Issued").length;

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 16px" }}>
      {/* Header Banner */}
      <div
        style={{
          background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)",
          borderRadius: 16,
          padding: "32px 28px",
          color: "white",
          boxShadow: "0 10px 25px rgba(0, 0, 0, 0.12)",
          marginBottom: 28,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <span
                style={{
                  display: "inline-block",
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  backgroundColor: backendHealth === "connected" ? "#10b981" : "#f59e0b",
                  boxShadow: backendHealth === "connected" ? "0 0 10px #10b981" : "none",
                }}
              />
              <span style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: 1.2, fontWeight: 600, color: "#93c5fd" }}>
                Institutional Loan Verification System · Agent 43
              </span>
            </div>
            <h1 style={{ fontSize: "2rem", fontWeight: 800, margin: "4px 0 12px 0", letterSpacing: "-0.02em" }}>
              VFSTR Education Loan Orchestration
            </h1>
            <p style={{ margin: 0, color: "#cbd5e1", fontSize: 15, maxWidth: 640, lineHeight: 1.5 }}>
              Connecting Students, Institutional Accounts, Registrar Cell, and Nationalized Banks via AI-Powered Cross-Document Identity Verification.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "flex-end" }}>
            <span
              style={{
                background: "rgba(255, 255, 255, 0.12)",
                backdropFilter: "blur(8px)",
                padding: "8px 14px",
                borderRadius: 9999,
                fontSize: 13,
                fontWeight: 600,
                color: "#e2e8f0",
                border: "1px solid rgba(255, 255, 255, 0.18)",
              }}
            >
              🏛️ Vignan Deemed to be University
            </span>
            <button
              onClick={loadData}
              style={{
                background: "#2563eb",
                color: "white",
                border: "none",
                borderRadius: 8,
                padding: "8px 16px",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              🔄 Refresh Status
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 18,
          marginBottom: 32,
        }}
      >
        <div style={{ background: "white", borderRadius: 12, padding: 22, border: "1px solid #e2e8f0", boxShadow: "0 2px 6px rgba(0,0,0,0.04)" }}>
          <div style={{ fontSize: 13, color: "#64748b", fontWeight: 600, textTransform: "uppercase" }}>Registered Borrower</div>
          <div style={{ fontSize: 26, fontWeight: 800, color: "#0f172a", marginTop: 8 }}>
            {activeStudent ? activeStudent.name : "Tejasai"}
          </div>
          <div style={{ fontSize: 13, color: "#2563eb", marginTop: 4, fontWeight: 600 }}>
            Reg No: {activeStudent ? activeStudent.student_id : "261FA04001"}
          </div>
        </div>

        <div style={{ background: "white", borderRadius: 12, padding: 22, border: "1px solid #e2e8f0", boxShadow: "0 2px 6px rgba(0,0,0,0.04)" }}>
          <div style={{ fontSize: 13, color: "#64748b", fontWeight: 600, textTransform: "uppercase" }}>Sanctioned Loan</div>
          <div style={{ fontSize: 26, fontWeight: 800, color: "#059669", marginTop: 8 }}>
            ₹{activeStudent ? activeStudent.sanctioned_amount?.toLocaleString("en-IN") : "20,00,000"}
          </div>
          <div style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>
            Bank: {activeStudent?.loan_bank || "State Bank of India"}
          </div>
        </div>

        <div style={{ background: "white", borderRadius: 12, padding: 22, border: "1px solid #e2e8f0", boxShadow: "0 2px 6px rgba(0,0,0,0.04)" }}>
          <div style={{ fontSize: 13, color: "#64748b", fontWeight: 600, textTransform: "uppercase" }}>Pending Certificates</div>
          <div style={{ fontSize: 26, fontWeight: 800, color: pendingRequests > 0 ? "#d97706" : "#059669", marginTop: 8 }}>
            {pendingRequests}
          </div>
          <div style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>
            SLA: Fast-tracked (&lt; 24 hrs)
          </div>
        </div>

        <div style={{ background: "white", borderRadius: 12, padding: 22, border: "1px solid #e2e8f0", boxShadow: "0 2px 6px rgba(0,0,0,0.04)" }}>
          <div style={{ fontSize: 13, color: "#64748b", fontWeight: 600, textTransform: "uppercase" }}>Hold Immunity</div>
          <div style={{ fontSize: 26, fontWeight: 800, color: "#0284c7", marginTop: 8 }}>
            ACTIVE 🛡️
          </div>
          <div style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>
            Exam & Hall Ticket Shielded
          </div>
        </div>
      </div>

      {/* Role Portal Quick Links */}
      <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#1e293b", marginBottom: 16 }}>
        Institutional Portals & Services
      </h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: 20,
          marginBottom: 36,
        }}
      >
        <Link
          href="/student"
          style={{
            textDecoration: "none",
            background: "white",
            borderRadius: 14,
            padding: 24,
            border: "1px solid #e2e8f0",
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            transition: "transform 0.15s ease, box-shadow 0.15s ease",
          }}
        >
          <div>
            <div style={{ fontSize: 32, marginBottom: 12 }}>🎓</div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: "#1e293b", margin: "0 0 8px 0" }}>
              Student Loan Desk
            </h3>
            <p style={{ fontSize: 14, color: "#64748b", margin: 0, lineHeight: 1.5 }}>
              Submit Bonafide and Fee Structure certificate requests, monitor hold immunity protection, and simulate repayment moratoriums.
            </p>
          </div>
          <div style={{ marginTop: 20, fontSize: 14, fontWeight: 600, color: "#2563eb", display: "flex", alignItems: "center", gap: 6 }}>
            Launch Student Portal →
          </div>
        </Link>

        <Link
          href="/admin"
          style={{
            textDecoration: "none",
            background: "white",
            borderRadius: 14,
            padding: 24,
            border: "1px solid #e2e8f0",
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            transition: "transform 0.15s ease, box-shadow 0.15s ease",
          }}
        >
          <div>
            <div style={{ fontSize: 32, marginBottom: 12 }}>🏛️</div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: "#1e293b", margin: "0 0 8px 0" }}>
              Registrar & Accounts Admin
            </h3>
            <p style={{ fontSize: 14, color: "#64748b", margin: 0, lineHeight: 1.5 }}>
              Approve student requests, generate cryptographically sealed certificates with Code-128 & QR barcodes, and reconcile bank disbursements.
            </p>
          </div>
          <div style={{ marginTop: 20, fontSize: 14, fontWeight: 600, color: "#2563eb", display: "flex", alignItems: "center", gap: 6 }}>
            Launch Admin Portal →
          </div>
        </Link>

        <Link
          href="/verification"
          style={{
            textDecoration: "none",
            background: "white",
            borderRadius: 14,
            padding: 24,
            border: "1px solid #e2e8f0",
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            transition: "transform 0.15s ease, box-shadow 0.15s ease",
          }}
        >
          <div>
            <div style={{ fontSize: 32, marginBottom: 12 }}>🏦</div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: "#1e293b", margin: "0 0 8px 0" }}>
              Bank Direct Verification
            </h3>
            <p style={{ fontSize: 14, color: "#64748b", margin: 0, lineHeight: 1.5 }}>
              Verify student documents instantly via 12-character alphanumeric code, camera barcode scan, or upload complete 6-certificate bundles.
            </p>
          </div>
          <div style={{ marginTop: 20, fontSize: 14, fontWeight: 600, color: "#2563eb", display: "flex", alignItems: "center", gap: 6 }}>
            Launch Verification Portal →
          </div>
        </Link>
      </div>

      {/* Active Student Spotlight & Recent Activity */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: 24 }}>
        {/* Student Profile Card */}
        <div style={{ background: "white", borderRadius: 14, padding: 24, border: "1px solid #e2e8f0" }}>
          <h3 style={{ fontSize: 17, fontWeight: 700, color: "#0f172a", marginBottom: 16 }}>
            👤 Active Institutional Student Record
          </h3>
          {activeStudent ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #f1f5f9", paddingBottom: 8 }}>
                <span style={{ color: "#64748b", fontSize: 14 }}>Full Name:</span>
                <span style={{ fontWeight: 600, color: "#0f172a", fontSize: 14 }}>{activeStudent.name}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #f1f5f9", paddingBottom: 8 }}>
                <span style={{ color: "#64748b", fontSize: 14 }}>Registration Number:</span>
                <span style={{ fontWeight: 600, color: "#2563eb", fontSize: 14 }}>{activeStudent.student_id}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #f1f5f9", paddingBottom: 8 }}>
                <span style={{ color: "#64748b", fontSize: 14 }}>Program & Year:</span>
                <span style={{ fontWeight: 600, color: "#0f172a", fontSize: 14 }}>
                  {activeStudent.course} ({activeStudent.year})
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #f1f5f9", paddingBottom: 8 }}>
                <span style={{ color: "#64748b", fontSize: 14 }}>Total 4-Year Academic Fee:</span>
                <span style={{ fontWeight: 600, color: "#0f172a", fontSize: 14 }}>
                  ₹{activeStudent.total_fee?.toLocaleString("en-IN")}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #f1f5f9", paddingBottom: 8 }}>
                <span style={{ color: "#64748b", fontSize: 14 }}>Education Loan Status:</span>
                <span style={{ fontWeight: 600, color: "#059669", fontSize: 14 }}>
                  {activeStudent.loan_status} ({activeStudent.loan_bank})
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#64748b", fontSize: 14 }}>Immunity Flag:</span>
                <span style={{ fontWeight: 600, color: "#0284c7", fontSize: 14 }}>Loan-Dependent Shield Active</span>
              </div>
            </div>
          ) : (
            <p style={{ color: "#64748b" }}>Loading student records...</p>
          )}
        </div>

        {/* Recent Requests Table */}
        <div style={{ background: "white", borderRadius: 14, padding: 24, border: "1px solid #e2e8f0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3 style={{ fontSize: 17, fontWeight: 700, color: "#0f172a", margin: 0 }}>
              📋 Document Request Stream
            </h3>
            <Link href="/admin" style={{ fontSize: 13, color: "#2563eb", textDecoration: "none", fontWeight: 600 }}>
              Manage All →
            </Link>
          </div>

          {requests.length === 0 ? (
            <p style={{ color: "#64748b", fontSize: 14 }}>No document requests logged.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {requests.slice(0, 4).map((req) => (
                <div
                  key={req.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "10px 14px",
                    background: "#f8fafc",
                    borderRadius: 8,
                    border: "1px solid #f1f5f9",
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14, color: "#1e293b" }}>
                      #{req.id} - {req.document_type}
                    </div>
                    <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>
                      {req.student_id} · {req.description || "Bank requirement"} · {req.request_date}
                    </div>
                  </div>
                  <span
                    style={{
                      padding: "4px 10px",
                      borderRadius: 9999,
                      fontSize: 12,
                      fontWeight: 700,
                      background: req.status === "Approved" || req.status === "Issued" ? "#dcfce7" : "#fef3c7",
                      color: req.status === "Approved" || req.status === "Issued" ? "#166534" : "#92400e",
                    }}
                  >
                    {req.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
