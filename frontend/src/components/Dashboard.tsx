"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { api, Student, DocumentRequest } from "../lib/api";

export default function Dashboard() {
  const [students, setStudents] = useState<Student[]>([]);
  const [requests, setRequests] = useState<DocumentRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [backendHealth, setBackendHealth] = useState<string>("checking");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [healthRes, studList, reqList] = await Promise.allSettled([
        api.checkHealth(),
        api.getStudents(),
        api.getDocumentRequests(),
      ]);

      if (healthRes.status === "fulfilled") setBackendHealth("connected");
      else setBackendHealth("degraded");

      if (studList.status === "fulfilled") setStudents(studList.value);
      if (reqList.status === "fulfilled") setRequests(reqList.value);
    } catch {
      // offline fallback
    } finally {
      setLoading(false);
    }
  }

  const activeStudent = students.find((s) => s.student_id === "261FA04001") || students[0];
  const pendingRequests = requests.filter((r) => r.status === "Pending").length;

  return (
    <div style={{ maxWidth: 1240, margin: "0 auto", padding: "28px 20px" }}>
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
              <span style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: 1.2, fontWeight: 700, color: "#93c5fd" }}>
                VFSTR Institutional Multi-Role Infrastructure · Agent 43
              </span>
            </div>
            <h1 style={{ fontSize: "2rem", fontWeight: 800, margin: "4px 0 10px 0", letterSpacing: "-0.02em" }}>
              Institutional Education Loan System
            </h1>
            <p style={{ margin: 0, color: "#cbd5e1", fontSize: 14.5, maxWidth: 680, lineHeight: 1.5 }}>
              Dedicated role-segregated workflows for Borrowers (Students), Financial Authorities (Accounts / Registrar), and Lending Institutions (Bank Branch Officers).
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-end" }}>
            <span
              style={{
                background: "rgba(255, 255, 255, 0.12)",
                padding: "6px 14px",
                borderRadius: 9999,
                fontSize: 12,
                fontWeight: 600,
                color: "#e2e8f0",
                border: "1px solid rgba(255, 255, 255, 0.2)",
              }}
            >
              🏛️ Deemed to be University
            </span>
            <button
              onClick={loadData}
              style={{
                background: "#2563eb",
                color: "white",
                border: "none",
                borderRadius: 8,
                padding: "7px 14px",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              🔄 Refresh Ledger
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 16,
          marginBottom: 32,
        }}
      >
        <div style={{ background: "white", borderRadius: 12, padding: 20, border: "1px solid #e2e8f0" }}>
          <div style={{ fontSize: 12, color: "#64748b", fontWeight: 700, textTransform: "uppercase" }}>Registered Borrower</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: "#0f172a", marginTop: 6 }}>
            {activeStudent ? activeStudent.name : "Tejasai"}
          </div>
          <div style={{ fontSize: 12, color: "#2563eb", marginTop: 2, fontWeight: 700 }}>
            {activeStudent ? activeStudent.student_id : "261FA04001"} · B.Tech CSE
          </div>
        </div>

        <div style={{ background: "white", borderRadius: 12, padding: 20, border: "1px solid #e2e8f0" }}>
          <div style={{ fontSize: 12, color: "#64748b", fontWeight: 700, textTransform: "uppercase" }}>Sanctioned Education Loan</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: "#059669", marginTop: 6 }}>
            ₹{activeStudent ? activeStudent.sanctioned_amount?.toLocaleString("en-IN") : "20,00,000"}
          </div>
          <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>
            Bank: {activeStudent?.loan_bank || "State Bank of India"}
          </div>
        </div>

        <div style={{ background: "white", borderRadius: 12, padding: 20, border: "1px solid #e2e8f0" }}>
          <div style={{ fontSize: 12, color: "#64748b", fontWeight: 700, textTransform: "uppercase" }}>Certificate Queue</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: pendingRequests > 0 ? "#d97706" : "#059669", marginTop: 6 }}>
            {pendingRequests} Pending
          </div>
          <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>
            Fast-track SLA: &lt; 24h issuance
          </div>
        </div>

        <div style={{ background: "white", borderRadius: 12, padding: 20, border: "1px solid #e2e8f0" }}>
          <div style={{ fontSize: 12, color: "#64748b", fontWeight: 700, textTransform: "uppercase" }}>Hold Immunity Shield</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: "#0284c7", marginTop: 6 }}>
            PROTECTED 🛡️
          </div>
          <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>
            Exam & Registration Holds Bypassed
          </div>
        </div>
      </div>

      {/* THREE SEPARATE ROLES HIERARCHY */}
      <div style={{ marginBottom: 36 }}>
        <div style={{ marginBottom: 16 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", margin: "0 0 4px 0" }}>
            Institutional Role-Based Portals
          </h2>
          <p style={{ margin: 0, fontSize: 14, color: "#64748b" }}>
            Select an operational role to access dedicated permissions, workflows, and tools.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
            gap: 20,
          }}
        >
          {/* Role 1: Student */}
          <div
            style={{
              background: "white",
              borderRadius: 14,
              border: "1.5px solid #bfdbfe",
              padding: 24,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              boxShadow: "0 4px 12px rgba(37,99,235,0.06)",
            }}
          >
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <span style={{ fontSize: 28 }}>🎓</span>
                <span style={{ background: "#dbeafe", color: "#1e40af", fontSize: 11, fontWeight: 800, padding: "3px 10px", borderRadius: 9999 }}>
                  ROLE 1: STUDENT
                </span>
              </div>
              <h3 style={{ fontSize: 19, fontWeight: 800, color: "#0f172a", margin: "0 0 6px 0" }}>
                Student Loan Portal
              </h3>
              <div style={{ fontSize: 13, color: "#2563eb", fontWeight: 700, marginBottom: 14 }}>
                Upload / Request / Track
              </div>

              <ul style={{ margin: "0 0 20px 0", paddingLeft: 20, fontSize: 13, color: "#475569", lineHeight: 1.8 }}>
                <li><strong>My Profile:</strong> Real-time academic & fee ledger</li>
                <li><strong>Request Documents:</strong> Bonafide & Fee Breakdown</li>
                <li><strong>Upload Documents:</strong> 6-cert bundle pre-evaluation</li>
                <li><strong>Track Application:</strong> Hold immunity & SLA monitor</li>
              </ul>
            </div>

            <Link
              href="/student"
              style={{
                display: "block",
                textAlign: "center",
                background: "#2563eb",
                color: "white",
                padding: "11px 16px",
                borderRadius: 8,
                fontWeight: 700,
                fontSize: 13,
                textDecoration: "none",
              }}
            >
              Enter as Student →
            </Link>
          </div>

          {/* Role 2: Accounts / Admin */}
          <div
            style={{
              background: "white",
              borderRadius: 14,
              border: "1.5px solid #cbd5e1",
              padding: 24,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              boxShadow: "0 4px 12px rgba(15,23,42,0.06)",
            }}
          >
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <span style={{ fontSize: 28 }}>🛡️</span>
                <span style={{ background: "#f1f5f9", color: "#334155", fontSize: 11, fontWeight: 800, padding: "3px 10px", borderRadius: 9999 }}>
                  ROLE 2: ACCOUNTS / ADMIN
                </span>
              </div>
              <h3 style={{ fontSize: 19, fontWeight: 800, color: "#0f172a", margin: "0 0 6px 0" }}>
                Registrar & Accounts Admin
              </h3>
              <div style={{ fontSize: 13, color: "#0f172a", fontWeight: 700, marginBottom: 14 }}>
                Verify / Approve / Generate
              </div>

              <ul style={{ margin: "0 0 20px 0", paddingLeft: 20, fontSize: 13, color: "#475569", lineHeight: 1.8 }}>
                <li><strong>Student Registry:</strong> Loan borrower rosters</li>
                <li><strong>Verification Queue:</strong> AI authenticity verification</li>
                <li><strong>Document Requests:</strong> 1-click cryptosealed issuance</li>
                <li><strong>Audit Logs:</strong> Fee reconciliation & UTR tracking</li>
              </ul>
            </div>

            <Link
              href="/admin"
              style={{
                display: "block",
                textAlign: "center",
                background: "#0f172a",
                color: "white",
                padding: "11px 16px",
                borderRadius: 8,
                fontWeight: 700,
                fontSize: 13,
                textDecoration: "none",
              }}
            >
              Enter as Accounts Admin →
            </Link>
          </div>

          {/* Role 3: Bank Officer */}
          <div
            style={{
              background: "white",
              borderRadius: 14,
              border: "1.5px solid #86efac",
              padding: 24,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              boxShadow: "0 4px 12px rgba(5,150,105,0.06)",
            }}
          >
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <span style={{ fontSize: 28 }}>🏦</span>
                <span style={{ background: "#dcfce7", color: "#166534", fontSize: 11, fontWeight: 800, padding: "3px 10px", borderRadius: 9999 }}>
                  ROLE 3: BANK OFFICER
                </span>
              </div>
              <h3 style={{ fontSize: 19, fontWeight: 800, color: "#0f172a", margin: "0 0 6px 0" }}>
                Bank Officer Direct Verify
              </h3>
              <div style={{ fontSize: 13, color: "#059669", fontWeight: 700, marginBottom: 14 }}>
                Verify Institutional Document
              </div>

              <ul style={{ margin: "0 0 20px 0", paddingLeft: 20, fontSize: 13, color: "#475569", lineHeight: 1.8 }}>
                <li><strong>Verification Code:</strong> Instant 12-character lookup</li>
                <li><strong>Authenticity Report:</strong> 8-point checklist & evidence</li>
                <li><strong>Document Consistency:</strong> Multi-cert field matrix</li>
                <li><strong>Adversarial Test:</strong> Fraud & ID mismatch detection</li>
              </ul>
            </div>

            <Link
              href="/verification"
              style={{
                display: "block",
                textAlign: "center",
                background: "#047857",
                color: "white",
                padding: "11px 16px",
                borderRadius: 8,
                fontWeight: 700,
                fontSize: 13,
                textDecoration: "none",
              }}
            >
              Enter as Bank Officer →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
