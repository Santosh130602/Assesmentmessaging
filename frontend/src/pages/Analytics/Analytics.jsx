import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  ScatterChart, Scatter, CartesianGrid, Legend, FunnelChart, Funnel, LabelList, Cell,
  AreaChart, Area
} from 'recharts';
import { FiRefreshCw } from 'react-icons/fi';
import { HiOutlineBolt } from 'react-icons/hi';
import { MdScatterPlot, MdDonutLarge, MdShowChart, MdTableChart } from 'react-icons/md';
import { analyticsAPI } from '../../services/api';
import toast from 'react-hot-toast';

const IMPACT_COLORS = {
  'High Impact': '#06f988',
  'Medium Impact': '#facc15',
  'Low Impact': '#f97316',
  'Unknown': '#64748b',
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#1a1c1b] border border-[#06f988]/20 rounded-lg p-3 text-xs shadow-xl">
      {label && <p className="text-[#06f988] font-bold mb-1">{label}</p>}
      {payload.map((p, i) => (
        <p key={i} className="text-slate-300" style={{ color: p.color }}>
          {p.name}: <span className="font-bold">{typeof p.value === 'number' ? p.value.toFixed(0) : p.value}</span>
        </p>
      ))}
    </div>
  );
};

const SectionCard = ({ title, subtitle, icon: Icon, children, className = '' }) => (
  <motion.div
    className={`glass rounded-xl p-6 ${className}`}
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.2 }}
    transition={{ duration: 0.5 }}
  >
    <div className="flex items-start gap-2 mb-5">
      <div>
        <h2 className="text-base font-black text-slate-100 uppercase tracking-tight flex items-center gap-2">
          {Icon && <Icon className="text-[#06f988] text-lg" />}
          {title}
        </h2>
        {subtitle && <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-0.5">{subtitle}</p>}
      </div>
    </div>
    {children}
  </motion.div>
);

const Analytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await analyticsAPI.getAll();
      setData(res.data.data);
    } catch {
      toast.error('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-12 w-64 bg-[#1a1c1b] rounded-xl animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {[1,2,3,4].map(i => <div key={i} className="h-64 glass rounded-xl animate-pulse" />)}
        </div>
      </div>
    );
  }

  const { funnel = [], scatterPlot = [], domainMatrix = [], summary = {} } = data || {};

  // Prepare funnel data
  const funnelData = funnel.map(f => ({ name: f.stage, value: f.count, fill: '#06f988' }));

  // Scatter data grouped by impact
  const scatterByImpact = {};
  scatterPlot.forEach(p => {
    const key = p.impactScore;
    if (!scatterByImpact[key]) scatterByImpact[key] = [];
    scatterByImpact[key].push({ x: p.citationCount, y: Math.random() * 100, title: p.title });
  });

  // Stacked bar data
  const stackedData = domainMatrix.map(d => {
    const row = { domain: d.domain.replace(' Sciences', '\nSci.').replace('Computer ', 'CS\n') };
    d.stages.forEach(s => { row[s.stage] = s.count; });
    return row;
  });

  const STAGE_COLORS_ARR = ['#06f988','#4aff9e','#facc15','#f97316','#818cf8','#f472b6'];

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <motion.div
        className="flex flex-wrap items-end justify-between gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className="text-4xl font-black tracking-tight uppercase bg-gradient-to-r from-slate-100 to-slate-400 bg-clip-text text-transparent">
            Operational Intelligence
          </h1>
          <motion.p
            className="text-[#06f988] text-sm mt-1 flex items-center gap-1.5"
            animate={{ opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#06f988] animate-pulse" />
            Status: Active — Real-time analytics
          </motion.p>
        </div>
        <motion.button
          className="px-5 py-2.5 bg-[#06f988] text-[#0a0c0b] text-xs font-black uppercase tracking-wider
                     rounded-xl flex items-center gap-2 hover:shadow-[0_0_25px_rgba(6,249,136,0.4)] transition-all"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={fetchData}
        >
          <FiRefreshCw className="text-sm" />Refresh Data
        </motion.button>
      </motion.div>

      {/* Summary Cards */}
      <motion.div
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } }}
        initial="hidden"
        animate="show"
      >
        {[
          { label: 'Total Papers', value: summary.total ?? 0, sub: 'tracked' },
          { label: 'Fully Read', value: summary.fullyRead ?? 0, sub: 'completed' },
          { label: 'Completion Rate', value: `${summary.completionRate ?? 0}%`, sub: 'of total' },
          { label: 'Avg Citations', value: summary.avgCitationsPerDomain?.[0]?.avgCitations?.toFixed(0) ?? '—', sub: 'per domain' },
        ].map((card, i) => (
          <motion.div
            key={i}
            className="glass rounded-xl p-4"
            variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0 } }}
            whileHover={{ y: -3 }}
          >
            <p className="text-[9px] text-slate-500 uppercase tracking-widest font-mono mb-1">{card.label}</p>
            <p className="text-3xl font-black text-[#06f988]">{card.value}</p>
            <p className="text-[9px] text-slate-600 mt-0.5">{card.sub}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Row 1: Funnel + Scatter */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Funnel */}
        <SectionCard
          title="Reading Stage Funnel"
          subtitle="Paper count at each reading stage"
          icon={MdDonutLarge}
        >
          {funnelData.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-slate-500 text-sm">No data yet</div>
          ) : (
            <div className="space-y-2.5">
              {funnelData.map((item, i) => {
                const maxVal = Math.max(...funnelData.map(f => f.value), 1);
                const pct = (item.value / maxVal) * 100;
                return (
                  <motion.div key={item.name} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">{item.name}</span>
                      <span className="text-[#06f988] font-bold">{item.value}</span>
                    </div>
                    <div className="h-6 bg-[#242927] rounded-lg overflow-hidden">
                      <motion.div
                        className="h-full rounded-lg flex items-center px-2"
                        style={{
                          background: `linear-gradient(to right, #06f988, #4aff9e)`,
                          opacity: 0.3 + (i / funnelData.length) * 0.7,
                        }}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${pct}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: i * 0.1 }}
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </SectionCard>

        {/* Scatter */}
        <SectionCard
          title="Citation vs Impact"
          subtitle="Papers grouped by impact score"
          icon={MdScatterPlot}
        >
          {scatterPlot.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-slate-500 text-sm">No data yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: -10 }}>
                <CartesianGrid stroke="rgba(6,249,136,0.06)" />
                <XAxis
                  dataKey="x" name="Citations" type="number"
                  tick={{ fill: '#64748b', fontSize: 10 }}
                  label={{ value: 'Citations', position: 'insideBottom', offset: -5, fill: '#64748b', fontSize: 10 }}
                />
                <YAxis dataKey="y" name="Score" type="number" tick={{ fill: '#64748b', fontSize: 10 }} />
                <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '4 4', stroke: 'rgba(6,249,136,0.2)' }} />
                <Legend wrapperStyle={{ fontSize: 10, color: '#64748b' }} />
                {Object.entries(scatterByImpact).map(([impact, points]) => (
                  <Scatter
                    key={impact}
                    name={impact}
                    data={points}
                    fill={IMPACT_COLORS[impact] || '#64748b'}
                    opacity={0.8}
                  />
                ))}
              </ScatterChart>
            </ResponsiveContainer>
          )}
        </SectionCard>
      </div>

      {/* Row 2: Stacked Bar */}
      <SectionCard
        title="Domain × Reading Stage"
        subtitle="Stacked distribution of papers by domain and reading stage"
        icon={MdShowChart}
      >
        {stackedData.length === 0 ? (
          <div className="h-64 flex items-center justify-center text-slate-500 text-sm">No data yet</div>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={stackedData} margin={{ top: 10, right: 10, bottom: 20, left: -10 }}>
              <CartesianGrid stroke="rgba(6,249,136,0.06)" vertical={false} />
              <XAxis dataKey="domain" tick={{ fill: '#64748b', fontSize: 9 }} />
              <YAxis tick={{ fill: '#64748b', fontSize: 10 }} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(6,249,136,0.04)' }} />
              <Legend wrapperStyle={{ fontSize: 9, color: '#64748b' }} />
              {['Abstract Read','Introduction Done','Methodology Done','Results Analyzed','Fully Read','Notes Completed'].map((stage, i) => (
                <Bar key={stage} dataKey={stage} stackId="a" fill={STAGE_COLORS_ARR[i]} opacity={0.85} radius={i === 5 ? [4,4,0,0] : [0,0,0,0]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        )}
      </SectionCard>

      {/* Row 3: Summary table */}
      <SectionCard
        title="Avg Citations per Domain"
        subtitle="Summary breakdown by research domain"
        icon={MdTableChart}
      >
        {!summary.avgCitationsPerDomain?.length ? (
          <div className="h-32 flex items-center justify-center text-slate-500 text-sm">No data yet</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-[#06f988]/10">
                  {['Domain', 'Papers', 'Avg Citations', 'Share'].map(h => (
                    <th key={h} className="text-left py-2 px-3 text-[9px] font-black text-slate-500 uppercase tracking-widest">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#06f988]/5">
                {summary.avgCitationsPerDomain.map((row, i) => {
                  const share = summary.total > 0 ? ((row.paperCount / summary.total) * 100).toFixed(1) : 0;
                  return (
                    <motion.tr
                      key={row.domain}
                      className="hover:bg-[#06f988]/3 transition-colors"
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <td className="py-3 px-3 text-slate-200 font-medium text-xs">{row.domain}</td>
                      <td className="py-3 px-3 text-slate-400 text-xs">{row.paperCount}</td>
                      <td className="py-3 px-3 text-[#06f988] font-bold text-xs">{row.avgCitations.toLocaleString()}</td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-[#242927] rounded-full overflow-hidden">
                            <motion.div
                              className="h-full bg-gradient-to-r from-[#06f988] to-[#4aff9e] rounded-full"
                              initial={{ width: 0 }}
                              whileInView={{ width: `${share}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.8, delay: i * 0.05 }}
                            />
                          </div>
                          <span className="text-[9px] text-slate-500 shrink-0">{share}%</span>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>
    </div>
  );
};

export default Analytics;
