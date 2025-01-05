import { Location } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-booking-form',
  standalone: true,
  imports: [],
  templateUrl: './booking-form.component.html',
  styleUrl: './booking-form.component.css'
})

export class BookingFormComponent {
  
  constructor(private location: Location) {}

  goBack(): void {
    this.location.back();
  }
}
