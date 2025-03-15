import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { isPlatformBrowser } from '@angular/common';
import { Observable, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class orderService {  // ✅ Fix class name (PascalCase)
  private apiUrl = `${environment.apiUrl}/orders`; // ✅ Use environment variable

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object // ✅ Inject PLATFORM_ID to check if in browser
  ) {}

  createOrder(orderData: any): Observable<any> {
    if (!isPlatformBrowser(this.platformId)) {
      return throwError(() => new Error('Cannot access localStorage on the server.'));
    }

    const token = localStorage.getItem('authToken');

    if (!token) {
      return throwError(() => new Error('No token found. Please log in.'));
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
    });

    return this.http.post(this.apiUrl, orderData, { headers });
  }
}
