import { Component } from '@angular/core';
import {ManageBookingComponent} from "../manage-booking/manage-booking.component";
import {DashboardComponent} from "../../../authentication/components/dashboard/dashboard.component";

@Component({
  selector: 'app-tour-dashboard',
  standalone: true,
  imports: [
    ManageBookingComponent,
    DashboardComponent
  ],
  templateUrl: './tour-dashboard.component.html',
  styleUrl: './tour-dashboard.component.css'
})
export class TourDashboardComponent {

}
