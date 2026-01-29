
export type Language = 'ar' | 'en';
export type Theme = 'light' | 'dark';
export type Tab = 'home' | 'metals' | 'currencies' | 'tools' | 'portfolio' | 'about';
export type Period = '1d' | '1w' | '1m' | '1y' | 'all';
export type ChartSymbol = 'GOLD' | 'SILVER' | 'TRY' | 'EUR' | 'SYP';

export interface PricePoint {
  time: string;
  timestamp: number;
  value: number;
}

export interface MetalPrices {
  goldOunce: number;
  gold24: number;
  gold21: number;
  gold18: number;
  gold21Syp?: number;
  silverOunce: number;
  change24h: number;
  isLive?: boolean;
}

export interface CurrencyPrices {
  usdTryBuy: number;
  usdTrySell: number;
  usdEurBuy: number;
  usdEurSell: number;
  usdSypBuy: number;
  usdSypSell: number;
  trySypBuy: number;
  trySypSell: number;
  lastUpdated: string;
  isLive?: boolean;
}

export type PortfolioItemType = 'metal' | 'currency';
export type MetalPurity = '24K' | '21K' | '18K';
export type CurrencyCode = 'USD' | 'TRY' | 'EUR' | 'SYP';

export interface PortfolioItem {
  id: string;
  type: PortfolioItemType;
  purity?: MetalPurity;
  currency?: CurrencyCode;
  amount: number;
}

export interface TranslationSchema {
  title: string;
  home: string;
  metals: string;
  currencies: string;
  goldOunce: string;
  silverOunce: string;
  gold24: string;
  gold21: string;
  gold18: string;
  gold21Syp: string;
  usdTry: string;
  usdEur: string;
  usdSyp: string;
  trySyp: string;
  buy: string;
  sell: string;
  calculator: string;
  convert: string;
  amount: string;
  from: string;
  to: string;
  result: string;
  lastUpdated: string;
  liveMarket: string;
  manualUpdate: string;
  history: string;
  period1d: string;
  period1w: string;
  period1m: string;
  period1y: string;
  periodAll: string;
  portfolio: string;
  addPortfolio: string;
  totalPortfolio: string;
  weight: string;
  purity: string;
  currencyLabel: string;
  delete: string;
  emptyPortfolio: string;
  manualOunce: string;
  manualSyp: string;
  cancel: string;
  edit: string;
  about: string;
}
