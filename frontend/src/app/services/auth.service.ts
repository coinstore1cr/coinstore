import { Injectable, Inject, PLATFORM_ID, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Observable, tap, of } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnInit {
  private apiUrl = environment.apiUrl;
  private isAuthenticated = new BehaviorSubject<boolean>(false);

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.ngOnInit();
  }

  ngOnInit() {
    this.checkAuthState();
  }

  // 🔹 Check and update authentication state
  private checkAuthState() {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('authToken');
      this.isAuthenticated.next(!!token);
    }
  }

  // 🔹 Observable for authentication status
  get authStatus(): Observable<boolean> {
    return this.isAuthenticated.asObservable();
  }

  // 🔹 Check if user is logged in
  get isLoggedIn(): boolean {
    return isPlatformBrowser(this.platformId) && !!localStorage.getItem('authToken');
  }

  // 🔹 Get the auth token safely
  getToken(): string | null {
    return isPlatformBrowser(this.platformId) ? localStorage.getItem('authToken') : null;
  }

  // 🔹 Register a new user
  register(userData: any) {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  // 🔹 Login method
  login(credentials: { email: string; password: string }): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, credentials).pipe(
      tap((response) => {
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('authToken', response.token);
        }
        this.isAuthenticated.next(true);
        this.router.navigate(['/home']);
      })
    );
  }

  // 🔹 Logout method
  logout(): Observable<void> {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
    }
    this.isAuthenticated.next(false);
    this.router.navigate(['/login']);
    return of(undefined);
  }
}
