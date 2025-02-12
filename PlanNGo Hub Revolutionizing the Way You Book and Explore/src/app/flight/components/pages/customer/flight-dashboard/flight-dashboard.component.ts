import { Component } from '@angular/core';
import {BookingHistoryComponent} from "../../../../../hotels/components/booking-history/booking-history.component";
import {FlightBookingHistoryComponent} from "../booking-history/booking-history.component";
import {ManageBookingComponent} from "../../../../../tour/components/manage-booking/manage-booking.component";
import {NgIf} from "@angular/common";
import {DashboardComponent} from "../../../../../authentication/components/dashboard/dashboard.component";

@Component({
  selector: 'app-flight-dashboard',
  standalone: true,
    imports: [
        BookingHistoryComponent,
        FlightBookingHistoryComponent,
        ManageBookingComponent,
        NgIf,
        DashboardComponent
    ],
  templateUrl: './flight-dashboard.component.html',
  styleUrl: './flight-dashboard.component.css'
})
export class FlightDashboardComponent {

}
