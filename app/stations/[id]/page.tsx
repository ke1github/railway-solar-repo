"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useData } from "@/lib/context/DataContext";
import {
  AlertTriangle,
  ArrowLeft,
  Battery,
  Calendar,
  CheckCircle,
  Clock,
  CloudSun,
  Download,
  FileText,
  Lightbulb,
  PanelTop,
  Settings,
  Thermometer,
  Wrench,
  Zap,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { SolarStation, MaintenanceRecord, Alert } from "@/lib/mock/mockTypes";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import Link from "next/link";

export default function StationDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const {
    fetchSolarStationById,
    energyData,
    fetchEnergyData,
    alerts,
    fetchAlerts,
  } = useData();

  const [station, setStation] = useState<SolarStation | null>(null);
  const [maintenanceRecords, setMaintenanceRecords] = useState<
    MaintenanceRecord[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStation = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Fetch station details
        const stationData = await fetchSolarStationById(params.id);

        if (stationData) {
          setStation(stationData);

          // Fetch related data
          fetchEnergyData(stationData.id);
          fetchAlerts(stationData.id);

          // TODO: Fetch maintenance records once implemented
          // For now, we'll just simulate some
          setMaintenanceRecords([
            {
              id: "1",
              stationId: stationData.id,
              type: "routine",
              startDate: "2023-12-15T10:00:00Z",
              endDate: "2023-12-15T16:00:00Z",
              status: "completed",
              assignedTo: ["user-1", "user-2"],
              description: "Quarterly maintenance inspection",
              findings:
                "All systems functioning normally. Cleaned panels and checked connections.",
              actions: "Dust removal from panels, tightened loose connections",
              cost: 12500,
              attachments: [],
            },
            {
              id: "2",
              stationId: stationData.id,
              type: "emergency",
              startDate: "2023-10-05T09:30:00Z",
              endDate: "2023-10-05T14:00:00Z",
              status: "completed",
              assignedTo: ["user-3"],
              description: "Inverter failure investigation",
              findings: "Faulty capacitor in inverter unit 2",
              actions: "Replaced capacitor and tested system",
              cost: 18000,
              attachments: [],
            },
          ]);
        } else {
          setError(`Station with ID ${params.id} not found`);
        }
      } catch (err) {
        setError(`Error loading station data: ${err}`);
      } finally {
        setIsLoading(false);
      }
    };

    loadStation();
  }, [params.id, fetchSolarStationById, fetchEnergyData, fetchAlerts]);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-120px)]">
        <LoadingSpinner />
      </div>
    );
  }

  // Error state
  if (error || !station) {
    return (
      <div className="py-6 px-4">
        <Link
          href="/stations"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Stations
        </Link>

        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-red-500">Error</CardTitle>
            <CardDescription>
              There was a problem loading the station details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>{error || "Station not found"}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="py-6 px-4 space-y-6">
      {/* Back Button and Header */}
      <div className="space-y-4">
        <Link
          href="/stations"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Stations
        </Link>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {station.name}
            </h1>
            <p className="text-muted-foreground">{station.location}</p>
          </div>

          <div className="flex items-center space-x-2">
            <Badge
              className={
                station.status === "operational"
                  ? "bg-green-100 text-green-800"
                  : station.status === "maintenance"
                  ? "bg-yellow-100 text-yellow-800"
                  : station.status === "construction"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-gray-100 text-gray-800"
              }
            >
              {station.status}
            </Badge>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>
      </div>

      {/* Station Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Station Details</CardTitle>
            <CardDescription>
              Key information about this solar installation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  Division
                </h3>
                <p className="mt-1">{station.division}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  Zone
                </h3>
                <p className="mt-1">{station.zone}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  Installation Date
                </h3>
                <p className="mt-1">
                  {format(parseISO(station.installationDate), "PPP")}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  Capacity
                </h3>
                <p className="mt-1">{station.capacity} kW</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  Panel Type
                </h3>
                <p className="mt-1">{station.panelType}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  Panel Count
                </h3>
                <p className="mt-1">{station.panelCount}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  Efficiency
                </h3>
                <p className="mt-1">{(station.efficiency * 100).toFixed(1)}%</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  Land Area
                </h3>
                <p className="mt-1">{station.landArea} m²</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  Last Maintenance
                </h3>
                <p className="mt-1">
                  {format(parseISO(station.lastMaintenance), "PPP")}
                </p>
              </div>
              {station.batteryStorage && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Battery Capacity
                  </h3>
                  <p className="mt-1">{station.batteryCapacity} kWh</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Energy Summary</CardTitle>
            <CardDescription>Current energy statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-yellow-100">
                  <Zap className="h-5 w-5 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">
                    Today's Production
                  </p>
                  <p className="text-2xl font-bold">
                    {energyData
                      .filter(
                        (d) =>
                          d.stationId === station.id &&
                          d.timestamp.startsWith(
                            new Date().toISOString().split("T")[0]
                          )
                      )
                      .reduce((sum, d) => sum + d.production, 0)
                      .toFixed(1)}{" "}
                    kWh
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100">
                  <Battery className="h-5 w-5 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">
                    Current Output
                  </p>
                  <p className="text-2xl font-bold">
                    {energyData
                      .filter((d) => d.stationId === station.id)
                      .sort(
                        (a, b) =>
                          new Date(b.timestamp).getTime() -
                          new Date(a.timestamp).getTime()
                      )
                      .slice(0, 1)
                      .reduce((sum, d) => sum + d.peakOutput, 0)
                      .toFixed(1)}{" "}
                    kW
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100">
                  <Lightbulb className="h-5 w-5 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">
                    CO₂ Saved Today
                  </p>
                  <p className="text-2xl font-bold">
                    {energyData
                      .filter(
                        (d) =>
                          d.stationId === station.id &&
                          d.timestamp.startsWith(
                            new Date().toISOString().split("T")[0]
                          )
                      )
                      .reduce((sum, d) => sum + d.co2Saved, 0)
                      .toFixed(1)}{" "}
                    kg
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="p-3 rounded-full bg-orange-100">
                  <CloudSun className="h-5 w-5 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">
                    Weather
                  </p>
                  <p className="text-xl font-bold">
                    {energyData
                      .filter((d) => d.stationId === station.id)
                      .sort(
                        (a, b) =>
                          new Date(b.timestamp).getTime() -
                          new Date(a.timestamp).getTime()
                      )
                      .slice(0, 1)
                      .map((d) => d.weather.replace("_", " "))[0] || "Unknown"}
                    ,{" "}
                    {energyData
                      .filter((d) => d.stationId === station.id)
                      .sort(
                        (a, b) =>
                          new Date(b.timestamp).getTime() -
                          new Date(a.timestamp).getTime()
                      )
                      .slice(0, 1)
                      .map((d) => d.temperature)[0] || 0}
                    °C
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for Detailed Data */}
      <Tabs defaultValue="energy">
        <TabsList className="grid w-full grid-cols-4 md:w-auto md:inline-flex">
          <TabsTrigger value="energy">Energy Data</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="energy" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Energy Production</CardTitle>
              <CardDescription>
                Historical energy data for this station
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center bg-muted/20 rounded-md">
                <p className="text-muted-foreground">
                  Energy production chart will be displayed here
                </p>
              </div>

              <div className="mt-6">
                <h3 className="font-medium mb-3">Recent Energy Records</h3>
                <div className="rounded-md border overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="bg-muted/50 text-sm">
                        <th className="py-3 px-4 text-left font-medium">
                          Date & Time
                        </th>
                        <th className="py-3 px-4 text-left font-medium">
                          Production (kWh)
                        </th>
                        <th className="py-3 px-4 text-left font-medium">
                          Peak Output (kW)
                        </th>
                        <th className="py-3 px-4 text-left font-medium">
                          Efficiency
                        </th>
                        <th className="py-3 px-4 text-left font-medium">
                          Weather
                        </th>
                        <th className="py-3 px-4 text-left font-medium">
                          Temperature
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {energyData
                        .filter((data) => data.stationId === station.id)
                        .sort(
                          (a, b) =>
                            new Date(b.timestamp).getTime() -
                            new Date(a.timestamp).getTime()
                        )
                        .slice(0, 10)
                        .map((data) => (
                          <tr
                            key={data.id}
                            className="border-t hover:bg-muted/20"
                          >
                            <td className="py-3 px-4 text-sm">
                              {format(
                                parseISO(data.timestamp),
                                "MMM d, yyyy HH:mm"
                              )}
                            </td>
                            <td className="py-3 px-4 text-sm">
                              {data.production.toFixed(2)}
                            </td>
                            <td className="py-3 px-4 text-sm">
                              {data.peakOutput.toFixed(2)}
                            </td>
                            <td className="py-3 px-4 text-sm">
                              {(data.efficiency * 100).toFixed(1)}%
                            </td>
                            <td className="py-3 px-4 text-sm capitalize">
                              {data.weather.replace("_", " ")}
                            </td>
                            <td className="py-3 px-4 text-sm">
                              {data.temperature}°C
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="maintenance" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Maintenance Records</CardTitle>
                  <CardDescription>
                    History of maintenance activities
                  </CardDescription>
                </div>
                <Button size="sm">
                  <Wrench className="h-4 w-4 mr-2" />
                  Schedule Maintenance
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-3">Upcoming Maintenance</h3>
                  {new Date(station.nextMaintenance) > new Date() ? (
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-start space-x-4">
                            <div className="p-2 rounded-full bg-blue-100">
                              <Calendar className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <h4 className="font-medium">
                                Scheduled Maintenance
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                {format(
                                  parseISO(station.nextMaintenance),
                                  "PPP"
                                )}
                              </p>
                              <p className="text-sm mt-1">
                                Routine maintenance including panel cleaning,
                                connection check, and performance testing
                              </p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            Reschedule
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="text-center py-6 bg-muted/20 rounded-md">
                      <Clock className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-muted-foreground">
                        No upcoming maintenance scheduled
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="font-medium mb-3">Maintenance History</h3>
                  {maintenanceRecords.length > 0 ? (
                    <div className="space-y-4">
                      {maintenanceRecords.map((record) => (
                        <Card key={record.id}>
                          <CardContent className="p-4">
                            <div className="flex items-start space-x-4">
                              <div
                                className={`p-2 rounded-full ${
                                  record.type === "routine"
                                    ? "bg-green-100"
                                    : record.type === "emergency"
                                    ? "bg-red-100"
                                    : "bg-blue-100"
                                }`}
                              >
                                <Wrench
                                  className={`h-5 w-5 ${
                                    record.type === "routine"
                                      ? "text-green-600"
                                      : record.type === "emergency"
                                      ? "text-red-600"
                                      : "text-blue-600"
                                  }`}
                                />
                              </div>
                              <div className="flex-1">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h4 className="font-medium capitalize">
                                      {record.type} Maintenance
                                    </h4>
                                    <p className="text-sm text-muted-foreground">
                                      {format(
                                        parseISO(record.startDate),
                                        "PPP"
                                      )}
                                    </p>
                                  </div>
                                  <Badge
                                    variant={
                                      record.status === "completed"
                                        ? "default"
                                        : record.status === "in_progress"
                                        ? "secondary"
                                        : "outline"
                                    }
                                  >
                                    {record.status}
                                  </Badge>
                                </div>
                                <p className="text-sm mt-2">
                                  {record.description}
                                </p>
                                {record.findings && (
                                  <div className="mt-3">
                                    <h5 className="text-sm font-medium">
                                      Findings
                                    </h5>
                                    <p className="text-sm text-muted-foreground">
                                      {record.findings}
                                    </p>
                                  </div>
                                )}
                                {record.actions && (
                                  <div className="mt-2">
                                    <h5 className="text-sm font-medium">
                                      Actions Taken
                                    </h5>
                                    <p className="text-sm text-muted-foreground">
                                      {record.actions}
                                    </p>
                                  </div>
                                )}
                                <div className="flex justify-between items-center mt-4">
                                  {record.cost !== undefined && (
                                    <p className="text-sm">
                                      <span className="font-medium">Cost:</span>{" "}
                                      ₹{record.cost.toLocaleString()}
                                    </p>
                                  )}
                                  <Button variant="outline" size="sm">
                                    View Details
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 bg-muted/20 rounded-md">
                      <FileText className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-muted-foreground">
                        No maintenance records found
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>System Alerts</CardTitle>
              <CardDescription>
                Recent alerts and notifications for this station
              </CardDescription>
            </CardHeader>
            <CardContent>
              {alerts.filter((alert) => alert.stationId === station.id).length >
              0 ? (
                <div className="space-y-4">
                  {alerts
                    .filter((alert) => alert.stationId === station.id)
                    .sort(
                      (a, b) =>
                        new Date(b.timestamp).getTime() -
                        new Date(a.timestamp).getTime()
                    )
                    .map((alert) => (
                      <div
                        key={alert.id}
                        className="flex items-start space-x-4 p-4 rounded-lg border"
                      >
                        <div
                          className={`p-2 rounded-full ${
                            alert.severity === "critical"
                              ? "bg-red-100 text-red-700"
                              : alert.severity === "high"
                              ? "bg-orange-100 text-orange-700"
                              : alert.severity === "medium"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          <AlertTriangle className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <h4 className="font-medium capitalize">
                              {alert.type.replace(/_/g, " ")}
                            </h4>
                            <Badge
                              variant={
                                alert.severity === "critical"
                                  ? "destructive"
                                  : alert.severity === "high"
                                  ? "default"
                                  : alert.severity === "medium"
                                  ? "secondary"
                                  : "outline"
                              }
                            >
                              {alert.severity}
                            </Badge>
                          </div>
                          <p className="text-sm mt-1">{alert.message}</p>
                          <div className="flex justify-between items-center mt-3">
                            <span className="text-sm text-muted-foreground">
                              {format(parseISO(alert.timestamp), "PPP p")}
                            </span>
                            <div className="space-x-2">
                              {!alert.acknowledged && (
                                <Button variant="outline" size="sm">
                                  Acknowledge
                                </Button>
                              )}
                              {!alert.resolved && (
                                <Button size="sm">Resolve</Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-10 bg-muted/20 rounded-md">
                  <CheckCircle className="h-12 w-12 mx-auto mb-3 text-green-500" />
                  <h3 className="text-lg font-medium">All Systems Normal</h3>
                  <p className="text-muted-foreground mt-1">
                    No alerts found for this station
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Documents & Reports</CardTitle>
              <CardDescription>
                Technical specifications and documentation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-10 bg-muted/20 rounded-md">
                <FileText className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                <h3 className="text-lg font-medium">Document Section</h3>
                <p className="text-muted-foreground mt-1">
                  Station documentation will be displayed here
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
