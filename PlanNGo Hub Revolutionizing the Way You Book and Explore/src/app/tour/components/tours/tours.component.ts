import { Component } from '@angular/core';
import { InfoComponent } from "../info/info.component";
import { TourPlanComponent } from "../tour-plan/tour-plan.component";
import { GalleryComponent } from "../gallery/gallery.component";
import { LocationComponent } from "../location/location.component";
import { BookComponent } from "../book/book.component";
import { ActivatedRoute } from "@angular/router";
import { TourService } from "../../services/tour.service";
import {MenuComponent} from "../menu/menu.component";
import {ShowcompanyComponent} from "../showcompany/showcompany.component";

@Component({
  selector: 'app-tours',
  standalone: true,
    imports: [
        InfoComponent,
        TourPlanComponent,
        GalleryComponent,
        LocationComponent,
        BookComponent,
        MenuComponent,
        ShowcompanyComponent
    ],
  templateUrl: './tours.component.html',
  styleUrl: './tours.component.css'
})
export class ToursComponent {
  protected tourId: string | null = null;
  private bookings: any;

  constructor(
    private route: ActivatedRoute,
    private tourService: TourService
  ) {}

  ngOnInit(): void {
    const emailId = "gursagar11071@protonmail.com";
    this.tourService.getUserBookings().subscribe((data: any) => {
      this.bookings = data;
      console.log(data);
    });

    this.route.paramMap.subscribe(params => {
      const tourId = params.get('id');
      if (tourId !== null) {
        this.tourId = tourId;
      }
    });
  }
}
