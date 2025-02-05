import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../services/admin.service'; 
import { Hotel, Provider } from '../../../models/interfaces';
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
  selectedHotel: Hotel | null = null;
  showDeletePopup = false;
  showPermaDeletePopup = false;
  hotelToDeleteId: string | null = null;
  providers: Provider[] = [];
  groupedHotels: { providerName: string; provider_id: string; hotels: Hotel[] }[] = [];
  originalGroupedHotels: { providerName: string; provider_id: string; hotels: Hotel[] }[] = [];

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
    provider_id: '',
    city: '',
    name: '',
    description: '',
    pricePerNight: 0,
    roomsAvailable: 0,
    rooms: [], // Empty array for now
    amenities: [], // Empty array for now
    checkin: '',
    checkout: '',
    rules: [], // Empty array for now
    location: '',
    images: [], // Empty array for now
    bookings: [], // Empty array for now
    ratings: { averageRating: 0, ratingsCount: 0, ratingBreakdown: {"1": 0, "2": 0, "3": 0, "4": 0, "5": 0} },
    reviews: [], // Empty array for now
    bankOffer: [], // Empty array for now
    status: 'Active',
  };
  showMoreOptions: { [hotelId: string]: boolean } = {};
  selectedHotelId: string | null = null;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.fetchHotels();
  }
  
  fetchHotels(): void {
    this.adminService.getAllProviders().subscribe(
      (providers: Provider[]) => {
        this.providers = providers;
  
        this.adminService.getAllHotels().subscribe(
          (hotels: Hotel[]) => {
            // Group hotels by provider
            const grouped = hotels.reduce((acc, hotel) => {
              const provider = providers.find(p => p.provider_id === hotel.provider_id);
              const providerName = provider?.name || 'Unknown Provider';
  
              if (!acc[providerName]) {
                acc[providerName] = {
                  provider_id: provider?.provider_id || 'Unknown Provider ID',
                  hotels: [],
                };
              }
              acc[providerName].hotels.push(hotel);
  
              return acc;
            }, {} as { [key: string]: { provider_id: string; hotels: Hotel[] } });
  
            // Convert grouped object into an array
            this.groupedHotels = Object.entries(grouped).map(([providerName, data]) => ({
              providerName,
              provider_id: data.provider_id,
              hotels: data.hotels,
            }));
            this.originalGroupedHotels = [...this.groupedHotels];
          },
          error => {
            console.error('Error fetching hotels:', error);
          }
        );
      },
      error => {
        console.error('Error fetching providers:', error);
      }
    );
  }

  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  // Toggle the visibility of more options for a hotel
  toggleMoreOptions(hotelId: string) {
    this.showMoreOptions[hotelId] = !this.showMoreOptions[hotelId];
  }

  // Revoke the hotel, changing its status back to Active
  revokeHotel(hotelId: string) {
    // Call your service to update the hotel status
    this.adminService.updateHotelStatus(hotelId, 'Active').subscribe(() => {
      // Update the UI or perform necessary actions after revocation
      console.log('Hotel status changed to Active');
      this.ngOnInit();
      this.showMoreOptions[hotelId] = false;
    });
  }

  // Confirm deletion of the hotel (hard delete)
  confirmHardDelete(hotelId: string) {
    this.showPermaDeletePopup = true;
    this.selectedHotelId = hotelId; // Set the hotel to be deleted
  }

  closeHardDeletePopup(): void {
    this.showPermaDeletePopup = false;
    this.selectedHotelId = null;
  }

  ParmanentdeleteHotel(): void {
    if (this.selectedHotelId) {
      this.adminService.PermanentdeleteHotel(this.selectedHotelId).subscribe(
        () => {
          this.groupedHotels = this.groupedHotels.map(group => {
            return {
              ...group,
              hotels: group.hotels.filter(hotel => hotel.id !== this.selectedHotelId) // Filter hotels within the group
            };
          });
          console.log("Hotel status changed successfully");
          this.ngOnInit();
          this.closeHardDeletePopup(); // Close popup after deletion
        },
        (error) => {
          console.error('Error deleting hotel:', error);
          this.closeHardDeletePopup(); // Close popup even if error occurs
        }
      );
    }
  }

  filterHotels(): void {
    if (this.searchQuery.trim() === '') {
      // If the search query is empty, restore the original groupedHotels list
      this.groupedHotels = [...this.originalGroupedHotels];
    } else {
      // Otherwise, filter hotels based on the search query
      this.groupedHotels = this.originalGroupedHotels.map(group => {
        return {
          ...group,
          hotels: group.hotels.filter(hotel =>
            hotel.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
            hotel.id.toLowerCase().includes(this.searchQuery.toLowerCase())
          )
        };
      });
    }
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
      provider_id: '',
      name: this.capitalizeEachWord(''),
      description: '',
      pricePerNight: 0,
      city: this.capitalizeEachWord(''),
      roomsAvailable: 0,
      amenities: [],
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

  capitalizeEachWord(str: string): string {
    return str
      .split(' ') // Split the string into words
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize each word
      .join(' '); // Join the words back into a single string
  } 

  // Add a new hotel to the database
  addHotel(): void {
    if (!this.newHotel.provider_id) {
      alert('Please select a provider.');
      return;
    }
    
    this.newHotel.name = this.capitalizeEachWord(this.newHotel.name);
    this.newHotel.city = this.capitalizeEachWord(this.newHotel.city);
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
          // this.groupedHotels = this.groupedHotels.map(group => {
          //   return {
          //     ...group,
          //     hotels: group.hotels.filter(hotel => hotel.id !== this.hotelToDeleteId) // Filter hotels within the group
          //   };
          // });
          console.log("Hotel status changed successfully");
          this.ngOnInit();
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
