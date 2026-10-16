"use client";

const sectionNames = {
  overview: "Overview", disputes: "Disputes", users: "Users", listings: "Listings",
  bookings: "Bookings", payments: "Payments", policies: "Policies",
};

export default function TopHeader({ searchQuery, setSearchQuery, onResetData, onOpenSidebar, currentTab, sidebarOpen = false, connected = false, loading = false }) {
  const searchable = !["overview", "policies"].includes(currentTab);
  const name = sectionNames[currentTab] || "Overview";
  return (
    <header className="admin-header">
      <div className="workspace-heading">
        <button className="sidebar-toggle-btn" onClick={onOpenSidebar} aria-label="Open navigation" aria-controls="admin-navigation" aria-expanded={sidebarOpen}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M3 12h18M3 18h18" /></svg>
        </button>
        <div><div className="workspace-eyebrow">AAYPLUS WORKSPACE</div><div className="workspace-breadcrumb">Operations <span>/</span> <strong>{name}</strong></div></div>
      </div>
      <div className="header-actions">
        {searchable && <div className="header-search" role="search">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m16 16 4 4"/></svg>
          <input type="search" aria-label={`Search ${name.toLowerCase()}`} placeholder={`Search ${name.toLowerCase()}…`} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          {searchQuery && <button className="search-clear" aria-label="Clear search" onClick={() => setSearchQuery("")}>×</button>}
        </div>}
        <span className="demo-indicator"><span />{connected ? 'Shared API' : 'Demo workspace'}</span>
        <button className="btn btn-outline btn-sm" title={connected ? 'Refresh shared data' : 'Restore the sample records'} disabled={loading} onClick={onResetData}>{connected ? 'Refresh' : 'Reset demo'}</button>
      </div>
    </header>
  );
}
