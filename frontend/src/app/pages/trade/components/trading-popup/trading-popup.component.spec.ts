import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TradingPopupComponent } from './trading-popup.component';

describe('TradingPopupComponent', () => {
  let component: TradingPopupComponent;
  let fixture: ComponentFixture<TradingPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TradingPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TradingPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
