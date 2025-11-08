import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MapPin, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-background via-background to-muted p-4">
      <Card className="max-w-md w-full p-8 text-center bg-card/80 backdrop-blur-sm border-border">
        <div className="mb-6 flex justify-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
            <MapPin className="h-10 w-10 text-muted-foreground" />
          </div>
        </div>
        
        <h1 className="text-4xl font-bold text-foreground mb-2">404</h1>
        <h2 className="text-xl font-semibold text-foreground mb-3">Page Not Found</h2>
        
        <p className="text-muted-foreground mb-6">
          Oops! It looks like you&apos;ve taken a wrong turn. The page you&apos;re looking for doesn&apos;t exist.
        </p>
        
        <Button asChild className="w-full">
          <Link href="/">
            <Home className="mr-2 h-4 w-4" />
            Back to Route Planner
          </Link>
        </Button>
      </Card>
    </div>
  );
}
