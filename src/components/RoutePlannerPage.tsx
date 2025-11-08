"use client";

import { useState } from 'react';
import WaypointSearch from '@/components/WaypointSearch';
import WaypointList, { Waypoint } from '@/components/WaypointList';
import RouteMap from '@/components/RouteMap';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { MapPin, Route, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';

export default function RoutePlannerPage() {
  const [apiKey, setApiKey] = useState('');
  const [waypoints, setWaypoints] = useState<Waypoint[]>([]);
  const [showNameLabels, setShowNameLabels] = useState(false);
  const [markerColor, setMarkerColor] = useState('#1e40af');
  const [routeColor, setRouteColor] = useState('#0ea5e9');
  const [apiKeyError, setApiKeyError] = useState('');

  const handleApiKeyChange = (value: string) => {
    setApiKey(value);
    if (apiKeyError && value.trim()) {
      setApiKeyError('');
    }
  };

  const handleAddWaypoint = (place: any) => {
    if (!apiKey.trim()) {
      setApiKeyError('Please enter a valid Google Maps API key first');
      toast.error('API key required');
      return;
    }

    if (!place.geometry || !place.geometry.location) {
      toast.error('Invalid location selected');
      return;
    }

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
            Google Maps API Key <span className="text-destructive">*</span>
          </Label>
          <Input
            id="api-key"
            type="password"
            placeholder="Enter your Google Maps API key..."
            value={apiKey}
            onChange={(e) => handleApiKeyChange(e.target.value)}
            className={`bg-background ${apiKeyError ? 'border-destructive focus-visible:ring-destructive' : 'border-border'}`}
          />
          {apiKeyError && (
            <p className="text-xs text-destructive mt-2 flex items-center gap-1">
              <span className="font-semibold">Error:</span> {apiKeyError}
            </p>
          )}
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
            {' '}(Enable Places API & Maps JavaScript API)
          </p>
        </Card>

        {/* Main Content */}
        <div className="flex-1 min-h-0">
          <ResizablePanelGroup direction="horizontal" className="gap-4">
            {/* Sidebar */}
            <ResizablePanel defaultSize={30} minSize={20} maxSize={50}>
              <Card className="h-full p-4 bg-card/80 backdrop-blur-sm border-border flex flex-col">
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

                {/* Customization Options */}
                <div className="mb-4 space-y-3">
                  {/* Marker Style Toggle */}
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col gap-1">
                        <Label htmlFor="marker-style" className="text-sm font-medium cursor-pointer">
                          Show location names on map
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          Display full names instead of numbers
                        </p>
                      </div>
                      <Switch
                        id="marker-style"
                        checked={showNameLabels}
                        onCheckedChange={setShowNameLabels}
                      />
                    </div>
                  </div>

                  {/* Color Customization */}
                  <div className="p-3 bg-muted/50 rounded-lg space-y-3">
                    <h3 className="text-sm font-medium text-foreground">Color Customization</h3>
                    
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <Label htmlFor="marker-color" className="text-xs text-muted-foreground mb-1 block">
                          Marker Color
                        </Label>
                        <div className="flex items-center gap-2">
                          <Input
                            id="marker-color"
                            type="color"
                            value={markerColor}
                            onChange={(e) => setMarkerColor(e.target.value)}
                            className="w-12 h-8 p-1 cursor-pointer"
                          />
                          <Input
                            type="text"
                            value={markerColor}
                            onChange={(e) => setMarkerColor(e.target.value)}
                            placeholder="#1e40af"
                            className="flex-1 h-8 text-xs"
                          />
                        </div>
                      </div>

                      <div className="flex-1">
                        <Label htmlFor="route-color" className="text-xs text-muted-foreground mb-1 block">
                          Route Color
                        </Label>
                        <div className="flex items-center gap-2">
                          <Input
                            id="route-color"
                            type="color"
                            value={routeColor}
                            onChange={(e) => setRouteColor(e.target.value)}
                            className="w-12 h-8 p-1 cursor-pointer"
                          />
                          <Input
                            type="text"
                            value={routeColor}
                            onChange={(e) => setRouteColor(e.target.value)}
                            placeholder="#0ea5e9"
                            className="flex-1 h-8 text-xs"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto pr-2 space-y-2">
                  <WaypointList
                    waypoints={waypoints}
                    onReorder={handleReorderWaypoints}
                    onRemove={handleRemoveWaypoint}
                  />
                  
                  <WaypointSearch onAddWaypoint={handleAddWaypoint} apiKey={apiKey} />
                </div>
              </Card>
            </ResizablePanel>

            <ResizableHandle withHandle className="w-2 hover:bg-accent/20 transition-colors" />

            {/* Map */}
            <ResizablePanel defaultSize={70}>
              <Card className="h-full p-0 bg-card border-border overflow-hidden">
                <RouteMap 
                  waypoints={waypoints} 
                  apiKey={apiKey} 
                  showNameLabels={showNameLabels}
                  markerColor={markerColor}
                  routeColor={routeColor}
                />
              </Card>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </div>
    </div>
  );
}
