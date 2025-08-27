"use client";

import React from "react";
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
import {
  AlertTriangle,
  Building,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  Droplet,
  PanelRight,
  Percent,
  Settings,
  Sun,
  Thermometer,
  Zap,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import Link from "next/link";

export default function StationsPage() {
  const {
    solarStations,
    isLoadingSolarStations,
    solarStationsError,
    fetchSolarStations,
  } = useData();

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
              Error Loading Stations
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

  // Group stations by zone
  const stationsByZone = solarStations.reduce((acc, station) => {
    if (!acc[station.zone]) {
      acc[station.zone] = [];
    }
    acc[station.zone].push(station);
    return acc;
  }, {} as Record<string, typeof solarStations>);

  // Calculate zone statistics
  const zoneStats = Object.entries(stationsByZone).map(([zone, stations]) => {
    const totalCapacity = stations.reduce(
      (sum, station) => sum + station.capacity,
      0
    );
    const operationalCount = stations.filter(
      (s) => s.status === "operational"
    ).length;
    const avgEfficiency =
      stations.reduce((sum, station) => sum + station.efficiency, 0) /
      stations.length;

    return {
      zone,
      stationCount: stations.length,
      operationalCount,
      totalCapacity,
      avgEfficiency,
    };
  });

  return (
    <div className="py-6 px-4 space-y-8">
      {/* Main Header */}
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Solar Stations</h1>
        <p className="text-muted-foreground">
          Overview of all railway solar installations
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Building className="w-4 h-4 mr-2 text-primary" />
              Total Stations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{solarStations.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Across {Object.keys(stationsByZone).length} railway zones
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <CheckCircle2 className="w-4 h-4 mr-2 text-green-500" />
              Operational
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {solarStations.filter((s) => s.status === "operational").length}
              <span className="text-sm font-normal text-muted-foreground ml-1">
                / {solarStations.length}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {(
                (solarStations.filter((s) => s.status === "operational")
                  .length /
                  solarStations.length) *
                100
              ).toFixed(1)}
              % of total stations
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Zap className="w-4 h-4 mr-2 text-yellow-500" />
              Total Capacity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {solarStations
                .reduce((sum, station) => sum + station.capacity, 0)
                .toFixed(1)}{" "}
              kW
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Avg{" "}
              {(
                solarStations.reduce(
                  (sum, station) => sum + station.capacity,
                  0
                ) / solarStations.length
              ).toFixed(1)}{" "}
              kW per station
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Percent className="w-4 h-4 mr-2 text-blue-500" />
              Avg Efficiency
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(
                (solarStations.reduce(
                  (sum, station) => sum + station.efficiency,
                  0
                ) /
                  solarStations.length) *
                100
              ).toFixed(1)}
              %
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Peak efficiency:{" "}
              {(
                Math.max(...solarStations.map((s) => s.efficiency)) * 100
              ).toFixed(1)}
              %
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Zone Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Railway Zone Statistics</CardTitle>
          <CardDescription>
            Overview of solar installations by railway zone
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-hidden">
            <div className="grid grid-cols-5 bg-muted/50 p-3 text-sm font-medium">
              <div>Zone</div>
              <div>Stations</div>
              <div>Operational</div>
              <div>Total Capacity</div>
              <div>Avg Efficiency</div>
            </div>
            {zoneStats.map((zoneStat) => (
              <div
                key={zoneStat.zone}
                className="grid grid-cols-5 p-3 text-sm border-t hover:bg-muted/20"
              >
                <div className="font-medium">{zoneStat.zone}</div>
                <div>{zoneStat.stationCount}</div>
                <div>
                  {zoneStat.operationalCount} (
                  {(
                    (zoneStat.operationalCount / zoneStat.stationCount) *
                    100
                  ).toFixed(0)}
                  %)
                </div>
                <div>{zoneStat.totalCapacity.toFixed(1)} kW</div>
                <div>{(zoneStat.avgEfficiency * 100).toFixed(1)}%</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Station List By Status */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Stations By Status</h2>

        {/* Operational Stations */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <Badge
                  variant="default"
                  className="mr-2 bg-green-100 text-green-800 hover:bg-green-100"
                >
                  Operational
                </Badge>
                <span>Stations</span>
              </CardTitle>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
            <CardDescription>
              Currently operational solar installations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-muted/50 text-sm">
                    <th className="py-3 px-4 text-left font-medium">Name</th>
                    <th className="py-3 px-4 text-left font-medium">
                      Location
                    </th>
                    <th className="py-3 px-4 text-left font-medium">Zone</th>
                    <th className="py-3 px-4 text-left font-medium">
                      Capacity
                    </th>
                    <th className="py-3 px-4 text-left font-medium">
                      Efficiency
                    </th>
                    <th className="py-3 px-4 text-left font-medium">
                      Installation Date
                    </th>
                    <th className="py-3 px-4 text-left font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {solarStations
                    .filter((station) => station.status === "operational")
                    .map((station) => (
                      <tr
                        key={station.id}
                        className="border-t hover:bg-muted/20"
                      >
                        <td className="py-3 px-4 text-sm font-medium">
                          {station.name}
                        </td>
                        <td className="py-3 px-4 text-sm">
                          {station.location}
                        </td>
                        <td className="py-3 px-4 text-sm">{station.zone}</td>
                        <td className="py-3 px-4 text-sm">
                          {station.capacity} kW
                        </td>
                        <td className="py-3 px-4 text-sm">
                          {(station.efficiency * 100).toFixed(1)}%
                        </td>
                        <td className="py-3 px-4 text-sm">
                          {format(
                            parseISO(station.installationDate),
                            "MMM d, yyyy"
                          )}
                        </td>
                        <td className="py-3 px-4 text-sm">
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/stations/${station.id}`}>View</Link>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                            >
                              <Settings className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Under Maintenance Stations */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <Badge
                  variant="secondary"
                  className="mr-2 bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                >
                  Maintenance
                </Badge>
                <span>Stations</span>
              </CardTitle>
            </div>
            <CardDescription>
              Stations currently under maintenance
            </CardDescription>
          </CardHeader>
          <CardContent>
            {solarStations.filter((station) => station.status === "maintenance")
              .length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <AlertTriangle className="h-12 w-12 mx-auto mb-3 text-yellow-500 opacity-50" />
                <p>No stations are currently under maintenance</p>
              </div>
            ) : (
              <div className="rounded-md border overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-muted/50 text-sm">
                      <th className="py-3 px-4 text-left font-medium">Name</th>
                      <th className="py-3 px-4 text-left font-medium">
                        Location
                      </th>
                      <th className="py-3 px-4 text-left font-medium">Zone</th>
                      <th className="py-3 px-4 text-left font-medium">
                        Last Maintenance
                      </th>
                      <th className="py-3 px-4 text-left font-medium">
                        Next Maintenance
                      </th>
                      <th className="py-3 px-4 text-left font-medium">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {solarStations
                      .filter((station) => station.status === "maintenance")
                      .map((station) => (
                        <tr
                          key={station.id}
                          className="border-t hover:bg-muted/20"
                        >
                          <td className="py-3 px-4 text-sm font-medium">
                            {station.name}
                          </td>
                          <td className="py-3 px-4 text-sm">
                            {station.location}
                          </td>
                          <td className="py-3 px-4 text-sm">{station.zone}</td>
                          <td className="py-3 px-4 text-sm">
                            {format(
                              parseISO(station.lastMaintenance),
                              "MMM d, yyyy"
                            )}
                          </td>
                          <td className="py-3 px-4 text-sm">
                            {format(
                              parseISO(station.nextMaintenance),
                              "MMM d, yyyy"
                            )}
                          </td>
                          <td className="py-3 px-4 text-sm">
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm" asChild>
                                <Link href={`/stations/${station.id}`}>
                                  View
                                </Link>
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                              >
                                <Settings className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
