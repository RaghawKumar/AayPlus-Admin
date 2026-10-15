"use client";

import { useCallback, useEffect, useRef, useState } from 'react';
import { devLog, logClick } from './lib/dev-log';
import InspectionMedia from './components/InspectionMedia';
import Sidebar from './components/Sidebar';
import TopHeader from './components/TopHeader';
import { request, collection, money, dateTime } from './lib/api';

const empty = { users: [], listings: [], bookings: [], disputes: [], ledger: [], audit: [], stats: {} };
const titles = { overview: 'Marketplace overview', users: 'Members & verification', listings: 'Marketplace listings', bookings: 'Rental bookings', disputes: 'Disputes & review', payments: 'Accounting ledger', policies: 'Marketplace rules' };

function Modal({ title, children, onClose }) {
  const ref = useRef(null);
  useEffect(() => { const dialog = ref.current; dialog.showModal(); return () => dialog.close(); }, []);
  return <dialog ref={ref} className="connected-dialog" onCancel={onClose} aria-labelledby="dialog-title">
    <div className="connected-dialog-header"><h2 id="dialog-title">{title}</h2><button className="btn btn-outline btn-sm" aria-label="Close dialog" onClick={onClose}>×</button></div>{children}
  </dialog>;
}

export default function AdminDashboardPage() {
  const [session, setSession] = useState(null);
  const sessionRef = useRef(null), sequence = useRef(0);
  const [phone, setPhone] = useState(''), [name, setName] = useState(''), [code, setCode] = useState('');
  const [codeSent, setCodeSent] = useState(false), [devCode, setDevCode] = useState(null);
  const [data, setData] = useState(empty), [error, setError] = useState(''), [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false), [loading, setLoading] = useState(false);
  const [currentTab, setTab] = useState('overview'), [searchQuery, setSearchQuery] = useState(''), [sidebarOpen, setSidebarOpen] = useState(false);
  const [resolution, setResolution] = useState(null), [amount, setAmount] = useState(''), [notes, setNotes] = useState('');
  const [evidence, setEvidence] = useState(null), [updated, setUpdated] = useState(null);

  const clearSession = useCallback(() => {
    sessionRef.current = null; ++sequence.current; setSession(null); setData(empty); setResolution(null); setEvidence(null); setUpdated(null); setLoading(false); setNotice(''); setCodeSent(false); setCode(''); setDevCode(null);
  }, []);
  const load = useCallback(async () => {
    const current = sessionRef.current;
    if (!current) return;
    const ticket = ++sequence.current;
    setLoading(true);
    try {
      const [users, listings, bookings, disputes, ledger, audit, stats] = await Promise.all([
        ...['users', 'listings', 'bookings', 'disputes', 'ledger', 'audit'].map(table => collection(`/admin/${table}`, current.token)),
        request('/admin/stats', { token: current.token }),
      ]);
      if (ticket !== sequence.current || current !== sessionRef.current) return;
      setData({ users, listings, bookings, disputes, ledger, audit, stats }); setError(''); setUpdated(new Date());
    } catch (err) {
      if (current !== sessionRef.current || ticket !== sequence.current) return;
      if (err.status === 401 || err.status === 403) clearSession();
      setError(err.message);
    } finally { if (ticket === sequence.current) setLoading(false); }
  }, [clearSession]);
  useEffect(() => {
    if (!session) return;
    const initial = setTimeout(load, 0), interval = setInterval(load, 15000);
    const focused = () => { if (!document.hidden) load(); };
    document.addEventListener('visibilitychange', focused);
    return () => { clearTimeout(initial); clearInterval(interval); document.removeEventListener('visibilitychange', focused); };
  }, [session, load]);

  useEffect(() => { devLog('screen', { name: session ? currentTab : 'Admin sign in' }); }, [session, currentTab]);

  async function authenticate(event) {
    event.preventDefault(); setBusy(true); setError('');
    try {
      const normalized = `+91${phone.trim()}`;
      if (!codeSent) {
        const result = await request('/auth/otp', { method: 'POST', body: { phone: normalized } });
        setCodeSent(true); setDevCode(result.developmentCode || null);
      } else {
        const result = await request('/auth/verify', { method: 'POST', body: { phone: normalized, code: code.trim(), name: name.trim() } });
        if (result.user.role !== 'admin') {
          await request('/auth/logout', { method: 'POST', token: result.token, body: {} });
          setCodeSent(false); setCode(''); setDevCode(null);
          throw new Error('This account is not an administrator. Ask your operator to grant administrator access.');
        }
        sessionRef.current = result; setSession(result); setCode(''); setDevCode(null);
      }
    } catch (err) { setError(err.message); } finally { setBusy(false); }
  }
  async function mutate(path, body, method = 'POST') {
    if (busy) return false;
    setBusy(true); setError(''); setNotice('');
    try {
      await request(path, { method, body, token: sessionRef.current.token });
      setNotice('Saved to the shared backend.'); await load(); return true;
    } catch (err) { if (err.status === 401) clearSession(); setError(err.message); return false; }
    finally { setBusy(false); }
  }
  const navigate = tab => { setTab(tab); setSearchQuery(''); setSidebarOpen(false); };
  const matches = row => !searchQuery || JSON.stringify(row).toLowerCase().includes(searchQuery.toLowerCase());
  const bookingById = Object.fromEntries(data.bookings.map(b => [b.id, b]));
  async function inspect(bookingId) {
    setBusy(true); setError('');
    try { setEvidence(await request(`/bookings/${bookingId}`, { token: sessionRef.current.token })); }
    catch (err) { setError(err.message); } finally { setBusy(false); }
  }
  const badge = status => <span className={`badge ${['verified', 'active', 'completed', 'resolved', 'approved'].includes(status) ? 'badge-emerald' : 'badge-amber'}`}>{String(status).replaceAll('_', ' ')}</span>;
  function table(headings, rows) {
    return <div className="card-box table-responsive"><table className="admin-table"><thead><tr>{headings.map(h => <th key={h}>{h}</th>)}</tr></thead><tbody>{rows.length ? rows : <tr><td colSpan={headings.length} className="connected-empty">No records found. New app activity will appear here.</td></tr>}</tbody></table></div>;
  }
  if (!session) return <main className="connected-login" onClickCapture={logClick}><form onSubmit={authenticate} className="card-box connected-login-card">
    <div className="workspace-eyebrow">AAYPLUS OPERATIONS</div><h1>Welcome back.</h1><p>Sign in with your administrator account to manage the shared marketplace.</p>
    <label>Mobile number<input required type="tel" pattern="[6-9][0-9]{9}" maxLength={10} placeholder="10-digit Indian mobile number" value={phone} disabled={codeSent || busy} onChange={e => setPhone(e.target.value)} /></label>
    {codeSent && <><label>Verification code<input required inputMode="numeric" pattern="[0-9]{6}" maxLength={6} value={code} onChange={e => setCode(e.target.value)} /></label><label>Name for a new account<input value={name} onChange={e => setName(e.target.value)} maxLength={100} /></label></>}
    {devCode && <p className="connected-info">Development server · Code: <strong>{devCode}</strong>. SMS is not configured.</p>}
    {error && <p className="connected-error" role="alert">{error}</p>}
    <button className="btn btn-primary" disabled={busy}>{busy ? 'Please wait…' : codeSent ? 'Sign in' : 'Send verification code'}</button>
    {codeSent && <button className="btn btn-outline" type="button" disabled={busy} onClick={() => { setCodeSent(false); setCode(''); setDevCode(null); }}>Change number / request another code</button>}
    <small>Sessions stay in this tab’s memory. Reloading requires sign-in.</small>
  </form></main>;

  return <div className="admin-layout" onClickCapture={logClick}>
    <a className="skip-link" href="#main-content">Skip to content</a>
    <Sidebar currentTab={currentTab} setCurrentTab={navigate} stats={{ pendingDisputes: data.stats.pendingDisputes || 0, pendingKyc: data.stats.unverifiedUsers || 0 }} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    <div className="admin-main">
      <TopHeader currentTab={currentTab} searchQuery={searchQuery} setSearchQuery={setSearchQuery} onResetData={load} onOpenSidebar={() => setSidebarOpen(true)} connected loading={loading} />
      <main id="main-content" className="admin-content" tabIndex={-1}>
        <div className="connected-session"><span>{session.user.name} · {updated ? `Updated ${updated.toLocaleTimeString('en-IN')}` : 'Connecting…'} · Refreshes every 15 seconds</span><button className="btn btn-outline btn-sm" disabled={busy} onClick={async () => {
          setBusy(true);
          try { await request('/auth/logout', { token: session.token, method: 'POST', body: {} }); clearSession(); }
          catch (err) { setError(err.message); } finally { setBusy(false); }
        }}>Sign out</button></div>
        {error && <div className="connected-error" role="alert">{error} <button className="btn btn-outline btn-sm" onClick={load}>Retry</button></div>}
        {notice && <div className="connected-info" role="status">{notice}</div>}
        <div className="page-header"><div><h1 className="page-title">{titles[currentTab]}</h1><p className="page-subtitle">Shared API data. App requests and administrator changes are saved to the same database.</p></div>{loading && <span role="status">Refreshing…</span>}</div>

        {currentTab === 'overview' && <>
          <div className="stats-grid">{[['Members', data.stats.totalUsers], ['Active listings', data.stats.totalListings], ['Active rentals', data.stats.activeRentals], ['Completed rentals', data.stats.completedRentals]].map(([label, value]) => <div className="stat-card" key={label}><div className="stat-card-label">{label}</div><div className="stat-card-value">{value ?? '—'}</div></div>)}</div>
          <div className="operations-queue"><button onClick={() => navigate('users')}><span className="queue-icon">01</span><span><strong>Verify members</strong><small>{data.stats.unverifiedUsers || 0} unverified accounts</small></span></button><button onClick={() => navigate('disputes')}><span className="queue-icon">02</span><span><strong>Review disputes</strong><small>{data.stats.pendingDisputes || 0} open cases</small></span></button><button onClick={() => navigate('bookings')}><span className="queue-icon">03</span><span><strong>Track rentals</strong><small>{data.bookings.length} bookings</small></span></button></div>
          <div className="connected-info">Payments, SMS delivery and identity providers are not configured. Development verification is available only when the backend runs in development mode.</div>
          <h2 className="connected-section-title">Recent operations</h2>
          {table(['Action', 'Resource', 'Time'], data.audit.slice(0, 12).map(row => <tr key={row.id}><td>{row.action}</td><td className="connected-id">{row.resource_id}</td><td>{dateTime(row.created_at)}</td></tr>))}
        </>}
        {currentTab === 'users' && table(['Member', 'Phone', 'Role', 'Verification', 'Review'], data.users.filter(matches).map(row => <tr key={row.id}>
          <td><strong>{row.name}</strong><div className="connected-id">{row.email || row.id}</div></td><td>{row.phone}</td><td>{row.role}</td><td>{badge(row.kyc_status)}</td><td><div className="connected-actions">
            <button className="btn btn-secondary btn-sm" disabled={busy || row.kyc_status === 'verified'} onClick={() => mutate(`/admin/users/${row.id}/kyc`, { status: 'verified' })}>Verify (development)</button>
            <button className="btn btn-outline btn-sm" disabled={busy || row.kyc_status === 'rejected'} onClick={() => mutate(`/admin/users/${row.id}/kyc`, { status: 'rejected' })}>Reject</button>
          </div></td>
        </tr>))}
        {currentTab === 'listings' && table(['Listing', 'Host', 'Pricing', 'Status', 'Action'], data.listings.filter(matches).map(row => <tr key={row.id}>
          <td><strong>{row.title}</strong><div>{row.category} · {row.location}</div></td><td>{data.users.find(u => u.id === row.owner_id)?.name || row.owner_id}</td><td>{money(row.hourly_paise)} / hr<br />Deposit {money(row.deposit_paise)}</td><td>{badge(row.active ? 'active' : 'archived')}</td><td><button className="btn btn-outline btn-sm" disabled={busy} onClick={() => mutate(`/listings/${row.id}`, { active: !row.active }, 'PATCH')}>{row.active ? 'Archive' : 'Activate'}</button></td>
        </tr>))}
        {currentTab === 'bookings' && table(['Rental', 'Members', 'Schedule', 'Status', 'Evidence'], data.bookings.filter(matches).map(row => <tr key={row.id}>
          <td><strong>{row.listing.title}</strong><div className="connected-id">{row.id}</div></td><td>Host: {row.owner_name}<br />Renter: {row.renter_name}</td><td>{dateTime(row.start_at)}<br />{dateTime(row.end_at)}</td><td>{badge(row.status)}</td><td><button className="btn btn-outline btn-sm" disabled={busy} onClick={() => inspect(row.id)}>View handover</button></td>
        </tr>))}
        {currentTab === 'disputes' && table(['Case', 'Claim', 'Renter response', 'Status', 'Review'], data.disputes.map(d => ({ ...d, rental: bookingById[d.booking_id]?.listing?.title })).filter(matches).map(row => <tr key={row.id}>
          <td><strong>{row.rental || row.booking_id}</strong><div>{row.description}</div><div className="connected-id">{row.id}</div></td><td>{money(row.claim_paise)}</td><td>{row.response || 'Awaiting response'}</td><td>{badge(row.status)}{row.status === 'resolved' && <div>{money(row.settlement_paise)} · {row.notes}</div>}</td><td><div className="connected-actions"><button className="btn btn-outline btn-sm" disabled={busy} onClick={() => inspect(row.booking_id)}>Evidence</button>{row.status === 'open' && <button className="btn btn-primary btn-sm" disabled={busy} onClick={() => { setResolution(row); setAmount(String(row.claim_paise / 100)); setNotes(''); }}>Resolve</button>}</div></td>
        </tr>))}
        {currentTab === 'payments' && <><div className="connected-info">These are accounting intentions. No capture, escrow transfer, payout or refund has been performed.</div>{table(['Booking', 'Member', 'Accounting entry', 'Amount', 'Time'], data.ledger.filter(matches).map(row => <tr key={row.id}><td className="connected-id">{row.booking_id}</td><td>{data.users.find(u => u.id === row.user_id)?.name || row.user_id}</td><td>{row.kind.replaceAll('_', ' ')}</td><td>{money(row.amount_paise)}</td><td>{dateTime(row.created_at)}</td></tr>))}</>}
        {currentTab === 'policies' && <div className="card-box connected-policy"><h2>Current server rules</h2><p>Bookings require verified accounts. Hosts cannot book their own listings. Overlapping reservations are rejected.</p><p>Pricing uses the cheapest combination of hourly, daily and weekly packages, rounded up by hour. A ₹30 platform fee and the listing’s deposit are included in the quote.</p><p>Both parties acknowledge terms before the host records pickup. Pickup requires the start time to have arrived. Handover inspections need notes and at least one HTTPS photo reference.</p><p>Damage claims require a return inspection. Claims cannot exceed the deposit, and administrator settlements cannot exceed the claim.</p><p>Cancellation is available before the start time. Pending requests do not yet expire automatically. Payment and cancellation fee services remain unconfigured.</p><p>These rules are enforced by the backend; this panel does not edit them.</p></div>}
      </main>
    </div>
    {resolution && <Modal title="Resolve damage claim" onClose={() => { if (!busy) setResolution(null); }}><form onSubmit={async e => {
      e.preventDefault(); const value = Number(amount);
      if (!Number.isFinite(value) || value < 0 || Math.round(value * 100) > resolution.claim_paise) { setError('Enter a settlement between zero and the claim amount.'); return; }
      const saved = await mutate(`/admin/disputes/${resolution.id}/resolve`, { settlement_paise: Math.round(value * 100), notes: notes.trim() });
      if (saved) setResolution(null);
    }}><p>{resolution.description}</p><p>Claim: {money(resolution.claim_paise)}. Enter zero to reject the claim.</p><label>Settlement in rupees<input required type="number" min="0" step="0.01" max={resolution.claim_paise / 100} value={amount} onChange={e => setAmount(e.target.value)} /></label><label>Decision notes<textarea required maxLength={2000} value={notes} onChange={e => setNotes(e.target.value)} /></label>{error && <p className="connected-error" role="alert">{error}</p>}<button className="btn btn-primary" disabled={busy}>{busy ? 'Saving…' : 'Save final decision'}</button></form></Modal>}
    {evidence && <Modal title="Booking & inspection evidence" onClose={() => setEvidence(null)}><p>{evidence.listing.title}</p><p>Host {evidence.owner_signed ? 'acknowledged' : 'pending'} · Renter {evidence.renter_signed ? 'acknowledged' : 'pending'}</p>{evidence.inspections.length ? evidence.inspections.map(row => <section key={row.id}><h3>{row.kind} · {dateTime(row.created_at)}</h3><p>{row.notes}</p><div className="connected-evidence">{row.photos.map((photo, i) => <InspectionMedia key={photo + i} path={photo} token={session.token} />)}{(row.videos || []).map((video, i) => <InspectionMedia key={video + i} path={video} token={session.token} video />)}</div></section>) : <p>No handover inspections have been recorded yet.</p>}</Modal>}
  </div>;
}
