import { Component, OnInit } from '@angular/core';
import { OrderhistoryService } from '../../../../services/order-history.service';
import { CommonModule } from '@angular/common';
import { DatePipe } from '@angular/common'; // Import DatePipe

interface Order {
  name: string; // Add name property
  termCode: string;
  openingPrice: number;
  closingPrice: number;
  direction: 'up' | 'down';
  time: number;
  amount: number;
  openingTime: Date;
  closingTime: Date;
  profitLoss: number;
}

@Component({
  selector: 'app-order-history',
  imports: [CommonModule],
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css'],
  providers: [DatePipe], // Add DatePipe to providers
})
export class OrderHistoryComponent implements OnInit {
  orders: Order[] = []; // Array to store orders
  isLoading = false; // Loading state
  error: string | null = null; // Error message

  constructor(
    private orderhistoryservice: OrderhistoryService,
    private datePipe: DatePipe // Inject DatePipe
  ) {}

  ngOnInit(): void {
    this.fetchOrders();
  }

  fetchOrders(): void {
    this.isLoading = true;
    this.error = null;

    this.orderhistoryservice.getOrders().subscribe({
      next: (response: Order[]) => {
        // Filter out any incomplete orders and ensure all required fields are present
        this.orders = response.filter((order: Order) => 
          order.closingTime && 
          order.openingTime && 
          order.termCode && 
          order.openingPrice && 
          order.closingPrice
        );
        this.isLoading = false;
      },
      error: (err: Error) => {
        this.error = 'Failed to fetch orders. Please try again later.';
        this.isLoading = false;
        console.error('Error fetching orders:', err);
      },
    });
  }
}