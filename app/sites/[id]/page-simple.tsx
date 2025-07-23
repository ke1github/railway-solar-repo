'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Site {
  _id: string;
  id: string;
  serialNumber: number;
  address: string;
  locationName: string;
  cluster: string;
  feasibleCapacity: number;
  status: string;
}

interface SiteDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function SiteDetailPageSimple({ params: paramsPromise }: SiteDetailPageProps) {
  const [site, setSite] = useState<Site | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSite = async () => {
      try {
        const { id } = await paramsPromise;
        const response = await fetch(`/api/sites/${id}`);
        
        if (!response.ok) {
          throw new Error('Failed to load site');
        }
        
        const siteData = await response.json();
        setSite(siteData);
      } catch (err) {
        setError('Failed to load site data');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadSite();
  }, [paramsPromise]);

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Loading Site Details...</h1>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center text-red-600">
          <h1 className="text-2xl font-bold mb-4">{error}</h1>
        </div>
      </div>
    );
  }

  if (!site) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Site not found</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Site {site.id}</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>{site.locationName}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <strong>Address:</strong> {site.address}
            </div>
            <div>
              <strong>Cluster:</strong> {site.cluster}
            </div>
            <div>
              <strong>Capacity:</strong> {site.feasibleCapacity} kW
            </div>
            <div>
              <strong>Status:</strong> 
              <Badge className="ml-2">{site.status}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
