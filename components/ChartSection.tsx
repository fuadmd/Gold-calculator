
import React, { useEffect, useState } from 'react';
import { XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Area, AreaChart } from 'recharts';
import { Language, Period, PricePoint, ChartSymbol } from '../types';
import { TRANSLATIONS } from '../constants';
import { fetchHistoricalData } from '../services/api';

interface ChartSectionProps {
  lang: Language;
  selectedSymbol: ChartSymbol;
}

const ChartSection: React.FC<ChartSectionProps> = ({ lang, selectedSymbol }) => {
  const t = TRANSLATIONS[lang];
  const [period, setPeriod] = useState<Period>('1d');
  const [data, setData] = useState<PricePoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      setIsLoading(true);
      try {
        const points = await fetchHistoricalData(selectedSymbol, period);
        if (isMounted) {
          setData(points || []);
          setIsLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setData([]);
          setIsLoading(false);
        }
      }
    };
    load();
    return () => { isMounted = false; };
  }, [period, selectedSymbol]);

  const getChartTitle = () => {
    switch (selectedSymbol) {
      case 'GOLD': return t.goldOunce;
      case 'SILVER': return t.silverOunce;
      case 'EUR': return t.usdEur;
      case 'TRY': return t.usdTry;
      case 'SYP': return t.usdSyp;
      default: return t.history;
    }
  };

  const formatXAxis = (timestamp: number) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    const locale = lang === 'ar' ? 'ar-EG' : 'en-US';
    switch (period) {
      case '1d': return date.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit', hour12: false });
      case '1w': return date.toLocaleDateString(locale, { weekday: 'short' });
      case '1m': return date.toLocaleDateString(locale, { day: 'numeric', month: 'short' });
      case '1y': return date.toLocaleDateString(locale, { month: 'short' });
      default: return date.toLocaleDateString(locale, { year: '2-digit', month: 'short' });
    }
  };

  const periods: { key: Period; label: string }[] = [
    { key: '1d', label: t.period1d },
    { key: '1w', label: t.period1w },
    { key: '1m', label: t.period1m },
    { key: '1y', label: t.period1y },
    { key: 'all', label: t.periodAll },
  ];

  return (
    <div className="bg-white/10 dark:bg-gray-800/60 backdrop-blur-xl rounded-[1.5rem] md:rounded-[2.5rem] p-4 md:p-8 shadow-2xl border border-white/5 flex flex-col min-h-[400px] md:min-h-[450px]">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 md:gap-6 mb-8 md:mb-10">
        <div className="flex items-center gap-3 md:gap-4">
          <div className="p-2 md:p-3 bg-yellow-500/20 rounded-xl">
            <svg className="w-5 h-5 md:w-6 md:h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
            </svg>
          </div>
          <h3 className="text-lg md:text-xl font-black text-white tracking-tight">
            {getChartTitle()}
          </h3>
        </div>
        
        <div className="flex bg-black/40 p-1 rounded-xl border border-white/5 w-full sm:w-auto justify-center overflow-x-auto no-scrollbar">
          {periods.map(p => (
            <button
              key={p.key}
              onClick={() => setPeriod(p.key)}
              className={`px-3 md:px-5 py-2 text-[10px] md:text-xs font-black rounded-lg transition-all ${
                period === p.key 
                  ? 'bg-yellow-500 text-gray-900 shadow-md' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 w-full relative h-[300px]">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center z-10 bg-black/5 rounded-2xl backdrop-blur-sm">
             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
          </div>
        )}

        {!isLoading && data.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center z-10 text-gray-500 text-xs font-bold italic">
            No data available for this period
          </div>
        )}
        
        <div style={{ width: '100%', height: '300px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#eab308" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#eab308" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff" opacity={0.05} />
              <XAxis 
                dataKey="timestamp" 
                tickFormatter={formatXAxis}
                tick={{ fontSize: 9, fill: '#9ca3af', fontWeight: '600' }}
                axisLine={false}
                tickLine={false}
                minTickGap={30}
                dy={10}
              />
              <YAxis 
                orientation={lang === 'ar' ? 'right' : 'left'} 
                domain={['auto', 'auto']}
                tick={{ fontSize: 9, fill: '#9ca3af', fontWeight: 'bold' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(val) => `${val.toLocaleString(undefined, { maximumFractionDigits: 1 })}`}
                hide={false}
              />
              <Tooltip 
                contentStyle={{ 
                  borderRadius: '15px', 
                  border: '1px solid rgba(255,255,255,0.1)', 
                  backgroundColor: '#0f172a',
                  color: '#fff',
                  fontSize: '12px'
                }}
                itemStyle={{ color: '#eab308', fontWeight: 'bold' }}
                labelStyle={{ display: 'none' }}
                formatter={(val: number) => [`${val.toLocaleString(undefined, { maximumFractionDigits: 2 })}`, '']}
              />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#eab308" 
                strokeWidth={3} 
                fillOpacity={1} 
                fill="url(#colorValue)" 
                animationDuration={800}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="mt-4 flex justify-between items-center text-[9px] font-bold text-gray-500 uppercase tracking-widest border-t border-white/5 pt-4">
        <span>Source: Global Markets</span>
        <span className="text-yellow-500/50">Active</span>
      </div>
    </div>
  );
};

export default ChartSection;
