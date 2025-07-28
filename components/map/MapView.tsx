"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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

interface RailwayStation {
  name: string;
  cluster: string;
  coordinates: [number, number];
  sites: SiteData[];
  totalCapacity: number;
  zoneInfo: string;
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

interface MapViewProps {
  sites: SiteData[];
  railwayStations: RailwayStation[];
  stats: MapStats;
}

interface MapTooltip {
  visible: boolean;
  x: number;
  y: number;
  content: {
    item: RailwayStation | SiteData;
    type: "station" | "site";
  } | null;
}

export function MapView({ sites, railwayStations, stats }: MapViewProps) {
  const [selectedStation, setSelectedStation] = useState<RailwayStation | null>(
    null
  );
  const [selectedCluster, setSelectedCluster] = useState<string>("all");
  const [mapMode, setMapMode] = useState<"stations" | "sites">("stations");
  const [tooltip, setTooltip] = useState<MapTooltip>({
    visible: false,
    x: 0,
    y: 0,
    content: null,
  });
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [selectedZone, setSelectedZone] = useState<string[]>([]);
  const [capacityRange, setCapacityRange] = useState<[number, number]>([
    0, 10000,
  ]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [mapStyle, setMapStyle] = useState<"default" | "satellite" | "street">(
    "default"
  );
  const [showHeatmap, setShowHeatmap] = useState<boolean>(false);
  const [showClustering, setShowClustering] = useState<boolean>(false);

  // Map bounds for Indian Railway Network (approximate)
  const MAP_BOUNDS = {
    north: 35.0,
    south: 8.0,
    east: 97.0,
    west: 68.0,
  };

  // Convert lat/lng to screen coordinates
  const getScreenPosition = (lat: number, lng: number) => {
    const x =
      ((lng - MAP_BOUNDS.west) / (MAP_BOUNDS.east - MAP_BOUNDS.west)) * 100;
    const y =
      ((MAP_BOUNDS.north - lat) / (MAP_BOUNDS.north - MAP_BOUNDS.south)) * 100;
    return {
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(0, Math.min(100, y)),
    };
  };

  const getClusterColor = (cluster: string) => {
    const colors = {
      KGP: "#f97316",
      MCA: "#3b82f6",
      BLS: "#22c55e",
      GII: "#8b5cf6",
      HALDIA: "#f59e0b",
      DGHA: "#ec4899",
      "KGP 2": "#ff6b35",
    };
    return colors[cluster as keyof typeof colors] || "#6b7280";
  };

  const getStatusColor = (status: string) => {
    const colors = {
      operational: "#22c55e",
      construction: "#f97316",
      design: "#3b82f6",
      survey: "#8b5cf6",
      planning: "#6b7280",
      maintenance: "#ef4444",
    };
    return colors[status as keyof typeof colors] || "#6b7280";
  };

  // Enhanced filtering logic
  const filteredStations = railwayStations.filter(
    (station) =>
      (selectedCluster === "all" || station.cluster === selectedCluster) &&
      (selectedZone.length === 0 || selectedZone.includes(station.zoneInfo)) &&
      (searchTerm === "" ||
        station.name.toLowerCase().includes(searchTerm.toLowerCase())) &&
      station.totalCapacity >= capacityRange[0] &&
      station.totalCapacity <= capacityRange[1]
  );

  const filteredSites = sites.filter(
    (site) =>
      (selectedCluster === "all" || site.cluster === selectedCluster) &&
      (selectedZone.length === 0 || selectedZone.includes(site.zone)) &&
      (selectedStatus.length === 0 || selectedStatus.includes(site.status)) &&
      (searchTerm === "" ||
        site.locationName.toLowerCase().includes(searchTerm.toLowerCase())) &&
      site.feasibleCapacity >= capacityRange[0] &&
      site.feasibleCapacity <= capacityRange[1]
  );

  const handleMouseEnter = (
    event: React.MouseEvent,
    item: RailwayStation | SiteData,
    type: "station" | "site"
  ) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const container = (event.currentTarget as HTMLElement)
      .offsetParent as HTMLElement;
    const containerRect = container?.getBoundingClientRect();

    if (containerRect) {
      setTooltip({
        visible: true,
        x: rect.left - containerRect.left + rect.width / 2,
        y: rect.top - containerRect.top,
        content: { item, type },
      });
    }

    if (type === "station") {
      setHoveredItem(`station-${(item as RailwayStation).name}`);
    } else {
      setHoveredItem(`site-${(item as SiteData)._id}`);
    }
  };

  const handleMouseLeave = () => {
    setTooltip({ visible: false, x: 0, y: 0, content: null });
    setHoveredItem(null);
  };

  return (
    <div className="w-full h-full relative bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 rounded-lg overflow-hidden">
      {/* Map Controls */}
      <div className="absolute top-4 left-4 z-20 flex flex-col gap-2 w-72 max-w-full">
        <div className="bg-card/95 backdrop-blur-sm rounded-lg p-3 shadow-lg border space-y-3">
          {/* Search Bar */}
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search sites or stations..."
            className="w-full text-xs bg-background border border-border rounded px-2 py-1 mb-2"
            aria-label="Search"
          />
          {/* Cluster Filter */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">
              Filter by Cluster:
            </label>
            <select
              value={selectedCluster}
              onChange={(e) => setSelectedCluster(e.target.value)}
              className="w-full text-xs bg-background border border-border rounded px-2 py-1"
            >
              <option value="all">All Clusters</option>
              {stats.clusterStats.map((cluster) => (
                <option key={cluster._id} value={cluster._id}>
                  {cluster._id} ({cluster.count})
                </option>
              ))}
            </select>
          </div>
          {/* Status Filter */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">
              Filter by Status:
            </label>
            <select
              multiple
              value={selectedStatus}
              onChange={(e) =>
                setSelectedStatus(
                  Array.from(e.target.selectedOptions, (opt) => opt.value)
                )
              }
              className="w-full text-xs bg-background border border-border rounded px-2 py-1"
            >
              {stats.statusStats.map((status) => (
                <option key={status._id} value={status._id}>
                  {status._id}
                </option>
              ))}
            </select>
          </div>
          {/* Zone Filter */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">
              Filter by Zone:
            </label>
            <select
              multiple
              value={selectedZone}
              onChange={(e) =>
                setSelectedZone(
                  Array.from(e.target.selectedOptions, (opt) => opt.value)
                )
              }
              className="w-full text-xs bg-background border border-border rounded px-2 py-1"
            >
              {[...new Set(sites.map((site) => site.zone))].map((zone) => (
                <option key={zone} value={zone}>
                  {zone}
                </option>
              ))}
            </select>
          </div>
          {/* Capacity Range Filter */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">
              Capacity Range (kW):
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                min={0}
                max={capacityRange[1]}
                value={capacityRange[0]}
                onChange={(e) =>
                  setCapacityRange([Number(e.target.value), capacityRange[1]])
                }
                className="w-1/2 text-xs bg-background border border-border rounded px-2 py-1"
                aria-label="Min Capacity"
              />
              <input
                type="number"
                min={capacityRange[0]}
                value={capacityRange[1]}
                onChange={(e) =>
                  setCapacityRange([capacityRange[0], Number(e.target.value)])
                }
                className="w-1/2 text-xs bg-background border border-border rounded px-2 py-1"
                aria-label="Max Capacity"
              />
            </div>
          </div>
          {/* Map Style Dropdown */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">
              Map Style:
            </label>
            <select
              value={mapStyle}
              onChange={(e) =>
                setMapStyle(
                  e.target.value as "default" | "satellite" | "street"
                )
              }
              className="w-full text-xs bg-background border border-border rounded px-2 py-1"
            >
              <option value="default">Default</option>
              <option value="satellite">Satellite</option>
              <option value="street">Street</option>
            </select>
          </div>
          {/* Heatmap & Clustering Toggles */}
          <div className="flex gap-2 items-center">
            <label className="text-xs font-medium text-muted-foreground">
              Heatmap
            </label>
            <input
              type="checkbox"
              checked={showHeatmap}
              onChange={(e) => setShowHeatmap(e.target.checked)}
            />
            <label className="text-xs font-medium text-muted-foreground">
              Clustering
            </label>
            <input
              type="checkbox"
              checked={showClustering}
              onChange={(e) => setShowClustering(e.target.checked)}
            />
          </div>
          {/* Analytics & Export Buttons */}
          <div className="flex gap-2 mt-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => alert("Analytics coming soon!")}
            >
              📊 Analytics
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => alert("CSV export coming soon!")}
            >
              ⬇️ Export CSV
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => alert("PDF export coming soon!")}
            >
              ⬇️ Export PDF
            </Button>
          </div>
        </div>
      </div>
      {/* Collaboration Sidebar Placeholder */}
      <div className="absolute left-0 top-0 h-full w-16 z-30 bg-card/80 backdrop-blur-sm flex flex-col items-center py-4 gap-4 border-r">
        <Button size="icon" variant="ghost" title="Tasks">
          📝
        </Button>
        <Button size="icon" variant="ghost" title="Comments">
          💬
        </Button>
        <Button size="icon" variant="ghost" title="Alerts">
          🔔
        </Button>
      </div>

      {/* Map Legend */}
      <div className="absolute top-4 right-4 z-20 bg-card/95 backdrop-blur-sm rounded-lg p-3 shadow-lg border">
        <h4 className="text-sm font-semibold mb-2">Legend</h4>
        <div className="space-y-2">
          {mapMode === "stations" ? (
            <>
              <div className="text-xs text-muted-foreground mb-2">
                Railway Stations by Cluster
              </div>
              {stats.clusterStats
                .filter(
                  (cluster) =>
                    selectedCluster === "all" || cluster._id === selectedCluster
                )
                .map((cluster) => (
                  <div
                    key={cluster._id}
                    className="flex items-center gap-2 text-xs"
                  >
                    <div
                      className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                      style={{ backgroundColor: getClusterColor(cluster._id) }}
                    />
                    <span>{cluster._id}</span>
                    <span className="text-muted-foreground">
                      ({cluster.count})
                    </span>
                  </div>
                ))}
            </>
          ) : (
            <>
              <div className="text-xs text-muted-foreground mb-2">
                Sites by Status
              </div>
              {stats.statusStats.map((status) => (
                <div
                  key={status._id}
                  className="flex items-center gap-2 text-xs"
                >
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: getStatusColor(status._id) }}
                  />
                  <span className="capitalize">{status._id}</span>
                  <span className="text-muted-foreground">
                    ({status.count})
                  </span>
                </div>
              ))}
            </>
          )}
        </div>
      </div>

      {/* Map Background with Grid */}
      <div className="absolute inset-0">
        <div className="w-full h-full bg-gradient-to-br from-blue-50/30 to-green-50/30 dark:from-blue-950/30 dark:to-green-950/30">
          {/* Grid overlay */}
          <svg
            className="absolute inset-0 w-full h-full opacity-10"
            preserveAspectRatio="none"
          >
            <defs>
              <pattern
                id="grid"
                width="50"
                height="50"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 50 0 L 0 0 0 50"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>

          {/* Railway network lines (simplified) */}
          <svg
            className="absolute inset-0 w-full h-full opacity-20"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient
                id="railGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
            {/* Major railway corridors */}
            <path
              d="M20,80 Q40,60 60,70 Q80,50 90,30"
              fill="none"
              stroke="url(#railGradient)"
              strokeWidth="2"
              strokeDasharray="5,5"
            />
            <path
              d="M10,50 Q30,40 50,45 Q70,35 85,25"
              fill="none"
              stroke="url(#railGradient)"
              strokeWidth="2"
              strokeDasharray="5,5"
            />
            <path
              d="M25,90 Q45,75 65,80 Q85,65 95,45"
              fill="none"
              stroke="url(#railGradient)"
              strokeWidth="2"
              strokeDasharray="5,5"
            />
          </svg>
        </div>
      </div>

      {/* Railway Stations */}
      {mapMode === "stations" &&
        filteredStations.map((station) => {
          const position = getScreenPosition(
            station.coordinates[0],
            station.coordinates[1]
          );
          const color = getClusterColor(station.cluster);
          const size = Math.max(
            12,
            Math.min(32, station.totalCapacity / 500 + 12)
          );
          const isHovered = hoveredItem === `station-${station.name}`;

          return (
            <div
              key={station.name}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200 z-10 ${
                isHovered ? "scale-125 z-30" : "hover:scale-110"
              }`}
              style={{
                left: `${position.x}%`,
                top: `${position.y}%`,
              }}
              onClick={() =>
                setSelectedStation(
                  selectedStation?.name === station.name ? null : station
                )
              }
              onMouseEnter={(e) => handleMouseEnter(e, station, "station")}
              onMouseLeave={handleMouseLeave}
            >
              <div
                className={`rounded-full border-3 shadow-lg flex items-center justify-center ${
                  selectedStation?.name === station.name
                    ? "border-yellow-400 ring-4 ring-yellow-400/30"
                    : "border-white"
                }`}
                style={{
                  backgroundColor: color,
                  width: `${size}px`,
                  height: `${size}px`,
                }}
              >
                <span className="text-white font-bold text-xs">🚂</span>
              </div>

              {/* Station pulse animation for active ones */}
              {station.sites.some((site) => site.status === "operational") && (
                <div
                  className="absolute inset-0 rounded-full animate-ping"
                  style={{ backgroundColor: color, opacity: 0.3 }}
                />
              )}
            </div>
          );
        })}

      {/* Individual Sites */}
      {mapMode === "sites" &&
        filteredSites.map((site) => {
          const position = getScreenPosition(site.latitude, site.longitude);
          const color = getStatusColor(site.status);
          const size = Math.max(6, Math.min(16, site.feasibleCapacity / 50));
          const isHovered = hoveredItem === `site-${site._id}`;

          return (
            <div
              key={site._id}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200 z-10 ${
                isHovered ? "scale-150 z-30" : "hover:scale-125"
              }`}
              style={{
                left: `${position.x}%`,
                top: `${position.y}%`,
              }}
              onMouseEnter={(e) => handleMouseEnter(e, site, "site")}
              onMouseLeave={handleMouseLeave}
            >
              <div
                className="rounded-full border-2 border-white shadow-md"
                style={{
                  backgroundColor: color,
                  width: `${size}px`,
                  height: `${size}px`,
                }}
              />
            </div>
          );
        })}

      {/* Interactive Tooltip */}
      {tooltip.visible && tooltip.content && (
        <div
          className="absolute z-40 pointer-events-none"
          style={{
            left: tooltip.x,
            top: tooltip.y - 10,
            transform: "translateX(-50%) translateY(-100%)",
          }}
        >
          <div className="bg-card/95 backdrop-blur-sm border shadow-lg rounded-lg p-3 min-w-48 max-w-64">
            {tooltip.content.type === "station" ? (
              <div className="space-y-2">
                <div className="font-semibold text-sm flex items-center gap-2">
                  🚂 {(tooltip.content.item as RailwayStation).name}
                  <Badge variant="secondary" className="text-xs">
                    {(tooltip.content.item as RailwayStation).cluster}
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground">
                  {(tooltip.content.item as RailwayStation).zoneInfo}
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="font-medium">Sites:</span>
                    <div>
                      {(tooltip.content.item as RailwayStation).sites.length}
                    </div>
                  </div>
                  <div>
                    <span className="font-medium">Capacity:</span>
                    <div>
                      {(tooltip.content.item as RailwayStation).totalCapacity}{" "}
                      kW
                    </div>
                  </div>
                </div>
                <div className="text-xs">
                  <span className="font-medium">Coordinates:</span>
                  <div className="text-muted-foreground">
                    {(
                      tooltip.content.item as RailwayStation
                    ).coordinates[0].toFixed(4)}
                    ,{" "}
                    {(
                      tooltip.content.item as RailwayStation
                    ).coordinates[1].toFixed(4)}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="font-semibold text-sm">
                  ⚡ {(tooltip.content.item as SiteData).locationName}
                </div>
                <div className="text-xs text-muted-foreground">
                  {(tooltip.content.item as SiteData).address}
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="font-medium">Capacity:</span>
                    <div>
                      {(tooltip.content.item as SiteData).feasibleCapacity} kW
                    </div>
                  </div>
                  <div>
                    <span className="font-medium">Status:</span>
                    <Badge variant="outline" className="text-xs capitalize">
                      {(tooltip.content.item as SiteData).status}
                    </Badge>
                  </div>
                </div>
                <div className="text-xs">
                  <span className="font-medium">Cluster:</span>
                  <span className="ml-1">
                    {(tooltip.content.item as SiteData).cluster}
                  </span>
                </div>
              </div>
            )}
          </div>
          {/* Tooltip arrow */}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2">
            <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-card/95"></div>
          </div>
        </div>
      )}

      {/* Selected Station Details Panel */}
      {selectedStation && (
        <div className="absolute bottom-4 left-4 right-4 z-20">
          <Card className="bg-card/95 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    🚂 {selectedStation.name}
                    <Badge variant="secondary">{selectedStation.cluster}</Badge>
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedStation.zoneInfo}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedStation(null)}
                >
                  ✕
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {selectedStation.sites.length}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Solar Sites
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {selectedStation.totalCapacity} kW
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Total Capacity
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {Math.round(
                      selectedStation.totalCapacity /
                        selectedStation.sites.length
                    )}{" "}
                    kW
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Avg per Site
                  </div>
                </div>
              </div>

              <div className="max-h-32 overflow-y-auto">
                <div className="text-sm font-medium mb-2">
                  Sites at this station:
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {selectedStation.sites.slice(0, 6).map((site) => (
                    <div
                      key={site._id}
                      className="flex items-center justify-between text-xs bg-muted/50 rounded p-2"
                    >
                      <span className="truncate">{site.locationName}</span>
                      <div className="flex items-center gap-1">
                        <Badge variant="outline" className="text-xs capitalize">
                          {site.status}
                        </Badge>
                        <span className="font-medium">
                          {site.feasibleCapacity}kW
                        </span>
                      </div>
                    </div>
                  ))}
                  {selectedStation.sites.length > 6 && (
                    <div className="text-xs text-muted-foreground text-center p-2">
                      ... and {selectedStation.sites.length - 6} more sites
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Map Statistics Overlay */}
      <div className="absolute bottom-4 right-4 z-20">
        <div className="bg-card/95 backdrop-blur-sm rounded-lg p-3 shadow-lg border">
          <div className="text-xs space-y-1">
            <div className="font-medium">Map Overview</div>
            <div className="text-muted-foreground">
              Showing{" "}
              {mapMode === "stations"
                ? filteredStations.length
                : filteredSites.length}{" "}
              {mapMode}
            </div>
            {selectedCluster !== "all" && (
              <div className="text-muted-foreground">
                Filtered by: {selectedCluster} cluster
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
