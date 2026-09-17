import type { Metadata, Viewport } from "next";
import Link from "next/link";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "Vignan University · Agent 43 Education Loan Support Portal",
  description: "VFSTR Institutional Portal - Official Documentation, Verification, and Bank Coordination System",
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
        {/* Institutional Global Navigation Bar */}
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
              padding: "12px 20px",
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
                  width: 38,
                  height: 38,
                  borderRadius: 8,
                  background: "#2563eb",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 800,
                  fontSize: 18,
                  letterSpacing: -0.5,
                }}
              >
                VF
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: 16, letterSpacing: -0.2 }}>
                  VFSTR Vignan University
                </div>
                <div style={{ fontSize: 11, color: "#94a3b8", letterSpacing: 0.5 }}>
                  AGENT 43 · EDUCATION LOAN SYSTEM
                </div>
              </div>
            </Link>

            {/* Navigation Links */}
            <nav style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
              <Link
                href="/"
                style={{
                  color: "#e2e8f0",
                  textDecoration: "none",
                  padding: "8px 14px",
                  borderRadius: 6,
                  fontSize: 13,
                  fontWeight: 600,
                  background: "rgba(255,255,255,0.06)",
                }}
              >
                🏛️ Dashboard
              </Link>
              <Link
                href="/student"
                style={{
                  color: "#cbd5e1",
                  textDecoration: "none",
                  padding: "8px 14px",
                  borderRadius: 6,
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                🎓 Student
              </Link>
              <Link
                href="/admin"
                style={{
                  color: "#cbd5e1",
                  textDecoration: "none",
                  padding: "8px 14px",
                  borderRadius: 6,
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                🛡️ Registrar Admin
              </Link>
              <Link
                href="/verification"
                style={{
                  color: "#cbd5e1",
                  textDecoration: "none",
                  padding: "8px 14px",
                  borderRadius: 6,
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                🏦 Bank Verify
              </Link>
              <a
                href="/portal.html"
                style={{
                  color: "#94a3b8",
                  textDecoration: "none",
                  padding: "8px 12px",
                  borderRadius: 6,
                  fontSize: 12,
                  border: "1px solid #334155",
                }}
              >
                Legacy View
              </a>
            </nav>
          </div>
        </header>

        {/* Main Content Viewport */}
        <main>{children}</main>

        {/* Global Footer */}
        <footer
          style={{
            borderTop: "1px solid #e2e8f0",
            background: "#ffffff",
            padding: "24px 20px",
            marginTop: 48,
            fontSize: 13,
            color: "#64748b",
            textAlign: "center",
          }}
        >
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            Vignan's Foundation for Science, Technology & Research (Deemed to be University) · Vadlamudi, Guntur - 522213
            <br />
            AI Document Verification & Bank Scheme Synthesis Architecture · Agent 43
          </div>
        </footer>
      </body>
    </html>
  );
}
