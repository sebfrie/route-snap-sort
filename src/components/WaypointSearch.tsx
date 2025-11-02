import { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Plus } from 'lucide-react';

interface WaypointSearchProps {
  onAddWaypoint: (place: google.maps.places.PlaceResult) => void;
  apiKey: string;
}

declare global {
  interface Window {
    initAutocomplete?: () => void;
  }
}

const WaypointSearch = ({ onAddWaypoint, apiKey }: WaypointSearchProps) => {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const scriptLoadedRef = useRef(false);

  useEffect(() => {
    if (!apiKey || !inputRef.current || scriptLoadedRef.current) return;

    // Load Google Maps script
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initAutocomplete`;
    script.async = true;
    script.defer = true;

    window.initAutocomplete = () => {
      if (!inputRef.current) return;

      autocompleteRef.current = new google.maps.places.Autocomplete(inputRef.current, {
        fields: ['place_id', 'geometry', 'name', 'formatted_address'],
      });

      autocompleteRef.current.addListener('place_changed', () => {
        const place = autocompleteRef.current?.getPlace();
        if (place && place.geometry) {
          onAddWaypoint(place);
          setInputValue('');
        }
      });
    };

    document.head.appendChild(script);
    scriptLoadedRef.current = true;

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [apiKey, onAddWaypoint]);

  return (
    <div className="relative flex gap-2 w-full">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search for a location..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="pl-10 bg-card border-border focus:ring-2 focus:ring-primary/20"
        />
      </div>
      <Button 
        size="icon"
        className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default WaypointSearch;
