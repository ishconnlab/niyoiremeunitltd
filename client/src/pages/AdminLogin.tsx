import React, { useState, useEffect } from 'react';
import { LocalizedLink } from '../components/common/LocalizedLink';

export const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [regStatus, setRegStatus] = useState<boolean | null>(null);
  const [regLoading, setRegLoading] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'https://niyoiremeunitltd.onrender.com';

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      setLoggedIn(true);
      fetchRegistrationStatus();
    }
  }, [token]);

  const fetchRegistrationStatus = async () => {
    try {
      const response = await fetch(`${API_URL}/api/auth/register/status`);
      const data = await response.json();
      setRegStatus(data.registrationEnabled);
    } catch {
      setRegStatus(null);
    }
  };

  const toggleRegistration = async () => {
    setRegLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/auth/register/toggle`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setRegStatus(data.registrationEnabled);
      } else {
        setError(data.message || 'Failed to update registration setting');
      }
    } catch {
      setError('Connection error. Is the backend running?');
    } finally {
      setRegLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('admin', JSON.stringify(data.admin));
        setLoggedIn(true);
        setError('');
        fetchRegistrationStatus();
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Connection error. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('admin');
    setLoggedIn(false);
    setRegStatus(null);
    setError('');
  };

  if (loggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-8 sm:p-10">
            <div className="text-center mb-8">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-brand-orange/10 text-brand-orange mx-auto mb-4">
                <span className="text-2xl" aria-hidden="true">✔</span>
              </div>
              <h2 className="font-heading text-2xl font-black text-brand-navy">
                Admin Panel
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                NIYO IREME UNIT COMPANY LTD
              </p>
            </div>

            <div className="mb-6 p-4 rounded-xl bg-brand-navy/10 border border-brand-orange/20 text-brand-navy text-sm">
              <p className="font-medium mb-2">Admin Registration</p>
              <p className="text-xs mb-3">
                Registration is currently{' '}
                {regStatus === null ? 'checking...' : regStatus ? 'enabled' : 'disabled'}
                .
              </p>
              <button
                onClick={toggleRegistration}
                disabled={regLoading}
                className={`w-full py-3 rounded-xl font-bold uppercase tracking-wider transition-colors disabled:opacity-50 ${
                  regStatus === true
                    ? 'bg-brand-navy text-white hover:bg-brand-navy-soft'
                    : 'bg-brand-orange text-white hover:bg-brand-orange-dark'
                }`}
              >
                {regLoading
                  ? 'Updating...'
                  : regStatus === true
                    ? 'Disable Registration'
                    : 'Enable Registration'}
              </button>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-200">
              <button
                onClick={handleLogout}
                className="w-full py-3 rounded-xl bg-slate-100 text-slate-600 font-bold uppercase tracking-wider hover:bg-slate-200 transition-colors"
              >
                Logout
              </button>
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
              Admin Login
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              NIYO IREME UNIT COMPANY LTD
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-700 text-sm">
              {error}
            </div>
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
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-200">
            <p className="text-sm text-slate-600 text-center">
              Super admin access only. Static credentials required.
            </p>
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
