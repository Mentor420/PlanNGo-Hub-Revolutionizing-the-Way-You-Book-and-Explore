import { Component, OnInit, Inject, PLATFORM_ID } from "@angular/core"
import { ActivatedRoute } from "@angular/router"
import { CommonModule, isPlatformBrowser } from "@angular/common"
import { Location } from "@angular/common"
import { Router } from "@angular/router"
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms"
import { Hotel, Amenity } from "../../models/interfaces"
import { HotelSearchService } from "../../services/hotel-search.service"

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  selector: "app-search-results",
  templateUrl: "./search-results.component.html",
  styleUrls: ["./search-results.component.css"],
})
export class SearchResultsComponent implements OnInit {
  searchResults: Hotel[] = []
  filteredResults: Hotel[] = []
  formData: { location: string; checkInDate: string; checkOutDate: string; rooms: number; priceRange?: number[] } = { location: "" , checkInDate: "", checkOutDate: "", rooms: 1 }
  filterForm: FormGroup
  amenitiesOptions: string[] = [
    "WiFi",
    "Pool",
    "Parking",
    "Breakfast",
    "Gym",
    "Spa",
    "Airport Shuttle",
    "Business Center",
    "Pet Friendly",
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
    const formValues = this.filterForm.value
    const selectedAmenities = this.amenitiesOptions.filter((_, index) => formValues.amenities[index])
    const selectedStars = [5, 4, 3, 2, 1].filter((star) => formValues[`star${star}`])

    this.filteredResults = this.searchResults.filter((hotel) => {
      const matchesLocation =
        !formValues.location || hotel.city.toLowerCase().includes(formValues.location.toLowerCase())
      const matchesPrice =
        !formValues.price ||
        (hotel.pricePerNight >= Number(formValues.price.split("-")[0]) &&
          hotel.pricePerNight <= Number(formValues.price.split("-")[1]))
      const matchesAmenities =
        selectedAmenities.length === 0 ||
        selectedAmenities.every((amenity) =>
          hotel.amenities.some((hotelAmenity) => hotelAmenity.name.toLowerCase() === amenity.toLowerCase()),
        )
      const matchesStarRating =
        selectedStars.length === 0 || selectedStars.includes(Math.round(hotel.ratings.averageRating))

      return matchesLocation && matchesPrice && matchesAmenities && matchesStarRating
    })
  }

  onFilterChange(): void {
    this.filterResults()
  }

  onNewSearch(): void {
    const formValues = this.filterForm.value
    const selectedAmenities = this.amenitiesOptions.filter((_, index) => formValues.amenities[index])

    this.hotelSearchService
      .searchHotels(
        formValues.location,
        formValues.checkInDate,
        formValues.checkOutDate,
        formValues.rooms,
        formValues.price ? formValues.price.split("-").map(Number) : undefined,
        selectedAmenities,
      )
      .subscribe(
        (results: Hotel[]) => {
          this.searchResults = results
          this.filterResults()
        },
        (error) => {
          console.error("Error fetching hotels:", error)
        },
      )
  }

 private initializeFilterForm(): void {
    this.filterForm.patchValue({
      location: this.formData.location,
      checkInDate: this.formData.checkInDate,
      checkOutDate: this.formData.checkOutDate,
      rooms: this.formData.rooms,
      price: this.formData.priceRange ? `${this.formData.priceRange[0]}-${this.formData.priceRange[1]}` : "",
      amenities: this.amenitiesOptions.map((amenity) =>
        this.searchResults.some((hotel) => hotel.amenities.some((a) => a.name.toLowerCase() === amenity.toLowerCase())),
      ),
    })
  }
}

