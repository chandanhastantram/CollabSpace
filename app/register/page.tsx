"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { FloatingShapes, Sticker, BrutalistCard, BrutalistButton } from '@/components/ui/RetroElements';
import { Zap, Eye, EyeOff, Github, Chrome, ArrowRight, Check, Rocket, Sparkles } from 'lucide-react';

// Fun floating stickers
function FunStickers() {
  return (
    <>
      <div className="hidden lg:block fixed z-20 top-[15%] left-[3%] animate-float-slow pointer-events-none" style={{ transform: 'rotate(-10deg)' }}>
        <Sticker variant="orange">JOIN US! 🚀</Sticker>
      </div>
      <div className="hidden lg:block fixed z-20 top-[40%] right-[4%] animate-float pointer-events-none" style={{ transform: 'rotate(8deg)' }}>
        <Sticker variant="mint">FREE FOREVER!</Sticker>
      </div>
      <div className="hidden lg:block fixed z-20 bottom-[30%] left-[6%] animate-float-reverse pointer-events-none" style={{ transform: 'rotate(5deg)' }}>
        <Sticker variant="yellow">NO CC REQUIRED</Sticker>
      </div>
      <div className="hidden lg:block fixed z-20 bottom-[20%] right-[8%] animate-float-slow pointer-events-none" style={{ transform: 'rotate(-6deg)' }}>
        <Sticker variant="orange">✨ NEW FEATURES</Sticker>
      </div>
    </>
  );
}

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Registration failed');
      } else {
        const result = await signIn('credentials', {
          email,
          password,
          redirect: false,
        });

        if (result?.ok) {
          router.push('/dashboard');
        } else {
          router.push('/login');
        }
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    signIn(provider, { callbackUrl: '/dashboard' });
  };

  const passwordRequirements = [
    { label: 'At least 8 characters', met: password.length >= 8 },
    { label: 'Contains uppercase', met: /[A-Z]/.test(password) },
    { label: 'Contains lowercase', met: /[a-z]/.test(password) },
    { label: 'Contains number', met: /[0-9]/.test(password) },
  ];

  return (
    <div className="min-h-screen bg-[#FFF8E7] grid-pattern relative overflow-hidden">
      <FloatingShapes />
      <FunStickers />
      
      {/* Header Bar */}
      <div className="relative z-10 py-3 bg-[#FFE500] border-b-4 border-black">
        <div className="text-center text-black font-bold uppercase tracking-wider text-sm flex items-center justify-center gap-2">
          <Rocket className="w-4 h-4" />
          Create Your Free Account
          <Rocket className="w-4 h-4" />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-[calc(100vh-60px)] flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Logo */}
          <Link href="/" className="flex items-center justify-center space-x-3 mb-8 group">
            <div className="w-14 h-14 bg-[#FFE500] border-3 border-black flex items-center justify-center transform group-hover:rotate-12 transition-transform" style={{ borderWidth: '3px' }}>
              <Zap className="w-8 h-8 text-black" />
            </div>
            <span className="text-3xl font-black text-black">CollabSpace</span>
          </Link>

          {/* Register Card */}
          <BrutalistCard variant="white" className={`p-8 ${mounted ? 'animate-slide-up' : 'opacity-0'}`}>
            <div className="text-center mb-8">
              <Sticker variant="orange" className="mb-4">🚀 Join Us!</Sticker>
              <h1 className="text-3xl font-black text-black mb-2">Create Account</h1>
              <p className="text-black/60">Start your collaboration journey</p>
            </div>

            {/* Social Login */}
            <div className="space-y-3 mb-6">
              <button
                onClick={() => handleSocialLogin('google')}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white border-3 border-black font-bold uppercase tracking-wide text-black hover:bg-[#FFE500] transition-colors shadow-[4px_4px_0_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_#000]"
                style={{ borderWidth: '3px' }}
              >
                <Chrome className="w-5 h-5" />
                Sign up with Google
              </button>
              <button
                onClick={() => handleSocialLogin('github')}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-black text-white border-3 border-black font-bold uppercase tracking-wide hover:bg-gray-800 transition-colors shadow-[4px_4px_0_#FFE500] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_#FFE500]"
                style={{ borderWidth: '3px' }}
              >
                <Github className="w-5 h-5" />
                Sign up with GitHub
              </button>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-[3px] bg-black"></div>
              <Sticker variant="mint">OR</Sticker>
              <div className="flex-1 h-[3px] bg-black"></div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-[#FF6B35] text-white border-3 border-black font-bold" style={{ borderWidth: '3px' }}>
                  ⚠️ {error}
                </div>
              )}

              <div>
                <label className="block font-bold uppercase text-sm mb-2 text-black">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="brutalist-input w-full"
                  placeholder="John Doe"
                  required
                />
              </div>

              <div>
                <label className="block font-bold uppercase text-sm mb-2 text-black">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="brutalist-input w-full"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div>
                <label className="block font-bold uppercase text-sm mb-2 text-black">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="brutalist-input w-full pr-12"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-black hover:text-[#FF6B35]"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {/* Password Requirements */}
                <div className="mt-2 grid grid-cols-2 gap-1">
                  {passwordRequirements.map((req) => (
                    <div key={req.label} className={`flex items-center gap-1 text-xs ${req.met ? 'text-[#00D9A5]' : 'text-black/40'}`}>
                      <Check className={`w-3 h-3 ${req.met ? 'opacity-100' : 'opacity-30'}`} />
                      {req.label}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase text-sm mb-2 text-black">Confirm Password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="brutalist-input w-full"
                  placeholder="••••••••"
                  required
                />
              </div>

              <BrutalistButton
                type="submit"
                variant="orange"
                className="w-full flex items-center justify-center gap-2"
                disabled={loading}
              >
                {loading ? (
                  <div className="retro-loader w-5 h-5 border-2"></div>
                ) : (
                  <>
                    Create Account <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </BrutalistButton>
            </form>

            {/* Footer */}
            <p className="text-center mt-6 text-black/60 text-sm">
              By signing up, you agree to our{' '}
              <a href="#" className="font-bold text-black hover:underline">Terms</a>
              {' '}and{' '}
              <a href="#" className="font-bold text-black hover:underline">Privacy Policy</a>
            </p>

            <p className="text-center mt-4 text-black/60">
              Already have an account?{' '}
              <Link href="/login" className="font-bold text-[#FF6B35] hover:underline">
                Login here!
              </Link>
            </p>
          </BrutalistCard>

          {/* Back to Home */}
          <div className="text-center mt-6">
            <Link href="/" className="text-black/60 hover:text-black font-bold">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
