import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MdDescription, MdFormatQuote, MdPendingActions, MdSpeed,
  MdHistory, MdAddCircle, MdMoreHoriz
} from 'react-icons/md';
import { HiOutlineDocumentText, HiOutlinePlusCircle, HiOutlineUserGroup } from 'react-icons/hi';
import { FiTrendingUp, FiClock } from 'react-icons/fi';
import { papersAPI, analyticsAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import AddPaperModal from '../../components/papers/AddPaperModal';
import toast from 'react-hot-toast';

const StatCard = ({ icon: Icon, label, value, badge, color, index }) => (
  <motion.div
    className="glass rounded-2xl p-5 relative overflow-hidden group hover:neon-border transition-all"
    variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
    whileHover={{ y: -4 }}
  >
    <div className="flex justify-between items-start mb-4">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center
                      ${color === 'brand' ? 'bg-[#06f988]/10 text-[#06f988]' :
                        color === 'purple' ? 'bg-purple-500/10 text-purple-400' :
                        'bg-orange-500/10 text-orange-400'}`}>
        <Icon className="text-xl" />
      </div>
      <span className={`text-[10px] font-bold px-2 py-1 rounded-lg
                       ${color === 'brand' ? 'bg-[#06f988]/10 text-[#06f988]' :
                         color === 'purple' ? 'bg-purple-500/10 text-purple-400' :
                         'bg-orange-500/10 text-orange-400'}`}>
        {badge}
      </span>
    </div>
    <p className="text-slate-400 text-xs font-medium mb-1">{label}</p>
    <h3 className="text-3xl font-black text-slate-100">{value}</h3>
    {/* Bottom progress line */}
    <motion.div
      className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-[#06f988] to-transparent"
      initial={{ width: 0 }}
      animate={{ width: '100%' }}
      transition={{ duration: 1.5, delay: index * 0.15 }}
    />
  </motion.div>
);

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [summary, setSummary] = useState(null);
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);

  const fetchData = async () => {
    try {
      const [paperRes, analyticsRes] = await Promise.all([
        papersAPI.getAll({ limit: 5, sortBy: 'createdAt', sortOrder: 'desc' }),
        analyticsAPI.getSummary(),
      ]);
      setPapers(paperRes.data.data.papers || []);
      setSummary(analyticsRes.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const statsCards = [
    {
      icon: MdDescription, label: 'Total Papers', color: 'brand',
      value: summary?.total ?? '—',
      badge: summary ? `+${Math.floor(summary.total * 0.08)} this month` : 'Loading...',
    },
    {
      icon: MdFormatQuote, label: 'Fully Read', color: 'purple',
      value: summary?.fullyRead ?? '—',
      badge: `Top 1%`,
    },
    {
      icon: MdPendingActions, label: 'In Progress', color: 'orange',
      value: summary ? (summary.total - summary.fullyRead) : '—',
      badge: `${summary?.papersByStage?.find(s => s.stage === 'Abstract Read')?.count ?? 0} new`,
    },
    {
      icon: MdSpeed, label: 'Completion Rate', color: 'brand',
      value: summary ? `${summary.completionRate}%` : '—',
      badge: summary?.completionRate > 50 ? 'On Track' : 'Keep Going',
    },
  ];

  const STAGE_COLORS = {
    'Abstract Read': 'bg-blue-500/20 text-blue-400',
    'Introduction Done': 'bg-cyan-500/20 text-cyan-400',
    'Methodology Done': 'bg-yellow-500/20 text-yellow-400',
    'Results Analyzed': 'bg-orange-500/20 text-orange-400',
    'Fully Read': 'bg-[#06f988]/20 text-[#06f988]',
    'Notes Completed': 'bg-purple-500/20 text-purple-400',
  };

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <motion.div
        className="flex flex-wrap items-end justify-between gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-slate-100">
            Dashboard
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Welcome back, <span className="text-[#06f988] font-semibold">{user?.name?.split(' ')[0] || 'Researcher'}</span>
          </p>
        </div>
        <motion.button
          className="px-5 py-2.5 bg-[#06f988] text-[#0a0c0b] text-xs font-black uppercase tracking-wider
                     rounded-xl flex items-center gap-2 hover:shadow-[0_0_25px_rgba(6,249,136,0.4)] transition-all"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => setShowAdd(true)}
        >
          <HiOutlinePlusCircle className="text-base" />
          Add Paper
        </motion.button>
      </motion.div>

      {/* Stats grid */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
        variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } }}
        initial="hidden"
        animate="show"
      >
        {statsCards.map((card, i) => <StatCard key={i} {...card} index={i} />)}
      </motion.div>

      {/* Bottom grid: activity + recent papers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <motion.div
          className="lg:col-span-2 glass rounded-2xl p-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <MdHistory className="text-[#06f988] text-xl" />
              Recent Papers
            </h3>
            <motion.button
              className="text-[#06f988] text-xs font-bold hover:underline flex items-center gap-1"
              whileHover={{ x: 3 }}
              onClick={() => navigate('/research')}
            >
              View All <FiTrendingUp className="text-xs" />
            </motion.button>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1,2,3].map(i => (
                <div key={i} className="h-16 bg-[#242927]/50 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : papers.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <HiOutlineDocumentText className="text-4xl mx-auto mb-2 opacity-30" />
              <p className="text-sm">No papers yet. Add your first paper!</p>
            </div>
          ) : (
            <div className="space-y-3 relative timeline ml-2">
              {papers.map((paper, i) => (
                <motion.div
                  key={paper._id}
                  className="relative pl-8"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.08 }}
                >
                  <div className={`absolute left-0 top-1.5 w-5 h-5 rounded-full border-2 flex items-center justify-center
                                  ${i === 0 ? 'border-[#06f988] bg-[#0a0c0b]' : 'border-[#06f988]/30 bg-[#0a0c0b]'}`}>
                    <div className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-[#06f988] animate-pulse' : 'bg-[#06f988]/30'}`} />
                  </div>
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-100 truncate">{paper.paperTitle}</p>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <HiOutlineDocumentText className="text-[#06f988] shrink-0" />
                        {paper.firstAuthorName} · {paper.researchDomain}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider
                                       ${STAGE_COLORS[paper.readingStage] || 'bg-slate-700 text-slate-300'}`}>
                        {paper.readingStage}
                      </span>
                      <span className="text-[9px] text-slate-600 flex items-center gap-1">
                        <FiClock className="text-[#06f988]" />
                        {new Date(paper.dateAdded).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Reading Stage Summary */}
        <motion.div
          className="glass rounded-2xl p-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="text-lg font-bold mb-5 flex items-center gap-2">
            <HiOutlineUserGroup className="text-[#06f988]" />
            Stage Breakdown
          </h3>

          {loading ? (
            <div className="space-y-3">
              {[1,2,3,4].map(i => (
                <div key={i} className="h-10 bg-[#242927]/50 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : summary?.papersByStage ? (
            <div className="space-y-3">
              {summary.papersByStage.map((item, i) => {
                const pct = summary.total > 0 ? (item.count / summary.total) * 100 : 0;
                return (
                  <motion.div
                    key={item.stage}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + i * 0.06 }}
                  >
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-400 truncate pr-2">{item.stage}</span>
                      <span className="text-[#06f988] font-bold shrink-0">{item.count}</span>
                    </div>
                    <div className="h-1.5 bg-[#242927] rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-[#06f988] to-[#4aff9e] rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 1, delay: 0.7 + i * 0.06 }}
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <p className="text-slate-600 text-sm text-center py-8">No data yet</p>
          )}

          <motion.button
            className="w-full mt-5 py-3 rounded-xl border-2 border-dashed border-[#06f988]/20
                       text-slate-500 hover:text-[#06f988] hover:border-[#06f988]/40 transition-all
                       flex items-center justify-center gap-2 text-sm font-bold"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/analytics')}
          >
            <MdAddCircle className="text-base" />
            View Full Analytics
          </motion.button>
        </motion.div>
      </div>

      {/* Add paper modal */}
      <AddPaperModal
        isOpen={showAdd}
        onClose={() => setShowAdd(false)}
        onSuccess={() => { fetchData(); toast.success('Paper added!'); }}
      />

      {/* Floating add button */}
      <motion.button
        className="fixed bottom-12 right-8 w-14 h-14 bg-[#06f988] rounded-2xl flex items-center justify-center
                   text-[#0a0c0b] shadow-[0_0_25px_rgba(6,249,136,0.4)] hover:shadow-[0_0_35px_rgba(6,249,136,0.6)]
                   transition-all z-40 group"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: 'spring', stiffness: 200 }}
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowAdd(true)}
        title="Add paper"
      >
        <HiOutlinePlusCircle className="text-2xl group-hover:rotate-90 transition-transform" />
      </motion.button>
    </div>
  );
};

export default Dashboard;
