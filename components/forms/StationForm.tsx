// components/forms/StationForm.tsx
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { stationSchema, type StationFormData } from "@/lib/validation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  createStation,
  updateStation,
  getDivisions,
} from "@/lib/actions/hierarchy-actions";

interface StationFormProps {
  initialData?: Partial<StationFormData>;
  stationId?: string;
  isEditing?: boolean;
}

export default function StationForm({
  initialData,
  stationId,
  isEditing = false,
}: StationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [divisions, setDivisions] = useState<
    Array<{
      _id: string;
      code: string;
      name: string;
      zoneId: string;
      zoneCode: string;
    }>
  >([]);
  const [isLoadingDivisions, setIsLoadingDivisions] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<StationFormData>({
    resolver: zodResolver(stationSchema),
    defaultValues: initialData || {},
  });

  const selectedDivisionId = watch("divisionId");

  useEffect(() => {
    async function fetchDivisions() {
      setIsLoadingDivisions(true);
      try {
        const response = await getDivisions();
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
        setIsLoadingDivisions(false);
      }
    }

    fetchDivisions();
  }, []);

  const onSubmit = async (data: StationFormData) => {
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value.toString());
        }
      });

      let response;
      if (isEditing && stationId) {
        response = await updateStation(stationId, formData);
      } else {
        response = await createStation(formData);
      }

      if (response.success) {
        setSuccess(
          isEditing
            ? "Station updated successfully!"
            : "Station created successfully!"
        );
        if (!isEditing) {
          reset(); // Only reset the form for new stations
        }
      } else {
        setError(response.error || "An error occurred");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDivisionChange = (divisionId: string) => {
    setValue("divisionId", divisionId);

    // Set divisionCode, zoneId and zoneCode based on selected division
    const selectedDivision = divisions.find((div) => div._id === divisionId);
    if (selectedDivision) {
      setValue("divisionCode", selectedDivision.code);
      setValue("zoneId", selectedDivision.zoneId);
      setValue("zoneCode", selectedDivision.zoneCode);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          {isEditing ? "Edit Station" : "Create New Station"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 mb-4 rounded">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 mb-4 rounded">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="code">Station Code *</Label>
              <Input
                id="code"
                placeholder="Enter station code"
                {...register("code")}
                disabled={isSubmitting || (isEditing && initialData?.code)}
              />
              {errors.code && (
                <p className="text-red-500 text-sm">{errors.code.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Station Name *</Label>
              <Input
                id="name"
                placeholder="Enter station name"
                {...register("name")}
                disabled={isSubmitting}
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="divisionId">Division *</Label>
              <Select
                disabled={isLoadingDivisions || isSubmitting}
                value={selectedDivisionId}
                onValueChange={handleDivisionChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select division" />
                </SelectTrigger>
                <SelectContent>
                  {divisions.map((division) => (
                    <SelectItem key={division._id} value={division._id}>
                      {division.name} ({division.code}) - {division.zoneCode}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.divisionId && (
                <p className="text-red-500 text-sm">
                  {errors.divisionId.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="stationType">Station Type</Label>
              <Select
                defaultValue={initialData?.stationType || "minor"}
                onValueChange={(value) =>
                  register("stationType").onChange({ target: { value } })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select station type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="major">Major</SelectItem>
                  <SelectItem value="minor">Minor</SelectItem>
                  <SelectItem value="halt">Halt</SelectItem>
                  <SelectItem value="junction">Junction</SelectItem>
                  <SelectItem value="terminal">Terminal</SelectItem>
                </SelectContent>
              </Select>
              {errors.stationType && (
                <p className="text-red-500 text-sm">
                  {errors.stationType.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                defaultValue={initialData?.category || "D"}
                onValueChange={(value) =>
                  register("category").onChange({ target: { value } })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A1">A1</SelectItem>
                  <SelectItem value="A">A</SelectItem>
                  <SelectItem value="B">B</SelectItem>
                  <SelectItem value="C">C</SelectItem>
                  <SelectItem value="D">D</SelectItem>
                  <SelectItem value="E">E</SelectItem>
                  <SelectItem value="F">F</SelectItem>
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-red-500 text-sm">
                  {errors.category.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address *</Label>
              <Input
                id="address"
                placeholder="Enter station address"
                {...register("address")}
                disabled={isSubmitting}
              />
              {errors.address && (
                <p className="text-red-500 text-sm">{errors.address.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="latitude">Latitude</Label>
              <Input
                id="latitude"
                type="number"
                step="0.000001"
                placeholder="Enter latitude"
                {...register("latitude", { valueAsNumber: true })}
                disabled={isSubmitting}
              />
              {errors.latitude && (
                <p className="text-red-500 text-sm">
                  {errors.latitude.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="longitude">Longitude</Label>
              <Input
                id="longitude"
                type="number"
                step="0.000001"
                placeholder="Enter longitude"
                {...register("longitude", { valueAsNumber: true })}
                disabled={isSubmitting}
              />
              {errors.longitude && (
                <p className="text-red-500 text-sm">
                  {errors.longitude.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="platforms">Number of Platforms</Label>
              <Input
                id="platforms"
                type="number"
                placeholder="Enter number of platforms"
                {...register("platforms", { valueAsNumber: true })}
                disabled={isSubmitting}
              />
              {errors.platforms && (
                <p className="text-red-500 text-sm">
                  {errors.platforms.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="rooftopArea">Rooftop Area (sq m)</Label>
              <Input
                id="rooftopArea"
                type="number"
                step="0.01"
                placeholder="Enter rooftop area"
                {...register("rooftopArea", { valueAsNumber: true })}
                disabled={isSubmitting}
              />
              {errors.rooftopArea && (
                <p className="text-red-500 text-sm">
                  {errors.rooftopArea.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                defaultValue={initialData?.status || "operational"}
                onValueChange={(value) =>
                  register("status").onChange({ target: { value } })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="operational">Operational</SelectItem>
                  <SelectItem value="under-construction">
                    Under Construction
                  </SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                  <SelectItem value="planned">Planned</SelectItem>
                </SelectContent>
              </Select>
              {errors.status && (
                <p className="text-red-500 text-sm">{errors.status.message}</p>
              )}
            </div>

            <div className="flex items-center space-x-2 mt-6">
              <Checkbox
                id="hasWifi"
                checked={watch("hasWifi")}
                onCheckedChange={(checked) => {
                  setValue("hasWifi", checked === true);
                }}
              />
              <Label htmlFor="hasWifi">Has WiFi</Label>
            </div>

            <div className="flex items-center space-x-2 mt-6">
              <Checkbox
                id="hasFoodCourt"
                checked={watch("hasFoodCourt")}
                onCheckedChange={(checked) => {
                  setValue("hasFoodCourt", checked === true);
                }}
              />
              <Label htmlFor="hasFoodCourt">Has Food Court</Label>
            </div>

            <div className="flex items-center space-x-2 mt-6">
              <Checkbox
                id="hasElectricityMeters"
                checked={watch("hasElectricityMeters") !== false}
                onCheckedChange={(checked) => {
                  setValue("hasElectricityMeters", checked === true);
                }}
              />
              <Label htmlFor="hasElectricityMeters">
                Has Electricity Meters
              </Label>
            </div>
          </div>

          {/* Hidden inputs for divisionCode, zoneId and zoneCode, will be set automatically */}
          <input type="hidden" {...register("divisionCode")} />
          <input type="hidden" {...register("zoneId")} />
          <input type="hidden" {...register("zoneCode")} />

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => reset()}
              disabled={isSubmitting}
            >
              Reset
            </Button>
            <Button type="submit" disabled={isSubmitting || isLoadingDivisions}>
              {isSubmitting
                ? "Processing..."
                : isEditing
                ? "Update Station"
                : "Create Station"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
