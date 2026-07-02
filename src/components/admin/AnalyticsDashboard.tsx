import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FiUsers, FiFilm, FiEye, FiDollarSign,
  FiTrendingUp, FiTrendingDown, FiBarChart2,
  FiActivity, FiMonitor,
} from 'react-icons/fi';
import { GlassCard } from '../common/GlassCard';

interface AnalyticsDashboardProps {
  detailed?: boolean;
}

const statCards = [
  { label: 'Total Users', value: '12,847', change: '+12.5%', icon: FiUsers, color: 'from-accent-blue to-blue-600', up: true },
  { label: 'Total Movies', value: '2,341', change: '+5.2%', icon: FiFilm, color: 'from-streamly-red to-red-600', up: true },
  { label: 'Total Views', value: '1.2M', change: '+23.1%', icon: FiEye, color: 'from-accent-purple to-purple-600', up: true },
  { label: 'Revenue', value: '$45.2K', change: '+18.7%', icon: FiDollarSign, color: 'from-green-500 to-green-600', up: true },
];

const chartPlaceholders = [
  { title: 'Monthly Views', data: [40, 60, 45, 80, 65, 90, 75, 95, 85, 100, 78, 88] },
  { title: 'User Growth', data: [20, 35, 30, 50, 45, 65, 55, 70, 60, 85, 75, 90] },
  { title: 'Revenue (Monthly)', data: [30, 45, 38, 58, 50, 72, 62, 80, 68, 88, 75, 95] },
];

export const AnalyticsDashboard = ({ detailed = false }: AnalyticsDashboardProps) => {
  const [animatedValues, setAnimatedValues] = useState(statCards.map(() => 0));

  useEffect(() => {
    const intervals = statCards.map((card, i) => {
      const target = parseInt(card.value.replace(/[^0-9]/g, ''));
      return setInterval(() => {
        setAnimatedValues((prev) => {
          const next = [...prev];
          if (next[i] < target) {
            next[i] = Math.min(next[i] + Math.ceil(target / 50), target);
          }
          return next;
        });
      }, 30);
    });
    return () => intervals.forEach(clearInterval);
  }, []);

  const displayedStats = detailed ? statCards : statCards.slice(0, 4);
  const displayedCharts = detailed ? chartPlaceholders : chartPlaceholders.slice(0, 2);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {displayedStats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <GlassCard className="p-4 md:p-5" glow>
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                  <stat.icon size={18} className="text-white" />
                </div>
                <span className={`flex items-center gap-0.5 text-xs font-medium ${
                  stat.up ? 'text-green-500' : 'text-red-500'
                }`}>
                  {stat.up ? <FiTrendingUp size={12} /> : <FiTrendingDown size={12} />}
                  {stat.change}
                </span>
              </div>
              <p className="text-2xl font-bold text-white">
                {stat.value.includes('M') || stat.value.includes('K')
                  ? stat.value
                  : animatedValues[i].toLocaleString()
                }
              </p>
              <p className="text-xs text-streamly-gray mt-1">{stat.label}</p>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {displayedCharts.map((chart, chartIdx) => (
          <GlassCard key={chart.title} className="p-5 md:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <FiBarChart2 size={16} className="text-streamly-red" />
                {chart.title}
              </h3>
              <span className="text-xs text-streamly-gray">Last 12 months</span>
            </div>
            <div className="relative h-40 md:h-48">
              <div className="absolute inset-0 flex items-end gap-1.5 md:gap-2">
                {chart.data.map((value, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${value}%` }}
                    transition={{ delay: i * 0.03, duration: 0.5, ease: 'easeOut' }}
                    className="flex-1 rounded-t-sm bg-gradient-to-t from-streamly-red/60 to-streamly-red/30 hover:from-streamly-red hover:to-streamly-red/60 transition-colors cursor-pointer relative group/chart"
                  >
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-streamly-darker text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover/chart:opacity-100 whitespace-nowrap transition-opacity">
                      {value}%
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="absolute bottom-0 left-0 right-0 flex justify-between text-[10px] text-streamly-gray mt-1">
                <span>Jan</span>
                <span>Jun</span>
                <span>Dec</span>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {detailed && (
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <FiActivity size={16} className="text-streamly-red" />
              Platform Overview
            </h3>
            <select className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-streamly-red/50">
              <option>This Month</option>
              <option>Last Month</option>
              <option>This Year</option>
            </select>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Active Users', value: '3,842', sub: '1,230 new' },
              { label: 'Avg. Session', value: '24m', sub: '3m increase' },
              { label: 'Completion Rate', value: '87%', sub: '5% increase' },
              { label: 'Net Growth', value: '+12.5%', sub: 'vs last month' },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="p-4 bg-white/5 rounded-lg border border-white/10"
              >
                <p className="text-xs text-streamly-gray">{item.label}</p>
                <p className="text-lg font-bold text-white mt-1">{item.value}</p>
                <p className="text-xs text-green-500 mt-1">{item.sub}</p>
              </motion.div>
            ))}
          </div>
        </GlassCard>
      )}
    </div>
  );
};
