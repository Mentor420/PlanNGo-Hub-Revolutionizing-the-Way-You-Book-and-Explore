import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service'; // Import AdminService
import { AdSidebarComponent } from './ad-sidebar/ad-sidebar.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [AdSidebarComponent, CommonModule, FormsModule],
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent implements OnInit {
  isSidebarOpen = true;
  searchQuery: string = '';
  totalHotels: number = 0;
  totalRooms: number = 0;
  recentBookings: any[] = [];
  allRecentBookings: any[] = []; // Backup for unfiltered bookings

  constructor(private adminService: AdminService, private router: Router) {}

  ngOnInit(): void {
    // Fetch the total number of hotels and rooms
    this.adminService.getAllHotels().subscribe(hotels => {
      this.totalHotels = hotels.length;
      this.totalRooms = hotels.reduce((acc, hotel) => acc + hotel.rooms.length, 0);
    });

    // Fetch the recent bookings
    this.adminService.getRecentBookings().subscribe(bookings => {
      this.recentBookings = bookings;
      this.allRecentBookings = bookings;
    });
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  filterRecents(): void {
    const query = this.searchQuery.toLowerCase();
    this.recentBookings = this.allRecentBookings.filter(
      (booking) =>
        booking.fullName.toLowerCase().includes(query) ||
        booking.email.toLowerCase().includes(query) ||
        booking.roomId.toString().includes(query)
    );
  }

  goToHotelDetails(): void {
    this.router.navigate(['/ad-room-details']);
  }
}
