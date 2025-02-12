import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FlightBookingService {
  private apiURL = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getFlights(): Observable<any> {
    return this.http.get(`${this.apiURL}/6`);
  }

  getBookings(): Observable<any> {
    return this.http.get(`${this.apiURL}/6`);
  }
//${this.apiURL}/flights/${id}
  getSpecificFlights(): Observable<any> {
    return this.http.get(`${this.apiURL}/6`)
  }

  //${this.apiURL}/bookings/${id}
    changeFlightStatus(data: any): Observable<any> {
        return this.http.put(`${this.apiURL}/6`, data) // Extra '}' here
    }


    postBookingDetails(booking: any): Observable<any> {
    return this.http.put(`${this.apiURL}/6`, booking)

  }

  getSpecificDeparture(): Observable<any>{
    return this.http.get(`http://localhost:3000/6`)
  }
//`${this.apiURL}/bookings?flightID=${id}`
  getSpecificBooking():Observable<any>{
    return this.http.get(`${this.apiURL}/6`)
  }

  getCombinedData(): Observable<any[]> {
    return this.http.get<{ flights: any[]; bookings: any[] }>(`${this.apiURL}/6`).pipe(
        map((response) => {
          const { flights, bookings } = response;
          console.log(bookings);
          console.log(flights);

          const combinedDataArray = [];
          const seenFlightIDs = new Set();
          const userEmail = localStorage.getItem('email'); // Retrieve the email from localStorage

          for (let i = 0; i < bookings.length; i++) {
            const booking = bookings[i];

            // Check if the booking's userEmail matches the email from localStorage
            if (booking.userEmail === userEmail) {
              for (let j = 0; j < flights.length; j++) {
                const flight = flights[j];

                if (booking.flightID === flight.id) {
                  // Check if the flightID has already been processed
                  if (!seenFlightIDs.has(booking.flightID)) {
                    // If not, add it to the set and process the record
                    seenFlightIDs.add(booking.flightID);
                    const combinedData = { ...flight, ...booking };
                    combinedDataArray.push(combinedData);

                  }
                }
              }
            }
          }
          console.log(combinedDataArray, "test1");
          return combinedDataArray;
        })
    );
  }



}
