import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { CabCardDetails } from '../../model/cabcard-details';

@Component({
  selector: 'app-booking-confirmation',
  standalone: true,
  imports: [CommonModule],
  template: `
    


    <div class="popup-overlay" >
      <div class="popup-content" (click)="$event.stopPropagation()">

              <div id="grad">
          <button class="close-btn" (click)="onClose()">×</button>
<div class="tick"></div>


         <div class="booking-confirmation-popup">
        <div class="confirmation-content">
          <i class="fas fa-check-circle checkmark"></i>
          <h3>Booking Confirmed!</h3>
          <p>Your cab has been successfully booked. Enjoy your ride!</p>
          <div class="cab-features">
          <br>

        <img src="/assets/driverlgog.jpg" class="driverlogo" alt="">
            
            <h3>Cab Features</h3>
            <ul>
                <li>✔ Wi-Fi Enabled</li>
                <li>✔ Child Seat Available</li>
                <li>✔ Pet-Friendly</li>
                <li>✔ Air-Conditioned</li>
            </ul>
        </div>
        <div class="contact">
            <h3>Need our help?</h3>
            <p>Call us in case you face any issue in our service:</p>
            <p class="number">94552 31245</p>
        </div>




        <div class="action-buttons">
          <button class="ok-btn" (click)="onClose()">OK</button>
        </div>


        

      </div>
    </div>
  `,
  styleUrls: ['./booking-confirmation.component.css'],
})
export class BookingConfirmationComponent {
  @Input() cabDetails!: CabCardDetails;
  @Input() onClose!: () => void;
}
