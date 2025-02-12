import { Component, OnInit } from '@angular/core';
import { CabService } from '../../services/cab.service';
import { CabCardDetails } from '../../model/cabcard-details';
import { UpdateComponent } from '../update/update.component'
import { CommonModule } from '@angular/common';
import { CabcardsComponent } from '../cabcards/cabcards.component';
import { RouterLink } from '@angular/router';
@Component({
  standalone: true,
  selector: 'app-map-and-cabs',
  templateUrl: './mapsandcabs.component.html',
  styleUrls: ['./mapsandcabs.component.css'],
  imports: [UpdateComponent, CommonModule, CabcardsComponent , RouterLink],
})
export class MapsandcabsComponent implements OnInit {
  bookedCabs: CabCardDetails[] = [];
  currentPage: number = 1;
  cabsPerPage: number = 1; // Changed to 1 cab per page

  constructor(private cabService: CabService) { }

  ngOnInit(): void {
    this.loadBookedCabs();
  }

  async loadBookedCabs() {
    try {
      this.bookedCabs = await this.cabService.getBookedCabs();
    } catch (error) {
      console.error("Error loading booked cabs:", error);
    }
  }

  get displayedCabs(): CabCardDetails[] {
    const startIndex = (this.currentPage - 1) * this.cabsPerPage;
    const endIndex = startIndex + this.cabsPerPage;
    return this.bookedCabs.slice(startIndex, endIndex);
  }

  onPageChange(pageNumber: number): void {
    this.currentPage = pageNumber;
  }

  getPaginationArray(): number[] {
    const totalPages = Math.ceil(this.bookedCabs.length / this.cabsPerPage);
    const maxVisiblePages = 5; // Show max 5 page numbers at a time
    
    let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    // Adjust startPage if we're near the end
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    return Array(endPage - startPage + 1).fill(0).map((_, i) => startPage + i);
  }

  get totalPages(): number {
    return Math.ceil(this.bookedCabs.length / this.cabsPerPage);
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }
}