// lib/actions/epc-actions.ts
"use server";

import { connectToDatabase } from "@/lib/mongodb";
import { EPCProject } from "@/models";
import { IEPCProject } from "@/models/EPCProject";
import { revalidatePath } from "next/cache";

export interface EPCProjectFormData {
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
    await connectToDatabase();

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
      budgetTotal: parseFloat(formData.get("budgetTotal") as string),
      plannedStartDate: formData.get("plannedStartDate") as string,
      plannedEndDate: formData.get("plannedEndDate") as string,
      engineeringTeam: formData.get("engineeringTeam") as string,
      procurementVendor: formData.get("procurementVendor") as string,
      contractor: formData.get("contractor") as string,
    };

    // Generate project ID
    const projectId = `EPC-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 4)
      .toUpperCase()}`;

    const newProject = new EPCProject({
      projectId,
      projectName: projectData.projectName,
      siteId: projectData.siteId,
      projectType: projectData.projectType,
      priority: projectData.priority,
      phases: {
        engineering: {
          status: "not_started",
          assignedTeam: projectData.engineeringTeam
            ? [projectData.engineeringTeam]
            : [],
          documents: [],
          progress: 0,
        },
        procurement: {
          status: "not_started",
          vendor: projectData.procurementVendor || "",
          purchaseOrders: [],
          progress: 0,
        },
        construction: {
          status: "not_started",
          contractor: projectData.contractor || "",
          milestones: [
            {
              name: "Site Preparation",
              targetDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
              status: "pending",
            },
            {
              name: "Equipment Installation",
              targetDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days from now
              status: "pending",
            },
            {
              name: "System Commissioning",
              targetDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
              status: "pending",
            },
          ],
          progress: 0,
        },
      },
      resources: {
        budget: {
          total: projectData.budgetTotal,
          allocated: 0,
          spent: 0,
          currency: "INR",
        },
        timeline: {
          plannedStartDate: new Date(projectData.plannedStartDate),
          plannedEndDate: new Date(projectData.plannedEndDate),
        },
        team: [],
      },
      qualityControl: {
        inspections: [],
        certifications: [],
        compliance: [
          {
            requirement: "Railway Safety Clearance",
            status: "pending",
            evidence: "",
          },
          {
            requirement: "Environmental Compliance",
            status: "pending",
            evidence: "",
          },
          {
            requirement: "Electrical Safety Certification",
            status: "pending",
            evidence: "",
          },
        ],
      },
      risks: [
        {
          id: "RISK-001",
          description: "Weather-related delays",
          probability: "medium",
          impact: "medium",
          mitigation:
            "Monitor weather forecasts and adjust schedule accordingly",
          status: "open",
          owner: projectData.engineeringTeam || "Project Manager",
        },
        {
          id: "RISK-002",
          description: "Regulatory approval delays",
          probability: "low",
          impact: "high",
          mitigation: "Submit applications early with complete documentation",
          status: "open",
          owner: projectData.engineeringTeam || "Project Manager",
        },
      ],
      overallStatus: "planning",
      healthScore: 100,
    });

    await newProject.save();

    revalidatePath("/epc");
    revalidatePath("/epc/projects");

    return { success: true, project: JSON.parse(JSON.stringify(newProject)) };
  } catch (error) {
    console.error("Error creating EPC project:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to create EPC project",
    };
  }
}

export async function updateEPCProject(projectId: string, formData: FormData) {
  try {
    await connectToDatabase();

    const updateData = {
      projectName: formData.get("projectName") as string,
      priority: formData.get("priority") as string,
      "resources.budget.total": parseFloat(
        formData.get("budgetTotal") as string
      ),
      "resources.timeline.plannedStartDate": new Date(
        formData.get("plannedStartDate") as string
      ),
      "resources.timeline.plannedEndDate": new Date(
        formData.get("plannedEndDate") as string
      ),
      "phases.engineering.assignedTeam": formData.get("engineeringTeam")
        ? [formData.get("engineeringTeam")]
        : [],
      "phases.procurement.vendor": formData.get("procurementVendor") as string,
      "phases.construction.contractor": formData.get("contractor") as string,
    };

    const updatedProject = await EPCProject.findOneAndUpdate(
      { $or: [{ _id: projectId }, { projectId: projectId }] },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedProject) {
      return { success: false, error: "EPC project not found" };
    }

    // Recalculate health score
    updatedProject.calculateHealthScore();
    await updatedProject.save();

    revalidatePath("/epc");
    revalidatePath("/epc/projects");
    revalidatePath(`/epc/projects/${projectId}`);

    return {
      success: true,
      project: JSON.parse(JSON.stringify(updatedProject)),
    };
  } catch (error) {
    console.error("Error updating EPC project:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update EPC project",
    };
  }
}

export async function updateProjectPhase(
  projectId: string,
  phase: "engineering" | "procurement" | "construction",
  phaseData: FormData
) {
  try {
    await connectToDatabase();

    const status = phaseData.get("status") as string;
    const progress = parseInt(phaseData.get("progress") as string);

    const updateObj: Record<string, unknown> = {
      [`phases.${phase}.status`]: status,
      [`phases.${phase}.progress`]: progress,
    };

    if (status === "in_progress" && phaseData.get("startDate")) {
      updateObj[`phases.${phase}.startDate`] = new Date(
        phaseData.get("startDate") as string
      );
    }

    if (status === "completed" && phaseData.get("completedDate")) {
      updateObj[`phases.${phase}.completedDate`] = new Date(
        phaseData.get("completedDate") as string
      );
    }

    const updatedProject = await EPCProject.findOneAndUpdate(
      { $or: [{ _id: projectId }, { projectId: projectId }] },
      { $set: updateObj },
      { new: true, runValidators: true }
    );

    if (!updatedProject) {
      return { success: false, error: "EPC project not found" };
    }

    // Recalculate health score and overall progress
    updatedProject.calculateHealthScore();
    await updatedProject.save();

    revalidatePath("/epc");
    revalidatePath("/epc/projects");
    revalidatePath(`/epc/projects/${projectId}`);

    return {
      success: true,
      project: JSON.parse(JSON.stringify(updatedProject)),
    };
  } catch (error) {
    console.error("Error updating project phase:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to update project phase",
    };
  }
}

export async function getEPCProjects(
  page: number = 1,
  limit: number = 20,
  status?: string,
  priority?: string
) {
  try {
    await connectToDatabase();

    const skip = (page - 1) * limit;

    // Build filter
    const filter: Record<string, unknown> = {};
    if (status) filter.overallStatus = status;
    if (priority) filter.priority = priority;

    const [projects, total] = await Promise.all([
      EPCProject.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      EPCProject.countDocuments(filter),
    ]);

    // Calculate overall progress for each project
    const enrichedProjects = projects.map((project) => {
      const overallProgress = Math.round(
        project.phases.engineering.progress * 0.3 +
          project.phases.procurement.progress * 0.3 +
          project.phases.construction.progress * 0.4
      );

      return {
        ...project,
        overallProgress,
      };
    });

    return {
      success: true,
      projects: JSON.parse(JSON.stringify(enrichedProjects)),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error("Error fetching EPC projects:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to fetch EPC projects",
      projects: [],
      pagination: { page: 1, limit: 20, total: 0, pages: 0 },
    };
  }
}

export async function getEPCProjectById(projectId: string) {
  try {
    await connectToDatabase();

    const project = (await EPCProject.findOne({
      $or: [{ _id: projectId }, { projectId: projectId }],
    }).lean()) as Partial<IEPCProject>;

    if (!project) {
      return { success: false, error: "EPC project not found" };
    }

    // Calculate overall progress with null checks
    const overallProgress = project.phases
      ? Math.round(
          (project.phases.engineering?.progress || 0) * 0.3 +
            (project.phases.procurement?.progress || 0) * 0.3 +
            (project.phases.construction?.progress || 0) * 0.4
        )
      : 0;

    return {
      success: true,
      project: JSON.parse(JSON.stringify({ ...project, overallProgress })),
    };
  } catch (error) {
    console.error("Error fetching EPC project:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to fetch EPC project",
    };
  }
}

export async function getEPCDashboardStats() {
  try {
    // Check if MongoDB URI is available
    if (!process.env.MONGODB_URI) {
      return {
        success: false,
        error: "Database connection not available",
        stats: null,
      };
    }

    await connectToDatabase();

    // Project overview statistics
    const projectStats = await EPCProject.aggregate([
      {
        $group: {
          _id: null,
          totalProjects: { $sum: 1 },
          activeProjects: {
            $sum: {
              $cond: [{ $eq: ["$overallStatus", "active"] }, 1, 0],
            },
          },
          completedProjects: {
            $sum: {
              $cond: [{ $eq: ["$overallStatus", "completed"] }, 1, 0],
            },
          },
          totalBudget: { $sum: "$resources.budget.total" },
          totalSpent: { $sum: "$resources.budget.spent" },
          avgHealthScore: { $avg: "$healthScore" },
        },
      },
    ]);

    // Phase-wise statistics
    const phaseStats = await EPCProject.aggregate([
      {
        $project: {
          engineeringStatus: "$phases.engineering.status",
          procurementStatus: "$phases.procurement.status",
          constructionStatus: "$phases.construction.status",
          engineeringProgress: "$phases.engineering.progress",
          procurementProgress: "$phases.procurement.progress",
          constructionProgress: "$phases.construction.progress",
        },
      },
      {
        $group: {
          _id: null,
          engineeringInProgress: {
            $sum: {
              $cond: [{ $eq: ["$engineeringStatus", "in_progress"] }, 1, 0],
            },
          },
          procurementInProgress: {
            $sum: {
              $cond: [{ $eq: ["$procurementStatus", "in_progress"] }, 1, 0],
            },
          },
          constructionInProgress: {
            $sum: {
              $cond: [{ $eq: ["$constructionStatus", "in_progress"] }, 1, 0],
            },
          },
          avgEngineeringProgress: { $avg: "$engineeringProgress" },
          avgProcurementProgress: { $avg: "$procurementProgress" },
          avgConstructionProgress: { $avg: "$constructionProgress" },
        },
      },
    ]);

    // Priority distribution
    const priorityStats = await EPCProject.aggregate([
      {
        $group: {
          _id: "$priority",
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Recent projects
    const recentProjects = await EPCProject.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select(
        "projectId projectName overallStatus priority healthScore createdAt"
      )
      .lean();

    // Critical projects (health score < 70 or high priority)
    const criticalProjects = await EPCProject.find({
      $or: [{ healthScore: { $lt: 70 } }, { priority: "critical" }],
    })
      .sort({ healthScore: 1 })
      .limit(10)
      .select("projectId projectName overallStatus priority healthScore")
      .lean();

    return {
      success: true,
      stats: {
        overview: projectStats[0] || {
          totalProjects: 0,
          activeProjects: 0,
          completedProjects: 0,
          totalBudget: 0,
          totalSpent: 0,
          avgHealthScore: 100,
        },
        phases: phaseStats[0] || {
          engineeringInProgress: 0,
          procurementInProgress: 0,
          constructionInProgress: 0,
          avgEngineeringProgress: 0,
          avgProcurementProgress: 0,
          avgConstructionProgress: 0,
        },
        priorityDistribution: priorityStats,
        recentProjects: JSON.parse(JSON.stringify(recentProjects)),
        criticalProjects: JSON.parse(JSON.stringify(criticalProjects)),
      },
    };
  } catch (error) {
    console.error("Error fetching EPC dashboard stats:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to fetch EPC dashboard stats",
      stats: {
        overview: {
          totalProjects: 0,
          activeProjects: 0,
          completedProjects: 0,
          totalBudget: 0,
          totalSpent: 0,
          avgHealthScore: 100,
        },
        phases: {
          engineeringInProgress: 0,
          procurementInProgress: 0,
          constructionInProgress: 0,
          avgEngineeringProgress: 0,
          avgProcurementProgress: 0,
          avgConstructionProgress: 0,
        },
        priorityDistribution: [],
        recentProjects: [],
        criticalProjects: [],
      },
    };
  }
}

export async function deleteEPCProject(projectId: string) {
  try {
    await connectToDatabase();

    const deletedProject = await EPCProject.findOneAndDelete({
      $or: [{ _id: projectId }, { projectId: projectId }],
    });

    if (!deletedProject) {
      return { success: false, error: "EPC project not found" };
    }

    revalidatePath("/epc");
    revalidatePath("/epc/projects");

    return { success: true };
  } catch (error) {
    console.error("Error deleting EPC project:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to delete EPC project",
    };
  }
}
