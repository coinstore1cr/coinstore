import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-banner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="banner">
      <div class="banner-content">
        <img class="image" *ngFor="let banner of banners; let i = index" 
             [src]="banner" 
             [alt]="'Banner Image ' + (i + 1)" 
             [class.active]="i === currentIndex">
      </div>
      <div class="dot-indicators">
        <span *ngFor="let banner of banners; let i = index" 
              [class.active]="i === currentIndex" 
              (click)="setCurrentIndex(i)">
        </span>
      </div>
      <div class="floating-coins"></div>
    </div>
  `,
  styles: [`
    .banner {
      background: linear-gradient(45deg, #000428, #004e92);
      position: relative;
      overflow: hidden;
      max-height:20vh;
    }
    .image{
      height:50vh
    }
    .banner-content img {
      margin-top:-45vh;
      width: 100%;
      height: 100vh;
      display: none;
      transition: opacity 1s ease-in-out;
    }
    .banner-content img.active {
      display: block;
    }
    .dot-indicators {
      position: absolute;
      bottom: 10px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      gap: 10px;
    }
    .dot-indicators span {
      width: 10px;
      height: 10px;
      background-color: #ccc;
      border-radius: 50%;
      cursor: pointer;
      transition: background-color 0.3s ease;
    }
    .dot-indicators span.active {
      background-color: #ffd700;
    }
    .floating-coins {
      position: absolute;
      right: 0;
      top: 0;
      bottom: 0;
      width: 40%;
      background-size: contain;
      background-repeat: no-repeat;
      background-position: right center;
    }
  `]
})
export class BannerComponent implements OnInit, OnDestroy {
  banners: string[] = [
    'assets/images/banner1.png',
    'assets/images/banner2.png',
    'assets/images/banner3.png'
  ];
  currentIndex: number = 0;
  private intervalId: any;

  constructor(private ngZone: NgZone) {}

  ngOnInit(): void {
    this.startCarousel();
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId); // Clear the interval when the component is destroyed
    }
  }

  startCarousel(): void {
    this.ngZone.runOutsideAngular(() => {
      this.intervalId = setInterval(() => {
        this.ngZone.run(() => {
          this.currentIndex = (this.currentIndex + 1) % this.banners.length;
        });
      }, 3000); // Change banner every 2 seconds
    });
  }

  setCurrentIndex(index: number): void {
    this.currentIndex = index;
  }
}
