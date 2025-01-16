import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../services/admin.service';
import { Booking } from '../../../models/interfaces';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdSidebarComponent } from '../ad-sidebar/ad-sidebar.component';

@Component({
  selector: 'app-ad-booking-details',
  standalone: true,
  imports: [CommonModule, FormsModule, AdSidebarComponent],
  templateUrl: './ad-booking-details.component.html',
  styleUrl: './ad-booking-details.component.css'
})
export class AdminBookingDetailsComponent implements OnInit {
  sidebarCollapsed = false;
  searchQuery = '';
  bookings: Booking[] = [];
  filteredBookings: Booking[] = [];
  loading = true;
  selectedBooking: Booking | null = null;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.fetchBookings();
  }

  fetchBookings(): void {
    this.loading = true;
    this.adminService.getRecentBookings().subscribe(
      (fetchedBookings) => {
        this.bookings = fetchedBookings;
        this.filteredBookings = fetchedBookings;
        this.loading = false;
      },
      (error) => {
        console.error('Error fetching bookings:', error);
        this.loading = false;
      }
    );
  }

  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  filterBookings(): void {
    const query = this.searchQuery.toLowerCase();
    this.filteredBookings = this.bookings.filter(booking =>
      booking.fullName.toLowerCase().includes(query) ||
      booking.email.toLowerCase().includes(query) ||
      booking.id.toLowerCase().includes(query) ||
      booking.userId.toLowerCase().includes(query) ||
      booking.hotelName?.toLowerCase().includes(query) ||
      booking.status.toLowerCase().includes(query)
    );
  }

  openBookingDetailsPopup(booking: Booking): void {
    this.selectedBooking = booking;
  }

  closeBookingDetailsPopup(): void {
    this.selectedBooking = null;
  }
}