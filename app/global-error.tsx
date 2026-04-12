"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          padding: 0,
          fontFamily:
            'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          backgroundColor: "#0f172a",
          color: "#ffffff",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            padding: "24px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              overflow: "hidden",
              pointerEvents: "none",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "25%",
                left: "25%",
                width: "384px",
                height: "384px",
                backgroundColor: "rgba(239, 68, 68, 0.1)",
                borderRadius: "9999px",
                filter: "blur(120px)",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: "25%",
                right: "25%",
                width: "384px",
                height: "384px",
                backgroundColor: "rgba(99, 102, 241, 0.1)",
                borderRadius: "9999px",
                filter: "blur(120px)",
              }}
            />
          </div>

          <div
            style={{
              position: "relative",
              zIndex: 10,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              gap: "32px",
              maxWidth: "448px",
            }}
          >
            <div
              style={{
                padding: "24px",
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "24px",
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
              }}
            >
              <svg
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ color: "#ef4444", margin: "0 auto" }}
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            </div>

            <div
              style={{ gap: "16px", display: "flex", flexDirection: "column" }}
            >
              <h1
                style={{
                  fontSize: "36px",
                  fontWeight: "900",
                  letterSpacing: "-0.02em",
                  textTransform: "uppercase",
                  fontStyle: "italic",
                  color: "#ef4444",
                  margin: 0,
                }}
              >
                An Error Occurred
              </h1>
              <p
                style={{
                  color: "#a1a5b8",
                  fontFamily: "sans-serif",
                  lineHeight: "1.5",
                  maxWidth: "448px",
                  margin: "0 auto",
                }}
              >
                An unexpected error has occurred. Our team has been notified.
                Please try refreshing the page or contact support if the problem
                persists.
              </p>
            </div>

            {error?.message && (
              <div
                style={{
                  width: "100%",
                  backgroundColor: "rgba(239, 68, 68, 0.05)",
                  border: "1px solid rgba(239, 68, 68, 0.1)",
                  padding: "16px",
                  borderRadius: "12px",
                }}
              >
                <p
                  style={{
                    fontSize: "10px",
                    fontWeight: "900",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    color: "#ef4444",
                    marginBottom: "8px",
                    opacity: 0.6,
                  }}
                >
                  Technical Details
                </p>
                <p
                  style={{
                    fontSize: "12px",
                    color: "#cbd5e1",
                    fontFamily: "monospace",
                    fontStyle: "italic",
                    opacity: 0.9,
                    margin: 0,
                    wordBreak: "break-word",
                  }}
                >
                  {error.message}
                </p>
              </div>
            )}

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "16px",
                width: "100%",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <button
                onClick={() => reset()}
                style={{
                  height: "56px",
                  padding: "0 32px",
                  borderRadius: "16px",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  color: "#ffffff",
                  fontWeight: "900",
                  textTransform: "uppercase",
                  fontSize: "12px",
                  letterSpacing: "0.05em",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLButtonElement).style.backgroundColor =
                    "rgba(255, 255, 255, 0.1)";
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLButtonElement).style.backgroundColor =
                    "rgba(255, 255, 255, 0.05)";
                }}
              >
                Try Again
              </button>

              <button
                onClick={() => {
                  if (typeof window !== "undefined") {
                    window.location.href = "/";
                  }
                }}
                style={{
                  height: "56px",
                  padding: "0 40px",
                  borderRadius: "16px",
                  border: "none",
                  backgroundColor: "#4f46e5",
                  color: "#ffffff",
                  fontWeight: "900",
                  textTransform: "uppercase",
                  fontSize: "12px",
                  letterSpacing: "0.05em",
                  cursor: "pointer",
                  boxShadow: "0 20px 25px -5px rgba(79, 70, 229, 0.2)",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLButtonElement).style.backgroundColor =
                    "#4338ca";
                  (e.target as HTMLButtonElement).style.transform =
                    "scale(1.05)";
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLButtonElement).style.backgroundColor =
                    "#4f46e5";
                  (e.target as HTMLButtonElement).style.transform = "scale(1)";
                }}
              >
                Go to Home
              </button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
