import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiOutlineSearch, HiOutlineBell, HiOutlineLogout,
  HiOutlineUser, HiOutlineCog, HiOutlineChevronDown
} from 'react-icons/hi';
import { MdQueryStats } from 'react-icons/md';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [notifications] = useState(3);
  const dropRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) setDropdownOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'DR';

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-6 lg:px-8 py-3.5
                       bg-[#0a0c0b]/90 backdrop-blur-md border-b border-[#06f988]/10">
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

      <div className="flex items-center gap-3">
        <label className="relative hidden md:flex items-center">
          <HiOutlineSearch className="absolute left-3 text-slate-500 text-sm" />
          <input
            className="input-base py-2 pl-9 pr-4 w-56 text-sm"
            style={{ paddingLeft: '2.5rem' }}
            placeholder="Search papers..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && navigate('/research')}
          />
        </label>

        <motion.button
          className="relative w-9 h-9 bg-[#1a1c1b] border border-[#06f988]/15 rounded-lg
                     flex items-center justify-center text-[#06f988] hover:bg-[#06f988]/10 transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <HiOutlineBell className="text-lg" />
          {notifications > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full
                           text-[9px] flex items-center justify-center text-white font-bold">
              {notifications}
            </span>
          )}
        </motion.button>

        <div className="relative" ref={dropRef}>
          <motion.button
            className="flex items-center gap-2 group"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            whileTap={{ scale: 0.98 }}
          >
            <div className="w-9 h-9 rounded-full border-2 border-[#06f988]/40 flex items-center justify-center
                           bg-[#06f988]/10 text-[#06f988] text-sm font-black">
              {initials}
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-xs font-bold text-slate-100 leading-tight">{user?.name || 'Researcher'}</p>
              <p className="text-[10px] text-[#06f988] flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-[#06f988] animate-pulse" />
                Active
              </p>
            </div>
            <motion.div animate={{ rotate: dropdownOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <HiOutlineChevronDown className="text-slate-500 text-xs" />
            </motion.div>
          </motion.button>

          <AnimatePresence>
            {dropdownOpen && (
              <motion.div
                className="absolute right-0 top-full mt-2 w-56 bg-[#1a1c1b] border border-[#06f988]/10
                           rounded-xl shadow-2xl overflow-hidden z-50"
                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
              >
                <div className="p-4 border-b border-[#06f988]/10">
                  <p className="text-sm font-bold text-slate-100">{user?.name || 'Researcher'}</p>
                  <p className="text-xs text-slate-400">{user?.email || ''}</p>
                </div>
                <div className="p-2">
                  {[
                    { icon: HiOutlineUser, label: 'Profile', action: () => navigate('/profile') },
                   
                  ].map(({ icon: Icon, label, action }) => (
                    <motion.button
                      key={label}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg
                                 text-slate-300 hover:bg-[#242927] hover:text-[#06f988] transition-all text-sm"
                      whileHover={{ x: 4 }}
                      onClick={() => { action(); setDropdownOpen(false); }}
                    >
                      <Icon className="text-base" />{label}
                    </motion.button>
                  ))}
                  <div className="border-t border-[#06f988]/10 my-1.5" />
                  <motion.button
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg
                               text-red-400 hover:bg-red-500/10 transition-all text-sm"
                    whileHover={{ x: 4 }}
                    onClick={handleLogout}
                  >
                    <HiOutlineLogout className="text-base" />Logout
                  </motion.button>
                </div>
                <div className="p-3 bg-[#242927]/50 border-t border-[#06f988]/10">
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>Papers tracked</span>
                    <span className="text-[#06f988]">synced ✓</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

export default Header;
