import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

// Define interfaces for type safety
export interface OrderData {
  amount: number;
  time: number;
  direction: 'up' | 'down';
  name?: string;
}

export interface OrderResponse {
  orderId: string;
  userId: string;
  amount: number;
  openingPrice: number;
  closingPrice?: number;
  profitLoss?: number;
  status: 'pending' | 'completed';
  direction: 'up' | 'down';
  createdAt: string;
  updatedAt: string;
  openingTime: string;
  closingTime?: string;
  expiryTime?: number;
  name?: string;
  estimatedEarnings?: number;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    if (!token) {
      throw new Error('No authentication token found');
    }
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  createOrder(orderData: OrderData): Observable<OrderResponse> {
    try {
      const headers = this.getHeaders();
      return this.http.post<OrderResponse>(`${this.apiUrl}/orders`, orderData, {
        headers
      }).pipe(
        catchError(error => {
          if (error.status === 401) {
            // Token is invalid or expired
            this.authService.logout();
            return throwError(() => new Error('Your session has expired. Please log in again.'));
          }
          if (error.status === 400 && error.error?.message?.includes('insufficient balance')) {
            return throwError(() => new Error('Insufficient balance for this trade'));
          }
          return throwError(() => new Error(error.error?.message || 'Failed to create order'));
        })
      );
    } catch (error) {
      return throwError(() => error);
    }
  }

  updateOrder(orderId: string, updateData: Partial<OrderResponse>): Observable<OrderResponse> {
    try {
      const headers = this.getHeaders();
      return this.http.patch<OrderResponse>(`${this.apiUrl}/orders/${orderId}`, updateData, {
        headers
      }).pipe(
        catchError(error => {
          if (error.status === 401) {
            this.authService.logout();
            return throwError(() => new Error('Your session has expired. Please log in again.'));
          }
          return throwError(() => new Error(error.error?.message || 'Failed to update order'));
        })
      );
    } catch (error) {
      return throwError(() => error);
    }
  }

  getOrders(): Observable<OrderResponse[]> {
    try {
      const headers = this.getHeaders();
      return this.http.get<OrderResponse[]>(`${this.apiUrl}/orders`, {
        headers
      }).pipe(
        catchError(error => {
          if (error.status === 401) {
            this.authService.logout();
            return throwError(() => new Error('Your session has expired. Please log in again.'));
          }
          return throwError(() => new Error(error.error?.message || 'Failed to fetch orders'));
        })
      );
    } catch (error) {
      return throwError(() => error);
    }
  }

  getOrderById(orderId: string): Observable<OrderResponse> {
    try {
      const headers = this.getHeaders();
      return this.http.get<OrderResponse>(`${this.apiUrl}/orders/${orderId}`, {
        headers
      }).pipe(
        catchError(error => {
          if (error.status === 401) {
            this.authService.logout();
            return throwError(() => new Error('Your session has expired. Please log in again.'));
          }
          return throwError(() => new Error(error.error?.message || 'Failed to fetch order'));
        })
      );
    } catch (error) {
      return throwError(() => error);
    }
  }
}
