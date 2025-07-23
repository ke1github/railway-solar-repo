import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getSites } from '@/lib/actions/site-actions';

interface Site {
  _id: string;
  id: string;
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
  energyGenerated?: number;
  status: 'planning' | 'survey' | 'design' | 'construction' | 'operational' | 'maintenance';
}

export default async function SitesPage() {
  const result = await getSites();
  
  if (!result.success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background-subtle to-background-accent">
        <div className="container mx-auto px-6 py-8">
          <div className="flex justify-center items-center min-h-[400px]">
            <Card className="p-8 text-center max-w-md">
              <h3 className="text-xl font-semibold mb-4 text-red-600">Error Loading Sites</h3>
              <p className="text-muted-foreground mb-6">{result.error}</p>
              <Link href="/sites/new">
                <Button>Add First Site</Button>
              </Link>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  const sites: Site[] = result.sites;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background-subtle to-background-accent">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Railway Solar Sites
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage solar installations across railway infrastructure
            </p>
          </div>
          <Link href="/sites/new">
            <Button className="bg-blue-600 hover:bg-blue-700">
              Add New Site
            </Button>
          </Link>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-blue-600">
                {sites.length}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Sites</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-green-600">
                {sites.filter(site => site.status === 'operational').length}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Operational</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-orange-600">
                {sites.filter(site => site.status === 'construction').length}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">In Progress</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-purple-600">
                {sites.reduce((sum, site) => sum + (site.feasibleCapacity || 0), 0).toFixed(1)} kW
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Capacity</p>
            </CardContent>
          </Card>
        </div>

        {/* Sites Grid */}
        {sites.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🏗️</div>
            <h3 className="text-xl font-semibold mb-2">No Sites Found</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Get started by adding your first railway solar site.
            </p>
            <Link href="/sites/new">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Add Your First Site
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sites.map((site) => (
              <Card key={site._id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{site.locationName}</CardTitle>
                    <Badge variant={
                      site.status === 'operational' ? 'default' :
                      site.status === 'construction' ? 'secondary' :
                      site.status === 'planning' ? 'outline' :
                      'destructive'
                    }>
                      {site.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{site.cluster}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Capacity:</span>
                      <span className="font-semibold">{site.feasibleCapacity} kW</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Area:</span>
                      <span className="font-semibold">{site.feasibleArea} m²</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Energy:</span>
                      <span className="font-semibold">{(site.energyGenerated || 0).toLocaleString()} kWh</span>
                    </div>
                    <div className="pt-3 border-t">
                      <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                        {site.address}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex space-x-2">
                    <Link href={`/sites/${site.id}`} className="flex-1">
                      <Button variant="outline" className="w-full" size="sm">
                        View Details
                      </Button>
                    </Link>
                    <Link href={`/sites/${site.id}/edit`} className="flex-1">
                      <Button className="w-full bg-blue-600 hover:bg-blue-700" size="sm">
                        Edit
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
