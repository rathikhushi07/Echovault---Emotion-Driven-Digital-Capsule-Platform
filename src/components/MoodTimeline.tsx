import React from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { MoodData } from '../contexts/MoodContext';
import { TrendingUp } from 'lucide-react';
import { format } from 'date-fns';

interface MoodTimelineProps {
  data: MoodData[];
}

const MoodTimeline: React.FC<MoodTimelineProps> = ({ data }) => {
  const chartData = data.slice(-7).map((mood, index) => ({
    name: format(mood.timestamp, 'MMM dd'),
    intensity: mood.intensity,
    emotion: mood.emotion,
    color: mood.color
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="glass-dark rounded-lg p-3 border border-white/20">
          <p className="text-white font-medium">{label}</p>
          <p className="text-slate-300 capitalize">{data.emotion}</p>
          <p className="text-slate-400 text-sm">
            {Math.round(data.intensity * 100)}% intensity
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      className="glass-dark rounded-xl p-6"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.1 }}
    >
      <div className="flex items-center gap-3 mb-4">
        <TrendingUp className="w-5 h-5 text-blue-400" />
        <h3 className="font-semibold text-white">Mood Timeline</h3>
      </div>

      <div className="h-32">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <XAxis 
              dataKey="name" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94a3b8', fontSize: 12 }}
            />
            <YAxis hide />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="intensity"
              stroke="#8b5cf6"
              strokeWidth={2}
              dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#8b5cf6', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 space-y-2">
        <h4 className="text-sm font-medium text-slate-300">Recent Emotions</h4>
        <div className="flex flex-wrap gap-2">
          {data.slice(-5).reverse().map((mood, index) => (
            <div
              key={index}
              className="flex items-center gap-2 px-2 py-1 bg-white/5 rounded-full"
            >
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: mood.color }}
              />
              <span className="text-xs text-slate-300 capitalize">{mood.emotion}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default MoodTimeline;