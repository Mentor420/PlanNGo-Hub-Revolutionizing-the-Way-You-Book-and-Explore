import { Routes } from '@angular/router';
import { InfoComponent } from "./info/info.component";
import { TourPlanComponent } from "./tour-plan/tour-plan.component";
import {GalleryComponent} from "./gallery/gallery.component";
import {CompareComponent} from "./compare/compare.component";
import {LocationComponent} from "./location/location.component";
import {HomeComponent} from "./home/home.component";
import {AddtoursComponent} from "./addtours/addtours.component"
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
    path: "compare/:id",
    component: CompareComponent
  },
  {
    path: "",
    component: HomeComponent
  },
  {
    path:"addtours",
    component:AddtoursComponent,
  }
];
