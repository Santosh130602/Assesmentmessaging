import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { HiOutlineUser, HiOutlineLockClosed, HiOutlineShieldCheck } from 'react-icons/hi';
import { FiSave } from 'react-icons/fi';
import { authAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const Section = ({ title, icon: Icon, children }) => (
  <motion.div
    className="glass rounded-2xl p-6"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
  >
    <h2 className="text-base font-black text-slate-100 uppercase tracking-tight flex items-center gap-2 mb-6">
      <Icon className="text-[#06f988] text-lg" />{title}
    </h2>
    {children}
  </motion.div>
);

const Field = ({ label, required, error, children }) => (
  <div className="space-y-1.5">
    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.15em] block">
      {label}{required && <span className="text-red-400 ml-1">*</span>}
    </label>
    {children}
    {error && <p className="text-red-400 text-xs">{error}</p>}
  </div>
);

const Settings = () => {
  const { user, fetchUser } = useAuth();

  // Password form
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
  const [pwErrors, setPwErrors] = useState({});
  const [pwLoading, setPwLoading] = useState(false);

  const setPw = (f) => (e) => { setPwForm(v => ({ ...v, [f]: e.target.value })); };

  const validatePw = () => {
    const e = {};
    if (!pwForm.currentPassword) e.currentPassword = 'Current password required';
    if (!pwForm.newPassword) e.newPassword = 'New password required';
    else if (pwForm.newPassword.length < 8) e.newPassword = 'Must be at least 8 characters';
    else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(pwForm.newPassword))
      e.newPassword = 'Must include upper, lower, number, special char';
    if (pwForm.newPassword !== pwForm.confirmNewPassword)
      e.confirmNewPassword = 'Passwords do not match';
    return e;
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    const errs = validatePw();
    if (Object.keys(errs).length) { setPwErrors(errs); return; }
    setPwLoading(true);
    try {
      await authAPI.changePassword({
        currentPassword: pwForm.currentPassword,
        newPassword: pwForm.newPassword,
        confirmNewPassword: pwForm.confirmNewPassword,
      });
      toast.success('Password updated successfully!');
      setPwForm({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
      setPwErrors({});
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update password';
      toast.error(msg);
      setPwErrors({ currentPassword: msg });
    } finally {
      setPwLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-10 max-w-2xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-black tracking-tight text-slate-100">Profile</h1>
        <p className="text-slate-500 text-sm mt-1">Manage your account and preferences</p>
      </motion.div>

      {/* Profile Info (read-only) */}
      <Section title="Profile Information" icon={HiOutlineUser}>
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-[#242927]/50 rounded-xl border border-[#06f988]/10">
            <div className="w-14 h-14 rounded-xl bg-[#06f988]/15 border border-[#06f988]/30 flex items-center justify-center text-[#06f988] text-xl font-black">
              {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'DR'}
            </div>
            <div>
              <p className="font-bold text-slate-100 text-lg">{user?.name || '—'}</p>
              <p className="text-sm text-slate-400">{user?.email || '—'}</p>
              <span className="text-[9px] text-[#06f988] font-mono bg-[#06f988]/10 px-2 py-0.5 rounded-full mt-1 inline-block uppercase tracking-widest">
                Researcher
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="p-3 bg-[#242927]/40 rounded-xl">
              <p className="text-[9px] text-slate-500 uppercase tracking-widest font-mono mb-1">Member Since</p>
              <p className="text-slate-200 font-semibold">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : '—'}
              </p>
            </div>
            <div className="p-3 bg-[#242927]/40 rounded-xl">
              <p className="text-[9px] text-slate-500 uppercase tracking-widest font-mono mb-1">Account Status</p>
              <p className="text-[#06f988] font-semibold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#06f988] animate-pulse" />Active
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* Change Password */}
      <Section title="Change Password" icon={HiOutlineLockClosed}>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <Field label="Current Password" required error={pwErrors.currentPassword}>
            <input
              className={`input-base ${pwErrors.currentPassword ? 'error' : ''}`}
              type="password"
              placeholder="Enter current password"
              value={pwForm.currentPassword}
              onChange={setPw('currentPassword')}
              disabled={pwLoading}
            />
          </Field>
          <Field label="New Password" required error={pwErrors.newPassword}>
            <input
              className={`input-base ${pwErrors.newPassword ? 'error' : ''}`}
              type="password"
              placeholder="Min 8 chars, upper + lower + number + special"
              value={pwForm.newPassword}
              onChange={setPw('newPassword')}
              disabled={pwLoading}
            />
          </Field>
          <Field label="Confirm New Password" required error={pwErrors.confirmNewPassword}>
            <input
              className={`input-base ${pwErrors.confirmNewPassword ? 'error' : ''}`}
              type="password"
              placeholder="Repeat new password"
              value={pwForm.confirmNewPassword}
              onChange={setPw('confirmNewPassword')}
              disabled={pwLoading}
            />
          </Field>

          <motion.button
            type="submit"
            className={`flex items-center gap-2 px-6 py-3 bg-[#06f988] text-[#0a0c0b] font-black rounded-xl text-sm
                       hover:shadow-[0_0_20px_rgba(6,249,136,0.4)] transition-all
                       ${pwLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            whileHover={!pwLoading ? { scale: 1.03 } : {}}
            whileTap={!pwLoading ? { scale: 0.97 } : {}}
            disabled={pwLoading}
          >
            {pwLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-[#0a0c0b] border-t-transparent rounded-full animate-spin" />
                Updating...
              </span>
            ) : (
              <><FiSave />Update Password</>
            )}
          </motion.button>
        </form>
      </Section>

      {/* Security notice */}
      <Section title="Security" icon={HiOutlineShieldCheck}>
        <div className="space-y-3">
          {[
            { label: 'JWT Authentication', status: 'Active', color: 'text-[#06f988]' },
            { label: 'Refresh Token Rotation', status: 'Enabled', color: 'text-[#06f988]' },
            { label: 'Rate Limiting', status: '100 req/15min', color: 'text-yellow-400' },
            { label: 'Password Hashing', status: 'bcrypt (cost 12)', color: 'text-[#06f988]' },
          ].map((item, i) => (
            <motion.div
              key={i}
              className="flex items-center justify-between py-2.5 border-b border-[#06f988]/6 last:border-0"
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
            >
              <span className="text-sm text-slate-400">{item.label}</span>
              <span className={`text-xs font-bold ${item.color} flex items-center gap-1.5`}>
                <span className={`w-1 h-1 rounded-full ${item.color.replace('text-', 'bg-')}`} />
                {item.status}
              </span>
            </motion.div>
          ))}
        </div>
      </Section>
    </div>
  );
};

export default Settings;
