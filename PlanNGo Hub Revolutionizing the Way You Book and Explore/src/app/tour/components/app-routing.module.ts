// src/app/app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InfoComponent } from './info/info.component';
import { LocationComponent } from './location/location.component';
import { GalleryComponent } from './gallery/gallery.component';
import { CompareComponent } from './compare/compare.component';

const routes: Routes = [
  { path: 'info/:id', component: InfoComponent },
  { path: 'location', component: LocationComponent },
  { path: 'gallery', component: GalleryComponent },
  { path: 'compare', component: CompareComponent },
  // other routes...
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
