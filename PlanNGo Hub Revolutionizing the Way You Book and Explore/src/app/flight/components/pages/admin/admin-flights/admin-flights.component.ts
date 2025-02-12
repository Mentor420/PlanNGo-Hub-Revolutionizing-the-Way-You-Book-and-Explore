import { Component, OnInit } from '@angular/core';
import { ManageFlightsService } from '../../../../services/admin/manage-flights.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {DashboardComponent} from "../../../../../authentication/components/dashboard/dashboard.component";

@Component({
  selector: 'app-admin-flights',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, DashboardComponent],
  templateUrl: './admin-flights.component.html',
  styleUrl: './admin-flights.component.css'
})
export class AdminFlightsComponent implements OnInit {
  flightList: any[] = [];
  isView = false
  searchInput:String=""
  filteredFlights:any[]=[]
  bookings: any[] = [];
  totalBookings: number = 0;
  confirmedBookings: number = 0;
  canceledBookings: number = 0;
  isBookingAnalysis = false
  totalRevenue: number = 0;
  viewDetails:any = {
    id: '',
    airline: '',
    logo: '',
    flightNumber: '',
    departure: { place: '', date: '', time: '' },
    destination: { place: '', date: '', time: '' },
    duration: '',
    price: 0,
  };
  isPopupVisible: boolean = false;
  popupPosition = { left: 0, top: 0 };
  popupContent: string = '';
  isShowAnalysis = false

  currentPage: number = 1; 
  itemsPerPage: number = 6; 
  paginatedFlights: any[] = []; 
  isCancelled = false
  cancelID:string = ""

  // Update flights for the current page
  updatePaginatedFlights() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedFlights = this.filteredFlights.slice(startIndex, endIndex);
  }

  // Navigate to the next page
  nextPage() {
    if (this.currentPage < this.getTotalPages()) {
      this.currentPage++;
      this.updatePaginatedFlights();
    }
  }

  // Navigate to the previous page
  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedFlights();
    }
  }

  // Get the total number of pages
  getTotalPages(): number {
    return Math.ceil(this.filteredFlights.length / this.itemsPerPage);
  }

  onCancelledToggle(id:string){
    this.cancelID = id
    this.isCancelled = true
  }

  closeCancelpop(){
    this.isCancelled = false
  }

  onSearch() {
    const searchTerm = this.searchInput.toLowerCase();
    this.filteredFlights = this.flightList.filter(
      (flight) =>
        flight.airline.toLowerCase().includes(searchTerm) ||
        flight.flightNumber.toLowerCase().includes(searchTerm)
    );
    this.updatePaginatedFlights()
  }

  onAnalysisToggle(){
    this.isShowAnalysis = false
    this.bookings = []
    this.confirmedBookings = 0
    this.totalBookings = 0
    this.canceledBookings = 0
  }

  onAnalysisView(id:String){
    this.isShowAnalysis = true
    this.manageFlightsService.getSpecificbooking().subscribe((data)=>{
        const tempo=data.bookings
      this.flightList.forEach(flight => {
        tempo.forEach((flightItem: any) => {
          console.log(flightItem.flightID);
          console.log(flight.id)
          if(flight.id==flightItem.flightID){
            console.log(true)
            this.calculateSummary();
          }
        })
        return data.bookings;
        /*if(flight.id==data.bookings.id){
          this.calculateSummary();
        }*/
      })


      this.bookings = data.bookings;

    })
  }

  onBookingAnalysis(){
    this.isBookingAnalysis = true
    this.manageFlightsService.getAllBooking().subscribe((data)=>{
      this.bookings = data.bookings;
      console.log(this.bookings,"A")
      this.calculateSummary();
    })
  }

  onBookingAnalysisToggle(){
    this.isBookingAnalysis = false
    this.bookings = []
    this.confirmedBookings = 0
    this.totalBookings = 0
    this.canceledBookings = 0
  }

  calculateSummary(): void {
    this.totalBookings = this.bookings.length;
    console.log(this.totalBookings);
    this.confirmedBookings = this.bookings.filter(
      booking => booking.bookingStatus === 'Confirmed'
    ).length;

    this.canceledBookings = this.bookings.filter(
      booking => booking.bookingStatus === 'Canceled'
    ).length;
    console.log(this.confirmedBookings)
    this.totalRevenue = this.bookings
      .filter(booking => booking.bookingStatus === 'Confirmed')
      .reduce((acc, booking) => acc + booking.totalAmount, 0);
  }

  showPopup(event: MouseEvent, type: string, data: any): void {
    this.isPopupVisible = true;

    // Determine the pop-up content based on the button type
    if (type === 'edit') {
      this.popupContent = `Edit`;
    } else if (type === 'analysis') {
      this.popupContent = `Analysis`;
    }

    // Position the pop-up
    const target = event.target as HTMLElement;
    const rect = target.getBoundingClientRect();
    this.popupPosition = {
      left: rect.left + window.scrollX,
      top: rect.bottom + window.scrollY
    };
  }

  hidePopup(): void {
    this.isPopupVisible = false;
    this.popupContent = '';
  }

  constructor(private manageFlightsService: ManageFlightsService) {
    
  }

  ngOnInit() {
    this.getFlightDetails();
    this.updatePaginatedFlights();
    this.manageFlightsService.getAllBooking().subscribe((data)=>{
      this.bookings = data.bookings;
    })
  }

  getFlightDetails() {
    this.manageFlightsService.getFlights().subscribe((data:any) => {
      this.flightList = data.flights
      this.filteredFlights = data.flights

      this.updatePaginatedFlights()
    });
  }

  onOpenDetails(data: any) {
    this.isView = true
    this.viewDetails = data;
  }

  onViewToggle(){
    this.isView = !this.isView
  }

  onCancelService() {
    this.manageFlightsService.cancelFlightAndBookings(this.cancelID).subscribe((data)=>{
      console.log(data)
      location.reload()
    })
  }
}
