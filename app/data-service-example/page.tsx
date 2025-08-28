// examples/data-service-usage.tsx
"use client";

import { useState, useEffect } from "react";
import {
  SiteService,
  EPCProjectService,
  SolarInstallationService,
} from "../../lib/data-service";
// If your data-service file is not in ../../lib/data-service.ts, update the path accordingly.
// Update the import path if your types are located elsewhere, e.g.:
import { Site, EPCProject, SolarInstallation } from "../../types/data-models";
// Or, if you don't have a types/data-models file, create one at ../../types/data-models.ts with the following content:

// export type Site = { id: string; name: string; location: { latitude: number; longitude: number; address: string; city: string; country: string }; status: string; siteType: string; area: number; description?: string; };
// export type EPCProject = { id: string; name: string; status: string; startDate?: string; endDate?: string; };
// export type SolarInstallation = { id: string; panelType: string; capacity: number; status: string; panelCount: number; efficiency?: number; };

// Example component showing how to use the data service
export default function DataServiceExample() {
  const [sites, setSites] = useState<Site[]>([]);
  const [selectedSite, setSelectedSite] = useState<Site | null>(null);
  const [projects, setProjects] = useState<EPCProject[]>([]);
  const [installations, setInstallations] = useState<SolarInstallation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load sites on component mount
  useEffect(() => {
    const loadSites = async () => {
      try {
        setLoading(true);
        const allSites = await SiteService.getAllSites();
        setSites(allSites);

        // Select the first site by default if available
        if (allSites.length > 0) {
          setSelectedSite(allSites[0]);
        }

        setError(null);
      } catch (err) {
        setError("Failed to load sites");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadSites();
  }, []);

  // Load projects and installations when a site is selected
  useEffect(() => {
    if (!selectedSite) return;

    const loadSiteData = async () => {
      try {
        setLoading(true);

        // Load projects for the selected site
        const siteProjects = await EPCProjectService.getProjectsBySiteId(
          selectedSite.id
        );
        setProjects(siteProjects);

        // Load installations for the selected site
        const siteInstallations =
          await SolarInstallationService.getInstallationsBySiteId(
            selectedSite.id
          );
        setInstallations(siteInstallations);

        setError(null);
      } catch (err) {
        setError("Failed to load site data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadSiteData();
  }, [selectedSite]);

  // Handle site selection
  const handleSiteSelect = async (siteId: string) => {
    try {
      setLoading(true);
      const site = await SiteService.getSiteById(siteId);
      setSelectedSite(site);
      setError(null);
    } catch (err) {
      setError("Failed to load site details");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Example of creating a new site
  const handleCreateSite = async () => {
    try {
      setLoading(true);

      const newSiteData = {
        name: `New Test Site ${Date.now()}`,
        location: {
          latitude: 51.5074,
          longitude: -0.1278,
          address: "Test Address",
          city: "London",
          country: "UK",
        },
        status: "planned" as const,
        siteType: "station" as const,
        area: 10000,
        description: "A test site created from the example",
      };

      const newSite = await SiteService.createSite(newSiteData);

      // Refresh the sites list
      const updatedSites = await SiteService.getAllSites();
      setSites(updatedSites);

      // Select the newly created site
      setSelectedSite(newSite);

      setError(null);
      alert(`Site "${newSite.name}" created successfully!`);
    } catch (err) {
      setError("Failed to create site");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Example of deleting a site
  const handleDeleteSite = async (siteId: string) => {
    if (!confirm("Are you sure you want to delete this site?")) return;

    try {
      setLoading(true);

      const success = await SiteService.deleteSite(siteId);

      if (success) {
        // Refresh the sites list
        const updatedSites = await SiteService.getAllSites();
        setSites(updatedSites);

        // Clear selection if the deleted site was selected
        if (selectedSite && selectedSite.id === siteId) {
          setSelectedSite(updatedSites.length > 0 ? updatedSites[0] : null);
        }

        alert("Site deleted successfully!");
      } else {
        throw new Error("Failed to delete site");
      }

      setError(null);
    } catch (err) {
      setError("Failed to delete site");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 min-h-screen">
      <h1 className="text-heading-2 mb-6 text-white border-l-4 border-yellow-400 pl-3">
        Solar Data Management
      </h1>

      {error && (
        <div className="bg-red-800 border-l-4 border-red-500 text-white px-4 py-3 mb-4 shadow-lg">
          <p className="text-body">{error}</p>
        </div>
      )}

      {/* Actions */}
      <div className="mb-6">
        <button
          onClick={handleCreateSite}
          className="bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-bold py-2 px-4 mr-2 border-b-2 border-yellow-600 transition-all duration-200"
          disabled={loading}
        >
          Create Test Site
        </button>
      </div>

      {/* Sites List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-800 border border-slate-700 p-4 shadow-lg">
          <h2 className="text-heading-4 mb-4 text-white border-b border-yellow-500 pb-2">
            Railway Sites
          </h2>

          {loading && !sites.length ? (
            <p className="text-body text-slate-300">Loading sites...</p>
          ) : sites.length ? (
            <ul className="divide-y divide-slate-700">
              {sites.map((site) => (
                <li key={site.id} className="py-2">
                  <div className="flex justify-between items-center">
                    <button
                      onClick={() => handleSiteSelect(site.id)}
                      className={`text-left ${
                        selectedSite?.id === site.id
                          ? "font-bold text-yellow-400"
                          : "text-slate-200"
                      }`}
                    >
                      <span className="text-body">{site.name}</span>
                    </button>
                    <button
                      onClick={() => handleDeleteSite(site.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      Delete
                    </button>
                  </div>
                  <p className="text-caption text-slate-400">
                    {site.location.city}, {site.status}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-body text-slate-300">No sites found</p>
          )}
        </div>

        {/* Projects List */}
        <div className="bg-slate-800 border border-slate-700 p-4 shadow-lg">
          <h2 className="text-heading-4 mb-4 text-white border-b border-yellow-500 pb-2">
            EPC Projects
          </h2>

          {!selectedSite ? (
            <p className="text-body text-slate-300">
              Select a site to view projects
            </p>
          ) : loading && !projects.length ? (
            <p className="text-body text-slate-300">Loading projects...</p>
          ) : projects.length ? (
            <ul className="divide-y divide-slate-700">
              {projects.map((project) => (
                <li key={project.id} className="py-2">
                  <p className="text-body font-medium text-yellow-400">
                    {project.name}
                  </p>
                  <p className="text-caption text-slate-400">
                    Status: {project.status}
                  </p>
                  {project.startDate && (
                    <p className="text-caption text-slate-400">
                      Start: {new Date(project.startDate).toLocaleDateString()}
                    </p>
                  )}
                  {project.endDate && (
                    <p className="text-caption text-slate-400">
                      End: {new Date(project.endDate).toLocaleDateString()}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-body text-slate-300">
              No projects found for this site
            </p>
          )}
        </div>

        {/* Installations List */}
        <div className="bg-slate-800 border border-slate-700 p-4 shadow-lg">
          <h2 className="text-heading-4 mb-4 text-white border-b border-yellow-500 pb-2">
            Solar Installations
          </h2>

          {!selectedSite ? (
            <p className="text-body text-slate-300">
              Select a site to view installations
            </p>
          ) : loading && !installations.length ? (
            <p className="text-body text-slate-300">Loading installations...</p>
          ) : installations.length ? (
            <ul className="divide-y divide-slate-700">
              {installations.map((installation) => (
                <li key={installation.id} className="py-2">
                  <p className="text-body font-medium text-yellow-400">
                    {installation.panelType} ({installation.capacity} kW)
                  </p>
                  <p className="text-caption text-slate-400">
                    Status: {installation.status}
                  </p>
                  <p className="text-caption text-slate-400">
                    Panels: {installation.panelCount}
                  </p>
                  {installation.efficiency && (
                    <p className="text-caption text-slate-400">
                      Efficiency: {installation.efficiency}%
                    </p>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-body text-slate-300">
              No installations found for this site
            </p>
          )}
        </div>
      </div>

      {/* Selected Site Details */}
      {selectedSite && (
        <div className="mt-8 bg-slate-800 border border-slate-700 p-6 shadow-lg">
          <h2 className="text-heading-4 mb-4 text-white border-b border-yellow-500 pb-2">
            Site Details: {selectedSite.name}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-300">
            <div>
              <p className="text-body">
                <strong className="text-yellow-400">ID:</strong>{" "}
                {selectedSite.id}
              </p>
              <p className="text-body">
                <strong className="text-yellow-400">Type:</strong>{" "}
                {selectedSite.siteType}
              </p>
              <p className="text-body">
                <strong className="text-yellow-400">Status:</strong>{" "}
                {selectedSite.status}
              </p>
              <p className="text-body">
                <strong className="text-yellow-400">Area:</strong>{" "}
                {selectedSite.area} m²
              </p>
            </div>

            <div>
              <p className="text-body">
                <strong className="text-yellow-400">Location:</strong>{" "}
                {selectedSite.location.address}
              </p>
              <p className="text-body">
                <strong className="text-yellow-400">City:</strong>{" "}
                {selectedSite.location.city}
              </p>
              <p className="text-body">
                <strong className="text-yellow-400">Country:</strong>{" "}
                {selectedSite.location.country}
              </p>
              <p className="text-body">
                <strong className="text-yellow-400">Coordinates:</strong>{" "}
                {selectedSite.location.latitude},{" "}
                {selectedSite.location.longitude}
              </p>
            </div>

            {selectedSite.description && (
              <div className="col-span-2">
                <p>
                  <strong className="text-yellow-400">Description:</strong>
                </p>
                <p className="mt-1">{selectedSite.description}</p>
              </div>
            )}
          </div>

          {/* Energy Production Visualization */}
          <div className="mt-6 pt-4 border-t border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-3">
              Energy Production
            </h3>
            <div className="h-24 flex items-end space-x-1">
              {[45, 70, 32, 80, 56, 90, 65, 48, 75, 62, 85, 50].map(
                (value, i) => (
                  <div
                    key={i}
                    className="bg-gradient-to-t from-yellow-500 to-yellow-300 w-full"
                    style={{ height: `${value}%` }}
                    title={`${value}% efficiency`}
                  ></div>
                )
              )}
            </div>
            <div className="flex justify-between mt-2 text-xs text-slate-400">
              <span>Jan</span>
              <span>Feb</span>
              <span>Mar</span>
              <span>Apr</span>
              <span>May</span>
              <span>Jun</span>
              <span>Jul</span>
              <span>Aug</span>
              <span>Sep</span>
              <span>Oct</span>
              <span>Nov</span>
              <span>Dec</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
