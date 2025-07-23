'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from 'next/link';

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
  installationDate?: string;
  lastMaintenanceDate?: string;
  energyGenerated: number;
  efficiency: number;
  monthlyEnergyTarget: number;
  carbonOffsetKg: number;
  maintenanceSchedule: string;
  technicalSpecs: {
    panelType: string;
    inverterType: string;
    mountingType: string;
    tiltAngle: number;
  };
  createdAt: string;
  updatedAt: string;
}

interface SiteDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function SiteDetailPage({ params: paramsPromise }: SiteDetailPageProps) {
  const [site, setSite] = useState<Site | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [siteId, setSiteId] = useState<string | null>(null);

  useEffect(() => {
    const resolveParams = async () => {
      try {
        const resolvedParams = await paramsPromise;
        setSiteId(resolvedParams.id);
      } catch (err) {
        console.error('Error resolving params:', err);
        setError('Failed to load page parameters');
        setLoading(false);
      }
    };
    resolveParams();
  }, [paramsPromise]);

  useEffect(() => {
    if (siteId) {
      fetchSite(siteId);
    }
  }, [siteId]);

  const fetchSite = async (siteId: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/sites/${siteId}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          setError('Site not found');
        } else {
          setError('Failed to load site data');
        }
        return;
      }

      const data = await response.json();
      setSite(data); // API returns site data directly
    } catch (err) {
      console.error('Error fetching site:', err);
      setError('Failed to load site data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neural bg-mesh-ultra bg-grain">
        <div className="container-outstanding">
          <section className="section-spacing">
            <div className="text-center">
              <div className="card-neural p-12">
                <div className="text-6xl mb-6 float">🏗️</div>
                <h1 className="text-hero mb-6 pulse-glow">
                  Loading Neural Site Data
                </h1>
                <div className="text-muted mb-8">
                  Accessing site information...
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
                <h1 className="text-hero mb-6 text-gradient">
                  Neural Grid Error
                </h1>
                <div className="text-muted mb-8">{error}</div>
                <div className="flex justify-center space-x-4">
                  <button 
                    onClick={() => fetchSite(siteId || '')} 
                    className="btn-primary"
                  >
                    Reconnect
                  </button>
                  <Link href="/sites" className="btn-secondary">
                    Back to Grid
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }

  if (!site) {
    return null;
  }

  // Helper functions
  const getStatusColor = (status: string) => {
    const colors = {
      'planning': 'bg-yellow-100 text-yellow-800',
      'survey': 'bg-blue-100 text-blue-800',
      'design': 'bg-purple-100 text-purple-800',
      'construction': 'bg-orange-100 text-orange-800',
      'operational': 'bg-green-100 text-green-800',
      'maintenance': 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-neural bg-mesh-ultra bg-grain">
      <div className="container-outstanding">
        
        {/* Ultra-Modern Header */}
        <section className="section-spacing">
          <div className="text-center mb-12">
            <div className="text-label mb-6 fade-in">
              🏗️ Neural Site Interface
            </div>
            <h1 className="text-hero mb-4 fade-in-delayed">
              {site.locationName}
            </h1>
            <p className="text-muted text-lg max-w-2xl mx-auto slide-in">
              {site.address}
            </p>
          </div>

          {/* Neural Status and Actions */}
          <div className="flex flex-wrap justify-center gap-6 mb-12">
            <div className={`px-6 py-3 rounded-full font-medium ${
              site.status === 'operational' 
                ? 'bg-gradient-primary text-background shadow-glow' 
                : site.status === 'maintenance'
                ? 'bg-gradient-secondary text-background shadow-glow'
                : 'card-glow text-foreground'
            }`}>
              {site.status.charAt(0).toUpperCase() + site.status.slice(1)}
            </div>
            
            <Link href="/sites" className="btn-secondary">
              ← Back to Grid
            </Link>
          </div>
        </section>

      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <Link href="/sites">
              <Button variant="outline" size="sm">
                ← Back to Sites
              </Button>
            </Link>
            <Badge className={getStatusColor(site.status)}>
              {site.status.toUpperCase()}
            </Badge>
          </div>
          <h1 className="text-4xl font-bold">{site.locationName}</h1>
          <p className="text-xl text-muted-foreground">{site.address}</p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-green-600">{site.feasibleCapacity} kW</div>
          <div className="text-sm text-muted-foreground">Feasible Capacity</div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Site Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Site Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Site ID</div>
                  <div className="text-lg font-semibold">{site.id}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Serial No.</div>
                  <div className="text-lg font-semibold">{site.serialNumber}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Cluster</div>
                  <div className="text-lg font-semibold">{site.cluster}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Zone</div>
                  <div className="text-lg font-semibold">{site.zone}</div>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <div className="text-sm font-medium text-muted-foreground mb-2">Consignee Details</div>
                <div>{site.consigneeDetails}</div>
              </div>

              <div className="border-t pt-4">
                <div className="text-sm font-medium text-muted-foreground mb-2">Sanctioned Load</div>
                <div>{site.sanctionedLoad || 'Not specified'}</div>
              </div>
            </CardContent>
          </Card>

          {/* Technical Specifications */}
          <Card>
            <CardHeader>
              <CardTitle>Technical Specifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Panel Type</div>
                    <div className="text-lg">{site.technicalSpecs.panelType}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Inverter Type</div>
                    <div className="text-lg">{site.technicalSpecs.inverterType}</div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Mounting Type</div>
                    <div className="text-lg">{site.technicalSpecs.mountingType}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Tilt Angle</div>
                    <div className="text-lg">{site.technicalSpecs.tiltAngle}°</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Location & Map */}
          <Card>
            <CardHeader>
              <CardTitle>Location</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Coordinates</div>
                    <div className="text-lg">
                      {site.latitude.toFixed(6)}, {site.longitude.toFixed(6)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Address</div>
                    <div className="text-lg">{site.address}</div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-lg p-6 text-center">
                  <div className="text-4xl mb-2">📍</div>
                  <div className="text-sm text-muted-foreground">Interactive map would be here</div>
                  <div className="text-xs text-muted-foreground mt-2">
                    Lat: {site.latitude.toFixed(4)}, Lng: {site.longitude.toFixed(4)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Stats & Actions */}
        <div className="space-y-6">
          {/* Capacity & Area */}
          <Card>
            <CardHeader>
              <CardTitle>Capacity & Area</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{site.feasibleCapacity} kW</div>
                <div className="text-sm text-muted-foreground">Feasible Capacity</div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="text-xl font-bold text-blue-600">{site.rooftopArea}</div>
                  <div className="text-xs text-muted-foreground">Total Area (m²)</div>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <div className="text-xl font-bold text-purple-600">{site.feasibleArea}</div>
                  <div className="text-xs text-muted-foreground">Feasible Area (m²)</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>Performance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm font-medium text-muted-foreground">Energy Generated</div>
                <div className="text-2xl font-bold text-orange-600">{site.energyGenerated} kWh</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">System Efficiency</div>
                <div className="text-2xl font-bold text-green-600">{site.efficiency}%</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">Monthly Target</div>
                <div className="text-xl font-bold">{site.monthlyEnergyTarget.toFixed(0)} kWh</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">Carbon Offset</div>
                <div className="text-xl font-bold text-green-600">{site.carbonOffsetKg.toFixed(1)} kg CO₂</div>
              </div>
            </CardContent>
          </Card>

          {/* Maintenance */}
          <Card>
            <CardHeader>
              <CardTitle>Maintenance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm font-medium text-muted-foreground">Schedule</div>
                <div className="text-lg font-semibold capitalize">{site.maintenanceSchedule}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">Installation Date</div>
                <div className="text-lg">{formatDate(site.installationDate)}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">Last Maintenance</div>
                <div className="text-lg">{formatDate(site.lastMaintenanceDate)}</div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href={`/sites/${site.id}/survey`}>
                <Button className="w-full" variant="outline">
                  📋 Survey Details
                </Button>
              </Link>
              <Link href={`/sites/${site.id}/design`}>
                <Button className="w-full" variant="outline">
                  🏗️ Design Specs
                </Button>
              </Link>
              <Link href={`/sites/${site.id}/photos`}>
                <Button className="w-full" variant="outline">
                  📸 Photo Gallery
                </Button>
              </Link>
              <Link href={`/sites/${site.id}/delivery`}>
                <Button className="w-full" variant="outline">
                  🚚 Delivery Status
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Metadata */}
          <Card>
            <CardHeader>
              <CardTitle>Record Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div>
                <span className="font-medium">Created:</span> {formatDate(site.createdAt)}
              </div>
              <div>
                <span className="font-medium">Updated:</span> {formatDate(site.updatedAt)}
              </div>
              <div>
                <span className="font-medium">Record ID:</span> 
                <code className="ml-2 text-xs bg-gray-100 px-1 rounded">{site._id}</code>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      </div>
    </div>
  );
}
