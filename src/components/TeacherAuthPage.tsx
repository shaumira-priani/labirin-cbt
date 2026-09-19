import React, { useState } from 'react';
import { LogIn, UserPlus, GraduationCap, Loader2 } from 'lucide-react';
import { registerTeacher, loginTeacher } from '../services/customExamService';

interface Props {
  onAuthed: () => void;
  onBack: () => void;
}

export const TeacherAuthPage: React.FC<Props> = ({ onAuthed, onBack }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (mode === 'register') {
        if (!name.trim()) throw new Error('Nama wajib diisi');
        await registerTeacher(name.trim(), email.trim(), password);
      } else {
        await loginTeacher(email.trim(), password);
      }
      onAuthed();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Terjadi kesalahan';
      // Firebase error codes are verbose; surface the common ones nicely.
      if (msg.includes('auth/email-already-in-use')) setError('Email sudah terdaftar. Coba login.');
      else if (msg.includes('auth/invalid-credential') || msg.includes('auth/wrong-password')) setError('Email atau password salah.');
      else if (msg.includes('auth/weak-password')) setError('Password minimal 6 karakter.');
      else if (msg.includes('auth/user-not-found')) setError('Akun belum terdaftar. Coba daftar dulu.');
      else setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4">
      <button onClick={onBack} className="text-sm text-stone-500 hover:text-stone-700 mb-6">
        &larr; Kembali
      </button>

      <div className="bg-white border border-stone-200 rounded-2xl p-8 shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <GraduationCap className="w-6 h-6 text-emerald-700" />
          <h1 className="text-xl font-bold text-stone-900">Portal Guru</h1>
        </div>

        <div className="flex gap-2 mb-6 bg-stone-100 p-1 rounded-xl">
          <button
            onClick={() => setMode('login')}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
              mode === 'login' ? 'bg-white shadow-sm text-emerald-800' : 'text-stone-500'
            }`}
          >
            Masuk
          </button>
          <button
            onClick={() => setMode('register')}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
              mode === 'register' ? 'bg-white shadow-sm text-emerald-800' : 'text-stone-500'
            }`}
          >
            Daftar
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">Nama Lengkap</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                placeholder="Nama Anda"
              />
            </div>
          )}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
              placeholder="guru@sekolah.sch.id"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">Password</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
              placeholder="Minimal 6 karakter"
            />
          </div>

          {error && <p className="text-sm text-rose-600 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-2.5 rounded-xl transition-colors disabled:opacity-60"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : mode === 'login' ? <LogIn className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
            {mode === 'login' ? 'Masuk' : 'Daftar Akun Guru'}
          </button>
        </form>
      </div>
    </div>
  );
};
