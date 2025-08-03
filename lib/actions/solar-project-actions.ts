"use server";

import { connectToDatabase } from "@/lib/mongodb";
import { revalidatePath } from "next/cache";
import SolarProject, { ISolarProject } from "@/models/SolarProjectHierarchy";
import RailwaySite from "@/models/RailwaySite";

// Create a new solar project
export async function createSolarProject(projectData: {
  projectCode: string;
  name: string;
  description?: string;
  siteId: string;
  siteCode: string;
  capacity: {
    planned?: number;
    unit: string;
  };
  status:
    | "planning"
    | "approved"
    | "execution"
    | "completed"
    | "cancelled"
    | "on-hold";
  priority: "low" | "medium" | "high" | "critical";
  dates?: {
    planned?: {
      start?: Date;
      end?: Date;
    };
  };
}) {
  try {
    await connectToDatabase();

    // Check if site exists
    const site = await RailwaySite.findById(projectData.siteId);
    if (!site) {
      return { success: false, error: "Site not found" };
    }

    // Check if project code already exists
    const existingProject = await SolarProject.findOne({
      projectCode: projectData.projectCode,
    });

    if (existingProject) {
      return { success: false, error: "Project with this code already exists" };
    }

    // Create a new project with default phases
    const newProject = new SolarProject({
      ...projectData,
      progress: 0,
      phases: [
        {
          name: "Planning & Approval",
          description: "Initial planning, approvals, and project setup",
          order: 1,
          status: "planned",
          progress: 0,
          workPackages: [],
        },
        {
          name: "Site Survey & Assessment",
          description:
            "Site surveys, feasibility studies, and detailed assessments",
          order: 2,
          status: "planned",
          progress: 0,
          workPackages: [],
        },
        {
          name: "Design & Engineering",
          description:
            "Technical design, engineering drawings, and specifications",
          order: 3,
          status: "planned",
          progress: 0,
          workPackages: [],
        },
        {
          name: "Procurement",
          description: "Material sourcing, purchasing, and logistics",
          order: 4,
          status: "planned",
          progress: 0,
          workPackages: [],
        },
        {
          name: "Installation & Construction",
          description: "On-site installation and construction activities",
          order: 5,
          status: "planned",
          progress: 0,
          workPackages: [],
        },
        {
          name: "Testing & Commissioning",
          description: "System testing, quality checks, and commissioning",
          order: 6,
          status: "planned",
          progress: 0,
          workPackages: [],
        },
        {
          name: "Handover & Documentation",
          description: "Project handover, training, and final documentation",
          order: 7,
          status: "planned",
          progress: 0,
          workPackages: [],
        },
      ],
      location: {
        stationName: site.locationName,
        stationCode: site.id,
        division: site.division,
        zone: site.zone,
        address: site.address,
        coordinates: {
          latitude: site.latitude,
          longitude: site.longitude,
        },
      },
      aiInsights: {
        riskAssessment: {
          overall: "medium",
          schedule: "medium",
          budget: "medium",
          quality: "medium",
        },
        lastAnalyzed: new Date(),
      },
    });

    await newProject.save();

    revalidatePath(`/epc/projects/${newProject._id}`);
    revalidatePath("/epc/projects");

    return { success: true, project: newProject };
  } catch (error) {
    console.error("Error creating solar project:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to create solar project",
    };
  }
}

// Get all solar projects
export async function getSolarProjects(filters?: {
  status?: string[];
  priority?: string[];
  zone?: string[];
  division?: string[];
  capacity?: {
    min?: number;
    max?: number;
  };
}) {
  try {
    await connectToDatabase();

    const query: any = {};

    // Apply filters if provided
    if (filters) {
      if (filters.status && filters.status.length > 0) {
        query.status = { $in: filters.status };
      }

      if (filters.priority && filters.priority.length > 0) {
        query.priority = { $in: filters.priority };
      }

      if (filters.zone && filters.zone.length > 0) {
        query["location.zone"] = { $in: filters.zone };
      }

      if (filters.division && filters.division.length > 0) {
        query["location.division"] = { $in: filters.division };
      }

      if (filters.capacity) {
        query["capacity.planned"] = {};
        if (filters.capacity.min !== undefined) {
          query["capacity.planned"].$gte = filters.capacity.min;
        }
        if (filters.capacity.max !== undefined) {
          query["capacity.planned"].$lte = filters.capacity.max;
        }
      }
    }

    const projects = await SolarProject.find(query)
      .select(
        "projectCode name status priority progress capacity location dates"
      )
      .sort({ updatedAt: -1 });

    return { success: true, projects };
  } catch (error) {
    console.error("Error fetching solar projects:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to fetch solar projects",
    };
  }
}

// Get a specific solar project by ID
export async function getSolarProjectById(projectId: string) {
  try {
    await connectToDatabase();

    const project = await SolarProject.findById(projectId);

    if (!project) {
      return { success: false, error: "Project not found" };
    }

    return { success: true, project };
  } catch (error) {
    console.error("Error fetching solar project:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to fetch solar project",
    };
  }
}

// Update solar project
export async function updateSolarProject(
  projectId: string,
  updateData: Partial<ISolarProject>
) {
  try {
    await connectToDatabase();

    // Don't allow updating siteId and projectCode directly
    if (updateData.siteId) delete updateData.siteId;
    if (updateData.projectCode) delete updateData.projectCode;
    if (updateData.siteCode) delete updateData.siteCode;

    const project = await SolarProject.findByIdAndUpdate(
      projectId,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!project) {
      return { success: false, error: "Project not found" };
    }

    revalidatePath(`/epc/projects/${projectId}`);
    revalidatePath("/epc/projects");

    return { success: true, project };
  } catch (error) {
    console.error("Error updating solar project:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to update solar project",
    };
  }
}

// Delete solar project
export async function deleteSolarProject(projectId: string) {
  try {
    await connectToDatabase();

    const project = await SolarProject.findByIdAndDelete(projectId);

    if (!project) {
      return { success: false, error: "Project not found" };
    }

    revalidatePath("/epc/projects");

    return { success: true };
  } catch (error) {
    console.error("Error deleting solar project:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to delete solar project",
    };
  }
}

// Generate AI insights for a project
export async function generateProjectInsights(projectId: string) {
  try {
    await connectToDatabase();

    const project = await SolarProject.findById(projectId);

    if (!project) {
      return { success: false, error: "Project not found" };
    }

    // In a real implementation, this would use ML models or external AI services
    // Here we're simulating the AI analysis with some logic

    // Calculate predicted completion date based on current progress
    const currentProgress = project.progress;
    const plannedStartDate = project.dates.planned?.start;
    const plannedEndDate = project.dates.planned?.end;

    let predictedCompletionDate;
    if (plannedStartDate && plannedEndDate && currentProgress > 0) {
      const totalDays =
        (plannedEndDate.getTime() - plannedStartDate.getTime()) /
        (1000 * 60 * 60 * 24);
      const daysElapsed =
        (new Date().getTime() - plannedStartDate.getTime()) /
        (1000 * 60 * 60 * 24);
      const progressPerDay = currentProgress / daysElapsed;
      const daysRemaining = (100 - currentProgress) / progressPerDay;

      predictedCompletionDate = new Date();
      predictedCompletionDate.setDate(
        predictedCompletionDate.getDate() + daysRemaining
      );
    } else {
      predictedCompletionDate = plannedEndDate || new Date();
    }

    // Calculate risk assessments
    let scheduleRisk = "medium";
    let budgetRisk = "medium";
    const qualityRisk = "medium";
    let overallRisk = "medium";

    if (project.risks && project.risks.length > 0) {
      // Count high severity risks
      const highSeverityRisks = project.risks.filter(
        (risk) => risk.severity && risk.severity > 7
      ).length;

      if (highSeverityRisks > 5) {
        overallRisk = "high";
      } else if (highSeverityRisks < 2) {
        overallRisk = "low";
      }
    }

    // Check budget risk
    if (project.budget) {
      const allocated = project.budget.allocated || 0;
      const spent = project.budget.spent || 0;

      if (allocated > 0) {
        const spentPercentage = (spent / allocated) * 100;
        const progressPercentage = project.progress;

        if (spentPercentage > progressPercentage + 15) {
          budgetRisk = "high";
        } else if (spentPercentage < progressPercentage - 5) {
          budgetRisk = "low";
        }
      }
    }

    // Check schedule risk
    if (plannedEndDate) {
      const today = new Date();
      const daysRemaining =
        (plannedEndDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
      const progressRemaining = 100 - currentProgress;

      if (progressRemaining > 30 && daysRemaining < 30) {
        scheduleRisk = "high";
      } else if (progressRemaining < 20 && daysRemaining > 40) {
        scheduleRisk = "low";
      }
    }

    // Generate recommendations
    const recommendations = [];

    if (scheduleRisk === "high") {
      recommendations.push(
        "Consider allocating additional resources to critical path activities"
      );
      recommendations.push(
        "Review project schedule and identify tasks that can be performed in parallel"
      );
    }

    if (budgetRisk === "high") {
      recommendations.push(
        "Review cost control measures and identify potential savings"
      );
      recommendations.push(
        "Evaluate material procurement strategies for cost optimization"
      );
    }

    if (project.materials && project.materials.length > 0) {
      const pendingMaterials = project.materials.filter(
        (m) => m.status !== "delivered" && m.status !== "installed"
      ).length;

      if (pendingMaterials > 5) {
        recommendations.push(
          `Expedite procurement for ${pendingMaterials} pending materials`
        );
      }
    }

    // Update AI insights
    const aiInsights = {
      predictedCompletionDate,
      predictedFinalCost: project.budget?.approved
        ? project.budget.approved * 1.05
        : undefined,
      riskAssessment: {
        overall: overallRisk,
        schedule: scheduleRisk,
        budget: budgetRisk,
        quality: qualityRisk,
      } as any,
      keyPerformanceIndicators: {
        schedulePerformanceIndex:
          scheduleRisk === "high"
            ? 0.85
            : scheduleRisk === "medium"
            ? 0.95
            : 1.05,
        costPerformanceIndex:
          budgetRisk === "high" ? 0.88 : budgetRisk === "medium" ? 0.96 : 1.03,
        qualityIndex: 0.92,
        safetyIndex: 0.98,
      },
      recommendations,
      lastAnalyzed: new Date(),
    };

    // Update project with AI insights
    await SolarProject.findByIdAndUpdate(
      projectId,
      { $set: { aiInsights } },
      { new: true }
    );

    revalidatePath(`/epc/projects/${projectId}`);

    return { success: true, aiInsights };
  } catch (error) {
    console.error("Error generating project insights:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to generate project insights",
    };
  }
}
