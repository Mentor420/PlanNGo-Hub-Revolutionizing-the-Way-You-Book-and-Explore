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
  roomIdDuplicate = false;
  showEditRoomPopup: boolean = false;
  selectedRoom: any = {}; // Holds the room to be edited
  hotels: { id: string; name: string }[] = [];
  showDeletePopup: boolean = false;
  roomToDelete: any = null;

  // Popup state and new room object
  showAddRoomPopup = false;
  newRoom: RoomWithHotelId = {
    hotelId: '', 
    roomId: '',
    type: '',
    description: '',
    pricePerNight: 0,
    currentCoupon: '',
    currentDiscount: 0,
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

  onImageChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedRoom.images = e.target.result; // Update the image preview
      };
      reader.readAsDataURL(file);
    }
  }

  openEditRoomPopup(room: any): void {
    this.selectedRoom = { ...room }; // Clone the room data to avoid direct binding
    this.showEditRoomPopup = true;
  }
  
  closeEditRoomPopup(): void {
    this.showEditRoomPopup = false;
  }
  
  editRoom(): void {
    if (this.selectedRoom) {
      const { hotelId, ...roomData } = this.selectedRoom;
  
      // Ensure 'benefits' is an array
      if (typeof roomData.benefits === 'string') {
        roomData.benefits = roomData.benefits.split(',').map((benefit: string) => benefit.trim());
      }
  
      // Ensure 'images' is an array
      if (typeof roomData.images === 'string') {
        roomData.images = [roomData.images];
      }
  
      this.adminService.updateRoom(hotelId, roomData).subscribe({
        next: (response) => {
          alert('Room updated successfully!');
          this.closeEditRoomPopup();
          this.fetchRooms(); // Refresh the room list
        },
        error: (err) => {
          console.error('Error updating room:', err);
          alert('Failed to update the room.');
        },
      });
    }
  }  

  openAddRoomPopup(): void {
    this.showAddRoomPopup = true;
    this.newRoom = {
      hotelId: '', 
      roomId: '',
      type: '',
      description: '',
      pricePerNight: 0,
      currentCoupon: '',
      currentDiscount: 0,
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
    if (!this.isRoomDetailsComplete()) {
      alert('Please fill in all required details and ensure valid values.');
      return;
    }

    // Check if room ID already exists for the same hotel
    if (this.isRoomIdDuplicate()) {
      alert('This Room ID already exists in the selected hotel.');
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
        this.ngOnInit();
        this.closeAddRoomPopup();
      },
      error: (err) => {
        console.error('Error adding room:', err);
        alert('Failed to add room.');
      },
    });
  }
  
  // Helper method to check if room ID already exists for the same hotel
  checkRoomIdAvailability(): void {
    this.roomIdDuplicate = this.isRoomIdDuplicate();
  }

  // Method to check if room ID already exists for the same hotel
  isRoomIdDuplicate(): boolean {
    return this.rooms.some(room => room.hotelId === this.newRoom.hotelId && room.roomId === this.newRoom.roomId);
  }

  // Updated helper method to validate room details
  isRoomDetailsComplete(): boolean {
    const requiredFields = [
      this.newRoom.hotelId,
      this.newRoom.roomId,
      this.newRoom.type,
      this.newRoom.description,
      this.newRoom.pricePerNight,
      this.newRoom.availableRooms,
      this.newRoom.images,
    ];
  
    // Check if all required fields are present and not empty
    const allFieldsPresent = requiredFields.every((field) => field !== null && field !== undefined && field !== '');
  
    // Ensure pricePerNight and availableRooms are greater than zero
    const validNumericValues =
      Number(this.newRoom.pricePerNight) > 0 && Number(this.newRoom.availableRooms) > 0;
  
    return allFieldsPresent && validNumericValues;
  }

  // Open delete confirmation popup
  openDeletePopup(hotelId: string, roomId: string): void {
    this.roomToDelete = { hotelId, roomId };
    this.showDeletePopup = true;
  }

  // Close the delete popup
  closeDeletePopup(): void {
    this.showDeletePopup = false;
    this.roomToDelete = null;
  }

  // Confirm delete and delete the room
  confirmDelete(): void {
    if (this.roomToDelete) {
      const { hotelId, roomId } = this.roomToDelete;

      // Call your delete function here (ensure to handle the actual deletion logic)
      this.deleteRoom(hotelId, roomId);

      // Close the popup
      this.closeDeletePopup();
    }
  }

  deleteRoom(hotelid: string, roomId: string): void {
    const hotelId = hotelid; // Replace with the actual hotel ID logic
    this.adminService.deleteRoomFromHotel(hotelId, roomId).subscribe({
      next: () => {
        // Remove the deleted room from the UI
        this.rooms = this.rooms.filter(room => room.roomId !== roomId);
        this.filteredRooms = this.filteredRooms.filter(room => room.roomId !== roomId);

        // Notify affected bookings
        this.adminService.notifyAffectedBookings(hotelId, roomId).subscribe({
          next: (response) => {
            console.log("Affected bookings notified:", response)
            alert("Room deleted successfully and affected bookings have been notified.")
          },
          error: (err) => {
            console.error("Error notifying affected bookings:", err)
            alert("Room deleted, but there was an error notifying affected bookings.")
          },
        })
      },
      error: (err) => {
        console.error('Error deleting room:', err);
        alert('Failed to delete room.');
      }
    });
  }
}
