import { Component, inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CabcardsComponent } from '../cabcards/cabcards.component';
import { CabCardDetails } from '../../model/cabcard-details';
import { SidebarComponent } from "../sidebar/sidebar.component";
import { SearchbarModule } from "../searchbar/searchbar.module";
import { CabService } from '../../services/cab.service';
@Component({
  selector: 'app-cab',
  standalone: true,
  imports: [CommonModule,CabcardsComponent, SidebarComponent, SearchbarModule],
  templateUrl: `./cab.component.html`,
  styleUrl: './cab.component.css'
})
export class CabComponent {
  cabCardDetailsList: CabCardDetails[] = [];
  filteredDetailsList: CabCardDetails[] = [];
  cabservice: CabService = inject(CabService);
  hasSearched: boolean = false;
  errorMessage: string = '';
  CabCardDetailsList:any="CabCardDetailsList"
  allCabs:any
  constructor() {
    this.loadInitialCabs();
  }
  async loadInitialCabs() {
    try {
      this.cabCardDetailsList = await this.cabservice.getcabCardDetailsList();
      console.log(this.cabCardDetailsList[this.CabCardDetailsList]);
      // this.filteredDetailsList = [...this.cabCardDetailsList];
      // console.log('Successfully connected to db.json. Data:', this.cabCardDetailsList);
    } catch (error) {
      console.error('Error loading cabs:', error);
    }
  }

  async handleSearch(searchCriteria: any) {
    this.hasSearched = true;

    try {
      // First check if at least rideType or location is provided
      if ((!searchCriteria.rideType && !searchCriteria.pickupLocation && !searchCriteria.dropoffLocation) && searchCriteria.time) {
        this.errorMessage = 'Please select at least a ride type or location along with time';
        this.filteredDetailsList = [];
        return;
      }
      console.log('Search criteria received:', searchCriteria);

      this.allCabs = await this.cabservice.getcabCardDetailsList();
      this.allCabs = this.allCabs[this.CabCardDetailsList];
      console.log(this.allCabs);
      this.filteredDetailsList = this.allCabs.filter((cab: CabCardDetails) => {
        // Only check for a match if the criteria is provided
        const rideTypeMatch = !searchCriteria.rideType || (searchCriteria.rideType && cab.rideType.toLowerCase().includes(searchCriteria.rideType.toLowerCase()));

        const pickupMatch = !searchCriteria.pickupLocation || (searchCriteria.pickupLocation && cab.pickupLocation.toLowerCase().trim() === searchCriteria.pickupLocation.toLowerCase().trim());

        const dropoffMatch = !searchCriteria.dropoffLocation || (searchCriteria.dropoffLocation && cab.dropoffLocation.toLowerCase().trim() === searchCriteria.dropoffLocation.toLowerCase().trim());

        const timeMatch = !searchCriteria.time || (searchCriteria.time && cab.time.toLowerCase().trim() === searchCriteria.time.toLowerCase().trim());

        // console.log(`Matching ${cab.rideType}:`, {
        //       rideTypeMatch,
        //       pickupMatch,
        //       dropoffMatch,
        //       timeMatch
        //     });
        return rideTypeMatch && pickupMatch && dropoffMatch && timeMatch;
      });

      console.log('Filtered results:', this.filteredDetailsList);
    } catch (error) {
      console.error('Error during search:', error);
    }
  }}
// this.filteredDetailsList = this.cabCardDetailsList.filter(cab => {
//   const rideTypeMatch = cab.rideType.toLowerCase().includes(searchCriteria.rideType.toLowerCase());
//   const pickupMatch = cab.pickupLocation.toLowerCase().trim() === searchCriteria.pickupLocation.toLowerCase().trim();
//   const dropoffMatch = cab.dropoffLocation.toLowerCase().trim() === searchCriteria.dropoffLocation.toLowerCase().trim();
//   const timeMatch = cab.time.toLowerCase().trim() === searchCriteria.time.toLowerCase().trim();

//   console.log(`Matching ${cab.rideType}:`, {
//     rideTypeMatch,
//     pickupMatch,
//     dropoffMatch,
//     timeMatch
//   });
//   return rideTypeMatch && pickupMatch && dropoffMatch && timeMatch;
// });
// console.log('Filtered results:', this.filteredDetailsList);console.log('Filtered results:', this.filteredDetailsList);