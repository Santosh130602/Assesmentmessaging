import React from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from './Header';
import Sidebar from './Sidebar';
import BackgroundGlow from '../common/BackgroundGlow';

const DashboardLayout = () => (
  <div className="min-h-screen bg-[#0a0c0b] text-slate-100 font-display">
    <BackgroundGlow />
    <Header />
    <div className="flex">
      <Sidebar />
      <motion.main
        className="flex-1 min-h-[calc(100vh-57px)] p-6 lg:p-8 overflow-y-auto"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </motion.main>
    </div>

    <footer className="fixed bottom-0 left-0 right-0 h-7 bg-[#1a1c1b]/90 backdrop-blur-sm
                      border-t border-[#06f988]/8 px-6 flex items-center justify-between
                      text-[9px] font-mono text-slate-600 uppercase tracking-widest z-30">
      <div className="flex items-center gap-4">
        <span className="flex items-center gap-1.5">
          <span className="w-1 h-1 rounded-full bg-[#06f988] animate-pulse" />
          System Stable
        </span>
        <span className="hidden sm:block">Uptime: 1,421h</span>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-[#06f988]/40">Nexus Core V4.2.0</span>
        <span>#9832-TX</span>
      </div>
    </footer>
  </div>
);

export default DashboardLayout;
