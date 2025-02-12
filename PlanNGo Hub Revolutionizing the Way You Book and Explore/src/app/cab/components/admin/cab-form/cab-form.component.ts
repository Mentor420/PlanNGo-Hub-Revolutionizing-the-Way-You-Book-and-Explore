import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CabCardDetails } from '../../../model/cabcard-details';
import { AdminCabService } from '../../../services/admin-cab.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cab-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  template: `
    <!-- cab-form.component.ts template -->
<div class="popup-overlay" (click)="onClose()">
  <div class="popup-content" (click)="$event.stopPropagation()">
    <div class="container">
      <div class="header">
        <h2>Cab Registration</h2>
      </div>
      <form [formGroup]="cabForm" (ngSubmit)="onSubmit()">
        <div class="form-columns">
          <!-- Left Column -->
          <div class="form-column">
            <div class="text-input">
              <label for="FullName">Driver's Full Name</label>
              <input type="text" id="FullName" formControlName="FullName" />
            </div>
            
            <div class="text-input">
              <label for="dob">Date of Birth</label>
              <input type="date" id="dob" formControlName="dob" />
            </div>

            <div class="text-input">
              <label for="Language">Language</label>
              <select id="Language" formControlName="Language">
                <option value="Hindi">Hindi</option>
                <option value="English">English</option>
                <option value="Telugu">Telugu</option>
                <option value="Punjabi">Punjabi</option>
              </select>
            </div>

            <div class="text-input">
              <label for="rideType">Cab Type</label>
              <select id="rideType" formControlName="rideType">
                <option value="Sedan CAB">Sedan</option>
                <option value="SUV CAB">SUV</option>
                <option value="VAN CAB">Van</option>
                <option value="HATCHBACK CAB">Hatchback</option>
                <option value="OLA CAB">OLA</option>
                <option value="Luxury CAB">Luxury</option>
              </select>
            </div>
          </div>

          <!-- Right Column -->
          <div class="form-column">
            <div class="text-input">
              <label for="pickupLocation">Pickup Location</label>
              <input type="text" id="pickupLocation" formControlName="pickupLocation" />
            </div>

            <div class="text-input">
              <label for="dropoffLocation">Dropoff Location</label>
              <input type="text" id="dropoffLocation" formControlName="dropoffLocation" />
            </div>

            <div class="input-group">
                  <div class="text-input">
                    <label>Time</label>
                    <div class="time-picker">
                      <select id="hour" formControlName="hour">
                        <option *ngFor="let h of hours" [value]="h">{{ h }}</option>
                      </select>
                      <span>:</span>
                      <select id="minute" formControlName="minute">
                        <option *ngFor="let m of minutes" [value]="m">{{ m }}</option>
                      </select>
                      <select id="period" formControlName="period">
                        <option value="AM">AM</option>
                        <option value="PM">PM</option>
                      </select>
                    </div>
                  </div>

              <div class="text-input">
                <label for="price">Price (₹)</label>
                <input type="number" id="price" formControlName="price" />
              </div>
            </div>

            <div class="input-group">
              <div class="text-input">
                <label for="Rider">Rider ID</label>
                <input type="text" id="Rider" formControlName="Rider" />
              </div>

              <div class="text-input">
                <label for="Licence">Licence Number</label>
                <input type="text" id="Licence" formControlName="Licence" />
              </div>
            </div>
          </div>
        </div>

        <div class="footer">
          <button class="button-50" type="submit">Register Cab</button>
        </div>
      </form>
    </div>
  </div>
</div>
  `,
  styleUrl: './cab-form.component.css'
})
export class CabFormComponent {
  @Input() onClose: () => void = () => {};

  hours = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
  minutes = ['00', '15', '30', '45'];

  cabForm: FormGroup = this.fb.group({
    FullName: ['', Validators.required],
    dob: ['', Validators.required],
    Language: ['Hindi', Validators.required],
    rideType: ['Sedan CAB', Validators.required],
    pickupLocation: ['', Validators.required],
    dropoffLocation: ['', Validators.required],
    hour: ['10', Validators.required],
    minute: ['00', Validators.required],
    period: ['AM', Validators.required],
    price: [1000, Validators.required],
    Rider: ['', Validators.required],
    Licence: ['', Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    private adminCabService: AdminCabService
  ) {}

  private generateCabId(): string {
    return 'cb_' + Math.random().toString(36).substr(2, 9);
  }

  private formatDob(dob: string): string {
    const date = new Date(dob);
    const month = date.toLocaleString('default', { month: 'long' });
    const day = date.getDate();
    const year = date.getFullYear();
    const age = new Date().getFullYear() - year;
    return `${month} ${day}, ${year} (${age})`;
  }

  onSubmit() {
    if (this.cabForm.valid) {
      const formValue = this.cabForm.value;
      
      const newCabData: CabCardDetails = {
        id: this.generateCabId(),
        FullName: formValue.FullName,
        dob: this.formatDob(formValue.dob),
        Language: formValue.Language,
        Rider: formValue.Rider,
        Licence: formValue.Licence,
        rideType: formValue.rideType,
        pickupLocation: formValue.pickupLocation,
        dropoffLocation: formValue.dropoffLocation,
        time: `${formValue.hour}:${formValue.minute} ${formValue.period}`,
        price: formValue.price,
        available: true,
        Booked: false,
        Cancelled: false,
        Completed: false,
        Rating: 0
      };

      this.adminCabService.createNewCab(newCabData)
        .subscribe({
          next: (response) => {
            console.log('Cab created:', response);
            this.cabForm.reset();
            this.onClose();
          },
          error: (err) => console.error('Error:', err)
        });
    }
  }
}