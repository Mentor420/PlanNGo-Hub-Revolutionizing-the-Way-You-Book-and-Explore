import { Component, OnInit, Inject, PLATFORM_ID } from "@angular/core"
import { ActivatedRoute } from "@angular/router"
import { CommonModule, isPlatformBrowser } from "@angular/common"
import { Location } from "@angular/common"
import { Router } from "@angular/router"
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms"
import { Hotel, Amenity } from "../../models/interfaces"
import { HotelSearchService } from "../../services/hotel-search.service"
import { subscribe } from "diagnostics_channel"

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  selector: "app-search-results",
  templateUrl: "./search-results.component.html",
  styleUrls: ["./search-results.component.css"],
})
export class SearchResultsComponent implements OnInit {
  hotelcity: string = ""
  searchResults: Hotel[] = []
  filteredResults: Hotel[] = []
  formData: { location: string; checkInDate: string; checkOutDate: string; rooms: number; priceRange?: number[]; amenities?: string[]; } = { location: "" , checkInDate: "", checkOutDate: "", rooms: 1 }
  filterForm: FormGroup
  amenitiesOptions: string[] = [
    "Wi-Fi",
    "Pool",
    "Parking",
    "Breakfast",
    "Gym",
    "Spa",
    "Airport Shuttle",
    "Business Center",
    "Pet-Friendly",
  ];

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private hotelSearchService: HotelSearchService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.filterForm = this.formBuilder.group({
      location: [''],
      checkInDate: [''],
      checkOutDate: [''],
      rooms: [1],
      price: [''],
      star5: [false],
      star4: [false],
      star3: [false],
      star2: [false],
      star1: [false],
      amenities: this.formBuilder.array(this.amenitiesOptions.map(() => false))
    });
  }

  viewHotelDetails(hotel: any): void {
    this.router.navigate(["/page"], { queryParams: { id: hotel.id } })
  }

  goBack(): void {
    this.location.back()
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const navigation = history.state as any
      this.searchResults = navigation.results || []
      this.formData = navigation.formData || { location: "" }

      if (!this.searchResults.length) {
        console.warn("No results found; ensure client-side navigation passed results.")
      }

      this.initializeFilterForm();
      this.filterResults();
    } else {
      console.warn("SSR environment: history.state is not accessible")
      this.searchResults = []
    }
  }

  getAmenityNames(amenities: Amenity[]): string {
    if (!amenities || amenities.length === 0) {
      return "No amenities available"
    }
    return amenities.map((a) => a.name).join(", ")
  }

  // Calculate stars for each hotel
  getStarArray(rating: number): { fullStars: number[]; halfStars: number[]; emptyStars: number[] } {
    const fullStars = Math.floor(rating); // Full stars based on the rating
    const halfStars = (rating - fullStars) >= 0.5 ? 1 : 0; // Half star if the rating is >= 0.5
    const emptyStars = 5 - fullStars - halfStars; // Remaining empty stars
    
    return {
      fullStars: Array(fullStars).fill(0),
      halfStars: Array(halfStars).fill(0),
      emptyStars: Array(emptyStars).fill(0),
    };
  }

  private filterResults(): void {
    const formValues = this.filterForm.value;

    // Update hotelcity whenever the filter changes
    this.hotelcity = this.toProperCase(formValues.location);

    // Get selected amenities from the filter form
    const selectedAmenities = this.amenitiesOptions.filter((_, index) => formValues.amenities[index]);

    // Get selected star ratings
    const selectedStars = [5, 4, 3, 2, 1].filter((star) => formValues[`star${star}`]);

    this.filteredResults = this.searchResults.filter((hotel) => {
      const matchesStatus = hotel.status !== 'Inactive'; // Exclude inactive hotels
      const matchesLocation =
        !formValues.location || hotel.city.toLowerCase().includes(formValues.location.toLowerCase());
      
      const matchesRooms = !formValues.rooms || hotel.roomsAvailable >= formValues.rooms;

      const matchesPrice =
        !formValues.price ||
        (hotel.pricePerNight >= Number(formValues.price.split("-")[0]) &&
          hotel.pricePerNight <= Number(formValues.price.split("-")[1]));
      const matchesAmenities =
        selectedAmenities.length === 0 || selectedAmenities.every((amenity) =>
          hotel.amenities.some((hotelAmenity) => hotelAmenity.name.toLowerCase() === amenity.toLowerCase()),
        );
      const matchesStarRating =
        selectedStars.length === 0 || selectedStars.includes(Math.round(hotel.ratings.averageRating));

      return matchesStatus && matchesLocation && matchesPrice && matchesRooms && matchesAmenities && matchesStarRating;
    });
  }

  onFilterChange(): void {
    this.filterResults()
  }

  private toProperCase(city: string): string {
    if (!city) return ""; // Handle empty or undefined input
    return city.charAt(0).toUpperCase() + city.slice(1).toLowerCase();
  }

  onNewSearch(): void {
    const formValues = this.filterForm.value

    // Update hotelcity to reflect the current filter and Convert the city name to proper case before updating hotelcity
    this.hotelcity = this.toProperCase(formValues.location);

    const selectedAmenities = this.amenitiesOptions.filter((_, index) => formValues.amenities[index])

    this.hotelSearchService
      .searchHotels(
        this.hotelcity,
        formValues.checkInDate,
        formValues.checkOutDate,
        formValues.rooms,
        formValues.price ? formValues.price.split("-").map(Number) : undefined,
        selectedAmenities,
      )
      .subscribe(
        (results: Hotel[]) => {
          // Filter out inactive hotels after fetching results
          this.searchResults = results.filter((hotel) => hotel.status !== 'Inactive');
          this.filterResults()
        },
        (error) => {
          console.error("Error fetching hotels:", error)
        },
      )
  }

  private initializeFilterForm(): void {
    // Initialize the form with formData.amenities if they exist
    this.filterForm.patchValue({
      location: this.formData.location,
      checkInDate: this.formData.checkInDate,
      checkOutDate: this.formData.checkOutDate,
      rooms: this.formData.rooms,
      price: this.formData.priceRange ? `${this.formData.priceRange[0]}-${this.formData.priceRange[1]}` : "",
    });

    // Set the amenities checkboxes based on formData.amenities
    const amenitiesFormArray = this.filterForm.get('amenities') as any;  // Get the amenities FormArray
    const amenitiesSelections = this.amenitiesOptions.map((amenity) =>
      this.formData.amenities?.includes(amenity) || false // Preselect amenities based on formData
    );
    console.log("Amenities:", amenitiesSelections);
    amenitiesSelections.forEach((selected: boolean, index: number) => {
      if (amenitiesFormArray.at(index)) {
        amenitiesFormArray.at(index).setValue(selected); // Set the initial value of the checkbox
      }
    });
    console.log("Updated Amenities:", this.filterForm.value.amenities);
  }
}

