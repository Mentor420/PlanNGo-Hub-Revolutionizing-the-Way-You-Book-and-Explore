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
  hotels: { id: string; name: string }[] = [];

  // Popup state and new room object
  showAddRoomPopup = false;
  newRoom: RoomWithHotelId = {
    hotelId: '', 
    roomId: '',
    type: '',
    description: '',
    pricePerNight: 0,
    benefits: [],
    availableRooms: 0,
    images: [],
  };

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.fetchRooms();
    this.getHotels();
  }

  getHotels(): void {
    this.adminService.getAllHotels().subscribe({
      next: (hotels) => {
        this.hotels = hotels.map((hotel) => ({
          id: hotel.id,
          name: hotel.name,
        }));
      },
      error: (error) => {
        console.error('Failed to fetch hotels:', error);
      },
    });
  }

  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  openAddRoomPopup(): void {
    this.showAddRoomPopup = true;
    this.newRoom = {
      hotelId: '', 
      roomId: '',
      type: '',
      description: '',
      pricePerNight: 0,
      benefits: [],
      availableRooms: 0,
      images: [],
    };
  }

  closeAddRoomPopup(): void {
    this.showAddRoomPopup = false;
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

  // Add a new room to the selected hotel
  addRoom(): void {
    if (!this.newRoom.hotelId) {
      alert('Please select a hotel.');
      return;
    }
  
    // Ensure benefits and images are arrays
    const roomData = {
      ...this.newRoom,
      benefits: typeof this.newRoom.benefits === 'string'
        ? (this.newRoom.benefits as string).split(',').map((benefit: string) => benefit.trim())
        : Array.isArray(this.newRoom.benefits)
        ? this.newRoom.benefits
        : [],
      images: typeof this.newRoom.images === 'string'
        ? [this.newRoom.images]
        : Array.isArray(this.newRoom.images)
        ? this.newRoom.images
        : [],
    };
  
    this.adminService.addRoomToHotel(this.newRoom.hotelId, roomData).subscribe({
      next: () => {
        this.rooms.push({ ...roomData });
        this.filteredRooms.push({ ...roomData });
        alert('Room added successfully.');
        this.closeAddRoomPopup();
      },
      error: (err) => {
        console.error('Error adding room:', err);
        alert('Failed to add room.');
      },
    });
  }
  
  


  deleteRoom(hotelid: string, roomId: string): void {
    const hotelId = hotelid; // Replace with the actual hotel ID logic
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
