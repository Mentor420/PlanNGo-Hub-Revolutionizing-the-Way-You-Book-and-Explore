import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../services/admin.service'; 
import { Room } from '../../../models/interfaces'; 
import { AdSidebarComponent } from '../ad-sidebar/ad-sidebar.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

  // Extended Room interface to include hotelId
  interface RoomWithHotelId extends Room {
    hotelId: string;
  }

@Component({
  selector: 'app-ad-room-details',
  standalone: true,
  imports: [CommonModule, FormsModule, AdSidebarComponent],
  templateUrl: './ad-room-deatils.component.html',
  styleUrls: ['./ad-room-deatils.component.css']
})
export class AdRoomDeatilsComponent implements OnInit {
  sidebarCollapsed = false;
  searchQuery = '';
  rooms: RoomWithHotelId[] = [];
  filteredRooms: RoomWithHotelId[] = [];
  loading = false;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.fetchRooms();
  }

  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  filterRooms() {
    const query = this.searchQuery.toLowerCase();
    this.filteredRooms = this.rooms.filter(room =>
      room.hotelId.toLowerCase().includes(query) ||
      room.roomId.toLowerCase().includes(query) ||
      room.type.toLowerCase().includes(query) ||
      room.description.toLowerCase().includes(query) ||
      room.pricePerNight.toString().includes(query) ||
      room.availableRooms.toString().includes(query) 
    );
  }

  fetchRooms(): void {
    this.loading = true;
    this.adminService.getAllRooms().subscribe({
      next: (rooms) => {
        this.rooms = rooms;
        this.filteredRooms = [...rooms];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching rooms:', err);
        this.loading = false;
      }
    });
  }

  deleteRoom(roomId: string): void {
    const hotelId = 'someHotelId'; // Replace with the actual hotel ID logic
    this.adminService.deleteRoomFromHotel(hotelId, roomId).subscribe({
      next: () => {
        // Remove the deleted room from the UI
        this.rooms = this.rooms.filter(room => room.roomId !== roomId);
        this.filteredRooms = this.filteredRooms.filter(room => room.roomId !== roomId);
        alert('Room deleted successfully.');
      },
      error: (err) => {
        console.error('Error deleting room:', err);
        alert('Failed to delete room.');
      }
    });
  }
}
