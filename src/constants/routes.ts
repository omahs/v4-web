export enum AppRoute {
  Markets = '/markets',
  Vaults = '/vaults',
  Portfolio = '/portfolio',
  Trade = '/trade',
  Profile = '/profile',
  Alerts = '/alerts',
  Settings = '/settings',
  Terms = '/terms',
  Privacy = '/privacy',
}

export enum MarketsRoute {
  New = 'new',
}

export enum PortfolioRoute {
  EquityTiers = 'equity-tiers',
  Fees = 'fees',
  History = 'history',
  Orders = 'orders',
  Overview = 'overview',
  Positions = 'positions',
}

export enum HistoryRoute {
  Trades = 'trades',
  Transfers = 'transfers',
  Payments = 'payments',
}

// OTE-459: Deprecate this route
export enum TokenRoute {
  TradingRewards = 'trading-rewards',
  StakingRewards = 'staking-rewards',
  Governance = 'governance',
}

export enum MobileSettingsRoute {
  Language = 'language',
  Notifications = 'notifications',
  Network = 'network',
}

export const BASE_ROUTE = import.meta.env.VITE_ROUTER_TYPE === 'hash' ? '/#' : '';
export const TRADE_ROUTE = `${AppRoute.Trade}/:market`;
export const DEFAULT_DOCUMENT_TITLE = 'dYdX';
