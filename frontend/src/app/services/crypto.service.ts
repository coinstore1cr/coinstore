// crypto.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface BinancePriceResponse {
  symbol: string;
  price: string;
}

@Injectable({
  providedIn: 'root'
})
export class CryptoService {
  private readonly apiUrl = 'https://api.binance.com/api/v3/ticker/price';

  constructor(private http: HttpClient) {}

  getBTCPrice(): Observable<number> {
    return this.http.get<BinancePriceResponse>(`${this.apiUrl}?symbol=BTCUSDT`).pipe(
      map(response => parseFloat(response.price))
    );
  }
}