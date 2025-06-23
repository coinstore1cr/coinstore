import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { 
    path: 'home', 
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),
    canActivate: [AuthGuard]
  },
  { 
    path: 'trade', 
    loadComponent: () => import('./pages/trade/trade.component').then(m => m.TradeComponent),
    canActivate: [AuthGuard]
  },
  { 
    path: 'record', 
    loadComponent: () => import('./pages/record/record.component').then(m => m.RecordComponent),
    canActivate: [AuthGuard],
    children: [
      { path: 'open-order', loadComponent: () => import('./pages/record/components/open-order/open-order.component').then(m => m.OpenOrderComponent) },
      { path: 'order-history', loadComponent: () => import('./pages/record/components/order-history/order-history.component').then(m => m.OrderHistoryComponent) },
    ]
  },
  { 
    path: 'mine', 
    loadComponent: () => import('./pages/mine/mine.component').then(m => m.MineComponent),
    canActivate: [AuthGuard]
  },
  { path: 'signup', loadComponent: () => import('./pages/sign-up/sign-up.component').then(m => m.SignUpComponent) },
  { path: 'login', loadComponent: () => import('./pages/log-in/log-in.component').then(m => m.LogInComponent) },
  { 
    path: 'tradingpopup', 
    loadComponent: () => import('./pages/trade/components/trading-popup/trading-popup.component').then(m => m.TradingPopupComponent),
    canActivate: [AuthGuard]
  }
];



