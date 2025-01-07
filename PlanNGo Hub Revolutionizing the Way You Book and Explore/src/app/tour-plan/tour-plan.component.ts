import { Component } from '@angular/core';
import {KeyValuePipe, NgForOf, NgIf} from "@angular/common";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {TourService} from "../tour.service";

@Component({
  selector: 'app-tour-plan',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    RouterLink,
    KeyValuePipe
  ],
  templateUrl: './tour-plan.component.html',
  styleUrl: './tour-plan.component.css'
})
export class TourPlanComponent {
  message = 'Initial Message';
  tours: any[] = [];
  tourPlans: any;
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
            this.tourImages = tour.images;
            this.tourDestination = tour.destination;
            this.tourDeparture = tour.departure;
            this.tourDepartureTime = tour.departureTime;
            this.tourReturnTime = tour.returnTime;
            this.tourDressCode = tour.dressCode;
            this.tourmap=tour.src;
            this.tourPlans = tour.tourplans
          } else {
            this.tourDescription = 'Description not found';
          }
        }
      });
    });

  }
  getTourPlansById(tourId: string) {
    const tour = this.tours.find(t => t.id === tourId);
    return tour ? tour.tourPlans : null;
  }



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
  tourmap:string | undefined;

}
