import React, { useState } from 'react';
import { Star, Lock, Mail, ArrowRight, ShieldCheck, UserCheck, Store, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginPage = ({ onNavigateToRegister }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAccount = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-50">
      <div className="w-full max-w-md">
        {/* Brand Card */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-500/25 mb-4">
            <Star className="w-7 h-7 fill-white" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Store Rating Platform
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Single unified sign-in for Administrators, Normal Users, and Store Owners
          </p>
        </div>

        {/* Login Box */}
        <div className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-sm text-red-700">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-red-500" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-md shadow-blue-500/20 transition flex items-center justify-center gap-2"
            >
              <span>{loading ? 'Signing in...' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Logins for Testing */}
          <div className="mt-8 pt-6 border-t border-slate-100">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 text-center mb-3">
              ⚡ Quick Demo 1-Click Fill
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => fillDemoAccount('admin@storerating.com', 'Admin@123')}
                className="flex flex-col items-center p-2 rounded-xl border border-purple-200 bg-purple-50 hover:bg-purple-100 transition text-center"
              >
                <ShieldCheck className="w-4 h-4 text-purple-600 mb-1" />
                <span className="text-[11px] font-bold text-purple-900 leading-tight">Admin</span>
              </button>

              <button
                type="button"
                onClick={() => fillDemoAccount('johnathan.doe@example.com', 'User@123')}
                className="flex flex-col items-center p-2 rounded-xl border border-blue-200 bg-blue-50 hover:bg-blue-100 transition text-center"
              >
                <UserCheck className="w-4 h-4 text-blue-600 mb-1" />
                <span className="text-[11px] font-bold text-blue-900 leading-tight">Normal User</span>
              </button>

              <button
                type="button"
                onClick={() => fillDemoAccount('michael.davies@stores.com', 'Owner@123')}
                className="flex flex-col items-center p-2 rounded-xl border border-amber-200 bg-amber-50 hover:bg-amber-100 transition text-center"
              >
                <Store className="w-4 h-4 text-amber-600 mb-1" />
                <span className="text-[11px] font-bold text-amber-900 leading-tight">Store Owner</span>
              </button>
            </div>
          </div>

          {/* Registration link for Normal Users */}
          <div className="mt-6 text-center text-xs text-slate-500">
            Need an account?{' '}
            <button
              type="button"
              onClick={onNavigateToRegister}
              className="font-semibold text-blue-600 hover:text-blue-700 underline"
            >
              Sign up as a Normal User
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
