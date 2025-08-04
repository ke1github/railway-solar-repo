// components/solar/SolarInstallationList.tsx
"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { getAllSolarInstallations } from "@/lib/actions/solar-actions";
import { ISolarInstallation } from "@/models";

interface SolarInstallationListProps {
  stationId?: string;
}

const statusColorMap = {
  planned: "bg-gray-400",
  "under-installation": "bg-yellow-400 text-black",
  operational: "bg-green-500",
  maintenance: "bg-orange-400",
  decommissioned: "bg-red-500",
};

export function SolarInstallationList({
  stationId,
}: SolarInstallationListProps) {
  const [installations, setInstallations] = useState<ISolarInstallation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState({
    status: "all",
    search: "",
    sort: "capacity-desc",
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (stationId) params.append("stationId", stationId);
        if (filter.status !== "all") params.append("status", filter.status);
        if (filter.search) params.append("search", filter.search);

        const [sortField, sortOrder] = filter.sort.split("-");
        params.append("sortBy", sortField);
        params.append("sortOrder", sortOrder);

        const data = await getAllSolarInstallations(params.toString());
        setInstallations(data);
      } catch (error) {
        console.error("Failed to fetch solar installations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [stationId, filter]);

  const handleStatusChange = (value: string) => {
    setFilter((prev) => ({ ...prev, status: value }));
  };

  const handleSortChange = (value: string) => {
    setFilter((prev) => ({ ...prev, sort: value }));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter((prev) => ({ ...prev, search: e.target.value }));
  };

  const formatDate = (dateValue: Date | string) => {
    if (!dateValue) return "N/A";
    const date = dateValue instanceof Date ? dateValue : new Date(dateValue);
    return date.toLocaleDateString();
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Solar Installations</CardTitle>
        <CardDescription>
          {stationId
            ? "Solar installations at this station"
            : "All solar installations across the railway network"}
        </CardDescription>
        <div className="flex flex-col md:flex-row gap-4 mt-2">
          <div className="w-full md:w-1/3">
            <Input
              placeholder="Search installations..."
              value={filter.search}
              onChange={handleSearchChange}
              className="max-w-sm"
            />
          </div>
          <div className="w-full md:w-1/3">
            <Select value={filter.status} onValueChange={handleStatusChange}>
              <SelectTrigger className="max-w-sm">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="planned">Planned</SelectItem>
                <SelectItem value="under-installation">
                  Under Installation
                </SelectItem>
                <SelectItem value="operational">Operational</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="decommissioned">Decommissioned</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="w-full md:w-1/3">
            <Select value={filter.sort} onValueChange={handleSortChange}>
              <SelectTrigger className="max-w-sm">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="capacity-desc">
                  Capacity (High to Low)
                </SelectItem>
                <SelectItem value="capacity-asc">
                  Capacity (Low to High)
                </SelectItem>
                <SelectItem value="installationDate-desc">
                  Installation Date (Newest)
                </SelectItem>
                <SelectItem value="installationDate-asc">
                  Installation Date (Oldest)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <LoadingSpinner size="lg" />
          </div>
        ) : installations.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-muted-foreground">
              No solar installations found
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Station</TableHead>
                  <TableHead>Capacity (kW)</TableHead>
                  <TableHead>Panel Type</TableHead>
                  <TableHead>Installation Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Area (m²)</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {installations.map((installation) => (
                  <TableRow key={installation._id?.toString()}>
                    <TableCell className="font-medium">
                      {installation.stationCode}
                    </TableCell>
                    <TableCell>{installation.capacity.toFixed(2)}</TableCell>
                    <TableCell>{installation.panelType}</TableCell>
                    <TableCell>
                      {formatDate(installation.installationDate)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          statusColorMap[
                            installation.status as keyof typeof statusColorMap
                          ]
                        }
                      >
                        {installation.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {installation.installedArea.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        className="mr-2"
                        asChild
                      >
                        <a href={`/solar/installations/${installation._id}`}>
                          View
                        </a>
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <a
                          href={`/solar/installations/${installation._id}/energy`}
                        >
                          Energy Data
                        </a>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
