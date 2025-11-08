"use client";

import { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Plus, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface WaypointSearchProps {
  onAddWaypoint: (place: any) => void;
  apiKey: string;
}

const WaypointSearch = ({ onAddWaypoint, apiKey }: WaypointSearchProps) => {
  const [inputValue, setInputValue] = useState('');
  const [searchError, setSearchError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<any>(null);
  const scriptLoadedRef = useRef(false);

  useEffect(() => {
    if (!apiKey || !inputRef.current) return;

    // Reset state when API key changes
    setIsLoading(true);
    setSearchError('');
    scriptLoadedRef.current = false;

    // Remove existing script if any
    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
    if (existingScript) {
      existingScript.remove();
    }

    // Load Google Maps script
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initAutocomplete`;
    script.async = true;
    script.defer = true;

    script.onerror = () => {
      setSearchError('Failed to load Google Maps. Please check your API key and internet connection.');
      setIsLoading(false);
      scriptLoadedRef.current = false;
      toast.error('Failed to initialize search');
    };

    window.initAutocomplete = () => {
      if (!inputRef.current) {
        setIsLoading(false);
        return;
      }

      try {
        autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
          fields: ['place_id', 'geometry', 'name', 'formatted_address'],
        });

        autocompleteRef.current.addListener('place_changed', () => {
          const place = autocompleteRef.current?.getPlace();
          if (place && place.geometry) {
            onAddWaypoint(place);
            setInputValue('');
            setSearchError('');
          } else if (place && !place.geometry) {
            setSearchError('Invalid location. Please select from the dropdown suggestions.');
            toast.error('Invalid location selected');
          }
        });

        setIsLoading(false);
        setSearchError('');
        scriptLoadedRef.current = true;
      } catch (error) {
        setSearchError('Failed to initialize search. Please check your API key.');
        setIsLoading(false);
        scriptLoadedRef.current = false;
        toast.error('Search initialization failed');
      }
    };

    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [apiKey, onAddWaypoint]);

  return (
    <div className="space-y-2">
      <div className="relative flex gap-2 w-full">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            ref={inputRef}
            type="text"
            placeholder={isLoading ? "Loading search..." : "Search for a location..."}
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              if (searchError) setSearchError('');
            }}
            disabled={isLoading || !apiKey}
            className={`pl-10 bg-card ${searchError ? 'border-destructive focus-visible:ring-destructive' : 'border-border'} focus:ring-2 focus:ring-primary/20`}
          />
        </div>
        <Button 
          size="icon"
          disabled={isLoading || !apiKey}
          className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      {searchError && (
        <div className="flex items-start gap-2 text-xs text-destructive bg-destructive/10 p-2 rounded-md">
          <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
          <span>{searchError}</span>
        </div>
      )}
      {!apiKey && (
        <div className="flex items-start gap-2 text-xs text-muted-foreground bg-muted/50 p-2 rounded-md">
          <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
          <span>Enter your Google Maps API key above to enable location search.</span>
        </div>
      )}
    </div>
  );
};

export default WaypointSearch;
