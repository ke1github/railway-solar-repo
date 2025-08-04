// app/solar/dashboard/page.tsx
import { Suspense } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getSolarSystemOverview } from "@/lib/actions/solar-actions";
import { SolarInstallationList } from "@/components/solar/SolarInstallationList";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import Link from "next/link";

async function SolarSystemStats() {
  const data = await getSolarSystemOverview();

  // Calculate total stats across all statuses
  const totalCapacity = data.capacityStats.reduce(
    (sum, item) => sum + item.capacity,
    0
  );
  const totalInstallations = data.capacityStats.reduce(
    (sum, item) => sum + item.count,
    0
  );
  const totalArea = data.capacityStats.reduce(
    (sum, item) => sum + item.totalArea,
    0
  );

  // Get operational stats
  const operationalStats = data.capacityStats.find(
    (item) => item.status === "operational"
  ) || {
    capacity: 0,
    count: 0,
    totalArea: 0,
    totalPanels: 0,
  };

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="text-sm font-medium">Total Capacity</div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalCapacity.toFixed(2)} kW
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {operationalStats.capacity.toFixed(2)} kW operational (
              {((operationalStats.capacity / totalCapacity) * 100).toFixed(1)}%)
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="text-sm font-medium">Total Installations</div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalInstallations}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {operationalStats.count} operational (
              {((operationalStats.count / totalInstallations) * 100).toFixed(1)}
              %)
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="text-sm font-medium">Total Energy Generated</div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.productionStats.totalEnergyProduced.toFixed(2)} kWh
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {data.productionStats.totalRecordings} recordings
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="text-sm font-medium">Total Area</div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <rect width="20" height="14" x="2" y="5" rx="2" />
              <path d="M2 10h20" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalArea.toFixed(2)} m²</div>
            <p className="text-xs text-muted-foreground mt-1">
              {operationalStats.totalArea.toFixed(2)} m² operational
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="installations" className="space-y-4">
        <TabsList>
          <TabsTrigger value="installations">Installations</TabsTrigger>
          <TabsTrigger value="by-station">By Station</TabsTrigger>
          <TabsTrigger value="status">Status Overview</TabsTrigger>
        </TabsList>
        <TabsContent value="installations" className="space-y-4">
          <SolarInstallationList />
        </TabsContent>
        <TabsContent value="by-station" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Solar Capacity by Station</CardTitle>
              <CardDescription>
                Overview of solar installations grouped by railway station
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {data.productionByStation.map((station) => (
                  <div key={station.stationId} className="flex items-center">
                    <div className="space-y-1 flex-1">
                      <div className="flex justify-between">
                        <p className="text-sm font-medium leading-none">
                          {station.stationName || station.stationCode}
                        </p>
                        <div className="flex items-center">
                          <Badge variant="outline" className="ml-2">
                            {station.totalCapacity.toFixed(2)} kW
                          </Badge>
                          {station.totalEnergyProduced > 0 && (
                            <Badge className="ml-2 bg-green-500">
                              {station.totalEnergyProduced.toFixed(2)} kWh
                            </Badge>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Efficiency ratio:{" "}
                        {station.efficiencyRatio
                          ? station.efficiencyRatio.toFixed(2)
                          : "N/A"}
                      </p>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-secondary mt-2">
                        <div
                          className="h-full bg-primary"
                          style={{
                            width: `${Math.min(
                              100,
                              (station.totalCapacity / totalCapacity) * 100
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-auto"
                      asChild
                    >
                      <a href={`/stations/${station.stationId}`}>View</a>
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="status" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {data.capacityStats.map((stat) => (
              <Card key={stat.status}>
                <CardHeader>
                  <CardTitle className="capitalize">{stat.status}</CardTitle>
                  <CardDescription>
                    {stat.count} installation{stat.count !== 1 && "s"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Capacity</p>
                      <p className="font-medium">
                        {stat.capacity.toFixed(2)} kW
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Area</p>
                      <p className="font-medium">
                        {stat.totalArea.toFixed(2)} m²
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Panels</p>
                      <p className="font-medium">{stat.totalPanels}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">
                        % of Total
                      </p>
                      <p className="font-medium">
                        {((stat.capacity / totalCapacity) * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
}

export default function SolarDashboardPage() {
  return (
    <div className="container py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Solar System Dashboard</h1>
        <Button asChild>
          <Link href="/solar/installations/new">+ New Installation</Link>
        </Button>
      </div>

      <Suspense
        fallback={
          <div className="flex justify-center items-center py-20">
            <LoadingSpinner />
            <span className="ml-2">Loading solar dashboard data...</span>
          </div>
        }
      >
        <SolarSystemStats />
      </Suspense>
    </div>
  );
}
