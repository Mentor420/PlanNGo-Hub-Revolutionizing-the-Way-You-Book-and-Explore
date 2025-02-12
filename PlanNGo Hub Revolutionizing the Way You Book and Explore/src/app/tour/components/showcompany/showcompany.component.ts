import {Component, OnInit} from '@angular/core';
import {TourService} from "../../services/tour.service";
import {NgFor, NgForOf, NgIf} from "@angular/common";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-showcompany',
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
  ],
  templateUrl: './showcompany.component.html',
  styleUrl: './showcompany.component.css'
})
export class ShowcompanyComponent implements OnInit {
  companies:any=[];
  protected tourId: string | null = null;
  tours:any=[];
  constructor(private tourService: TourService,private route: ActivatedRoute,) { }
  ngOnInit(): void {
    this.tourService.getTourCompanies().subscribe(data => {
      this.companies = data;
      console.log(this.companies);
    });
    this.tourService.getTours().subscribe(info => {
      this.tours=info.a;
      console.log(this.tours);
    })
    this.route.paramMap.subscribe(params => {
      const tourId = params.get('id');
      if (tourId !== null) {
        this.tourId = tourId;
      }
    });

  }
}
