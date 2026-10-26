import React, { useState, useEffect } from 'react';
import { LocalizedLink } from '../components/common/LocalizedLink';
import { apiRequest } from '../utils/api';
import { AdminWorkspace } from './AdminWorkspace';
import { useSeo } from '../hooks/useSeo';

export const AdminLogin: React.FC = () => {
  useSeo({ title: 'Administrator access | NIYO IREME UNIT LTD', description: 'Private administrator sign-in.', path: '/admin/login', noIndex: true });
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [regStatus, setRegStatus] = useState<boolean | null>(null);
  const [regLoading, setRegLoading] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [adminLabel, setAdminLabel] = useState('');
  const [registering, setRegistering] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    void (async () => {
      try {
        const status = await apiRequest<{ registrationEnabled: boolean }>('/auth/register/status');
        setRegStatus(status.registrationEnabled);
        const session = await apiRequest<{ data?: { email?: string } }>('/auth/me');
        setAdminLabel(session.data?.email || 'Administrator');
        setLoggedIn(true);
      } catch {
        setLoggedIn(false);
      } finally { setCheckingSession(false); }
    })();
  }, []);

  const toggleRegistration = async (): Promise<boolean> => {
    setRegLoading(true);
    try {
      const data = await apiRequest<{ registrationEnabled: boolean }>('/auth/register/toggle', {
        method: 'POST',
      });
      setRegStatus(data.registrationEnabled);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update registration setting');
      return false;
    } finally {
      setRegLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const endpoint = registering ? '/auth/register' : '/auth/login';
      const data = await apiRequest<{ success?: boolean; admin?: { email?: string } }>(endpoint, {
        method: 'POST',
        body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
      });
      if (!data.success && !data.admin) throw new Error('The server did not confirm authentication.');
      const session = await apiRequest<{ data?: { email?: string } }>('/auth/me');
      setAdminLabel(session.data?.email || data.admin?.email || email.trim().toLowerCase());
      setLoggedIn(true);
      setError('');
      setRegistering(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to connect to the server');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try { await apiRequest('/auth/logout', { method: 'POST' }); } catch { /* local session UI still clears */ }
    setLoggedIn(false);
    setAdminLabel('');
    setRegStatus(null);
    setError('');
  };

  if (checkingSession) return <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-600">Connecting to admin service…</div>;

  if (loggedIn) {
    return <AdminWorkspace onLogout={() => void handleLogout()} adminLabel={adminLabel} registrationEnabled={regStatus} onToggleRegistration={toggleRegistration} registrationLoading={regLoading} />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-8 sm:p-10">
          <div className="text-center mb-8">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-brand-orange/10 text-brand-orange mx-auto mb-4">
              <span className="text-2xl" aria-hidden="true">✔</span>
            </div>
            <h2 className="font-heading text-2xl font-black text-brand-navy">
              {registering ? 'Create Admin Account' : 'Admin Login'}
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              NIYO IREME UNIT LTD
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-700 text-sm" role="alert">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none transition-colors"
                placeholder="admin@niyoiremeunitltd.com"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none transition-colors"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-brand-navy text-white font-bold font-heading uppercase tracking-wider hover:bg-brand-navy-soft transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Please wait...' : registering ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-200">
            <p className="text-sm text-slate-600 text-center">
              {regStatus ? 'First-time setup or registration is enabled.' : 'Super admin access only.'}
            </p>
            {regStatus && <button type="button" onClick={() => { setRegistering(!registering); setError(''); }} className="mt-3 w-full text-sm font-bold text-brand-orange">{registering ? 'Already have an account? Sign in' : 'Create an admin account'}</button>}
            <LocalizedLink
              to="/"
              className="block mt-4 text-sm font-bold text-brand-orange text-center transition-colors hover:text-brand-orange-dark"
            >
              ← Back to website
            </LocalizedLink>
          </div>
        </div>
      </div>
    </div>
  );
};
