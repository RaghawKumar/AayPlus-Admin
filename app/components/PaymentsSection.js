"use client";

import { useState } from "react";

export default function PaymentsSection({ payments, searchQuery }) {
  const [filter, setFilter] = useState("all");

  const filteredPayments = payments.filter((p) => {
    const matchesFilter =
      filter === "all"
        ? true
        : filter === "deposits"
        ? p.type.includes("Deposit")
        : filter === "fees"
        ? p.type.includes("Platform")
        : filter === "payouts"
        ? p.type.includes("Payout")
        : filter === "refunds"
        ? p.type.includes("Refund")
        : true;

    const q = (searchQuery || "").toLowerCase();
    const matchesSearch =
      !q ||
      p.txnId.toLowerCase().includes(q) ||
      p.bookingId.toLowerCase().includes(q) ||
      p.user.toLowerCase().includes(q) ||
      p.type.toLowerCase().includes(q);

    return matchesFilter && matchesSearch;
  });

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <span>Escrow Vault & Marketplace Financials</span>
            <span className="badge badge-emerald">Escrow Protected</span>
          </h1>
          <p className="page-subtitle">
            Segregated escrow mechanism: Customer deposits are isolated from merchant operational funds and refunded within 60s of verified return.
          </p>
        </div>
      </div>

      {/* Security Deposit Educational Architecture Card (Points 25 & 30) */}
      <div
        style={{
          background: "linear-gradient(135deg, rgba(16, 185, 129, 0.08), rgba(15, 23, 42, 0.95))",
          border: "1px solid rgba(16, 185, 129, 0.3)",
          borderRadius: "16px",
          padding: "24px",
          marginBottom: "24px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "20px" }}>🛡️</span>
            <div>
              <div style={{ fontSize: "14px", fontWeight: 800, color: "#10B981" }}>
                SECTION 25 & 30: MANDATORY ESCROW FLOW SPECIFICATION
              </div>
              <div style={{ fontSize: "12px", color: "#94A3B8" }}>
                How AayPlus protects both parties without illegal merchant deposit hoarding:
              </div>
            </div>
          </div>
          <span className="badge badge-emerald">Razorpay Escrow Vault API Active</span>
        </div>

        {/* 3 Step Pipeline */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))",
            gap: "16px",
          }}
        >
          {/* Step 1 */}
          <div style={{ background: "#0F172A", padding: "16px", borderRadius: "12px", border: "1px solid #2D3D58" }}>
            <div style={{ fontSize: "11px", fontWeight: 800, color: "#F59E0B" }}>STEP 1: BOOKING CHECKOUT</div>
            <div style={{ fontSize: "15px", fontWeight: 800, color: "#F8FAFC", marginTop: "4px" }}>
              Customer Pays ₹3,700
            </div>
            <div style={{ fontSize: "11px", color: "#94A3B8", marginTop: "6px", lineHeight: 1.5 }}>
              • Rental Fare: <strong>₹700</strong><br />
              • Security Deposit: <strong>₹3,000</strong> (held in escrow)<br />
              • Platform Fee: <strong>₹30</strong>
            </div>
          </div>

          {/* Step 2 Clean Return */}
          <div style={{ background: "#0F172A", padding: "16px", borderRadius: "12px", border: "1px solid #10B981" }}>
            <div style={{ fontSize: "11px", fontWeight: 800, color: "#10B981" }}>STEP 2A: CLEAN RETURN (95% Cases)</div>
            <div style={{ fontSize: "15px", fontWeight: 800, color: "#10B981", marginTop: "4px" }}>
              100% Release: ₹3,000 Refunded
            </div>
            <div style={{ fontSize: "11px", color: "#94A3B8", marginTop: "6px", lineHeight: 1.5 }}>
              Both parties complete 30s walkaround video & mutual sign-off. Deposit returned instantly via UPI transfer.
            </div>
          </div>

          {/* Step 3 Damage Case */}
          <div style={{ background: "#0F172A", padding: "16px", borderRadius: "12px", border: "1px solid #EF4444" }}>
            <div style={{ fontSize: "11px", fontWeight: 800, color: "#EF4444" }}>STEP 2B: DAMAGE DISPUTE (₹2,000 Claim)</div>
            <div style={{ fontSize: "15px", fontWeight: 800, color: "#F8FAFC", marginTop: "4px" }}>
              ₹2,000 to Host • ₹1,000 to Renter
            </div>
            <div style={{ fontSize: "11px", color: "#94A3B8", marginTop: "6px", lineHeight: 1.5 }}>
              Admin arbitrator verifies forensic video timestamps. Deposit is split without touching personal merchant funds.
            </div>
          </div>
        </div>
      </div>

      {/* Financial Stat Cards */}
      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">Active Escrow Vault</span>
            <div className="stat-icon emerald">🔒</div>
          </div>
          <div className="stat-value" style={{ color: "#10B981" }}>₹84,000</div>
          <div className="stat-footer">28 active deposits locked safely</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">Platform Net Revenue</span>
            <div className="stat-icon amber">📈</div>
          </div>
          <div className="stat-value" style={{ color: "#F59E0B" }}>₹48,250</div>
          <div className="stat-footer">10% commission + ₹30 tech fee</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">Host Payouts Dispatched</span>
            <div className="stat-icon sky">💸</div>
          </div>
          <div className="stat-value">₹3,42,800</div>
          <div className="stat-footer">Direct bank IMPS transfers</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">Deposits Refunded</span>
            <div className="stat-icon emerald">↩️</div>
          </div>
          <div className="stat-value">₹8,92,000</div>
          <div className="stat-footer">1,190 successful rentals</div>
        </div>
      </div>

      {/* Transactions Table Card */}
      <div className="card-box">
        <div className="card-box-header">
          <div className="filter-tabs">
            <button
              className={`filter-tab ${filter === "all" ? "active" : ""}`}
              onClick={() => setFilter("all")}
            >
              All Transactions ({payments.length})
            </button>
            <button
              className={`filter-tab ${filter === "deposits" ? "active" : ""}`}
              onClick={() => setFilter("deposits")}
            >
              Escrow Deposits
            </button>
            <button
              className={`filter-tab ${filter === "fees" ? "active" : ""}`}
              onClick={() => setFilter("fees")}
            >
              Platform Fees
            </button>
            <button
              className={`filter-tab ${filter === "payouts" ? "active" : ""}`}
              onClick={() => setFilter("payouts")}
            >
              Host Payouts
            </button>
            <button
              className={`filter-tab ${filter === "refunds" ? "active" : ""}`}
              onClick={() => setFilter("refunds")}
            >
              Deposit Refunds
            </button>
          </div>
        </div>

        {/* Ledger Table */}
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Txn ID</th>
                <th>Booking ID</th>
                <th>Transaction Classification</th>
                <th>Amount</th>
                <th>Payment Gateway Channel</th>
                <th>User / Party</th>
                <th>Ledger Status</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map((p) => (
                <tr key={p.txnId}>
                  <td>
                    <div style={{ fontWeight: 800, color: "#F8FAFC" }}>{p.txnId}</div>
                  </td>
                  <td>
                    <span style={{ color: "#F59E0B", fontWeight: 700 }}>{p.bookingId}</span>
                  </td>
                  <td>
                    <div style={{ fontWeight: 700, color: "#F8FAFC" }}>{p.type}</div>
                  </td>
                  <td>
                    <span
                      style={{
                        fontWeight: 900,
                        fontSize: "14px",
                        color:
                          p.type.includes("Refund")
                            ? "#10B981"
                            : p.type.includes("Fee")
                            ? "#F59E0B"
                            : p.type.includes("Payout")
                            ? "#0EA5E9"
                            : "#F8FAFC",
                      }}
                    >
                      ₹{p.amount.toLocaleString()}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontSize: "12px", color: "#94A3B8" }}>{p.gateway}</div>
                  </td>
                  <td>
                    <div style={{ fontSize: "12px", color: "#F8FAFC" }}>{p.user}</div>
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        p.status.includes("Escrow")
                          ? "badge-amber"
                          : p.status.includes("Refund") || p.status.includes("Paid")
                          ? "badge-emerald"
                          : "badge-sky"
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontSize: "11px", color: "#94A3B8" }}>{p.date}</div>
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
