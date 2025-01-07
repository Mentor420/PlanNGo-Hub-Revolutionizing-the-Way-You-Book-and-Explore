import { Component } from '@angular/core';
import {ActivatedRoute, RouterLink} from "@angular/router";
import {CurrencyPipe, NgForOf, NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {TourService} from "../tour.service";

@Component({
  selector: 'app-compare',
  standalone: true,
  imports: [
    CurrencyPipe,
    FormsModule,
    NgForOf,
    NgIf,
    RouterLink
  ],
  templateUrl: './compare.component.html',
  styleUrl: './compare.component.css'
})
export class CompareComponent {
  tours: any[] = [];
  constructor(private tourService: TourService,private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.tourService.getTours().subscribe(data => {
      this.tours = data.a;
      this.route.paramMap.subscribe(params => {
        const tourId = params.get('id');
        this.route.params.subscribe(params => {
          this.tourId = params['id'];
        });
        if (tourId) {
          const tour = this.tours.find(t => t.id === tourId);
          if (tour) {

            this.tourDescription = tour.description;
            this.tourName = tour.name;
            this.tourPrice = tour.price;
            this.tourDuration = tour.duration;
            this.tourImage=tour.image;
            this.tourImages = tour.images;
            this.tourDestination = tour.destination;
            this.tourDeparture = tour.departure;
            this.tourDepartureTime = tour.departureTime;
            this.tourReturnTime = tour.returnTime;
            this.tourDressCode = tour.dressCode;
          } else {
            this.tourDescription = 'Description not found';
          }
        }
      });

    });

  }

  selectedTour1 = this.tours[0]; // Default selection for Table 1
  selectedTour2 = this.tours[1];

  tourImage:string |undefined;
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
  protected tourId: any;


}
