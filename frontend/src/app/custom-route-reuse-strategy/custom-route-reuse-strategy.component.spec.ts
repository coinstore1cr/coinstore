import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomRouteReuseStrategyComponent } from './custom-route-reuse-strategy.component';

describe('CustomRouteReuseStrategyComponent', () => {
  let component: CustomRouteReuseStrategyComponent;
  let fixture: ComponentFixture<CustomRouteReuseStrategyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomRouteReuseStrategyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomRouteReuseStrategyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
