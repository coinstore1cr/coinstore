// shared.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root', // Make the service available application-wide
})
export class SharedService {
  // BehaviorSubject to hold and share the data
  private orderDataSubject = new BehaviorSubject<any>(null);
  public orderData$ = this.orderDataSubject.asObservable(); // Expose as observable

  constructor() {}

  // Method to update the trade data
  updateorderData(data: any) {
    this.orderDataSubject.next(data);
  }

  // Method to get the current trade data
  getorderData() {
    return this.orderDataSubject.value;
  }
}