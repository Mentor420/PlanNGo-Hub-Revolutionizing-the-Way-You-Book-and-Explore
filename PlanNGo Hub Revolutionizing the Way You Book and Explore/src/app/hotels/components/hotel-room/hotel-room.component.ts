import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HotelSearchService } from './../../services/hotel-search.service';
import { CommonModule, Location } from '@angular/common';
import { Router } from '@angular/router';
import { HotelIdService } from '../../services/hotel-id.service';
import { Room } from '../../models/interfaces'; 

@Component({
  standalone: true,
  selector: 'app-hotel-room',
  imports: [CommonModule,
    RouterModule],
  templateUrl: './hotel-room.component.html',
  styleUrls: ['./hotel-room.component.css']
})

export class HotelRoomComponent implements OnInit {
  hotel: any = {}; // To hold hotel details
  rooms: Room[] = []; // To hold available rooms

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private hotelSearchService: HotelSearchService,
    private hotelIdService: HotelIdService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const hotelId = params['hotelId'];
      console.log('Hotel ID:', hotelId);
      if (hotelId) {
        this.hotelSearchService.getHotelDetails(hotelId).subscribe(
          (hotel) => {
            this.hotel = hotel;
            this.rooms = hotel.rooms;
          },
          (error) => {
            console.error('Error fetching hotel data:', error);
          }
        );
      }
    });
  }

  goBack(): void {
    this.location.back(); // Navigates to the previous page
  }

  goToPage(hotelId: string, roomId: string) : void{
      console.log('Hotel ID:', hotelId);
      console.log('Room ID:', roomId);
      this.hotelIdService.setHotelId(hotelId);
      this.router.navigate([`/room/${roomId}/booking-form`], { queryParams: { hotelId , roomId } });
  }
}
