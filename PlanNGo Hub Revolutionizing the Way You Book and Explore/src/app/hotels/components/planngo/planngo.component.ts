import { Component } from '@angular/core';
import { SearchBarComponent } from '../search-bar/search-bar.component'; // Adjust path if needed

@Component({
  standalone: true,
  imports: [SearchBarComponent],
  selector: 'app-planngo',
  template: `
    <div>
      <h1>PlanNGo: Hotel Booking</h1>
      <app-search-bar></app-search-bar>
    </div>
  `,
  styles: [
    `
      h1 {
        text-align: center;
        color: #2c3e50;
        margin-bottom: 20px;
      }
    `,
  ],
})
export class PlanNGoComponent {}
