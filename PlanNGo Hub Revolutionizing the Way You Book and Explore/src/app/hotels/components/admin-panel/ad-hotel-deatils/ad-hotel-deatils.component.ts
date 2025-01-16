import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../services/admin.service'; 
import { Hotel } from '../../../models/interfaces';
import { Amenity } from '../../../models/interfaces';
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
  selectedHotel: Hotel | null = null;
  showDeletePopup = false;
  hotelToDeleteId: string | null = null;

  hours: string[] = Array.from({ length: 12 }, (_, i) => (i + 1).toString());
  minutes: string[] = ['00', '15', '30', '45'];

  checkinHour = '10';
  checkinMinute = '00';
  checkinPeriod = 'AM';
  checkoutHour = '12';
  checkoutMinute = '00';
  checkoutPeriod = 'PM';

  showAddHotelPopup: boolean = false; 
  newHotel: Hotel = {
    id: '', 
    city: '',
    name: '',
    description: '',
    pricePerNight: 0,
    roomsAvailable: 0,
    rooms: [], // Empty array for now
    amenities: [], // Empty array for now
    rating: 0,
    reviewsCount: 0,
    checkin: '',
    checkout: '',
    rules: [], // Empty array for now
    location: '',
    images: [], // Empty array for now
    bookings: [], // Empty array for now
    ratings: { averageRating: 0, ratingsCount: 0, ratingBreakdown: {"1": 0, "2": 0, "3": 0, "4": 0, "5": 0} },
    bankOffer: [] // Empty array for now
  };
  

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
      hotel.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      hotel.id.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  openHotelDetails(hotel: Hotel): void {
    this.selectedHotel = hotel; 
  }

  closePopup(): void {
    this.selectedHotel = null; 
  }

  // Open the Add Hotel Popup
  openAddHotelPopup(): void {
    // Initialize newHotel with the required properties
    this.newHotel = {
      ...this.newHotel,
      name: '',
      description: '',
      pricePerNight: 0,
      city: '',
      roomsAvailable: 0,
      amenities: [],
      rating: 0,
      reviewsCount: 0,
      checkin: '',
      checkout: '',
      location: '',
      rules: [],
      images: [],
      bankOffer: [],
    };
    this.showAddHotelPopup = true;
  }
  

  // Close the Add Hotel Popup
  closeAddHotelPopup(): void {
    this.showAddHotelPopup = false;
  }

  
  // Add a new hotel to the database
  addHotel(): void {
    this.newHotel.checkin = `${this.checkinHour}:${this.checkinMinute} ${this.checkinPeriod}`;
    this.newHotel.checkout = `${this.checkoutHour}:${this.checkoutMinute} ${this.checkoutPeriod}`;
    
    if (!this.newHotel.id) {
      this.generateUniqueHotelId((uniqueId: string) => {
        this.newHotel.id = uniqueId;
        this.submitNewHotel(); // Proceed to add the hotel with the unique ID
      });
    } else {
      this.submitNewHotel(); // If ID already exists, directly submit the hotel
    }
  }

  // Generate a unique hotel ID
  generateUniqueHotelId(callback: (uniqueId: string) => void): void {
    const prefix = 'hT0';

    const generateRandomId = (): string => {
      const randomNum = Math.floor(Math.random() * 1000); // Generate random number
      return `${prefix}${randomNum}`;
    };

    const checkUniqueId = (generatedId: string): void => {
      this.adminService.getAllHotels().subscribe(
        (hotels) => {
          const idExists = hotels.some((hotel) => hotel.id === generatedId);
          if (idExists) {
            // If ID exists, generate a new one and check again
            const newId = generateRandomId();
            checkUniqueId(newId);
          } else {
            // If ID is unique, return it via the callback
            callback(generatedId);
          }
        },
        (error) => {
          console.error('Error checking unique ID:', error);
        }
      );
    };

    // Start with an initial generated ID
    const initialId = generateRandomId();
    checkUniqueId(initialId);
  }

  // Helper method to submit the new hotel to the backend
  submitNewHotel(): void {
    this.adminService.addHotel(this.newHotel).subscribe(
      (response) => {
        console.log('Hotel added successfully:', response);
        alert('Hotel added successfully!');
        this.closeAddHotelPopup(); // Close the popup after successful addition
        this.fetchHotels(); // Refresh the hotel list
      },
      (error) => {
        console.error('Error adding hotel:', error);
        alert('Failed to add hotel.');
      }
    );
  } 

  addRule() {
    this.newHotel.rules.push('');
  }

  removeRule(index: number) {
    this.newHotel.rules.splice(index, 1);
  }

  addAmenity() {
    const nextId = this.newHotel.amenities.length + 1;
    const amenity: Amenity = {
      id: nextId.toString(), // Assign a unique ID
      name: '',
      description: '',
      icon: '', 
      available: true
    };
    this.newHotel.amenities.push(amenity);
  }

  removeAmenity(index: number) {
    this.newHotel.amenities.splice(index, 1);
  }

  addImage() {
    this.newHotel.images.push('');
  }

  removeImage(index: number) {
    this.newHotel.images.splice(index, 1);
  }

  confirmDelete(hotelId: string): void {
    this.hotelToDeleteId = hotelId;
    this.showDeletePopup = true;
  }

  closeDeletePopup(): void {
    this.showDeletePopup = false;
    this.hotelToDeleteId = null;
  }

  deleteHotel(): void {
    if (this.hotelToDeleteId) {
      this.adminService.deleteHotel(this.hotelToDeleteId).subscribe(
        () => {
          this.filteredHotels = this.filteredHotels.filter(hotel => hotel.id !== this.hotelToDeleteId);
          this.closeDeletePopup(); // Close popup after deletion
        },
        (error) => {
          console.error('Error deleting hotel:', error);
          this.closeDeletePopup(); // Close popup even if error occurs
        }
      );
    }
  }
}
