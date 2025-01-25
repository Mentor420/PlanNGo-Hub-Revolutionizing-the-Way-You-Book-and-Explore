import { Routes } from '@angular/router';
import { FlightComponent } from './flight/components/pages/customer/flight/flight.component';
import { FlightBookingComponent } from './flight/components/pages/customer/flight-booking/flight-booking.component';
import { CancelBookingComponent } from './flight/components/pages/customer/cancel-booking/cancel-booking.component';
import { BookingHistoryComponent } from './flight/components/pages/customer/booking-history/booking-history.component';
import { NotFoundComponent } from './flight/components/not-found/not-found.component';
import { AdminFlightsComponent } from './flight/components/pages/admin/admin-flights/admin-flights.component';
import { EditServiceComponent } from './flight/components/pages/admin/edit-service/edit-service.component';
import { LoginComponent } from './authentication/components/login/login.component';
import { RegisterComponent } from './authentication/components/register/register.component';
import { AdminComponent } from './authentication/components/admin/admin.component'
import { authGuard } from './authentication/models/guards/auth.guard';
import { CabServiceComponent } from './authentication/cab-service/cab-service.component';
import { FlightServiceComponent } from './authentication/flight-service/flight-service.component';
import { HotelServiceComponent } from './authentication/hotel-service/hotel-service.component';
import { TourServiceComponent } from './authentication/tour-service/tour-service.component';
import { HomeComponent } from './authentication/home/home.component';
import { DashboardComponent } from './authentication/components/dashboard/dashboard.component';
import { AdminCabDetailsComponent } from './authentication/components/admin-cab-details/admin-cab-details.component';
import { AdminFlightDetailsComponent } from './authentication/components/admin-flight-details/admin-flight-details.component';
import { AdminHotelDetailsComponent } from './authentication/components/admin-hotel-details/admin-hotel-details.component';
import { AdminTourDetailsComponent } from './authentication/components/admin-tour-details/admin-tour-details.component';
import { ServiceProviderDetailsComponent } from './authentication/components/service-provider-details/service-provider-details.component';
import { roleGuardGuard } from './flight/services/role-guard/role-guard.guard';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'home', component: HomeComponent, canActivate: [authGuard, roleGuardGuard] },
    { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard, roleGuardGuard] },
    { path: 'admin', component: AdminComponent, canActivate: [authGuard, roleGuardGuard] },
    { path: 'cab-service', component: CabServiceComponent, canActivate: [authGuard, roleGuardGuard] },
    { path: 'flight-service', component: FlightServiceComponent, canActivate: [authGuard, roleGuardGuard] },
    { path: 'hotel-service', component: HotelServiceComponent, canActivate: [authGuard, roleGuardGuard] },
    { path: 'tour-service', component: TourServiceComponent, canActivate: [authGuard, roleGuardGuard] },
    { path: 'service-provider-details/:id', component: ServiceProviderDetailsComponent },
    { path: 'admin-cab-details', component: AdminCabDetailsComponent, canActivate: [authGuard, roleGuardGuard] },
    { path: 'admin-hotel-details', component: AdminHotelDetailsComponent, canActivate: [authGuard, roleGuardGuard] },
    { path: 'admin-flight-details', component: AdminFlightDetailsComponent, canActivate: [authGuard, roleGuardGuard] },
    { path: 'admin-tour-details', component: AdminTourDetailsComponent, canActivate: [authGuard, roleGuardGuard] },
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    {
        path: "flight",
        children: [
          {
            path:"",
            component: FlightComponent,
            canActivate: [authGuard, roleGuardGuard] 
          },
          {
            path: ":id",
            component: FlightBookingComponent,
            canActivate: [authGuard, roleGuardGuard] 
          },
          {
            path: "booking/cancel",
            component: CancelBookingComponent,
            canActivate: [authGuard, roleGuardGuard] 
          },
          {
            path: "booking/history",
            component: BookingHistoryComponent,
            canActivate: [authGuard, roleGuardGuard] 
          }
        ]
      },
      {
        path: "admin/flight",
        children: [
          {
            path:"",
            component: AdminFlightsComponent,
            canActivate: [authGuard, roleGuardGuard] 
          },
          {
            path: "edit/:id",
            component: EditServiceComponent,
            canActivate: [authGuard, roleGuardGuard] 
          },
        ]
      },
      {
        path: "not-found",
        component: NotFoundComponent
      },
      {
        path: "**", redirectTo: 'not-found', pathMatch: 'full'
      }
      
];
