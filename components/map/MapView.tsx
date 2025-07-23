// components/map/MapView.tsx
"use client";

export function MapView() {
  return (
    <div className="w-full h-96 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
      <p className="text-muted-foreground">Interactive Map Component</p>
      {/* TODO: Integrate with mapping library like Leaflet or Google Maps */}
    </div>
  );
}
