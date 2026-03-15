import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MdDashboard, MdInsights, MdSettings, MdMenu, MdChevronLeft, MdClose
} from 'react-icons/md';
import { HiOutlineBookOpen } from 'react-icons/hi';
import { GiNetworkBars } from 'react-icons/gi';

const NAV = [
  { id: 'dashboard', icon: MdDashboard,      label: 'Dashboard',    path: '/dashboard' },
  { id: 'research',  icon: HiOutlineBookOpen, label: 'Research',     path: '/research'  },
  { id: 'analytics', icon: MdInsights,        label: 'Analytics',    path: '/analytics' },
  { id: 'settings',  icon: MdSettings,        label: 'Settings',     path: '/settings'  },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const active = location.pathname.split('/')[1] || 'dashboard';

  const [open, setOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [load, setLoad] = useState(64);
  
  const sidebarRef = useRef(null);

  useEffect(() => {
    const check = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) setOpen(false); else setOpen(true);
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (open && sidebarRef.current && !sidebarRef.current.contains(event.target) && 
          !event.target.closest('.sidebar-toggle-btn')) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  useEffect(() => {
    const t = setInterval(() => setLoad(p => Math.min(100, Math.max(40, p + (Math.random() * 4 - 2)))), 3000);
    return () => clearInterval(t);
  }, []);

  const go = (item) => {
    navigate(item.path);
    if (isMobile) setOpen(false);
  };

  return (
    <>
      <motion.button
        className="sidebar-toggle-btn fixed z-50 w-8 h-8 bg-[#06f988] text-[#0a0c0b] rounded-lg flex items-center justify-center shadow-lg"
        style={{ top: '76px' }}
        animate={{ left: open ? (isMobile ? 'calc(100vw - 60px)' : '252px') : '16px' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={(e) => {
          e.stopPropagation(); 
          setOpen(o => !o);
        }}
      >
        {open ? <MdChevronLeft className="text-lg" /> : <MdMenu className="text-lg" />}
      </motion.button>

      <AnimatePresence>
        {isMobile && open && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {open && (
          <motion.aside
            ref={sidebarRef}
            className="fixed top-0 left-0 h-full z-50 w-60 flex flex-col
                       bg-[#0a0c0b]/95 backdrop-blur-md border-r border-[#06f988]/10 px-4 py-6 gap-6"
            initial={{ x: -280, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -280, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#06f988]/15 border border-[#06f988]/30 flex items-center justify-center">
                  <GiNetworkBars className="text-[#06f988] text-base" />
                </div>
                <div>
                  <p className="text-xs font-black text-slate-100 uppercase tracking-wider">Nexus Core</p>
                  <p className="text-[9px] text-slate-600 font-mono">v4.2.0</p>
                </div>
              </div>
              {isMobile && (
                <button onClick={() => setOpen(false)} className="text-slate-500 hover:text-[#06f988]">
                  <MdClose />
                </button>
              )}
            </div>

            <div className="flex flex-col gap-1 flex-1">
              <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.25em] px-2 mb-2">
                Core Systems
              </p>
              {NAV.map((item, i) => {
                const isActive = active === item.id;
                return (
                  <motion.button
                    key={item.id}
                    className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl w-full text-left
                               transition-all duration-200 overflow-hidden
                               ${isActive ? 'bg-[#06f988]/10 text-[#06f988]' : 'text-slate-400 hover:bg-[#1a1c1b] hover:text-slate-100'}`}
                    onClick={() => go(item)}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                    whileHover={{ x: 3 }}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="active-bar"
                        className="absolute left-0 top-0 bottom-0 w-0.5 bg-[#06f988] rounded-r"
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      />
                    )}
                    <item.icon className="text-base shrink-0" />
                    <span className="text-xs font-semibold uppercase tracking-wide">{item.label}</span>
                    {isActive && (
                      <motion.span
                        className="ml-auto w-1.5 h-1.5 rounded-full bg-[#06f988]"
                        animate={{ opacity: [1, 0.3, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    )}
                  </motion.button>
                );
              })}
            </div>

            <motion.div
              className="rounded-xl bg-[#1a1c1b] border border-[#06f988]/15 p-3 overflow-hidden relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-[#06f988]/5 to-transparent"
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              />
              <p className="text-[9px] font-black text-[#06f988] uppercase tracking-widest mb-2 font-mono flex items-center gap-1.5">
                <GiNetworkBars className="animate-pulse" /> System Load
              </p>
              <div className="h-1 bg-[#242927] rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#06f988] to-[#4aff9e] rounded-full"
                  animate={{ width: `${load}%` }}
                  transition={{ duration: 1.5, ease: 'easeOut' }}
                />
              </div>
              <div className="flex justify-between mt-1.5">
                <span className="text-[9px] text-slate-600 font-mono uppercase">Capacity</span>
                <span className="text-[9px] text-[#06f988] font-mono font-bold">{load.toFixed(1)}%</span>
              </div>
              <div className="mt-2 h-6 flex items-end gap-px">
                {Array.from({ length: 24 }, (_, i) => (
                  <motion.div
                    key={i}
                    className="flex-1 rounded-t-sm"
                    style={{ backgroundColor: '#06f988', opacity: 0.1 + Math.random() * 0.5 }}
                    initial={{ height: 0 }}
                    animate={{ height: `${20 + Math.random() * 80}%` }}
                    transition={{ delay: i * 0.03, duration: 0.5 }}
                  />
                ))}
              </div>
            </motion.div>

            <p className="text-[9px] text-slate-700 font-mono text-center uppercase tracking-widest">
              Terminal: #9832-TX
            </p>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;