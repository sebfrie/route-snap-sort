import { useState } from 'react';
import WaypointSearch from '@/components/WaypointSearch';
import WaypointList, { Waypoint } from '@/components/WaypointList';
import RouteMap from '@/components/RouteMap';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Route, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const Index = () => {
  const [apiKey, setApiKey] = useState('');
  const [waypoints, setWaypoints] = useState<Waypoint[]>([]);

  const handleAddWaypoint = (place: google.maps.places.PlaceResult) => {
    if (!place.geometry || !place.geometry.location) return;

    const newWaypoint: Waypoint = {
      id: `waypoint-${Date.now()}`,
      name: place.name || 'Unknown location',
      address: place.formatted_address || '',
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
    };

    setWaypoints([...waypoints, newWaypoint]);
    toast.success('Waypoint added!');
  };

  const handleReorderWaypoints = (reorderedWaypoints: Waypoint[]) => {
    setWaypoints(reorderedWaypoints);
    toast.success('Route reordered!');
  };

  const handleRemoveWaypoint = (id: string) => {
    setWaypoints(waypoints.filter(wp => wp.id !== id));
    toast.success('Waypoint removed!');
  };

  const handleClearAll = () => {
    setWaypoints([]);
    toast.success('All waypoints cleared!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <div className="container mx-auto p-4 h-screen flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
              <Route className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Route Planner</h1>
              <p className="text-sm text-muted-foreground">Plan your journey with sortable waypoints</p>
            </div>
          </div>
        </div>

        {/* API Key Input */}
        <Card className="p-4 bg-card/80 backdrop-blur-sm border-border">
          <Label htmlFor="api-key" className="text-sm font-medium text-foreground mb-2 block">
            Google Maps API Key
          </Label>
          <Input
            id="api-key"
            type="password"
            placeholder="Enter your Google Maps API key..."
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="bg-background border-border"
          />
          <p className="text-xs text-muted-foreground mt-2">
            Get your API key from{' '}
            <a
              href="https://console.cloud.google.com/google/maps-apis"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline"
            >
              Google Cloud Console
            </a>
          </p>
        </Card>

        {/* Main Content */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 min-h-0">
          {/* Sidebar */}
          <Card className="lg:col-span-1 p-4 bg-card/80 backdrop-blur-sm border-border flex flex-col">
            <div className="mb-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-accent" />
                  Waypoints ({waypoints.length})
                </h2>
                {waypoints.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearAll}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Clear All
                  </Button>
                )}
              </div>
              <WaypointSearch onAddWaypoint={handleAddWaypoint} apiKey={apiKey} />
            </div>

            <div className="flex-1 overflow-y-auto pr-2">
              <WaypointList
                waypoints={waypoints}
                onReorder={handleReorderWaypoints}
                onRemove={handleRemoveWaypoint}
              />
            </div>
          </Card>

          {/* Map */}
          <Card className="lg:col-span-2 p-0 bg-card border-border overflow-hidden">
            <RouteMap waypoints={waypoints} apiKey={apiKey} />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
