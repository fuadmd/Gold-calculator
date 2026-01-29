import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Language, Theme, Tab, MetalPrices, CurrencyPrices, PortfolioItem, ChartSymbol } from './types';
import { TRANSLATIONS } from './constants';
import Header from './components/Header';
import PriceCard from './components/PriceCard';
import Calculator from './components/Calculator';
import ChartSection from './components/ChartSection';
import Portfolio from './components/Portfolio';
import { fetchLivePrices } from './services/api';

const SmartTicker: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  useEffect(() => {
    const slider = scrollRef.current;
    if (!slider) return;
    
    let animationId: number;
    const speed = 0.5; 
    
    const animate = () => {
      if (!isDragging && slider) {
        slider.scrollLeft -= speed;
        if (slider.scrollLeft <= 0) {
          slider.scrollLeft = slider.scrollWidth / 2;
        }
      }
      animationId = requestAnimationFrame(animate);
    };
    
    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [isDragging, children]);

  return (
    <div 
      className="ticker-container no-scrollbar"
      onMouseDown={(e) => { 
        setIsDragging(true); 
        setStartX(e.pageX - (scrollRef.current?.offsetLeft || 0)); 
        setScrollLeft(scrollRef.current?.scrollLeft || 0); 
      }}
      onMouseMove={(e) => { 
        if (!isDragging) return; 
        e.preventDefault(); 
        const x = e.pageX - (scrollRef.current?.offsetLeft || 0); 
        const walk = (x - startX) * 1.5; 
        if (scrollRef.current) scrollRef.current.scrollLeft = scrollLeft - walk; 
      }}
      onMouseUp={() => setIsDragging(false)}
      onMouseLeave={() => setIsDragging(false)}
      ref={scrollRef}
      style={{ overflowX: 'hidden', whiteSpace: 'nowrap', direction: 'ltr', cursor: 'grab' }}
    >
      <div className="ticker-scroll" style={{ direction: 'rtl', display: 'flex', gap: '0.75rem', padding: '0.25rem 0' }}>
        {children}
        {children}
      </div>
    </div>
  );
};

const AboutSection: React.FC<{ lang: Language }> = ({ lang }) => {
  const [readmeLines, setReadmeLines] = useState<string[]>([]);

  useEffect(() => {
    // جلب ملف README باستخدام مسار نسبي يعمل في كل الحالات
    // نستخدم الرابط الحالي للتطبيق كقاعدة
    fetch('./README.md')
      .then(res => {
        if (!res.ok) throw new Error('File not found');
        return res.text();
      })
      .then(text => {
        setReadmeLines(text.split('\n'));
      })
      .catch(() => {
        setReadmeLines([
          "# الميزان - Mizan",
          "برمجة: فؤاد الدنيفات",
          "تطبيق متخصص لمتابعة أسعار الذهب والعملات."
        ]);
      });
  }, []);

  const formatText = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        const content = part.slice(2, -2);
        if (content.includes('+')) {
          const subParts = content.split(/(\+[\d\s]+)/g);
          return (
            <strong key={i} className="text-yellow-500 font-black">
              {subParts.map((sp, j) => sp.startsWith('+') ? <span key={j} dir="ltr" className="inline-block">{sp}</span> : sp)}
            </strong>
          );
        }
        return <strong key={i} className="text-yellow-500 font-black">{content}</strong>;
      }
      if (part.includes('+')) {
        const subParts = part.split(/(\+[\d\s]+)/g);
        return subParts.map((sp, j) => sp.startsWith('+') ? <span key={`${i}-${j}`} dir="ltr" className="inline-block">{sp}</span> : sp);
      }
      return part;
    });
  };

  return (
    <div className="bg-white/10 dark:bg-gray-800/60 backdrop-blur-xl rounded-[1.5rem] md:rounded-[2.5rem] p-6 md:p-10 shadow-2xl border border-white/5 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-yellow-500 rounded-2xl flex items-center justify-center shadow-lg shadow-yellow-500/20">
          <svg className="w-10 h-10 text-gray-900" viewBox="0 0 100 100" fill="currentColor">
            <rect x="15" y="78" width="70" height="6" rx="3" />
            <path d="M47 78 V40 Q50 37 53 40 V78 Z" />
            <path d="M25 42 V15 L50 38 L75 15 V42" fill="none" stroke="currentColor" strokeWidth="8" strokeLinejoin="round" />
            <path d="M25 42 L15 62 M25 42 L35 62" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <path d="M75 42 L65 62 M75 42 L85 62" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <path d="M12 62 A13 13 0 0 0 34 62 Z" />
            <path d="M62 62 A13 13 0 0 0 88 62 Z" />
          </svg>
        </div>
        <div className="flex flex-col">
          <h2 className="text-2xl font-black text-white leading-none">الميزان</h2>
          <span className="text-sm font-bold text-yellow-500 uppercase tracking-widest mt-1">Mizan</span>
        </div>
      </div>
      
      <div className="space-y-4 text-gray-300 leading-relaxed text-sm md:text-base">
        {readmeLines.map((line, index) => {
          const trimmed = line.trim();
          if (!trimmed) return <div key={index} className="h-2" />;
          
          if (trimmed.startsWith('# ')) {
            return <h1 key={index} className="text-3xl font-black text-white mt-8 mb-4 border-b border-white/10 pb-2">{formatText(trimmed.slice(2))}</h1>;
          }
          if (trimmed.startsWith('## ')) {
            return <h2 key={index} className="text-xl font-black text-yellow-500 mt-6 mb-3">{formatText(trimmed.slice(3))}</h2>;
          }
          if (trimmed.startsWith('- ')) {
            return (
              <div key={index} className="flex gap-3 items-start group">
                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-yellow-500 shadow-[0_0_8px_#eab308] shrink-0" />
                <p className="flex-1">{formatText(trimmed.slice(2))}</p>
              </div>
            );
          }
          if (trimmed.startsWith('**')) {
             return <p key={index} className="font-bold text-white">{formatText(trimmed)}</p>;
          }
          
          return <p key={index} className="opacity-90">{formatText(line)}</p>;
        })}
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('ar');
  const [theme, setTheme] = useState<Theme>('dark');
  const [activeTab, setTab] = useState<Tab>('home');
  const [chartSymbol, setChartSymbol] = useState<ChartSymbol>('GOLD');
  const [prices, setPrices] = useState<{ metals: MetalPrices; currencies: CurrencyPrices } | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  
  const [manualOunce, setManualOunce] = useState<string>(localStorage.getItem('manualGoldOunce') || "");
  const [isManualActive, setIsManualActive] = useState<boolean>(localStorage.getItem('isManualActive') === 'true');
  const [manualSyp, setManualSyp] = useState<string>(localStorage.getItem('manualSypRate') || "");
  const [isManualSypActive, setIsManualSypActive] = useState<boolean>(localStorage.getItem('isManualSypActive') === 'true');

  const [portfolio, setPortfolio] = useState<PortfolioItem[]>(() => {
    const saved = localStorage.getItem('personalPortfolio');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('personalPortfolio', JSON.stringify(portfolio));
  }, [portfolio]);

  const toggleTheme = () => setTheme(prev => (prev === 'light' ? 'dark' : 'light'));

  const updatePrices = useCallback(async () => {
    setIsUpdating(true);
    try {
      const data = await fetchLivePrices();
      setPrices(data);
    } catch (err) {
      console.error("Update failed");
    } finally {
      setIsUpdating(false);
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    updatePrices();
    const interval = setInterval(updatePrices, 2 * 60 * 1000); 
    return () => clearInterval(interval);
  }, [theme, updatePrices]);

  const getEffectivePrices = () => {
    if (!prices) return null;
    let currentOunce = (isManualActive && manualOunce && parseFloat(manualOunce) > 0) ? parseFloat(manualOunce) : prices.metals.goldOunce;
    let currentSypSell = (isManualSypActive && manualSyp) ? parseFloat(manualSyp) : prices.currencies.usdSypSell;
    let currentSypBuy = currentSypSell > 0 ? (currentSypSell - 150) : 0; 
    const gold24 = currentOunce / 31.1034768;
    const gold21 = (gold24 * 21) / 24;
    const tryRate = prices.currencies.usdTrySell || 34.90;
    return {
      metals: {
        ...prices.metals,
        goldOunce: currentOunce, gold24: gold24, gold21: gold21, gold18: (gold24 * 18) / 24,
        gold21Syp: currentSypSell > 0 ? (gold21 * currentSypSell) : 0,
      },
      currencies: {
        ...prices.currencies,
        usdSypBuy: currentSypBuy, usdSypSell: currentSypSell,
        trySypBuy: currentSypBuy > 0 ? (currentSypBuy / tryRate) : 0, trySypSell: currentSypSell > 0 ? (currentSypSell / tryRate) : 0
      }
    };
  };

  const activePrices = getEffectivePrices();
  const t = TRANSLATIONS[lang];

  const renderTickerContent = () => {
    if (!activePrices) return null;
    return (
      <>
        <PriceCard isSmall label={t.goldOunce} value={activePrices.metals.goldOunce.toLocaleString(undefined, { maximumFractionDigits: 1 })} unit="USD" />
        <PriceCard isSmall label={t.silverOunce} value={activePrices.metals.silverOunce.toLocaleString(undefined, { maximumFractionDigits: 2 })} unit="USD" />
        <PriceCard isSmall label={t.usdSyp} value={activePrices.currencies.usdSypSell.toLocaleString()} unit="SYP" />
        <PriceCard isSmall label={t.usdTry} value={activePrices.currencies.usdTrySell.toFixed(2)} unit="TRY" />
        <PriceCard isSmall label={t.usdEur} value={activePrices.currencies.usdEurSell.toFixed(2)} unit="EUR" />
      </>
    );
  };

  const renderCurrentView = () => {
    if (!activePrices) return null;
    const showSyp = activePrices.currencies.usdSypSell > 0;

    switch (activeTab) {
      case 'home':
        return (
          <div className="space-y-10 animate-in fade-in duration-500">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
              <PriceCard label={t.goldOunce} value={activePrices.metals.goldOunce.toLocaleString(undefined, { maximumFractionDigits: 1 })} unit="USD" change={prices?.metals.change24h} isLive={prices?.metals.isLive} onClick={() => setChartSymbol('GOLD')} isActive={chartSymbol === 'GOLD'} />
              <PriceCard label={t.silverOunce} value={activePrices.metals.silverOunce.toLocaleString(undefined, { maximumFractionDigits: 2 })} unit="USD" onClick={() => setChartSymbol('SILVER')} isActive={chartSymbol === 'SILVER'} />
              <PriceCard label={t.gold24} value={activePrices.metals.gold24.toLocaleString(undefined, { maximumFractionDigits: 1 })} unit="USD/g" onClick={() => setChartSymbol('GOLD')} isActive={chartSymbol === 'GOLD'} />
              <PriceCard label={t.gold21} value={activePrices.metals.gold21.toLocaleString(undefined, { maximumFractionDigits: 1 })} unit="USD/g" onClick={() => setChartSymbol('GOLD')} isActive={chartSymbol === 'GOLD'} />
              <PriceCard label={t.gold18} value={activePrices.metals.gold18.toLocaleString(undefined, { maximumFractionDigits: 1 })} unit="USD/g" onClick={() => setChartSymbol('GOLD')} isActive={chartSymbol === 'GOLD'} />
              {showSyp && <PriceCard label={t.usdSyp} value={activePrices.currencies.usdSypSell.toLocaleString()} unit="SYP" onClick={() => setChartSymbol('SYP')} isActive={chartSymbol === 'SYP'} />}
              <PriceCard label={t.usdTry} value={activePrices.currencies.usdTrySell.toFixed(2)} unit="TRY" onClick={() => setChartSymbol('TRY')} isActive={chartSymbol === 'TRY'} />
              <PriceCard label={t.usdEur} value={activePrices.currencies.usdEurSell.toFixed(2)} unit="EUR" onClick={() => setChartSymbol('EUR')} isActive={chartSymbol === 'EUR'} />
              {showSyp && <PriceCard label={t.trySyp} value={activePrices.currencies.trySypSell.toFixed(1)} unit="SYP" onClick={() => setChartSymbol('TRY')} isActive={chartSymbol === 'TRY'} />}
              {showSyp && <PriceCard label={t.gold21Syp} value={Math.round(activePrices.metals.gold21Syp!).toLocaleString()} unit="SYP/g" onClick={() => setChartSymbol('SYP')} isActive={chartSymbol === 'SYP'} />}
            </div>
            <ChartSection lang={lang} selectedSymbol={chartSymbol} />
          </div>
        );
      case 'metals':
        return (
          <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-6 animate-in slide-in-from-bottom-4 duration-500">
            <PriceCard label={t.gold24} value={activePrices.metals.gold24.toLocaleString(undefined, { maximumFractionDigits: 1 })} unit="USD/g" />
            <PriceCard label={t.gold21} value={activePrices.metals.gold21.toLocaleString(undefined, { maximumFractionDigits: 1 })} unit="USD/g" />
            <PriceCard label={t.gold18} value={activePrices.metals.gold18.toLocaleString(undefined, { maximumFractionDigits: 1 })} unit="USD/g" />
            <PriceCard label={t.goldOunce} value={activePrices.metals.goldOunce.toLocaleString(undefined, { maximumFractionDigits: 1 })} unit="USD" />
            <PriceCard label={t.silverOunce} value={activePrices.metals.silverOunce.toLocaleString(undefined, { maximumFractionDigits: 2 })} unit="USD" />
            {showSyp && <PriceCard label={t.gold21Syp} value={Math.round(activePrices.metals.gold21Syp!).toLocaleString()} unit="SYP/g" />}
          </div>
        );
      case 'currencies':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6 animate-in slide-in-from-bottom-4 duration-500">
            {showSyp && (
              <PriceCard label={t.usdSyp} value={activePrices.currencies.usdSypBuy.toLocaleString()} secondaryValue={activePrices.currencies.usdSypSell.toLocaleString()} unit="SYP" buySellLabels={{ buy: t.buy, sell: t.sell }} />
            )}
            <PriceCard label={t.usdTry} value={activePrices.currencies.usdTryBuy.toFixed(2)} secondaryValue={activePrices.currencies.usdTrySell.toFixed(2)} unit="TRY" buySellLabels={{ buy: t.buy, sell: t.sell }} />
            <PriceCard label={t.usdEur} value={activePrices.currencies.usdEurBuy.toFixed(3)} secondaryValue={activePrices.currencies.usdEurSell.toFixed(3)} unit="EUR" buySellLabels={{ buy: t.buy, sell: t.sell }} />
            {showSyp && (
              <PriceCard label={t.trySyp} value={activePrices.currencies.trySypBuy.toFixed(1)} secondaryValue={activePrices.currencies.trySypSell.toFixed(1)} unit="SYP" buySellLabels={{ buy: t.buy, sell: t.sell }} />
            )}
          </div>
        );
      case 'tools':
        return (
          <div className="max-w-2xl mx-auto animate-in slide-in-from-bottom-4 duration-500">
            <Calculator 
              lang={lang} metals={activePrices.metals} currencies={activePrices.currencies} 
              manualOunce={manualOunce} setManualOunce={(v) => {setManualOunce(v); localStorage.setItem('manualGoldOunce', v);}}
              isManualActive={isManualActive} setIsManualActive={(v) => {setIsManualActive(v); localStorage.setItem('isManualActive', v.toString());}}
              manualSyp={manualSyp} setManualSyp={(v) => {setManualSyp(v); localStorage.setItem('manualSypRate', v);}}
              isManualSypActive={isManualSypActive} setIsManualSypActive={(v) => {setIsManualSypActive(v); localStorage.setItem('isManualSypActive', v.toString());}}
            />
          </div>
        );
      case 'portfolio':
        return (
          <div className="max-w-3xl mx-auto animate-in slide-in-from-bottom-4 duration-500">
            <Portfolio lang={lang} metals={activePrices.metals} currencies={activePrices.currencies} portfolio={portfolio} setPortfolio={setPortfolio} />
          </div>
        );
      case 'about':
        return <AboutSection lang={lang} />;
      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen pb-40 transition-colors ${theme === 'dark' ? 'bg-transparent' : 'bg-white/40 backdrop-blur-sm'}`}>
      <div className={`max-w-7xl mx-auto px-4 ${lang === 'ar' ? 'rtl' : 'ltr'}`}>
        <Header lang={lang} setLang={setLang} theme={theme} toggleTheme={toggleTheme} />
        
        <main className="pt-32 md:pt-40 space-y-8">
          <div className="relative py-2 border-y border-white/5 bg-black/10">
            <SmartTicker>{renderTickerContent()}</SmartTicker>
          </div>

          <div className="flex flex-col items-center gap-3">
            <div className={`flex items-center gap-2 px-6 md:px-8 py-2 md:py-3 rounded-full text-[11px] md:text-[13px] font-black uppercase tracking-widest border shadow-xl transition-all ${isUpdating ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-600' : 'bg-green-500/10 border-green-500/30 text-green-600'}`}>
               <span className={`w-2.5 h-2.5 rounded-full ${isUpdating ? 'bg-yellow-500 animate-pulse' : 'bg-green-500 shadow-[0_0_12px_#22c55e]'}`}></span>
               {isUpdating ? 'Updating...' : `Live Feed: ${prices?.currencies.lastUpdated || '--:--'}`}
            </div>
          </div>
          
          <div className="py-2 min-h-[60vh]">
             {renderCurrentView()}
          </div>
        </main>
      </div>

      <nav className="fixed bottom-0 md:bottom-0 left-0 md:left-0 right-0 md:right-0 w-full md:w-full z-[100] transition-all">
        <div className="flex justify-center items-end h-32 md:h-auto pb-6 md:pb-0">
          <div className={`
            glass-card flex justify-between items-center border shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-500
            w-[92%] max-w-lg p-2 rounded-[2rem] border-white/10
            md:w-full md:max-w-none md:rounded-none md:border-x-0 md:border-b-0 md:border-t md:border-white/10 md:bg-[#0a0f1e]/95 md:backdrop-blur-3xl md:px-[10%] md:py-4
          `}>
            <NavItem active={activeTab === 'home'} onClick={() => setTab('home')} icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>} label={t.home} />
            <NavItem active={activeTab === 'metals'} onClick={() => setTab('metals')} icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>} label={t.metals} />
            <NavItem active={activeTab === 'currencies'} onClick={() => setTab('currencies')} icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} label={t.currencies} />
            <NavItem active={activeTab === 'tools'} onClick={() => setTab('tools')} icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>} label={t.calculator} />
            <NavItem active={activeTab === 'portfolio'} onClick={() => setTab('portfolio')} icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>} label={t.portfolio} />
            <NavItem active={activeTab === 'about'} onClick={() => setTab('about')} icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} label={t.about} />
          </div>
        </div>
      </nav>
    </div>
  );
};

interface NavItemProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

const NavItem: React.FC<NavItemProps> = ({ active, onClick, icon, label }) => {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center justify-center flex-1 transition-all duration-300 py-1.5 px-1 rounded-2xl ${active ? 'bg-yellow-500/15 text-yellow-500' : 'text-gray-400 hover:text-white'}`}
    >
      <div className={`mb-1 transition-transform duration-300 ${active ? 'scale-110' : 'scale-100'}`}>
        {icon}
      </div>
      <span className="text-[7px] md:text-[9px] font-black uppercase tracking-tighter md:tracking-normal whitespace-nowrap">
        {label}
      </span>
      {active && (
        <div className="w-1 h-1 rounded-full bg-yellow-500 mt-0.5 shadow-[0_0_5px_#eab308]"></div>
      )}
    </button>
  );
};

export default App;