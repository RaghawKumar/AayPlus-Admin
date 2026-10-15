"use client";

import { useState } from "react";

export default function DisputeModal({ dispute, onClose, onResolve }) {
  const [activeTab, setActiveTab] = useState("evidence"); // 'evidence' | 'agreement' | 'timeline'
  const [partialAmount, setPartialAmount] = useState(1000);
  const [isPartialMode, setIsPartialMode] = useState(false);
  const [notes, setNotes] = useState("");

  if (!dispute) return null;

  const handleApprove = () => {
    onResolve(
      dispute.id,
      "approved",
      dispute.claimAmount,
      notes || `Admin approved ₹${dispute.claimAmount.toLocaleString()} compensation to Host based on forensic video timeline alignment.`
    );
  };

  const handleReject = () => {
    onResolve(
      dispute.id,
      "rejected",
      0,
      notes || "Admin rejected claim. Pre-existing wear or insufficient handover impact evidence. 100% deposit refunded to renter."
    );
  };

  const handlePartial = () => {
    onResolve(
      dispute.id,
      "partial",
      Number(partialAmount),
      notes || `Admin arbitrated partial settlement of ₹${Number(partialAmount).toLocaleString()} to Host, balance ₹${(dispute.securityDeposit - Number(partialAmount)).toLocaleString()} refunded to Renter.`
    );
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span className="badge badge-crimson">CASE #{dispute.id.replace("CLM-", "")} • ARBITRATION ACTIVE</span>
              <span className="badge badge-amber">{dispute.status}</span>
            </div>
            <h2 style={{ fontSize: "20px", fontWeight: 800, marginTop: "6px", color: "#F8FAFC" }}>
              {dispute.itemTitle}
            </h2>
            <div style={{ fontSize: "12px", color: "#94A3B8", marginTop: "2px" }}>
              Booking Reference: <strong style={{ color: "#F59E0B" }}>{dispute.bookingId}</strong> • Category: {dispute.category}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "#1E293B",
              border: "1px solid #334155",
              color: "#94A3B8",
              width: "32px",
              height: "32px",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          {/* Dual Party Card */}
          <div
            className="dispute-parties-grid"
            style={{
              background: "#0F172A",
              border: "1px solid #2D3D58",
              borderRadius: "14px",
              padding: "16px",
              marginBottom: "20px",
            }}
          >
            {/* Host Box */}
            <div style={{ borderRight: "1px solid #1E2D44", paddingRight: "16px" }}>
              <div style={{ fontSize: "11px", fontWeight: 800, color: "#94A3B8", letterSpacing: "0.5px" }}>
                CLAIMANT (HOST / OWNER)
              </div>
              <div style={{ fontSize: "15px", fontWeight: 800, color: "#F8FAFC", marginTop: "4px" }}>
                {dispute.ownerName}
              </div>
              <div style={{ marginTop: "6px", display: "flex", alignItems: "center", gap: "8px" }}>
                <span className="badge badge-crimson">Claiming ₹{dispute.claimAmount.toLocaleString()}</span>
                <span style={{ fontSize: "11px", color: "#94A3B8" }}>for repair quote</span>
              </div>
              <div style={{ fontSize: "11px", color: "#64748B", marginTop: "6px" }}>
                Reported: {dispute.filedAt}
              </div>
            </div>

            {/* Renter Box */}
            <div style={{ paddingLeft: "8px" }}>
              <div style={{ fontSize: "11px", fontWeight: 800, color: "#94A3B8", letterSpacing: "0.5px" }}>
                RESPONDENT (RENTER)
              </div>
              <div style={{ fontSize: "15px", fontWeight: 800, color: "#F8FAFC", marginTop: "4px" }}>
                {dispute.renterName}
              </div>
              <div style={{ marginTop: "6px", display: "flex", alignItems: "center", gap: "8px" }}>
                <span className="badge badge-amber">Disputing Full Deduction</span>
              </div>
              <div style={{ fontSize: "11px", color: "#64748B", marginTop: "6px" }}>
                Escrow Held: ₹{dispute.securityDeposit.toLocaleString()} (Refund balance pending)
              </div>
            </div>
          </div>

          {/* Issue Statement Banner */}
          <div
            style={{
              background: "rgba(245, 158, 11, 0.08)",
              border: "1px solid rgba(245, 158, 11, 0.25)",
              borderRadius: "12px",
              padding: "14px 16px",
              marginBottom: "20px",
            }}
          >
            <div style={{ fontSize: "12px", fontWeight: 800, color: "#F59E0B", marginBottom: "4px" }}>
              INCIDENT ISSUE & STATEMENTS
            </div>
            <div style={{ fontSize: "13px", color: "#F8FAFC", lineHeight: 1.5 }}>
              <strong>Host Claim:</strong> {dispute.description}
            </div>
            <div style={{ fontSize: "13px", color: "#94A3B8", marginTop: "6px", lineHeight: 1.5 }}>
              <strong>Renter Statement:</strong> {dispute.renterResponse}
            </div>
          </div>

          {/* Navigation Sub-Tabs */}
          <div className="filter-tabs" style={{ marginBottom: "16px" }}>
            <button
              className={`filter-tab ${activeTab === "evidence" ? "active" : ""}`}
              onClick={() => setActiveTab("evidence")}
            >
              🎥 Side-by-Side Video & Photos Evidence
            </button>
            <button
              className={`filter-tab ${activeTab === "agreement" ? "active" : ""}`}
              onClick={() => setActiveTab("agreement")}
            >
              📜 Executed Rental Agreement
            </button>
            <button
              className={`filter-tab ${activeTab === "timeline" ? "active" : ""}`}
              onClick={() => setActiveTab("timeline")}
            >
              ⏱️ Custody Audit Logs
            </button>
            <button
              className={`filter-tab ${activeTab === "messages" ? "active" : ""}`}
              onClick={() => setActiveTab("messages")}
            >
              💬 In-App Messages ({dispute.evidence?.messages?.length || 0})
            </button>
          </div>

          {/* Tab 1: Video & Photos Evidence */}
          {activeTab === "evidence" && (
            <div>
              <div className="split-grid" style={{ marginBottom: "16px" }}>
                {/* Pickup Video Card */}
                <div
                  style={{
                    background: "#0F172A",
                    border: "1px solid #2D3D58",
                    borderRadius: "12px",
                    padding: "14px",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <div style={{ fontSize: "12px", fontWeight: 800, color: "#10B981" }}>
                      PICKUP BASELINE (0:30)
                    </div>
                    <span className="badge badge-emerald">Verified Pristine ✓</span>
                  </div>
                  <div
                    style={{
                      height: "140px",
                      background: "linear-gradient(135deg, #182234, #0F172A)",
                      borderRadius: "8px",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "1px solid #1E2D44",
                      position: "relative",
                    }}
                  >
                    <div
                      style={{
                        width: "44px",
                        height: "44px",
                        borderRadius: "50%",
                        background: "rgba(16, 185, 129, 0.2)",
                        border: "2px solid #10B981",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "18px",
                      }}
                    >
                      ▶
                    </div>
                    <div style={{ fontSize: "11px", color: "#94A3B8", marginTop: "8px", fontWeight: 600 }}>
                      30s Walkaround • Recorded {dispute.evidence?.pickupVideo?.time}
                    </div>
                  </div>
                  <div style={{ fontSize: "11px", color: "#94A3B8", marginTop: "8px", lineHeight: 1.4 }}>
                    {dispute.evidence?.pickupVideo?.note}
                  </div>
                </div>

                {/* Return Video Card */}
                <div
                  style={{
                    background: "#0F172A",
                    border: "1px solid #2D3D58",
                    borderRadius: "12px",
                    padding: "14px",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <div style={{ fontSize: "12px", fontWeight: 800, color: "#EF4444" }}>
                      RETURN HANDOVER (0:30)
                    </div>
                    <span className="badge badge-crimson">Impact Detected ❌</span>
                  </div>
                  <div
                    style={{
                      height: "140px",
                      background: "linear-gradient(135deg, #182234, #0F172A)",
                      borderRadius: "8px",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "1px solid #1E2D44",
                      position: "relative",
                    }}
                  >
                    <div
                      style={{
                        width: "44px",
                        height: "44px",
                        borderRadius: "50%",
                        background: "rgba(239, 68, 68, 0.2)",
                        border: "2px solid #EF4444",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "18px",
                      }}
                    >
                      ▶
                    </div>
                    <div style={{ fontSize: "11px", color: "#94A3B8", marginTop: "8px", fontWeight: 600 }}>
                      30s Return Walkaround • Recorded {dispute.evidence?.returnVideo?.time}
                    </div>
                  </div>
                  <div style={{ fontSize: "11px", color: "#94A3B8", marginTop: "8px", lineHeight: 1.4 }}>
                    {dispute.evidence?.returnVideo?.note}
                  </div>
                </div>
              </div>

              {/* Photos Comparison List */}
              <div
                style={{
                  background: "#0F172A",
                  borderRadius: "12px",
                  padding: "14px",
                  border: "1px solid #2D3D58",
                }}
              >
                <div style={{ fontSize: "12px", fontWeight: 800, color: "#F8FAFC", marginBottom: "8px" }}>
                  Macro Photos Comparison (High-Resolution Angle Match)
                </div>
                <div className="responsive-subgrid-2col" style={{ gap: "10px" }}>
                  <div style={{ background: "#182234", padding: "10px", borderRadius: "8px", fontSize: "11px" }}>
                    <span style={{ color: "#10B981", fontWeight: 700 }}>Pickup Angle #2 (Right Flank):</span> Zero scratches, factory mirror finish.
                  </div>
                  <div style={{ background: "#182234", padding: "10px", borderRadius: "8px", fontSize: "11px" }}>
                    <span style={{ color: "#EF4444", fontWeight: 700 }}>Return Angle #2 (Right Flank):</span> ~12mm deep indentation on exhaust silencer shield.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Executed Rental Agreement */}
          {activeTab === "agreement" && (
            <div
              style={{
                background: "#0F172A",
                border: "1px solid #2D3D58",
                borderRadius: "12px",
                padding: "18px",
                lineHeight: 1.6,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                <div style={{ fontSize: "14px", fontWeight: 800, color: "#F8FAFC" }}>
                  Digital Contract Docket #{dispute.evidence?.agreement?.contractId}
                </div>
                <span className="badge badge-emerald">Legally Executed ✓</span>
              </div>
              <div style={{ fontSize: "12px", color: "#94A3B8", marginBottom: "12px" }}>
                {dispute.evidence?.agreement?.clauses}
              </div>
              <div style={{ display: "flex", gap: "12px", marginTop: "12px", flexWrap: "wrap" }}>
                <div style={{ background: "#182234", padding: "10px 14px", borderRadius: "8px", fontSize: "11px", flex: 1 }}>
                  <strong>Host Signature:</strong> {dispute.evidence?.agreement?.ownerSigned}
                </div>
                <div style={{ background: "#182234", padding: "10px 14px", borderRadius: "8px", fontSize: "11px", flex: 1 }}>
                  <strong>Renter Signature:</strong> {dispute.evidence?.agreement?.renterSigned}
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Timeline */}
          {activeTab === "timeline" && (
            <div
              style={{
                background: "#0F172A",
                border: "1px solid #2D3D58",
                borderRadius: "12px",
                padding: "18px",
              }}
            >
              <div style={{ fontSize: "13px", fontWeight: 800, color: "#F8FAFC", marginBottom: "12px" }}>
                Immutable Audit Trail
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {dispute.evidence?.timeline?.map((entry, idx) => (
                  <div key={idx} style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "12px", color: "#94A3B8" }}>
                    <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#F59E0B" }} />
                    <span>{entry}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 4: Messages */}
          {activeTab === "messages" && (
            <div
              style={{
                background: "#0F172A",
                border: "1px solid #2D3D58",
                borderRadius: "12px",
                padding: "18px",
              }}
            >
              <div style={{ fontSize: "13px", fontWeight: 800, color: "#F8FAFC", marginBottom: "14px" }}>
                Chat History Between Owner & Renter
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {dispute.evidence?.messages?.map((m) => (
                  <div
                    key={m.id}
                    style={{
                      background: m.role === "owner" ? "#182234" : "#131C2E",
                      border: m.role === "owner" ? "1px solid #334155" : "1px solid #253347",
                      borderRadius: "10px",
                      padding: "12px 14px",
                      alignSelf: m.role === "owner" ? "flex-start" : "flex-end",
                      maxWidth: "85%",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", gap: "16px", marginBottom: "4px" }}>
                      <span
                        style={{
                          fontSize: "12px",
                          fontWeight: 700,
                          color: m.role === "owner" ? "#38BDF8" : "#F59E0B",
                        }}
                      >
                        {m.sender}
                      </span>
                      <span style={{ fontSize: "11px", color: "#64748B" }}>{m.time}</span>
                    </div>
                    <div style={{ fontSize: "12px", color: "#E2E8F0", lineHeight: 1.4 }}>{m.text}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Optional Resolution Notes Input */}
          <div style={{ marginTop: "20px" }}>
            <label style={{ fontSize: "12px", fontWeight: 700, color: "#94A3B8", display: "block", marginBottom: "6px" }}>
              Admin Arbitration Verdict Notes (Optional custom justification):
            </label>
            <input
              type="text"
              placeholder="e.g., Forensic comparison confirms impact happened during active custody window..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              style={{
                width: "100%",
                background: "#0F172A",
                border: "1px solid #2D3D58",
                borderRadius: "8px",
                padding: "10px 14px",
                color: "#F8FAFC",
                fontSize: "12px",
                outline: "none",
              }}
            />
          </div>

          {/* Partial Settlement Slider (if toggled) */}
          {isPartialMode && (
            <div
              style={{
                marginTop: "16px",
                padding: "16px",
                background: "#0F172A",
                border: "1px solid #F59E0B",
                borderRadius: "12px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <div style={{ fontSize: "13px", fontWeight: 800, color: "#F59E0B" }}>
                  Partial Compensation Assessment: ₹{partialAmount.toLocaleString()}
                </div>
                <div style={{ fontSize: "12px", color: "#10B981", fontWeight: 700 }}>
                  Renter Refund: ₹{(dispute.securityDeposit - partialAmount).toLocaleString()}
                </div>
              </div>
              <input
                type="range"
                min="100"
                max={dispute.claimAmount}
                step="100"
                value={partialAmount}
                onChange={(e) => setPartialAmount(Number(e.target.value))}
                style={{ width: "100%", accentColor: "#F59E0B", cursor: "pointer" }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", color: "#64748B", marginTop: "4px" }}>
                <span>₹100 (Token)</span>
                <span>₹{partialAmount} (Selected)</span>
                <span>₹{dispute.claimAmount} (Full Claim)</span>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer with Arbitration Action Buttons */}
        <div className="modal-footer">
          <button className="btn btn-outline" onClick={onClose}>
            Close Docket
          </button>

          {isPartialMode ? (
            <>
              <button className="btn btn-outline" onClick={() => setIsPartialMode(false)}>
                Cancel Partial
              </button>
              <button className="btn btn-primary" onClick={handlePartial}>
                Confirm Partial Settlement (₹{partialAmount})
              </button>
            </>
          ) : (
            <>
              <button
                className="btn btn-danger-outline"
                onClick={handleReject}
                title="Reject claim completely and release 100% of escrow back to renter"
              >
                Reject Claim (Full Refund to Renter)
              </button>
              <button
                className="btn btn-outline"
                onClick={() => setIsPartialMode(true)}
                title="Negotiate partial payout between Host and Renter"
              >
                ⚖️ Partial Settlement
              </button>
              <button
                className="btn btn-success"
                onClick={handleApprove}
                title="Approve owner claim of ₹2,000 and refund balance deposit"
              >
                ✓ Approve Owner Claim (₹{dispute.claimAmount.toLocaleString()})
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
