import React from 'react';
import { motion } from 'framer-motion';
import { MdQueryStats } from 'react-icons/md';
import { GiNetworkBars } from 'react-icons/gi';
import { FiCpu } from 'react-icons/fi';

const LoadingSpinner = ({ message = 'INITIALIZING SYSTEM' }) => {
  return (
    <div className="min-h-screen bg-[#0a0c0b] flex items-center justify-center relative overflow-hidden">

      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#06f988]/8 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#06f988]/5 rounded-full blur-[120px]" />
      
      <div className="absolute inset-0 opacity-10 dot-bg bg-dot-md" />

      <div className="relative z-10 flex flex-col items-center gap-8">
        <div className="relative">
          <motion.div
            className="absolute inset-[-12px] rounded-full border border-[#06f988]/20"
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div
            className="absolute inset-[-24px] rounded-full border border-[#06f988]/10"
            animate={{ rotate: -360 }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div
            className="w-20 h-20 bg-[#06f988]/10 rounded-2xl flex items-center justify-center border border-[#06f988]/30"
            animate={{ boxShadow: ['0 0 20px rgba(6,249,136,0.1)', '0 0 50px rgba(6,249,136,0.3)', '0 0 20px rgba(6,249,136,0.1)'] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <MdQueryStats className="text-4xl text-[#06f988]" />
          </motion.div>

          {[
            { Icon: GiNetworkBars, pos: '-top-8 -left-8', delay: 0 },
            { Icon: FiCpu, pos: '-bottom-8 -right-8', delay: 0.3 },
          ].map(({ Icon, pos, delay }, i) => (
            <motion.div
              key={i}
              className={`absolute ${pos} w-12 h-12 bg-[#1a1c1b] rounded-xl border border-[#06f988]/20 flex items-center justify-center`}
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay }}
            >
              <Icon className="text-[#06f988] text-lg" />
            </motion.div>
          ))}
        </div>

        <div className="text-center space-y-2">
          <motion.h2
            className="text-xl font-black text-[#06f988] tracking-[0.2em] uppercase font-mono"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {message}
          </motion.h2>
          <div className="flex items-center justify-center gap-1.5">
            {[0, 0.2, 0.4].map((delay, i) => (
              <motion.span
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-[#06f988]"
                animate={{ scale: [1, 1.5, 1], opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1, repeat: Infinity, delay }}
              />
            ))}
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-56 space-y-1.5">
          <div className="h-1 bg-[#242927] rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-[#06f988] to-[#4aff9e] rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 2.5, ease: 'easeInOut' }}
            />
          </div>
        </div>

        {/* Status row */}
        <div className="flex items-center gap-6 text-[10px] font-mono text-[#4a5568] uppercase tracking-widest">
          {['CPU: 23%', 'MEM: 1.2GB', 'NET: 42Mbps'].map((s, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <motion.div
                className="w-1 h-1 rounded-full bg-[#06f988]"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
              />
              {s}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
