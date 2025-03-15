import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { NgFor } from '@angular/common';
import { AuthService } from '../../services/auth.service';
interface NavItem {
  icon: string;
  label: string;
  route: string;
  active: boolean;
}

@Component({
  selector: 'app-bottom-nav',
  standalone: true,
  imports: [ NgFor],
  template: `
    <nav class="bottom-nav">
      <a *ngFor="let item of navItems" 
         href="#"
         (click)="navigate(item.route); $event.preventDefault()"
         [class.active]="item.active"
         class="nav-item">
        <i class="material-icons">{{item.icon}}</i>
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
    }
    .nav-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      color: #8e98a7;
      text-decoration: none;
      font-size: 0.8rem;
    }
    .nav-item.active {
      color: #ffd700;
    }
    .material-icons {
      font-size: 1.5rem;
      margin-bottom: 0.25rem;
    }
  `]
})
export class BottomNavComponent {
  navItems: NavItem[] = [
    { icon: 'home', label: 'Home', route: '/home', active: true },
    { icon: 'trending_up', label: 'Trade', route: '/trade', active: false },
    { icon: 'history', label: 'Record', route: '/record', active: false },
    { icon: 'person', label: 'Mine', route: '/mine', active: false }
  ];

  private protectedRoutes = ['/trade', '/record', '/mine','/home'];

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.updateActiveState(event.urlAfterRedirects);
      }
    });
  }

  navigate(route: string) {
    if (this.protectedRoutes.includes(route) && !this.authService.isLoggedIn) {
      this.router.navigate(['/login']);
    } else {
      this.router.navigate([route]);
    }
  }
  
  

  updateActiveState(currentRoute: string) {
    this.navItems.forEach(item => {
      item.active = currentRoute === item.route;
    });
  }
}
