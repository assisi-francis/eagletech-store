'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Mail, Lock, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';

export default function AuthPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    try {
      const trimmedEmail = email.trim();
      const trimmedFullName = fullName.trim();

      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ 
          email: trimmedEmail, 
          password 
        });
        if (error) throw error;
        router.push('/');
      } else {
        const { error } = await supabase.auth.signUp({
          email: trimmedEmail,
          password,
          options: {
            data: { full_name: trimmedFullName },
          },
        });
        if (error) throw error;
        alert('Registration successful! Please check your email to verify your account if required, or simply log in.');
        setIsLogin(true);
      }
    } catch (error: any) {
      setErrorMsg(error.message || 'An error occurred during authentication.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuth = async (provider: 'google' | 'github') => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });
      if (error) throw error;
    } catch (error: any) {
      setErrorMsg(error.message || `An error occurred with ${provider} sign in.`);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-8 bg-card p-8 rounded-3xl shadow-2xl border border-border/50 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-cyan-500/5 pointer-events-none" />
        
        <div className="relative">
          <div className="flex justify-center">
            {/* Logo */}
            <div className="relative w-16 h-16 bg-slate-950 dark:bg-black rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.5)] border border-blue-500/30 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 opacity-50" />
              <div className="relative flex items-center justify-center w-full h-full">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-slate-200 relative z-10 drop-shadow-[0_0_5px_rgba(255,255,255,0.3)]">
                  <rect x="2" y="5" width="20" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.5" fill="rgba(0, 0, 0, 0.4)" />
                  <path d="M1 18h22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M10 18h4" stroke="#64748b" strokeWidth="2" strokeLinecap="round" />
                </svg>
                <span className="absolute z-20 text-[18px] scale-x-[-1] -mt-1.5 drop-shadow-[0_0_2px_rgba(255,255,255,0.5)]">
                  🦅
                </span>
              </div>
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-foreground tracking-tight">
            {isLogin ? 'Welcome back' : 'Create an account'}
          </h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              onClick={() => setIsLogin(!isLogin)} 
              className="font-bold text-primary hover:text-primary/80 transition-colors"
            >
              {isLogin ? 'Sign up' : 'Log in'}
            </button>
          </p>
        </div>

        <div className="mt-8 space-y-6 relative">
          
          {errorMsg && (
            <div className="p-3 rounded-xl bg-destructive/10 text-destructive text-sm font-medium border border-destructive/20 text-center">
              {errorMsg}
            </div>
          )}

          {/* Social Logins */}
          <div className="space-y-3">
            <Button 
              onClick={() => handleOAuth('google')}
              variant="outline" 
              className="w-full py-6 flex items-center justify-center gap-3 bg-white text-slate-900 hover:bg-slate-50 border-slate-200 rounded-xl transition-all"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              <span className="font-semibold text-[15px]">Continue with Google</span>
            </Button>
            <Button 
              onClick={() => handleOAuth('github')}
              variant="outline" 
              className="w-full py-6 flex items-center justify-center gap-3 rounded-xl transition-all"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              <span className="font-semibold text-[15px]">Continue with GitHub</span>
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-card text-muted-foreground">or continue with email</span>
            </div>
          </div>

          {/* Email Form */}
          <form className="space-y-4" onSubmit={handleAuth}>
            {!isLogin && (
              <div className="group">
                <label className="block text-sm font-medium text-foreground mb-1.5 ml-1">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                    <User className="h-5 w-5" />
                  </div>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="block w-full pl-11 pr-4 py-3 border border-border/60 rounded-xl bg-background/50 text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                    placeholder="John Doe"
                  />
                </div>
              </div>
            )}
            
            <div className="group">
              <label className="block text-sm font-medium text-foreground mb-1.5 ml-1">Email address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3 border border-border/60 rounded-xl bg-background/50 text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div className="group">
              <label className="block text-sm font-medium text-foreground mb-1.5 ml-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3 border border-border/60 rounded-xl bg-background/50 text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {isLogin && (
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center">
                  <input id="remember-me" type="checkbox" className="h-4 w-4 rounded border-border text-primary focus:ring-primary" />
                  <label htmlFor="remember-me" className="ml-2 block text-sm font-medium text-muted-foreground">
                    Remember me
                  </label>
                </div>
                <div className="text-sm">
                  <a href="#" className="font-bold text-primary hover:text-primary/80 transition-colors">
                    Forgot password?
                  </a>
                </div>
              </div>
            )}

            <Button disabled={isLoading} type="submit" className="w-full py-6 mt-2 text-[15px] font-bold rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
              {isLoading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
