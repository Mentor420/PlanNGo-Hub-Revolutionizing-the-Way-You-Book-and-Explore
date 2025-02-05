import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { FormsModule } from '@angular/forms'; // Import FormsModule for ngModel

@Component({
  selector: 'app-cab',
  standalone: true, // Standalone component
  imports: [CommonModule, FormsModule], // Add CommonModule and FormsModule
  templateUrl: './cab.component.html',
  styleUrls: ['./cab.component.css'],
})
export class CabComponent {
  newDriver = {
    name: '',
    contact: '',
    vehicle: '',
    available: true,
  };

  drivers: { name: string; contact: string; vehicle: string; available: boolean }[] = [];

  registerDriver() {
    if (this.newDriver.name && this.newDriver.contact && this.newDriver.vehicle) {
      this.drivers.push({ ...this.newDriver });
      this.resetForm();
    } else {
      alert('Please fill in all fields.');
    }
  }

  resetForm() {
    this.newDriver = {
      name: '',
      contact: '',
      vehicle: '',
      available: true,
    };
  }
}
