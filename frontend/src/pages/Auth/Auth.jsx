// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { motion, AnimatePresence } from 'framer-motion';
// import { FaEnvelope, FaLock, FaUser } from 'react-icons/fa';
// import { BsBarChart, BsEye, BsEyeSlash } from 'react-icons/bs';
// import { HiOutlineAcademicCap } from 'react-icons/hi';
// import { authAPI } from '../../services/api';
// import { useAuth } from '../../context/AuthContext';
// import toast from 'react-hot-toast';

// const Field = ({ label, required, error, icon: Icon, children }) => (
//   <div className="space-y-1.5">
//     <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.15em] ml-1 flex items-center gap-1">
//       {label} {required && <span className="text-red-500">*</span>}
//     </label>
//     <div className="relative">
//       {Icon && <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-sm z-10" />}
//       {children}
//     </div>
//     {error && <p className="text-red-400 text-xs ml-1">{error}</p>}
//   </div>
// );

// const Auth = () => {
//   const navigate = useNavigate();
//   const { login } = useAuth();
//   const [isLogin, setIsLogin] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [showPw, setShowPw] = useState(false);
//   const [showCpw, setShowCpw] = useState(false);
//   const [errors, setErrors] = useState({});

//   const [form, setForm] = useState({
//     name: '', email: '', password: '', confirmPassword: '', agreeToTerms: false,
//   });

//   const set = (field) => (e) => {
//     const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
//     setForm(f => ({ ...f, [field]: val }));
//     if (errors[field]) setErrors(e => ({ ...e, [field]: '' }));
//   };

//   const validate = () => {
//     const e = {};
//     if (!form.email.trim()) e.email = 'Email is required';
//     else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email address';
//     if (!form.password) e.password = 'Password is required';
//     else if (form.password.length < 8) e.password = 'Password must be at least 8 characters';
//     if (!isLogin) {
//       if (!form.name.trim()) e.name = 'Name is required';
//       else if (form.name.length < 2) e.name = 'Name must be at least 2 characters';
//       if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
//       if (!form.agreeToTerms) e.agreeToTerms = 'You must agree to the terms';
//     }
//     return e;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const errs = validate();
//     if (Object.keys(errs).length) { setErrors(errs); return; }

//     setLoading(true);
//     try {
//       let res;
//       if (isLogin) {
//         res = await authAPI.login({ email: form.email, password: form.password });
//       } else {
//         res = await authAPI.register({
//           name: form.name, email: form.email,
//           password: form.password, confirmPassword: form.confirmPassword,
//         });
//       }
//       const { user, tokens } = res.data.data;
//       login(user, tokens);
//       toast.success(isLogin ? `Welcome back, ${user.name}!` : 'Account created successfully!');
//       navigate('/dashboard');
//     } catch (err) {
//       const msg = err.response?.data?.message || 'Authentication failed';
//       toast.error(msg);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const switchMode = () => {
//     setIsLogin(v => !v);
//     setErrors({});
//     setForm({ name: '', email: '', password: '', confirmPassword: '', agreeToTerms: false });
//   };

//   return (
//     <div className="min-h-screen bg-[#0a0c0b] text-slate-100 font-display overflow-hidden relative">
//       {/* Background */}
//       <div className="absolute inset-0">
//         <motion.div
//           className="absolute top-[-15%] left-[-10%] w-[50%] h-[50%] bg-[#06f988]/8 rounded-full blur-[130px]"
//           animate={{ scale: [1, 1.15, 1] }}
//           transition={{ duration: 8, repeat: Infinity }}
//         />
//         <motion.div
//           className="absolute bottom-[-15%] right-[-10%] w-[45%] h-[45%] bg-[#06f988]/5 rounded-full blur-[130px]"
//           animate={{ scale: [1.1, 1, 1.1] }}
//           transition={{ duration: 10, repeat: Infinity, delay: 1 }}
//         />
//         <div className="absolute inset-0 dot-bg bg-dot-md opacity-[0.06]" />
//       </div>

//       {/* Header */}
//       <motion.header
//         className="relative z-10 flex items-center justify-between px-8 py-5 border-b border-[#06f988]/8"
//         initial={{ y: -60, opacity: 0 }}
//         animate={{ y: 0, opacity: 1 }}
//         transition={{ duration: 0.5 }}
//       >
//         <div className="flex items-center gap-3">
//           <motion.div
//             className="w-10 h-10 bg-[#06f988] rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(6,249,136,0.3)]"
//             whileHover={{ rotate: 8 }}
//             transition={{ type: 'spring', stiffness: 300 }}
//           >
//             <BsBarChart className="text-[#0a0c0b] text-xl" />
//           </motion.div>
//           <h1 className="text-xl font-black tracking-tight uppercase">
//             Research<span className="text-[#06f988]">Paper</span>Tracker
//           </h1>
//         </div>
//         <span className="text-[10px] font-mono text-slate-600 uppercase tracking-widest hidden sm:block">
//           v1.0.0 — Secure Auth
//         </span>
//       </motion.header>

//       {/* Main */}
//       <main className="relative z-10 flex flex-col lg:flex-row items-center justify-center min-h-[calc(100vh-73px)] px-6 py-12 gap-16">

//         {/* Hero left */}
//         <motion.div
//           className="hidden lg:flex flex-1 flex-col max-w-lg"
//           initial={{ opacity: 0, x: -60 }}
//           animate={{ opacity: 1, x: 0 }}
//           transition={{ duration: 0.7, delay: 0.2 }}
//         >
//           {/* Floating cards */}
//           <div className="relative w-72 h-80 mb-12">
//             {[
//               { rotate: '-12deg', bg: 'bg-white/3', delay: 0 },
//               { rotate: '3deg', bg: 'bg-[#06f988]/8 border-[#06f988]/15', delay: 0.5 },
//               { rotate: '-3deg', bg: 'bg-[#1a1c1b]/60', delay: 1 },
//             ].map(({ rotate, bg, delay }, i) => (
//               <motion.div
//                 key={i}
//                 className={`absolute inset-0 rounded-2xl border border-white/8 backdrop-blur-sm ${bg}`}
//                 style={{ transform: `rotate(${rotate})` }}
//                 animate={{ y: [0, -8, 0], rotate: [rotate, `calc(${rotate} + 3deg)`, rotate] }}
//                 transition={{ duration: 5 + i, repeat: Infinity, ease: 'easeInOut', delay }}
//               >
//                 {i === 2 && (
//                   <div className="p-8 space-y-3 mt-4">
//                     <div className="w-16 h-2 bg-[#06f988]/50 rounded-full" />
//                     {[1, 1, 0.7].map((w, j) => (
//                       <div key={j} className="h-1.5 bg-white/8 rounded-full" style={{ width: `${w * 100}%` }} />
//                     ))}
//                     <div className="mt-6 w-10 h-10 bg-[#06f988]/15 rounded-lg flex items-center justify-center">
//                       <BsBarChart className="text-[#06f988] text-xl" />
//                     </div>
//                   </div>
//                 )}
//               </motion.div>
//             ))}
//           </div>

//           <div className="space-y-4">
//             <h2 className="text-4xl font-black leading-tight">
//               Elevate your academic{' '}
//               <span className="text-[#06f988] relative">
//                 workflow.
//                 <motion.span
//                   className="absolute -bottom-1 left-0 h-0.5 bg-[#06f988]/40 rounded-full"
//                   initial={{ width: 0 }}
//                   animate={{ width: '100%' }}
//                   transition={{ delay: 0.8, duration: 0.8 }}
//                 />
//               </span>
//             </h2>
//             <p className="text-slate-400 text-base leading-relaxed max-w-sm">
//               Track, organize, and analyze your research papers with full reading stage tracking and visual analytics.
//             </p>

//             {/* Feature list */}
//             <div className="flex flex-col gap-2 pt-2">
//               {['JWT-secured authentication', 'Full CRUD paper management', 'Advanced reading analytics'].map((f, i) => (
//                 <motion.div
//                   key={f}
//                   className="flex items-center gap-2 text-sm text-slate-400"
//                   initial={{ opacity: 0, x: -20 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   transition={{ delay: 0.5 + i * 0.1 }}
//                 >
//                   <span className="w-1.5 h-1.5 rounded-full bg-[#06f988] shrink-0" />
//                   {f}
//                 </motion.div>
//               ))}
//             </div>
//           </div>
//         </motion.div>

//         {/* Form right */}
//         <motion.div
//           className="w-full max-w-md"
//           initial={{ opacity: 0, x: 60 }}
//           animate={{ opacity: 1, x: 0 }}
//           transition={{ duration: 0.7 }}
//         >
//           <div className="relative rounded-2xl border border-[#06f988]/12 bg-[#111413]/80 backdrop-blur-xl p-8 shadow-2xl">
//             <div className="absolute inset-0 rounded-2xl bg-[#06f988]/3 blur-xl -z-10" />

//             <motion.div
//               className="mb-7"
//               initial={{ y: -15, opacity: 0 }}
//               animate={{ y: 0, opacity: 1 }}
//               transition={{ delay: 0.1 }}
//             >
//               <h3 className="text-2xl font-black mb-1">
//                 {isLogin ? 'Welcome Back' : 'Create Account'}
//               </h3>
//               <p className="text-sm text-slate-400">
//                 {isLogin ? 'Sign in to your research workspace.' : 'Join thousands of researchers worldwide.'}
//               </p>
//             </motion.div>

//             <form className="space-y-4" onSubmit={handleSubmit}>
//               <AnimatePresence mode="wait">
//                 {!isLogin && (
//                   <motion.div
//                     key="reg-fields"
//                     initial={{ opacity: 0, height: 0 }}
//                     animate={{ opacity: 1, height: 'auto' }}
//                     exit={{ opacity: 0, height: 0 }}
//                     className="space-y-4 overflow-hidden"
//                   >
//                     <Field label="Full Name" required error={errors.name} icon={FaUser}>
//                       <input
//                         className={`input-base pl-10 pr-4  ${errors.name ? 'error' : ''}`}
//                         placeholder="Enter Name"
//                         type="text"
//                         value={form.name}
//                         onChange={set('name')}
//                         disabled={loading}
                        
//                       />
//                     </Field>
//                   </motion.div>
//                 )}
//               </AnimatePresence>

//               <Field label="Email Address" required error={errors.email} icon={FaEnvelope}>
//                 <input
//                   className={`input-base pl-20 ${errors.email ? 'error' : ''}`}
//                   placeholder="Email"
//                   type="email"
//                   value={form.email}
//                   onChange={set('email')}
//                   disabled={loading}
//                 />
//               </Field>

//               <Field label="Password" required error={errors.password} icon={FaLock}>
//                 <input
//                   className={`input-base pl-10 pr-11 ${errors.password ? 'error' : ''}`}
//                   placeholder="••••••••"
//                   type={showPw ? 'text' : 'password'}
//                   value={form.password}
//                   onChange={set('password')}
//                   disabled={loading}
//                 />
//                 <button
//                   type="button"
//                   className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-[#06f988] transition-colors"
//                   onClick={() => setShowPw(v => !v)}
//                 >
//                   {showPw ? <BsEyeSlash /> : <BsEye />}
//                 </button>
//               </Field>

//               <AnimatePresence mode="wait">
//                 {!isLogin && (
//                   <motion.div
//                     key="confirm-pw"
//                     initial={{ opacity: 0, height: 0 }}
//                     animate={{ opacity: 1, height: 'auto' }}
//                     exit={{ opacity: 0, height: 0 }}
//                     className="space-y-4 overflow-hidden"
//                   >
//                     <Field label="Confirm Password" required error={errors.confirmPassword} icon={FaLock}>
//                       <input
//                         className={`input-base pl-10 pr-11 ${errors.confirmPassword ? 'error' : ''}`}
//                         placeholder="••••••••"
//                         type={showCpw ? 'text' : 'password'}
//                         value={form.confirmPassword}
//                         onChange={set('confirmPassword')}
//                         disabled={loading}
//                       />
//                       <button
//                         type="button"
//                         className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-[#06f988] transition-colors"
//                         onClick={() => setShowCpw(v => !v)}
//                       >
//                         {showCpw ? <BsEyeSlash /> : <BsEye />}
//                       </button>
//                     </Field>

//                     <div className="flex items-start gap-2.5">
//                       <input
//                         type="checkbox"
//                         id="terms"
//                         checked={form.agreeToTerms}
//                         onChange={set('agreeToTerms')}
//                         className="mt-0.5 w-4 h-4 rounded border-white/10 bg-[#242927] text-[#06f988] cursor-pointer"
//                         disabled={loading}
//                       />
//                       <label htmlFor="terms" className="text-xs text-slate-400 cursor-pointer leading-relaxed">
//                         I agree to the{' '}
//                         <span className="text-[#06f988] hover:underline cursor-pointer">Terms of Service</span>{' '}
//                         and{' '}
//                         <span className="text-[#06f988] hover:underline cursor-pointer">Privacy Policy</span>
//                       </label>
//                     </div>
//                     {errors.agreeToTerms && (
//                       <p className="text-red-400 text-xs">{errors.agreeToTerms}</p>
//                     )}
//                   </motion.div>
//                 )}
//               </AnimatePresence>

//               <motion.button
//                 className={`w-full bg-[#06f988] text-[#0a0c0b] font-black py-3.5 rounded-xl
//                            shadow-[0_0_20px_rgba(6,249,136,0.25)] transition-all duration-200
//                            hover:shadow-[0_0_30px_rgba(6,249,136,0.4)] text-sm tracking-wide uppercase
//                            ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
//                 type="submit"
//                 disabled={loading}
//                 whileHover={!loading ? { scale: 1.02 } : {}}
//                 whileTap={!loading ? { scale: 0.98 } : {}}
//               >
//                 {loading ? (
//                   <span className="flex items-center justify-center gap-2">
//                     <span className="w-4 h-4 border-2 border-[#0a0c0b] border-t-transparent rounded-full animate-spin" />
//                     Processing...
//                   </span>
//                 ) : (
//                   isLogin ? 'Sign In →' : 'Create Account →'
//                 )}
//               </motion.button>
//             </form>

//             <p className="mt-5 text-center text-sm text-slate-500">
//               {isLogin ? "Don't have an account?" : 'Already have an account?'}
//               <button
//                 onClick={switchMode}
//                 className="text-[#06f988] font-bold hover:underline ml-1.5"
//                 disabled={loading}
//               >
//                 {isLogin ? 'Register' : 'Sign In'}
//               </button>
//             </p>

//             {/* Demo credentials hint */}
//             {isLogin && (
//               <motion.div
//                 className="mt-4 p-3 bg-[#242927]/60 rounded-lg border border-[#06f988]/10"
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ delay: 0.4 }}
//               >
//                 <p className="text-[9px] text-slate-500 uppercase tracking-widest mb-1.5 font-mono">Demo Access</p>
//                 <div className="flex justify-between text-xs text-slate-400">
//                   <span>demo@research.edu</span>
//                   <span>Demo@1234!</span>
//                 </div>
//               </motion.div>
//             )}
//           </div>
//         </motion.div>
//       </main>
//     </div>
//   );
// };

// export default Auth;










import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEnvelope, FaLock, FaUser } from 'react-icons/fa';
import { BsBarChart, BsEye, BsEyeSlash } from 'react-icons/bs';
import { HiOutlineAcademicCap } from 'react-icons/hi';
import { authAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { MdQueryStats } from 'react-icons/md';
import toast from 'react-hot-toast';

const Field = ({ label, required, error, icon: Icon, children }) => (
  <div className="space-y-1.5">
    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.15em] ml-1 flex items-center gap-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm z-10" />}
      {children}
    </div>
    {error && <p className="text-red-400 text-xs ml-1">{error}</p>}
  </div>
);

const Auth = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLogin, setIsLogin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [showCpw, setShowCpw] = useState(false);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '', agreeToTerms: false,
  });

  const set = (field) => (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm(f => ({ ...f, [field]: val }));
    if (errors[field]) setErrors(e => ({ ...e, [field]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email address';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 8) e.password = 'Password must be at least 8 characters';
    if (!isLogin) {
      if (!form.name.trim()) e.name = 'Name is required';
      else if (form.name.length < 2) e.name = 'Name must be at least 2 characters';
      if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
      if (!form.agreeToTerms) e.agreeToTerms = 'You must agree to the terms';
    }
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      let res;
      if (isLogin) {
        res = await authAPI.login({ email: form.email, password: form.password });
      } else {
        res = await authAPI.register({
          name: form.name, email: form.email,
          password: form.password, confirmPassword: form.confirmPassword,
        });
      }
      const { user, tokens } = res.data.data;
      login(user, tokens);
      toast.success(isLogin ? `Welcome back, ${user.name}!` : 'Account created successfully!');
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || 'Authentication failed';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setIsLogin(v => !v);
    setErrors({});
    setForm({ name: '', email: '', password: '', confirmPassword: '', agreeToTerms: false });
  };

  return (
    <div className="min-h-screen bg-[#0a0c0b] text-slate-100 font-display overflow-hidden relative">
      {/* Background */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-[-15%] left-[-10%] w-[50%] h-[50%] bg-[#06f988]/8 rounded-full blur-[130px]"
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-[-15%] right-[-10%] w-[45%] h-[45%] bg-[#06f988]/5 rounded-full blur-[130px]"
          animate={{ scale: [1.1, 1, 1.1] }}
          transition={{ duration: 10, repeat: Infinity, delay: 1 }}
        />
        <div className="absolute inset-0 dot-bg bg-dot-md opacity-[0.06]" />
      </div>

      {/* Header */}
      <motion.header
        className="relative z-10 flex items-center justify-between px-8 py-5 border-b border-[#06f988]/10"
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
                className="flex items-center gap-2.5 cursor-pointer select-none"
                whileHover={{ scale: 1.02 }}
                onClick={() => navigate('/dashboard')}
              >
                <motion.div
                  className="w-9 h-9 bg-[#06f988]/15 rounded-lg flex items-center justify-center border border-[#06f988]/30"
                  whileHover={{ rotate: 8 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <MdQueryStats className="text-[#06f988] text-xl" />
                </motion.div>
                <span className="text-lg font-black tracking-tight text-slate-100 hidden sm:block">
                  Quickreply<span className="text-[#06f988]">Analytics</span> 
                </span>
              </motion.div>
        <span className="text-[10px] font-mono text-slate-600 uppercase tracking-widest hidden sm:block">
          v1.0.0 — Secure Auth
        </span>
      </motion.header>

      

      {/* Main */}
      <main className="relative z-10 flex flex-col lg:flex-row items-center justify-center min-h-[calc(100vh-73px)] px-6 py-12 gap-16">

        {/* Hero left */}
        <motion.div
          className="hidden lg:flex flex-1 flex-col max-w-lg"
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          {/* Floating cards */}
          <div className="relative w-72 h-80 mb-12">
            {[
              { rotate: '-12deg', bg: 'bg-white/3', delay: 0 },
              { rotate: '3deg', bg: 'bg-[#06f988]/8 border-[#06f988]/15', delay: 0.5 },
              { rotate: '-3deg', bg: 'bg-[#1a1c1b]/60', delay: 1 },
            ].map(({ rotate, bg, delay }, i) => (
              <motion.div
                key={i}
                className={`absolute inset-0 rounded-2xl border border-white/8 backdrop-blur-sm ${bg}`}
                style={{ transform: `rotate(${rotate})` }}
                animate={{ y: [0, -8, 0], rotate: [rotate, `calc(${rotate} + 3deg)`, rotate] }}
                transition={{ duration: 5 + i, repeat: Infinity, ease: 'easeInOut', delay }}
              >
                {i === 2 && (
                  <div className="p-8 space-y-3 mt-4">
                    <div className="w-16 h-2 bg-[#06f988]/50 rounded-full" />
                    {[1, 1, 0.7].map((w, j) => (
                      <div key={j} className="h-1.5 bg-white/8 rounded-full" style={{ width: `${w * 100}%` }} />
                    ))}
                    <div className="mt-6 w-10 h-10 bg-[#06f988]/15 rounded-lg flex items-center justify-center">
                      <BsBarChart className="text-[#06f988] text-xl" />
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          <div className="space-y-4">
            <h2 className="text-4xl font-black leading-tight">
              Elevate your academic{' '}
              <span className="text-[#06f988] relative">
                workflow.
                <motion.span
                  className="absolute -bottom-1 left-0 h-0.5 bg-[#06f988]/40 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ delay: 0.8, duration: 0.8 }}
                />
              </span>
            </h2>
            <p className="text-slate-400 text-base leading-relaxed max-w-sm">
              Track, organize, and analyze your research papers with full reading stage tracking and visual analytics.
            </p>

            {/* Feature list */}
            <div className="flex flex-col gap-2 pt-2">
              {['JWT-secured authentication', 'Full CRUD paper management', 'Advanced reading analytics'].map((f, i) => (
                <motion.div
                  key={f}
                  className="flex items-center gap-2 text-sm text-slate-400"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#06f988] shrink-0" />
                  {f}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Form right */}
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="relative rounded-2xl border border-[#06f988]/10 bg-[#111413]/80 backdrop-blur-xl p-8 shadow-2xl">
            <div className="absolute inset-0 rounded-2xl bg-[#06f988]/3 blur-xl -z-10" />

            <motion.div
              className="mb-7"
              initial={{ y: -15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <h3 className="text-2xl font-black mb-1">
                {isLogin ? 'Welcome Back' : 'Create Account'}
              </h3>
              <p className="text-sm text-slate-400">
                {isLogin ? 'Sign in to your research workspace.' : 'Join thousands of researchers worldwide.'}
              </p>
            </motion.div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <AnimatePresence mode="wait">
                {!isLogin && (
                  <motion.div
                    key="reg-fields"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4 overflow-hidden"
                  >
                    <Field label="Full Name" required error={errors.name} icon={FaUser}>
                      <input
                        className={`input-base pl-10 pr-4 ${errors.name ? 'error' : ''}`}
                        style={{ paddingLeft: '2.5rem' }}
                        placeholder="Enter Name"
                        type="text"
                        value={form.name}
                        onChange={set('name')}
                        disabled={loading}
                      />
                    </Field>
                  </motion.div>
                )}
              </AnimatePresence>

              <Field label="Email Address" required error={errors.email} icon={FaEnvelope}>
                <input
                  className={`input-base pl-10 ${errors.email ? 'error' : ''}`}
                   style={{ paddingLeft: '2.5rem' }}
                  placeholder="Email"
                  type="email"
                  value={form.email}
                  onChange={set('email')}
                  disabled={loading}
                />
              </Field>

              <Field label="Password" required error={errors.password} icon={FaLock}>
                <input
                  className={`input-base pl-10 pr-11 ${errors.password ? 'error' : ''}`}
                  style={{ paddingLeft: '2.5rem' }}
                  placeholder="••••••••"
                  type={showPw ? 'text' : 'password'}
                  value={form.password}
                  onChange={set('password')}
                  disabled={loading}
                />
                <button
                  type="button"
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-[#06f988] transition-colors"
                  onClick={() => setShowPw(v => !v)}
                >
                  {showPw ? <BsEyeSlash /> : <BsEye />}
                </button>
              </Field>

              <AnimatePresence mode="wait">
                {!isLogin && (
                  <motion.div
                    key="confirm-pw"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4 overflow-hidden"
                  >
                    <Field label="Confirm Password" required error={errors.confirmPassword} icon={FaLock}>
                      <input
                        className={`input-base pl-10 pr-11 ${errors.confirmPassword ? 'error' : ''}`}
                        style={{ paddingLeft: '2.5rem' }}
                        placeholder="••••••••"
                        type={showCpw ? 'text' : 'password'}
                        value={form.confirmPassword}
                        onChange={set('confirmPassword')}
                        disabled={loading}
                      />
                      <button
                        type="button"
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-[#06f988] transition-colors"
                        onClick={() => setShowCpw(v => !v)}
                      >
                        {showCpw ? <BsEyeSlash /> : <BsEye />}
                      </button>
                    </Field>

                    <div className="flex items-start gap-2.5">
                      <input
                        type="checkbox"
                        id="terms"
                        checked={form.agreeToTerms}
                        onChange={set('agreeToTerms')}
                        className="mt-0.5 w-4 h-4 rounded border-white/10 bg-[#242927] text-[#06f988] cursor-pointer"
                        disabled={loading}
                      />
                      <label htmlFor="terms" className="text-xs text-slate-400 cursor-pointer leading-relaxed">
                        I agree to the{' '}
                        <span className="text-[#06f988] hover:underline cursor-pointer">Terms of Service</span>{' '}
                        and{' '}
                        <span className="text-[#06f988] hover:underline cursor-pointer">Privacy Policy</span>
                      </label>
                    </div>
                    {errors.agreeToTerms && (
                      <p className="text-red-400 text-xs">{errors.agreeToTerms}</p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.button
                className={`w-full bg-[#06f988] text-[#0a0c0b] font-black py-3.5 rounded-xl
                           shadow-[0_0_20px_rgba(6,249,136,0.25)] transition-all duration-200
                           hover:shadow-[0_0_30px_rgba(6,249,136,0.4)] text-sm tracking-wide uppercase
                           ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                type="submit"
                disabled={loading}
                whileHover={!loading ? { scale: 1.02 } : {}}
                whileTap={!loading ? { scale: 0.98 } : {}}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-[#0a0c0b] border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </span>
                ) : (
                  isLogin ? 'Sign In →' : 'Create Account →'
                )}
              </motion.button>
            </form>

            <p className="mt-5 text-center text-sm text-slate-500">
              {isLogin ? "Don't have an account?" : 'Already have an account?'}
              <button
                onClick={switchMode}
                className="text-[#06f988] font-bold hover:underline ml-1.5"
                disabled={loading}
              >
                {isLogin ? 'Register' : 'Sign In'}
              </button>
            </p>

            {/* Demo credentials hint */}
            {isLogin && (
              <motion.div
                className="mt-4 p-3 bg-[#242927]/60 rounded-lg border border-[#06f988]/10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <p className="text-[9px] text-slate-500 uppercase tracking-widest mb-1.5 font-mono">Demo Access</p>
                <div className="flex justify-between text-xs text-slate-400">
                  <span>demo@quickreply.ai</span>
                  <span>Demo@1234</span>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Auth;