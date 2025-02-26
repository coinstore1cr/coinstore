import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketStatsComponent } from './market-stats.component';

describe('MarketStatsComponent', () => {
  let component: MarketStatsComponent;
  let fixture: ComponentFixture<MarketStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarketStatsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MarketStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
