// lib/actions/epc-actions-new.ts
"use server";

import { revalidatePath } from "next/cache";
import { EPCProjectService } from "../data-service";

export interface EPCProjectFormData {
  id?: string;
  projectName: string;
  siteId: string;
  projectType: "solar_installation" | "maintenance" | "upgrade" | "expansion";
  priority: "low" | "medium" | "high" | "critical";
  budgetTotal: number;
  plannedStartDate: string;
  plannedEndDate: string;
  engineeringTeam?: string;
  procurementVendor?: string;
  contractor?: string;
}

export async function createEPCProject(formData: FormData) {
  try {
    const projectData: EPCProjectFormData = {
      projectName: formData.get("projectName") as string,
      siteId: formData.get("siteId") as string,
      projectType: formData.get("projectType") as
        | "solar_installation"
        | "maintenance"
        | "upgrade"
        | "expansion",
      priority: formData.get("priority") as
        | "low"
        | "medium"
        | "high"
        | "critical",
      budgetTotal: parseFloat(formData.get("budgetTotal") as string) || 0,
      plannedStartDate: formData.get("plannedStartDate") as string,
      plannedEndDate: formData.get("plannedEndDate") as string,
      engineeringTeam: (formData.get("engineeringTeam") as string) || undefined,
      procurementVendor:
        (formData.get("procurementVendor") as string) || undefined,
      contractor: (formData.get("contractor") as string) || undefined,
    };

    // Convert to our data model format
    const newProjectData = {
      name: projectData.projectName,
      siteId: projectData.siteId,
      status: "planned" as const,
      startDate: projectData.plannedStartDate,
      endDate: projectData.plannedEndDate,
      budget: projectData.budgetTotal,
      contractor: projectData.contractor,
      description: `Type: ${projectData.projectType}, Priority: ${projectData.priority}`,
      metadata: {
        projectType: projectData.projectType,
        priority: projectData.priority,
        engineeringTeam: projectData.engineeringTeam,
        procurementVendor: projectData.procurementVendor,
        originalProjectId: `EPC-${Date.now()}-${Math.random()
          .toString(36)
          .substr(2, 4)
          .toUpperCase()}`,
      },
      tasks: [
        {
          id: `TASK-${Date.now()}-1`,
          name: "Site Preparation",
          status: "pending",
          dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0],
        },
        {
          id: `TASK-${Date.now()}-2`,
          name: "Equipment Installation",
          status: "pending",
          dueDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0],
        },
        {
          id: `TASK-${Date.now()}-3`,
          name: "System Commissioning",
          status: "pending",
          dueDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0],
        },
      ],
    };

    // Create the project using our data service
    const project = await EPCProjectService.createProject(newProjectData);

    revalidatePath("/epc");
    revalidatePath("/epc/projects");

    return { success: true, project };
  } catch (error) {
    console.error("Error creating EPC project:", error);
    return { success: false, error: "Failed to create EPC project" };
  }
}

export async function updateEPCProject(formData: FormData) {
  try {
    const projectId = formData.get("id") as string;

    const projectData: EPCProjectFormData = {
      projectName: formData.get("projectName") as string,
      siteId: formData.get("siteId") as string,
      projectType: formData.get("projectType") as
        | "solar_installation"
        | "maintenance"
        | "upgrade"
        | "expansion",
      priority: formData.get("priority") as
        | "low"
        | "medium"
        | "high"
        | "critical",
      budgetTotal: parseFloat(formData.get("budgetTotal") as string) || 0,
      plannedStartDate: formData.get("plannedStartDate") as string,
      plannedEndDate: formData.get("plannedEndDate") as string,
      engineeringTeam: (formData.get("engineeringTeam") as string) || undefined,
      procurementVendor:
        (formData.get("procurementVendor") as string) || undefined,
      contractor: (formData.get("contractor") as string) || undefined,
    };

    // Convert to our data model format
    const updatedProjectData = {
      name: projectData.projectName,
      siteId: projectData.siteId,
      startDate: projectData.plannedStartDate,
      endDate: projectData.plannedEndDate,
      budget: projectData.budgetTotal,
      contractor: projectData.contractor,
      description: `Type: ${projectData.projectType}, Priority: ${projectData.priority}`,
      metadata: {
        projectType: projectData.projectType,
        priority: projectData.priority,
        engineeringTeam: projectData.engineeringTeam,
        procurementVendor: projectData.procurementVendor,
      },
    };

    // Update the project using our data service
    const project = await EPCProjectService.updateProject(
      projectId,
      updatedProjectData
    );

    revalidatePath(`/epc/projects/${projectId}`);
    revalidatePath("/epc/projects");
    revalidatePath("/epc");

    return { success: true, project };
  } catch (error) {
    console.error("Error updating EPC project:", error);
    return { success: false, error: "Failed to update EPC project" };
  }
}

export async function deleteEPCProject(id: string) {
  try {
    await EPCProjectService.deleteProject(id);

    revalidatePath("/epc/projects");
    revalidatePath("/epc");

    return { success: true };
  } catch (error) {
    console.error("Error deleting EPC project:", error);
    return { success: false, error: "Failed to delete EPC project" };
  }
}

export async function getEPCProject(id: string) {
  try {
    const project = await EPCProjectService.getProjectById(id);

    if (!project) {
      return { success: false, error: "Project not found" };
    }

    // Convert to EPCProjectFormData format
    const projectFormData: EPCProjectFormData = {
      id: project.id,
      projectName: project.name,
      siteId: project.siteId,
      projectType:
        (project.metadata?.projectType as EPCProjectFormData["projectType"]) ||
        "solar_installation",
      priority:
        (project.metadata?.priority as EPCProjectFormData["priority"]) ||
        "medium",
      budgetTotal: project.budget || 0,
      plannedStartDate:
        project.startDate || new Date().toISOString().split("T")[0],
      plannedEndDate:
        project.endDate ||
        new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
      engineeringTeam:
        (project.metadata?.engineeringTeam as string) || undefined,
      procurementVendor:
        (project.metadata?.procurementVendor as string) || undefined,
      contractor: project.contractor || undefined,
    };

    return { success: true, project: projectFormData };
  } catch (error) {
    console.error("Error fetching EPC project:", error);
    return { success: false, error: "Failed to fetch EPC project" };
  }
}

export async function getAllEPCProjects() {
  try {
    const projects = await EPCProjectService.getAllProjects();
    return { success: true, projects };
  } catch (error) {
    console.error("Error fetching EPC projects:", error);
    return { success: false, error: "Failed to fetch EPC projects" };
  }
}

export async function getEPCProjectsBySiteId(siteId: string) {
  try {
    const projects = await EPCProjectService.getProjectsBySiteId(siteId);
    return { success: true, projects };
  } catch (error) {
    console.error("Error fetching EPC projects for site:", error);
    return { success: false, error: "Failed to fetch EPC projects for site" };
  }
}

export async function getEPCDashboardStats() {
  try {
    const projects = await EPCProjectService.getAllProjects();

    // Calculate statistics
    const totalProjects = projects.length;
    const totalBudget = projects.reduce(
      (sum, project) => sum + (project.budget || 0),
      0
    );

    const projectsByStatus = projects.reduce(
      (acc: Record<string, number>, project) => {
        const status = project.status;
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      },
      {}
    );

    // Get recent projects
    const recentProjects = projects
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 5)
      .map((project) => ({
        id: project.id,
        name: project.name,
        siteId: project.siteId,
        budget: project.budget || 0,
        status: project.status,
      }));

    return {
      success: true,
      stats: {
        totalProjects,
        totalBudget,
        projectsByStatus,
        recentProjects,
      },
    };
  } catch (error) {
    console.error("Error fetching EPC dashboard stats:", error);
    return { success: false, error: "Failed to fetch EPC dashboard stats" };
  }
}
