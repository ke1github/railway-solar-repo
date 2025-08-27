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
  ArrowUpRight,
  Battery,
  BatteryCharging,
  Calendar,
  Clock,
  DollarSign,
  LineChart,
  Percent,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { format, parseISO } from "date-fns";
import { SolarStation, Alert as AlertType } from "@/lib/mock/mockTypes";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { EnergyProductionChart } from "@/components/charts/EnergyProductionChart";

export default function DashboardPage() {
  const {
    dashboardStats,
    isLoadingDashboardStats,
    dashboardStatsError,
    solarStations,
    isLoadingSolarStations,
    solarStationsError,
    alerts,
    isLoadingAlerts,
    alertsError,
    projects,
    isLoadingProjects,
    projectsError,
    energyData,
    fetchEnergyData,
    refreshAllData,
  } = useData();

  // Fetch energy data for chart on component mount
  React.useEffect(() => {
    // Get today's date and 7 days ago for weekly data
    const endDate = new Date().toISOString().split("T")[0];
    const startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];

    // Fetch data on mount
    fetchEnergyData(undefined, startDate, endDate);
    refreshAllData();
  }, [fetchEnergyData, refreshAllData]);

  // Handle loading state
  if (isLoadingDashboardStats && !dashboardStats) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-120px)]">
        <LoadingSpinner />
      </div>
    );
  }

  // Handle error state
  if (dashboardStatsError) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-120px)]">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="text-red-500">
              Error Loading Dashboard
            </CardTitle>
            <CardDescription>
              There was a problem loading the dashboard data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>{dashboardStatsError}</p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => refreshAllData()}>Retry</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="py-6 px-4 space-y-8">
      {/* Main Dashboard Header */}
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Railway Solar Dashboard
        </h1>
        <p className="text-muted-foreground">
          Real-time monitoring and management of railway solar installations
        </p>
      </div>

      {/* Key Metrics Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Operational Stations"
          value={dashboardStats?.stationStats.operational || 0}
          total={dashboardStats?.stationStats.total || 0}
          icon={<BatteryCharging className="h-5 w-5 text-green-500" />}
          trend="+2 from last month"
          trendUp={true}
        />

        <StatsCard
          title="Energy Production"
          value={dashboardStats?.energyStats.todayProduction || 0}
          suffix="kWh"
          icon={<Zap className="h-5 w-5 text-yellow-500" />}
          trend="12% higher than yesterday"
          trendUp={true}
        />

        <StatsCard
          title="Active Projects"
          value={dashboardStats?.projectStats.active || 0}
          total={dashboardStats?.projectStats.total || 0}
          icon={<Calendar className="h-5 w-5 text-blue-500" />}
          trend="On schedule"
          trendUp={true}
        />

        <StatsCard
          title="Monthly Savings"
          value={dashboardStats?.energyStats.monthlySavings || 0}
          prefix="₹"
          suffix="K"
          icon={<DollarSign className="h-5 w-5 text-emerald-500" />}
          trend="8% increase"
          trendUp={true}
        />
      </div>

      {/* Recent Alerts and Top Stations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Recent Alerts */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Alerts</CardTitle>
            <CardDescription>System alerts requiring attention</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingAlerts ? (
              <div className="flex items-center justify-center h-[200px]">
                <LoadingSpinner />
              </div>
            ) : alertsError ? (
              <div className="text-center text-red-500 p-4">
                Error loading alerts: {alertsError}
              </div>
            ) : alerts.length === 0 ? (
              <div className="text-center text-muted-foreground p-4">
                No alerts found. All systems operating normally.
              </div>
            ) : (
              <div className="space-y-4">
                {alerts.slice(0, 5).map((alert) => (
                  <AlertCard key={alert.id} alert={alert} />
                ))}
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/alerts">View All Alerts</Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Top Performing Stations */}
        <Card>
          <CardHeader>
            <CardTitle>Top Stations</CardTitle>
            <CardDescription>
              Highest performing solar installations
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingSolarStations ? (
              <div className="flex items-center justify-center h-[200px]">
                <LoadingSpinner />
              </div>
            ) : solarStationsError ? (
              <div className="text-center text-red-500 p-4">
                Error loading stations: {solarStationsError}
              </div>
            ) : solarStations.length === 0 ? (
              <div className="text-center text-muted-foreground p-4">
                No stations found.
              </div>
            ) : (
              <div className="space-y-4">
                {solarStations
                  .filter((station) => station.status === "operational")
                  .sort((a, b) => b.efficiency - a.efficiency)
                  .slice(0, 5)
                  .map((station) => (
                    <StationCard key={station.id} station={station} />
                  ))}
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/stations">View All Stations</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Energy Production Chart */}
      <div className="grid grid-cols-1 gap-4">
        <Card className="col-span-1">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle>Energy Production</CardTitle>
              <CardDescription>
                Weekly production data across all stations
              </CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <LineChart className="h-4 w-4 mr-2" />
              Detailed Reports
            </Button>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="h-[300px]">
              <div className="h-[300px] flex items-center justify-center">
                {isLoadingDashboardStats ? (
                  <LoadingSpinner />
                ) : (
                  <div className="w-full h-full bg-muted/20 rounded-md flex items-center justify-center">
                    <p className="text-muted-foreground">
                      Energy production chart will be displayed here
                    </p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Project Status Section */}
      <div className="grid grid-cols-1 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Active Projects</CardTitle>
            <CardDescription>
              Ongoing solar installation projects
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingProjects ? (
              <div className="flex items-center justify-center h-[200px]">
                <LoadingSpinner />
              </div>
            ) : projectsError ? (
              <div className="text-center text-red-500 p-4">
                Error loading projects: {projectsError}
              </div>
            ) : projects.length === 0 ? (
              <div className="text-center text-muted-foreground p-4">
                No active projects found.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projects
                  .filter(
                    (project) =>
                      project.status !== "completed" &&
                      project.status !== "cancelled"
                  )
                  .slice(0, 4)
                  .map((project) => (
                    <Card key={project.id} className="overflow-hidden">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">
                          {project.name}
                        </CardTitle>
                        <div className="flex items-center justify-between">
                          <Badge
                            className={
                              project.status === "planning"
                                ? "bg-blue-100 text-blue-800"
                                : project.status === "construction"
                                ? "bg-yellow-100 text-yellow-800"
                                : project.status === "testing"
                                ? "bg-purple-100 text-purple-800"
                                : "bg-green-100 text-green-800"
                            }
                          >
                            {project.status}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {Math.round(
                              (project.expenditure / project.budget) * 100
                            )}
                            % Complete
                          </span>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="w-full bg-secondary h-2 rounded-full mt-1">
                          <div
                            className="bg-primary h-2 rounded-full"
                            style={{
                              width: `${
                                (project.expenditure / project.budget) * 100
                              }%`,
                            }}
                          />
                        </div>
                        <div className="flex justify-between items-center mt-4 text-sm">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                            <span>
                              Start:{" "}
                              {format(
                                parseISO(project.startDate),
                                "MMM d, yyyy"
                              )}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                            <span>
                              Due:{" "}
                              {format(
                                parseISO(project.targetCompletionDate),
                                "MMM d, yyyy"
                              )}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          asChild
                        >
                          <Link href={`/projects/${project.id}`}>
                            View Details
                          </Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/projects">View All Projects</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

// Stats Card Component
function StatsCard({
  title,
  value,
  total,
  prefix = "",
  suffix = "",
  icon,
  trend,
  trendUp = true,
}: {
  title: string;
  value: number;
  total?: number;
  prefix?: string;
  suffix?: string;
  icon: React.ReactNode;
  trend: string;
  trendUp: boolean;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {prefix}
          {value}
          {suffix}
          {total !== undefined && (
            <span className="text-muted-foreground text-sm font-normal ml-1">
              / {total}
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-1 flex items-center">
          {trendUp ? (
            <ArrowUpRight className="h-3 w-3 mr-1 text-green-500" />
          ) : (
            <ArrowUpRight className="h-3 w-3 mr-1 text-red-500 rotate-180" />
          )}
          {trend}
        </p>
      </CardContent>
    </Card>
  );
}

// Alert Card Component
function AlertCard({ alert }: { alert: AlertType }) {
  return (
    <div className="flex items-start space-x-3 p-3 rounded-lg bg-background border">
      <div
        className={`p-2 rounded-full ${
          alert.severity === "critical"
            ? "bg-red-100 text-red-700"
            : alert.severity === "medium"
            ? "bg-yellow-100 text-yellow-700"
            : alert.severity === "high"
            ? "bg-orange-100 text-orange-700"
            : "bg-blue-100 text-blue-700"
        }`}
      >
        <AlertTriangle className="h-4 w-4" />
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <h4 className="font-semibold text-sm">
            {alert.type.replace("_", " ")}
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
        <p className="text-xs text-muted-foreground mt-1">{alert.message}</p>
        <div className="flex justify-between items-center mt-2">
          <span className="text-xs text-muted-foreground">
            {format(parseISO(alert.timestamp), "MMM d, h:mm a")}
          </span>
          <Button variant="ghost" size="sm" className="h-6 text-xs">
            Resolve
          </Button>
        </div>
      </div>
    </div>
  );
}

// Station Card Component
function StationCard({ station }: { station: SolarStation }) {
  return (
    <div className="flex items-start space-x-3 p-3 rounded-lg bg-background border">
      <div className="p-2 rounded-full bg-green-100 text-green-700">
        <Battery className="h-4 w-4" />
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <h4 className="font-semibold text-sm">{station.name}</h4>
          <Badge variant="outline" className="bg-green-50">
            {station.status}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground mt-1">{station.location}</p>
        <div className="grid grid-cols-2 gap-2 mt-2">
          <div className="flex items-center text-xs">
            <Zap className="h-3 w-3 mr-1 text-yellow-500" />
            <span>{station.capacity} kW</span>
          </div>
          <div className="flex items-center text-xs">
            <Percent className="h-3 w-3 mr-1 text-blue-500" />
            <span>{(station.efficiency * 100).toFixed(1)}% Efficiency</span>
          </div>
        </div>
      </div>
    </div>
  );
}
