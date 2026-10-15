"use client";

export default function Toast({ toasts, onDismiss }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((t) => (
        <div key={t.id} className={`toast ${t.type || "success"}`}>
          {t.type === "error" ? (
            <span style={{ color: "#EF4444", fontSize: "16px" }}>⚠️</span>
          ) : (
            <span style={{ color: "#10B981", fontSize: "16px" }}>✓</span>
          )}
          <span style={{ flex: 1 }}>{t.message}</span>
          <button
            onClick={() => onDismiss(t.id)}
            style={{
              background: "none",
              border: "none",
              color: "#64748B",
              cursor: "pointer",
              fontSize: "14px",
              marginLeft: "8px",
            }}
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
