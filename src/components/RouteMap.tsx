"use client";

import { useEffect, useRef, useState } from 'react';
import { Waypoint } from './WaypointList';
import { AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface RouteMapProps {
  waypoints: Waypoint[];
  apiKey: string;
  showNameLabels?: boolean;
  markerColor?: string;
  routeColor?: string;
}

const RouteMap = ({
  waypoints, 
  apiKey, 
  showNameLabels = false,
  markerColor = '#1e40af',
  routeColor = '#0ea5e9'
}: RouteMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<any>(null);
  const directionsServiceRef = useRef<any>(null);
  const directionsRendererRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const scriptLoadedRef = useRef(false);
  const [mapError, setMapError] = useState('');

  useEffect(() => {
    if (!apiKey || !mapRef.current) return;

    // Reset state when API key changes
    setMapError('');
    scriptLoadedRef.current = false;

    // Remove existing script if any
    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
    if (existingScript) {
      existingScript.remove();
    }

    // Load Google Maps script
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initMap`;
    script.async = true;
    script.defer = true;

    script.onerror = () => {
      setMapError('Failed to load Google Maps. Please verify your API key has Maps JavaScript API enabled.');
      scriptLoadedRef.current = false;
      toast.error('Map failed to load');
    };

    window.initMap = () => {
      if (!mapRef.current) return;

      try {
        googleMapRef.current = new window.google.maps.Map(mapRef.current, {
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

        directionsServiceRef.current = new window.google.maps.DirectionsService();
        directionsRendererRef.current = new window.google.maps.DirectionsRenderer({
          map: googleMapRef.current,
          suppressMarkers: true,
          polylineOptions: {
            strokeColor: routeColor,
            strokeWeight: 4,
          },
        });
        
        setMapError('');
        scriptLoadedRef.current = true;
      } catch (error) {
        setMapError('Failed to initialize map. Please check your API key and permissions.');
        scriptLoadedRef.current = false;
        toast.error('Map initialization failed');
      }
    };

    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [apiKey, routeColor]);

  useEffect(() => {
    if (!googleMapRef.current || !directionsServiceRef.current || !directionsRendererRef.current) return;

    // Update route color
    if (directionsRendererRef.current) {
      directionsRendererRef.current.setOptions({
        polylineOptions: {
          strokeColor: routeColor,
          strokeWeight: 4,
        },
      });
    }

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
      const marker = new window.google.maps.Marker({
        position: { lat: waypoints[0].lat, lng: waypoints[0].lng },
        map: googleMapRef.current,
        label: showNameLabels ? {
          text: waypoints[0].name,
          color: 'white',
          fontWeight: 'bold',
          fontSize: '12px',
          className: 'marker-label',
        } : {
          text: '1',
          color: 'white',
          fontWeight: 'bold',
        },
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: showNameLabels ? 8 : 12,
          fillColor: markerColor,
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
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result: any, status: any) => {
        if (status === window.google.maps.DirectionsStatus.OK && result && directionsRendererRef.current) {
          directionsRendererRef.current.setDirections(result);

          // Add custom markers
          waypoints.forEach((waypoint, index) => {
            const marker = new window.google.maps.Marker({
              position: { lat: waypoint.lat, lng: waypoint.lng },
              map: googleMapRef.current,
              label: showNameLabels ? {
                text: waypoint.name,
                color: 'white',
                fontWeight: 'bold',
                fontSize: '12px',
                className: 'marker-label',
              } : {
                text: (index + 1).toString(),
                color: 'white',
                fontWeight: 'bold',
              },
              icon: {
                path: window.google.maps.SymbolPath.CIRCLE,
                scale: showNameLabels ? 8 : 12,
                fillColor: showNameLabels ? markerColor : (index === 0 ? '#16a34a' : index === waypoints.length - 1 ? '#dc2626' : markerColor),
                fillOpacity: 1,
                strokeColor: 'white',
                strokeWeight: 2,
              },
            });
            markersRef.current.push(marker);
          });
        } else {
          setMapError(`Failed to calculate route: ${status}. Try reordering waypoints or selecting different locations.`);
          toast.error('Route calculation failed');
        }
      }
    );
  }, [waypoints, showNameLabels, markerColor, routeColor]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className="absolute inset-0 rounded-lg" />
      {!apiKey && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/50 backdrop-blur-sm rounded-lg">
          <div className="text-center p-6 bg-card rounded-lg shadow-lg max-w-md">
            <AlertCircle className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
            <p className="text-foreground font-medium mb-2">Google Maps API Key Required</p>
            <p className="text-sm text-muted-foreground">
              Please enter your Google Maps API key in the input field above to enable the map.
            </p>
          </div>
        </div>
      )}
      {mapError && (
        <div className="absolute top-4 left-4 right-4 bg-destructive/90 backdrop-blur-sm text-destructive-foreground p-3 rounded-lg shadow-lg flex items-start gap-2 z-10">
          <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-sm">Map Error</p>
            <p className="text-xs mt-1">{mapError}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default RouteMap;
