import {Component} from '@angular/core';
import {NgForOf} from "@angular/common";
import {RouterLink, RouterOutlet} from "@angular/router";
import {SearchComponent} from "../search/search.component";
import {TourService} from "../../services/tour.service";
import {MatPaginatorModule, PageEvent} from "@angular/material/paginator";
import {NgxPaginationModule} from 'ngx-pagination';
import {MenuComponent} from "../menu/menu.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    NgForOf,
    RouterOutlet,
    RouterLink,
    SearchComponent,
    MatPaginatorModule,
    NgxPaginationModule,
    MenuComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class TourHomeComponent {

  tours: any[] = [];
  totalItems = 0;
  pageSize = 6; // Set pageSize to 10
  currentPage = 0;
  items: any[] = [];
  demoTours: any = [];
  constructor(private tourService: TourService) {}
  sorted:any[]=[];
  ngOnInit(): void {
    this.tourService.getTours().subscribe(data => {
      this.tours = [...this.tours,...data.a];
      this.totalItems = this.tours.length;
      this.items = this.getData(this.currentPage, this.pageSize);
    });
  }

  sortByPrice(direction: 'low' | 'high') {
    if (direction === 'low') {
      this.sorted = [...this.tours].sort((a, b) => a.price - b.price);
      console.log(this.sorted);
    } else {
      this.sorted = [...this.tours].sort((a, b) => b.price - a.price);
    }
    this.items = this.getData(this.currentPage, this.pageSize);
  }

  sortByName() {
    this.sorted = [...this.tours].sort((a, b) => a.name.localeCompare(b.name));
    this.items = this.getData(this.currentPage, this.pageSize);
  }

  onSortChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;

    switch(value) {
      case 'priceLow':
        this.sortByPrice('low');
        break;
      case 'priceHigh':
        this.sortByPrice('high');
        break;
      case 'name':
        this.sortByName();
        break;
      case 'date':
        // Implement date sorting if needed
        break;
    }
  }

  pageChanged(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.items = this.getData(this.currentPage, this.pageSize);
  }



  private getData(currentPage: number, pageSize: number): any[] {
    const startIndex = currentPage * pageSize;
    const endIndex = startIndex + pageSize;
    const arrayToUse = this.sorted.length > 0 ? this.sorted : this.tours;
    return arrayToUse.slice(startIndex, endIndex);
  }

}
