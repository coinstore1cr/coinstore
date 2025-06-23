import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { isPlatformBrowser } from '@angular/common';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  getUserData(): Observable<any> {
    // ✅ Ensure this only runs in the browser
    if (!isPlatformBrowser(this.platformId)) {
      return throwError(() => new Error('Cannot access localStorage on the server.'));
    }

    const token = localStorage.getItem('authToken');

    if (!token) {
      return throwError(() => new Error('No authentication token found. Please log in.'));
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get(`${this.apiUrl}/user`, { headers });
  }

  updateBalance(profitLoss: number): Observable<any> {
    if (!isPlatformBrowser(this.platformId)) {
      return throwError(() => new Error('Cannot access localStorage on the server.'));
    }

    const token = localStorage.getItem('authToken');

    if (!token) {
      return throwError(() => new Error('No authentication token found. Please log in.'));
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.post(`${this.apiUrl}/user/update-balance`, { profitLoss }, { headers }).pipe(
      tap(response => {
        console.log('Balance updated successfully:', response);
      }),
      catchError(error => {
        console.error('Error updating balance:', error);
        return throwError(() => new Error('Failed to update balance. Please try again.'));
      })
    );
  }
}
