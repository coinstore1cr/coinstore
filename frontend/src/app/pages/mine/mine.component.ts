import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { UserDataService } from '../../services/user-data.service';


@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mine.component.html',
  styleUrls: ['./mine.component.css']
})
export class MineComponent implements OnInit {
  userData: any;
  loading = true;

  navigationItems = [
    { label: 'Deposit' },
    { label: 'Information' },
    { label: 'Service' },
    { label: 'My Subordinate' }
  ];

  constructor(
    private userService: UserService, 
    private authService: AuthService,
    private router:Router,
    private userdataService:UserDataService,
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
    } catch (error) {
      console.error('Balance refresh failed:', error);
      // Handle error (e.g., show toast message)
    }
  }




  logout() {
    this.authService.logout().subscribe({
      next: () => {
                this.router.navigate(['/login']); 
      },
      error: (error) => {
        console.error('Logout failed:', error);
       
      }
    });
  }
  
}
