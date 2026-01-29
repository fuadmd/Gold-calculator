import React, { useState } from 'react';
import { Language, MetalPrices, CurrencyPrices, PortfolioItem, PortfolioItemType, MetalPurity, CurrencyCode } from '../types';
import { TRANSLATIONS } from '../constants';

interface PortfolioProps {
  lang: Language;
  metals: MetalPrices;
  currencies: CurrencyPrices;
  portfolio: PortfolioItem[];
  setPortfolio: React.Dispatch<React.SetStateAction<PortfolioItem[]>>;
}

const Portfolio: React.FC<PortfolioProps> = ({ lang, metals, currencies, portfolio, setPortfolio }) => {
  const t = TRANSLATIONS[lang];
  const [showAddForm, setShowAddForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [type, setType] = useState<PortfolioItemType>('metal');
  const [purity, setPurity] = useState<MetalPurity>('24K');
  const [currency, setCurrency] = useState<CurrencyCode>('USD');
  const [amount, setAmount] = useState<string>("");

  const resetForm = () => {
    setAmount("");
    setEditId(null);
    setShowAddForm(false);
  };

  const handleEdit = (item: PortfolioItem) => {
    setEditId(item.id);
    setType(item.type);
    if (item.type === 'metal') setPurity(item.purity || '24K');
    else setCurrency(item.currency || 'USD');
    setAmount(item.amount.toString());
    setShowAddForm(true);
    // التمرير لأعلى النموذج تلقائياً
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const saveItem = () => {
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) return;
    
    const newItem: PortfolioItem = {
      id: editId || Date.now().toString(),
      type,
      amount: parseFloat(amount),
      ...(type === 'metal' ? { purity } : { currency })
    };

    if (editId) {
      setPortfolio(prev => prev.map(item => item.id === editId ? newItem : item));
    } else {
      setPortfolio(prev => [...prev, newItem]);
    }
    resetForm();
  };

  const deleteItem = (id: string) => {
    const msg = lang === 'ar' ? 'هل أنت متأكد من حذف هذا العنصر من محفظتك؟' : 'Are you sure you want to delete this item?';
    if (window.confirm(msg)) {
      setPortfolio(prev => prev.filter(item => item.id !== id));
    }
  };

  const getItemValue = (item: PortfolioItem): { usd: number; syp: number } => {
    let usd = 0;
    const sypRate = currencies.usdSypSell;

    if (item.type === 'metal') {
      const pricePerGram = item.purity === '24K' ? metals.gold24 : item.purity === '21K' ? metals.gold21 : metals.gold18;
      usd = item.amount * pricePerGram;
    } else {
      const rate = item.currency === 'USD' ? 1 : 
                   item.currency === 'TRY' ? 1 / currencies.usdTrySell :
                   item.currency === 'EUR' ? currencies.usdEurSell :
                   1 / currencies.usdSypSell;
      usd = item.amount * rate;
    }

    return { usd, syp: usd * sypRate };
  };

  const totals = portfolio.reduce((acc, item) => {
    const vals = getItemValue(item);
    return { usd: acc.usd + vals.usd, syp: acc.syp + vals.syp };
  }, { usd: 0, syp: 0 });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold flex items-center gap-2 text-gray-800 dark:text-white">
          <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
          {t.portfolio}
        </h3>
        <button 
          onClick={() => { editId ? resetForm() : setShowAddForm(!showAddForm); }}
          className={`p-2 rounded-xl transition-all ${showAddForm ? 'bg-red-500 text-white' : 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'}`}
        >
          {showAddForm ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          )}
        </button>
      </div>

      {showAddForm && (
        <div className="space-y-4 mb-8 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-2xl animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="grid grid-cols-2 gap-2">
            <button 
              onClick={() => setType('metal')}
              className={`py-2.5 rounded-xl text-xs font-black transition-all ${type === 'metal' ? 'bg-yellow-500 text-white shadow-md shadow-yellow-500/10' : 'bg-gray-200 dark:bg-gray-700 text-gray-600'}`}
            >
              {t.metals}
            </button>
            <button 
              onClick={() => setType('currency')}
              className={`py-2.5 rounded-xl text-xs font-black transition-all ${type === 'currency' ? 'bg-blue-500 text-white shadow-md shadow-blue-500/10' : 'bg-gray-200 dark:bg-gray-700 text-gray-600'}`}
            >
              {t.currencies}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase">{type === 'metal' ? t.purity : t.currencyLabel}</label>
              {type === 'metal' ? (
                <select value={purity} onChange={(e) => setPurity(e.target.value as MetalPurity)} className="bg-white dark:bg-gray-800 border-none rounded-xl p-3 text-xs font-bold dark:text-white focus:ring-2 ring-yellow-500/20">
                  <option value="24K">{t.gold24}</option>
                  <option value="21K">{t.gold21}</option>
                  <option value="18K">{t.gold18}</option>
                </select>
              ) : (
                <select value={currency} onChange={(e) => setCurrency(e.target.value as CurrencyCode)} className="bg-white dark:bg-gray-800 border-none rounded-xl p-3 text-xs font-bold dark:text-white focus:ring-2 ring-blue-500/20">
                  <option value="USD">USD</option>
                  <option value="TRY">TRY</option>
                  <option value="EUR">EUR</option>
                  <option value="SYP">SYP</option>
                </select>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase">{type === 'metal' ? t.weight : t.amount}</label>
              <input 
                type="number" 
                value={amount} 
                onChange={(e) => setAmount(e.target.value)} 
                placeholder="0.00"
                className="bg-white dark:bg-gray-800 border-none rounded-xl p-3 text-xs font-bold dark:text-white focus:ring-2 ring-green-500/20"
              />
            </div>
          </div>

          <button 
            onClick={saveItem}
            className={`w-full py-3 text-white rounded-xl text-xs font-black shadow-lg transition-all flex items-center justify-center gap-2 ${editId ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'}`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            {editId ? (lang === 'ar' ? 'حفظ التغييرات' : 'Save Changes') : t.addPortfolio}
          </button>
        </div>
      )}

      <div className="flex-1 space-y-3 overflow-y-auto no-scrollbar max-h-[400px]">
        {portfolio.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400 opacity-50">
            <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
            <p className="text-xs font-bold italic">{t.emptyPortfolio}</p>
          </div>
        )}
        {portfolio.map(item => {
          const vals = getItemValue(item);
          return (
            <div key={item.id} className="flex justify-between items-center p-4 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm group hover:border-blue-500/30 transition-all">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-gray-400 uppercase">
                  {item.type === 'metal' ? `${item.purity} Gold` : item.currency}
                </span>
                <span className="text-sm font-black dark:text-white leading-tight">
                  {item.amount.toLocaleString()} {item.type === 'metal' ? 'g' : ''}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex flex-col text-right">
                  <span className="text-xs font-black text-green-600 leading-tight">
                    ${vals.usd.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </span>
                  <span className="text-[10px] font-bold text-gray-500">
                    {vals.syp.toLocaleString()} L.S
                  </span>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                  <button onClick={() => handleEdit(item)} className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-xl">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                  </button>
                  <button onClick={() => deleteItem(item.id)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 p-6 bg-gray-900 dark:bg-black rounded-3xl text-white shadow-2xl relative overflow-hidden group">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-yellow-500/10 rounded-full blur-3xl group-hover:bg-yellow-500/20 transition-all"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all"></div>
        
        <div className="relative z-10 text-center">
          <span className="text-[10px] font-bold text-white/40 uppercase tracking-[0.3em] mb-4 block">
            {t.totalPortfolio}
          </span>
          <div className="text-3xl font-black text-yellow-500 mb-1 leading-tight">
            ${totals.usd.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </div>
          <div className="text-sm font-bold text-blue-400 uppercase tracking-tighter">
            {totals.syp.toLocaleString()} SYRIAN POUND
          </div>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;