import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import data from '../../models/db.json'; 
import { Location } from '@angular/common';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface Hotel {
  id: string;
  city: string;
  name: string;
  pricePerNight: number;
  roomsAvailable: number;
  amenities: string[];
}

@Component({
  selector: 'app-location',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.css']
})
export class LocationComponent implements OnInit {
  city: string = '';
  hotels: Hotel[] = []; // Ensures `hotels` is always an array

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.city = params['city'] || '';
      this.loadHotels();
    });
  }

  loadHotels(): void {
    const allHotels: Hotel[] = data.hotels || []; // Safely access data
    this.hotels = allHotels.filter(hotel =>
      hotel.city.toLowerCase() === this.city.toLowerCase()
    );
  }

  // Add the method to view hotel details
  viewHotelDetails(hotel: any): void {
    const hotelId = hotel.id; 
    console.log('Hotel ID:', hotelId); 
    this.router.navigate(['/page'], { queryParams: { id: hotelId } });
  }  
}
