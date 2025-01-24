import { CommonModule, Location } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import Chart, { TooltipItem } from "chart.js/auto";
import { ServiceProviderService } from "../../../services/service-provider.service";
import { Booking, Hotel } from "../../../models/interfaces";

@Component({
  selector: "app-service-hotel",
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: "./s-hotel.component.html",
  styleUrls: ["./s-hotel.component.css"],
})
export class ServiceHotelComponent implements OnInit {
  hotelData: any;
  hotelid: string = "";
  bookingChart: Chart | null = null;
  revenueChart: Chart | null = null;

  constructor(
    private route: ActivatedRoute,
    private serviceProvider: ServiceProviderService,
    private location: Location
  ) {}

  ngOnInit() {
    const providerId = this.route.snapshot.queryParamMap.get("providerId") || "";
    this.hotelid = this.route.snapshot.queryParamMap.get("hotelId") || "";
    this.fetchHotelData(providerId, this.hotelid);
  }

  goBack(): void {
    this.location.back();
  }

  fetchHotelData(providerId: string, hotelId: string) {
    this.serviceProvider.getHotelDetailsByProviderId(providerId, hotelId).subscribe({
      next: (data) => {
        this.hotelData = data;

        // Map roomType into each booking using roomId
      if (this.hotelData.bookings && this.hotelData.rooms) {
        this.hotelData.bookings = this.hotelData.bookings.map((booking: any) => {
          const room = this.hotelData.rooms.find((r: any) => r.roomId === booking.roomId);
          return {
            ...booking,
            roomType: room ? room.type : 'Unknown', // Add roomType or fallback to 'Unknown'
          };
        });
        // Sort bookings by bookingDate (latest first)
        this.hotelData.bookings.sort((a: any, b: any) => {
          const dateA = new Date(a.bookingDate).getTime();
          const dateB = new Date(b.bookingDate).getTime();
          return dateB - dateA; // Descending order
        });
      }

        this.initCharts();
      },
      error: (error) => {
        console.error("Error fetching hotel data:", error);
      },
    });
  }

  getBookedCount(roomId: string): number {
    if (!this.hotelData || !this.hotelData.bookings) {
      return 0;
    }
  
    // Count bookings for the given roomId
    return this.hotelData.bookings.filter((booking: Booking) => booking.roomId === roomId).length;
  }  

  getHotelRevenue(hotel: Hotel): number {
      if (!hotel.bookings || hotel.bookings.length === 0) {
        return 0; // No bookings, revenue is 0
      }
  
       return hotel.bookings
      .filter((booking) => booking.id) // Filter bookings that have a valid `id`
      .reduce((sum, booking) => sum + (typeof booking.price === 'number' ? booking.price : 0), 0); // Sum up valid prices
    }  

    getTotalAvailableRooms(hotel: any): number {
      if (!hotel || !hotel.rooms) {
        return 0; // Return 0 if hotel or rooms are undefined
      }
      // Calculate total available rooms by summing up `availableRooms` for all room types
      return hotel.rooms.reduce((total: number, room: any) => total + room.availableRooms, 0);
    }
    
    getAvailableRooms(hotel: any): number {
      if (!hotel || !hotel.rooms || !hotel.bookings) {
        return 0; // Safeguard to return 0 if any data is missing
      }
      // Deduct the number of booked rooms from the total available rooms for each type
      let totalAvailable = 0;
    
      hotel.rooms.forEach((room: any) => {
        // Get the total number of bookings for this room type
        const bookedCount = hotel.bookings.filter((booking: any) => booking.roomId === room.roomId).length;
    
        // Deduct bookedCount from availableRooms for this room type
        const adjustedAvailable = room.availableRooms - bookedCount;
    
        // Ensure no negative values for available rooms
        totalAvailable += Math.max(adjustedAvailable, 0);
      });
    
      return totalAvailable;
    }
    

  initCharts() {
    this.initBookingChart();
    this.initRevenueChart(this.hotelid);
  }

  initBookingChart() {
    if (typeof document !== 'undefined') {
      const canvas = document.getElementById("bookingChart") as HTMLCanvasElement;
  
      if (this.bookingChart) {
        this.bookingChart.destroy();
      }
  
      // Group bookings by month
      const bookingsByMonth = this.groupBookingsByMonth(this.hotelData.bookings);
  
      this.bookingChart = new Chart(canvas, {
        type: "bar",
        data: {
          labels: Object.keys(bookingsByMonth), // Months as labels
          datasets: [
            {
              label: "Bookings",
              data: Object.values(bookingsByMonth), // Booking counts
              backgroundColor: "rgba(75, 192, 192, 0.6)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: { position: "top" },
          },
          scales: {
            x: { title: { display: true, text: "Months" } },
            y: { beginAtZero: true, title: { display: true, text: "Number of Bookings" } },
          },
        },
      });
    }
  }
  
  initRevenueChart(hotelId: string) {
    if (typeof document !== 'undefined') {
      const canvas = document.getElementById("revenueChartt") as HTMLCanvasElement;
  
      if (this.revenueChart) {
        this.revenueChart.destroy();
      }
  
      const hotelBookings = this.hotelData.bookings.filter((booking: Booking) => booking.hotelId === hotelId);
      console.log("Filtered bookings:", hotelBookings);
  
      const revenueByMonth = this.groupRevenueByMonth(hotelBookings);
      console.log("Revenue chart labels:", Object.keys(revenueByMonth));
      console.log("Revenue chart data:", Object.values(revenueByMonth));
  
      if (Object.keys(revenueByMonth).length === 0) {
        console.warn("No revenue data available for this chart.");
        return;
      }
  
      this.revenueChart = new Chart(canvas, {
        type: "line",
        data: {
          labels: Object.keys(revenueByMonth),
          datasets: [
            {
              label: "Revenue",
              data: Object.values(revenueByMonth),
              borderColor: "rgba(153, 102, 255, 1)",
              backgroundColor: "rgba(153, 102, 255, 0.2)",
              borderWidth: 2,
              pointRadius: 5,
              pointBackgroundColor: "rgba(153, 102, 255, 1)",
              fill: true,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: { position: "top" },
            tooltip: {
              callbacks: {
                label: function (tooltipItem: TooltipItem<"line">) {
                  const revenue = typeof tooltipItem.raw === "number" ? tooltipItem.raw : 0;
                  return `Revenue: ${revenue.toLocaleString("en-US", { style: "currency", currency: "USD" })}`;
                },
              },
            },
          },
          scales: {
            x: { title: { display: true, text: "Months" } },
            y: { beginAtZero: true, title: { display: true, text: "Revenue (in USD)" } },
          },
        },
      });
    }
  }
  
  
  
  /**
 * Groups bookings by month and sorts months in ascending order.
 */
groupBookingsByMonth(bookings: Booking[]): { [key: string]: number } {
  const result: { [key: string]: number } = {};
  
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
  bookings.forEach((booking) => {
    const monthName = new Date(booking.bookingDate).toLocaleString("default", { month: "short" });
    const monthIndex = monthNames.indexOf(monthName); // Get the index of the month in the array
    result[monthIndex] = (result[monthIndex] || 0) + 1; // Increment the count for the month
  });
  
  // Sort the months in ascending order
  const sortedResult: { [key: string]: number } = {};
  monthNames.forEach((monthName, index) => {
    if (result[index] !== undefined) {
      sortedResult[monthName] = result[index];
    }
  });
  
  return sortedResult;
}

/**
 * Groups revenue by month and sorts months in ascending order.
 */
groupRevenueByMonth(bookings: Booking[]): { [key: string]: number } {
  const result: { [key: string]: number } = {};
  
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
  bookings.forEach((booking) => {
    const monthName = new Date(booking.bookingDate).toLocaleString("default", { month: "short" });
    const monthIndex = monthNames.indexOf(monthName); // Get the index of the month in the array
    result[monthIndex] = (result[monthIndex] || 0) + booking.price; // Sum the revenue for the month
  });
  
  // Sort the months in ascending order
  const sortedResult: { [key: string]: number } = {};
  monthNames.forEach((monthName, index) => {
    if (result[index] !== undefined) {
      sortedResult[monthName] = result[index];
    }
  });
  
  return sortedResult;
}

  
}
