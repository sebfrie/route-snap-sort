"use client";

import dynamic from 'next/dynamic';

const RoutePlannerPage = dynamic(() => import('@/components/RoutePlannerPage'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted">
      <div className="text-center">
        <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
        <p className="mt-4 text-muted-foreground">Loading Route Planner...</p>
      </div>
    </div>
  ),
});

export default function Home() {
  return <RoutePlannerPage />;
}
