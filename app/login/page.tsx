"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useAuth } from '@/components/providers/AuthProvider';
import { FloatingShapes, MarqueeBanner, Sticker, BrutalistCard, BrutalistButton, HighlightText } from '@/components/ui/RetroElements';
import { Zap, Eye, EyeOff, Github, Chrome, ArrowRight, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [authLoading, isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid email or password');
      } else {
        router.push('/dashboard');
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

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#FFF8E7] flex items-center justify-center">
        <div className="retro-loader"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF8E7] dark:bg-[#0a0a0a] grid-pattern relative overflow-hidden">
      <FloatingShapes />
      
      {/* Marquee */}
      <MarqueeBanner text="Welcome Back — Login to Continue Your Work" />

      {/* Main Content */}
      <div className="relative z-10 min-h-[calc(100vh-48px)] flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Logo */}
          <Link href="/" className="flex items-center justify-center space-x-3 mb-8 group">
            <div className="w-14 h-14 bg-[#FFE500] border-3 border-black flex items-center justify-center transform group-hover:rotate-12 transition-transform" style={{ borderWidth: '3px' }}>
              <Zap className="w-8 h-8 text-black" />
            </div>
            <span className="text-3xl font-black text-black dark:text-white">CollabSpace</span>
          </Link>

          {/* Login Card */}
          <BrutalistCard variant="white" className={`p-8 ${mounted ? 'animate-slide-up' : 'opacity-0'}`}>
            <div className="text-center mb-8">
              <Sticker variant="yellow" className="mb-4">Welcome Back!</Sticker>
              <h1 className="text-3xl font-black text-black mb-2">Login</h1>
              <p className="text-black/60">Enter your credentials to continue</p>
            </div>

            {/* Social Login */}
            <div className="space-y-3 mb-6">
              <button
                onClick={() => handleSocialLogin('google')}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white border-3 border-black font-bold uppercase tracking-wide hover:bg-[#FFE500] transition-colors shadow-[4px_4px_0_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_#000]"
                style={{ borderWidth: '3px' }}
              >
                <Chrome className="w-5 h-5" />
                Continue with Google
              </button>
              <button
                onClick={() => handleSocialLogin('github')}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-black text-white border-3 border-black font-bold uppercase tracking-wide hover:bg-gray-800 transition-colors shadow-[4px_4px_0_#FFE500] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_#FFE500]"
                style={{ borderWidth: '3px' }}
              >
                <Github className="w-5 h-5" />
                Continue with GitHub
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
                    Login <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </BrutalistButton>
            </form>

            {/* Footer */}
            <p className="text-center mt-6 text-black/60">
              Don't have an account?{' '}
              <Link href="/register" className="font-bold text-[#FF6B35] hover:underline">
                Sign up for free!
              </Link>
            </p>
          </BrutalistCard>

          {/* Demo Credentials */}
          <BrutalistCard variant="yellow" tilt className="mt-6 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-black" />
              <span className="font-black text-black">Demo Credentials</span>
            </div>
            <p className="text-black/80 text-sm font-mono">
              Email: demo@collabspace.com<br />
              Password: Demo123!
            </p>
          </BrutalistCard>
        </div>
      </div>
    </div>
  );
}
