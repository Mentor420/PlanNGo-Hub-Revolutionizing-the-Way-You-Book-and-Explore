import { Component, OnInit, ViewChild } from '@angular/core';
import { AdminService } from '../../services/admin.service'; // Import AdminService
import { AdSidebarComponent } from './ad-sidebar/ad-sidebar.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AdRoomDeatilsComponent } from './ad-room-deatils/ad-room-deatils.component';
import { AdHotelDeatilsComponent } from './ad-hotel-deatils/ad-hotel-deatils.component';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [AdSidebarComponent, CommonModule, FormsModule, RouterModule],
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent implements OnInit {
  isSidebarOpen = true;
  showMainContent = true;
  searchQuery: string = '';
  totalHotels: number = 0;
  totalRooms: number = 0;
  recentBookings: any[] = [];
  allRecentBookings: any[] = []; // Backup for unfiltered bookings

  @ViewChild(AdHotelDeatilsComponent) hotelDetails!: AdHotelDeatilsComponent;
  @ViewChild(AdRoomDeatilsComponent) roomDetails!: AdRoomDeatilsComponent;

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

  filterContentBySearch() {
    // Implement search behavior based on current page or data
    if (this.showMainContent) {
      // Filter for main content
      console.log('Filtering dashboard content');
      this.filterRecents();
    } else {
      // Filter for other pages
      console.log('Filtering page-specific content');
      // this.hotelDetails?.filterHotels();
      // this.roomDetails?.filterRooms();
    }
  }

  filterRecents(): void {
    const query = this.searchQuery.toLowerCase();
    this.recentBookings = this.allRecentBookings.filter(
      (booking) =>
        booking.fullName.toLowerCase().includes(query) ||
        booking.email.toLowerCase().includes(query) ||
        booking.roomId.toString().includes(query) ||
        booking.hotelId.toLowerCase().includes(query)
    );
  }

  goToHotelDetails(): void {
    this.router.navigate(['/ad-room-details']);
  }
}
