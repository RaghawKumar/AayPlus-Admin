"use client";

import { useState } from "react";

export default function PolicyRulesSection({ onNotify }) {
  // Interactive Late Calculator State
  const [scheduledTime, setScheduledTime] = useState("18:00");
  const [actualReturnTime, setActualReturnTime] = useState("19:30");

  const calculateLate = () => {
    const [sH, sM] = scheduledTime.split(":").map(Number);
    const [aH, aM] = actualReturnTime.split(":").map(Number);
    const sTotal = sH * 60 + sM;
    const aTotal = aH * 60 + aM;
    const diff = aTotal - sTotal;

    if (diff <= 0) {
      return { diff: 0, text: "Returned On-Time", fee: 0, rule: "No penalty (On-time return)" };
    }
    if (diff <= 15) {
      return {
        diff,
        text: `Late by ${diff} minutes`,
        fee: 0,
        rule: "0 – 15 min Grace Period Applied (₹0 Penalty)",
      };
    }
    if (diff <= 60) {
      return {
        diff,
        text: `Late by ${diff} minutes`,
        fee: 200,
        rule: "15 – 60 min Tier 1 Applied (Standard 1-hour late fee of ₹200)",
      };
    }
    const extraHours = Math.ceil(diff / 60);
    return {
      diff,
      text: `Late by ${Math.floor(diff / 60)}h ${diff % 60}m`,
      fee: 200 + (extraHours - 1) * 300,
      rule: "> 60 min Tier 2 Applied (Additional rental day/extended block charge)",
    };
  };

  const lateResult = calculateLate();

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <span>Marketplace Rules & Policy Engine</span>
            <span className="badge badge-amber">Automated Enforcement</span>
          </h1>
          <p className="page-subtitle">
            Configure Section 26 (Late Return Grace Periods), Section 27 (Cancellation Brackets & Owner Strikes), and Section 28 (Dual Trust Network).
          </p>
        </div>
      </div>

      {/* SECTION 26: LATE RETURN POLICY */}
      <div className="card-box">
        <div className="card-box-header">
          <div className="card-title">
            <span>⏱️ Section 26: Late Return Grace Period & Fee Schedule</span>
          </div>
          <span className="badge badge-emerald">Active Policy Matrix</span>
        </div>

        <div className="split-grid">
          {/* Rules Description */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <div
              style={{
                background: "#0F172A",
                padding: "14px",
                borderRadius: "10px",
                border: "1px solid #10B981",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <strong style={{ color: "#10B981", fontSize: "13px" }}>0 – 15 Minutes</strong>
                <span className="badge badge-emerald">₹0 Free Grace Period</span>
              </div>
              <div style={{ fontSize: "11px", color: "#94A3B8", marginTop: "4px" }}>
                Friendly buffer for local traffic, parking delays, or elevator access. No penalty charged to renter.
              </div>
            </div>

            <div
              style={{
                background: "#0F172A",
                padding: "14px",
                borderRadius: "10px",
                border: "1px solid #F59E0B",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <strong style={{ color: "#F59E0B", fontSize: "13px" }}>15 – 60 Minutes</strong>
                <span className="badge badge-amber">₹200 Standard 1-Hour Fee</span>
              </div>
              <div style={{ fontSize: "11px", color: "#94A3B8", marginTop: "4px" }}>
                Host compensated for holding schedule; pro-rated 1-hour late fee automatically deducted from security deposit.
              </div>
            </div>

            <div
              style={{
                background: "#0F172A",
                padding: "14px",
                borderRadius: "10px",
                border: "1px solid #EF4444",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <strong style={{ color: "#EF4444", fontSize: "13px" }}>&gt; 60 Minutes</strong>
                <span className="badge badge-crimson">Full Extended Day Period</span>
              </div>
              <div style={{ fontSize: "11px", color: "#94A3B8", marginTop: "4px" }}>
                Severe hold-up impacting next reservation. Full additional daily rate charged + notification to host.
              </div>
            </div>
          </div>

          {/* Interactive Live Simulator */}
          <div
            style={{
              background: "#0F172A",
              border: "1px solid #2D3D58",
              borderRadius: "12px",
              padding: "18px",
            }}
          >
            <div style={{ fontSize: "13px", fontWeight: 800, color: "#F8FAFC", marginBottom: "12px" }}>
              Interactive Return Time Simulator
            </div>

            <div className="responsive-subgrid-2col" style={{ marginBottom: "14px" }}>
              <div>
                <label style={{ fontSize: "11px", color: "#94A3B8", display: "block", marginBottom: "4px" }}>
                  Scheduled Return:
                </label>
                <input
                  type="time"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  style={{
                    width: "100%",
                    background: "#182234",
                    border: "1px solid #334155",
                    color: "#F8FAFC",
                    padding: "8px",
                    borderRadius: "8px",
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: "11px", color: "#94A3B8", display: "block", marginBottom: "4px" }}>
                  Actual Return:
                </label>
                <input
                  type="time"
                  value={actualReturnTime}
                  onChange={(e) => setActualReturnTime(e.target.value)}
                  style={{
                    width: "100%",
                    background: "#182234",
                    border: "1px solid #334155",
                    color: "#F8FAFC",
                    padding: "8px",
                    borderRadius: "8px",
                  }}
                />
              </div>
            </div>

            <div
              style={{
                background: "#182234",
                padding: "14px",
                borderRadius: "10px",
                border: "1px solid #F59E0B",
              }}
            >
              <div style={{ fontSize: "12px", color: "#94A3B8" }}>Automated Calculation Result:</div>
              <div style={{ fontSize: "18px", fontWeight: 900, color: lateResult.fee > 0 ? "#EF4444" : "#10B981", marginTop: "4px" }}>
                {lateResult.text} • Penalty: ₹{lateResult.fee}
              </div>
              <div style={{ fontSize: "11px", color: "#F59E0B", marginTop: "4px" }}>
                {lateResult.rule}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 27: CANCELLATION RULES & OWNER STRIKES */}
      <div className="card-box">
        <div className="card-box-header">
          <div className="card-title">
            <span>🛡️ Section 27: Cancellation Policy Matrix & Host Accountability</span>
          </div>
        </div>

        <div className="split-grid">
          {/* Renter Brackets */}
          <div style={{ background: "#0F172A", padding: "18px", borderRadius: "12px", border: "1px solid #2D3D58" }}>
            <div style={{ fontSize: "14px", fontWeight: 800, color: "#0EA5E9", marginBottom: "10px" }}>
              Renter Cancellation Tiers
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "8px", background: "#182234", borderRadius: "6px" }}>
                <span>&gt; 24 Hours before start</span>
                <strong style={{ color: "#10B981" }}>100% Full Refund ✓</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "8px", background: "#182234", borderRadius: "6px" }}>
                <span>12 – 24 Hours before start</span>
                <strong style={{ color: "#F59E0B" }}>90% Refund (10% Fee)</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "8px", background: "#182234", borderRadius: "6px" }}>
                <span>&lt; 12 Hours before start</span>
                <strong style={{ color: "#EF4444" }}>50% Refund (50% Fee)</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "8px", background: "#182234", borderRadius: "6px" }}>
                <span>After Handover window starts</span>
                <strong style={{ color: "#EF4444" }}>0% Strict Lock</strong>
              </div>
            </div>
          </div>

          {/* Host Accountability */}
          <div style={{ background: "#0F172A", padding: "18px", borderRadius: "12px", border: "1px solid #2D3D58" }}>
            <div style={{ fontSize: "14px", fontWeight: 800, color: "#EF4444", marginBottom: "10px" }}>
              Host Cancellation Penalty Engine
            </div>
            <div style={{ fontSize: "12px", color: "#94A3B8", lineHeight: 1.6 }}>
              Because host cancellations directly damage marketplace trust, strict automated penalties apply:
            </div>
            <div style={{ marginTop: "10px", display: "flex", flexDirection: "column", gap: "8px", fontSize: "11px" }}>
              <div style={{ padding: "8px", background: "#182234", borderRadius: "6px", color: "#10B981" }}>
                ✓ Renter receives immediate 100% refund + ₹250 instant goodwill voucher.
              </div>
              <div style={{ padding: "8px", background: "#182234", borderRadius: "6px", color: "#F59E0B" }}>
                ⚠️ Host profile automatically assigned <strong>1 Policy Strike</strong>.
              </div>
              <div style={{ padding: "8px", background: "#182234", borderRadius: "6px", color: "#EF4444" }}>
                🚫 <strong>3 Strikes in 90 days:</strong> All listings suspended for 30 days.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 28: DUAL TRUST NETWORK */}
      <div className="card-box">
        <div className="card-box-header">
          <div className="card-title">
            <span>⭐ Section 28: Dual Trust Network Rating Dimensions</span>
          </div>
          <span className="badge badge-amber">4.89 Average Marketplace Score</span>
        </div>

        <div className="split-grid">
          {/* Renter rates Host */}
          <div style={{ background: "#0F172A", padding: "18px", borderRadius: "12px", border: "1px solid #2D3D58" }}>
            <div style={{ fontSize: "13px", fontWeight: 800, color: "#F8FAFC", marginBottom: "8px" }}>
              Renter Rates Host (4 Dimensions)
            </div>
            <ul style={{ listStyle: "none", fontSize: "12px", color: "#94A3B8", display: "flex", flexDirection: "column", gap: "6px" }}>
              <li>⭐ <strong>Item Condition:</strong> Hardware match with listing photos & running health</li>
              <li>⭐ <strong>Pickup Experience:</strong> Punctuality & smooth video inspection</li>
              <li>⭐ <strong>Owner Communication:</strong> Responsiveness & helpful handover guidance</li>
              <li>⭐ <strong>Listing Accuracy:</strong> Accurate specifications & accessory inclusions</li>
            </ul>
          </div>

          {/* Host rates Renter */}
          <div style={{ background: "#0F172A", padding: "18px", borderRadius: "12px", border: "1px solid #2D3D58" }}>
            <div style={{ fontSize: "13px", fontWeight: 800, color: "#F8FAFC", marginBottom: "8px" }}>
              Host Rates Renter (4 Dimensions)
            </div>
            <ul style={{ listStyle: "none", fontSize: "12px", color: "#94A3B8", display: "flex", flexDirection: "column", gap: "6px" }}>
              <li>⭐ <strong>Item Handling:</strong> Careful usage without neglect or abuse</li>
              <li>⭐ <strong>Timeliness:</strong> On-time return honoring the return schedule</li>
              <li>⭐ <strong>Communication:</strong> Courteous messaging & prompt milestone updates</li>
              <li>⭐ <strong>Return Condition:</strong> Clean return without fuel deficits or debris</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
