import { CabCardDetails } from "./cabcard-details";
export interface Booking {
  id: string;
  cab: CabCardDetails;
  user: { 
    name: string; 
    email: string 
  };
  status: "pending" | "accepted" | "rejected" | "completed" | "InProgress"; // Add this
  timestamp: number;
}