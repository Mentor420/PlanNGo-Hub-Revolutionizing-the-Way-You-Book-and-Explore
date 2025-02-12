import { Component } from '@angular/core';
import { CabService } from '../../services/cab.service';
import { CabcardsComponent } from '../cabcards/cabcards.component';
import { CommonModule } from '@angular/common';
import { Booking } from '../../model/booking';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DashboardComponent } from '../../../authentication/components/dashboard/dashboard.component';
@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css'],
  standalone: true,
  imports: [CabcardsComponent, CommonModule, FormsModule , RouterLink,DashboardComponent]
})
export class HistoryComponent {
  userBookings: Booking[] = [];
  userEmail: string | null = null;
  
  // Pagination properties
  currentPage: number = 1;
  itemsPerPage: number = 3;
  totalPages: number = 0;
  paginatedBookings: Booking[] = [];

  constructor(private cabService: CabService) {
    if (typeof window !== 'undefined') {
      this.userEmail = localStorage.getItem('email');
    }
    this.loadUserBookings();
  }

  async loadUserBookings() {
    if (this.userEmail) {
      console.log(true)
      try {
        this.userBookings = await this.cabService.getBookingsByUserEmail(this.userEmail);
        this.totalPages = Math.ceil(this.userBookings.length / this.itemsPerPage);
        this.updatePaginatedBookings();
      } catch (error) {
        console.error("Error loading user bookings:", error);
      }
    }
  }

  updatePaginatedBookings() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedBookings = this.userBookings.slice(startIndex, endIndex);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedBookings();
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedBookings();
    }
  }

  goToPage(pageNumber: number) {
    if (pageNumber >= 1 && pageNumber <= this.totalPages) {
      this.currentPage = pageNumber;
      this.updatePaginatedBookings();
    }
  }

  getPageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }
}