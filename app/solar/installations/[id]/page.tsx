// app/solar/installations/[id]/page.tsx
import { Suspense } from "react";
import { getSolarInstallationById } from "@/lib/actions/solar-actions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { notFound } from "next/navigation";
import Link from "next/link";

interface PageProps {
  params: {
    id: string;
  };
}

// Status colors for badges
const statusColorMap = {
  planned: "bg-gray-400",
  "under-installation": "bg-yellow-400 text-black",
  operational: "bg-green-500",
  maintenance: "bg-orange-400",
  decommissioned: "bg-red-500",
};

// Installation details component
async function InstallationDetails({ id }: { id: string }) {
  const installation = await getSolarInstallationById(id);

  if (!installation) {
    notFound();
  }

  // Format dates
  const formatDate = (dateValue: Date | string | undefined) => {
    if (!dateValue) return "N/A";
    const date = dateValue instanceof Date ? dateValue : new Date(dateValue);
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      {/* Main Details Card */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">
                Solar Installation at {installation.stationCode}
              </CardTitle>
              <CardDescription>
                {installation.capacity.toFixed(2)} kW Installation
              </CardDescription>
            </div>
            <Badge className={statusColorMap[installation.status]}>
              {installation.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Installation Date</p>
              <p className="font-medium">
                {formatDate(installation.installationDate)}
              </p>
            </div>
            {installation.commissionDate && (
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Commission Date</p>
                <p className="font-medium">
                  {formatDate(installation.commissionDate)}
                </p>
              </div>
            )}
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Panel Type</p>
              <p className="font-medium">{installation.panelType}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Number of Panels</p>
              <p className="font-medium">{installation.numberOfPanels}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Installed Area</p>
              <p className="font-medium">
                {installation.installedArea.toFixed(2)} m²
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Expected Lifespan</p>
              <p className="font-medium">
                {installation.expectedLifespan} years
              </p>
            </div>
            {installation.contractor && (
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Contractor</p>
                <p className="font-medium">{installation.contractor}</p>
              </div>
            )}
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">
                Maintenance Schedule
              </p>
              <p className="font-medium">{installation.maintenanceSchedule}</p>
            </div>
            {installation.lastMaintenance && (
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  Last Maintenance
                </p>
                <p className="font-medium">
                  {formatDate(installation.lastMaintenance)}
                </p>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-2 mt-6">
            <Button variant="outline" asChild>
              <a href={`/stations/${installation.stationId}`}>View Station</a>
            </Button>
            <Button variant="outline" asChild>
              <a href={`/solar/installations/${installation._id}/energy`}>
                Energy Data
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a href={`/solar/installations/${installation._id}/edit`}>Edit</a>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Generation Data Card */}
      {installation.generationData && (
        <Card>
          <CardHeader>
            <CardTitle>Energy Generation Data</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-secondary rounded-lg p-4">
                <p className="text-sm text-muted-foreground">
                  Lifetime Generation
                </p>
                <p className="text-2xl font-bold">
                  {installation.generationData.lifetimeGeneration?.toFixed(2) ||
                    "0"}{" "}
                  kWh
                </p>
              </div>
              <div className="bg-secondary rounded-lg p-4">
                <p className="text-sm text-muted-foreground">
                  Average Daily Generation
                </p>
                <p className="text-2xl font-bold">
                  {installation.generationData.averageDailyGeneration?.toFixed(
                    2
                  ) || "0"}{" "}
                  kWh
                </p>
              </div>
              <div className="bg-secondary rounded-lg p-4">
                <p className="text-sm text-muted-foreground">
                  Best Day Generation
                </p>
                <p className="text-2xl font-bold">
                  {installation.generationData.bestDayGeneration?.toFixed(2) ||
                    "0"}{" "}
                  kWh
                </p>
              </div>
              <div className="bg-secondary rounded-lg p-4">
                <p className="text-sm text-muted-foreground">Best Day Date</p>
                <p className="text-2xl font-bold">
                  {installation.generationData.bestDayDate
                    ? formatDate(installation.generationData.bestDayDate)
                    : "N/A"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Technical Details Card */}
      <Card>
        <CardHeader>
          <CardTitle>Technical Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Mounting Information */}
            {installation.mounting && (
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Mounting</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type</span>
                    <span className="font-medium">
                      {installation.mounting.type || "N/A"}
                    </span>
                  </div>
                  {installation.mounting.angle && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Angle</span>
                      <span className="font-medium">
                        {installation.mounting.angle}°
                      </span>
                    </div>
                  )}
                  {installation.mounting.orientation && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Orientation</span>
                      <span className="font-medium">
                        {installation.mounting.orientation}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Inverter Information */}
            {installation.inverters && (
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Inverters</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Count</span>
                    <span className="font-medium">
                      {installation.inverters.count || "N/A"}
                    </span>
                  </div>
                  {installation.inverters.brand && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Brand</span>
                      <span className="font-medium">
                        {installation.inverters.brand}
                      </span>
                    </div>
                  )}
                  {installation.inverters.model && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Model</span>
                      <span className="font-medium">
                        {installation.inverters.model}
                      </span>
                    </div>
                  )}
                  {installation.inverters.capacity && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Capacity</span>
                      <span className="font-medium">
                        {installation.inverters.capacity} kW
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            {/* Battery Information */}
            {installation.batteries && (
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Batteries</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Installed</span>
                    <span className="font-medium">
                      {installation.batteries.installed ? "Yes" : "No"}
                    </span>
                  </div>
                  {installation.batteries.installed &&
                    installation.batteries.capacity && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Capacity</span>
                        <span className="font-medium">
                          {installation.batteries.capacity} kWh
                        </span>
                      </div>
                    )}
                  {installation.batteries.installed &&
                    installation.batteries.type && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Type</span>
                        <span className="font-medium">
                          {installation.batteries.type}
                        </span>
                      </div>
                    )}
                </div>
              </div>
            )}

            {/* Grid Connection Information */}
            {installation.gridConnection && (
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Grid Connection</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Grid Connected
                    </span>
                    <span className="font-medium">
                      {installation.gridConnection.isGridConnected
                        ? "Yes"
                        : "No"}
                    </span>
                  </div>
                  {installation.gridConnection.isGridConnected && (
                    <>
                      {installation.gridConnection.connectionType && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Connection Type
                          </span>
                          <span className="font-medium">
                            {installation.gridConnection.connectionType}
                          </span>
                        </div>
                      )}
                      {installation.gridConnection.meteringId && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Metering ID
                          </span>
                          <span className="font-medium">
                            {installation.gridConnection.meteringId}
                          </span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Notes and Additional Info */}
      {installation.notes && (
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-line">{installation.notes}</p>
          </CardContent>
        </Card>
      )}

      {/* Documents */}
      {installation.documents && installation.documents.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {installation.documents.map((doc, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center border-b pb-2"
                >
                  <div>
                    <p className="font-medium">{doc.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {doc.type} • Uploaded on {formatDate(doc.uploadDate)}
                    </p>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <a href={doc.url} target="_blank" rel="noopener noreferrer">
                      View
                    </a>
                  </Button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default function SolarInstallationPage({ params }: PageProps) {
  const { id } = params;

  return (
    <div className="container py-6">
      <div className="mb-6">
        <Button variant="ghost" className="mb-2" asChild>
          <Link href="/solar/installations">← Back to Installations</Link>
        </Button>
        <h1 className="text-3xl font-bold">Solar Installation Details</h1>
      </div>

      <Suspense
        fallback={
          <div className="flex justify-center items-center py-20">
            <LoadingSpinner />
            <span className="ml-2">Loading installation details...</span>
          </div>
        }
      >
        <InstallationDetails id={id} />
      </Suspense>
    </div>
  );
}
