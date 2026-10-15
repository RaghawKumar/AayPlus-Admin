"use client";

export default function OverviewSection({
  stats,
  disputes,
  users,
  listings,
  bookings,
  setCurrentTab,
  onOpenDispute,
  onUpdateUser,
  onNotify,
}) {
  const pendingDisputesList = disputes.filter(
    (d) => d.status === "Action Required" || d.status === "Under Review"
  );
  const pendingKycUsers = users.filter((u) => u.kycStatus === "Pending Review");
  const case10231 = disputes.find((d) => d.id === "CLM-10231");

  return (
    <div>
      {/* Top Welcome & Summary Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <span>Marketplace overview</span>
            <span className="badge badge-emerald">Sample data</span>
          </h1>
          <p className="page-subtitle">
            Keep rentals moving. Review open cases, verify members and manage your marketplace.
          </p>
        </div>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <button
            className="btn btn-secondary"
            onClick={() => setCurrentTab("policies")}
          >
            View policies
          </button>
          <button
            className="btn btn-primary"
            onClick={() => setCurrentTab("disputes")}
          >
            Review disputes ({stats.pendingDisputes})
          </button>
        </div>
      </div>

      <div className="operations-queue" aria-label="Operations shortcuts">
        <button onClick={() => setCurrentTab("disputes")}><span className="queue-icon">01</span><span><strong>Resolve open cases</strong><small>{pendingDisputesList.length} cases need a review</small></span><span aria-hidden="true">↗</span></button>
        <button onClick={() => setCurrentTab("users")}><span className="queue-icon">02</span><span><strong>Verify your community</strong><small>{pendingKycUsers.length} identities awaiting review</small></span><span aria-hidden="true">↗</span></button>
        <button onClick={() => setCurrentTab("bookings")}><span className="queue-icon">03</span><span><strong>Follow every rental</strong><small>View booking progress and handovers</small></span><span aria-hidden="true">↗</span></button>
      </div>

      {/* Hero Urgent Notification Banner for Case #10231 */}
      {case10231 && case10231.status === "Action Required" && (
        <div
          style={{
            background: "linear-gradient(135deg, rgba(239, 68, 68, 0.12), rgba(245, 158, 11, 0.08))",
            border: "1.5px solid #EF4444",
            borderRadius: "16px",
            padding: "20px 24px",
            marginBottom: "28px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "16px",
            boxShadow: "0 8px 24px rgba(239, 68, 68, 0.15)",
          }}
        >
          <div style={{ display: "flex", alignItems: "flex-start", gap: "16px", maxWidth: "750px" }}>
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "12px",
                background: "rgba(239, 68, 68, 0.2)",
                color: "#EF4444",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "22px",
                flexShrink: 0,
              }}
            >
              ⚠️
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
                <span style={{ fontWeight: 800, color: "#EF4444", fontSize: "15px", letterSpacing: "0.5px" }}>
                  URGENT ARBITRATION REQUIRED — CASE #10231
                </span>
                <span className="badge badge-crimson">Action Required</span>
              </div>
              <p style={{ color: "#F1F5F9", fontSize: "14px", margin: "0 0 6px 0", fontWeight: 600 }}>
                {case10231.itemTitle} • Owner: {case10231.ownerName} vs Renter: {case10231.renterName}
              </p>
              <p style={{ color: "#94A3B8", fontSize: "13px", margin: 0, lineHeight: 1.5 }}>
                Owner claims <strong style={{ color: "#EF4444" }}>₹{case10231.claimAmount.toLocaleString()}</strong> from ₹{case10231.securityDeposit.toLocaleString()} Escrow Deposit for exhaust shield impact. Both 30-second handover inspection videos & digital rental agreement ready for verdict.
              </p>
            </div>
          </div>
          <button
            className="btn btn-crimson"
            style={{ padding: "12px 20px", fontWeight: 700 }}
            onClick={() => {
              setCurrentTab("disputes");
              if (onOpenDispute) onOpenDispute(case10231);
            }}
          >
            Inspect Evidence & Decide →
          </button>
        </div>
      )}

      {/* KPI Stats Grid */}
      <div className="stats-grid">
        {/* Gross Volume */}
        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Gross Rental Volume (GMV)</span>
            <div className="stat-card-icon emerald">₹</div>
          </div>
          <div className="stat-card-value">₹{stats.grossVolume.toLocaleString()}</div>
          <div className="stat-card-subtitle">
            <span style={{ color: "#10B981", fontWeight: 600 }}>↑ +18.4%</span> vs last month across {stats.completedRentals} bookings
          </div>
        </div>

        {/* Escrow Deposits Held */}
        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Active Escrow Vault</span>
            <div className="stat-card-icon gold">🔒</div>
          </div>
          <div className="stat-card-value">₹{stats.escrowDepositsHeld.toLocaleString()}</div>
          <div className="stat-card-subtitle">
            <span style={{ color: "#F59E0B", fontWeight: 600 }}>100% Ring-fenced</span> in automated Razorpay Escrow
          </div>
        </div>

        {/* Platform Revenue */}
        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Platform Net Revenue</span>
            <div className="stat-card-icon blue">💼</div>
          </div>
          <div className="stat-card-value">₹{stats.platformRevenue.toLocaleString()}</div>
          <div className="stat-card-subtitle">
            <span style={{ color: "#38BDF8", fontWeight: 600 }}>10% Commission</span> + ₹30 tech fee per transaction
          </div>
        </div>

        {/* Active Rentals */}
        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Active Rentals in Transit</span>
            <div className="stat-card-icon purple">🚀</div>
          </div>
          <div className="stat-card-value">{stats.activeRentals}</div>
          <div className="stat-card-subtitle">
            <span style={{ color: "#A855F7", fontWeight: 600 }}>28 Handover QR</span> verified with photo checklists
          </div>
        </div>

        {/* Total Users */}
        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Registered Community</span>
            <div className="stat-card-icon blue">👥</div>
          </div>
          <div className="stat-card-value">{stats.totalUsers.toLocaleString()}</div>
          <div className="stat-card-subtitle">
            <span>420 Hosts</span> • <span>1,000 Renters</span> across metro clusters
          </div>
        </div>

        {/* Listings Moderation */}
        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Inventory Listings</span>
            <div className="stat-card-icon emerald">📦</div>
          </div>
          <div className="stat-card-value">{stats.totalListings}</div>
          <div className="stat-card-subtitle">
            <span>98.2% Active</span> • Phase 1 MVP 4 categories only
          </div>
        </div>

        {/* Pending Disputes */}
        <div className="stat-card" style={{ borderColor: stats.pendingDisputes > 0 ? "rgba(239, 68, 68, 0.4)" : "var(--border-color)" }}>
          <div className="stat-card-header">
            <span className="stat-card-title">Open Arbitration Cases</span>
            <div className="stat-card-icon crimson">⚖️</div>
          </div>
          <div className="stat-card-value" style={{ color: stats.pendingDisputes > 0 ? "#EF4444" : "#F1F5F9" }}>
            {stats.pendingDisputes}
          </div>
          <div className="stat-card-subtitle">
            <span style={{ color: "#EF4444", fontWeight: 600 }}>Requires Admin Ruling</span> (0.16% dispute rate)
          </div>
        </div>

        {/* Pending KYC */}
        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">KYC Verification Queue</span>
            <div className="stat-card-icon gold">🪪</div>
          </div>
          <div className="stat-card-value" style={{ color: stats.pendingKyc > 0 ? "#F59E0B" : "#F1F5F9" }}>
            {stats.pendingKyc}
          </div>
          <div className="stat-card-subtitle">
            <span>Aadhaar & DL</span> pending admin approval
          </div>
        </div>
      </div>

      {/* Grid: Escrow Mechanism Explainer & Categories */}
      <div className="responsive-two-col-grid">
        {/* Visual Escrow Pipeline (User Point 25 & 31) */}
        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <div>
              <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#F1F5F9", margin: "0 0 4px 0" }}>
                🔒 Security Deposit Escrow Protocol (Point 25)
              </h3>
              <p style={{ color: "#94A3B8", fontSize: "13px", margin: 0 }}>
                Regulatory-compliant separate trust account model. Funds are never pooled into operational cash.
              </p>
            </div>
            <button className="btn btn-secondary" onClick={() => setCurrentTab("payments")}>
              View Ledger →
            </button>
          </div>

          <div
            style={{
              background: "#0B1329",
              borderRadius: "12px",
              padding: "18px",
              border: "1px solid var(--border-color)",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}
          >
            {/* Step 1: Upfront checkout */}
            <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
              <div
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "50%",
                  background: "#1E293B",
                  color: "#38BDF8",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "12px",
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                1
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "2px" }}>
                  <span style={{ fontSize: "13px", fontWeight: 600, color: "#F1F5F9" }}>
                    Renter Checkout: Rental (₹700) + Deposit (₹3,000)
                  </span>
                  <span style={{ fontSize: "13px", fontWeight: 700, color: "#38BDF8" }}>Total: ₹3,700</span>
                </div>
                <div style={{ fontSize: "12px", color: "#94A3B8" }}>
                  ₹700 queued for Host payout. ₹3,000 auto-routed to Razorpay Escrow Ring-fence Vault.
                </div>
              </div>
            </div>

            {/* Split Scenario Branch */}
            <div style={{ paddingLeft: "40px", borderLeft: "2px dashed #334155", marginLeft: "14px" }}>
              <div className="responsive-subgrid-2col">
                {/* Clean Return */}
                <div
                  style={{
                    background: "rgba(16, 185, 129, 0.08)",
                    border: "1px solid rgba(16, 185, 129, 0.25)",
                    borderRadius: "10px",
                    padding: "12px",
                  }}
                >
                  <div style={{ fontSize: "12px", fontWeight: 700, color: "#10B981", marginBottom: "4px" }}>
                    ✓ Clean Return (99.2%)
                  </div>
                  <div style={{ fontSize: "11px", color: "#94A3B8", lineHeight: 1.4 }}>
                    Both parties sign off. Instant automated UPI refund of <strong style={{ color: "#10B981" }}>₹3,000</strong> dispatched within 60 seconds.
                  </div>
                </div>

                {/* Damage Claim */}
                <div
                  style={{
                    background: "rgba(239, 68, 68, 0.08)",
                    border: "1px solid rgba(239, 68, 68, 0.25)",
                    borderRadius: "10px",
                    padding: "12px",
                  }}
                >
                  <div style={{ fontSize: "12px", fontWeight: 700, color: "#EF4444", marginBottom: "4px" }}>
                    ⚠️ Damage Claim (0.8%)
                  </div>
                  <div style={{ fontSize: "11px", color: "#94A3B8", lineHeight: 1.4 }}>
                    Deposit locked in Escrow. If claim ₹2,000 approved: <strong style={{ color: "#EF4444" }}>₹2,000</strong> to Host, <strong style={{ color: "#10B981" }}>₹1,000</strong> refunded to Renter.
                  </div>
                </div>
              </div>
            </div>

            {/* Regulatory note */}
            <div
              style={{
                fontSize: "11px",
                color: "#64748B",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                paddingTop: "6px",
              }}
            >
              <span>ℹ️</span>
              <span>
                Escrow compliant with RBI payment aggregator guidelines & IT Act bailee liability frameworks.
              </span>
            </div>
          </div>
        </div>

        {/* Phase 1 MVP Limited Categories (Point 37) */}
        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <div>
              <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#F1F5F9", margin: "0 0 4px 0" }}>
                🎯 Phase 1 MVP Categories & Rules (Point 37)
              </h3>
              <p style={{ color: "#94A3B8", fontSize: "13px", margin: 0 }}>
                Strict category specialization with tailored inspection and compliance rules.
              </p>
            </div>
            <button className="btn btn-secondary" onClick={() => setCurrentTab("listings")}>
              Manage ({stats.totalListings}) →
            </button>
          </div>

          <div className="responsive-subgrid-2col">
            {/* Bikes */}
            <div
              style={{
                background: "#0B1329",
                border: "1px solid var(--border-color)",
                borderRadius: "12px",
                padding: "14px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                <span style={{ fontSize: "20px" }}>🏍️</span>
                <span style={{ fontWeight: 700, color: "#F1F5F9", fontSize: "14px" }}>Bikes & Scooters</span>
              </div>
              <div style={{ fontSize: "11px", color: "#94A3B8", lineHeight: 1.4 }}>
                <strong>Strict Rules:</strong> Driving License, RC card match, Valid Insurance, Helmet check, Fuel level, Traffic fine indemnification.
              </div>
              <div style={{ marginTop: "8px", fontSize: "12px", color: "#38BDF8", fontWeight: 600 }}>
                142 Active Listings
              </div>
            </div>

            {/* Cameras */}
            <div
              style={{
                background: "#0B1329",
                border: "1px solid var(--border-color)",
                borderRadius: "12px",
                padding: "14px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                <span style={{ fontSize: "20px" }}>📷</span>
                <span style={{ fontWeight: 700, color: "#F1F5F9", fontSize: "14px" }}>Cameras & Lenses</span>
              </div>
              <div style={{ fontSize: "11px", color: "#94A3B8", lineHeight: 1.4 }}>
                <strong>Strict Rules:</strong> Body & lens serial number recording, Sensor dust baseline photo, Lens scratch inspection, Cap count.
              </div>
              <div style={{ marginTop: "8px", fontSize: "12px", color: "#F59E0B", fontWeight: 600 }}>
                89 Active Listings
              </div>
            </div>

            {/* Electronics */}
            <div
              style={{
                background: "#0B1329",
                border: "1px solid var(--border-color)",
                borderRadius: "12px",
                padding: "14px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                <span style={{ fontSize: "20px" }}>💻</span>
                <span style={{ fontWeight: 700, color: "#F1F5F9", fontSize: "14px" }}>Electronics</span>
              </div>
              <div style={{ fontSize: "11px", color: "#94A3B8", lineHeight: 1.4 }}>
                <strong>Strict Rules:</strong> IMEI & Serial registry, iCloud / Google account logout mandatory at return, Charger & cable checklist.
              </div>
              <div style={{ marginTop: "8px", fontSize: "12px", color: "#10B981", fontWeight: 600 }}>
                65 Active Listings
              </div>
            </div>

            {/* Parking */}
            <div
              style={{
                background: "#0B1329",
                border: "1px solid var(--border-color)",
                borderRadius: "12px",
                padding: "14px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                <span style={{ fontSize: "20px" }}>🅿️</span>
                <span style={{ fontWeight: 700, color: "#F1F5F9", fontSize: "14px" }}>Parking Slots</span>
              </div>
              <div style={{ fontSize: "11px", color: "#94A3B8", lineHeight: 1.4 }}>
                <strong>Strict Rules:</strong> Exact GPS entry/exit instructions, RFID/Fob return protocol, Strict time slot adherence.
              </div>
              <div style={{ marginTop: "8px", fontSize: "12px", color: "#A855F7", fontWeight: 600 }}>
                89 Active Listings
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Grid: Pending KYC Queue & Live Disputed Cases */}
      <div className="responsive-two-col-grid">
        {/* Pending KYC Documents Queue */}
        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <div>
              <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#F1F5F9", margin: "0 0 4px 0" }}>
                🪪 KYC Verification Queue ({pendingKycUsers.length})
              </h3>
              <p style={{ color: "#94A3B8", fontSize: "13px", margin: 0 }}>
                Verify Government ID & Driving License before allowing high-value bookings.
              </p>
            </div>
            <button className="btn btn-secondary" onClick={() => setCurrentTab("users")}>
              View All Users →
            </button>
          </div>

          {pendingKycUsers.length === 0 ? (
            <div style={{ textAlign: "center", padding: "30px", color: "#64748B" }}>
              ✓ All user KYC documents have been reviewed and verified!
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {pendingKycUsers.slice(0, 4).map((user) => (
                <div
                  key={user.id}
                  style={{
                    background: "#0B1329",
                    border: "1px solid var(--border-color)",
                    borderRadius: "10px",
                    padding: "12px 16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div
                      style={{
                        width: "38px",
                        height: "38px",
                        borderRadius: "50%",
                        background: "#1E293B",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 700,
                        color: "#F59E0B",
                      }}
                    >
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, color: "#F1F5F9", fontSize: "14px" }}>
                        {user.name}{" "}
                        <span className="badge badge-gold" style={{ fontSize: "10px", marginLeft: "6px" }}>
                          {user.role}
                        </span>
                      </div>
                      <div style={{ fontSize: "12px", color: "#94A3B8" }}>
                        {user.phone} • Document: Aadhaar & DL (Uploaded)
                      </div>
                    </div>
                  </div>
                  <button
                    className="btn btn-emerald"
                    style={{ fontSize: "12px", padding: "6px 14px" }}
                    onClick={() => {
                      onUpdateUser(user.id, { kycStatus: "Verified" });
                      onNotify(`KYC for ${user.name} approved! Trust badge issued.`, "success");
                    }}
                  >
                    ✓ Approve KYC
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Active Handover Bookings */}
        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <div>
              <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#F1F5F9", margin: "0 0 4px 0" }}>
                🚗 Live Bookings & Handover State
              </h3>
              <p style={{ color: "#94A3B8", fontSize: "13px", margin: 0 }}>
                Recent transactions under active escrow protection.
              </p>
            </div>
            <button className="btn btn-secondary" onClick={() => setCurrentTab("bookings")}>
              View All Orders →
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {bookings.slice(0, 4).map((b) => (
              <div
                key={b.id}
                style={{
                  background: "#0B1329",
                  border: "1px solid var(--border-color)",
                  borderRadius: "10px",
                  padding: "12px 16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "2px" }}>
                    <span style={{ fontWeight: 700, color: "#F1F5F9", fontSize: "14px" }}>{b.itemTitle}</span>
                    <span
                      className={`badge ${
                        b.status.includes("Active")
                          ? "badge-gold"
                          : b.status === "Completed"
                          ? "badge-emerald"
                          : "badge-blue"
                      }`}
                      style={{ fontSize: "10px" }}
                    >
                      {b.status}
                    </span>
                  </div>
                  <div style={{ fontSize: "12px", color: "#94A3B8" }}>
                    Host: <span style={{ color: "#F1F5F9" }}>{b.ownerName}</span> • Renter: <span style={{ color: "#F1F5F9" }}>{b.renterName}</span>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "13px", fontWeight: 700, color: "#10B981" }}>
                    ₹{b.totalPaid.toLocaleString()}
                  </div>
                  <div style={{ fontSize: "11px", color: "#94A3B8" }}>
                    Escrow: ₹{b.securityDeposit.toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
