import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserDataService {
  private userDataSubject = new BehaviorSubject<any>(null);
  userData$ = this.userDataSubject.asObservable();

  constructor() {}

  // Update user data
  setUserData(userData: any) {
    this.userDataSubject.next(userData);
  }

  // Get user data
  getUserData() {
    return this.userDataSubject.value;
  }
}