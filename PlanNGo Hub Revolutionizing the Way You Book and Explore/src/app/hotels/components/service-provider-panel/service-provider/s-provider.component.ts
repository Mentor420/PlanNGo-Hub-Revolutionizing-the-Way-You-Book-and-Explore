import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
import Chart from 'chart.js/auto';
import { ServiceProviderService } from '../../../services/service-provider.service';
import { Amenity, Booking, Hotel, Provider } from '../../../models/interfaces';
import { filter } from 'rxjs';
import { AdminService } from '../../../services/admin.service';

@Component({
  selector: 'app-service-provider',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './s-provider.component.html',
  styleUrls: ['./s-provider.component.css'],
})
export class ServiceProviderComponent implements OnInit {
  providerData = {
    name: '',
    hotels: [] as Hotel[],
    recentBookings: [] as Booking[],
    totalHotels: 0,
    totalBookings: 0,
    totalRevenue: 0,
  };

  hours: string[] = Array.from({ length: 12 }, (_, i) => (i + 1).toString());
  minutes: string[] = ['00', '15', '30', '45'];

  checkinHour = '10';
  checkinMinute = '00';
  checkinPeriod = 'AM';
  checkoutHour = '12';
  checkoutMinute = '00';
  checkoutPeriod = 'PM';

  showAddHotelPopup: boolean = false;
  isChildRoute = false;

  providerId = ''; // Set dynamically based on the logged-in provider or selection

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
    bankOffer: [] // Empty array for now
  };

  constructor(private router: Router, private route: ActivatedRoute, private serviceProviderService: ServiceProviderService, private adminService: AdminService) { }

  async ngOnInit(): Promise<void> {
    try {
      await this.checkUserAndInitializeProvider(); // Wait for the check to complete
      // console.log('Provider ID:', this.providerId);
      if(this.providerId){
        this.fetchProviderData(); // Execute after the providerId is initialized
        this.fetchRecentBookings();
      }
    } catch (error) {
      console.error('Error during initialization:', error);
    }

    // Detect if the current route is a child
    if (typeof window !== 'undefined') {
      this.router.events
        .pipe(filter((event) => event instanceof NavigationEnd))
        .subscribe(() => {
          const currentRoute = this.router.url;
          console.log(currentRoute);
          this.isChildRoute = currentRoute.includes('service-hotel?providerId');

          sessionStorage.setItem('isChildRoute', JSON.stringify(this.isChildRoute));

          if (!this.isChildRoute) {
            this.ngOnInit();
          }
        });

      const storedRouteState = sessionStorage.getItem('isChildRoute');
      if (storedRouteState) {
        this.isChildRoute = JSON.parse(storedRouteState);
      }
    }
  }

  // Function to check the user's role and email, and initialize provider
  async checkUserAndInitializeProvider(): Promise<void> {
    try {
      if (typeof window !== 'undefined') {
        const email = localStorage.getItem('email');
        const role = localStorage.getItem('role');
  
        if (role === 'Service Provider' && email) {
          const providerId = this.generateUniqueProviderId(email);
  
          // Use toPromise to wait for the response from getProviders
          const providers = await this.serviceProviderService.getProviders().toPromise();
  
          if (providers) {
            const existingProvider = providers.find((provider) => provider.provider_id === providerId);
  
            if (!existingProvider) {
              // Add new provider to the backend
              const newProvider: Provider = {
                provider_id: providerId,
                name: `Provider for ${email}`, // Adjust naming convention as needed
              };
  
              await this.serviceProviderService.addProvider(newProvider).toPromise();
              console.log('New provider added:', newProvider);
            } else {
              console.log('Provider already exists:', existingProvider);
            }
  
            // Set the providerId to be used throughout the component
            this.providerId = providerId;
            // console.log('Provider ID initialized:', this.providerId);
          } else {
            console.error('Failed to fetch providers: Data is undefined.');
          }
        }
      }
    } catch (error: any) {
      console.error('Failed to initialize provider:', error.message);
      throw new Error('Failed to initialize provider: ' + error.message);
    }
  }  
  

  // Generate a unique provider ID using the email
  generateUniqueProviderId(email: string): string {
    // Simple hash function to create a unique provider ID
    let hash = 0;
    for (let i = 0; i < email.length; i++) {
      hash = (hash << 5) - hash + email.charCodeAt(i);
      hash |= 0; // Convert to 32bit integer
    }
    return `Provider${Math.abs(hash)}`; // Ensure positive ID
  }

  fetchProviderData(): void {
    // console.log('Fetching provider data for provider ID:', this.providerId);
    this.serviceProviderService.getProviderDetails(this.providerId).subscribe((provider: Provider | null) => {
      if (provider) {
        this.providerData.name = provider.name;

        this.serviceProviderService.getHotelsByProvider(this.providerId).subscribe((hotels: Hotel[]) => {
          this.providerData.hotels = hotels;
          this.providerData.totalHotels = hotels.length;
          this.providerData.totalBookings = hotels.reduce(
            (total, hotel) => total + hotel.bookings.length,
            0
          );
          this.providerData.totalRevenue = hotels.reduce(
            (total, hotel) => total + hotel.bookings.reduce((sum, booking) => sum + booking.price, 0),
            0
          );

          // Initialize both charts after data is fetched
          this.createBookingsChart();
          this.createRevenueChart();
        });
      }
    });
  }

  // Fetch recent bookings
  fetchRecentBookings() {
    this.serviceProviderService.getRecentBookingsByProvider(this.providerId).subscribe((bookings) => {
      this.providerData.recentBookings = bookings;
    });
  }

  // Open the Add Hotel Popup
  openAddHotelPopup(): void {
    // Initialize newHotel with the required properties
    this.newHotel = {
      ...this.newHotel,
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
    this.newHotel.name = this.capitalizeEachWord(this.newHotel.name);
    this.newHotel.city = this.capitalizeEachWord(this.newHotel.city);
    this.newHotel.checkin = `${this.checkinHour}:${this.checkinMinute} ${this.checkinPeriod}`;
    this.newHotel.checkout = `${this.checkoutHour}:${this.checkoutMinute} ${this.checkoutPeriod}`;
    
    if (!this.newHotel.id) {
      this.generateUniqueHotelId((uniqueId: string) => {
        this.newHotel.id = uniqueId;
        if(!this.newHotel.provider_id){
          this.newHotel.provider_id = this.providerId;
        }
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
        this.ngOnInit();
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

  createBookingsChart(): void {
    if (typeof document !== 'undefined') {
      const ctx = document.getElementById('bookingsChart') as HTMLCanvasElement;
      if (ctx) {
        new Chart(ctx, {
          type: 'pie',
          data: {
            labels: this.providerData.hotels.map((hotel) => hotel.name),
            datasets: [
              {
                label: 'Bookings by Hotel',
                data: this.providerData.hotels.map((hotel) => hotel.bookings.length),
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
                hoverOffset: 4,
              },
            ],
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
              },
            },
          },
        });
      }
    }
  }

  createRevenueChart(): void {
    if (typeof document !== 'undefined') {
      const ctx = document.getElementById('revenueChart') as HTMLCanvasElement;
      if (ctx) {
        new Chart(ctx, {
          type: 'bar',
          data: {
            labels: this.providerData.hotels.map((hotel) => hotel.name),
            datasets: [
              {
                label: 'Revenue by Hotel',
                data: this.providerData.hotels.map((hotel) =>
                  hotel.bookings.reduce((sum, booking) => sum + booking.price, 0)
                ),
                backgroundColor: ['#4CAF50', '#FF9800', '#2196F3'],
              },
            ],
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
              },
            },
            scales: {
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: 'Revenue (in Rupees)',
                },
              },
            },
          },
        });
      }
    }
  }

  getHotelRevenue(hotel: Hotel): number {
    if (!hotel.bookings || hotel.bookings.length === 0) {
      return 0; // No bookings, revenue is 0
    }

    return hotel.bookings
      .filter((booking) => booking.id) // Filter bookings that have a valid `id`
      .reduce((sum, booking) => sum + (typeof booking.price === 'number' ? booking.price : 0), 0); // Sum up valid prices
  }

  viewDetails(providerId: string, hotelId: string): void {
    this.router.navigate(['/s-provider/service-hotel'], {
      queryParams: { providerId, hotelId },
    });
  }
}
