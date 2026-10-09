import React, { useState } from 'react';
import { Star, Lock, Mail, User, MapPin, ArrowRight, AlertCircle, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const RegisterPage = ({ onNavigateToLogin }) => {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Validations per PDF specifications
  const nameTrimmed = formData.name.trim();
  const nameValid = nameTrimmed.length >= 20 && nameTrimmed.length <= 60;
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const emailValid = emailRegex.test(formData.email.trim());

  const addressTrimmed = formData.address.trim();
  const addressValid = addressTrimmed.length > 0 && addressTrimmed.length <= 400;

  const passwordLengthValid = formData.password.length >= 8 && formData.password.length <= 16;
  const passwordUpperValid = /[A-Z]/.test(formData.password);
  const passwordSpecialValid = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(formData.password);
  const passwordValid = passwordLengthValid && passwordUpperValid && passwordSpecialValid;

  const isFormValid = nameValid && emailValid && addressValid && passwordValid;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!isFormValid) {
      setError('Please resolve all validation errors before registering.');
      return;
    }

    setLoading(true);
    try {
      await register(formData);
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-50 py-10">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-500/25 mb-4">
            <Star className="w-7 h-7 fill-white" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Create Normal User Account
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Sign up to browse and submit ratings for local stores
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-sm text-red-700">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-red-500" />
                <span>{error}</span>
              </div>
            )}

            {/* Name field */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-600 uppercase">
                  Full Name
                </label>
                <span className={`text-[11px] font-medium ${nameValid ? 'text-emerald-600' : 'text-slate-400'}`}>
                  {nameTrimmed.length}/20-60 chars
                </span>
              </div>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="e.g. Johnathan Alexander Doe Senior (min 20 chars)"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm transition focus:outline-none focus:ring-2 ${
                    formData.name && !nameValid
                      ? 'border-amber-300 focus:ring-amber-400/20 focus:border-amber-500'
                      : 'border-slate-200 focus:ring-blue-500/20 focus:border-blue-600'
                  }`}
                />
              </div>
              {formData.name && !nameValid && (
                <p className="text-[11px] text-amber-600 mt-1">
                  Name must be between 20 and 60 characters (currently {nameTrimmed.length})
                </p>
              )}
            </div>

            {/* Email field */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  placeholder="john.doe@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition text-sm"
                />
              </div>
            </div>

            {/* Address field */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-600 uppercase">
                  Address
                </label>
                <span className={`text-[11px] font-medium ${addressValid ? 'text-emerald-600' : 'text-slate-400'}`}>
                  {addressTrimmed.length}/400 max
                </span>
              </div>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <textarea
                  rows={2}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required
                  placeholder="Street, City, State, Postal Code (max 400 characters)"
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition text-sm resize-none"
                />
              </div>
            </div>

            {/* Password field */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  placeholder="8-16 characters"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition text-sm"
                />
              </div>
            </div>

            {/* Requirements Checklist */}
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-1.5 text-xs">
              <p className="font-semibold text-slate-700 mb-1">Required Form Specifications:</p>
              
              <div className="flex items-center gap-2">
                <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[10px] ${nameValid ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'}`}>
                  {nameValid ? '✓' : '•'}
                </span>
                <span className={nameValid ? 'text-emerald-700 font-medium' : 'text-slate-500'}>
                  Name between 20 and 60 characters
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[10px] ${passwordLengthValid ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'}`}>
                  {passwordLengthValid ? '✓' : '•'}
                </span>
                <span className={passwordLengthValid ? 'text-emerald-700 font-medium' : 'text-slate-500'}>
                  Password: 8 to 16 characters
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[10px] ${passwordUpperValid ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'}`}>
                  {passwordUpperValid ? '✓' : '•'}
                </span>
                <span className={passwordUpperValid ? 'text-emerald-700 font-medium' : 'text-slate-500'}>
                  Password: at least 1 uppercase letter (A-Z)
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[10px] ${passwordSpecialValid ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'}`}>
                  {passwordSpecialValid ? '✓' : '•'}
                </span>
                <span className={passwordSpecialValid ? 'text-emerald-700 font-medium' : 'text-slate-500'}>
                  Password: at least 1 special character (!@#$%...)
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={!isFormValid || loading}
              className="w-full py-3 px-4 rounded-xl font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-blue-500/20 transition flex items-center justify-center gap-2"
            >
              <span>{loading ? 'Registering...' : 'Complete Sign Up'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-500">
            Already registered?{' '}
            <button
              type="button"
              onClick={onNavigateToLogin}
              className="font-semibold text-blue-600 hover:text-blue-700 underline"
            >
              Sign In to your account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
