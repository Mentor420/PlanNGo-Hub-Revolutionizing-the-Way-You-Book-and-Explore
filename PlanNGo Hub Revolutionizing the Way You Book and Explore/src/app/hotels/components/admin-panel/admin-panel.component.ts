import { Component, OnInit, ViewChild } from '@angular/core';
import { AdminService } from '../../services/admin.service'; // Import AdminService
import { AdSidebarComponent } from './ad-sidebar/ad-sidebar.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { AdRoomDeatilsComponent } from './ad-room-deatils/ad-room-deatils.component';
import { AdHotelDeatilsComponent } from './ad-hotel-deatils/ad-hotel-deatils.component';
import { filter } from 'rxjs';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [AdSidebarComponent, CommonModule, FormsModule, RouterModule],
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
  isChildRouteActive = false;

  @ViewChild(AdHotelDeatilsComponent) hotelDetails!: AdHotelDeatilsComponent;
  @ViewChild(AdRoomDeatilsComponent) roomDetails!: AdRoomDeatilsComponent;

  constructor(private adminService: AdminService, private router: Router) {}

  ngOnInit(): void {
    // Check if we're on a child route (ad-hotel-details or ad-room-details)
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => {
      const currentRoute = this.router.url;
      this.isChildRouteActive = currentRoute.includes('ad-hotel-deatils') || currentRoute.includes('ad-room-details');
      console.log("currentRoute",currentRoute);
      console.log("component",this.isChildRouteActive);

      // Store the route state in sessionStorage
      sessionStorage.setItem('isChildRouteActive', JSON.stringify(this.isChildRouteActive));
    });

    // Retrieve the stored value from sessionStorage if it exists
    const storedRouteState = sessionStorage.getItem('isChildRouteActive');
    if (storedRouteState) {
      this.isChildRouteActive = JSON.parse(storedRouteState);
    }

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
        booking.roomId.toString().includes(query) ||
        booking.hotelId.toLowerCase().includes(query)
    );
  }

  goToHotelDetails(): void {
    this.router.navigate(['/admin-panel/ad-room-details']);
  }
}
