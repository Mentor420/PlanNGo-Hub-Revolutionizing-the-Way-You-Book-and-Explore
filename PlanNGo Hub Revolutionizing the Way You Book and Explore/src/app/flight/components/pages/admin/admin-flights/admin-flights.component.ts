import { Component, OnInit } from '@angular/core';
import { ManageFlightsService } from '../../../../services/admin/manage-flights.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-flights',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
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
    this.manageFlightsService.getSpecificbooking(id).subscribe((data)=>{
      this.bookings = data;
      this.calculateSummary();
    })
  }

  onBookingAnalysis(){
    this.isBookingAnalysis = true
    this.manageFlightsService.getAllBooking().subscribe((data)=>{
      this.bookings = data;
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

    this.confirmedBookings = this.bookings.filter(
      booking => booking.bookingStatus === 'Confirmed'
    ).length;

    this.canceledBookings = this.bookings.filter(
      booking => booking.bookingStatus === 'Canceled'
    ).length;

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

  constructor(private manageFlightsService: ManageFlightsService) {}

  ngOnInit() {
    this.getFlightDetails();
    this.updatePaginatedFlights()
  }

  getFlightDetails() {
    this.manageFlightsService.getFlights().subscribe((data:any) => {
      this.flightList = data
      this.filteredFlights = data
    });
  }

  onOpenDetails(data: any) {
    this.isView = true
    this.viewDetails = data;
  }

  onViewToggle(){
    this.isView = !this.isView
  }

  // deleteData(id: string) {
  //   this.dataService.deleteData(id).subscribe(() => this.loadData());
  // }
}
