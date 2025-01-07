import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-hotel-room',
  standalone: true,
  imports: [],
  templateUrl: './hotel-room.component.html',
  styleUrl: './hotel-room.component.css'
})
export class HotelRoomComponent {

  constructor(private location: Location) {}

  goBack(): void {
    this.location.back(); // Navigates to the previous page
  }
}
