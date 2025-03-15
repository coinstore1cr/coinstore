import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Observable, tap, of } from 'rxjs';
import { catchError } from 'rxjs/operators'; // Import catchError
import { throwError } from 'rxjs'; // Import throwError
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService { // Removed "implements OnInit"
  private apiUrl = environment.apiUrl;
  private isAuthenticated = new BehaviorSubject<boolean>(false);

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.checkAuthState(); // Initialization in constructor
  }

  private checkAuthState() {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('authToken');
      this.isAuthenticated.next(!!token);
    }
  }

  get authStatus(): Observable<boolean> {
    return this.isAuthenticated.asObservable();
  }

  get isLoggedIn(): boolean {
    return isPlatformBrowser(this.platformId) && !!localStorage.getItem('authToken');
  }

  getToken(): string | null {
    return isPlatformBrowser(this.platformId) ? localStorage.getItem('authToken') : null;
  }

  register(userData: any) {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  login(credentials: { email: string; password: string }): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, credentials).pipe(
      tap((response) => {
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('authToken', response.token);
          console.log('Token stored:', response.token); // Debug
        }
        this.isAuthenticated.next(true);
        this.router.navigate(['/home']);
      }),
      catchError((error: any) => { // Explicitly typed error
        console.error('Login error:', error);
        return throwError(error); // Return observable error
      })
    );
  }

  logout(): Observable<void> {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
    }
    this.isAuthenticated.next(false);
    this.router.navigate(['/login']);
    return of(undefined); // Assuming 'of' is imported elsewhere; if not, import from 'rxjs'
  }
}
