import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [RouterLink],
  //"https://m.media-amazon.com/images/I/71cR+sc93tL.jpg"
  template: `
  <div class="container-c">
  <img src="https://m.media-amazon.com/images/I/71cR+sc93tL.jpg" alt="Norway" style="width:100%;">
  <div class="text-block" style="width:100%;height:100%; overflow:hidden;">
    <div class="heading">
      <div></div>
      <div></div>
      <div><h1>World Around 24/7</h1>
      <h1>CAB service</h1></div>
    </div>

  </div>
</div>
<div class="navbar-home">
<ul class="snip1217">
  <li class="current"><a routerLink="/" routerLinkActive="active" class="tc" >Home</a></li>

  <li><a routerLink="/search" routerLinkActive="active" class="tc" >Search And Book</a></li>

  <li><a  routerLink="/history" routerLinkActive="active">History</a></li>
  <li><a routerLink="/cancellation" routerLinkActive="active">Cancel</a></li>
  <li><a routerLink="/updates" routerLinkActive="active">Update</a></li>
</ul>
</div>
<div class="container">
  <p class="container-title">Here are the features<br>we’re proud of</p>

  <div class="gradient-cards">
    <div class="card">
      <div class="container-card bg-green-box">
      <p class="card-title">Advanced Booking</p>
        <p class="card-description">Riders can wish to opt for a scheduled ride for planned trip instead of booking on the spot.</p>
      </div>
    </div>
   
    <div class="card">
      <div class="container-card bg-white-box">
        <p class="card-title">Verified Drivers</p>
        <p class="card-description">Provides verified and professional drivers who are trained and examined before being sent to customers.</p>
      </div>
    </div>

    <div class="card">
      <div class="container-card bg-yellow-box">
        <p class="card-title">Ride History </p>
        <p class="card-description">A feature that allows riders to view details of all their completed and canceled rides.</p>
      </div>
    </div>

    <div class="card">
      <div class="container-card bg-blue-box">
        <p class="card-title">Easy cancellation</p>
        <p class="card-description">Refunds the full advance deposit if the booking is canceled more than 24 hours before the pickup time.</p>
      </div>
    </div>
  </div>

  <div class="box-rev">
  <p class="container-title">Here are the review<br>of costomers</p>
</div>
<!--
------------
review part 
------------
-->
<div class="outerdiv">
    <div class="innerdiv">
      <!-- div1 -->
      <div class="div1 eachdiv">
        <div class="userdetails">
          <div class="imgbox">
            <img src="https://raw.githubusercontent.com/RahulSahOfficial/testimonials_grid_section/5532c958b7d3c9b910a216b198fdd21c73112d84/images/image-daniel.jpg" alt="">
          </div>
          <div class="detbox">
            <p class="name">Daniel Clifford</p>
            <p class="designation">Verified Graduate</p>
          </div>
        </div>
        <div class="review">
          <h4>It was an Excellent Service, The driver was an Unforgettable Driver well trained and professional</h4>
        <p>“ The driver went above and beyond to ensure a positive and enjoyable experience, exceeding typical expectations of a cab ride.
        The driver was incredibly friendly and engaging, offering helpful local tips and recommendations to enhance my trip.
            ”</p>
        </div>
      </div>
      <!-- div2 -->
      <div class="div2 eachdiv">
        <div class="userdetails">
          <div class="imgbox">
            <img src="https://raw.githubusercontent.com/RahulSahOfficial/testimonials_grid_section/5532c958b7d3c9b910a216b198fdd21c73112d84/images/image-jonathan.jpg" alt="">
          </div>
          <div class="detbox">
            <p class="name">Jonathan Walters</p>
            <p class="designation">Verified Graduate</p>
          </div>
        </div>
        <div class="review">
          <h4>Very Affordable, Convenient, Comfortable</h4>
        <p>“ The cost of the ride was reasonable and competitive compared to other transportation options,s
  making it an affordable choice. ”</p>
        </div>
      </div>
      <!-- div3 -->
      <div class="div3 eachdiv">
        <div class="userdetails">
          <div class="imgbox">
            <img src="https://raw.githubusercontent.com/RahulSahOfficial/testimonials_grid_section/5532c958b7d3c9b910a216b198fdd21c73112d84/images/image-kira.jpg" alt="">
          </div>
          <div class="detbox">
            <p class="name">Kira Whittle</p>
            <p class="designation">Verified Graduate</p>
          </div>
        </div>
        <div class="review">
          <h4>Smooth and Efficient Ride and experience, Highly recommended!</h4>
          <p>“ This ride was a breeze! The driver arrived on time, the car was clean and comfortable, and the ride itself was smooth and efficient.
            The driver was courteous and professional, and I felt safe throughout the journey.The driver arrived precisely at the scheduled pick-up time, 
            demonstrating respect for my schedule.The car was impeccably clean, both inside and out, creating a pleasant and hygienic environment for the journey. Highly recommend! ”</p>
        </div>
      </div>
      <!-- div4 -->
      <div class="div4 eachdiv">
        <div class="userdetails">
          <div class="imgbox">
            <img src="https://raw.githubusercontent.com/RahulSahOfficial/testimonials_grid_section/5532c958b7d3c9b910a216b198fdd21c73112d84/images/image-jeanette.jpg" alt="">
          </div>
          <div class="detbox">
            <p class="name">Jeanette Harmon</p>
            <p class="designation">Verified Graduate</p>
          </div>
        </div>
        <div class="review">
          <h4>An Overall Wonderful and Memorable Experience</h4>
        <p>“ The driver prioritized safety and ensured I arrived at my destination safely and on time, despite any potential challenges. ”</p>
        </div>
      </div>
      <!-- div5 -->
      <div class="div5 eachdiv">
        <div class="userdetails">
          <div class="imgbox">
            <img src="https://raw.githubusercontent.com/RahulSahOfficial/testimonials_grid_section/5532c958b7d3c9b910a216b198fdd21c73112d84/images/image-patrick.jpg" alt="">
          </div>
          <div class="detbox">
            <p class="name">Patrick Abrams</p>
            <p class="designation">Verified Graduate</p>
          </div>
        </div>
        <div class="review">
          <h4>Awesome ride which exceeded my expectations and made my journey wonderfull.</h4>
        <p>“ I was very impressed with the service. The driver was friendly and helpful, and the ride was even
           faster than I expected. Highly recommend! The driver arrived on time and was very professional. The car was clean and the ride was smooth and comfortable.
            I felt safe and secure throughout the journey. ”</p>
        </div>
      </div>
    </div>
</div>
  `,
  styleUrl: './homepage.component.css'
})
export class HomepageComponent {

}
//images : https://img.freepik.com/free-photo/taxi-sign-car-night_181624-14020.jpg?t=st=1735995278~exp=1735998878~hmac=359b7968548aeda70653051f4116bdee3a7f2b7404fc9348673c6a685d9d4505&w=900
//https://img.freepik.com/free-photo/blurred-street-scene-city_1359-237.jpg?t=st=1735995359~exp=1735998959~hmac=ddb99ad7b843ad27551a57371cb658618e16c779db0918e16a25ffa961704891&w=900
//https://img.freepik.com/free-photo/taxi-sign-night_181624-25843.jpg?t=st=1735995505~exp=1735999105~hmac=3e4e82e4fdb27146b7a3c10a2943fb53e8f90993c45378d6b67231d237e4b409&w=900
//https://img.freepik.com/free-photo/blurred-city-street_23-2147786060.jpg?t=st=1735995557~exp=1735999157~hmac=103aaafcddc2ee71c7050c50367bc17afa79eccc6f44ed1c8ce4e98534dbc063&w=900
//https://img.freepik.com/free-photo/car-traffic-night-streets_23-2148055611.jpg?t=st=1735995670~exp=1735999270~hmac=271239887752aa2dd04e4ca0473c469ad7b4f1215ab4a0292d66f976e3f8423a&w=900
//https://img.freepik.com/free-photo/car-mirror-showing-blurred-city-traffic-evening_157027-4038.jpg?t=st=1735995768~exp=1735999368~hmac=b5eaff817ce52746135af4256556e8194783485c23efa124bc58445579d417e1&w=1060
