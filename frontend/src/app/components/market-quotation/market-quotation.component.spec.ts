import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketQuotationComponent } from './market-quotation.component';

describe('MarketQuotationComponent', () => {
  let component: MarketQuotationComponent;
  let fixture: ComponentFixture<MarketQuotationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarketQuotationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MarketQuotationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
