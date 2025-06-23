import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';

interface NavItem {
  icon: string;
  label: string;
  route: string;
  active: boolean;
  isCustomIcon: boolean;
}

@Component({
  selector: 'app-bottom-nav',
  standalone: true,
  imports: [NgFor, NgIf],
  template: `
    <nav class="bottom-nav" *ngIf="isLoggedIn && !isAuthPage">
      <a *ngFor="let item of navItems" 
         href="#"
         (click)="navigate(item.route); $event.preventDefault()"
         [class.active]="item.active"
         class="nav-item">
        <img [src]="item.icon" 
             class="nav-icon" 
             [alt]="item.label"
             (error)="onImageError($event, item)">
        <span>{{item.label}}</span>
      </a>
    </nav>
  `,
  styles: [`
    .bottom-nav {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      background-color: #1a1f2a;
      border-top: 1px solid #2a2f3a;
      padding: 0.5rem 0;
      z-index: 1000;
    }
    .nav-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      color: #8e98a7;
      text-decoration: none;
      font-size: 0.8rem;
      gap: 4px;
    }
    .nav-item.active {
      color: #ffd700;
    }
    .nav-icon {
      width: 24px;
      height: 24px;
      object-fit: contain;
      filter: grayscale(1) opacity(0.7);
      transition: all 0.3s ease;
    }
    .nav-item.active .nav-icon {
      filter: grayscale(0) opacity(1) sepia(1) saturate(1000%) hue-rotate(0deg);
    }
  `]
})
export class BottomNavComponent implements OnInit, OnDestroy {
  navItems: NavItem[] = [
    { icon: 'assets/images/home.png', label: 'Home', route: '/home', active: true, isCustomIcon: true },
    { icon: 'assets/images/trade.png', label: 'Trade', route: '/trade', active: false, isCustomIcon: true },
    { icon: 'assets/images/record.png', label: 'Record', route: '/record/open-order', active: false, isCustomIcon: true },
    { icon: 'assets/images/my.png', label: 'Mine', route: '/mine', active: false, isCustomIcon: true }
  ];

  isLoggedIn = false;
  isAuthPage = false;
  private authSubscription: Subscription | null = null;
  private routerSubscription: Subscription | null = null;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // Subscribe to auth status changes
    this.authSubscription = this.authService.authStatus.subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
      if (!isLoggedIn) {
        this.router.navigate(['/login']);
      }
    });

    // Subscribe to router events
    this.routerSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.updateActiveState(event.urlAfterRedirects);
        this.isAuthPage = this.checkIfAuthPage(event.urlAfterRedirects);
      }
    });
    // Initial check
    this.isAuthPage = this.checkIfAuthPage(this.router.url);
  }

  ngOnDestroy() {
    // Clean up subscriptions
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  onImageError(event: any, item: NavItem) {
    console.error(`Failed to load image: ${item.icon}`);
    console.error('Error event:', event);
  }

  navigate(route: string) {
    if (!this.isLoggedIn) {
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: route }
      });
      return;
    }

    // Check if the route is protected
    const isProtectedRoute = this.navItems.some(item => item.route === route);
    if (isProtectedRoute && !this.authService.isLoggedIn) {
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: route }
      });
      return;
    }

    this.router.navigate([route]);
  }

  updateActiveState(currentRoute: string) {
    // Reset all items to inactive
    this.navItems.forEach(item => {
      item.active = false;
    });

    // Find the matching base route
    const matchingItem = this.navItems.find(item => {
      // For trade route, also match trading popup
      if (item.route === '/trade') {
        return currentRoute === '/trade' || currentRoute.startsWith('/trade/trading-popup');
      }
      // For record route, match both open-order and history
      if (item.route === '/record/open-order') {
        return currentRoute.startsWith('/record/');
      }
      // For other routes, exact match
      return currentRoute === item.route;
    });

    if (matchingItem) {
      matchingItem.active = true;
    }
  }

  checkIfAuthPage(url: string): boolean {
    return url.startsWith('/login') || url.startsWith('/signup');
  }
}
