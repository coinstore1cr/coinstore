import { Component, OnInit, OnDestroy, NgZone, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-banner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="banner-wrapper">
      <div class="banner-container">
        <div class="banner-slide" 
             *ngFor="let banner of banners; let i = index"
             [class.active]="i === currentIndex"
             [style.transform]="'translateX(' + (i - currentIndex) * 100 + '%)'">
          <img [src]="banner" 
               [alt]="'Banner Image ' + (i + 1)"
               (load)="onImageLoad($event)">
        </div>
        
        <!-- Dots Navigation -->
        <div class="dots-container">
          <button class="dot" 
                  *ngFor="let banner of banners; let i = index" 
                  [class.active]="i === currentIndex"
                  (click)="setCurrentIndex(i)">
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .banner-wrapper {
      width: 100%;
      height: 40vh;
      background: linear-gradient(45deg, #000428, #004e92);
      overflow: hidden;
      position: relative;
    }

    .banner-container {
      width: 100%;
      height: 100%;
      position: relative;
      overflow: hidden;
    }

    .banner-slide {
      position: absolute;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.5s ease-in-out;
      will-change: transform;
    }

    .banner-slide img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      transition: opacity 0.3s ease-in-out;
    }

    /* Dots Navigation */
    .dots-container {
      position: absolute;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      gap: 8px;
      z-index: 2;
    }

    .dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.3);
      border: none;
      cursor: pointer;
      padding: 0;
      transition: background-color 0.3s ease, transform 0.2s ease;
    }

    .dot:hover {
      transform: scale(1.2);
    }

    .dot.active {
      background:rgb(252, 251, 250);
    }

    @media (max-width: 768px) {
      .banner-wrapper {
        height: 30vh;
      }
    }
  `]
})
export class BannerComponent implements OnInit, OnDestroy {
  banners: string[] = [
    'assets/images/banner1.png',
    'assets/images/banner2.png',
    'assets/images/banner3.png',
    'assets/images/banner4.png'
  ];
  currentIndex: number = 0;
  private intervalId: any;
  private touchStartX: number = 0;
  private touchEndX: number = 0;

  constructor(private ngZone: NgZone) {}

  @HostListener('touchstart', ['$event'])
  onTouchStart(event: TouchEvent) {
    this.touchStartX = event.touches[0].clientX;
  }

  @HostListener('touchend', ['$event'])
  onTouchEnd(event: TouchEvent) {
    this.touchEndX = event.changedTouches[0].clientX;
    this.handleSwipe();
  }

  private handleSwipe() {
    const swipeDistance = this.touchEndX - this.touchStartX;
    const minSwipeDistance = 50;

    if (Math.abs(swipeDistance) > minSwipeDistance) {
      if (swipeDistance > 0) {
        this.navigate(-1); // Swipe right
      } else {
        this.navigate(1); // Swipe left
      }
    }
  }

  onImageLoad(event: Event) {
    const img = event.target as HTMLImageElement;
    if (img.naturalHeight > img.naturalWidth) {
      img.style.objectFit = 'contain';
      img.style.width = 'auto';
      img.style.height = '100%';
    } else {
      img.style.objectFit = 'contain';
      img.style.width = '100%';
      img.style.height = 'auto';
    }
  }

  ngOnInit(): void {
    this.startCarousel();
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  startCarousel(): void {
    this.ngZone.runOutsideAngular(() => {
      this.intervalId = setInterval(() => {
        this.ngZone.run(() => {
          this.navigate(1);
        });
      }, 5000);
    });
  }

  navigate(direction: number): void {
    this.currentIndex = (this.currentIndex + direction + this.banners.length) % this.banners.length;
  }

  setCurrentIndex(index: number): void {
    this.currentIndex = index;
    // Reset the timer when manually changing slides
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.startCarousel();
    }
  }
}
