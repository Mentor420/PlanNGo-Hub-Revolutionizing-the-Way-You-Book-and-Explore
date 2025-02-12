export interface Feature { 
         type: string; // e.g., 'Feature'
         properties: {
           segments: {
             steps: {
               instruction: string;
               distance: number;
               duration: number;
               type: number;
               way_points: [number, number];
             }[];
           }[];
           summary: {
             distance: number;
             duration: number;
           };
           distance: number;
           duration: number;
           // ... other properties ... 
         };
         geometry: {
           type: string; // e.g., 'LineString'
           coordinates: [number, number][];
         };
         // ... other properties ...
}