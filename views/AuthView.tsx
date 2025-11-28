
import React, { useState } from 'react';
import { ViewState, User } from '../types';
import { Zap, Mail, Lock, CheckCircle, Loader2, ArrowLeft, Eye, EyeOff, ShieldCheck } from 'lucide-react';

interface Props {
  viewState: ViewState.LOGIN | ViewState.SIGNUP;
  onLogin: (user: User) => void;
  onChangeView: (view: ViewState) => void;
}

const AuthView: React.FC<Props> = ({ viewState, onLogin, onChangeView }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const isLogin = viewState === ViewState.LOGIN;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    if (!isLogin && !agreedToTerms) { alert("Please agree to the Terms of Service."); return; }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLogin({ name: email.split('@')[0], email, plan: 'Free', searchesLeft: 5, aiCreditsLeft: 50, isNewUser: !isLogin });
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-[440px] w-full space-y-8">
        <div className="flex justify-center flex-col items-center">
             <div className="p-3 bg-orange-600 rounded-xl shadow-lg shadow-orange-600/20 mb-4"><Zap className="w-8 h-8 text-white fill-white" /></div>
             <h2 className="text-3xl font-black text-slate-900 tracking-tight text-center">{isLogin ? 'Welcome back' : 'Create your account'}</h2>
             <p className="text-slate-500 mt-2 text-center">{isLogin ? 'Enter your details to access your dashboard.' : 'Start your free SEO journey today.'}</p>
        </div>

        <div className="bg-white px-10 py-10 rounded-2xl shadow-xl border border-slate-100">
            <button type="button" onClick={() => handleSubmit({ preventDefault: () => {} } as any)} className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-slate-200 rounded-xl bg-white text-base font-bold text-slate-700 hover:bg-slate-50 transition-all hover:border-slate-300 mb-6">
                <svg className="h-5 w-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                Sign in with Google
            </button>
            <div className="relative flex items-center py-2 mb-6"><div className="flex-grow border-t border-slate-200"></div><span className="flex-shrink-0 mx-4 text-slate-400 text-xs font-bold uppercase tracking-wider">Or continue with email</span><div className="flex-grow border-t border-slate-200"></div></div>

            <form className="space-y-5" onSubmit={handleSubmit}>
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Email</label>
                    <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-orange-100 focus:border-orange-500 transition-all font-medium" placeholder="mail@example.com"/>
                </div>
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Password</label>
                    <div className="relative">
                        <input type={showPassword ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-orange-100 focus:border-orange-500 transition-all font-medium pr-10" placeholder="••••••••"/>
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600"><{showPassword ? EyeOff : Eye} className="w-5 h-5" /></button>
                    </div>
                </div>
                {!isLogin && (
                    <div className="flex items-start">
                        <input type="checkbox" required checked={agreedToTerms} onChange={(e) => setAgreedToTerms(e.target.checked)} className="mt-1 w-4 h-4 text-orange-600 border-slate-300 rounded focus:ring-orange-500 cursor-pointer"/>
                        <div className="ml-3 text-sm text-slate-600 font-medium">I agree to the <a href="#" className="text-orange-600 hover:underline">Terms of Service</a> and <a href="#" className="text-orange-600 hover:underline">Privacy Policy</a>.</div>
                    </div>
                )}
                <button type="submit" disabled={loading} className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold shadow-lg transition-all flex items-center justify-center gap-2">
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isLogin ? 'Log In' : 'Create Account')}
                </button>
            </form>
            <div className="mt-6 text-center text-sm font-medium text-slate-600">
                {isLogin ? "Don't have an account?" : "Already have an account?"} 
                <button type="button" onClick={() => onChangeView(isLogin ? ViewState.SIGNUP : ViewState.LOGIN)} className="text-orange-600 hover:text-orange-700 ml-1.5 font-bold hover:underline">{isLogin ? 'Sign up' : 'Log in'}</button>
            </div>
        </div>
        <div className="text-center flex items-center justify-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-widest"><span className="flex items-center gap-1"><ShieldCheck className="w-4 h-4"/> Secure</span><span>•</span><span>Encrypted</span></div>
      </div>
    </div>
  );
};

export default AuthView;
