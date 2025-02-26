import { Component, OnInit } from '@angular/core';
import { OrderhistoryService } from '../../../../services/order-history.service';
import { CommonModule } from '@angular/common';
import { DatePipe } from '@angular/common'; // Import DatePipe

@Component({
  selector: 'app-order-history',
  imports: [CommonModule],
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css'],
  providers: [DatePipe], // Add DatePipe to providers
})
export class OrderHistoryComponent implements OnInit {
  orders: any[] = []; // Array to store orders
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
      next: (response) => {
        this.orders = response; // Assign fetched orders to the array
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to fetch orders. Please try again later.';
        this.isLoading = false;
        console.error('Error fetching orders:', err);
      },
    });
  }
}