import { Component } from '@angular/core';
import { AdSidebarComponent } from "../ad-sidebar/ad-sidebar.component";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-ad-hotel-details',
  standalone: true,
  imports: [CommonModule, FormsModule, AdSidebarComponent],
  templateUrl: './ad-hotel-deatils.component.html',
  styleUrls: ['./ad-hotel-deatils.component.css']
})
export class AdHotelDeatilsComponent {
  sidebarCollapsed: boolean = false;
  searchQuery: string = '';
  hotels = [
    { name: 'Goa Point', location: 'Goa', price: 6000, image: 'https://images.unsplash.com/photo-1468824357306-a439d58ccb1c?q=80&w=1518&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    { name: 'Beach Retreat', location: 'Kerala', price: 5000, image: 'https://images.unsplash.com/photo-1511296265589-c929d6ebef26?q=80&w=1518&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' }
  ];

  get filteredHotels() {
    return this.hotels.filter(hotel => hotel.name.toLowerCase().includes(this.searchQuery.toLowerCase()));
  }

  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }
}
