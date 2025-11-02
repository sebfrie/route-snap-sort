import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, X, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export interface Waypoint {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
}

interface WaypointListProps {
  waypoints: Waypoint[];
  onReorder: (waypoints: Waypoint[]) => void;
  onRemove: (id: string) => void;
}

interface SortableWaypointProps {
  waypoint: Waypoint;
  index: number;
  onRemove: (id: string) => void;
}

const SortableWaypoint = ({ waypoint, index, onRemove }: SortableWaypointProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ 
    id: waypoint.id 
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className="p-4 mb-2 bg-card border-border hover:shadow-md transition-shadow"
    >
      <div className="flex items-center gap-3">
        <button
          className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground transition-colors"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-5 w-5" />
        </button>
        
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold">
            {index + 1}
          </div>
          <MapPin className="h-4 w-4 text-accent flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="font-medium text-foreground truncate">{waypoint.name}</p>
            <p className="text-sm text-muted-foreground truncate">{waypoint.address}</p>
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => onRemove(waypoint.id)}
          className="flex-shrink-0 text-muted-foreground hover:text-destructive"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
};

const WaypointList = ({ waypoints, onReorder, onRemove }: WaypointListProps) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = waypoints.findIndex((w) => w.id === active.id);
      const newIndex = waypoints.findIndex((w) => w.id === over.id);
      onReorder(arrayMove(waypoints, oldIndex, newIndex));
    }
  };

  if (waypoints.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <MapPin className="h-12 w-12 mx-auto mb-4 opacity-30" />
        <p>No waypoints yet. Search and add locations to plan your route.</p>
      </div>
    );
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={waypoints.map(w => w.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-0">
          {waypoints.map((waypoint, index) => (
            <SortableWaypoint
              key={waypoint.id}
              waypoint={waypoint}
              index={index}
              onRemove={onRemove}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};

export default WaypointList;
