import { Routes } from '@angular/router';
import { FlightComponent } from './flight/components/flight/flight.component';
import { CancelBookingComponent } from './flight/components/cancel-booking/cancel-booking.component';
import { BookingHistoryComponent } from './flight/components/booking-history/booking-history.component';
import { FlightBookingComponent } from './flight/components/flight-booking/flight-booking.component';
import { NotFoundComponent } from './flight/components/not-found/not-found.component';

export const routes: Routes = [
    {
        path:"flights",
        component:FlightComponent
    },
    {
        path:"flights/:id",
        component:FlightBookingComponent
    },
    {
        path:"cancel-booking",
        component:CancelBookingComponent
    },
    {
        path:"booking-history",
        component:BookingHistoryComponent
    },
    {
        path:"**",
        component:NotFoundComponent
    }
];
