"use client";

import { useState } from "react";
import DisputeModal from "./DisputeModal";

export default function DisputesSection({ disputes, onResolveDispute, searchQuery }) {
  const [filter, setFilter] = useState("all");
  const [selectedDispute, setSelectedDispute] = useState(null);

  const filteredDisputes = disputes.filter((d) => {
    const matchesFilter =
      filter === "all"
        ? true
        : filter === "action"
        ? d.status === "Action Required"
        : filter === "review"
        ? d.status === "Under Review"
        : filter === "resolved"
        ? d.status === "Resolved"
        : filter === "rejected"
        ? d.status === "Rejected"
        : true;

    const q = (searchQuery || "").toLowerCase();
    const matchesSearch =
      !q ||
      d.id.toLowerCase().includes(q) ||
      d.bookingId.toLowerCase().includes(q) ||
      d.itemTitle.toLowerCase().includes(q) ||
      d.ownerName.toLowerCase().includes(q) ||
      d.renterName.toLowerCase().includes(q);

    return matchesFilter && matchesSearch;
  });

  return (
    <div>
      {/* Section Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <span>Disputes & Forensic Arbitration</span>
            <span className="badge badge-crimson">
              {disputes.filter((d) => d.status === "Action Required" || d.status === "Under Review").length} Active Cases
            </span>
          </h1>
          <p className="page-subtitle">
            Unbiased administrative arbitration engine backing the ₹3,000 escrow security deposit with side-by-side 30s walkaround video verification.
          </p>
        </div>
      </div>

      {/* Case #10231 Priority Hero Alert */}
      {disputes.some((d) => d.id === "CLM-10231" && d.status === "Action Required") && (
        <div
          style={{
            background: "linear-gradient(135deg, rgba(239, 68, 68, 0.12), rgba(245, 158, 11, 0.08))",
            border: "1.5px solid #EF4444",
            borderRadius: "16px",
            padding: "20px 24px",
            marginBottom: "24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "16px",
            boxShadow: "0 4px 20px rgba(239, 68, 68, 0.15)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                background: "rgba(239, 68, 68, 0.2)",
                border: "1px solid #EF4444",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "22px",
              }}
            >
              ⚠️
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span className="badge badge-crimson">HIGH PRIORITY • CASE #10231</span>
                <span style={{ fontSize: "12px", color: "#F59E0B", fontWeight: 700 }}>
                  Royal Enfield Classic 350
                </span>
              </div>
              <div style={{ fontSize: "14px", fontWeight: 800, color: "#F8FAFC", marginTop: "4px" }}>
                Owner Rahul Sharma claims ₹2,000 for exhaust dent. Renter Amit Verma disputing.
              </div>
              <div style={{ fontSize: "12px", color: "#94A3B8", marginTop: "2px" }}>
                30s pickup vs 30s return walkaround video evidence ready for immediate review. Escrow ₹3,000 held.
              </div>
            </div>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => setSelectedDispute(disputes.find((d) => d.id === "CLM-10231"))}
          >
            ⚖️ Arbitrate Case #10231 Now
          </button>
        </div>
      )}

      {/* Filter Tabs & Table Card */}
      <div className="card-box">
        <div className="card-box-header">
          <div className="filter-tabs">
            <button
              className={`filter-tab ${filter === "all" ? "active" : ""}`}
              onClick={() => setFilter("all")}
            >
              All Disputes ({disputes.length})
            </button>
            <button
              className={`filter-tab ${filter === "action" ? "active" : ""}`}
              onClick={() => setFilter("action")}
            >
              Action Required ({disputes.filter((d) => d.status === "Action Required").length})
            </button>
            <button
              className={`filter-tab ${filter === "review" ? "active" : ""}`}
              onClick={() => setFilter("review")}
            >
              Under Review ({disputes.filter((d) => d.status === "Under Review").length})
            </button>
            <button
              className={`filter-tab ${filter === "resolved" ? "active" : ""}`}
              onClick={() => setFilter("resolved")}
            >
              Resolved ({disputes.filter((d) => d.status === "Resolved").length})
            </button>
            <button
              className={`filter-tab ${filter === "rejected" ? "active" : ""}`}
              onClick={() => setFilter("rejected")}
            >
              Rejected ({disputes.filter((d) => d.status === "Rejected").length})
            </button>
          </div>
        </div>

        {/* Disputes Table */}
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Case & Item</th>
                <th>Claimant (Host)</th>
                <th>Defendant (Renter)</th>
                <th>Claim Amount</th>
                <th>Escrow Deposit</th>
                <th>Status</th>
                <th>Filed Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDisputes.map((d) => (
                <tr key={d.id}>
                  <td>
                    <div style={{ fontWeight: 800, color: "#F8FAFC" }}>{d.id}</div>
                    <div style={{ fontSize: "11px", color: "#F59E0B", fontWeight: 700 }}>{d.itemTitle}</div>
                    <div style={{ fontSize: "10px", color: "#64748B" }}>Booking: {d.bookingId}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 700, color: "#F8FAFC" }}>{d.ownerName}</div>
                    <div style={{ fontSize: "11px", color: "#94A3B8" }}>Host</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 700, color: "#F8FAFC" }}>{d.renterName}</div>
                    <div style={{ fontSize: "11px", color: "#94A3B8" }}>Renter</div>
                  </td>
                  <td>
                    <span style={{ fontWeight: 800, color: "#EF4444", fontSize: "14px" }}>
                      ₹{d.claimAmount.toLocaleString()}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontWeight: 700, color: "#10B981" }}>
                      ₹{d.securityDeposit.toLocaleString()}
                    </span>
                    <div style={{ fontSize: "10px", color: "#64748B" }}>in Escrow</div>
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        d.status === "Action Required"
                          ? "badge-crimson"
                          : d.status === "Under Review"
                          ? "badge-amber"
                          : d.status === "Resolved"
                          ? "badge-emerald"
                          : "badge-neutral"
                      }`}
                    >
                      {d.status}
                    </span>
                    {d.decision && (
                      <div style={{ fontSize: "10px", color: "#94A3B8", marginTop: "2px" }}>
                        Verdict: {d.decision.toUpperCase()}
                      </div>
                    )}
                  </td>
                  <td>
                    <div style={{ fontSize: "11px", color: "#94A3B8" }}>{d.filedAt}</div>
                  </td>
                  <td>
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => setSelectedDispute(d)}
                      style={{ borderColor: d.status === "Action Required" ? "#F59E0B" : undefined }}
                    >
                      {d.status === "Action Required" ? "⚖️ Arbitrate Case" : "Inspect Dossier"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dispute Modal */}
      {selectedDispute && (
        <DisputeModal
          dispute={selectedDispute}
          onClose={() => setSelectedDispute(null)}
          onResolve={(id, decision, amount, notes) => {
            onResolveDispute(id, decision, amount, notes);
            setSelectedDispute(null);
          }}
        />
      )}
    </div>
  );
}
