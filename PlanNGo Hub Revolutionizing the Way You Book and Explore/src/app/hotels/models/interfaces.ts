export interface Amenity {
    id: string;
    name: string;
    description?: string;
    icon: string;
    available: boolean;
  }
  
  export interface Room {
    roomId: string;
    type: string;
    description: string;
    pricePerNight: number;
    currentCoupon: string;
    currentDiscount: number;
    benefits: string[];
    availableRooms: number;
    images: string[];
  }
  
  export interface Review {
    id: string;
    author: string;
    rating: number;
    comment: string;
    date: string;
  }
  
  export interface Booking {
    id: string;
    userId: string;
    hotelId: string;
    roomId: string;
    fullName: string;
    email: string;
    mobile: string;
    idProof: string;
    couponCode: string;
    checkInDate: string;
    checkOutDate: string;
    bookingDate: string;
    roomBooked: number;
    price: number;
    status: string;
    reviewSubmitted: boolean;
    hotelName?: string;
  }
  
  export interface Ratings {
    averageRating: number;
    ratingsCount: number;
    ratingBreakdown: { [key: number]: number };
  }
  
  export interface BankOffer {
    discount: number;
    details: string;
  }
  
  export interface Hotel {
    id: string;
    city: string;
    name: string;
    description: string;
    pricePerNight: number;
    roomsAvailable: number;
    rooms: Room[];
    amenities: Amenity[];
    checkin: string;
    checkout: string;
    rules: string[];
    location: string;
    images: string[];
    bookings: Booking[];
    ratings: Ratings;
    reviews: Review[];
    bankOffer: BankOffer[];
  }
  