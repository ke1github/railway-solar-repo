"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  findNearbySites,
  generateAIInsights,
} from "@/lib/actions/ai-project-actions";
import dynamic from "next/dynamic";
import { Input } from "@/components/ui/input";

// Create a simple Label component since the one from the UI library isn't available
const Label = ({
  htmlFor,
  children,
}: {
  htmlFor: string;
  children: React.ReactNode;
}) => (
  <label
    htmlFor={htmlFor}
    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
  >
    {children}
  </label>
);

// Define types for the nearby sites and AI insights
interface NearbySite {
  id: string;
  siteCode: string;
  name: string;
  distance: number;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  status: string;
}

interface AIInsight {
  predictedCompletionDate?: string;
  riskAssessment: "low" | "medium" | "high";
  potentialDelays: string[];
  suggestionForImprovement: string[];
  lastUpdated: string;
}

// Dynamically import the map component to avoid SSR issues
const MapWithNoSSR = dynamic(
  () => import("@/components/map/MapView").then((mod) => mod.MapView),
  {
    ssr: false,
  }
);

export default function AISiteOptimizer() {
  const [siteId, setSiteId] = useState("");
  const [distance, setDistance] = useState(50);
  const [nearbySites, setNearbySites] = useState<NearbySite[]>([]);
  const [insights, setInsights] = useState<AIInsight | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Function to search for nearby sites
  const searchNearbySites = async () => {
    if (!siteId) {
      setError("Please enter a site ID");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await findNearbySites(siteId, distance);

      if (result.success) {
        setNearbySites((result.nearbySites || []) as NearbySite[]);
      } else {
        setError(result.error || "Failed to find nearby sites");
      }
    } catch (error) {
      setError("An error occurred while searching for nearby sites");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Function to generate AI insights for a site
  const generateInsights = async () => {
    if (!siteId) {
      setError("Please enter a site ID");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await generateAIInsights(siteId);

      if (result.success) {
        setInsights(result.aiInsights);
      } else {
        setError(result.error || "Failed to generate AI insights");
      }
    } catch (error) {
      setError("An error occurred while generating AI insights");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background-subtle to-background-accent">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              AI Site Optimizer
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Optimize survey routes and get AI-powered insights for your solar
              projects
            </p>
          </div>
          <Link href="/ai">
            <Button className="bg-blue-600 hover:bg-blue-700">
              Back to AI Dashboard
            </Button>
          </Link>
        </div>

        {/* Input Controls */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label htmlFor="siteId">Site ID or Code</Label>
                <Input
                  id="siteId"
                  value={siteId}
                  onChange={(e) => setSiteId(e.target.value)}
                  placeholder="Enter site ID or code"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="distance">Search Distance (km)</Label>
                <Input
                  id="distance"
                  type="number"
                  value={distance}
                  onChange={(e) => setDistance(Number(e.target.value))}
                  min={1}
                  max={500}
                  className="mt-1"
                />
              </div>
              <div className="flex items-end gap-4">
                <Button
                  className="flex-1"
                  onClick={searchNearbySites}
                  disabled={loading || !siteId}
                >
                  {loading ? "Searching..." : "Find Nearby Sites"}
                </Button>
                <Button
                  className="flex-1"
                  variant="outline"
                  onClick={generateInsights}
                  disabled={loading || !siteId}
                >
                  Generate AI Insights
                </Button>
              </div>
            </div>

            {error && (
              <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-md">
                {error}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Map View */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Site Map Visualization</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[600px] rounded-md overflow-hidden border">
                  <MapWithNoSSR
                    sites={[]}
                    railwayStations={[]}
                    stats={{
                      totalSites: 0,
                      totalCapacity: 0,
                      stationStats: [],
                      clusterStats: [],
                      statusStats: [],
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results Panel */}
          <div className="space-y-6">
            {/* Nearby Sites */}
            <Card>
              <CardHeader>
                <CardTitle>
                  Nearby Sites
                  {nearbySites.length > 0 && (
                    <Badge className="ml-2 bg-blue-500">
                      {nearbySites.length}
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="max-h-[300px] overflow-y-auto">
                {nearbySites.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    {loading
                      ? "Searching for sites..."
                      : "No nearby sites found"}
                  </p>
                ) : (
                  <ul className="space-y-3">
                    {nearbySites.map((site: NearbySite) => (
                      <li key={site.id} className="border-b pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium">{site.name}</div>
                            <div className="text-sm text-muted-foreground">
                              ID: {site.siteCode}
                            </div>
                          </div>
                          <Badge>{site.distance.toFixed(1)} km</Badge>
                        </div>
                        <div className="flex justify-between mt-2">
                          <span className="text-xs text-muted-foreground">
                            Status: {site.status}
                          </span>
                          <Link href={`/sites/${site.siteCode}`}>
                            <Button size="sm" variant="outline">
                              View
                            </Button>
                          </Link>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>

            {/* AI Insights */}
            <Card>
              <CardHeader>
                <CardTitle>AI Project Insights</CardTitle>
              </CardHeader>
              <CardContent>
                {!insights ? (
                  <p className="text-muted-foreground text-center py-8">
                    {loading
                      ? "Generating insights..."
                      : "No insights generated yet"}
                  </p>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">
                        Risk Assessment
                      </div>
                      <Badge
                        className={
                          insights.riskAssessment === "low"
                            ? "bg-green-500"
                            : insights.riskAssessment === "medium"
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }
                      >
                        {insights.riskAssessment.toUpperCase()} RISK
                      </Badge>
                    </div>

                    <div>
                      <div className="text-sm font-medium text-muted-foreground">
                        Predicted Completion
                      </div>
                      {insights.predictedCompletionDate && (
                        <div className="font-medium">
                          {new Date(
                            insights.predictedCompletionDate
                          ).toLocaleDateString()}
                        </div>
                      )}
                    </div>

                    {insights.potentialDelays &&
                      insights.potentialDelays.length > 0 && (
                        <div>
                          <div className="text-sm font-medium text-muted-foreground">
                            Potential Delays
                          </div>
                          <ul className="list-disc pl-5 text-sm">
                            {insights.potentialDelays.map(
                              (delay: string, idx: number) => (
                                <li key={idx} className="text-red-600">
                                  {delay}
                                </li>
                              )
                            )}
                          </ul>
                        </div>
                      )}

                    {insights.suggestionForImprovement &&
                      insights.suggestionForImprovement.length > 0 && (
                        <div>
                          <div className="text-sm font-medium text-muted-foreground">
                            Suggestions
                          </div>
                          <ul className="list-disc pl-5 text-sm">
                            {insights.suggestionForImprovement.map(
                              (suggestion: string, idx: number) => (
                                <li key={idx} className="text-blue-600">
                                  {suggestion}
                                </li>
                              )
                            )}
                          </ul>
                        </div>
                      )}

                    <div className="text-xs text-right text-muted-foreground">
                      Last updated:{" "}
                      {new Date(insights.lastUpdated).toLocaleString()}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex gap-4">
              <Button className="flex-1">Generate Optimal Route</Button>
              <Button variant="outline" className="flex-1">
                Export Report
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
