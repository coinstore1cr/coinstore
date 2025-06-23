import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private isAuthenticated = new BehaviorSubject<boolean>(false);
  private tokenValidationInProgress = false;
  private tokenRefreshTimer: any;
  private isRefreshingToken = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.checkAuthState();
  }

  private checkAuthState() {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('authToken');
      if (token) {
        if (this.isTokenExpired(token)) {
          this.clearAuthState();
        } else {
          this.isAuthenticated.next(true);
          this.setupTokenRefresh(token);
        }
      } else {
        this.clearAuthState();
      }
    }
  }

  private isTokenExpired(token: string): boolean {
    try {
      const decoded: any = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp < currentTime;
    } catch {
      return true;
    }
  }

  private setupTokenRefresh(token: string) {
    try {
      const decoded: any = jwtDecode(token);
      const expiresIn = decoded.exp * 1000 - Date.now();
      const refreshTime = expiresIn - (60 * 60 * 1000); // Refresh 1 hour before expiration

      // Clear any existing timer
      if (this.tokenRefreshTimer) {
        clearTimeout(this.tokenRefreshTimer);
      }

      // Only set up a new timer if the token is not expired and refresh time is positive
      if (refreshTime > 0) {
        this.tokenRefreshTimer = setTimeout(() => {
          if (!this.isRefreshingToken) {
            this.refreshToken();
          }
        }, refreshTime);
      }
    } catch {
      this.clearAuthState();
    }
  }

  private refreshToken() {
    if (this.isRefreshingToken) return;

    const token = localStorage.getItem('authToken');
    if (!token) return;

    this.isRefreshingToken = true;
    this.http.post<{ token: string }>(`${this.apiUrl}/refresh-token`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    }).pipe(
      tap(response => {
        localStorage.setItem('authToken', response.token);
        // Don't call setupTokenRefresh here, just calculate the next refresh
        const decoded: any = jwtDecode(response.token);
        const expiresIn = decoded.exp * 1000 - Date.now();
        const refreshTime = expiresIn - (60 * 60 * 1000);
        
        if (this.tokenRefreshTimer) {
          clearTimeout(this.tokenRefreshTimer);
        }

        if (refreshTime > 0) {
          this.tokenRefreshTimer = setTimeout(() => {
            this.isRefreshingToken = false;
            this.refreshToken();
          }, refreshTime);
        }
      }),
      catchError(() => {
        this.isRefreshingToken = false;
        this.clearAuthState();
        return of(null);
      })
    ).subscribe(() => {
      this.isRefreshingToken = false;
    });
  }

  public validateToken(token: string): Observable<boolean> {
    if (this.tokenValidationInProgress) {
      return of(false);
    }

    this.tokenValidationInProgress = true;
    return this.http.get(`${this.apiUrl}/validate-token`, {
      headers: { Authorization: `Bearer ${token}` }
    }).pipe(
      map(() => true),
      catchError(() => of(false)),
      tap(() => {
        this.tokenValidationInProgress = false;
      })
    );
  }

  private clearAuthState() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      if (this.tokenRefreshTimer) {
        clearTimeout(this.tokenRefreshTimer);
      }
    }
    this.isAuthenticated.next(false);
  }

  get authStatus(): Observable<boolean> {
    return this.isAuthenticated.asObservable();
  }

  get isLoggedIn(): boolean {
    if (!isPlatformBrowser(this.platformId)) {
      return false;
    }
    const token = localStorage.getItem('authToken');
    return !!token && !this.isTokenExpired(token) && this.isAuthenticated.value;
  }

  getToken(): string | null {
    return isPlatformBrowser(this.platformId) ? localStorage.getItem('authToken') : null;
  }

  register(userData: any) {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  login(credentials: { email: string; password: string; captcha?: string }): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, credentials).pipe(
      tap((response) => {
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('authToken', response.token);
          this.isAuthenticated.next(true);
          this.setupTokenRefresh(response.token); // Enable token refresh
        }
        this.router.navigate(['/home']);
      }),
      catchError((error: any) => {
        console.error('Login error:', error);
        return throwError(error);
      })
    );
  }

  logout(): Observable<void> {
    this.clearAuthState();
    this.router.navigate(['/login']);
    return of(undefined);
  }
}
