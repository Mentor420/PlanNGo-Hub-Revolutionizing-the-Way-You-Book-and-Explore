import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {NgForOf, NgIf} from "@angular/common";
import {TourService} from "../../services/tour.service";
import {BookComponent} from "../book/book.component";

@Component({
  selector: 'app-info',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    RouterLink,
    BookComponent,



  ],
  templateUrl: './info.component.html',
  styleUrl: './info.component.css'
})
export class InfoComponent implements OnInit {
  currentImageIndex = 0;

  nextImage() {
    if (this.tourImages) {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.tourImages.length;
    }
  }

  previousImage() {
    if (this.tourImages) {
      this.currentImageIndex = this.currentImageIndex === 0 ?
        (this.tourImages.length - 1) : (this.currentImageIndex - 1);
    }
  }


  tours: any[] = [];
  constructor(private tourService: TourService,private route: ActivatedRoute) {}


  tourDescription: string | undefined;
  tourName: string | undefined;
  tourPrice: number | undefined;
  tourDuration: string | undefined;
  tourImages: string[] | undefined;
  tourDestination: string | undefined;
  tourDeparture: string | undefined;
  tourDepartureTime: string | undefined;
  tourReturnTime: string | undefined;
  tourDressCode: string | undefined;
  tourDescription2: string | undefined;
  protected tourId: any;


  ngOnInit(): void {
    this.tourService.getTours().subscribe(data => {
      this.tours = data.a;
      this.route.paramMap.subscribe(params => {
        const tourId = params.get('id');
        console.log(tourId);
        this.route.params.subscribe(params => {
          this.tourId = params['id'];
        });
        if (tourId) {
          const tour = this.tours.find(t => t.id == tourId);
          if (tour) {

            this.tourDescription = tour.description;
            console.log(tour.description);
            this.tourName = tour.name;
            this.tourPrice = tour.price;
            this.tourDuration = tour.duration;
            this.tourImages = tour.images;
            this.tourDestination = tour.destination;
            this.tourDeparture = tour.departure;
            this.tourDepartureTime = tour.departureTime;
            this.tourReturnTime = tour.returnTime;
            this.tourDressCode = tour.dressCode;
            this.tourDescription2 = tour.description2;
          } else {
            this.tourDescription = 'Description not found';
          }
        }
      });
    });

  }
}
