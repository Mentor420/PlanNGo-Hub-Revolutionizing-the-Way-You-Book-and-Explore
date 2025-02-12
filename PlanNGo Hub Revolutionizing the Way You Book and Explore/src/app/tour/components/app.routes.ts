import { Routes } from '@angular/router';
import { InfoComponent } from "./info/info.component";
import { TourPlanComponent } from "./tour-plan/tour-plan.component";
import {GalleryComponent} from "./gallery/gallery.component";
import {CompareComponent} from "./compare/compare.component";
import {LocationComponent} from "./location/location.component";
import {TourHomeComponent} from "./home/home.component";
import {AddtoursComponent} from "./addtours/addtours.component"
import {ToursComponent} from "./tours/tours.component";
import {BookComponent} from "./book/book.component";
import {ManageBookingComponent} from "./manage-booking/manage-booking.component";
export const routes: Routes = [{
  path: "info/:id",
  component: InfoComponent
},
{
  path: "tour-plan/:id",
  component: TourPlanComponent
},
  {
    path: "gallery/:id",
    component: GalleryComponent
  },
  {
    path: "location/:id",
    component: LocationComponent
  },
  {
    path: "compare",
    component: CompareComponent
  },
  {
    path: "",
    component: TourHomeComponent
  },
  {
    path:"addtours",
    component:AddtoursComponent,
  },
  {
    path:"tours/:id",
    component:ToursComponent,
  },
  {
    path:"booking/:id",
    component:BookComponent,
  },
  {
    path:"manage",
    component:ManageBookingComponent,
  }
];
