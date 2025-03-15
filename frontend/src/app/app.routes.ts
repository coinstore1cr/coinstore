import { Routes } from '@angular/router';
export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent) },
  { path: 'trade', loadComponent: () => import('./pages/trade/trade.component').then(m => m.TradeComponent) },
  { path: 'record', loadComponent: () => import('./pages/record/record.component').then(m => m.RecordComponent) },
  { path: 'mine', loadComponent: () => import('./pages/mine/mine.component').then(m => m.MineComponent) },
  { path: 'signup', loadComponent: () => import('./pages/sign-up/sign-up.component').then(m => m.SignUpComponent) },
  { path: 'login', loadComponent: () => import('./pages/log-in/log-in.component').then(m => m.LogInComponent) },
  { path: 'tradingpopup', loadComponent: () => import('./pages/trade/components/trading-popup/trading-popup.component').then(m => m.TradingPopupComponent) },
  { 
    path: 'record', 
    loadComponent: () => import('./pages/record/record.component').then(m => m.RecordComponent),
    children: [
      { path: 'open-order', loadComponent: () => import('./pages/record/components/open-order/open-order.component').then(m => m.OpenOrderComponent) }, // Default child route
      { path: 'order-history', loadComponent: () => import('./pages/record/components/order-history/order-history.component').then(m => m.OrderHistoryComponent) },
    ]
  },
  
  
];



