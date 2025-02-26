import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-record',
  standalone:true,
  imports: [CommonModule, RouterOutlet,RouterModule],
  templateUrl: './record.component.html',
  styleUrl: './record.component.css'
})
export class RecordComponent {

  activeTab: string = 'open-order'; // Default active tab

  // Method to set the active tab
  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  // Method to check if a tab is active
  isActive(tab: string): boolean {
    return this.activeTab === tab;
  }

}




