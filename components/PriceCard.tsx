
import React from 'react';

interface PriceCardProps {
  label: string;
  value: string; 
  secondaryValue?: string; 
  unit: string;
  change?: number;
  icon?: React.ReactNode;
  isPrimary?: boolean;
  buySellLabels?: { buy: string; sell: string }; 
  isLive?: boolean;
  onClick?: () => void;
  isActive?: boolean;
  isSmall?: boolean;
}

const PriceCard: React.FC<PriceCardProps> = ({ 
  label, value, secondaryValue, unit, change, icon, isLive, onClick, isActive, buySellLabels, isSmall = false 
}) => {
  const isUp = change !== undefined ? change > 0 : null;
  
  const isSilver = label.includes('فضة') || label.includes('Silver');
  const isCurrency = secondaryValue !== undefined;

  const getVariantStyles = () => {
    if (isActive) {
        if (isSilver) return 'ring-[2px] ring-gray-300 transform scale-[1.02] z-10 shadow-lg bg-gray-800/90 border-gray-300';
        if (isCurrency) return 'ring-[2px] ring-blue-500 transform scale-[1.02] z-10 shadow-lg bg-gray-800/90 border-blue-500';
        return 'ring-[2px] ring-[#EAB308] transform scale-[1.02] z-10 shadow-lg bg-gray-800/90 border-[#EAB308]';
    }
    return 'bg-gray-900/40 border-white/5 hover:border-white/10 shadow-md';
  };

  const getTextColor = () => {
    if (isSilver) return 'text-gray-100';
    if (isCurrency) return 'text-blue-400';
    return 'text-[#EAB308]';
  };

  // تنسيق الشريط العلوي الصغير
  if (isSmall) {
    return (
      <div 
        onClick={onClick}
        className={`
        relative overflow-hidden p-3 rounded-xl border transition-all duration-300 cursor-pointer min-w-[160px]
        backdrop-blur-xl ${getVariantStyles()}
      `}>
        <div className="flex justify-between items-center mb-1">
           <span className="text-[8px] font-black uppercase tracking-widest text-white/60 truncate">{label}</span>
        </div>
        <div className="flex items-baseline gap-1">
          <h3 className={`text-sm font-black tracking-tight ${getTextColor()}`}>{value}</h3>
          <span className="text-[7px] font-bold text-white/30 uppercase">{unit}</span>
        </div>
      </div>
    );
  }

  // تنسيق البطاقات الرئيسية في الشبكة (تم تصغيرها للجوال)
  return (
    <div 
      onClick={onClick}
      className={`
      relative overflow-hidden p-4 md:p-6 rounded-[1.5rem] md:rounded-[2.5rem] border transition-all duration-300 cursor-pointer w-full
      backdrop-blur-xl ${getVariantStyles()}
    `}>
      <div className="flex justify-between items-start mb-4 md:mb-6">
        <div className="flex flex-col">
          <span className="text-[10px] md:text-[12px] font-black uppercase tracking-wider text-white/80">
            {label}
          </span>
          {isLive !== undefined && (
            <div className="flex items-center gap-1.5 mt-1">
               <span className={`w-1.5 h-1.5 rounded-full ${isLive ? 'bg-green-500 shadow-[0_0_5px_#22c55e]' : 'bg-orange-500 animate-pulse'}`}></span>
               <span className={`text-[8px] font-black uppercase tracking-tight ${isLive ? 'text-green-400' : 'text-orange-400'}`}>
                {isLive ? 'LIVE' : 'WAIT'}
              </span>
            </div>
          )}
        </div>
        <div className={`p-2 md:p-3 rounded-xl bg-black/40 border border-white/5 ${getTextColor()}`}>
          {icon || (
            <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          )}
        </div>
      </div>

      {secondaryValue ? (
        <div className="grid grid-cols-2 gap-3 md:gap-6 relative">
          <div className="border-r border-white/10 pr-2">
            <span className="block text-[8px] font-black text-white/40 uppercase mb-1 tracking-tighter">{buySellLabels?.sell}</span>
            <h3 className={`text-xl md:text-2xl font-black tracking-tighter ${getTextColor()}`}>{secondaryValue}</h3>
          </div>
          <div className="pl-1">
            <span className="block text-[8px] font-black text-white/40 uppercase mb-1 tracking-tighter">{buySellLabels?.buy}</span>
            <h3 className={`text-xl md:text-2xl font-black tracking-tighter ${getTextColor()}`}>{value}</h3>
          </div>
        </div>
      ) : (
        <div className="flex items-baseline gap-1">
          <span className={`text-lg md:text-xl font-black ${getTextColor()}`}>$</span>
          <h3 className={`text-2xl md:text-4xl font-black tracking-tighter ${getTextColor()}`}>{value}</h3>
          <span className="text-[8px] md:text-[10px] font-black text-white/40 uppercase tracking-widest ml-0.5">{unit}</span>
        </div>
      )}

      {change !== undefined && change !== 0 && (
        <div className={`mt-4 flex items-center gap-1.5 px-3 py-1 rounded-xl w-fit ${isUp ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'} border border-white/5`}>
          <span className="text-[10px]">{isUp ? '▲' : '▼'}</span>
          <span className="text-[11px] font-black">{Math.abs(change).toFixed(2)}%</span>
        </div>
      )}
      
      <div className={`absolute -bottom-6 -right-6 w-16 h-16 rounded-full blur-[40px] pointer-events-none opacity-10 ${isSilver ? 'bg-white' : 'bg-yellow-500'}`}></div>
    </div>
  );
};

export default PriceCard;
