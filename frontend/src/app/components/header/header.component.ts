import { Component } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  template: `
    <header class="header">
      <img src="assets/images/logo.png" alt="Coinstore Logo" class="logo">
      <span class="active">Home</span>
      <div class="nav-items">
        <span class="language">English</span>
      </div>
    </header>
  `,
  styles: [`
    .header {
      height:70px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      background-color: #1a1f2a;
      border-bottom: 1px solid #2a2f3a;
    }
    .logo {
      height: 50px;
      width: 33%;
    }
    .nav-items {
      display: flex;
      gap: 1rem;
      color: #8e98a7;
    }
    .active {
      margin-left:-25%;
      color: #8e98a7;
      font-size:26px

    }
  `]
})
export class HeaderComponent {}
