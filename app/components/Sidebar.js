"use client";

import { useEffect } from "react";

export default function Sidebar({ currentTab, setCurrentTab, stats, isOpen, onClose }) {
  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const closeOnEscape = (event) => { if (event.key === "Escape") onClose(); };
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [isOpen, onClose]);
  const navItems = [
    {
      id: "overview",
      label: "Overview",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect width="7" height="9" x="3" y="3" rx="1" />
          <rect width="7" height="5" x="14" y="3" rx="1" />
          <rect width="7" height="9" x="14" y="12" rx="1" />
          <rect width="7" height="5" x="3" y="16" rx="1" />
        </svg>
      ),
      section: "MAIN",
    },
    {
      id: "disputes",
      label: "Disputes",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="m14 13-7.5 7.5c-.8.8-2 .8-2.8 0s-.8-2 0-2.8L11.2 10.2" />
          <path d="m16 16 6-6" />
          <path d="m8 8 6-6" />
          <path d="m9 7 8 8" />
          <path d="m21 11-8-8" />
        </svg>
      ),
      badge: stats.pendingDisputes,
      highlight: true,
      section: "OPERATIONS",
    },
    {
      id: "users",
      label: "Users & KYC",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
      badge: stats.pendingKyc,
      section: "OPERATIONS",
    },
    {
      id: "listings",
      label: "Listings Moderation",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="m7.5 4.27 9 5.15" />
          <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
          <path d="m3.3 7 8.7 5 8.7-5" />
          <path d="M12 22V12" />
        </svg>
      ),
      section: "OPERATIONS",
    },
    {
      id: "bookings",
      label: "Bookings & Orders",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M8 2v4" />
          <path d="M16 2v4" />
          <rect width="18" height="18" x="3" y="4" rx="2" />
          <path d="M3 10h18" />
          <path d="m9 16 2 2 4-4" />
        </svg>
      ),
      section: "OPERATIONS",
    },
    {
      id: "payments",
      label: "Escrow & Payments",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect width="20" height="14" x="2" y="5" rx="2" />
          <line x1="2" x2="22" y1="10" y2="10" />
          <path d="M12 15h.01" />
        </svg>
      ),
      section: "FINANCIALS",
    },
    {
      id: "policies",
      label: "Rules & Policy Engine",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ),
      section: "FINANCIALS",
    },
  ];

  const sections = ["MAIN", "OPERATIONS", "FINANCIALS"];

  const handleNavClick = (tabId) => {
    setCurrentTab(tabId);
    if (onClose) onClose();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && <div className="sidebar-backdrop" onClick={onClose} />}

      <aside className={`admin-sidebar ${isOpen ? "open" : ""}`}>
        {/* Brand Header */}
        <div className="sidebar-brand">
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                background: "linear-gradient(135deg, #0F172A, #1E293B)",
                border: "1.5px solid #F59E0B",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 900,
                fontSize: "17px",
                color: "#F59E0B",
                boxShadow: "0 2px 8px rgba(245, 158, 11, 0.2)",
              }}
            >
              A+
            </div>
            <div>
              <div style={{ fontWeight: 900, fontSize: "16px", letterSpacing: "-0.3px", color: "#F8FAFC" }}>
                AayPlus <span style={{ color: "#F59E0B" }}>• Admin</span>
              </div>
              <div style={{ fontSize: "11px", color: "#64748B", fontWeight: 600 }}>
                Operations & Escrow
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span className="brand-badge">v1.0</span>
            {/* Mobile Close Button */}
            <button className="sidebar-close-btn" onClick={onClose} aria-label="Close navigation">
              ✕
            </button>
          </div>
        </div>

        {/* Nav List */}
        <div className="sidebar-nav">
          {sections.map((section) => (
            <div key={section} style={{ marginBottom: "10px" }}>
              <div className="nav-section-title">{section}</div>
              {navItems
                .filter((item) => item.section === section)
                .map((item) => (
                  <button
                    key={item.id}
                    aria-current={currentTab === item.id ? "page" : undefined}
                    className={`nav-item ${currentTab === item.id ? "active" : ""}`}
                    onClick={() => handleNavClick(item.id)}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className={`nav-count-badge ${item.highlight ? "highlight" : ""}`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                ))}
            </div>
          ))}
        </div>

        {/* Footer / Admin Identity */}
        <div className="sidebar-footer">
          <div className="admin-avatar">AP</div>
          <div className="admin-info" style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: "13px", fontWeight: 800, color: "#F8FAFC", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              Admin Arbitrator
            </div>
            <div style={{ fontSize: "11px", color: "#10B981", fontWeight: 700, display: "flex", alignItems: "center", gap: "4px" }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#10B981" }} />
              Active Privileges
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
