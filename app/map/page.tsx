'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";


interface Site {
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
}

interface Stats {
  totalSites: number;
  totalCapacity: number;
  clusterStats: Array<{
    _id: string;
    count: number;
    totalCapacity: number;
  }>;
}

// Simple map component since we don't have leaflet/mapbox
function SimpleMap({ sites }: { sites: Site[] }) {
  const [selectedSite, setSelectedSite] = useState<Site | null>(null);

  // Map bounds for Railway Network
  const MAP_BOUNDS = {
    north: 23.0,
    south: 21.0,
    east: 88.5,
    west: 86.0
  };

  // Convert lat/lng to screen coordinates
  const getScreenPosition = (lat: number, lng: number) => {
    const x = ((lng - MAP_BOUNDS.west) / (MAP_BOUNDS.east - MAP_BOUNDS.west)) * 100;
    const y = ((MAP_BOUNDS.north - lat) / (MAP_BOUNDS.north - MAP_BOUNDS.south)) * 100;
    return { x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) };
  };

  const getClusterColor = (cluster: string) => {
    const colors = {
      "KGP": "#f97316",
      "MCA": "#3b82f6",
      "BLS": "#22c55e",
      "GII": "#8b5cf6",
      "HALDIA": "#f59e0b",
      "DGHA": "#ec4899",
      "KGP 2": "#f97316"
    };
    return colors[cluster as keyof typeof colors] || "#6b7280";
  };

  return (
    <div className="relative w-full h-full bg-background-subtle rounded-lg overflow-hidden">
      {/* Map background */}
      <div className="absolute inset-0 bg-gradient-to-br from-muted to-background-accent">
        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-20">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgb(var(--border))" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
      </div>

      {/* Site markers */}
      {sites.map((site) => {
        const position = getScreenPosition(site.latitude, site.longitude);
        const color = getClusterColor(site.cluster);
        const size = Math.max(8, Math.min(20, site.feasibleCapacity / 2));

        return (
          <div
            key={site._id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer hover:scale-125 transition-transform"
            style={{
              left: `${position.x}%`,
              top: `${position.y}%`,
            }}
            onClick={() => setSelectedSite(site)}
          >
            <div
              className="rounded-full border-2 border-white shadow-lg"
              style={{
                backgroundColor: color,
                width: `${size}px`,
                height: `${size}px`,
              }}
              title={`${site.locationName} - ${site.feasibleCapacity} kW`}
            />
          </div>
        );
      })}

      {/* Site info popup */}
      {selectedSite && (
        <div className="absolute bottom-4 left-4 right-4 bg-card p-4 rounded-lg shadow-lg border z-10">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-lg text-card-foreground">{selectedSite.locationName}</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedSite(null)}
            >
              ×
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mb-2">
            {selectedSite.address}
          </p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Capacity:</span>
              <p>{selectedSite.feasibleCapacity} kW</p>
            </div>
            <div>
              <span className="font-medium">Area:</span>
              <p>{selectedSite.feasibleArea} m²</p>
            </div>
            <div>
              <span className="font-medium">Cluster:</span>
              <p>{selectedSite.cluster}</p>
            </div>
            <div>
              <span className="font-medium">Status:</span>
              <Badge variant="outline">{selectedSite.status}</Badge>
            </div>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="absolute top-4 right-4 bg-card p-3 rounded-lg shadow-lg">
        <h4 className="font-medium text-sm mb-2 text-card-foreground">Clusters</h4>
        <div className="space-y-1">
          {["KGP", "BLS", "GII", "MCA", "HALDIA", "DGHA"].map((cluster) => (
            <div key={cluster} className="flex items-center gap-2 text-xs text-card-foreground">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: getClusterColor(cluster) }}
              />
              <span>{cluster}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function MapPage() {
  const [sites, setSites] = useState<Site[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [selectedCluster, setSelectedCluster] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [sitesResponse, statsResponse] = await Promise.all([
        fetch('/api/sites'),
        fetch('/api/stats')
      ]);

      if (!sitesResponse.ok || !statsResponse.ok) {
        throw new Error('Failed to fetch data');
      }

      const sitesData = await sitesResponse.json();
      const statsData = await statsResponse.json();

      setSites(sitesData.sites || []);
      setStats(statsData);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load map data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filteredSites = sites.filter(site => {
    const matchesSearch = site.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         site.locationName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCluster = selectedCluster === 'all' || site.cluster === selectedCluster;
    return matchesSearch && matchesCluster;
  });

  const clusters = stats?.clusterStats.map(stat => stat._id) || [];

  if (loading) {
    return (
      <div className="min-h-screen bg-neural bg-mesh-ultra bg-grain">
        <div className="container-outstanding">
          
          {/* Ultra-Modern Header */}
          <section className="section-spacing">
            <div className="text-center mb-16">
              <div className="text-label mb-6 fade-in">
                🗺️ Neural Map Interface
              </div>
              <h1 className="text-hero mb-8 fade-in-delayed">
                Solar Site Grid Map
              </h1>
              <p className="text-muted text-lg max-w-2xl mx-auto slide-in">
                Interactive visualization of railway solar installations
              </p>
            </div>
          </section>

          {/* Loading Message */}
          <section className="section-spacing">
            <div className="text-center">
              <div className="card-neural p-12">
                <div className="text-6xl mb-6 float">🧠</div>
                <h2 className="heading-2 mb-4 pulse-glow">
                  Neural Map Loading
                </h2>
                <div className="text-muted mb-8">
                  Initializing geospatial neural network...
                </div>
                <div className="w-16 h-16 mx-auto border-4 border-accent/20 border-t-accent rounded-full rotate-slow"></div>
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-neural bg-mesh-ultra bg-grain">
        <div className="container-outstanding">
          <section className="section-spacing">
            <div className="text-center">
              <div className="card-neural p-12">
                <div className="text-6xl mb-6">⚠️</div>
                <h2 className="heading-2 mb-4 text-gradient">
                  Neural Grid Error
                </h2>
                <div className="text-muted mb-8">{error}</div>
                <button onClick={fetchData} className="btn-primary">
                  Reconnect Neural Grid
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neural bg-mesh-ultra bg-grain">
      <div className="container-outstanding">
        
        {/* Ultra-Modern Header */}
        <section className="section-spacing">
          <div className="text-center mb-16">
            <div className="text-label mb-6 fade-in">
              🗺️ Neural Map Interface
            </div>
            <h1 className="text-hero mb-8 fade-in-delayed">
              Solar Site Grid Map
            </h1>
            <p className="text-muted text-lg max-w-2xl mx-auto slide-in">
              Interactive visualization of {stats?.totalSites || 0} railway solar installations
            </p>
          </div>

          {/* Neural Filters */}
          <div className="max-w-4xl mx-auto">
            <div className="card-neural p-6 mb-8">
              <input
                placeholder="🔍 Search neural grid locations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-transparent border-0 text-lg placeholder:text-muted focus:outline-none mb-6"
              />
              
              <div className="flex flex-wrap gap-3">
                <button
                  className={`px-6 py-3 rounded-full font-medium transition-all ${
                    selectedCluster === 'all' 
                      ? 'bg-gradient-primary text-background shadow-glow' 
                      : 'card-glow text-foreground magnetic'
                  }`}
                  onClick={() => setSelectedCluster('all')}
                >
                  All Clusters ({sites.length})
                </button>
                {clusters.map(cluster => {
                  const clusterStat = stats?.clusterStats.find(s => s._id === cluster);
                  return (
                    <button
                      key={cluster}
                      className={`px-6 py-3 rounded-full font-medium transition-all ${
                        selectedCluster === cluster 
                          ? 'bg-gradient-secondary text-background shadow-glow' 
                          : 'card-glow text-foreground magnetic'
                      }`}
                      onClick={() => setSelectedCluster(cluster)}
                    >
                      {cluster} ({clusterStat?.count || 0})
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">{filteredSites.length}</p>
            <p className="text-sm text-muted-foreground">Sites Shown</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-green-600">
              {filteredSites.reduce((sum, site) => sum + site.feasibleCapacity, 0).toFixed(1)} kW
            </p>
            <p className="text-sm text-muted-foreground">Total Capacity</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-purple-600">
              {filteredSites.reduce((sum, site) => sum + site.feasibleArea, 0).toLocaleString()} m²
            </p>
            <p className="text-sm text-muted-foreground">Total Area</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-orange-600">
              {new Set(filteredSites.map(site => site.cluster)).size}
            </p>
            <p className="text-sm text-muted-foreground">Active Clusters</p>
          </CardContent>
        </Card>
      </div>

      {/* Interactive Map */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Interactive Solar Sites Map</span>
            <Badge variant="secondary">
              {selectedCluster === 'all' ? 'All Clusters' : `${selectedCluster} Cluster`}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[600px]">
            <SimpleMap sites={filteredSites} />
          </div>
        </CardContent>
      </Card>

      {/* Search Results */}
      {searchTerm && (
        <Card>
          <CardHeader>
            <CardTitle>Search Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSites.slice(0, 6).map((site) => (
                <Card key={site._id} className="border">
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-sm truncate">
                          {site.locationName}
                        </h4>
                        <Badge variant="outline" className="text-xs">
                          {site.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        {site.address}
                      </p>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="font-medium">Capacity:</span>
                          <p>{site.feasibleCapacity} kW</p>
                        </div>
                        <div>
                          <span className="font-medium">Cluster:</span>
                          <p>{site.cluster}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      </div>
    </div>
  );
}
