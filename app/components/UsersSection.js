"use client";

import { useState } from "react";

export default function UsersSection({ users, onUpdateUser, onNotify, searchQuery }) {
  const [filter, setFilter] = useState("all");

  const filteredUsers = users.filter((u) => {
    const matchesFilter =
      filter === "all"
        ? true
        : filter === "owners"
        ? u.role.includes("Host") || u.role.includes("Owner")
        : filter === "renters"
        ? u.role === "Renter"
        : filter === "kyc"
        ? u.kycStatus === "Pending Review"
        : filter === "blocked"
        ? u.status === "Blocked"
        : true;

    const q = (searchQuery || "").toLowerCase();
    const matchesSearch =
      !q ||
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.phone.toLowerCase().includes(q) ||
      u.id.toLowerCase().includes(q);

    return matchesFilter && matchesSearch;
  });

  const handleApproveKyc = (user) => {
    onUpdateUser(user.id, { kycStatus: "Verified" });
    onNotify(`KYC for ${user.name} approved and digital trust badge issued!`, "success");
  };

  const handleToggleBlock = (user) => {
    const newStatus = user.status === "Blocked" ? "Active" : "Blocked";
    onUpdateUser(user.id, { status: newStatus });
    onNotify(
      `User ${user.name} has been ${newStatus === "Blocked" ? "restricted & blocked" : "unblocked"}.`,
      newStatus === "Blocked" ? "error" : "success"
    );
  };

  const handleAddStrike = (user) => {
    const newStrikes = (user.strikes || 0) + 1;
    const shouldBlock = newStrikes >= 3;
    onUpdateUser(user.id, {
      strikes: newStrikes,
      status: shouldBlock ? "Blocked" : user.status,
    });
    onNotify(
      `Issued cancellation/policy strike #${newStrikes} to ${user.name}.${shouldBlock ? " Automatically suspended (3 strikes rule)!" : ""}`,
      "error"
    );
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <span>User Accounts & KYC Trust Verification</span>
            <span className="badge badge-amber">{users.length} Total Registered</span>
          </h1>
          <p className="page-subtitle">
            Manage single unified user identities across Host and Renter modes, identity verification dockets, and marketplace strikes.
          </p>
        </div>
      </div>

      {/* Users Card */}
      <div className="card-box">
        <div className="card-box-header">
          <div className="filter-tabs">
            <button
              className={`filter-tab ${filter === "all" ? "active" : ""}`}
              onClick={() => setFilter("all")}
            >
              All Users ({users.length})
            </button>
            <button
              className={`filter-tab ${filter === "owners" ? "active" : ""}`}
              onClick={() => setFilter("owners")}
            >
              Hosts / Owners ({users.filter((u) => u.role.includes("Host") || u.role.includes("Owner")).length})
            </button>
            <button
              className={`filter-tab ${filter === "renters" ? "active" : ""}`}
              onClick={() => setFilter("renters")}
            >
              Renters ({users.filter((u) => u.role === "Renter").length})
            </button>
            <button
              className={`filter-tab ${filter === "kyc" ? "active" : ""}`}
              onClick={() => setFilter("kyc")}
            >
              Pending KYC ({users.filter((u) => u.kycStatus === "Pending Review").length})
            </button>
            <button
              className={`filter-tab ${filter === "blocked" ? "active" : ""}`}
              onClick={() => setFilter("blocked")}
            >
              Blocked ({users.filter((u) => u.status === "Blocked").length})
            </button>
          </div>
        </div>

        {/* Users Table */}
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>User / Persona</th>
                <th>Role</th>
                <th>KYC Verification</th>
                <th>Rating & History</th>
                <th>Strikes</th>
                <th>Wallet / Escrow</th>
                <th>Account Status</th>
                <th>Admin Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => (
                <tr key={u.id}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <img
                        src={u.avatar}
                        alt={u.name}
                        style={{ width: "36px", height: "36px", borderRadius: "50%", objectFit: "cover" }}
                      />
                      <div>
                        <div style={{ fontWeight: 800, color: "#F8FAFC" }}>{u.name}</div>
                        <div style={{ fontSize: "11px", color: "#94A3B8" }}>{u.phone}</div>
                        <div style={{ fontSize: "10px", color: "#64748B" }}>{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${u.role.includes("Host") ? "badge-amber" : "badge-sky"}`}>
                      {u.role.includes("Host") ? "🔑 " + u.role : "🎒 " + u.role}
                    </span>
                  </td>
                  <td>
                    <div>
                      <span
                        className={`badge ${
                          u.kycStatus === "Verified" ? "badge-emerald" : "badge-amber"
                        }`}
                      >
                        {u.kycStatus === "Verified" ? "Verified ✓" : "Review Pending ⏳"}
                      </span>
                      <div style={{ fontSize: "10px", color: "#94A3B8", marginTop: "3px" }}>
                        {u.identityType}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 700, color: "#F59E0B" }}>
                      ★ {u.rating} <span style={{ fontSize: "11px", color: "#94A3B8" }}>/ 5.0</span>
                    </div>
                    <div style={{ fontSize: "11px", color: "#64748B" }}>
                      {u.rentalsCompleted} completed • {u.cancelled} cancelled
                    </div>
                  </td>
                  <td>
                    <span
                      style={{
                        fontWeight: 800,
                        color: u.strikes > 0 ? (u.strikes >= 3 ? "#EF4444" : "#F59E0B") : "#10B981",
                      }}
                    >
                      {u.strikes || 0} / 3 Strikes
                    </span>
                  </td>
                  <td>
                    <div style={{ fontWeight: 800, color: "#F8FAFC" }}>
                      ₹{u.walletBalance.toLocaleString()}
                    </div>
                    <div style={{ fontSize: "10px", color: "#64748B" }}>
                      {u.role.includes("Host") ? "Host Earnings" : "Escrow Balance"}
                    </div>
                  </td>
                  <td>
                    <span
                      className={`badge ${u.status === "Blocked" ? "badge-crimson" : "badge-emerald"}`}
                    >
                      {u.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                      {u.kycStatus === "Pending Review" && (
                        <button
                          className="btn btn-success-outline btn-sm"
                          onClick={() => handleApproveKyc(u)}
                          title="Verify identity credentials"
                        >
                          ✓ Approve KYC
                        </button>
                      )}
                      <button
                        className="btn btn-outline btn-sm"
                        onClick={() => handleAddStrike(u)}
                        title="Add cancellation or compliance strike"
                      >
                        + Strike
                      </button>
                      <button
                        className={`btn btn-sm ${u.status === "Blocked" ? "btn-success" : "btn-danger-outline"}`}
                        onClick={() => handleToggleBlock(u)}
                      >
                        {u.status === "Blocked" ? "Unblock" : "Block"}
                      </button>
                    </div>
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
