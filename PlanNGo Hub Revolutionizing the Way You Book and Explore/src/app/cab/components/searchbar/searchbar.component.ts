import { Component, Output, EventEmitter } from '@angular/core';
import { CabService } from '../../services/cab.service';
import { debounceTime, Subject } from 'rxjs';

@Component({
  selector: 'app-searchbar',
  template: `
    <div class="searchbar">
      <form (submit)="onSearch($event)">
        <!-- Pickup Location Input -->
        <input type="text" class="input-field" [(ngModel)]="pickupLocation" name="pickupLocation" placeholder="Pickup Location" (input)="onLocationInput('pickup')" list="pickupSuggestions" />
        <datalist id="pickupSuggestions">
          <option *ngFor="let location of pickupSuggestions" [value]="location"></option>
        </datalist>

        <!-- Dropoff Location Input -->
        <input type="text" class="input-field" [(ngModel)]="dropoffLocation" name="dropoffLocation" placeholder="Dropoff Location" (input)="onLocationInput('dropoff')" list="dropoffSuggestions" />
        <datalist id="dropoffSuggestions">
          <option *ngFor="let location of dropoffSuggestions" [value]="location"></option>
        </datalist>

        <!-- Ride Type -->
        <select class="select-field" [(ngModel)]="rideType" name="rideType" required>
          <option value="" disabled selected>Ride Type</option>
          <option value="SUV CAB">SUV</option>
          <option value="HATCHBACK CAB">HatchBack</option>
          <option value="Luxury CAB">Luxury</option>
          <option value="Sedan CAB">Sedan</option>
          <option value="OLA CAB">OLA</option>
          <option value="VAN CAB">VAN</option>
        </select>

        <!-- Time Dropdown -->
        <select class="select-field" [(ngModel)]="time" name="time" required>
          <option value="" disabled selected>Select Time</option>
          <option value="8:00 AM">8:00 AM</option>
          <option value="8:30 AM">8:30 AM</option>
          <option value="9:00 AM">9:00 AM</option>
          <option value="9:30 AM">9:30 AM</option>
          <option value="10:00 AM">10:00 AM</option>
          <option value="10:30 AM">10:30 AM</option>
          <option value="11:00 AM">11:00 AM</option>
          <option value="11:30 AM">11:30 AM</option>
          <option value="12:00 PM">12:00 PM</option>
          <option value="12:30 PM">12:30 PM</option>
          <option value="1:00 PM">1:00 PM</option>
          <option value="1:30 PM">1:30 PM</option>
          <option value="2:00 PM">2:00 PM</option>
          <option value="2:30 PM">2:30 PM</option>
          <option value="3:00 PM">3:00 PM</option>
          <option value="3:30 PM">3:30 PM</option>
          <option value="4:00 PM">4:00 PM</option>
          <option value="4:30 PM">4:30 PM</option>
          <option value="5:00 PM">5:00 PM</option>
          <option value="5:30 PM">5:30 PM</option>
          <option value="6:00 PM">6:00 PM</option>
          <option value="6:30 PM">6:30 PM</option>
          <option value="7:00 PM">7:00 PM</option>
          <option value="7:30 PM">7:30 PM</option>
          <option value="8:00 PM">8:00 PM</option>
          <option value="8:30 PM">8:30 PM</option>
        </select>

        <!-- Submit Button -->
        <button type="submit" class="search-btn" [class.animate]="searchClicked" (click)="onSearch($event)">
          <i class="fa-solid fa-magnifying-glass"></i>Search
        </button>

        <!-- Error Message -->
        <div *ngIf="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>
      </form>
    </div>
  `,
  styleUrl: './searchbar.component.css'
})
export class SearchbarComponent {
  @Output() searchEvent = new EventEmitter<any>();
  errorMessage: string = '';
  rideType: string = '';
  pickupLocation: string = '';
  dropoffLocation: string = '';
  time: string = '';
  searchClicked = false;
  pickupSuggestions: string[] = [];
  dropoffSuggestions: string[] = [];
  private searchSubject = new Subject<{ type: string, value: string }>();

  constructor(private cabService: CabService) {
    this.loadLocations();
    this.searchSubject.pipe(debounceTime(300)).subscribe(({ type, value }) => {
      this.filterSuggestions(type, value);
    });
  }

  async loadLocations() {
    try {
      this.pickupSuggestions = await this.cabService.getPickupLocations();
      this.dropoffSuggestions = await this.cabService.getDropoffLocations();
    } catch (error) {
      console.error('Error loading locations:', error);
    }
  }

  onLocationInput(type: string) {
    const value = type === 'pickup' ? this.pickupLocation : this.dropoffLocation;
    this.searchSubject.next({ type, value });
  }

  filterSuggestions(type: string, value: string) {
    if (type === 'pickup') {
      this.pickupSuggestions = this.pickupSuggestions.filter(location => 
        location.toLowerCase().includes(value.toLowerCase())
      );
    } else if (type === 'dropoff') {
      this.dropoffSuggestions = this.dropoffSuggestions.filter(location => 
        location.toLowerCase().includes(value.toLowerCase())
      );
    }
  }

  onSearch(event: Event) {
    event.preventDefault();
    this.errorMessage = '';
    this.searchClicked = true;

    setTimeout(() => {
      this.searchClicked = false;
    }, 600);

    if (!this.rideType && !this.pickupLocation && !this.dropoffLocation && !this.time) {
      this.errorMessage = 'Please fill in at least one search criteria before searching';
      return;
    }

    const searchCriteria = {
      rideType: this.rideType,
      pickupLocation: this.pickupLocation,
      dropoffLocation: this.dropoffLocation,
      time: this.time
    };

    this.searchEvent.emit(searchCriteria);
  }
}
