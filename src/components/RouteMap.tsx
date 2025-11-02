import { useEffect, useRef } from 'react';
import { Waypoint } from './WaypointList';

interface RouteMapProps {
  waypoints: Waypoint[];
  apiKey: string;
}

declare global {
  interface Window {
    initMap?: () => void;
  }
}

const RouteMap = ({ waypoints, apiKey }: RouteMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<google.maps.Map | null>(null);
  const directionsServiceRef = useRef<google.maps.DirectionsService | null>(null);
  const directionsRendererRef = useRef<google.maps.DirectionsRenderer | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const scriptLoadedRef = useRef(false);

  useEffect(() => {
    if (!apiKey || !mapRef.current || scriptLoadedRef.current) return;

    // Load Google Maps script
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initMap`;
    script.async = true;
    script.defer = true;

    window.initMap = () => {
      if (!mapRef.current) return;

      googleMapRef.current = new google.maps.Map(mapRef.current, {
        center: { lat: 40.7128, lng: -74.0060 },
        zoom: 12,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }],
          },
        ],
      });

      directionsServiceRef.current = new google.maps.DirectionsService();
      directionsRendererRef.current = new google.maps.DirectionsRenderer({
        map: googleMapRef.current,
        suppressMarkers: true,
        polylineOptions: {
          strokeColor: '#0ea5e9',
          strokeWeight: 4,
        },
      });
    };

    document.head.appendChild(script);
    scriptLoadedRef.current = true;

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [apiKey]);

  useEffect(() => {
    if (!googleMapRef.current || !directionsServiceRef.current || !directionsRendererRef.current) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    if (waypoints.length === 0) {
      directionsRendererRef.current.setMap(null);
      directionsRendererRef.current.setMap(googleMapRef.current);
      return;
    }

    if (waypoints.length === 1) {
      // Single waypoint - just show marker and center
      const marker = new google.maps.Marker({
        position: { lat: waypoints[0].lat, lng: waypoints[0].lng },
        map: googleMapRef.current,
        label: {
          text: '1',
          color: 'white',
          fontWeight: 'bold',
        },
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 12,
          fillColor: '#1e40af',
          fillOpacity: 1,
          strokeColor: 'white',
          strokeWeight: 2,
        },
      });
      markersRef.current.push(marker);
      googleMapRef.current.setCenter({ lat: waypoints[0].lat, lng: waypoints[0].lng });
      googleMapRef.current.setZoom(14);
      return;
    }

    // Multiple waypoints - calculate and display route
    const origin = { lat: waypoints[0].lat, lng: waypoints[0].lng };
    const destination = { lat: waypoints[waypoints.length - 1].lat, lng: waypoints[waypoints.length - 1].lng };
    const waypointsForRoute = waypoints.slice(1, -1).map(wp => ({
      location: { lat: wp.lat, lng: wp.lng },
      stopover: true,
    }));

    directionsServiceRef.current.route(
      {
        origin,
        destination,
        waypoints: waypointsForRoute,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK && result && directionsRendererRef.current) {
          directionsRendererRef.current.setDirections(result);

          // Add custom markers
          waypoints.forEach((waypoint, index) => {
            const marker = new google.maps.Marker({
              position: { lat: waypoint.lat, lng: waypoint.lng },
              map: googleMapRef.current,
              label: {
                text: (index + 1).toString(),
                color: 'white',
                fontWeight: 'bold',
              },
              icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 12,
                fillColor: index === 0 ? '#16a34a' : index === waypoints.length - 1 ? '#dc2626' : '#1e40af',
                fillOpacity: 1,
                strokeColor: 'white',
                strokeWeight: 2,
              },
            });
            markersRef.current.push(marker);
          });
        }
      }
    );
  }, [waypoints]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className="absolute inset-0 rounded-lg" />
      {!apiKey && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/50 backdrop-blur-sm rounded-lg">
          <div className="text-center p-6 bg-card rounded-lg shadow-lg max-w-md">
            <p className="text-foreground font-medium mb-2">Google Maps API Key Required</p>
            <p className="text-sm text-muted-foreground">
              Please enter your Google Maps API key in the input field above to enable the map.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default RouteMap;
