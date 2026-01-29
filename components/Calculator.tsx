import React, { useState, useEffect } from 'react';
import { Language, MetalPrices, CurrencyPrices } from '../types';
import { TRANSLATIONS } from '../constants';

interface CalculatorProps {
  lang: Language;
  metals: MetalPrices;
  currencies: CurrencyPrices;
  manualOunce: string;
  setManualOunce: (val: string) => void;
  isManualActive: boolean;
  setIsManualActive: (active: boolean) => void;
  manualSyp: string;
  setManualSyp: (val: string) => void;
  isManualSypActive: boolean;
  setIsManualSypActive: (active: boolean) => void;
}

const Calculator: React.FC<CalculatorProps> = ({ 
  lang, metals, currencies, 
  manualOunce, setManualOunce, isManualActive, setIsManualActive,
  manualSyp, setManualSyp, isManualSypActive, setIsManualSypActive
}) => {
  const t = TRANSLATIONS[lang];
  const [amount, setAmount] = useState<string>("1");
  const [from, setFrom] = useState<string>("USD");
  const [to, setTo] = useState<string>("GOLD24");
  const [result, setResult] = useState<number>(0);

  const options = [
    { value: "USD", label: lang === 'ar' ? 'دولار أمريكي' : 'US Dollar' },
    { value: "GOLD24", label: t.gold24 },
    { value: "GOLD21", label: t.gold21 },
    { value: "GOLD18", label: t.gold18 },
    { value: "TRY", label: lang === 'ar' ? 'ليرة تركية' : 'Turkish Lira' },
    { value: "EUR", label: lang === 'ar' ? 'يورو' : 'Euro' },
    { value: "SYP", label: lang === 'ar' ? 'ليرة سورية' : 'Syrian Pound' },
  ];

  const getRate = (symbol: string): number => {
    switch (symbol) {
      case "USD": return 1;
      case "GOLD24": return metals.gold24;
      case "GOLD21": return metals.gold21;
      case "GOLD18": return metals.gold18;
      case "TRY": return 1 / currencies.usdTrySell;
      case "EUR": return currencies.usdEurSell;
      case "SYP": return 1 / currencies.usdSypSell;
      default: return 1;
    }
  };

  useEffect(() => {
    const fromRate = getRate(from);
    const toRate = getRate(to);
    const val = parseFloat(amount) || 0;
    setResult((val * fromRate) / toRate);
  }, [amount, from, to, metals, currencies]);

  return (
    <div className="space-y-6 h-full">
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-gray-800 dark:text-white">
          <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
          {t.calculator}
        </h3>
        
        <div className="space-y-4 mb-8">
           <label className="text-[10px] font-bold uppercase text-gray-400">{t.amount}</label>
          <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full bg-gray-50 dark:bg-gray-700 border-none rounded-2xl px-4 py-3 text-gray-800 dark:text-white font-bold focus:ring-2 ring-yellow-500/20" />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold uppercase text-gray-400">{t.from}</label>
              <select value={from} onChange={(e) => setFrom(e.target.value)} className="w-full mt-1 bg-gray-50 dark:bg-gray-700 border-none rounded-2xl p-3 text-sm font-bold dark:text-white focus:ring-2 ring-yellow-500/20">{options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}</select>
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase text-gray-400">{t.to}</label>
              <select value={to} onChange={(e) => setTo(e.target.value)} className="w-full mt-1 bg-gray-50 dark:bg-gray-700 border-none rounded-2xl p-3 text-sm font-bold dark:text-white focus:ring-2 ring-yellow-500/20">{options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}</select>
            </div>
          </div>
          <div className="mt-4 p-4 bg-yellow-500/5 dark:bg-yellow-500/10 rounded-2xl border border-yellow-500/10 text-center">
            <span className="block text-[10px] font-bold text-yellow-600 dark:text-yellow-400 uppercase mb-1">{t.result}</span>
            <div className="text-2xl font-black text-gray-900 dark:text-white break-all">{result.toLocaleString(undefined, { maximumFractionDigits: 3 })}</div>
          </div>
        </div>

        <hr className="border-gray-100 dark:border-gray-700 my-6" />

        <div className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-gray-400 uppercase">{t.manualOunce}</label>
            <div className="flex gap-2">
              <input 
                type="number" 
                value={manualOunce} 
                onChange={(e) => setManualOunce(e.target.value)}
                className="bg-gray-50 dark:bg-gray-700 flex-1 px-4 py-2 rounded-xl text-sm font-bold dark:text-white border-none focus:ring-2 ring-yellow-500/20"
                placeholder="2918.50"
              />
              <button 
                onClick={() => setIsManualActive(!isManualActive)}
                className={`px-4 py-2 rounded-xl text-[10px] font-bold transition-all ${isManualActive ? 'bg-orange-500 text-white' : 'bg-gray-100 dark:bg-gray-700 dark:text-gray-300'}`}
              >
                {isManualActive ? t.cancel : t.edit}
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-gray-400 uppercase">{t.manualSyp}</label>
            <div className="flex gap-2">
              <input 
                type="number" 
                value={manualSyp} 
                onChange={(e) => setManualSyp(e.target.value)}
                className="bg-gray-50 dark:bg-gray-700 flex-1 px-4 py-2 rounded-xl text-sm font-bold dark:text-white border-none focus:ring-2 ring-yellow-500/20"
                placeholder="15000"
              />
              <button 
                onClick={() => setIsManualSypActive(!isManualSypActive)}
                className={`px-4 py-2 rounded-xl text-[10px] font-bold transition-all ${isManualSypActive ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 dark:text-gray-300'}`}
              >
                {isManualSypActive ? t.cancel : t.edit}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calculator;