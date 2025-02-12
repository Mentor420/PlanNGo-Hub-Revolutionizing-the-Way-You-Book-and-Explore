import { Component, OnInit } from '@angular/core';
import { CabService } from '../../services/cab.service';
import { Booking } from '../../model/booking';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-service-provider-dashboard',
  templateUrl: './service-provider-dashboard.component.html',
  styleUrls: ['./service-provider-dashboard.component.css']
})
export class ServiceProviderDashboardComponent implements OnInit {
  bookings: Booking[] = [];
  filteredBookings: Booking[] = [];
  activeTab: 'pending' | 'accepted' | 'completed' | 'rejected' = 'pending';
  tabs: ('pending' | 'accepted' | 'completed' | 'rejected')[] = 
    ['pending', 'accepted', 'completed', 'rejected'];

  constructor(private cabService: CabService) {}

  ngOnInit(): void {
    const employeeId = localStorage.getItem('employeeId');
    if (employeeId) {
      this.loadBookings(employeeId);
    }
  }

  async loadBookings(riderId: string): Promise<void> {
    try {
      this.bookings = await this.cabService.getBookingsByRiderId(riderId);
      this.filterBookings();
    } catch (error) {
      console.error('Error loading bookings:', error);
    }
  }

  setActiveTab(tab: 'pending' | 'accepted' | 'completed' | 'rejected'): void {
    this.activeTab = tab;
    this.filterBookings();
  }

  filterBookings(): void {
    this.filteredBookings = this.bookings.filter(booking => 
      booking.status === this.activeTab
    );
  }

  private async updateBookingStatus(bookingId: string, status: Booking['status']): Promise<void> {
    await this.cabService.updateRideStatus(bookingId, status);
  }

  private updateLocalBookings(bookingId: string, newStatus: Booking['status']): void {
    const index = this.bookings.findIndex(b => b.id === bookingId);
    if (index > -1) {
      this.bookings[index].status = newStatus;
      this.filterBookings();
    }
  }

  async handleComplete(bookingId: string): Promise<void> {
    try {
      await this.cabService.finalizeRide(bookingId, 'completed');
      this.updateLocalBookings(bookingId, 'completed');
    } catch (error) {
      console.error('Error completing ride:', error);
    }
  }

  async handleAccept(bookingId: string): Promise<void> {
    try {
      await this.updateBookingStatus(bookingId, 'accepted');
      this.updateLocalBookings(bookingId, 'accepted');
    } catch (error) {
      console.error('Error accepting booking:', error);
    }
  }

  async handleReject(bookingId: string): Promise<void> {
    try {
      await this.cabService.finalizeRide(bookingId, 'rejected');
      this.updateLocalBookings(bookingId, 'rejected');
    } catch (error) {
      console.error('Error rejecting booking:', error);
    }
}
  get activeRidesCount(): number {
    return this.bookings.filter(b => b.status === 'accepted').length;
  }

  get pendingRequestsCount(): number {
    return this.bookings.filter(b => b.status === 'pending').length;
  }

  get completedRidesCount(): number {
    return this.bookings.filter(b => b.status === 'completed').length;
  }

  get rejectedRequestsCount(): number {
    return this.bookings.filter(b => b.status === 'rejected').length;
  }
}