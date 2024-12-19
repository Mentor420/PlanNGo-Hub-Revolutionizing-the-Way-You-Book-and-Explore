import { Routes } from '@angular/router';
import { FlightComponent } from './flight/components/flight/flight.component';
import { CancelBookingComponent } from './flight/components/cancel-booking/cancel-booking.component';
import { BookingHistoryComponent } from './flight/components/booking-history/booking-history.component';

export const routes: Routes = [
    {
        path:"flights",
        component:FlightComponent
    },
    {
        path:"cancel-booking",
        component:CancelBookingComponent
    },
    {
        path:"booking-history",
        component:BookingHistoryComponent
    }
];
