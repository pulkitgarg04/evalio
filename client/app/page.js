"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, BookOpen, Users, PieChart, LogOut, Loader2 } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/auth/me`, {
          credentials: 'include',
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        }
      } catch (err) {
        console.error('Auth check failed:', err);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      setUser(null);
    } catch (err) {
      console.error('Logout failed:', err);
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      <nav className="absolute top-0 w-full z-50 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-extrabold tracking-tight text-white hover:opacity-90 transition-opacity">Evalio</span>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-6 text-emerald-100 text-sm font-medium">
              <Link href="#" className="hover:text-white transition-colors">Features</Link>
            </div>
            <div className="flex items-center gap-3">
              {loading ? (
                <div className="px-4 py-2">
                  <Loader2 className="animate-spin text-white" size={20} />
                </div>
              ) : user ? (
                <>
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white hover:text-emerald-200 transition-colors"
                  >
                    <div className="h-8 w-8 rounded-full bg-[#fcd34d] text-emerald-950 flex items-center justify-center font-bold text-sm">
                      {user.username?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <span className="hidden sm:inline">{user.username}</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="px-4 py-2.5 text-sm font-bold text-white bg-white/10 hover:bg-white/20 rounded-lg transition-all flex items-center gap-2 disabled:opacity-50"
                  >
                    {loggingOut ? (
                      <Loader2 className="animate-spin" size={16} />
                    ) : (
                      <LogOut size={16} />
                    )}
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="px-4 py-2 text-sm font-bold text-white hover:text-emerald-200 transition-colors">Log in</Link>
                  <Link href="/signup" className="px-5 py-2.5 text-sm font-bold text-emerald-950 bg-[#fcd34d] rounded-lg hover:bg-[#fbbf24] transition-all">Sign up</Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-64 bg-[#0a3a30] overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>

        <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-emerald-500/20 rounded-full blur-[100px] opacity-40"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-teal-400/10 rounded-full blur-[100px] opacity-30"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-left">
            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-white mb-8 leading-[1.1]">
              Turn your exams <br />
              <span className="text-emerald-200">into success stories.</span>
            </h1>

            <p className="text-xl text-emerald-100/80 mb-10 max-w-lg leading-relaxed">
              The platform for automated assessments, personalized learning paths, and real-time analytics.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link href={user ? "/dashboard" : "/signup"} className="px-8 py-4 rounded-lg bg-[#fcd34d] text-emerald-950 font-bold text-lg hover:bg-[#fbbf24] transition-all flex items-center gap-2">
                {user ? "Go to Dashboard" : "Get Started"} <ArrowRight size={20} />
              </Link>
            </div>
            <p className="mt-6 text-sm text-emerald-100/50">Prepare for FAs, STs and End Term Exams!</p>
          </div>

          <div className="relative">
            <div className="rounded-xl bg-white/10 backdrop-blur-md p-2 border border-white/20 shadow-2xl transform lg:translate-x-12 lg:rotate-[-2deg] hover:rotate-0 transition-all duration-500">
              <div className="bg-white rounded-lg overflow-hidden shadow-inner">
                <div className="bg-gray-50 border-b border-gray-100 p-3 flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <div className="p-6 grid grid-cols-3 gap-6 bg-gray-50/50 min-h-[300px]">
                  <div className="col-span-2 space-y-4">
                    <div className="h-32 bg-emerald-50 rounded-xl border border-emerald-100 p-4 flex gap-4 items-end pb-0">
                      <div className="w-8 h-12 bg-emerald-200 rounded-t"></div>
                      <div className="w-8 h-20 bg-emerald-300 rounded-t"></div>
                      <div className="w-8 h-16 bg-emerald-400 rounded-t"></div>
                      <div className="w-8 h-24 bg-emerald-500 rounded-t"></div>
                    </div>
                    <div className="h-16 bg-white rounded-xl border border-gray-100"></div>
                    <div className="h-16 bg-white rounded-xl border border-gray-100"></div>
                  </div>
                  <div className="col-span-1 space-y-4">
                    <div className="h-full bg-white rounded-xl border border-gray-100 p-4">
                      <div className="w-12 h-12 bg-yellow-100 rounded-full mb-4"></div>
                      <div className="w-full h-2 bg-gray-100 rounded mb-2"></div>
                      <div className="w-2/3 h-2 bg-gray-100 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="bg-white border-b border-gray-100 py-10">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">Made for the students of</p>
          <div className="flex flex-wrap justify-center gap-12 grayscale hover:grayscale-0 transition-all duration-500">
            <img className="h-15" src="/cu-logo.webp" alt="Chitkara University" />
          </div>
        </div>
      </div>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <div className="inline-block px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-sm mb-4">
              Values & Features
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-[#0a3a30] mb-4">Everything you need to succeed</h2>
            <p className="text-lg text-gray-500">
              Powerful features to help you as a student to ace your exams.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
            <FeatureItem
              icon={PieChart}
              title="Detailed Analytics"
              desc="Gain actionable insights into your performance with comprehensive score."
              color="text-blue-600"
            />
            <FeatureItem
              icon={BookOpen}
              title="Diverse Course Content"
              desc="Support for multiple question types for various subjects."
              color="text-purple-600"
            />
            <FeatureItem
              icon={Users}
              title="Leaderboard"
              desc="Track your progress and compete with your peers on the leaderboard."
              color="text-rose-600"
            />
          </div>
        </div>
      </section>

      <footer className="bg-[#022c22] text-white py-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-emerald-200/50">
            <p>© 2026 Evalio Inc. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureItem({ icon: Icon, title, desc, color = "text-emerald-600" }) {
  return (
    <div className="flex flex-col items-center text-center group">
      <div className={`mb-6 ${color} transition-transform duration-300 group-hover:-translate-y-1`}>
        <Icon size={40} strokeWidth={2} />
      </div>
      <h3 className="text-xl font-bold text-[#0a3a30] mb-3">{title}</h3>
      <p className="text-gray-500 leading-relaxed text-sm max-w-sm mx-auto">
        {desc}
      </p>
    </div>
  );
}
