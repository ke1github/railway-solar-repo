"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useData } from "@/lib/context/DataContext";
import { SolarStation } from "@/lib/mock/mockTypes";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { MapIcon, ZoomIn, ZoomOut, Layers, List, Grid2X2 } from "lucide-react";

export default function MapViewPage() {
  const {
    solarStations,
    isLoadingSolarStations,
    solarStationsError,
    fetchSolarStations,
  } = useData();

  const [view, setView] = useState<"map" | "list" | "grid">("map");
  const [selectedStation, setSelectedStation] = useState<SolarStation | null>(
    null
  );

  React.useEffect(() => {
    fetchSolarStations();
  }, [fetchSolarStations]);

  // Handle loading state
  if (isLoadingSolarStations && solarStations.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-120px)]">
        <LoadingSpinner />
      </div>
    );
  }

  // Handle error state
  if (solarStationsError) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-120px)]">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="text-red-500">
              Error Loading Map Data
            </CardTitle>
            <CardDescription>
              There was a problem loading the solar stations data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>{solarStationsError}</p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => fetchSolarStations()}>Retry</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="py-6 px-4 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Solar Installations Map
          </h1>
          <p className="text-muted-foreground">
            Geographic view of all solar installations across railway zones
          </p>
        </div>

        {/* View Controls */}
        <div className="flex items-center space-x-2 bg-muted/30 p-1 rounded-lg">
          <Button
            size="sm"
            variant={view === "map" ? "default" : "ghost"}
            onClick={() => setView("map")}
            className="h-8"
          >
            <MapIcon className="h-4 w-4 mr-1" />
            Map
          </Button>
          <Button
            size="sm"
            variant={view === "list" ? "default" : "ghost"}
            onClick={() => setView("list")}
            className="h-8"
          >
            <List className="h-4 w-4 mr-1" />
            List
          </Button>
          <Button
            size="sm"
            variant={view === "grid" ? "default" : "ghost"}
            onClick={() => setView("grid")}
            className="h-8"
          >
            <Grid2X2 className="h-4 w-4 mr-1" />
            Grid
          </Button>
        </div>
      </div>

      {/* Map View */}
      {view === "map" && (
        <div className="relative bg-muted/20 rounded-lg border border-border h-[calc(100vh-240px)] min-h-[500px]">
          {/* Map Controls */}
          <div className="absolute top-4 right-4 bg-background z-10 rounded-lg shadow-md border border-border">
            <div className="p-2 flex flex-col space-y-2">
              <Button size="icon" variant="ghost" className="h-8 w-8">
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="ghost" className="h-8 w-8">
                <ZoomOut className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="ghost" className="h-8 w-8">
                <Layers className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Placeholder for actual map implementation */}
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <MapIcon className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                Interactive map will be displayed here
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                {solarStations.length} solar stations available across{" "}
                {new Set(solarStations.map((station) => station.zone)).size}{" "}
                railway zones
              </p>
            </div>
          </div>

          {/* Station Info Panel */}
          {selectedStation && (
            <div className="absolute bottom-4 left-4 w-80 bg-background rounded-lg shadow-lg border border-border overflow-hidden">
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold">{selectedStation.name}</h3>
                  <Badge
                    variant={
                      selectedStation.status === "operational"
                        ? "default"
                        : selectedStation.status === "maintenance"
                        ? "secondary"
                        : selectedStation.status === "construction"
                        ? "outline"
                        : "outline"
                    }
                  >
                    {selectedStation.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {selectedStation.location}
                </p>
                <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-muted-foreground">Capacity</p>
                    <p className="font-medium">{selectedStation.capacity} kW</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Efficiency</p>
                    <p className="font-medium">
                      {(selectedStation.efficiency * 100).toFixed(1)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Division</p>
                    <p className="font-medium">{selectedStation.division}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Zone</p>
                    <p className="font-medium">{selectedStation.zone}</p>
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedStation(null)}
                  >
                    Close
                  </Button>
                  <Button size="sm" className="ml-2">
                    Details
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* List View */}
      {view === "list" && (
        <div className="space-y-4">
          <div className="rounded-md border">
            <div className="grid grid-cols-6 bg-muted/50 p-3 text-sm font-medium">
              <div>Name</div>
              <div>Location</div>
              <div>Status</div>
              <div>Capacity</div>
              <div>Zone</div>
              <div>Efficiency</div>
            </div>
            {solarStations.map((station) => (
              <div
                key={station.id}
                className="grid grid-cols-6 p-3 text-sm border-t hover:bg-muted/20"
              >
                <div className="font-medium">{station.name}</div>
                <div>{station.location}</div>
                <div>
                  <Badge
                    variant={
                      station.status === "operational"
                        ? "default"
                        : station.status === "maintenance"
                        ? "secondary"
                        : station.status === "construction"
                        ? "outline"
                        : "outline"
                    }
                  >
                    {station.status}
                  </Badge>
                </div>
                <div>{station.capacity} kW</div>
                <div>{station.zone}</div>
                <div>{(station.efficiency * 100).toFixed(1)}%</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Grid View */}
      {view === "grid" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {solarStations.map((station) => (
            <Card key={station.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{station.name}</CardTitle>
                  <Badge
                    variant={
                      station.status === "operational"
                        ? "default"
                        : station.status === "maintenance"
                        ? "secondary"
                        : station.status === "construction"
                        ? "outline"
                        : "outline"
                    }
                  >
                    {station.status}
                  </Badge>
                </div>
                <CardDescription>{station.location}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Capacity</p>
                    <p className="font-medium">{station.capacity} kW</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Zone</p>
                    <p className="font-medium">{station.zone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Efficiency</p>
                    <p className="font-medium">
                      {(station.efficiency * 100).toFixed(1)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Panels</p>
                    <p className="font-medium">{station.panelCount}</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setSelectedStation(station)}
                >
                  View Details
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
