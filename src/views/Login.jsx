import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { AppContext } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Mail, Lock, User, Check, AlertCircle } from 'lucide-react';

const Login = () => {
  const { loginUser, registerUser, triggerToast } = useContext(AppContext);
  const navigate = useNavigate();
  const [authMode, setAuthMode] = useState('signin'); // signin, signup
  const [selectedRole, setSelectedRole] = useState('intern'); // admin, mentor, intern
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmailVal, setForgotEmailVal] = useState('');

  // Forms
  const { register: regSignIn, handleSubmit: handleSignInSubmit, formState: { errors: errorsSignIn }, reset: resetSignIn } = useForm();
  const { register: regSignUp, handleSubmit: handleSignUpSubmit, formState: { errors: errorsSignUp }, watch, reset: resetSignUp } = useForm();

  const onSignIn = (data) => {
    const res = loginUser(data.email, data.password);
    if (res.success) {
      resetSignIn();
      if (res.user.role === 'admin' || res.user.role === 'mentor' || res.user.role === 'intern') {
        navigate('/dashboard/overview');
      }
    } else {
      triggerToast(res.message, 'error');
    }
  };

  const onSignUp = (data) => {
    if (data.password !== data.confirmPassword) {
      triggerToast('Passwords do not match.', 'error');
      return;
    }
    const res = registerUser(data.name, data.email, data.password, selectedRole);
    if (res.success) {
      resetSignUp();
      navigate('/dashboard/overview');
    } else {
      triggerToast(res.message, 'error');
    }
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    if (!forgotEmailVal.trim()) return;
    triggerToast(`Verification code sent to ${forgotEmailVal}!`, 'success');
    setShowForgotModal(false);
    setForgotEmailVal('');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Dynamic Background Blueprint Grid */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.04] pointer-events-none text-orange-500" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="blueprintGrid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#blueprintGrid)" />
      </svg>

      {/* Floating Vector Flow Waves */}
      <svg className="absolute top-10 right-10 w-[550px] h-[550px] text-orange-500/5 pointer-events-none" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M-10,50 Q25,85 50,50 T110,50" stroke="currentColor" strokeWidth="0.8" fill="none" strokeLinecap="round" />
        <path d="M-10,35 Q30,65 60,35 T110,35" stroke="currentColor" strokeWidth="0.5" fill="none" strokeLinecap="round" />
      </svg>

      {/* Dynamic Background Accent Blurs */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-orange-200/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-100/20 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white border border-slate-100 rounded-3xl shadow-xl p-8 space-y-6 z-10"
      >
        {/* Portal Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-orange-500 items-center justify-center text-white shadow-lg shadow-orange-500/20">
            <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">CohortFlow Portal</h2>
          <p className="text-xs text-slate-400 font-medium">Transforming internship workflows to production SaaS standards</p>
        </div>

        {/* Auth Mode Toggle Toggles */}
        <div className="flex bg-slate-100 p-1.5 rounded-2xl">
          <button
            onClick={() => setAuthMode('signin')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${
              authMode === 'signin' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setAuthMode('signup')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${
              authMode === 'signup' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Role Selection Grid */}
        <div className="space-y-2">
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Portal Role Entry
          </label>
          <div className="grid grid-cols-2 gap-2">
            {['mentor', 'intern'].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setSelectedRole(r)}
                className={`py-2 px-3 border rounded-xl text-xs font-bold transition flex flex-col items-center gap-1 uppercase tracking-wide cursor-pointer ${
                  selectedRole === r
                    ? 'border-orange-500 bg-orange-50/50 text-orange-600 shadow-xs'
                    : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                }`}
              >
                <Shield className={`w-4 h-4 ${selectedRole === r ? 'text-orange-500' : 'text-slate-400'}`} />
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Form Screens */}
        <AnimatePresence mode="wait">
          {authMode === 'signin' ? (
            <motion.form
              key="signin"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              onSubmit={handleSignInSubmit(onSignIn)}
              className="space-y-4 text-slate-800"
            >
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1 flex-shrink-0">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    placeholder="e.g. jane@internverse.com"
                    {...regSignIn('email', { required: 'Email address is required' })}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-orange-500 text-sm transition"
                  />
                </div>
                {errorsSignIn.email && (
                  <span className="text-[10px] text-red-500 font-semibold mt-1 block">{errorsSignIn.email.message}</span>
                )}
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-slate-500">Security Password</label>
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(true)}
                    className="text-[10px] font-bold text-orange-500 hover:text-orange-600 outline-none"
                  >
                    Forgot?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    {...regSignIn('password', { required: 'Password is required' })}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-orange-500 text-sm transition"
                  />
                </div>
                {errorsSignIn.password && (
                  <span className="text-[10px] text-red-500 font-semibold mt-1 block">{errorsSignIn.password.message}</span>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold text-sm transition shadow-lg shadow-orange-500/10 cursor-pointer"
              >
                Sign In to Console
              </button>
            </motion.form>
          ) : (
            <motion.form
              key="signup"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              onSubmit={handleSignUpSubmit(onSignUp)}
              className="space-y-4 text-slate-800"
            >
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="e.g. Aarav Sharma"
                    {...regSignUp('name', { required: 'Name is required' })}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-orange-500 text-sm transition"
                  />
                </div>
                {errorsSignUp.name && (
                  <span className="text-[10px] text-red-500 font-semibold mt-1 block">{errorsSignUp.name.message}</span>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    placeholder="e.g. aarav@internverse.com"
                    {...regSignUp('email', { required: 'Email address is required' })}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-orange-500 text-sm transition"
                  />
                </div>
                {errorsSignUp.email && (
                  <span className="text-[10px] text-red-500 font-semibold mt-1 block">{errorsSignUp.email.message}</span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                    <input
                      type="password"
                      placeholder="••••••••"
                      {...regSignUp('password', {
                        required: 'Required',
                        minLength: { value: 6, message: 'Min 6 chars' }
                      })}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-orange-500 text-sm transition"
                    />
                  </div>
                  {errorsSignUp.password && (
                    <span className="text-[10px] text-red-500 font-semibold mt-1 block">{errorsSignUp.password.message}</span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Confirm</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                    <input
                      type="password"
                      placeholder="••••••••"
                      {...regSignUp('confirmPassword', { required: 'Required' })}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-orange-500 text-sm transition"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold text-sm transition shadow-lg shadow-orange-500/10 cursor-pointer"
              >
                Register Workspace Account
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl border border-slate-100 w-full max-w-sm p-6 shadow-xl space-y-4 text-slate-800">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-800">Forgot Password Recovery</h3>
              <p className="text-xs text-slate-400">Enter your email and we'll send a password recovery validation token.</p>
            </div>
            <form onSubmit={handleForgotSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. jane@internverse.com"
                  value={forgotEmailVal}
                  onChange={(e) => setForgotEmailVal(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-orange-500 text-sm"
                />
              </div>
              <div className="flex justify-end gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl font-bold text-slate-500 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold"
                >
                  Send Recovery Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
