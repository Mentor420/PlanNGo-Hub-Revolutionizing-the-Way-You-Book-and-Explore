import { Component } from '@angular/core';
import { AdSidebarComponent } from '../ad-sidebar/ad-sidebar.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-ad-room-details',
  standalone: true,
  imports: [AdSidebarComponent, CommonModule, FormsModule],
  templateUrl: './ad-room-deatils.component.html',
  styleUrls: ['./ad-room-deatils.component.css']
})
export class AdRoomDeatilsComponent {
  sidebarCollapsed = false; // To manage sidebar state
  searchQuery = ''; // For search functionality
  rooms = [
    { id: 'T057', location: 'Guwahati', description: 'Lorem ipsum dolor sit amet...', price: 6500, available: true },
    { id: 'T088', location: 'Guwahati', description: 'Consectetur adipiscing elit...', price: 7800, available: true }
  ];
  filteredRooms = [...this.rooms]; // Initialize with all rooms

  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  filterRooms() {
    const query = this.searchQuery.toLowerCase();
    this.filteredRooms = this.rooms.filter(room =>
      room.id.toLowerCase().includes(query) ||
      room.location.toLowerCase().includes(query) ||
      room.description.toLowerCase().includes(query)
    );
  }
}
