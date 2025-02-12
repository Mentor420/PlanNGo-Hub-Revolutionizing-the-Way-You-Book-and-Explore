import { Injectable } from '@angular/core';
import { CabCardDetails } from '../model/cabcard-details';
import { Booking } from '../model/booking';
import {v4 as uuidv4} from 'uuid';
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class CabService {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}
  private url = 'http://localhost:3000/7';
  private url2 = 'http://localhost:3000/7';
  response:any
  bookingData:any
  availCabs:any
  bookedCabs:any
  userDetails:any
  bookingDat:any
  bookedCab:any
  availCab:any
  userDetail:any
  datae:any
  bookingDataa:any
  finres:any
  finalBookingss:any=[]
  cabfinData:any=[]
  bookedCabsResponse:any
  tempo:any
  cabInfo:any=[]
  cabDetailss:any
  finalCabCard:any
  async getcabCardDetailsList(): Promise<CabCardDetails[]> {
    const data = await fetch(`${this.url2}`);
    return await data.json();
  }

  async getcabCardDetails(rideType: string): Promise<CabCardDetails | undefined> {
    const allCabs = await this.getcabCardDetailsList();
    return allCabs.find(cabCardDetails => cabCardDetails.rideType === rideType);
  }
  async getCabDetailsById(id: string): Promise<CabCardDetails | undefined> {
    this.response = await fetch(`${this.url}`);
    const reso = await this.response.json();
    const res = reso['CabCardDetailsList'];
    console.log('response:', res);
    res.forEach((cab: any) => {
      if (cab.id === id) {
        console.log('cabDetails:', cab);
        this.finres=cab;
      }
    });
    if (!this.response.ok) {
      console.error(`Error fetching cab details: ${this.response.statusText}`);
      return undefined;
    }
    return this.finres;
  }

  async bookCab(cabId: string, userDetails: { name: string; email: string }): Promise<void> {
    try {
      const cabDetails = await this.getCabDetailsById(cabId);
      const finalCabDetails = {
        ...cabDetails,
        Booked: true,
        available: false,
        Cancelled: false
      }
      if (!cabDetails) {
        throw new Error('Cab not found!');
      }
  
      const bookingId = uuidv4();
      const bookingData = {
        id: bookingId,
        cab: finalCabDetails,
        user: userDetails,
        status: 'pending',
        timestamp: Date.now() 
      };
      this.bookingData=await fetch(`${this.url2}`);
      this.bookingData=await this.bookingData.json();
      this.datae=await fetch(`${this.url2}`);
      this.datae=await this.datae.json();
      const Book:any="Bookings"
      this.bookingDat=this.bookingData[Book];
      console.log(this.bookingData,"a")
      this.bookingDat.push(bookingData);
      // Add to booked cabs
      this.bookedCabs=await fetch(`${this.url2}`);
      this.bookedCabs=await this.bookedCabs.json();
      this.bookedCab=this.bookedCabs['BookedCabList'];
      this.bookedCab.push(bookingData);
      // Remove from available cabs
      this.availCabs=await fetch(`${this.url2}`);
      this.availCabs=await this.availCabs.json();
      this.availCab=this.availCabs['CabCardDetailsList'];
      this.availCab.forEach((cab: any, index: number) => {
        if (cab.id === cabId) {
          this.availCab.splice(index, 1);
        }
      });
      // Save user details
      this.userDetails=await fetch(`${this.url2}`);
      this.userDetails=await this.userDetails.json();
      this.userDetail=this.userDetails['UserDetails'];
      this.userDetail.push(userDetails);
      console.log(this.userDetail)
      console.log(userDetails)

      
      
      const finalDat={...this.datae,Bookings:this.bookingDat,CabCardDetailsList:this.availCab,UserDetails:this.userDetail,BookedCabList:this.bookedCab};
      console.log(finalDat)

      // Save booking data
      await fetch(`${this.url2}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(finalDat)
      });
      
  
      // Store email in session storage
      sessionStorage.setItem('userEmail', userDetails.email);
      
      // Store booking IDs in local storage as an array
      const existingBookings: string[] = JSON.parse(localStorage.getItem('userBookings') || '[]');
      existingBookings.push(bookingId);

      localStorage.setItem('userBookings', JSON.stringify(existingBookings));
      
    } catch (error) {
      console.error('Error booking cab:', error);
      throw error;
    }
  }   
  
  async getBookedCabs(): Promise<CabCardDetails[]> {
    try {
      if (!isPlatformBrowser(this.platformId)) {
        console.log('Not in a browser environment');
        return [];
      }
  
      const userEmail = localStorage.getItem('email');
      const userBookings: string[] = JSON.parse(localStorage.getItem('userBookings') || '[]');
  
      if (!userEmail || !userBookings.length) {
        console.log('No user email or bookings found in storage');
        return [];
      }
  
      const response = await fetch(`${this.url2}`);
      const newRes=await response.json();
      console.log(newRes)
      const finalRes=newRes['BookedCabList'];
      if (!response.ok) {
        throw new Error('Failed to fetch booked cabs');
      }
  
  
      // Filter booked cabs based on user email and booking IDs
      const userCabs = finalRes.filter((booking:any) => 
        booking.user.email === userEmail && 
        userBookings.includes(booking.id)
      );
  
      return userCabs.map((booking:any) => ({
        ...booking.cab,
        Booked: true,
        available: false
      }));
  
    } catch (error) {
      console.error('Error fetching booked cabs:', error);
      throw error;
    }
  }

  async cancelBooking(cabId: string): Promise<void> {
    try {
      const userEmail = localStorage.getItem('email');
      console.log(userEmail)
      const userBookings: string[] = JSON.parse(localStorage.getItem('userBookings') || '[]');
  
      if (!userEmail ) {
        console.log('No booking credentials found');
        throw new Error('No booking credentials found');
      }
  
      // Define the type for booked cab entries
      interface BookedCab {
        id: string;
        cab: CabCardDetails;
        user: {
          name: string;
          email: string;
        };
        status:"completed";
        timestamp: number;
      }
  
      // Find the booking in BookedCabList that matches the cab ID
      const bookedCabsResponse = await fetch(`${this.url2}`);
      const bookedCabs: BookedCab[] = await bookedCabsResponse.json();
      const cabbooks:any='BookedCabList';
      const finalbookedCabs:any=bookedCabs[cabbooks];
      const booking = finalbookedCabs.find((b: BookedCab) => 
        b.cab.id === cabId && 
        b.user.email === userEmail && 
        userBookings.includes(b.id)
      );
  
      if (!booking) {
        throw new Error('Booking not found');
      }
  
      // Remove from BookedCabList
      this.availCabs=await fetch(`${this.url2}`);
      this.availCabs=await this.availCabs.json();
      this.availCab=this.availCabs['BookedCabList'];
      this.availCab.forEach((cab: any, index: number) => {
        if (cab.id === cabId) {
          this.availCab.splice(index, 1);
        }
      });

  
      // Update status in Bookings
      const bookingResponse = await fetch(`${this.url2}`);
      
      if (bookingResponse.ok) {
        const bookingRecord = await bookingResponse.json();
        this.bookingDataa=await fetch(`${this.url2}`);
        this.bookingDataa=await this.bookingDataa.json();
        const bookingRes:any=bookingRecord['Bookings'];
        this.finalBookingss=bookingRes.map((book:any)=>{
          if(book.id===booking.id){
            book.cab.Booked = false;
            book.cab.Cancelled=true;
            book.cab.available = true;
          }
          return book;
        })

        const cabDetails:any = bookingRecord['Bookings'];
        cabDetails.forEach((cabs: any, index: number) => {
          this.cabInfo.push(cabs.cab);
        });
        this.cabInfo.forEach((cabs: any, index: number) => {
          if (cabs.id === cabId) {
            cabs = {
                ...cabs,
                Booked: false,
                available: true,
                Cancelled: true
            };
            this.tempo=cabs;
          }
        })
        console.log(this.tempo)
        this.cabDetailss = bookingRecord['CabCardDetailsList'];
        this.finalCabCard=[...this.cabDetailss,this.tempo]
        console.log("CabCardDetailsList",this.finalCabCard)

        console.log(this.finalBookingss,'fional')
        const allUpdatedBookings = {...this.bookingDataa,Bookings:this.finalBookingss,BookedCabList:this.availCab,CabCardDetailsList:this.finalCabCard};
        console.log(allUpdatedBookings,"all")
        await fetch(`${this.url2}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(allUpdatedBookings)
        });
      }
  
      // Add cab back to available list
      /*const cabDetails = booking.cab;
      cabDetails.Booked = false;
      cabDetails.available = true;
      cabDetails.Cancelled = true;
      
      await fetch(`${this.url2}/CabCardDetailsList`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(cabDetails)
      });
      */
      // Update booking IDs in localStorage
      const updatedBookings = userBookings.filter((bookingId: string) => bookingId !== booking.id);
      localStorage.setItem('userBookings', JSON.stringify(updatedBookings));
  
    } catch (error) {
      console.error('Error cancelling booking:', error);
      throw error;
    }
}
  // finding the cabs for history according to useremail
  async getBookingsByUserEmail(email: string): Promise<Booking[]> { 
    const response = await fetch(`${this.url2}`);
    const bookings: Booking[] = await response.json();
    const book:any='Bookings'
    const newRes:any=bookings[book];
    console.log(newRes)
    return newRes.filter((booking:any) => booking.user.email === email);
  }

  async getPickupLocations(): Promise<string[]> {
    const response = await fetch(`${this.url2}`);
    const data = await response.json();
    const locations = data['pickupLocations']
    return locations.map((location: any) => Object.values(location)[0]);
  }

  async getDropoffLocations(): Promise<string[]> {
    const response = await fetch(`${this.url2}`);
    const data = await response.json();
     const locations = data['dropoffLocations']
    return locations.map((location: any) => Object.values(location)[0]);
  }
  
  async deleteCab(cabId: string): Promise<void> {
    try {
      const response = await fetch(`${this.url2}`);
      const data = await response.json();
      let cabList = data['CabCardDetailsList'];
      const updatedCabs = cabList.filter((cab: any) => cab.id !== cabId);

       const finalDat={...data,CabCardDetailsList:updatedCabs};
      await fetch(`${this.url2}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(finalDat)
      });
      
    } catch (error) {
      console.error('Error deleting cab', error);
      throw error;
    }
  }

  async updateCab(cabId: string, cabData: CabCardDetails): Promise<void> {
    try {
       const response = await fetch(`${this.url2}`);
        const data = await response.json();
      let cabList = data['CabCardDetailsList'];
       const updatedCabs = cabList.map((cab: any) => {
        if (cab.id === cabId) {
          return cabData;
        }
        return cab;
      });
      const finalDat={...data,CabCardDetailsList:updatedCabs};
        await fetch(`${this.url2}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(finalDat)
      });
    } catch (error) {
      console.error('Error updating cab', error);
      throw error;
    }
  }
  async getBookingsByRiderId(riderId: string): Promise<Booking[]> {
    const response = await fetch(`${this.url2}`);
    const data = await response.json();
    const bookings = data['Bookings'];
    return bookings.filter((booking:any) => booking.cab.Rider === riderId);
  }

  async updateRideStatus(bookingId: string, status: Booking['status']): Promise<void> {
    try {
        const response = await fetch(`${this.url2}`);
        const data = await response.json();
        let bookings = data['Bookings'];
        const updatedBookings = bookings.map((booking:any) => {
            if (booking.id === bookingId) {
                booking.status = status;
            }
            return booking;
        });
        const finalDat={...data,Bookings:updatedBookings};
        await fetch(`${this.url2}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(finalDat)
        });
    } catch (error) {
      console.error('Error updating ride status', error);
        throw error
    }
  }

  async finalizeRide(bookingId: string, status: 'completed' | 'rejected'): Promise<void> {
    try {
        const response = await fetch(`${this.url2}`);
        const data = await response.json();
        let bookings = data['Bookings'];
        let bookedCabs = data['BookedCabList'];
        let cabList = data['CabCardDetailsList'];
        
        const booking = bookings.find((b:any) => b.id === bookingId);
         if (!booking) {
            throw new Error('Booking not found');
        }
        const updatedBookings = bookings.map((book:any)=>{
            if(book.id===bookingId){
              book.cab.Booked = false;
              book.cab.Cancelled = status === 'rejected';
                book.cab.Completed = status === 'completed';
              book.cab.available = true;
              book.status=status
            }
          return book;
        })
        const updatedBookedCabs = bookedCabs.filter((b:any) => b.id !== bookingId);


      const cabDetails = booking.cab;
       cabDetails.Booked = false;
        cabDetails.available = true;
        cabDetails.Cancelled = status === 'rejected';
        cabDetails.Completed = status === 'completed';

      const finalCabCard = [...cabList, cabDetails];

        const finalDat = {...data, Bookings: updatedBookings, BookedCabList: updatedBookedCabs, CabCardDetailsList: finalCabCard};
        
      
        await fetch(`${this.url2}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(finalDat)
        });
    } catch (error) {
        console.error('Error finalizing ride:', error);
        throw error;
    }
}
}
