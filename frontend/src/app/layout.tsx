import type { Metadata, Viewport } from "next";
import Link from "next/link";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "VFSTR Education Loan System · Institutional Role Portal",
  description: "Official Institutional Verification and Multi-Role Banking Protocol",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: "#0f172a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" style={{ margin: 0, padding: 0, minHeight: "100%", width: "100%" }}>
      <body
        style={{
          margin: 0,
          padding: 0,
          minHeight: "100dvh",
          width: "100%",
          background: "#f8fafc",
          color: "#0f172a",
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
        }}
      >
        {/* Global Institutional Navigation */}
        <header
          style={{
            background: "#0f172a",
            color: "white",
            borderBottom: "1px solid #1e293b",
            position: "sticky",
            top: 0,
            zIndex: 50,
          }}
        >
          <div
            style={{
              maxWidth: 1280,
              margin: "0 auto",
              padding: "10px 20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            {/* University Branding */}
            <Link
              href="/"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                textDecoration: "none",
                color: "white",
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  background: "#2563eb",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 800,
                  fontSize: 16,
                  letterSpacing: -0.5,
                }}
              >
                VF
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: 15, letterSpacing: -0.2 }}>
                  VFSTR Vignan University
                </div>
                <div style={{ fontSize: 10.5, color: "#94a3b8", letterSpacing: 0.5 }}>
                  EDUCATION LOAN SYSTEM · 3 ROLES
                </div>
              </div>
            </Link>

            {/* THREE EXPLICIT ROLES NAVIGATOR */}
            <nav style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
              <Link
                href="/"
                style={{
                  color: "#cbd5e1",
                  textDecoration: "none",
                  padding: "6px 10px",
                  borderRadius: 6,
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                🏛️ Overview
              </Link>

              <span style={{ color: "#334155" }}>|</span>

              {/* Role 1: Student */}
              <Link
                href="/student"
                style={{
                  color: "#93c5fd",
                  textDecoration: "none",
                  padding: "6px 12px",
                  borderRadius: 6,
                  fontSize: 12,
                  fontWeight: 700,
                  background: "rgba(37,99,235,0.18)",
                  border: "1px solid rgba(59,130,246,0.3)",
                }}
                title="Upload / Request / Track"
              >
                🎓 Student
              </Link>

              {/* Role 2: Accounts / Admin */}
              <Link
                href="/admin"
                style={{
                  color: "#e2e8f0",
                  textDecoration: "none",
                  padding: "6px 12px",
                  borderRadius: 6,
                  fontSize: 12,
                  fontWeight: 700,
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.15)",
                }}
                title="Verify / Approve / Generate"
              >
                🛡️ Accounts / Admin
              </Link>

              {/* Role 3: Bank Officer */}
              <Link
                href="/verification"
                style={{
                  color: "#86efac",
                  textDecoration: "none",
                  padding: "6px 12px",
                  borderRadius: 6,
                  fontSize: 12,
                  fontWeight: 700,
                  background: "rgba(16,185,129,0.15)",
                  border: "1px solid rgba(16,185,129,0.3)",
                }}
                title="Verify Institutional Document"
              >
                🏦 Bank Officer
              </Link>

              <a
                href="/portal.html"
                style={{
                  color: "#94a3b8",
                  textDecoration: "none",
                  padding: "6px 10px",
                  borderRadius: 6,
                  fontSize: 11,
                  border: "1px solid #334155",
                  marginLeft: 4,
                }}
              >
                Legacy View
              </a>
            </nav>
          </div>
        </header>

        {/* Viewport Content */}
        <main>{children}</main>

        {/* Global Footer */}
        <footer
          style={{
            borderTop: "1px solid #e2e8f0",
            background: "#ffffff",
            padding: "20px",
            marginTop: 48,
            fontSize: 12.5,
            color: "#64748b",
            textAlign: "center",
          }}
        >
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            VFSTR Deemed to be University · Education Loan Governance Platform · 3-Tier Role Architecture (Student · Accounts/Admin · Bank Officer)
          </div>
        </footer>
      </body>
    </html>
  );
}
