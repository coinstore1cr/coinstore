import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { UserDataService } from '../../services/user-data.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { LogoutDialogComponent } from './logout-dialog/logout-dialog.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    ToastModule,
    LogoutDialogComponent
  ],
  providers: [MessageService],
  templateUrl: './mine.component.html',
  styleUrls: ['./mine.component.css']
})
export class MineComponent implements OnInit {
  userData: any;
  loading = true;
  showLogoutDialog = false;

  navigationItems = [
    { label: 'Deposit' },
    { label: 'Information' },
    { label: 'Service' },
    { label: 'My Subordinate' }
  ];

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
    private userdataService: UserDataService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    // 🔹 Listen for auth status changes
    this.authService.authStatus.subscribe((isLoggedIn) => {
      if (isLoggedIn) {
        this.fetchUserData();
      } else {
        this.loading = false;
      }
    });
  }

  private fetchUserData() {
    this.userService.getUserData().subscribe({
      next: (data) => {
        this.userData = data;
        this.userdataService.setUserData(data);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching user data:', error);
        this.loading = false;
      }
    });
  }
  

  async refreshBalance() {
    try {
      // Get updated user data from backend
      const updatedUser = await this.userService.getUserData().toPromise();
      
      // Update local balance
      this.userData.balance = updatedUser.balance;
      
      // Optional: Show feedback
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Balance updated successfully'
      });
    } catch (error) {
      console.error('Balance refresh failed:', error);
      // Handle error (e.g., show toast message)
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to update balance'
      });
    }
  }




  logout() {
    this.showLogoutDialog = true;
  }

  onLogoutConfirm() {
    this.showLogoutDialog = false;
    this.authService.logout().subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Logged out successfully'
        });
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Logout failed:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to logout'
        });
      }
    });
  }

  onLogoutCancel() {
    this.showLogoutDialog = false;
  }
}
