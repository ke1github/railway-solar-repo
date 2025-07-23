import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getSitesWithStats } from '@/lib/actions/site-actions';
import { MapView } from '@/components/map/MapView';

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

interface RailwayStation {
  name: string;
  cluster: string;
  coordinates: [number, number]; // [lat, lng]
  sites: SiteData[];
  totalCapacity: number;
  zoneInfo: string;
}

interface SiteData {
  _id: string;
  id: string;
  serialNumber: number;
  address: string;
  latitude: number;
  longitude: number;
  sanctionedLoad: string;
  locationName: string;
  cluster: string;
  zone: string;
  consigneeDetails: string;
  rooftopArea: number;
  feasibleArea: number;
  feasibleCapacity: number;
  status: string;
  installationDate?: string;
  lastMaintenanceDate?: string;
  energyGenerated?: number;
  efficiency?: number;
}

interface MapStats {
  totalSites: number;
  totalCapacity: number;
  stationStats: Array<{
    station: string;
    cluster: string;
    count: number;
    totalCapacity: number;
    avgCapacity: number;
    coordinates: [number, number];
  }>;
  clusterStats: Array<{
    _id: string;
    count: number;
    totalCapacity: number;
    avgCapacity: number;
  }>;
  statusStats: Array<{
    _id: string;
    count: number;
    percentage: number;
  }>;
}

// Railway station coordinates and cluster mapping
const RAILWAY_STATIONS: Record<string, { coordinates: [number, number]; cluster: string; zone: string }> = {
  // Kharagpur Division
  'Kharagpur Junction': { coordinates: [22.3460, 87.3190], cluster: 'KGP', zone: 'South Eastern Railway' },
  'Midnapore': { coordinates: [22.4239, 87.3219], cluster: 'KGP', zone: 'South Eastern Railway' },
  'Jhargram': { coordinates: [22.4539, 86.9890], cluster: 'KGP', zone: 'South Eastern Railway' },
  'Belda': { coordinates: [22.1039, 87.2070], cluster: 'KGP', zone: 'South Eastern Railway' },
  
  // Balasore Division  
  'Balasore': { coordinates: [21.4942, 87.0103], cluster: 'BLS', zone: 'East Coast Railway' },
  'Bhadrak': { coordinates: [21.0542, 86.5081], cluster: 'BLS', zone: 'East Coast Railway' },
  'Jaleswar': { coordinates: [21.4075, 87.2197], cluster: 'BLS', zone: 'East Coast Railway' },
  
  // Mecheda Division
  'Mecheda': { coordinates: [22.3667, 87.8167], cluster: 'MCA', zone: 'South Eastern Railway' },
  'Tamluk': { coordinates: [22.3000, 87.9167], cluster: 'MCA', zone: 'South Eastern Railway' },
  'Haldia': { coordinates: [22.0333, 88.0667], cluster: 'HALDIA', zone: 'South Eastern Railway' },
  
  // Digha Division
  'Digha': { coordinates: [21.6667, 87.5000], cluster: 'DGHA', zone: 'South Eastern Railway' },
  'Mandarmani': { coordinates: [21.6500, 87.7833], cluster: 'DGHA', zone: 'South Eastern Railway' },
  
  // Garia Division
  'Garia': { coordinates: [22.4667, 88.3833], cluster: 'GII', zone: 'Eastern Railway' },
  'Sonarpur': { coordinates: [22.4333, 88.4000], cluster: 'GII', zone: 'Eastern Railway' },
};

function groupSitesByStation(sites: SiteData[]): RailwayStation[] {
  const stationGroups = new Map<string, SiteData[]>();
  
  // Group sites by nearest railway station
  sites.forEach(site => {
    let nearestStation = 'Other';
    let minDistance = Infinity;
    
    // Find nearest railway station based on coordinates
    Object.entries(RAILWAY_STATIONS).forEach(([stationName, stationData]) => {
      const distance = Math.sqrt(
        Math.pow(site.latitude - stationData.coordinates[0], 2) + 
        Math.pow(site.longitude - stationData.coordinates[1], 2)
      );
      
      // Also consider cluster matching for better grouping
      const clusterMatch = site.cluster === stationData.cluster;
      const adjustedDistance = clusterMatch ? distance * 0.5 : distance;
      
      if (adjustedDistance < minDistance) {
        minDistance = adjustedDistance;
        nearestStation = stationName;
      }
    });
    
    if (!stationGroups.has(nearestStation)) {
      stationGroups.set(nearestStation, []);
    }
    stationGroups.get(nearestStation)!.push(site);
  });
  
  // Convert to RailwayStation objects
  return Array.from(stationGroups.entries()).map(([stationName, stationSites]) => {
    const stationInfo = RAILWAY_STATIONS[stationName];
    const totalCapacity = stationSites.reduce((sum, site) => sum + site.feasibleCapacity, 0);
    
    return {
      name: stationName,
      cluster: stationInfo?.cluster || stationSites[0]?.cluster || 'Unknown',
      coordinates: stationInfo?.coordinates || [
        stationSites.reduce((sum, site) => sum + site.latitude, 0) / stationSites.length,
        stationSites.reduce((sum, site) => sum + site.longitude, 0) / stationSites.length
      ],
      sites: stationSites,
      totalCapacity,
      zoneInfo: stationInfo?.zone || 'Unknown Zone'
    };
  }).sort((a, b) => b.totalCapacity - a.totalCapacity);
}

export default async function EnhancedMapPage() {
  const result = await getSitesWithStats();
  
  if (!result.success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background-subtle to-background-accent">
        <div className="container mx-auto px-6 py-8">
          <div className="flex justify-center items-center min-h-[400px]">
            <Card className="p-8 text-center max-w-md">
              <h3 className="text-xl font-semibold mb-4 text-red-600">Error Loading Map Data</h3>
              <p className="text-muted-foreground mb-6">{result.error}</p>
              <Button onClick={() => window.location.reload()}>Retry</Button>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  const { sites, stats } = result;
  const railwayStations = groupSitesByStation(sites);
  
  // Calculate enhanced statistics
  const mapStats: MapStats = {
    totalSites: sites.length,
    totalCapacity: sites.reduce((sum: number, site: SiteData) => sum + site.feasibleCapacity, 0),
    stationStats: railwayStations.map(station => ({
      station: station.name,
      cluster: station.cluster,
      count: station.sites.length,
      totalCapacity: station.totalCapacity,
      avgCapacity: station.totalCapacity / station.sites.length,
      coordinates: station.coordinates
    })),
    clusterStats: stats.clusterStats || [],
    statusStats: stats.statusStats || []
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background-subtle to-background-accent">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-4xl font-bold text-foreground">
              🗺️ Railway Solar Sites Map
            </h1>
            <div className="flex gap-3">
              <Button variant="outline" size="sm">
                📊 Analytics
              </Button>
              <Button variant="outline" size="sm">
                📤 Export Data
              </Button>
            </div>
          </div>
          <p className="text-xl text-muted-foreground">
            Interactive visualization of {mapStats.totalSites} solar installations across {railwayStations.length} railway stations
          </p>
        </div>

        {/* Overview Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Sites</p>
                  <p className="text-3xl font-bold text-foreground">{mapStats.totalSites}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                  🏗️
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Railway Stations</p>
                  <p className="text-3xl font-bold text-green-600">{railwayStations.length}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                  🚂
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Capacity</p>
                  <p className="text-3xl font-bold text-purple-600">
                    {(mapStats.totalCapacity / 1000).toFixed(1)} MW
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                  ⚡
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg per Station</p>
                  <p className="text-3xl font-bold text-orange-600">
                    {Math.round(mapStats.totalCapacity / railwayStations.length)} kW
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
                  📊
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Interactive Map */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  🗺️ Interactive Railway Solar Sites Map
                  <Badge variant="secondary">{mapStats.totalSites} Sites</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-[600px] w-full">
                  <MapView 
                    sites={sites}
                    railwayStations={railwayStations}
                    stats={mapStats}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar with Station List and Filters */}
          <div className="space-y-6">
            {/* Top Railway Stations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  🚂 Top Railway Stations
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {railwayStations.slice(0, 10).map((station, index) => (
                    <div 
                      key={station.name}
                      className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors cursor-pointer"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-muted-foreground">
                            #{index + 1}
                          </span>
                          <div>
                            <div className="font-semibold text-sm">{station.name}</div>
                            <div className="text-xs text-muted-foreground">{station.cluster} • {station.zoneInfo}</div>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-blue-600">
                          {station.totalCapacity} kW
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {station.sites.length} sites
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Cluster Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  📊 Cluster Distribution
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-3">
                  {mapStats.clusterStats.map((cluster) => {
                    const percentage = (cluster.count / mapStats.totalSites) * 100;
                    return (
                      <div key={cluster._id} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{cluster._id}</span>
                          <span className="text-muted-foreground">
                            {cluster.count} sites ({percentage.toFixed(1)}%)
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Total Capacity: {cluster.totalCapacity} kW
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Status Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  ⚡ Status Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-3">
                  {mapStats.statusStats.map((status) => (
                    <div key={status._id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${
                          status._id === 'operational' ? 'bg-green-500' :
                          status._id === 'construction' ? 'bg-orange-500' :
                          status._id === 'design' ? 'bg-blue-500' :
                          status._id === 'survey' ? 'bg-purple-500' :
                          status._id === 'planning' ? 'bg-gray-500' :
                          'bg-red-500'
                        }`} />
                        <span className="text-sm font-medium capitalize">{status._id}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold">{status.count}</div>
                        <div className="text-xs text-muted-foreground">
                          {status.percentage.toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
