import { Injectable } from '@angular/core';
import { RouteResponse } from '../components/update/routing';

@Injectable({
  providedIn: 'root'
})
export class RouteService {
  private apiUrl = '/ors/v2/directions/driving-car';

  async getRoute(start: [number, number], end: [number, number]): Promise<RouteResponse> {
    const requestBody = {
      coordinates: [start, end],
      profile: "driving-car",
      format: "json",
      instructions: true,
      geometry: true
    };
  
    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('RouteService error:', error);
      throw error;
    }
  }
}