import { Component } from '@angular/core';
import { UserinfoComponent } from '../userinfo/userinfo.component';
import {TourService} from "../../../tour/services/tour.service";
import {AuthService} from "../../services/services/auth.service";
import {ManageBookingComponent} from "../../../tour/components/manage-booking/manage-booking.component";
import {NgIf} from "@angular/common";
import {
    FlightBookingHistoryComponent
} from "../../../flight/components/pages/customer/booking-history/booking-history.component";
import {
    CancelBookingComponent
} from "../../../flight/components/pages/customer/cancel-booking/cancel-booking.component";
import {BookingHistoryComponent} from "../../../hotels/components/booking-history/booking-history.component";

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [
        UserinfoComponent,
        ManageBookingComponent,
        NgIf,
        FlightBookingHistoryComponent,
        CancelBookingComponent,
        BookingHistoryComponent
    ],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
    emaildata:any=[]
    ref:any='';
        email:any;
        name:string="";
        age:number=0;
        gender:string="";
        role:string="";
        id:string='';
        password:string="";
        image:string="";
        description:string="";
        changeTour(){
            this.ref="tour";
        }
        changeHotel(){
            this.ref="hotel";
        }
        changeCab() {
            this.ref = "cab";
        }
        changeFlight() {
            this.ref = "flight";
        }
        constructor( private authService: AuthService){}
        ngOnInit(): void {
            this.email = localStorage.getItem('email');
            this.authService.getUserDetails().subscribe(data => {
                this.emaildata = data.users;
                this.emaildata.forEach((user:any) => {
                    if (user.email === this.email) {
                        this.name = user.fullName;
                        this.age = user.age;
                        this.gender = user.gender;
                        this.role = user.role;
                        this.id = user.id;
                        this.password = user.password;
                        this.image=user.profileImage;
                        this.description=user.description;
                        console.log(this.image);
                    }

                });

            });
        }
}
