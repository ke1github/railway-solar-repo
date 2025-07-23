// app/page.tsx
import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getDashboardStats } from '@/lib/actions/site-actions';
import { getEPCDashboardStats } from '@/lib/actions/epc-actions';

// Types for dashboard data
interface SiteData {
  _id: string;
  id: string;
  locationName: string;
  address: string;
  feasibleCapacity: number;
  status: string;
}

interface ProjectData {
  projectId: string;
  projectName: string;
  healthScore: number;
  overallStatus: string;
}

export default async function HomePage() {
  const [siteStatsResult, epcStatsResult] = await Promise.all([
    getDashboardStats(),
    getEPCDashboardStats()
  ]);

  if (!siteStatsResult.success || !epcStatsResult.success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background-subtle to-background-accent">
        <div className="container mx-auto px-6 py-8">
          <div className="flex justify-center items-center min-h-[400px]">
            <Card className="p-8 text-center max-w-md">
              <h3 className="text-xl font-semibold mb-4 text-red-600">Error Loading Dashboard</h3>
              <p className="text-muted-foreground mb-6">
                {siteStatsResult.error || epcStatsResult.error}
              </p>
              <Link href="/sites/new">
                <Button className="btn-primary">
                  Start by Adding Sites
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  const siteStats = siteStatsResult.stats;
  const epcStats = epcStatsResult.stats;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background-subtle to-background-accent">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Railway Solar EPC Dashboard
          </h1>
          <p className="text-xl text-muted-foreground">
            Professional Engineering, Procurement & Construction Management System
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Link href="/sites/new">
            <Button className="w-full h-16 text-lg bg-blue-600 hover:bg-blue-700">
              🏗️ Add New Site
            </Button>
          </Link>
          <Link href="/epc/projects/new">
            <Button className="w-full h-16 text-lg bg-green-600 hover:bg-green-700">
              ⚡ Create EPC Project
            </Button>
          </Link>
          <Link href="/sites">
            <Button variant="outline" className="w-full h-16 text-lg">
              📊 View All Sites
            </Button>
          </Link>
        </div>

        {/* Site Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Sites
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">
                {siteStats.project.totalSites}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Railway installations
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Capacity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {(siteStats.project.totalCapacity / 1000).toFixed(1)} MW
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Combined feasible capacity
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Area
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">
                {(siteStats.project.totalArea / 1000).toFixed(1)}k m²
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Feasible installation area
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Energy Generated
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">
                {(siteStats.project.totalEnergyGenerated / 1000).toFixed(0)}k kWh
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Total energy output
              </p>
            </CardContent>
          </Card>
        </div>

        {/* EPC Project Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                EPC Projects
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-indigo-600">
                {epcStats.overview.totalProjects}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Total managed projects
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Active Projects
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">
                {epcStats.overview.activeProjects}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Currently in progress
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Project Budget
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                ₹{(epcStats.overview.totalBudget / 10000000).toFixed(1)}Cr
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Total allocated budget
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Health Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-emerald-600">
                {Math.round(epcStats.overview.avgHealthScore)}%
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Average project health
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Cluster Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Cluster Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {siteStats.clusters.slice(0, 6).map((cluster) => (
                  <div key={cluster._id} className="flex justify-between items-center">
                    <div>
                      <div className="font-semibold">{cluster._id}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {cluster.count} sites • {cluster.totalCapacity.toFixed(0)} kW
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-blue-600">
                        {cluster.avgCapacity.toFixed(1)} kW
                      </div>
                      <div className="text-xs text-gray-500">avg capacity</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* EPC Project Status */}
          <Card>
            <CardHeader>
              <CardTitle>EPC Project Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {epcStats.phases.engineeringInProgress}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Engineering</div>
                    <div className="text-xs text-gray-500">
                      {Math.round(epcStats.phases.avgEngineeringProgress)}% avg
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {epcStats.phases.procurementInProgress}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Procurement</div>
                    <div className="text-xs text-gray-500">
                      {Math.round(epcStats.phases.avgProcurementProgress)}% avg
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {epcStats.phases.constructionInProgress}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Construction</div>
                    <div className="text-xs text-gray-500">
                      {Math.round(epcStats.phases.avgConstructionProgress)}% avg
                    </div>
                  </div>
                </div>
                
                {epcStats.criticalProjects.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-sm font-semibold text-red-600 mb-2">Critical Projects</h4>
                    <div className="space-y-2">
                      {epcStats.criticalProjects.slice(0, 3).map((project: ProjectData) => (
                        <div key={project.projectId} className="flex justify-between items-center p-2 bg-red-50 dark:bg-red-900/10 rounded">
                          <div className="text-sm font-medium">{project.projectName}</div>
                          <Badge variant="destructive" className="text-xs">
                            {project.healthScore}%
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Sites */}
          <Card>
            <CardHeader>
              <CardTitle>Recently Added Sites</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {siteStats.recentSites.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">No sites added yet</p>
                    <Link href="/sites/new">
                      <Button size="sm">Add First Site</Button>
                    </Link>
                  </div>
                ) : (
                  siteStats.recentSites.map((site: SiteData) => (
                    <Link key={site._id} href={`/sites/${site.id}`}>
                      <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                        <div>
                          <div className="font-semibold">{site.locationName}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">{site.address}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold text-green-600">
                            {site.feasibleCapacity} kW
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {site.status}
                          </Badge>
                        </div>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Projects */}
          <Card>
            <CardHeader>
              <CardTitle>Recent EPC Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {epcStats.recentProjects.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">No EPC projects created yet</p>
                    <Link href="/epc/projects/new">
                      <Button size="sm">Create First Project</Button>
                    </Link>
                  </div>
                ) : (
                  epcStats.recentProjects.map((project: ProjectData) => (
                    <Link key={project.projectId} href={`/epc/projects/${project.projectId}`}>
                      <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                        <div>
                          <div className="font-semibold">{project.projectName}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">{project.projectId}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold text-blue-600">
                            {project.healthScore}%
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {project.overallStatus}
                          </Badge>
                        </div>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
