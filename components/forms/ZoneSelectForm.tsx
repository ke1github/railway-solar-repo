// components/forms/ZoneSelectForm.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getZones, getDivisionsByZone } from "@/lib/actions/hierarchy-actions";

interface ZoneSelectFormProps {
  onZoneSelect: (zoneId: string, zoneName: string) => void;
  onDivisionSelect?: (divisionId: string, divisionName: string) => void;
}

export default function ZoneSelectForm({
  onZoneSelect,
  onDivisionSelect,
}: ZoneSelectFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [zones, setZones] = useState<
    Array<{ _id: string; code: string; name: string }>
  >([]);
  const [divisions, setDivisions] = useState<
    Array<{ _id: string; code: string; name: string }>
  >([]);
  const [selectedZoneId, setSelectedZoneId] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadZones() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await getZones();
        if (response.success && response.data) {
          setZones(response.data);
        } else {
          setError("Failed to load zones");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load zones");
      } finally {
        setIsLoading(false);
      }
    }

    loadZones();
  }, []);

  async function handleZoneChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const zoneId = event.target.value;
    setSelectedZoneId(zoneId);

    const selectedZone = zones.find((zone) => zone._id === zoneId);
    if (selectedZone) {
      onZoneSelect(zoneId, selectedZone.name);

      if (onDivisionSelect) {
        // Load divisions for this zone
        setIsLoading(true);
        try {
          const response = await getDivisionsByZone(zoneId);
          if (response.success && response.data) {
            setDivisions(response.data);
          } else {
            setError("Failed to load divisions");
          }
        } catch (err) {
          setError(
            err instanceof Error ? err.message : "Failed to load divisions"
          );
        } finally {
          setIsLoading(false);
        }
      }
    }
  }

  function handleDivisionChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const divisionId = event.target.value;
    const selectedDivision = divisions.find(
      (division) => division._id === divisionId
    );

    if (selectedDivision && onDivisionSelect) {
      onDivisionSelect(divisionId, selectedDivision.name);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Select Zone</CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 mb-4 rounded">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="zone">Railway Zone</Label>
            <select
              id="zone"
              value={selectedZoneId}
              onChange={handleZoneChange}
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800"
            >
              <option value="">Select a zone</option>
              {zones.map((zone) => (
                <option key={zone._id} value={zone._id}>
                  {zone.name} ({zone.code})
                </option>
              ))}
            </select>
          </div>

          {onDivisionSelect && selectedZoneId && (
            <div className="space-y-2">
              <Label htmlFor="division">Division</Label>
              <select
                id="division"
                onChange={handleDivisionChange}
                disabled={isLoading || divisions.length === 0}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800"
              >
                <option value="">Select a division</option>
                {divisions.map((division) => (
                  <option key={division._id} value={division._id}>
                    {division.name} ({division.code})
                  </option>
                ))}
              </select>
            </div>
          )}

          {isLoading && (
            <div className="flex items-center justify-center py-4">
              <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="ml-2">Loading...</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
