import { Component, Output,EventEmitter } from '@angular/core';
@Component({
  selector: 'app-searchbar',
  template: `
    <div class="searchbar">
      <form (submit)="onSearch($event)">
        
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
        
        <!-- Pickup Location Dropdown -->
        <select class="select-field" [(ngModel)]="pickupLocation" name="pickupLocation" required>
          <option value="" disabled selected>Pickup Location</option>
          <option value="Andhra Pradesh, Kurnool ">Andhra Pradesh, Kurnool </option>
          <option value="Andhra Pradesh, Tirupati ">Andhra Pradesh, Tirupati </option>
          <option value="Andhra Pradesh, Vijayawada">Andhra Pradesh, Vijayawada</option>
          <option value="Bangalore, Cyber City">Bangalore, Cyber City</option>
          <option value="Bangalore, Hebbal">Bangalore, Hebbal</option>
          <option value="Bangalore, Indiranagar">Bangalore, Indiranagar</option>
          <option value="Bangalore, Koramangala">Bangalore, Koramangala</option>
          <option value="Gurugram, DLF Phase 1">Gurugram, DLF Phase 1</option>
          <option value="Gurugram, Sector 29">Gurugram, Sector 29</option>
        </select>
        
        <!-- Dropoff Location Dropdown -->
        <select class="select-field" [(ngModel)]="dropoffLocation" name="dropoffLocation" required>
          <option value="" disabled selected>Dropoff Location</option>
          <option value="Andhra Pradesh, Guntur">Andhra Pradesh, Guntur</option>
          <option value="Andhra Pradesh, Rajahmundry">Andhra Pradesh, Rajahmundry</option>
          <option value="Andhra Pradesh, Visakhapatnam"> Andhra Pradesh, Visakhapatnam</option>
        <option value="Bangalore, Electronic City">Bangalore, Electronic City</option>
        <option value="Bangalore, Jayanagar">Bangalore, Jayanagar</option>
        <option value="Bangalore, Whitefield">Bangalore, Whitefield</option>
        <option value="Gurugram, Golf Course Road">Gurugram, Golf Course Road</option>
        <option value="Gurugram, Sohna Road">Gurugram, Sohna Road</option>
        <option value="urugram, Udyog Vihar">urugram, Udyog Vihar</option>
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
        <button
         type="submit"
          class="search-btn"
          [class.animate]="searchClicked"
          (click)="onSearch($event)"
          >
          <i class="fa-solid fa-magnifying-glass"></i>Search
        </button>
        <!-- Error Message -->
        
        <div *ngIf="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>

      </form>
    </div>
  `,
  styleUrl:'./searchbar.component.css'
})
export class SearchbarComponent {
  @Output() searchEvent = new EventEmitter<any>();
  errorMessage: string = '';
  rideType: string = '';
  pickupLocation: string = '';
  dropoffLocation: string = '';
  time: string = '';
  searchClicked = false;

  onSearch(event: Event) {
    event.preventDefault();
    this.errorMessage = '';
    this.searchClicked = true;

    setTimeout(() => {
      this.searchClicked = false;
    }, 600);
    
    // OLD Validate search criteria
    // if (!this.rideType || !this.pickupLocation || !this.dropoffLocation || !this.time) {
    //   this.errorMessage = 'Please fill in all search criteria before searching';
    //   return;
    // }
    
    if (!this.rideType && !this.pickupLocation && !this.dropoffLocation && !this.time) {
      this.errorMessage = 'Please fill in at least one search criteria before searching';
      return;
    }

    const searchCriteria ={
      rideType: this.rideType,
      pickupLocation: this.pickupLocation,
      dropoffLocation: this.dropoffLocation,
      time: this.time
    };
    // console.log('Ride Type:', this.rideType);
    // console.log('Pickup Location:', this.pickupLocation);
    // console.log('Dropoff Location:', this.dropoffLocation);
    // console.log('Ride Time:', this.time);

    this.searchEvent.emit(searchCriteria);
  }
}

