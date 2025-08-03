import React from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getZones } from "@/lib/actions/hierarchy-actions";

// Force dynamic rendering for this page
export const dynamic = "force-dynamic";

export default async function AIHierarchyPage() {
  const zonesResult = await getZones();

  if (!zonesResult.success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background-subtle to-background-accent">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-8">AI Railway Hierarchy</h1>
            <Card className="p-8 text-center max-w-md mx-auto">
              <h3 className="text-xl font-semibold mb-4 text-red-600">
                Error Loading Data
              </h3>
              <p className="text-muted-foreground mb-6">{zonesResult.error}</p>
              <Link href="/admin/zones/new">
                <Button>Add First Zone</Button>
              </Link>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  const zones = zonesResult.zones || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background-subtle to-background-accent">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4">
            AI-Powered Solar EPC Platform
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Intelligent management of solar projects across Indian Railways
          </p>
        </div>

        {/* Hierarchical Navigation */}
        <div className="mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Hierarchical Railway Navigation</span>
                <Link href="/admin/zones">
                  <Button variant="outline" size="sm">
                    Manage Hierarchy
                  </Button>
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                {zones.length === 0 ? (
                  <div className="w-full text-center py-12">
                    <p className="text-muted-foreground mb-4">
                      No railway zones configured yet
                    </p>
                    <Link href="/admin/zones/new">
                      <Button>Add First Zone</Button>
                    </Link>
                  </div>
                ) : (
                  zones.map((zone: any) => (
                    <Link href={`/admin/zones/${zone._id}`} key={zone._id}>
                      <Card className="w-64 hover:bg-muted/50 transition-colors cursor-pointer">
                        <CardContent className="p-6">
                          <h3 className="text-lg font-semibold">{zone.name}</h3>
                          <div className="text-sm text-muted-foreground mb-2">
                            Zone Code: {zone.code}
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Divisions: {zone.totalDivisions}</span>
                            <span>Stations: {zone.totalStations}</span>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle>Smart Navigation</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Use natural language to search and filter across zones,
                divisions, stations, and sites.
              </p>
              <div className="border rounded-md p-4 bg-muted/30">
                <div className="text-sm text-muted-foreground mb-2">
                  Example queries:
                </div>
                <ul className="list-disc pl-5 text-sm space-y-1">
                  <li>&quot;Show all sites in SER Kharagpur Division&quot;</li>
                  <li>
                    &quot;Find stations with solar capacity {">"} 50 kWp&quot;
                  </li>
                  <li>&quot;List projects in construction phase&quot;</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle>Project Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                AI-powered progress tracking, timeline predictions, and
                performance metrics.
              </p>
              <Link href="/ai/epc-dashboard">
                <Button className="w-full">AI EPC Dashboard</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle>Geospatial Intelligence</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Optimize survey routes, identify nearby sites, and visualize
                project distribution.
              </p>
              <div className="flex flex-col space-y-2">
                <Link href="/map">
                  <Button className="w-full" variant="outline">
                    Open Map View
                  </Button>
                </Link>
                <Link href="/ai/site-optimizer">
                  <Button className="w-full">AI Site Optimizer</Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle>Document & Photo AI</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Automatic extraction of data from uploaded photos and documents.
                Smart tagging and organization.
              </p>
              <Link href="/documents">
                <Button className="w-full" variant="outline">
                  Manage Documents
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle>Predictive Scheduling</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                AI estimates completion timelines based on historical data,
                weather forecasts, and resource allocation.
              </p>
              <div className="border rounded-md p-4 bg-muted/30">
                <div className="text-sm font-medium">Features:</div>
                <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1 mt-2">
                  <li>Smart timeline predictions</li>
                  <li>Resource optimization</li>
                  <li>Weather impact analysis</li>
                  <li>Delay risk assessment</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle>Automated Reporting</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Generate comprehensive reports with progress summaries,
                comparisons, and insights.
              </p>
              <div className="flex space-x-3">
                <Link href="/reports/daily" className="flex-1">
                  <Button variant="outline" className="w-full" size="sm">
                    Daily
                  </Button>
                </Link>
                <Link href="/reports/weekly" className="flex-1">
                  <Button variant="outline" className="w-full" size="sm">
                    Weekly
                  </Button>
                </Link>
                <Link href="/reports/monthly" className="flex-1">
                  <Button variant="outline" className="w-full" size="sm">
                    Monthly
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Role-Based Access */}
        <Card>
          <CardHeader>
            <CardTitle>Role-Based AI Assistance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="border rounded-lg p-4">
                <div className="text-lg font-medium mb-2">HQ Admin</div>
                <p className="text-sm text-muted-foreground mb-3">
                  Zone-wide performance summaries and resource allocation
                  recommendations.
                </p>
                <Link href="/dashboard/hq">
                  <Button size="sm" variant="outline" className="w-full">
                    HQ Dashboard
                  </Button>
                </Link>
              </div>

              <div className="border rounded-lg p-4">
                <div className="text-lg font-medium mb-2">Zonal Officer</div>
                <p className="text-sm text-muted-foreground mb-3">
                  Zone-specific alerts, division comparisons, and milestone
                  tracking.
                </p>
                <Link href="/dashboard/zone">
                  <Button size="sm" variant="outline" className="w-full">
                    Zone Dashboard
                  </Button>
                </Link>
              </div>

              <div className="border rounded-lg p-4">
                <div className="text-lg font-medium mb-2">Division Officer</div>
                <p className="text-sm text-muted-foreground mb-3">
                  Division-wise material needs, workforce planning, and site
                  monitoring.
                </p>
                <Link href="/dashboard/division">
                  <Button size="sm" variant="outline" className="w-full">
                    Division Dashboard
                  </Button>
                </Link>
              </div>

              <div className="border rounded-lg p-4">
                <div className="text-lg font-medium mb-2">Station Engineer</div>
                <p className="text-sm text-muted-foreground mb-3">
                  Station-specific tasks, daily checklists, and maintenance
                  alerts.
                </p>
                <Link href="/dashboard/station">
                  <Button size="sm" variant="outline" className="w-full">
                    Station Dashboard
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
