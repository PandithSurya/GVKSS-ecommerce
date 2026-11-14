import React, { useState } from 'react';
import { ShieldCheck, Lock, Mail, KeyRound, AlertCircle, Loader2 } from 'lucide-react';
import { adminApi } from '../services/adminApi';

interface AdminLoginProps {
  onLoginSuccess: (admin: any) => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('admin@gvkss.org');
  const [password, setPassword] = useState('AdminSecure@2026!');
  const [mfaToken, setMfaToken] = useState('');
  const [showMfa, setShowMfa] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await adminApi.login({
        email,
        password,
        mfaToken: showMfa ? mfaToken : undefined,
      });

      if (res?.data?.admin) {
        onLoginSuccess(res.data.admin);
      } else {
        throw new Error('Authentication failed');
      }
    } catch (err: any) {
      if (err?.message?.includes('MFA') || err?.message?.includes('2FA')) {
        setShowMfa(true);
        setError('Please enter your 6-digit MFA verification code.');
      } else {
        setError(err?.message || 'Invalid administrative credentials');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Subtle organic background glow */}
      <div className="absolute top-0 -left-40 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 -right-40 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md z-10">
        <div className="flex justify-center items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-900/40">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white font-serif">GVKSS Organics</h1>
            <p className="text-xs uppercase tracking-widest text-emerald-400 font-medium">Administrative Console</p>
          </div>
        </div>
        <h2 className="mt-6 text-center text-xl font-medium text-stone-300">
          Sign in to operations & verification desk
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10 px-4 sm:px-0">
        <div className="bg-stone-800/80 backdrop-blur-md py-8 px-6 shadow-2xl rounded-2xl border border-stone-700/60 sm:px-10">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-900/30 border border-red-500/40 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div className="text-sm text-red-200">{error}</div>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300 mb-1.5">
                Staff Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@gvkss.org"
                  className="w-full pl-10 pr-4 py-2.5 bg-stone-900/80 border border-stone-700 rounded-xl text-white placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-stone-900/80 border border-stone-700 rounded-xl text-white placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                />
              </div>
            </div>

            {showMfa && (
              <div className="pt-2 border-t border-stone-700">
                <label className="block text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-1.5">
                  6-Digit Authenticator Token
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    maxLength={6}
                    value={mfaToken}
                    onChange={(e) => setMfaToken(e.target.value)}
                    placeholder="123456"
                    className="w-full pl-10 pr-4 py-2.5 bg-stone-900/80 border border-emerald-600 rounded-xl text-white placeholder-stone-500 tracking-widest text-center font-mono text-base focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 px-4 rounded-xl font-medium text-sm text-white bg-emerald-600 hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-stone-800 transition duration-150 flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/30 disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Verifying Identity...
                </>
              ) : (
                'Secure Staff Login'
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-stone-700/60 text-center">
            <p className="text-xs text-stone-400">
              Authorized Personnel Only. All access and changes are recorded in the security audit ledger.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
