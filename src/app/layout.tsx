import type { Metadata } from "next";
import "@/index.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Route Planner - Plan Your Journey",
  description: "Plan your route with sortable waypoints and Google Maps integration. Add, reorder, and optimize your journey.",
  authors: [{ name: "Lovable" }],
  openGraph: {
    title: "Route Planner",
    description: "Plan your route with sortable waypoints and Google Maps integration",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <Providers>
          <TooltipProvider>
            {children}
            <Toaster />
            <Sonner />
          </TooltipProvider>
        </Providers>
      </body>
    </html>
  );
}
