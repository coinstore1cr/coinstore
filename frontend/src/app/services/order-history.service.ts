import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, throwError } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class OrderhistoryService {
  private apiUrl = `${environment.apiUrl}/orderhistory`; // ✅ Use environment variable

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) {}

  // Fetch orders for the logged-in user
  getOrders(): Observable<any> {
    if (!isPlatformBrowser(this.platformId)) {
      // If running on server, return an empty observable or handle appropriately
      return throwError(() => new Error('Cannot access localStorage on the server.'));
    }

    const token = localStorage.getItem('authToken');

    // If no token, return an observable error instead of throwing
    if (!token) {
      return throwError(() => new Error('No token found. Please log in.'));
    }

    // Set the Authorization header with the token
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    // Make the GET request with the headers
    return this.http.get(this.apiUrl, { headers });
  }
}
