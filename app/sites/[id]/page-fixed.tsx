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

  useEffect(() => {
    let isMounted = true;

    const fetchSiteData = async () => {
      try {
        const resolvedParams = await paramsPromise;
        const siteId = resolvedParams.id;

        const response = await fetch(`/api/sites/${siteId}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const siteData = await response.json();
        
        if (isMounted) {
          setSite(siteData);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError('Failed to load site data');
          setLoading(false);
        }
        console.error('Error fetching site:', err);
      }
    };

    fetchSiteData();

    return () => {
      isMounted = false;
    };
  }, [paramsPromise]);

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Loading Site Details...</h1>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Card className="border-red-200">
          <CardContent className="p-6 text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">{error}</h1>
            <Link href="/sites">
              <Button variant="default">Back to Sites</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!site) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-6 text-center">
            <h1 className="text-2xl font-bold mb-4">Site not found</h1>
            <Link href="/sites">
              <Button variant="default">Back to Sites</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

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

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">Site {site.id}</h1>
          <p className="text-xl text-muted-foreground">{site.locationName}</p>
        </div>
        <div className="flex items-center gap-4">
          <Badge className={getStatusColor(site.status)}>
            {site.status.charAt(0).toUpperCase() + site.status.slice(1)}
          </Badge>
          <Link href="/sites">
            <Button variant="outline">Back to Sites</Button>
          </Link>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Site Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Site Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="font-semibold">Serial Number:</span>
                <p>{site.serialNumber}</p>
              </div>
              <div>
                <span className="font-semibold">Cluster:</span>
                <p>{site.cluster}</p>
              </div>
              <div>
                <span className="font-semibold">Zone:</span>
                <p>{site.zone}</p>
              </div>
              <div>
                <span className="font-semibold">Feasible Capacity:</span>
                <p className="text-green-600 font-bold">{site.feasibleCapacity} kW</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Location Information */}
        <Card>
          <CardHeader>
            <CardTitle>Location Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <span className="font-semibold">Address:</span>
              <p>{site.address}</p>
            </div>
            <div>
              <span className="font-semibold">Location Name:</span>
              <p>{site.locationName}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="font-semibold">Latitude:</span>
                <p>{site.latitude}°</p>
              </div>
              <div>
                <span className="font-semibold">Longitude:</span>
                <p>{site.longitude}°</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Technical Specifications */}
        <Card>
          <CardHeader>
            <CardTitle>Technical Specifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="font-semibold">Rooftop Area:</span>
                <p>{site.rooftopArea} sq.m</p>
              </div>
              <div>
                <span className="font-semibold">Feasible Area:</span>
                <p>{site.feasibleArea} sq.m</p>
              </div>
              <div>
                <span className="font-semibold">Panel Type:</span>
                <p>{site.technicalSpecs.panelType}</p>
              </div>
              <div>
                <span className="font-semibold">Inverter Type:</span>
                <p>{site.technicalSpecs.inverterType}</p>
              </div>
              <div>
                <span className="font-semibold">Mounting Type:</span>
                <p>{site.technicalSpecs.mountingType}</p>
              </div>
              <div>
                <span className="font-semibold">Tilt Angle:</span>
                <p>{site.technicalSpecs.tiltAngle}°</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="font-semibold">Energy Generated:</span>
                <p>{site.energyGenerated} kWh</p>
              </div>
              <div>
                <span className="font-semibold">Efficiency:</span>
                <p>{site.efficiency}%</p>
              </div>
              <div>
                <span className="font-semibold">Monthly Target:</span>
                <p>{site.monthlyEnergyTarget} kWh</p>
              </div>
              <div>
                <span className="font-semibold">Carbon Offset:</span>
                <p>{site.carbonOffsetKg} kg CO₂</p>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>

      {/* Additional Information */}
      <Card>
        <CardHeader>
          <CardTitle>Additional Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <span className="font-semibold">Consignee Details:</span>
            <p>{site.consigneeDetails}</p>
          </div>
          <div>
            <span className="font-semibold">Sanctioned Load:</span>
            <p>{site.sanctionedLoad || 'Not specified'}</p>
          </div>
          <div>
            <span className="font-semibold">Maintenance Schedule:</span>
            <p className="capitalize">{site.maintenanceSchedule}</p>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-center">
        <Link href={`/sites/${site.id}/design`}>
          <Button variant="outline">View Design</Button>
        </Link>
        <Link href={`/sites/${site.id}/survey`}>
          <Button variant="outline">Site Survey</Button>
        </Link>
        <Link href={`/sites/${site.id}/photos`}>
          <Button variant="outline">Photos</Button>
        </Link>
        <Link href="/sites">
          <Button>Back to All Sites</Button>
        </Link>
      </div>
    </div>
  );
}
