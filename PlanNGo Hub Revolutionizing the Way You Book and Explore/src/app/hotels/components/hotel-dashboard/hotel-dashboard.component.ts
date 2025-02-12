import { Component } from '@angular/core';
import {BookingHistoryComponent} from "../booking-history/booking-history.component";
import {DashboardComponent} from "../../../authentication/components/dashboard/dashboard.component";

@Component({
  selector: 'app-hotel-dashboard',
  standalone: true,
  imports: [
    BookingHistoryComponent,
    DashboardComponent
  ],
  templateUrl: './hotel-dashboard.component.html',
  styleUrl: './hotel-dashboard.component.css'
})
export class HotelDashboardComponent {

}
