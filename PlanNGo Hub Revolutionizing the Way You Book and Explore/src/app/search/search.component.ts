import { Component } from '@angular/core';
import * as JsSearch from 'js-search';
import {FormsModule} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";
import {TourService} from "../tour.service";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    NgIf,
    RouterLink
  ],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent {

  tours: any[] = [];
  constructor(private tourService: TourService) {

  }

  ngOnInit(): void {
    this.tourService.getTours().subscribe(data => {
      this.tours = data.a;
      this.search = new JsSearch.Search('id');
      this.search.addIndex('name');
      this.search.addIndex('price')
      this.search.addDocuments(this.tours);

    });

  }

  searchResults: any[] = [];
  query: string = '';
  search: any;


  performSearch() {
    this.searchResults = this.search.search(this.query);
  }
}
