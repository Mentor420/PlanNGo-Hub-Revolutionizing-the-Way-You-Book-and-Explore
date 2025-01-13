import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../services/admin.service'; // Update the path if needed
import { Hotel } from '../../../models/interfaces'; // Assuming you have an interface for Hotel
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdSidebarComponent } from '../ad-sidebar/ad-sidebar.component';

@Component({
  selector: 'app-ad-hotel-details',
  standalone: true,
  imports: [CommonModule, FormsModule, AdSidebarComponent],
  templateUrl: './ad-hotel-deatils.component.html',
  styleUrls: ['./ad-hotel-deatils.component.css'],
})
export class AdHotelDeatilsComponent implements OnInit {
  sidebarCollapsed: boolean = false;
  searchQuery: string = '';
  hotels: Hotel[] = [];
  filteredHotels: Hotel[] = [];

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.fetchHotels();
  }

  fetchHotels(): void {
    this.adminService.getAllHotels().subscribe(
      (data: Hotel[]) => {
        this.hotels = data;
        this.filteredHotels = this.hotels; // Initialize filteredHotels
      },
      (error) => {
        console.error('Error fetching hotels:', error);
      }
    );
  }

  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  filterHotels(): void {
    this.filteredHotels = this.hotels.filter((hotel) =>
      hotel.name.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }
}
