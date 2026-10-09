import React, { useState } from 'react';
import { X, Lock, Check, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const ChangePasswordModal = ({ isOpen, onClose }) => {
  const { updatePassword } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!isOpen) return null;

  // Validation rules
  const lengthValid = newPassword.length >= 8 && newPassword.length <= 16;
  const uppercaseValid = /[A-Z]/.test(newPassword);
  const specialValid = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPassword);
  const matchValid = newPassword.length > 0 && newPassword === confirmPassword;
  const isFormValid = lengthValid && uppercaseValid && specialValid && matchValid && currentPassword.length > 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!isFormValid) {
      setError('Please satisfy all password requirements');
      return;
    }

    setLoading(true);
    try {
      await updatePassword(currentPassword, newPassword);
      setSuccess('Password updated successfully!');
      setTimeout(() => {
        onClose();
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setSuccess('');
      }, 1500);
    } catch (err) {
      setError(err.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-b border-slate-100">
          <div className="flex items-center gap-2 text-slate-800 font-semibold">
            <Lock className="w-5 h-5 text-blue-600" />
            <span>Update Password</span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg hover:bg-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-sm text-red-700">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-2.5 text-sm text-emerald-700">
              <Check className="w-4 h-4 mt-0.5 shrink-0 text-emerald-500" />
              <span>{success}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">
              Current Password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              placeholder="Enter current password"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              placeholder="8-16 characters"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Re-enter new password"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition text-sm"
            />
          </div>

          {/* Real-time Validation Hints */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-1.5 text-xs">
            <p className="font-semibold text-slate-600 mb-1">Password Requirements:</p>
            <div className="flex items-center gap-2">
              <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[10px] ${lengthValid ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'}`}>
                {lengthValid ? '✓' : '•'}
              </span>
              <span className={lengthValid ? 'text-emerald-700 font-medium' : 'text-slate-500'}>
                8 to 16 characters
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[10px] ${uppercaseValid ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'}`}>
                {uppercaseValid ? '✓' : '•'}
              </span>
              <span className={uppercaseValid ? 'text-emerald-700 font-medium' : 'text-slate-500'}>
                At least 1 uppercase letter (A-Z)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[10px] ${specialValid ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'}`}>
                {specialValid ? '✓' : '•'}
              </span>
              <span className={specialValid ? 'text-emerald-700 font-medium' : 'text-slate-500'}>
                At least 1 special character (!@#$%^&*...)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[10px] ${matchValid ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'}`}>
                {matchValid ? '✓' : '•'}
              </span>
              <span className={matchValid ? 'text-emerald-700 font-medium' : 'text-slate-500'}>
                Passwords match
              </span>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isFormValid || loading}
              className="px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-sm transition"
            >
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
