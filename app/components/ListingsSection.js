"use client";

import { useState } from "react";

export default function ListingsSection({ listings, onUpdateListing, onDeleteListing, onNotify, searchQuery }) {
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const categories = ["All", "Bikes", "Cameras", "Electronics", "Parking"];
  const statuses = ["All", "Active", "Pending Approval", "Suspended"];

  const filteredListings = listings.filter((item) => {
    const matchesCat = categoryFilter === "All" || item.category === categoryFilter;
    const matchesStatus = statusFilter === "All" || item.status === statusFilter;

    const q = (searchQuery || "").toLowerCase();
    const matchesSearch =
      !q ||
      item.title.toLowerCase().includes(q) ||
      item.ownerName.toLowerCase().includes(q) ||
      item.location.toLowerCase().includes(q) ||
      item.id.toLowerCase().includes(q);

    return matchesCat && matchesStatus && matchesSearch;
  });

  const handleStatusChange = (item, newStatus) => {
    onUpdateListing(item.id, { status: newStatus });
    onNotify(
      `Listing "${item.title}" marked as ${newStatus}.`,
      newStatus === "Active" ? "success" : "error"
    );
  };

  const handleDelete = (item) => {
    if (confirm(`Permanently delete listing "${item.title}"?`)) {
      onDeleteListing(item.id);
      onNotify(`Listing "${item.title}" deleted from catalog.`, "error");
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <span>Listings Catalog & Moderation</span>
            <span className="badge badge-amber">{listings.length} Listed Items</span>
          </h1>
          <p className="page-subtitle">
            Curated MVP categories: 🏍️ Bikes, 📷 Cameras, 💻 Electronics, 🅿️ Parking. Approve incoming listings or suspend policy violators.
          </p>
        </div>
      </div>

      <div className="card-box">
        {/* Filters */}
        <div className="card-box-header">
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
            <span style={{ fontSize: "11px", fontWeight: 800, color: "#94A3B8" }}>CATEGORY:</span>
            <div className="filter-tabs">
              {categories.map((c) => (
                <button
                  key={c}
                  className={`filter-tab ${categoryFilter === c ? "active" : ""}`}
                  onClick={() => setCategoryFilter(c)}
                >
                  {c}
                </button>
              ))}
            </div>

            <span style={{ fontSize: "11px", fontWeight: 800, color: "#94A3B8", marginLeft: "10px" }}>STATUS:</span>
            <div className="filter-tabs">
              {statuses.map((s) => (
                <button
                  key={s}
                  className={`filter-tab ${statusFilter === s ? "active" : ""}`}
                  onClick={() => setStatusFilter(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Listings Table */}
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Item & Details</th>
                <th>Category</th>
                <th>Host / Owner</th>
                <th>Rates (Hourly / Daily)</th>
                <th>Security Deposit</th>
                <th>Location / Identifier</th>
                <th>Moderation Status</th>
                <th>Admin Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredListings.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <img
                        src={item.photo}
                        alt={item.title}
                        style={{ width: "48px", height: "48px", borderRadius: "10px", objectFit: "cover", border: "1px solid #334155" }}
                      />
                      <div>
                        <div style={{ fontWeight: 800, color: "#F8FAFC" }}>{item.title}</div>
                        <div style={{ fontSize: "11px", color: "#94A3B8" }}>{item.subcategory}</div>
                        <div style={{ fontSize: "10px", color: "#64748B" }}>ID: {item.id}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-neutral">{item.category}</span>
                  </td>
                  <td>
                    <div style={{ fontWeight: 700, color: "#F8FAFC" }}>{item.ownerName}</div>
                    <div style={{ fontSize: "10px", color: "#F59E0B" }}>★ {item.rating} • {item.rentalsCount} bookings</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 800, color: "#F59E0B" }}>
                      ₹{item.hourlyPrice}/hr
                    </div>
                    <div style={{ fontSize: "11px", color: "#94A3B8" }}>
                      ₹{item.dailyPrice}/day
                    </div>
                  </td>
                  <td>
                    <span style={{ fontWeight: 800, color: "#10B981" }}>
                      ₹{item.securityDeposit.toLocaleString()}
                    </span>
                    <div style={{ fontSize: "10px", color: "#64748B" }}>Escrow Required</div>
                  </td>
                  <td>
                    <div style={{ fontSize: "12px", color: "#F8FAFC" }}>{item.location}</div>
                    <div style={{ fontSize: "10px", color: "#64748B" }}>
                      {item.regNumber || item.serialNumber || item.dgcaUIN || item.slotTag || "Verified Hardware"}
                    </div>
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        item.status === "Active"
                          ? "badge-emerald"
                          : item.status === "Pending Approval"
                          ? "badge-amber"
                          : "badge-crimson"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                      {item.status === "Pending Approval" ? (
                        <>
                          <button
                            className="btn btn-success btn-sm"
                            onClick={() => handleStatusChange(item, "Active")}
                          >
                            ✓ Approve
                          </button>
                          <button
                            className="btn btn-danger-outline btn-sm"
                            onClick={() => handleStatusChange(item, "Suspended")}
                          >
                            Reject
                          </button>
                        </>
                      ) : item.status === "Active" ? (
                        <button
                          className="btn btn-danger-outline btn-sm"
                          onClick={() => handleStatusChange(item, "Suspended")}
                        >
                          Suspend
                        </button>
                      ) : (
                        <button
                          className="btn btn-success-outline btn-sm"
                          onClick={() => handleStatusChange(item, "Active")}
                        >
                          Reinstate
                        </button>
                      )}
                      <button
                        className="btn btn-outline btn-sm"
                        style={{ color: "#EF4444" }}
                        onClick={() => handleDelete(item)}
                        title="Delete listing completely"
                      >
                        🗑️
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
