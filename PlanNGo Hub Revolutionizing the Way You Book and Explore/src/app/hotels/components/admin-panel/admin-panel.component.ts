// admin-panel.component.ts
import { Component } from '@angular/core';
import { AdSidebarComponent } from "./ad-sidebar/ad-sidebar.component";

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [AdSidebarComponent],
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent {
  isSidebarOpen = true;

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}