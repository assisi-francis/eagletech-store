'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Mail, Lock, User, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export default function AuthPage() {
  const router = useRouter();
  const [view, setView] = useState<'login' | 'signup' | 'forgot' | 'update'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setView('update');
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    try {
      const trimmedEmail = email.trim();
      const trimmedFullName = fullName.trim();

      if (view === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ 
          email: trimmedEmail, 
          password 
        });
        if (error) throw error;
        router.push('/');
      } else if (view === 'signup') {
        const { error } = await supabase.auth.signUp({
          email: trimmedEmail,
          password,
          options: {
            data: { full_name: trimmedFullName },
          }
        });
        if (error) throw error;
        toast.success("Check your email to confirm your account!");
        setView('login');
      } else if (view === 'forgot') {
        const { error } = await supabase.auth.resetPasswordForEmail(trimmedEmail, {
          redirectTo: window.location.origin + '/auth',
        });
        if (error) throw error;
        toast.success("Password reset instructions sent to your email!");
        setView('login');
      } else if (view === 'update') {
        const { error } = await supabase.auth.updateUser({ password });
        if (error) throw error;
        toast.success("Password updated successfully!");
        router.push('/');
      }
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuth = async (provider: 'google' | 'github') => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: window.location.origin,
        }
      });
      if (error) throw error;
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-card rounded-3xl shadow-xl shadow-black/5 border border-border/50 p-8"
      >
        <div className="flex flex-col items-center justify-center">
          <div className="relative group cursor-pointer" onClick={() => router.push('/')}>
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
            <div className="relative w-12 h-12 bg-slate-950 dark:bg-black rounded-xl flex items-center justify-center shadow-sm border border-blue-500/30 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 opacity-50" />
              <span className="absolute z-20 text-[18px] scale-x-[-1] -mt-1.5 drop-shadow-[0_0_2px_rgba(255,255,255,0.5)]">
                🦅
              </span>
            </div>
          </div>
          
          <h2 className="mt-6 text-center text-3xl font-extrabold text-foreground tracking-tight">
            {view === 'login' && 'Welcome back'}
            {view === 'signup' && 'Create an account'}
            {view === 'forgot' && 'Reset Password'}
            {view === 'update' && 'Update Password'}
          </h2>
          
          {(view === 'login' || view === 'signup') && (
            <p className="mt-2 text-center text-sm text-muted-foreground">
              {view === 'login' ? "Don't have an account? " : "Already have an account? "}
              <button 
                onClick={() => setView(view === 'login' ? 'signup' : 'login')} 
                className="font-bold text-primary hover:text-primary/80 transition-colors"
              >
                {view === 'login' ? 'Sign up' : 'Log in'}
              </button>
            </p>
          )}

          {(view === 'forgot' || view === 'update') && (
            <p className="mt-2 text-center text-sm text-muted-foreground">
              {view === 'forgot' ? 'Enter your email to receive a reset link.' : 'Enter your new password below.'}
            </p>
          )}
        </div>

        <div className="mt-8 space-y-6 relative">
          
          {errorMsg && (
            <div className="p-3 rounded-xl bg-destructive/10 text-destructive text-sm font-medium border border-destructive/20 text-center">
              {errorMsg}
            </div>
          )}

          {(view === 'login' || view === 'signup') && (
            <>
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
            </>
          )}

          <form className="space-y-4" onSubmit={handleAuth}>
            {view === 'signup' && (
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
            
            {(view === 'login' || view === 'signup' || view === 'forgot') && (
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
            )}

            {(view === 'login' || view === 'signup' || view === 'update') && (
              <div className="group">
                <label className="block text-sm font-medium text-foreground mb-1.5 ml-1">
                  {view === 'update' ? 'New Password' : 'Password'}
                </label>
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
            )}

            {view === 'login' && (
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center">
                  <input id="remember-me" type="checkbox" className="h-4 w-4 rounded border-border text-primary focus:ring-primary" />
                  <label htmlFor="remember-me" className="ml-2 block text-sm font-medium text-muted-foreground">
                    Remember me
                  </label>
                </div>
                <div className="text-sm">
                  <button 
                    type="button"
                    onClick={() => setView('forgot')} 
                    className="font-bold text-primary hover:text-primary/80 transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
              </div>
            )}

            <Button disabled={isLoading} type="submit" className="w-full py-6 mt-2 text-[15px] font-bold rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
              {isLoading ? 'Processing...' : (
                view === 'login' ? 'Sign In' : 
                view === 'signup' ? 'Create Account' : 
                view === 'forgot' ? 'Send Reset Link' : 
                'Update Password'
              )}
            </Button>

            {(view === 'forgot' || view === 'update') && (
              <Button 
                type="button" 
                variant="ghost" 
                onClick={() => setView('login')}
                className="w-full text-muted-foreground hover:text-foreground mt-2"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to login
              </Button>
            )}
          </form>
        </div>
      </motion.div>
    </div>
  );
}
