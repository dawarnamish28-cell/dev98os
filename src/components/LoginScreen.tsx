import React, { useState } from 'react';
import * as Icons from 'lucide-react';

interface LoginScreenProps {
  onLogin: (username: string) => void;
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username.trim()) {
      setError('Please enter a username.');
      return;
    }
    if (!password.trim()) {
      setError('Please enter a password.');
      return;
    }
    if (mode === 'signup' && password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 3) {
      setError('Password must be at least 3 characters.');
      return;
    }

    onLogin(username.trim());
  };

  return (
    <div className="w-full h-full bg-[#008080] flex items-center justify-center relative scanlines">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'repeating-linear-gradient(transparent 0, transparent 1px, rgba(0,0,0,0.04) 1px, rgba(0,0,0,0.04) 2px)',
        }}
      />

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 10% 90%, rgba(45,90,39,0.15) 0%, transparent 50%),
                       radial-gradient(ellipse at 90% 10%, rgba(26,122,109,0.12) 0%, transparent 50%),
                       radial-gradient(ellipse at 50% 100%, rgba(198,168,75,0.08) 0%, transparent 40%)`,
        }}
      />

      <div className="relative z-10 flex flex-col items-center">
        <div className="mb-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-16 h-16 bg-gradient-to-br from-[#2d5a27] via-[#1a7a6d] to-[#000080] border-2 border-white border-r-[#404040] border-b-[#404040] shadow-[inset_1px_1px_0_#dfdfdf,inset_-1px_-1px_0_#808080] flex items-center justify-center">
              <span className="text-white text-2xl font-bold font-pixel">98</span>
            </div>
          </div>
          <h1 className="text-white text-3xl font-bold font-pixel tracking-wider" style={{ textShadow: '2px 2px 0 #000080' }}>
            Dev98
          </h1>
          <p className="text-[#a0d8c8] text-xs mt-1" style={{ textShadow: '1px 1px 0 rgba(0,0,0,0.5)' }}>
            A Solarpunk WebOS Experience
          </p>
        </div>

        <div className="bg-[#c0c0c0] border-2 border-white border-r-[#404040] border-b-[#404040] shadow-[inset_1px_1px_0_#dfdfdf,inset_-1px_-1px_0_#808080] w-[360px]">
          <div className="bg-gradient-to-r from-[#000080] to-[#1084d0] h-[22px] flex items-center px-2">
            <Icons.LogIn size={12} className="text-white mr-1" />
            <span className="text-white text-[12px] font-bold">
              {mode === 'login' ? 'Welcome to Dev98' : 'Create Account'}
            </span>
          </div>

          <div className="p-4">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 bg-white border-2 border-[#808080] border-r-white border-b-white shadow-[inset_1px_1px_0_#404040] flex items-center justify-center shrink-0">
                <Icons.User size={24} className="text-[#000080]" />
              </div>
              <p className="text-[11px] text-black leading-relaxed">
                {mode === 'login'
                  ? 'Type a user name and password to log on to Dev98.'
                  : 'Create a new account to start using Dev98.'}
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="space-y-3">
                <div className="flex items-center">
                  <label className="text-[11px] w-[90px] text-right pr-2">User name:</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="win98-input flex-1 h-[22px]"
                    autoFocus
                  />
                </div>
                <div className="flex items-center">
                  <label className="text-[11px] w-[90px] text-right pr-2">Password:</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="win98-input flex-1 h-[22px]"
                  />
                </div>
                {mode === 'signup' && (
                  <div className="flex items-center">
                    <label className="text-[11px] w-[90px] text-right pr-2">Confirm:</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="win98-input flex-1 h-[22px]"
                    />
                  </div>
                )}
              </div>

              {error && (
                <div className="mt-2 flex items-center gap-1 text-[11px]">
                  <Icons.AlertTriangle size={12} className="text-red-700" />
                  <span className="text-red-700">{error}</span>
                </div>
              )}

              <div className="flex justify-end gap-2 mt-4">
                <button type="submit" className="win98-btn font-bold">
                  {mode === 'login' ? 'OK' : 'Sign Up'}
                </button>
                <button
                  type="button"
                  className="win98-btn"
                  onClick={() => {
                    setMode(mode === 'login' ? 'signup' : 'login');
                    setError('');
                    setConfirmPassword('');
                  }}
                >
                  {mode === 'login' ? 'New User' : 'Back'}
                </button>
              </div>
            </form>
          </div>
        </div>

        <p className="text-[10px] text-[#80c0b0] mt-4" style={{ textShadow: '1px 1px 0 rgba(0,0,0,0.3)' }}>
          Dev98 v1.0 -- Built for Hackathon 2026
        </p>
      </div>
    </div>
  );
}
