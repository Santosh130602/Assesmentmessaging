import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiOutlineSearch, HiOutlineFilter, HiOutlineBookmark,
  HiOutlineTrash, HiOutlinePencil, HiOutlineUpload, HiOutlineChevronDown,
  HiOutlineX, HiOutlineSortAscending
} from 'react-icons/hi';
import { FiCalendar, FiTrendingUp } from 'react-icons/fi';
import { MdAutoAwesome } from 'react-icons/md';
import { papersAPI } from '../../services/api';
import AddPaperModal from '../../components/papers/AddPaperModal';
import toast from 'react-hot-toast';

const DOMAINS  = ['Computer Science','Biology','Physics','Chemistry','Mathematics','Social Sciences'];
const STAGES   = ['Abstract Read','Introduction Done','Methodology Done','Results Analyzed','Fully Read','Notes Completed'];
const IMPACTS  = ['High Impact','Medium Impact','Low Impact','Unknown'];
const DATE_RANGES = [
  { value: 'all_time',    label: 'All Time' },
  { value: 'this_week',   label: 'This Week' },
  { value: 'this_month',  label: 'This Month' },
  { value: 'last_3_months', label: 'Last 3 Months' },
];

const STAGE_COLORS = {
  'Abstract Read':    'bg-blue-500/15 text-blue-400 border-blue-500/20',
  'Introduction Done':'bg-cyan-500/15 text-cyan-400 border-cyan-500/20',
  'Methodology Done': 'bg-yellow-500/15 text-yellow-400 border-yellow-500/20',
  'Results Analyzed': 'bg-orange-500/15 text-orange-400 border-orange-500/20',
  'Fully Read':       'bg-[#06f988]/15 text-[#06f988] border-[#06f988]/20',
  'Notes Completed':  'bg-purple-500/15 text-purple-400 border-purple-500/20',
};

const IMPACT_COLORS = {
  'High Impact':   'text-[#06f988]',
  'Medium Impact': 'text-yellow-400',
  'Low Impact':    'text-orange-400',
  'Unknown':       'text-slate-500',
};

const MultiSelect = ({ label, options, selected, onChange }) => {
  const toggle = (v) => onChange(selected.includes(v) ? selected.filter(x => x !== v) : [...selected, v]);
  return (
    <div>
      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1.5">
        <span className="w-0.5 h-3 bg-[#06f988] rounded-full" />{label}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {options.map(o => (
          <button
            key={o}
            onClick={() => toggle(o)}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all
                       ${selected.includes(o)
                         ? 'bg-[#06f988] text-[#0a0c0b]'
                         : 'bg-[#242927] text-slate-400 hover:text-slate-100'}`}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  );
};

const Research = () => {
  const [papers, setPapers]       = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading]     = useState(true);
  const [filterOpen, setFilterOpen] = useState(true);
  const [showAdd, setShowAdd]     = useState(false);
  const [editPaper, setEditPaper] = useState(null);
  const [search, setSearch]       = useState('');
  const [page, setPage]           = useState(1);

  const [filters, setFilters] = useState({
    readingStage: [],
    researchDomain: [],
    impactScore: [],
    dateRange: 'all_time',
    sortBy: 'dateAdded',
    sortOrder: 'desc',
  });

  const fetchPapers = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 9 };
      if (filters.readingStage.length) params.readingStage = filters.readingStage;
      if (filters.researchDomain.length) params.researchDomain = filters.researchDomain;
      if (filters.impactScore.length) params.impactScore = filters.impactScore;
      if (filters.dateRange !== 'all_time') params.dateRange = filters.dateRange;
      params.sortBy = filters.sortBy;
      params.sortOrder = filters.sortOrder;

      const res = await papersAPI.getAll(params);
      setPapers(res.data.data.papers || []);
      setPagination(res.data.data.pagination || {});
    } catch (err) {
      toast.error('Failed to load papers');
    } finally {
      setLoading(false);
    }
  }, [filters, page]);

  useEffect(() => { fetchPapers(); }, [fetchPapers]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this paper?')) return;
    try {
      await papersAPI.delete(id);
      toast.success('Paper deleted');
      fetchPapers();
    } catch {
      toast.error('Failed to delete');
    }
  };

  const clearFilters = () => {
    setFilters({ readingStage: [], researchDomain: [], impactScore: [], dateRange: 'all_time', sortBy: 'dateAdded', sortOrder: 'desc' });
    setPage(1);
  };

  const setFilter = (key, val) => { setFilters(f => ({ ...f, [key]: val })); setPage(1); };

  const filtered = search
    ? papers.filter(p =>
        p.paperTitle.toLowerCase().includes(search.toLowerCase()) ||
        p.firstAuthorName.toLowerCase().includes(search.toLowerCase())
      )
    : papers;

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <motion.div
        className="flex flex-wrap items-end justify-between gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className="text-4xl font-black tracking-tight text-slate-100 uppercase
                        bg-gradient-to-r from-slate-100 to-slate-400 bg-clip-text text-transparent">
            Research Library
          </h1>
          <motion.p
            className="text-[#06f988] text-sm mt-1 flex items-center gap-1.5"
            animate={{ opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#06f988] animate-pulse" />
            {pagination.total ?? '...'} peer-reviewed artifacts
          </motion.p>
        </div>

        <div className="flex gap-2.5 flex-wrap">
          {/* Search */}
          <div className="relative">
            <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm" />
            <input
              className="input-base py-2 pl-9 pr-4 text-sm w-52"
              placeholder="Search papers..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          {/* Sort */}
          <select
            className="input-base py-2 text-sm w-auto pr-8"
            value={`${filters.sortBy}_${filters.sortOrder}`}
            onChange={e => {
              const [by, order] = e.target.value.split('_');
              setFilter('sortBy', by);
              setFilter('sortOrder', order);
            }}
          >
            <option value="dateAdded_desc">Newest First</option>
            <option value="dateAdded_asc">Oldest First</option>
            <option value="citationCount_desc">Most Cited</option>
            <option value="citationCount_asc">Least Cited</option>
            <option value="paperTitle_asc">Title A–Z</option>
          </select>

          <motion.button
            className="px-4 py-2 bg-[#06f988] text-[#0a0c0b] text-xs font-black uppercase tracking-wider
                       rounded-xl flex items-center gap-2 hover:shadow-[0_0_20px_rgba(6,249,136,0.4)] transition-all"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowAdd(true)}
          >
            <HiOutlineUpload className="text-sm" />New Paper
          </motion.button>

          <motion.button
            className="p-2 bg-[#1a1c1b] border border-[#06f988]/20 text-[#06f988] rounded-xl
                       hover:bg-[#06f988]/10 transition-all"
            whileHover={{ scale: 1.03 }}
            onClick={() => setFilterOpen(o => !o)}
          >
            <HiOutlineFilter />
          </motion.button>
        </div>
      </motion.div>

      {/* Body: Grid + Filter drawer */}
      <div className="flex gap-6">
        {/* Paper grid */}
        <div className="flex-1 min-w-0">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-52 glass rounded-xl animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-slate-500">
              <MdAutoAwesome className="text-5xl mx-auto mb-3 opacity-20" />
              <p className="font-semibold">No papers found</p>
              <p className="text-sm mt-1">Try adjusting your filters or add a new paper.</p>
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.07 } } }}
              initial="hidden"
              animate="show"
            >
              <AnimatePresence>
                {filtered.map((paper, i) => (
                  <motion.div
                    key={paper._id}
                    className="group relative glass rounded-xl p-5 cursor-pointer overflow-hidden"
                    variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
                    whileHover={{ y: -5, boxShadow: '0 20px 40px -15px rgba(6,249,136,0.2)' }}
                    layout
                  >
                    {/* Hover gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#06f988]/4 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                    {/* Actions */}
                    <div className="absolute top-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                      <motion.button
                        className="w-7 h-7 bg-[#242927] rounded-lg flex items-center justify-center text-slate-400 hover:text-[#06f988] transition-colors"
                        whileHover={{ scale: 1.1 }}
                        onClick={() => { setEditPaper(paper); setShowAdd(true); }}
                      >
                        <HiOutlinePencil className="text-xs" />
                      </motion.button>
                      <motion.button
                        className="w-7 h-7 bg-[#242927] rounded-lg flex items-center justify-center text-slate-400 hover:text-red-400 transition-colors"
                        whileHover={{ scale: 1.1 }}
                        onClick={() => handleDelete(paper._id)}
                      >
                        <HiOutlineTrash className="text-xs" />
                      </motion.button>
                    </div>

                    {/* Category + Date */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-full
                                      bg-[#06f988]/10 text-[#06f988] border border-[#06f988]/15">
                        {paper.researchDomain}
                      </span>
                      <span className="text-[9px] text-slate-500 flex items-center gap-1">
                        <FiCalendar className="text-[#06f988]" />
                        {new Date(paper.dateAdded).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-sm font-bold text-slate-100 leading-snug mb-2 group-hover:text-[#06f988] transition-colors line-clamp-2 min-h-[2.8rem]">
                      {paper.paperTitle}
                    </h3>

                    {/* Author */}
                    <p className="text-xs text-slate-400 mb-3 flex items-center gap-1 truncate">
                      <span className="w-1 h-1 rounded-full bg-[#06f988] shrink-0" />
                      {paper.firstAuthorName}
                    </p>

                    {/* Meta */}
                    <div className="flex items-center gap-3 mb-3 text-[10px] text-slate-500">
                      <span className="flex items-center gap-1">
                        <FiTrendingUp className="text-[#06f988]" />
                        {paper.citationCount.toLocaleString()} citations
                      </span>
                      <span className={`font-bold ${IMPACT_COLORS[paper.impactScore]}`}>
                        {paper.impactScore}
                      </span>
                    </div>

                    {/* Reading stage */}
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border
                                     ${STAGE_COLORS[paper.readingStage] || 'bg-slate-700/30 text-slate-400 border-slate-700'}`}>
                      {paper.readingStage}
                    </span>

                    {/* Bottom hover line */}
                    <motion.div
                      className="absolute bottom-0 left-0 h-0.5 bg-[#06f988]"
                      initial={{ width: 0 }}
                      whileHover={{ width: '100%' }}
                      transition={{ duration: 0.25 }}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 text-xs text-slate-500">
              <p>Page {pagination.page} of {pagination.totalPages} ({pagination.total} total)</p>
              <div className="flex gap-2">
                <button
                  className="px-3 py-1.5 rounded-lg bg-[#1a1c1b] border border-[#06f988]/15 hover:border-[#06f988]/40 hover:text-[#06f988] transition-all disabled:opacity-30"
                  disabled={!pagination.hasPrevPage}
                  onClick={() => setPage(p => p - 1)}
                >
                  ← Prev
                </button>
                <button
                  className="px-3 py-1.5 rounded-lg bg-[#1a1c1b] border border-[#06f988]/15 hover:border-[#06f988]/40 hover:text-[#06f988] transition-all disabled:opacity-30"
                  disabled={!pagination.hasNextPage}
                  onClick={() => setPage(p => p + 1)}
                >
                  Next →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Filter Panel */}
        <AnimatePresence>
          {filterOpen && (
            <motion.aside
              className="w-64 shrink-0 glass rounded-xl p-5 space-y-6 sticky top-20 h-fit"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black text-slate-100 uppercase tracking-wider flex items-center gap-1.5">
                  <HiOutlineFilter className="text-[#06f988]" />Filters
                </h4>
                <button
                  className="text-[9px] text-[#06f988] font-bold uppercase tracking-widest hover:underline"
                  onClick={clearFilters}
                >
                  Clear All
                </button>
              </div>

              <MultiSelect label="Reading Stage" options={STAGES}
                selected={filters.readingStage}
                onChange={v => setFilter('readingStage', v)}
              />
              <MultiSelect label="Research Domain" options={DOMAINS}
                selected={filters.researchDomain}
                onChange={v => setFilter('researchDomain', v)}
              />
              <MultiSelect label="Impact Score" options={IMPACTS}
                selected={filters.impactScore}
                onChange={v => setFilter('impactScore', v)}
              />

              {/* Date Range */}
              <div>
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                  <span className="w-0.5 h-3 bg-[#06f988] rounded-full" />Date Range
                </p>
                <div className="space-y-1.5">
                  {DATE_RANGES.map(r => (
                    <label key={r.value} className="flex items-center gap-2 cursor-pointer group">
                      <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all
                                      ${filters.dateRange === r.value
                                        ? 'bg-[#06f988]/20 border-[#06f988]'
                                        : 'border-[#06f988]/20 group-hover:border-[#06f988]/50'}`}
                           onClick={() => setFilter('dateRange', r.value)}
                      >
                        {filters.dateRange === r.value && (
                          <div className="w-2 h-2 rounded-sm bg-[#06f988]" />
                        )}
                      </div>
                      <span className="text-xs text-slate-400 group-hover:text-slate-200 transition-colors">{r.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <motion.button
                className="w-full py-3 rounded-xl bg-[#06f988] text-[#0a0c0b] text-xs font-black uppercase tracking-widest
                           hover:shadow-[0_0_20px_rgba(6,249,136,0.4)] transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => { setPage(1); fetchPapers(); }}
              >
                Apply Filters
              </motion.button>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>

      {/* Modal */}
      <AddPaperModal
        isOpen={showAdd}
        onClose={() => { setShowAdd(false); setEditPaper(null); }}
        onSuccess={() => { fetchPapers(); }}
        editData={editPaper}
      />
    </div>
  );
};

export default Research;
