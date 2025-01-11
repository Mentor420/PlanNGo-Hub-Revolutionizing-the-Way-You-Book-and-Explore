import { Component, Input } from '@angular/core';
import { CabCardDetails } from '../../models/cabcard-details';
import { CommonModule } from '@angular/common';
import { CabDetailsPopupComponent } from '../cab-details-popup/CabDetailsPopupComponent';
import { CabService } from '../../services/cab.service';
@Component({
  selector: 'app-cabcards',
  standalone: true,
  imports: [CommonModule, CabDetailsPopupComponent],
  template: `
    <div class="cabcard-body">
      <div class="cabcard" [class.available]="cabCardDetails.available">
        <div class="cabcard-header">
          <div class="ride-type">
            <i class="fas fa-car"></i>
            <h3>{{ cabCardDetails.rideType }}</h3>
            <h3>{{ cabCardDetails.id | slice : -2 }}</h3>
          </div>
          <div
            class="availability-badge"
            [class.not-available]="!cabCardDetails.available"
          >
            <i
              class="fas fa-check-circle fa-fade"
              *ngIf="cabCardDetails.available"
            ></i>
            {{ cabCardDetails.available ? 'Available' : 'Not Available' }}
          </div>
        </div>
        <div class="cabcard-content">
          <div class="location">
            <i class="fas fa-map-marker-alt"></i>
            <div>
              <small>Pickup</small>
              <p>{{ cabCardDetails.pickupLocation }}</p>
            </div>
          </div>
          <div class="location">
            <i class="fas fa-flag-checkered"></i>
            <div>
              <small>Dropoff</small>
              <p>{{ cabCardDetails.dropoffLocation }}</p>
            </div>
          </div>
          <div class="details">
            <div class="time">
              <i class="fas fa-clock"></i>
              <p>Time: {{ cabCardDetails.time }}</p>
            </div>
            <div class="price">
              <i class="fas fa-tag"></i>
              <p>Price: ₹{{ cabCardDetails.price }}</p>
            </div>
          </div>
        </div>
        <div class="cabcard-footer">
          <button
            class="card-buttons"
            (click)="onDetailsClick()"
            [class.animate]="detailsClicked"
          >
            <i class="fas fa-info-circle"></i> Details
          </button>
          <button
            class="card-buttons"
            (click)="onBookClick()"
            [class.animate]="bookClicked"
            [disabled]="cabCardDetails.Booked"
            >
            <div *ngIf="!cabCardDetails.Booked">Book Now</div>
            <div *ngIf="cabCardDetails.Booked">Booked</div>
            <!-- <i class="fas fa-check-circle"></i> Book Now-->
          </button>
          <button class="card-buttons-cancel" 
                  *ngIf="cabCardDetails.Booked"
                  (click)="onCancelBooking()"
                  [class.animate]="cancelClicked"
                  >
            Cancel
          </button>
        </div>
      </div>
    </div>
    @if (isPopupVisible) {
    <app-cab-details-popup
      [cabDetails]="cabCardDetails"
      [onClose]="closePopup"
    ></app-cab-details-popup>
    }
  `,
  styleUrls: ['./cabcards.component.css'],
})
export class CabcardsComponent {
  @Input() cabCardDetails!: CabCardDetails;
  detailsClicked = false;
  bookClicked = false;
  isPopupVisible = false;
  cancelClicked = false; 

  constructor(private cabService: CabService) {}
  isBooked = false; // To change the button text and booking status
  closePopup = () => {
    this.isPopupVisible = false;
  };
  onDetailsClick() {
    this.detailsClicked = true;
    this.isPopupVisible = true;
    setTimeout(() => {
      this.detailsClicked = false;
    }, 600); // Increased to match ripple animation duration
  }

  async onBookClick() {
    if (this.isBooked) return;

    this.bookClicked = true;
    try {
      // Calling the booking service function
      await this.cabService.bookCab(this.cabCardDetails.id);
      // Updating the button text and cab availability
      this.isBooked = true;
      this.cabCardDetails.available = false;
    } catch (error) {
      console.error('Error booking cab:', error);
      // Handle the error gracefully, maybe show an error message to the user
    } finally {
      // Reset animation
      setTimeout(() => {
        this.bookClicked = false;
      }, 600);
    }
  }
  async onCancelBooking() {
    this.cancelClicked = true; // Trigger Cancel button animation
    try {
      await this.cabService.cancelBooking(this.cabCardDetails.id);
      this.isBooked = false;
      this.cabCardDetails.Booked = false;
      this.cabCardDetails.available = true;
      setTimeout(() => {
        window.location.reload(); // Reload the page
      }, 3000);  
    } catch (error) {
      console.error('Error canceling booking:', error);
    } finally {
      setTimeout(() => {
        this.cancelClicked = false;
      }, 600);
    }
  }
}
