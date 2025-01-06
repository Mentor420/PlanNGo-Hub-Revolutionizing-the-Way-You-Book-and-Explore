import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-view-similar-flights',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './view-similar-flights.component.html',
  styleUrl: './view-similar-flights.component.css'
})
export class ViewSimilarFlightsComponent implements OnInit{
  @Input() departurePlace:String = ""
  filteredFlights:any[] = []

  constructor(private http:HttpClient, private router:Router, private route:ActivatedRoute){}

  ngOnInit(): void {
    this.getSmilarFlights()
  }

  getSmilarFlights(){
    const id = this.route.snapshot.paramMap.get('id')
    
    this.http.get(`http://localhost:3000/flights?departure.place=${this.departurePlace}`).subscribe((data:any)=>{
      this.filteredFlights = data.filter((eachItem:any) => eachItem.id !== id);
      console.log(data)
    })
  }

  navigateToFlight(id: string): void {
    console.log(id)
    this.router.navigate(['/flights', id]);
    location.reload()
  }
} 
