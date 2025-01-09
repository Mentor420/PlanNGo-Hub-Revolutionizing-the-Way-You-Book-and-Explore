import { Route } from '@angular/router';
import { SectionComponent } from './hotels/components/section/section.component';
import { SearchResultsComponent } from './hotels/components/search-results/search-results.component';
import { PageComponent } from './hotels/components/page/page.component';
import { AboutComponent } from './hotels/components/about/about.component';
import { ContactComponent } from './hotels/components/contact/contact.component';
import { LocationComponent } from './hotels/components/location/location.component';
import { BookingFormComponent } from './hotels/components/booking-form/booking-form.component';
import { HotelRoomComponent } from './hotels/components/hotel-room/hotel-room.component';


export const routes: Route[] = [
  { path: '', component: SectionComponent },  
  { path: 'search-results', component: SearchResultsComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'location', component: LocationComponent }, 
  { path: 'room/:roomId/booking-form', component: BookingFormComponent },
  {
    path: 'page', component: PageComponent,
    children: [
      { path: 'hotel-room/:hotelId', 
        component: HotelRoomComponent, },
    ]
  },
];
