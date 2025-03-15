import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TradingControlsComponent } from './trading-controls.component';

describe('TradingControlsComponent', () => {
  let component: TradingControlsComponent;
  let fixture: ComponentFixture<TradingControlsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TradingControlsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TradingControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
