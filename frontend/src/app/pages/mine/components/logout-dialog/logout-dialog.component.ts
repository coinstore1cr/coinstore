import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-logout-dialog',
  standalone: true,
  imports: [CommonModule, ToastModule],
  template: `
    <div class="logout-dialog">
      <div class="dialog-content">
        <h3>Confirm Logout</h3>
        <p>Are you sure you want to log out?</p>
        <div class="dialog-buttons">
          <button class="cancel-btn" (click)="onCancel()">Cancel</button>
          <button class="confirm-btn" (click)="onConfirm()">Logout</button>
        </div>
      </div>
    </div>
    <p-toast></p-toast>
  `,
  styles: [`
    .logout-dialog {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.7);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }
    
    .dialog-content {
      background: #2c3339;
      padding: 20px;
      border-radius: 8px;
      width: 90%;
      max-width: 300px;
      color: white;
    }
    
    h3 {
      margin: 0 0 15px 0;
      font-size: 18px;
    }
    
    p {
      margin: 0 0 20px 0;
      color: #e0e0e0;
    }
    
    .dialog-buttons {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
    }
    
    button {
      padding: 8px 16px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
    }
    
    .cancel-btn {
      background: transparent;
      color: white;
      border: 1px solid #ffffff40;
    }
    
    .confirm-btn {
      background: #ffce1c;
      color: black;
    }
    
    .cancel-btn:hover {
      background: rgba(255, 255, 255, 0.1);
    }
    
    .confirm-btn:hover {
      background: #e6b800;
    }
  `],
  providers: [MessageService]
})
export class LogoutDialogComponent {
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  constructor(private messageService: MessageService) {}

  onConfirm() {
    this.confirm.emit();
  }

  onCancel() {
    this.cancel.emit();
  }
}