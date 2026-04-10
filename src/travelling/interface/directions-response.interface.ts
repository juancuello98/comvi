export interface DirectionsResponse {
    geocoded_waypoints: GeocodedWaypoint[];
    routes: Route[];
    status: string;
  }
  
  export interface GeocodedWaypoint {
    geocoder_status: string;
    place_id: string;
    types: string[];
  }
  
  export interface Route {
    bounds: Bounds;
    copyrights: string;
    legs: Leg[];
    overview_polyline: OverviewPolyline;
    summary: string;
    warnings: string[];
    waypoint_order: number[];
  }
  
  export interface Bounds {
    northeast: Location;
    southwest: Location;
  }
  
  export interface Location {
    lat: number;
    lng: number;
  }
  
  export interface Leg {
    distance: Distance;
    duration: Duration;
    end_address: string;
    end_location: Location;
    start_address: string;
    start_location: Location;
    steps: Step[];
    traffic_speed_entry: any[];
    via_waypoint: any[];
  }
  
  export interface Distance {
    text: string;
    value: number;
  }
  
  export interface Duration {
    text: string;
    value: number;
  }
  
  export interface Step {
    distance: Distance;
    duration: Duration;
    end_location: Location;
    html_instructions: string;
    polyline: OverviewPolyline;
    start_location: Location;
    travel_mode: string;
    maneuver?: string;
  }
  
  export interface OverviewPolyline {
    points: string;
  }