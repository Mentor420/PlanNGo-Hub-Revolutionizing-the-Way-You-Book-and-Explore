import { Routes } from '@angular/router';
import { FlightComponent } from './flight/components/pages/customer/flight/flight.component';
import { FlightBookingComponent } from './flight/components/pages/customer/flight-booking/flight-booking.component';
import { CancelBookingComponent } from './flight/components/pages/customer/cancel-booking/cancel-booking.component';
import { BookingHistoryComponent } from './flight/components/pages/customer/booking-history/booking-history.component';
import { NotFoundComponent } from './flight/components/not-found/not-found.component';
import { AdminFlightsComponent } from './flight/components/pages/admin/admin-flights/admin-flights.component';
import { EditServiceComponent } from './flight/components/pages/admin/edit-service/edit-service.component';

export const routes: Routes = [
    {
        path: "flight",
        children: [
          {
            path:"",
            component: FlightComponent,
          },
          {
            path: ":id",
            component: FlightBookingComponent
          },
          {
            path: "booking/cancel",
            component: CancelBookingComponent
          },
          {
            path: "booking/history",
            component: BookingHistoryComponent
          }
        ]
      },
      {
        path: "admin/flight",
        children: [
          {
            path:"",
            component: AdminFlightsComponent,
          },
          {
            path: "edit/:id",
            component: EditServiceComponent
          },
        ]
      },
      {
        path: "**",
        component: NotFoundComponent
      }
];
