"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FloatingShapes, MarqueeBanner, Sticker, BrutalistCard, BrutalistButton, HighlightText } from '@/components/ui/RetroElements';
import { 
  FileText, 
  Users, 
  Video, 
  MessageSquare, 
  Zap, 
  ArrowRight,
  Sparkles,
  Shield,
  Clock,
  Heart,
  Star,
  Rocket,
  Coffee
} from 'lucide-react';

// Fun floating text stickers that appear randomly
function FunStickers() {
  const stickers = [
    { text: "FREE FOREVER! 🎉", top: "15%", left: "5%", rotate: "-12deg", variant: "yellow" as const },
    { text: "NO CC REQUIRED", top: "25%", right: "8%", rotate: "8deg", variant: "mint" as const },
    { text: "OPEN SOURCE 💜", top: "55%", left: "3%", rotate: "5deg", variant: "orange" as const },
    { text: "REAL-TIME SYNC ⚡", top: "70%", right: "5%", rotate: "-6deg", variant: "yellow" as const },
    { text: "SUPER FAST!", bottom: "20%", left: "8%", rotate: "10deg", variant: "mint" as const },
    { text: "100% SECURE 🔒", bottom: "35%", right: "3%", rotate: "-8deg", variant: "yellow" as const },
  ];

  return (
    <>
      {stickers.map((sticker, i) => (
        <div
          key={i}
          className="hidden lg:block fixed z-20 animate-float-slow pointer-events-none"
          style={{
            top: sticker.top,
            left: sticker.left,
            right: sticker.right,
            bottom: sticker.bottom,
            transform: `rotate(${sticker.rotate})`,
            animationDelay: `${i * 0.5}s`,
          }}
        >
          <Sticker variant={sticker.variant}>{sticker.text}</Sticker>
        </div>
      ))}
    </>
  );
}

export default function HomePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const features = [
    {
      icon: FileText,
      title: 'Documents',
      description: 'Create and collaborate on documents in real-time',
      color: 'yellow' as const,
    },
    {
      icon: Users,
      title: 'Workspaces',
      description: 'Organize teams and projects efficiently',
      color: 'white' as const,
    },
    {
      icon: Video,
      title: 'Video Calls',
      description: 'HD video meetings with screen sharing',
      color: 'yellow' as const,
    },
    {
      icon: MessageSquare,
      title: 'Real-time Chat',
      description: 'Instant messaging with typing indicators',
      color: 'white' as const,
    },
  ];

  const stats = [
    { number: '10K+', label: 'Active Users' },
    { number: '50K+', label: 'Documents Created' },
    { number: '99.9%', label: 'Uptime' },
    { number: '24/7', label: 'Support' },
  ];

  return (
    <div className="min-h-screen bg-[#FFF8E7] grid-pattern relative overflow-hidden">
      {/* Floating Background Shapes */}
      <FloatingShapes />
      
      {/* Fun Floating Stickers */}
      <FunStickers />

      {/* Marquee Banner */}
      <MarqueeBanner text="CollabSpace — Your All-in-One Collaboration Platform" />

      {/* Navigation */}
      <nav className="relative z-10 border-b-4 border-black bg-[#FFF8E7]">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-12 h-12 bg-[#FFE500] border-3 border-black flex items-center justify-center transform group-hover:rotate-6 transition-transform" style={{ borderWidth: '3px' }}>
                <Zap className="w-7 h-7 text-black" />
              </div>
              <span className="text-2xl font-black text-black tracking-tight">
                CollabSpace
              </span>
            </Link>

            <div className="flex items-center space-x-4">
              <Link href="/login">
                <BrutalistButton variant="ghost" size="sm">
                  Login
                </BrutalistButton>
              </Link>
              <Link href="/register">
                <BrutalistButton variant="orange" size="sm">
                  Get Started
                </BrutalistButton>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            {/* Stickers */}
            <div className="flex justify-center gap-4 mb-8">
              <Sticker variant="mint" className={mounted ? 'animate-slide-up' : 'opacity-0'}>
                ✨ New Features
              </Sticker>
              <Sticker variant="orange" className={mounted ? 'animate-slide-up delay-100' : 'opacity-0'}>
                🚀 Just Launched
              </Sticker>
            </div>

            {/* Main Title */}
            <h1 className={`text-6xl md:text-8xl font-black text-black mb-6 leading-none ${mounted ? 'animate-slide-up delay-200' : 'opacity-0'}`}>
              <span className="inline-block bg-[#FFE500] px-4 py-2 transform -rotate-1 border-4 border-black">
                COLLAB
              </span>
              <br />
              <span className="inline-block mt-2">SPACE</span>
            </h1>

            {/* Subtitle */}
            <div className={`mb-8 ${mounted ? 'animate-slide-up delay-300' : 'opacity-0'}`}>
              <BrutalistCard variant="white" className="inline-block px-6 py-4 transform rotate-1">
                <p className="text-xl md:text-2xl font-bold text-black flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-[#FF6B35]" />
                  Work Together, Create Together
                  <Sparkles className="w-6 h-6 text-[#FF6B35]" />
                </p>
              </BrutalistCard>
            </div>

            {/* Description */}
            <p className={`text-lg text-black/70 max-w-2xl mx-auto mb-10 ${mounted ? 'animate-slide-up delay-400' : 'opacity-0'}`}>
              The <HighlightText color="yellow">all-in-one platform</HighlightText> for teams to 
              collaborate on documents, communicate in real-time, and connect via 
              <HighlightText color="mint">video calls</HighlightText> — all in one place.
            </p>

            {/* CTA Buttons */}
            <div className={`flex flex-wrap justify-center gap-4 ${mounted ? 'animate-slide-up delay-500' : 'opacity-0'}`}>
              <Link href="/register">
                <BrutalistButton variant="orange" size="lg" className="flex items-center gap-2">
                  Get Started Free
                  <ArrowRight className="w-5 h-5" />
                </BrutalistButton>
              </Link>
              <Link href="/login">
                <BrutalistButton variant="yellow" size="lg">
                  I Have An Account
                </BrutalistButton>
              </Link>
            </div>

            {/* Fun badges below CTA */}
            <div className={`mt-8 flex flex-wrap justify-center gap-3 ${mounted ? 'animate-slide-up delay-700' : 'opacity-0'}`}>
              <div className="flex items-center gap-2 px-3 py-1 bg-white border-2 border-black text-sm font-bold">
                <Heart className="w-4 h-4 text-red-500" /> Loved by 10K+ teams
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-white border-2 border-black text-sm font-bold">
                <Star className="w-4 h-4 text-yellow-500" /> 4.9/5 rating
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-white border-2 border-black text-sm font-bold">
                <Coffee className="w-4 h-4 text-brown-500" /> Made with love
              </div>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-20">
            {features.map((feature, index) => (
              <BrutalistCard 
                key={feature.title} 
                variant={feature.color}
                tilt={index % 2 === 0}
                className={`p-6 ${mounted ? 'animate-slide-up' : 'opacity-0'}`}
                style={{ animationDelay: `${600 + index * 100}ms` } as React.CSSProperties}
              >
                <div className="w-14 h-14 bg-black flex items-center justify-center mb-4">
                  <feature.icon className="w-7 h-7 text-[#FFE500]" />
                </div>
                <h3 className="text-xl font-black mb-2 text-black">{feature.title}</h3>
                <p className="text-black/70">{feature.description}</p>
              </BrutalistCard>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section - High contrast with white text on black */}
      <section className="relative z-10 py-16 bg-black border-y-4 border-black">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div 
                key={stat.label} 
                className={`text-center ${mounted ? 'animate-slide-up' : 'opacity-0'}`}
                style={{ animationDelay: `${1000 + index * 100}ms` } as React.CSSProperties}
              >
                <div className="text-5xl font-black text-[#FFE500] mb-2">{stat.number}</div>
                <div className="text-white font-bold uppercase tracking-wider text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="relative z-10 py-20 px-6 bg-[#FFF8E7]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Sticker variant="yellow" className="mb-6">Why CollabSpace?</Sticker>
            <h2 className="text-4xl md:text-6xl font-black text-black">
              Built for{' '}
              <span className="inline-block bg-[#FF6B35] text-white px-4 py-1 transform rotate-1">
                Modern Teams
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <BrutalistCard variant="white" className="p-8">
              <div className="w-16 h-16 bg-[#FFE500] border-3 border-black flex items-center justify-center mb-6" style={{ borderWidth: '3px' }}>
                <Zap className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-2xl font-black mb-4 text-black">Lightning Fast</h3>
              <p className="text-black/70">
                Real-time collaboration with instant sync across all devices. No lag, no delays.
              </p>
            </BrutalistCard>

            <BrutalistCard variant="yellow" className="p-8 transform rotate-1">
              <div className="w-16 h-16 bg-black flex items-center justify-center mb-6">
                <Shield className="w-8 h-8 text-[#FFE500]" />
              </div>
              <h3 className="text-2xl font-black mb-4 text-black">Enterprise Security</h3>
              <p className="text-black/80">
                End-to-end encryption and compliance with industry standards.
              </p>
            </BrutalistCard>

            <BrutalistCard variant="white" className="p-8">
              <div className="w-16 h-16 bg-[#00D9A5] border-3 border-black flex items-center justify-center mb-6" style={{ borderWidth: '3px' }}>
                <Clock className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-2xl font-black mb-4 text-black">24/7 Availability</h3>
              <p className="text-black/70">
                Access your work anywhere, anytime. Cloud-based and always available.
              </p>
            </BrutalistCard>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20 px-6 bg-[#FFE500] border-y-4 border-black">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block mb-4">
            <Sticker variant="orange">🚀 Join Now</Sticker>
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-black mb-6">
            Ready to Collaborate?
          </h2>
          <p className="text-xl text-black/70 mb-10">
            Join thousands of teams already using CollabSpace to do their best work.
          </p>
          <Link href="/register">
            <BrutalistButton variant="black" size="lg" className="text-lg">
              Start Free Trial — No Credit Card Required
            </BrutalistButton>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-12 px-6 bg-black border-t-4 border-black">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-[#FFE500] border-2 border-white flex items-center justify-center">
                <Zap className="w-6 h-6 text-black" />
              </div>
              <span className="text-xl font-black text-white">CollabSpace</span>
            </div>

            <div className="flex items-center gap-4">
              {['GitHub', 'Discord', 'Twitter', 'LinkedIn'].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="w-10 h-10 bg-white border-2 border-white flex items-center justify-center text-black font-bold text-sm hover:bg-[#FFE500] transition-colors"
                >
                  {social[0]}
                </a>
              ))}
            </div>

            <p className="text-white/60 text-sm">
              <Sticker variant="orange">CollabSpace</Sticker>
              {' '}© {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </footer>

      {/* Bottom Marquee */}
      <MarqueeBanner text="Start Collaborating Today — Free Forever for Small Teams" />
    </div>
  );
}
