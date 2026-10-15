"use client";

import { useState } from "react";

export default function BookingsSection({ bookings, searchQuery }) {
  const [filter, setFilter] = useState("all");

  const filteredBookings = bookings.filter((b) => {
    const matchesFilter =
      filter === "all"
        ? true
        : filter === "active"
        ? b.status.includes("Active")
        : filter === "upcoming"
        ? b.status === "Upcoming"
        : filter === "completed"
        ? b.status === "Completed"
        : filter === "cancelled"
        ? b.status === "Cancelled"
        : true;

    const q = (searchQuery || "").toLowerCase();
    const matchesSearch =
      !q ||
      b.id.toLowerCase().includes(q) ||
      b.itemTitle.toLowerCase().includes(q) ||
      b.renterName.toLowerCase().includes(q) ||
      b.ownerName.toLowerCase().includes(q);

    return matchesFilter && matchesSearch;
  });

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <span>Bookings & Orders Lifecycle</span>
            <span className="badge badge-amber">{bookings.length} Total Bookings</span>
          </h1>
          <p className="page-subtitle">
            Lifecycle custody tracking: QR handover match, digital contract execution, active tracking and escrow release.
          </p>
        </div>
      </div>

      <div className="card-box">
        {/* Filter Tabs */}
        <div className="card-box-header">
          <div className="filter-tabs">
            <button
              className={`filter-tab ${filter === "all" ? "active" : ""}`}
              onClick={() => setFilter("all")}
            >
              All ({bookings.length})
            </button>
            <button
              className={`filter-tab ${filter === "active" ? "active" : ""}`}
              onClick={() => setFilter("active")}
            >
              Active ({bookings.filter((b) => b.status.includes("Active")).length})
            </button>
            <button
              className={`filter-tab ${filter === "upcoming" ? "active" : ""}`}
              onClick={() => setFilter("upcoming")}
            >
              Upcoming ({bookings.filter((b) => b.status === "Upcoming").length})
            </button>
            <button
              className={`filter-tab ${filter === "completed" ? "active" : ""}`}
              onClick={() => setFilter("completed")}
            >
              Completed ({bookings.filter((b) => b.status === "Completed").length})
            </button>
            <button
              className={`filter-tab ${filter === "cancelled" ? "active" : ""}`}
              onClick={() => setFilter("cancelled")}
            >
              Cancelled ({bookings.filter((b) => b.status === "Cancelled").length})
            </button>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Booking ID & Item</th>
                <th>Renter</th>
                <th>Host</th>
                <th>Rental Charge</th>
                <th>Platform Fee</th>
                <th>Security Deposit</th>
                <th>Total Paid</th>
                <th>Schedule</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((b) => (
                <tr key={b.id}>
                  <td>
                    <div style={{ fontWeight: 800, color: "#F8FAFC" }}>{b.id}</div>
                    <div style={{ fontSize: "11px", color: "#F59E0B", fontWeight: 700 }}>{b.itemTitle}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 700, color: "#F8FAFC" }}>{b.renterName}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 700, color: "#F8FAFC" }}>{b.ownerName}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 700, color: "#F8FAFC" }}>₹{b.rentalCharge.toLocaleString()}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 700, color: "#94A3B8" }}>₹{b.platformFee}</div>
                  </td>
                  <td>
                    <span style={{ fontWeight: 800, color: "#10B981" }}>
                      ₹{b.securityDeposit.toLocaleString()}
                    </span>
                    <div style={{ fontSize: "10px", color: "#64748B" }}>in Escrow</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 900, color: "#F8FAFC", fontSize: "14px" }}>
                      ₹{b.totalPaid.toLocaleString()}
                    </div>
                  </td>
                  <td>
                    <div style={{ fontSize: "11px", color: "#94A3B8" }}>{b.startTime}</div>
                    <div style={{ fontSize: "11px", color: "#64748B" }}>to {b.returnTime}</div>
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        b.status.includes("Active")
                          ? "badge-crimson"
                          : b.status === "Upcoming"
                          ? "badge-amber"
                          : b.status === "Completed"
                          ? "badge-emerald"
                          : "badge-neutral"
                      }`}
                    >
                      {b.status}
                    </span>
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
