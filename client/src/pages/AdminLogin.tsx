import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LocalizedLink } from '../components/common/LocalizedLink';

export const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

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
        navigate('/admin/dashboard');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Connection error. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-8 sm:p-10">
          <div className="text-center mb-8">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-brand-orange/10 text-brand-orange mx-auto mb-4">
              <span className="text-2xl" aria-hidden="true">â˜…</span>
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
                placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-brand-navy text-white font-bold font-heading uppercase tracking-wider hover:bg-brand-navy-soft transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing inâ€¦' : 'Sign In'}
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
              â† Back to website
            </LocalizedLink>
          </div>
        </div>
      </div>
    </div>
  );
};

