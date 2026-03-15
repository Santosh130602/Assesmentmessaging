import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineX } from 'react-icons/hi';
import { papersAPI } from '../../services/api';
import toast from 'react-hot-toast';

const DOMAINS = ['Computer Science', 'Biology', 'Physics', 'Chemistry', 'Mathematics', 'Social Sciences'];
const STAGES = ['Abstract Read', 'Introduction Done', 'Methodology Done', 'Results Analyzed', 'Fully Read', 'Notes Completed'];
const IMPACTS = ['High Impact', 'Medium Impact', 'Low Impact', 'Unknown'];

const EMPTY = {
  paperTitle: '', firstAuthorName: '',
  researchDomain: 'Computer Science',
  readingStage: 'Abstract Read',
  citationCount: 0,
  impactScore: 'Unknown',
  dateAdded: new Date().toISOString().split('T')[0],
};

const Label = ({ children, required }) => (
  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.15em] mb-1.5 block">
    {children} {required && <span className="text-red-400">*</span>}
  </label>
);

const AddPaperModal = ({ isOpen, onClose, onSuccess, editData = null }) => {
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const isEdit = !!editData;

  useEffect(() => {
    if (editData) {
      setForm({
        ...editData,
        dateAdded: editData.dateAdded ? editData.dateAdded.split('T')[0] : new Date().toISOString().split('T')[0],
      });
    } else {
      setForm(EMPTY);
    }
    setError('');
  }, [editData, isOpen]);

  const set = (field) => (e) => {
    const val = e.target.type === 'number' ? Number(e.target.value) : e.target.value;
    setForm(f => ({ ...f, [field]: val }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (isEdit) {
        await papersAPI.update(editData._id, form);
        toast.success('Paper updated!');
      } else {
        await papersAPI.create(form);
        toast.success('Paper added!');
      }
      onSuccess?.();
      onClose();
    } catch (err) {
      const msg = err.response?.data?.message || 'Something went wrong';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="relative w-full max-w-2xl bg-[#111413] border border-[#06f988]/15 rounded-2xl shadow-2xl overflow-hidden"
            initial={{ scale: 0.92, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.92, y: 20, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#06f988]/10 bg-[#06f988]/3">
              <div>
                <h2 className="text-lg font-black text-slate-100">{isEdit ? 'Edit Paper' : 'Add New Paper'}</h2>
                <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest mt-0.5">
                  {isEdit ? 'Update paper details' : 'Track a new research paper'}
                </p>
              </div>
              <motion.button
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400
                           hover:bg-[#242927] hover:text-[#06f988] transition-all"
                whileHover={{ rotate: 90 }}
                onClick={onClose}
              >
                <HiOutlineX className="text-lg" />
              </motion.button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                  {error}
                </div>
              )}

              {/* Paper Title */}
              <div>
                <Label required>Paper Title</Label>
                <input
                  className="input-base"
                  placeholder="e.g. Attention Is All You Need"
                  value={form.paperTitle}
                  onChange={set('paperTitle')}
                  required
                  disabled={loading}
                />
              </div>

              {/* Author */}
              <div>
                <Label required>First Author Name</Label>
                <input
                  className="input-base"
                  placeholder="e.g. Ashish Vaswani"
                  value={form.firstAuthorName}
                  onChange={set('firstAuthorName')}
                  required
                  disabled={loading}
                />
              </div>

              {/* Domain + Stage */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label required>Research Domain</Label>
                  <select className="input-base" value={form.researchDomain} onChange={set('researchDomain')} disabled={loading}>
                    {DOMAINS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <Label required>Reading Stage</Label>
                  <select className="input-base" value={form.readingStage} onChange={set('readingStage')} disabled={loading}>
                    {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              {/* Citation + Impact */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label required>Citation Count</Label>
                  <input
                    className="input-base"
                    type="number"
                    min="0"
                    value={form.citationCount}
                    onChange={set('citationCount')}
                    required
                    disabled={loading}
                  />
                </div>
                <div>
                  <Label required>Impact Score</Label>
                  <select className="input-base" value={form.impactScore} onChange={set('impactScore')} disabled={loading}>
                    {IMPACTS.map(i => <option key={i} value={i}>{i}</option>)}
                  </select>
                </div>
              </div>

              {/* Date */}
              <div>
                <Label required>Date Added</Label>
                <input
                  className="input-base"
                  type="date"
                  value={form.dateAdded}
                  onChange={set('dateAdded')}
                  required
                  disabled={loading}
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 rounded-xl border border-[#242927] text-slate-400
                             hover:bg-[#242927] hover:text-slate-100 transition-all text-sm font-semibold"
                  disabled={loading}
                >
                  Cancel
                </button>
                <motion.button
                  type="submit"
                  className={`flex-1 py-3 rounded-xl bg-[#06f988] text-[#0a0c0b] font-black text-sm
                             shadow-[0_0_20px_rgba(6,249,136,0.2)] hover:shadow-[0_0_30px_rgba(6,249,136,0.4)]
                             transition-all ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                  whileHover={!loading ? { scale: 1.02 } : {}}
                  whileTap={!loading ? { scale: 0.98 } : {}}
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-[#0a0c0b] border-t-transparent rounded-full animate-spin" />
                      Saving...
                    </span>
                  ) : (isEdit ? 'Update Paper' : 'Add Paper')}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddPaperModal;
