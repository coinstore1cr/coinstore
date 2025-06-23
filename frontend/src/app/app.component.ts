import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BottomNavComponent } from './components/bottom-nav/bottom-nav.component';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, BottomNavComponent, ConfirmDialogModule],
  providers: [ConfirmationService],
  template: `
    <div class="app-container">
      <p-confirmDialog [baseZIndex]="10000" [dismissableMask]="true"></p-confirmDialog>
      <router-outlet />
      <app-bottom-nav />
    </div>
  `,
  styles: [`
    .app-container {
      background-color: #1a1f2a;
      min-height: 100vh;
      color: #ffffff;
      padding-bottom: 60px; 
    }

    :host ::ng-deep .p-dialog {
      width: 90vw;
      max-width: 400px;
    }

    :host ::ng-deep .p-confirm-dialog {
      background: #2c3339;
      color: white;
    }

    :host ::ng-deep .p-dialog .p-dialog-header {
      background: #2c3339;
      color: white;
      border-bottom: 1px solid #3f474e;
    }

    :host ::ng-deep .p-dialog .p-dialog-content {
      background: #2c3339;
      color: white;
    }

    :host ::ng-deep .p-dialog .p-dialog-footer {
      background: #2c3339;
      border-top: 1px solid #3f474e;
      padding: 1rem;
    }

    :host ::ng-deep .p-button.p-button-warning {
      background: #ffce1c;
      color: #000;
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
export class AppComponent {
  constructor(private confirmationService: ConfirmationService) {}
}