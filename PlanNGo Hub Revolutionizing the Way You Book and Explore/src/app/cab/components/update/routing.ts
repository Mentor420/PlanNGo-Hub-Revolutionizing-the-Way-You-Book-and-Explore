export interface RouteRequest {
  coordinates: [number, number][];
  profile?: string;
  format?: string;
  geometry?: boolean;
  instructions?: boolean;
}

export interface RouteResponse {
  routes: Array<{
    summary: {
      distance: number;
      duration: number;
    };
    segments: Array<{
      distance: number;
      duration: number;
      steps: Array<{
        distance: number;
        duration: number;
        type: number;
        instruction: string;
        name: string;
        way_points: [number, number];
      }>;
    }>;
    bbox: [number, number, number, number];
    geometry: string;
    way_points: [number, number];
  }>;
  bbox: [number, number, number, number];
  metadata: {
    attribution: string;
    service: string;
    timestamp: number;
    query: {
      coordinates: [number, number][];
      profile: string;
      format: string;
      geometry: boolean;
      instructions: boolean;
    };
    engine: {
      version: string;
      build_date: string;
      graph_date: string;
    };
  };
}