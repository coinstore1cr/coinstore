import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-logout-dialog',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  template: `
    <div class="logout-overlay">
      <div class="logout-dialog">
        <div class="dialog-header">
          Confirm Logout
        </div>
        <div class="dialog-content">
          Are you sure you want to log out?
        </div>
        <div class="dialog-footer">
          <button pButton 
            class="p-button-text" 
            label="Cancel" 
            (click)="cancel.emit()">
          </button>
          <button pButton 
            class="p-button-warning" 
            label="Logout" 
            (click)="confirm.emit()">
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .logout-overlay {
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

    .logout-dialog {
      background: #2c3339;
      border-radius: 8px;
      width: 90%;
      max-width: 300px;
      overflow: hidden;
    }

    .dialog-header {
      background: #2c3339;
      color: white;
      padding: 1rem;
      font-size: 1.2rem;
      border-bottom: 1px solid #3f474e;
    }

    .dialog-content {
      padding: 1.5rem;
      color: #e0e0e0;
      text-align: center;
    }

    .dialog-footer {
      padding: 1rem;
      display: flex;
      justify-content: flex-end;
      gap: 0.5rem;
      background: #2c3339;
      border-top: 1px solid #3f474e;
    }

    :host ::ng-deep .p-button.p-button-warning {
      background: #ffce1c;
      color: black;
    }

    :host ::ng-deep .p-button.p-button-warning:hover {
      background: #e6b800;
    }

    :host ::ng-deep .p-button.p-button-text {
      color: white;
    }

    :host ::ng-deep .p-button.p-button-text:hover {
      background: rgba(255, 255, 255, 0.1);
    }
  `]
})
export class LogoutDialogComponent {
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
}