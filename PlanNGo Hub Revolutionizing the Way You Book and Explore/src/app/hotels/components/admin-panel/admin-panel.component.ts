import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service'; // Import AdminService
import { AdSidebarComponent } from './ad-sidebar/ad-sidebar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [AdSidebarComponent, CommonModule],
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent implements OnInit {
  isSidebarOpen = true;
  totalHotels: number = 0;
  totalRooms: number = 0;
  recentBookings: any[] = [];

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    // Fetch the total number of hotels and rooms
    this.adminService.getAllHotels().subscribe(hotels => {
      this.totalHotels = hotels.length;
      this.totalRooms = hotels.reduce((acc, hotel) => acc + hotel.rooms.length, 0);
    });

    // Fetch the recent bookings
    this.adminService.getRecentBookings().subscribe(bookings => {
      this.recentBookings = bookings;
    });
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}
