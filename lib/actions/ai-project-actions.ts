"use server";

import { connectToDatabase } from "../../lib/mongodb";
import {
  IRailwaySiteExtended,
  RailwaySite,
  RailwaySiteExtended,
  Station,
} from "../../models";
import { revalidatePath } from "next/cache";

export interface AIProjectInsight {
  siteId: string;
  siteCode: string;
  siteName: string;
  predictedCompletionDate?: Date;
  currentCompletionPercentage: number;
  riskAssessment: "low" | "medium" | "high";
  potentialDelays: string[];
  suggestions: string[];
}

// Link a site to the hierarchy
export async function linkSiteToStation(siteId: string, stationId: string) {
  try {
    await connectToDatabase();

    // Get site details
    const site = await RailwaySite.findById(siteId);
    if (!site) {
      return { success: false, error: "Site not found" };
    }

    // Get station details with hierarchy information
    const station = await Station.findById(stationId);
    if (!station) {
      return { success: false, error: "Station not found" };
    }

    // Check if extended site data exists, create or update
    let siteExtended = await RailwaySiteExtended.findOne({ siteId });

    if (!siteExtended) {
      // Create new extended site data
      siteExtended = new RailwaySiteExtended({
        siteId: site._id,
        siteCode: site.id,
        stationId: station._id,
        stationName: station.name,
        stationCode: station.code,
        divisionId: station.divisionId,
        divisionName: station.divisionName,
        divisionCode: station.divisionCode,
        zoneId: station.zoneId,
        zoneName: station.zoneName,
        zoneCode: station.zoneCode,
        // Initialize project tracking data
        projectProgress: {
          overallCompletion: 0,
          milestones: [],
          currentPhase: "planning",
          startDate: new Date(),
          estimatedCompletionDate: new Date(
            Date.now() + 90 * 24 * 60 * 60 * 1000
          ), // 90 days from now
          lastUpdated: new Date(),
        },
        materials: [],
        team: [],
        documents: [],
        photos: [],
        weatherHistory: [],
        aiInsights: {
          lastUpdated: new Date(),
        },
        statusTimeline: [
          {
            status: site.status,
            timestamp: new Date(),
            notes: "Initial status when linked to station",
          },
        ],
      });
    } else {
      // Update existing extended site data
      siteExtended.stationId = station._id;
      siteExtended.stationName = station.name;
      siteExtended.stationCode = station.code;
      siteExtended.divisionId = station.divisionId;
      siteExtended.divisionName = station.divisionName;
      siteExtended.divisionCode = station.divisionCode;
      siteExtended.zoneId = station.zoneId;
      siteExtended.zoneName = station.zoneName;
      siteExtended.zoneCode = station.zoneCode;
    }

    await siteExtended.save();

    // Update station's site count
    await Station.findByIdAndUpdate(stationId, { $inc: { totalSites: 1 } });

    revalidatePath(`/sites/${site.id}`);
    revalidatePath("/sites");
    revalidatePath("/map");

    return { success: true, siteExtended };
  } catch (error) {
    console.error("Error linking site to station:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to link site to station",
    };
  }
}

// Update project progress
export async function updateProjectProgress(
  siteId: string,
  progressData: {
    overallCompletion: number;
    currentPhase: string;
    estimatedCompletionDate?: Date;
    revisedCompletionDate?: Date;
  }
) {
  try {
    await connectToDatabase();

    // Get site extended data
    const siteExtended = await RailwaySiteExtended.findOne({ siteId });
    if (!siteExtended) {
      return { success: false, error: "Site extended data not found" };
    }

    // Update progress data
    siteExtended.projectProgress.overallCompletion =
      progressData.overallCompletion;
    siteExtended.projectProgress.currentPhase = progressData.currentPhase;

    if (progressData.estimatedCompletionDate) {
      siteExtended.projectProgress.estimatedCompletionDate =
        progressData.estimatedCompletionDate;
    }

    if (progressData.revisedCompletionDate) {
      siteExtended.projectProgress.revisedCompletionDate =
        progressData.revisedCompletionDate;
    }

    siteExtended.projectProgress.lastUpdated = new Date();

    await siteExtended.save();

    // Update site status if needed based on phase
    let siteStatus;
    switch (progressData.currentPhase.toLowerCase()) {
      case "survey":
        siteStatus = "survey";
        break;
      case "design":
        siteStatus = "design";
        break;
      case "construction":
      case "installation":
        siteStatus = "construction";
        break;
      case "commissioning":
      case "testing":
        siteStatus = "operational";
        break;
      case "maintenance":
        siteStatus = "maintenance";
        break;
      default:
        siteStatus = null;
    }

    if (siteStatus) {
      const site = await RailwaySite.findById(siteId);
      if (site && site.status !== siteStatus) {
        site.status = siteStatus;
        await site.save();

        // Add to status timeline
        siteExtended.statusTimeline.push({
          status: siteStatus,
          timestamp: new Date(),
          notes: `Status updated based on project phase: ${progressData.currentPhase}`,
        });
        await siteExtended.save();
      }
    }

    revalidatePath(`/sites/${siteId}`);
    revalidatePath("/sites");
    revalidatePath("/map");

    return { success: true, projectProgress: siteExtended.projectProgress };
  } catch (error) {
    console.error("Error updating project progress:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to update project progress",
    };
  }
}

// Add project milestone
export async function addProjectMilestone(
  siteId: string,
  milestone: {
    name: string;
    description: string;
    plannedDate: Date;
    status: "pending" | "in-progress" | "completed" | "delayed";
    completionPercentage: number;
    criticalPath: boolean;
    tasks: {
      name: string;
      status: "pending" | "in-progress" | "completed" | "delayed";
      assignedTo?: string;
      plannedStartDate?: Date;
      plannedEndDate?: Date;
      completionPercentage: number;
    }[];
    dependencies?: string[];
  }
) {
  try {
    await connectToDatabase();

    // Get site extended data
    const siteExtended = await RailwaySiteExtended.findOne({ siteId });
    if (!siteExtended) {
      return { success: false, error: "Site extended data not found" };
    }

    // Format tasks with additional fields
    const formattedTasks = milestone.tasks.map((task) => ({
      ...task,
      lastUpdated: new Date(),
    }));

    // Add milestone
    siteExtended.projectProgress.milestones.push({
      ...milestone,
      tasks: formattedTasks,
      lastUpdated: new Date(),
    });

    siteExtended.projectProgress.lastUpdated = new Date();

    await siteExtended.save();

    revalidatePath(`/sites/${siteId}`);
    revalidatePath("/sites");

    return {
      success: true,
      milestones: siteExtended.projectProgress.milestones,
    };
  } catch (error) {
    console.error("Error adding project milestone:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to add project milestone",
    };
  }
}

// Update milestone status
export async function updateMilestoneStatus(
  siteId: string,
  milestoneIndex: number,
  statusData: {
    status: "pending" | "in-progress" | "completed" | "delayed";
    completionPercentage: number;
    actualDate?: Date;
    notes?: string;
  }
) {
  try {
    await connectToDatabase();

    // Get site extended data
    const siteExtended = await RailwaySiteExtended.findOne({ siteId });
    if (!siteExtended) {
      return { success: false, error: "Site extended data not found" };
    }

    // Check if milestone exists
    if (!siteExtended.projectProgress.milestones[milestoneIndex]) {
      return { success: false, error: "Milestone not found" };
    }

    // Update milestone status
    const milestone = siteExtended.projectProgress.milestones[milestoneIndex];
    milestone.status = statusData.status;
    milestone.completionPercentage = statusData.completionPercentage;

    if (statusData.actualDate) {
      milestone.actualDate = statusData.actualDate;
    }

    milestone.lastUpdated = new Date();
    siteExtended.projectProgress.lastUpdated = new Date();

    // Recalculate overall completion
    const totalMilestones = siteExtended.projectProgress.milestones.length;
    const completionSum = siteExtended.projectProgress.milestones.reduce(
      (sum, m) => sum + m.completionPercentage,
      0
    );

    siteExtended.projectProgress.overallCompletion =
      totalMilestones > 0 ? completionSum / totalMilestones : 0;

    await siteExtended.save();

    revalidatePath(`/sites/${siteId}`);
    revalidatePath("/sites");

    return { success: true, milestone };
  } catch (error) {
    console.error("Error updating milestone status:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to update milestone status",
    };
  }
}

// Add/update task in milestone
export async function updateMilestoneTask(
  siteId: string,
  milestoneIndex: number,
  taskIndex: number,
  taskData: {
    name: string;
    status: "pending" | "in-progress" | "completed" | "delayed";
    assignedTo?: string;
    actualStartDate?: Date;
    actualEndDate?: Date;
    completionPercentage: number;
    notes?: string;
    updatedBy?: string;
  }
) {
  try {
    await connectToDatabase();

    // Get site extended data
    const siteExtended = await RailwaySiteExtended.findOne({ siteId });
    if (!siteExtended) {
      return { success: false, error: "Site extended data not found" };
    }

    // Check if milestone exists
    if (!siteExtended.projectProgress.milestones[milestoneIndex]) {
      return { success: false, error: "Milestone not found" };
    }

    const milestone = siteExtended.projectProgress.milestones[milestoneIndex];

    // Check if we're updating an existing task or adding new
    if (taskIndex >= 0 && taskIndex < milestone.tasks.length) {
      // Update existing task
      const task = milestone.tasks[taskIndex];
      Object.assign(task, taskData, { lastUpdated: new Date() });
    } else if (taskIndex === -1) {
      // Add new task
      milestone.tasks.push({
        ...taskData,
        lastUpdated: new Date(),
      });
    } else {
      return { success: false, error: "Invalid task index" };
    }

    // Update milestone completion based on tasks
    const totalTasks = milestone.tasks.length;
    const completionSum = milestone.tasks.reduce(
      (sum, t) => sum + t.completionPercentage,
      0
    );

    milestone.completionPercentage =
      totalTasks > 0 ? completionSum / totalTasks : 0;
    milestone.lastUpdated = new Date();

    // Recalculate overall completion
    const totalMilestones = siteExtended.projectProgress.milestones.length;
    const milestoneCompletionSum =
      siteExtended.projectProgress.milestones.reduce(
        (sum, m) => sum + m.completionPercentage,
        0
      );

    siteExtended.projectProgress.overallCompletion =
      totalMilestones > 0 ? milestoneCompletionSum / totalMilestones : 0;

    siteExtended.projectProgress.lastUpdated = new Date();

    await siteExtended.save();

    revalidatePath(`/sites/${siteId}`);
    revalidatePath("/sites");

    return { success: true, milestone };
  } catch (error) {
    console.error("Error updating milestone task:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to update milestone task",
    };
  }
}

// Material tracking functions
export async function addMaterial(
  siteId: string,
  materialData: {
    name: string;
    category: string;
    quantity: number;
    unit: string;
    status: "ordered" | "shipped" | "delivered" | "installed" | "defective";
    orderDate?: Date;
    expectedDeliveryDate?: Date;
    supplier?: string;
    notes?: string;
  }
) {
  try {
    await connectToDatabase();

    // Get site extended data
    const siteExtended = await RailwaySiteExtended.findOne({ siteId });
    if (!siteExtended) {
      return { success: false, error: "Site extended data not found" };
    }

    // Add material
    siteExtended.materials.push(materialData);

    await siteExtended.save();

    revalidatePath(`/sites/${siteId}`);

    return { success: true, materials: siteExtended.materials };
  } catch (error) {
    console.error("Error adding material:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to add material",
    };
  }
}

export async function updateMaterialStatus(
  siteId: string,
  materialIndex: number,
  statusData: {
    status: "ordered" | "shipped" | "delivered" | "installed" | "defective";
    actualDeliveryDate?: Date;
    installationDate?: Date;
    notes?: string;
  }
) {
  try {
    await connectToDatabase();

    // Get site extended data
    const siteExtended = await RailwaySiteExtended.findOne({ siteId });
    if (!siteExtended) {
      return { success: false, error: "Site extended data not found" };
    }

    // Check if material exists
    if (!siteExtended.materials[materialIndex]) {
      return { success: false, error: "Material not found" };
    }

    // Update material status
    const material = siteExtended.materials[materialIndex];
    material.status = statusData.status;

    if (statusData.actualDeliveryDate) {
      material.actualDeliveryDate = statusData.actualDeliveryDate;
    }

    if (statusData.installationDate) {
      material.installationDate = statusData.installationDate;
    }

    if (statusData.notes) {
      material.notes = statusData.notes;
    }

    await siteExtended.save();

    revalidatePath(`/sites/${siteId}`);

    return { success: true, material };
  } catch (error) {
    console.error("Error updating material status:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to update material status",
    };
  }
}

// Team management functions
export async function addTeamMember(
  siteId: string,
  memberData: {
    name: string;
    role: string;
    contactInfo: string;
    expertise: string[];
    availability: {
      startDate: Date;
      endDate?: Date;
    };
  }
) {
  try {
    await connectToDatabase();

    // Get site extended data
    const siteExtended = await RailwaySiteExtended.findOne({ siteId });
    if (!siteExtended) {
      return { success: false, error: "Site extended data not found" };
    }

    // Add team member
    siteExtended.team.push({
      ...memberData,
      availability: [memberData.availability],
    });

    await siteExtended.save();

    revalidatePath(`/sites/${siteId}`);

    return { success: true, team: siteExtended.team };
  } catch (error) {
    console.error("Error adding team member:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to add team member",
    };
  }
}

// Document and photo management
export async function addDocument(
  siteId: string,
  documentData: {
    name: string;
    type: string;
    url: string;
    tags: string[];
  }
) {
  try {
    await connectToDatabase();

    // Get site extended data
    const siteExtended = await RailwaySiteExtended.findOne({ siteId });
    if (!siteExtended) {
      return { success: false, error: "Site extended data not found" };
    }

    // Add document with AI-generated metadata (placeholder)
    siteExtended.documents.push({
      ...documentData,
      aiGeneratedMetadata: {
        contentSummary: "AI content summary will be generated",
        detectedEntities: ["entity1", "entity2"],
        relevance: 0.95,
      },
      uploadedAt: new Date(),
    });

    await siteExtended.save();

    revalidatePath(`/sites/${siteId}`);

    return { success: true, documents: siteExtended.documents };
  } catch (error) {
    console.error("Error adding document:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to add document",
    };
  }
}

export async function addPhoto(
  siteId: string,
  photoData: {
    name: string;
    url: string;
    location?: {
      latitude: number;
      longitude: number;
    };
    timestamp: Date;
    tags: string[];
    notes?: string;
  }
) {
  try {
    await connectToDatabase();

    // Get site extended data
    const siteExtended = await RailwaySiteExtended.findOne({ siteId });
    if (!siteExtended) {
      return { success: false, error: "Site extended data not found" };
    }

    // Add photo with AI-generated tags (placeholder)
    siteExtended.photos.push({
      ...photoData,
      aiGeneratedTags: ["solar panel", "roof", "installation"],
      aiDetectedObjects: ["solar panel", "worker", "mounting hardware"],
    });

    await siteExtended.save();

    revalidatePath(`/sites/${siteId}`);

    return { success: true, photos: siteExtended.photos };
  } catch (error) {
    console.error("Error adding photo:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to add photo",
    };
  }
}

// Weather data tracking
export async function addWeatherData(
  siteId: string,
  weatherData: {
    date: Date;
    temperature: number;
    conditions: string;
    rainfall: number;
    humidity: number;
    windSpeed: number;
    workingHoursLost?: number;
    impact: "none" | "low" | "medium" | "high";
  }
) {
  try {
    await connectToDatabase();

    // Get site extended data
    const siteExtended = await RailwaySiteExtended.findOne({ siteId });
    if (!siteExtended) {
      return { success: false, error: "Site extended data not found" };
    }

    // Add weather data
    siteExtended.weatherHistory.push(weatherData);

    await siteExtended.save();

    revalidatePath(`/sites/${siteId}`);

    return { success: true, weatherHistory: siteExtended.weatherHistory };
  } catch (error) {
    console.error("Error adding weather data:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to add weather data",
    };
  }
}

// Advanced AI insights generation with resource optimization
export async function generateAIInsights(siteId: string) {
  try {
    await connectToDatabase();

    // Get site extended data
    const siteExtended = await RailwaySiteExtended.findOne({ siteId });
    if (!siteExtended) {
      return { success: false, error: "Site extended data not found" };
    }

    // Get site data
    const site = await RailwaySite.findById(siteId);
    if (!site) {
      return { success: false, error: "Site not found" };
    }

    // Get nearby sites for resource optimization suggestions
    const nearbySitesResult = await findNearbySites(siteId, 100);
    const nearbySites = nearbySitesResult.success
      ? nearbySitesResult.nearbySites || []
      : [];

    // Calculate predicted completion date based on progress with enhanced algorithm
    const currentProgress = siteExtended.projectProgress.overallCompletion;
    const startDate = new Date(siteExtended.projectProgress.startDate);
    const originalEstimatedCompletionDate = new Date(
      siteExtended.projectProgress.estimatedCompletionDate
    );

    const totalProjectDays =
      (originalEstimatedCompletionDate.getTime() - startDate.getTime()) /
      (1000 * 60 * 60 * 24);
    const daysElapsed =
      (new Date().getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);

    let predictedCompletionDate;
    let riskAssessment: "low" | "medium" | "high";
    const potentialDelays: string[] = [];
    const suggestionForImprovement: string[] = [];
    const resourceOptimizations: string[] = [];
    const qualityIssues: string[] = [];
    let efficiencyScore = 0;

    // Enhanced completion prediction
    if (currentProgress > 0) {
      // Use weighted progress calculation instead of simple average
      // More recent progress is weighted more heavily
      const milestones = siteExtended.projectProgress.milestones || [];
      // Variable to store progress rate based on recent data - will be used if needed

      if (milestones.length >= 3) {
        // Calculate progress rate based on the most recent milestone completions
        const recentMilestones = [...milestones]
          .sort(
            (a, b) =>
              new Date(b.lastUpdated).getTime() -
              new Date(a.lastUpdated).getTime()
          )
          .slice(0, 3);

        // Check if we have completion dates to calculate velocity
        const milestonesWithDates = recentMilestones.filter(
          (m) => m.plannedDate && m.actualDate && m.status === "completed"
        );

        if (milestonesWithDates.length >= 2) {
          // Calculate average delay or advance from recent milestones
          const delaySum = milestonesWithDates.reduce((sum, m) => {
            const planned = new Date(m.plannedDate).getTime();
            const actual = new Date(m.actualDate as Date).getTime();
            return sum + (actual - planned) / (1000 * 60 * 60 * 24); // convert to days
          }, 0);

          const avgDelay = delaySum / milestonesWithDates.length;

          // Adjust the estimated completion date based on recent performance
          predictedCompletionDate = new Date(originalEstimatedCompletionDate);
          predictedCompletionDate.setDate(
            originalEstimatedCompletionDate.getDate() + avgDelay
          );
        } else {
          // Use traditional method if we don't have enough milestone date data
          const progressPerDay = currentProgress / daysElapsed;
          const daysRemaining = (100 - currentProgress) / progressPerDay;

          predictedCompletionDate = new Date();
          predictedCompletionDate.setDate(
            predictedCompletionDate.getDate() + daysRemaining
          );
        }
      } else {
        // Use traditional method if we don't have enough milestones
        const progressPerDay = currentProgress / daysElapsed;
        const daysRemaining =
          progressPerDay > 0
            ? (100 - currentProgress) / progressPerDay
            : totalProjectDays;

        predictedCompletionDate = new Date();
        predictedCompletionDate.setDate(
          predictedCompletionDate.getDate() + daysRemaining
        );
      }

      // Determine risk level with enhanced factors
      const predictedDelay =
        (predictedCompletionDate.getTime() -
          originalEstimatedCompletionDate.getTime()) /
        (1000 * 60 * 60 * 24);

      // Consider additional risk factors
      let riskScore = 0;

      // Base risk from schedule delay
      if (predictedDelay <= 0) {
        riskScore += 1; // Low risk from schedule
      } else if (predictedDelay <= totalProjectDays * 0.2) {
        riskScore += 2; // Medium risk from schedule
      } else {
        riskScore += 3; // High risk from schedule
      }

      // Weather risk factor
      if (siteExtended.weatherHistory?.length > 0) {
        const recentWeather = siteExtended.weatherHistory
          .sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          )
          .slice(0, 10);

        const badWeatherDays = recentWeather.filter(
          (w) => w.impact === "high" || w.impact === "medium"
        ).length;

        if (badWeatherDays >= 5) {
          riskScore += 1;
          potentialDelays.push(
            "Adverse weather conditions causing significant delays"
          );
        }

        // Use ML model simulation to predict future weather impact
        const today = new Date();
        const month = today.getMonth();
        const isRainyMonth = month >= 5 && month <= 8; // June to September

        if (isRainyMonth && badWeatherDays > 2) {
          riskScore += 1;
          potentialDelays.push(
            "Monsoon season likely to cause additional delays"
          );
        }
      }

      // Material risk factor
      const pendingMaterials =
        siteExtended.materials?.filter(
          (m) => m.status !== "delivered" && m.status !== "installed"
        ) || [];

      if (pendingMaterials.length > 0) {
        // Check if any materials are critically delayed
        const criticalMaterials = pendingMaterials.filter((m) => {
          if (m.expectedDeliveryDate) {
            const expectedDate = new Date(m.expectedDeliveryDate);
            const today = new Date();
            const daysOverdue =
              (today.getTime() - expectedDate.getTime()) /
              (1000 * 60 * 60 * 24);
            return daysOverdue > 7; // More than a week overdue
          }
          return false;
        });

        if (criticalMaterials.length > 0) {
          riskScore += 1.5;
          potentialDelays.push(
            `${criticalMaterials.length} critical materials overdue by more than 7 days`
          );
        } else {
          potentialDelays.push(
            `${pendingMaterials.length} material items still pending delivery or installation`
          );
          riskScore += 0.5;
        }
      }

      // Milestone risk factor
      const criticalPathMilestones =
        siteExtended.projectProgress.milestones?.filter(
          (m) => m.criticalPath
        ) || [];
      const delayedCriticalMilestones = criticalPathMilestones.filter(
        (m) => m.status === "delayed"
      );

      if (delayedCriticalMilestones.length > 0) {
        riskScore += delayedCriticalMilestones.length * 0.5; // 0.5 point per delayed milestone
        potentialDelays.push(
          `${delayedCriticalMilestones.length} critical path milestones are currently delayed`
        );
      }

      // Calculate efficiency score (0-100)
      const taskCompletions =
        siteExtended.projectProgress.milestones
          ?.flatMap((m) =>
            m.tasks
              .filter((t) => t.status === "completed")
              .map((t) => {
                if (t.plannedEndDate && t.actualEndDate) {
                  const planned = new Date(t.plannedEndDate).getTime();
                  const actual = new Date(t.actualEndDate).getTime();
                  return {
                    onTime: actual <= planned,
                    delay: (actual - planned) / (1000 * 60 * 60 * 24), // days
                  };
                }
                return null;
              })
          )
          .filter(Boolean) || [];

      if (taskCompletions.length > 0) {
        const onTimeRate =
          taskCompletions.filter((t) => t.onTime).length /
          taskCompletions.length;
        const avgDelay =
          taskCompletions.reduce((sum, t) => sum + (t.delay || 0), 0) /
          taskCompletions.length;

        efficiencyScore = Math.round(
          100 * (onTimeRate * 0.7 + Math.max(0, 1 - avgDelay / 14) * 0.3)
        );

        if (efficiencyScore < 60) {
          riskScore += 1.5;
          qualityIssues.push(
            "Low task completion efficiency indicates possible quality issues"
          );
        }
      }

      // Team expertise factor
      const teamMembers = siteExtended.team || [];
      if (teamMembers.length === 0) {
        riskScore += 1;
        potentialDelays.push("No team members assigned to the project");
      }

      // Final risk assessment
      if (riskScore <= 2) {
        riskAssessment = "low";
      } else if (riskScore <= 4) {
        riskAssessment = "medium";
      } else {
        riskAssessment = "high";
      }

      // Generate intelligent suggestions for improvement

      // Schedule optimization
      if (predictedDelay > 0) {
        if (predictedDelay >= totalProjectDays * 0.3) {
          // Significant delay
          suggestionForImprovement.push(
            "Consider revising project timeline and communicating new expectations to stakeholders"
          );
        }

        suggestionForImprovement.push(
          "Allocate additional resources to critical path activities"
        );
      }

      // Material optimization
      if (pendingMaterials.length > 0) {
        const criticallyDelayed = pendingMaterials.filter((m) => {
          if (m.expectedDeliveryDate) {
            const expectedDate = new Date(m.expectedDeliveryDate);
            const today = new Date();
            return today > expectedDate;
          }
          return false;
        });

        if (criticallyDelayed.length > 0) {
          suggestionForImprovement.push(
            "Escalate procurement for delayed materials and consider alternative suppliers"
          );
        } else {
          suggestionForImprovement.push(
            "Expedite pending material deliveries to prevent installation delays"
          );
        }
      }

      // Critical milestone optimization
      if (delayedCriticalMilestones.length > 0) {
        suggestionForImprovement.push(
          "Prioritize completion of delayed critical path milestones"
        );
      }

      // Resource optimization with nearby sites
      if (nearbySites.length > 0) {
        const nearbySitesByStatus = {
          completed: nearbySites.filter((s) => s.status === "completed"),
          construction: nearbySites.filter((s) => s.status === "construction"),
          planning: nearbySites.filter((s) =>
            ["planning", "survey", "design"].includes(s.status)
          ),
        };

        if (
          nearbySitesByStatus.construction.length > 0 &&
          nearbySitesByStatus.construction.some((s) => s.distance < 30)
        ) {
          const closestSites = nearbySitesByStatus.construction
            .filter((s) => s.distance < 30)
            .sort((a, b) => a.distance - b.distance)
            .slice(0, 3)
            .map((s) => s.name)
            .join(", ");

          resourceOptimizations.push(
            `Consider resource sharing with nearby construction sites (${closestSites}) to optimize crew allocation`
          );
        }

        if (
          nearbySitesByStatus.planning.length > 0 &&
          site.status === "construction"
        ) {
          resourceOptimizations.push(
            "Share lessons learned with planning-phase sites nearby to improve their preparation"
          );
        }
      }

      // Quality assurance suggestions
      if (efficiencyScore < 70) {
        qualityIssues.push(
          "Conduct additional quality checks on recently completed work"
        );
      }
    } else {
      // No progress data available
      predictedCompletionDate = originalEstimatedCompletionDate;
      riskAssessment = "medium";
      potentialDelays.push(
        "Insufficient progress data for accurate prediction"
      );
      suggestionForImprovement.push(
        "Begin tracking detailed progress data to enable accurate predictions"
      );
    }

    // Combine all suggestions, avoiding duplicates
    const allSuggestions = [
      ...suggestionForImprovement,
      ...resourceOptimizations,
      ...qualityIssues,
    ];
    const uniqueSuggestions = Array.from(new Set(allSuggestions));

    // Find nearby sites that might be related
    const nearbyRelatedSites = nearbySites
      .filter((site) => site.distance <= 50)
      .map((site) => ({
        siteId: site.id.toString(),
        siteCode: site.siteCode,
        name: site.name,
        distance: site.distance,
        status: site.status,
      }));

    // Update AI insights
    siteExtended.aiInsights = {
      predictedCompletionDate,
      riskAssessment,
      potentialDelays,
      suggestionForImprovement: uniqueSuggestions,
      nearbyRelatedSites: nearbyRelatedSites.slice(0, 5), // Top 5 nearby sites
      efficiencyScore,
      qualityIssues,
      resourceOptimizations,
      lastUpdated: new Date(),
    };

    await siteExtended.save();

    revalidatePath(`/sites/${siteId}`);

    return {
      success: true,
      aiInsights: siteExtended.aiInsights,
    };
  } catch (error) {
    console.error("Error generating AI insights:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to generate AI insights",
    };
  }
}

// Find nearby sites for route optimization
export async function findNearbySites(
  siteId: string,
  maxDistanceKm: number = 50
) {
  try {
    await connectToDatabase();

    // Get site data
    const site = await RailwaySite.findById(siteId).lean();
    if (!site) {
      return { success: false, error: "Site not found" };
    }

    // Find nearby sites based on geospatial query
    // This is a simplified calculation - for production use a proper geospatial index
    const allSites = await RailwaySite.find({
      _id: { $ne: siteId },
      latitude: { $gte: site.latitude - 0.5, $lte: site.latitude + 0.5 },
      longitude: { $gte: site.longitude - 0.5, $lte: site.longitude + 0.5 },
    }).lean();

    // Calculate actual distances
    const nearbySites = allSites
      .map((nearbySite) => {
        // Calculate distance using Haversine formula
        const distance = calculateDistance(
          site.latitude,
          site.longitude,
          nearbySite.latitude,
          nearbySite.longitude
        );

        return {
          id: nearbySite._id,
          siteCode: nearbySite.id,
          name: nearbySite.locationName,
          distance: distance,
          coordinates: {
            latitude: nearbySite.latitude,
            longitude: nearbySite.longitude,
          },
          status: nearbySite.status,
        };
      })
      .filter((site) => site.distance <= maxDistanceKm)
      .sort((a, b) => a.distance - b.distance);

    return { success: true, nearbySites };
  } catch (error) {
    console.error("Error finding nearby sites:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to find nearby sites",
    };
  }
}

// Helper function to calculate distance between coordinates using Haversine formula
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
}

// Generate project report with photos and progress data
export async function generateProjectReport(siteId: string) {
  try {
    await connectToDatabase();

    // Get site and extended data
    const [site, siteExtended] = await Promise.all([
      RailwaySite.findById(siteId).lean(),
      RailwaySiteExtended.findOne({ siteId }).lean(),
    ]);

    if (!site) {
      return { success: false, error: "Site not found" };
    }

    if (!siteExtended) {
      return { success: false, error: "Site extended data not found" };
    }

    // Generate report data (in a real implementation, this would create a PDF or document)
    const report = {
      siteInfo: {
        id: site.id,
        name: site.locationName,
        address: site.address,
        coordinates: {
          latitude: site.latitude,
          longitude: site.longitude,
        },
        status: site.status,
        feasibleCapacity: site.feasibleCapacity,
      },
      hierarchyInfo: {
        station: siteExtended.stationName,
        division: siteExtended.divisionName,
        zone: siteExtended.zoneName,
      },
      progressSummary: {
        overallCompletion: siteExtended.projectProgress.overallCompletion,
        currentPhase: siteExtended.projectProgress.currentPhase,
        startDate: siteExtended.projectProgress.startDate,
        estimatedCompletionDate:
          siteExtended.projectProgress.estimatedCompletionDate,
        revisedCompletionDate:
          siteExtended.projectProgress.revisedCompletionDate,
        milestones: siteExtended.projectProgress.milestones.map((m) => ({
          name: m.name,
          status: m.status,
          completionPercentage: m.completionPercentage,
          plannedDate: m.plannedDate,
          actualDate: m.actualDate,
        })),
      },
      materialsStatus: siteExtended.materials.map((m) => ({
        name: m.name,
        status: m.status,
        quantity: `${m.quantity} ${m.unit}`,
      })),
      photosCount: siteExtended.photos.length,
      recentPhotos: siteExtended.photos.slice(-5).map((p) => ({
        url: p.url,
        timestamp: p.timestamp,
        tags: [...p.tags, ...(p.aiGeneratedTags || [])],
      })),
      documentsCount: siteExtended.documents.length,
      aiInsights: siteExtended.aiInsights,
      generatedAt: new Date(),
    };

    return {
      success: true,
      report,
      message:
        "Report generated successfully. In a production environment, this would generate a PDF or document for download.",
    };
  } catch (error) {
    console.error("Error generating project report:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to generate project report",
    };
  }
}

// Optimize survey routes for multiple sites
export async function optimizeSurveyRoute(
  startingSiteId: string,
  sitesToVisit: string[],
  constraints: {
    maxTravelDistance?: number;
    maxTravelTime?: number;
    prioritySites?: string[];
    visitDurations?: Record<string, number>; // siteId -> minutes required
    mustVisitFirst?: string[];
    mustVisitLast?: string[];
  } = {}
) {
  try {
    await connectToDatabase();

    // Get starting site
    const startingSite = await RailwaySite.findById(startingSiteId).lean();
    if (!startingSite) {
      return { success: false, error: "Starting site not found" };
    }

    // Get all sites to visit
    const allSitesToVisit = await RailwaySite.find({
      _id: { $in: sitesToVisit },
    }).lean();

    if (allSitesToVisit.length === 0) {
      return { success: false, error: "No valid sites to visit found" };
    }

    // Create distance matrix between all sites
    const sites = [
      startingSite,
      ...allSitesToVisit.filter(
        (site) => site._id.toString() !== startingSiteId
      ),
    ];
    const distanceMatrix: number[][] = [];

    for (let i = 0; i < sites.length; i++) {
      distanceMatrix[i] = [];
      for (let j = 0; j < sites.length; j++) {
        if (i === j) {
          distanceMatrix[i][j] = 0;
        } else {
          distanceMatrix[i][j] = calculateDistance(
            sites[i].latitude,
            sites[i].longitude,
            sites[j].latitude,
            sites[j].longitude
          );
        }
      }
    }

    // In a real implementation, this would use an advanced algorithm like:
    // 1. Genetic algorithm for TSP (Traveling Salesman Problem)
    // 2. Google OR-Tools or similar optimization library
    // 3. Machine learning model to consider historical travel patterns

    // For this example, we'll use a greedy algorithm with constraints
    const route: number[] = [0]; // Start with the starting site
    let currentSiteIndex = 0;
    const remainingSites = new Set(
      Array.from({ length: sites.length - 1 }, (_, i) => i + 1)
    );
    let totalDistance = 0;

    // Handle priority sites first (if they're not required to be last)
    if (constraints.prioritySites && constraints.prioritySites.length > 0) {
      const prioritySiteIndices = constraints.prioritySites
        .map((id) => sites.findIndex((s) => s._id.toString() === id))
        .filter(
          (idx) =>
            idx !== -1 &&
            !constraints.mustVisitLast?.includes(sites[idx]._id.toString())
        );

      for (const idx of prioritySiteIndices) {
        if (remainingSites.has(idx)) {
          route.push(idx);
          totalDistance += distanceMatrix[currentSiteIndex][idx];
          currentSiteIndex = idx;
          remainingSites.delete(idx);
        }
      }
    }

    // Handle must visit first sites
    if (constraints.mustVisitFirst && constraints.mustVisitFirst.length > 0) {
      const firstSiteIndices = constraints.mustVisitFirst
        .map((id) => sites.findIndex((s) => s._id.toString() === id))
        .filter((idx) => idx !== -1);

      // Sort by distance from current position
      firstSiteIndices.sort(
        (a, b) =>
          distanceMatrix[currentSiteIndex][a] -
          distanceMatrix[currentSiteIndex][b]
      );

      for (const idx of firstSiteIndices) {
        if (remainingSites.has(idx)) {
          route.push(idx);
          totalDistance += distanceMatrix[currentSiteIndex][idx];
          currentSiteIndex = idx;
          remainingSites.delete(idx);
        }
      }
    }

    // Process remaining sites (greedy algorithm - nearest neighbor)
    while (remainingSites.size > 0) {
      // Find the nearest unvisited site
      let nearestSite = -1;
      let shortestDistance = Infinity;

      for (const siteIdx of remainingSites) {
        // Skip sites that must be visited last
        if (
          constraints.mustVisitLast?.includes(sites[siteIdx]._id.toString())
        ) {
          continue;
        }

        const distance = distanceMatrix[currentSiteIndex][siteIdx];
        if (distance < shortestDistance) {
          shortestDistance = distance;
          nearestSite = siteIdx;
        }
      }

      // Check if we've exceeded max travel distance
      if (
        constraints.maxTravelDistance &&
        totalDistance + shortestDistance > constraints.maxTravelDistance
      ) {
        break;
      }

      if (nearestSite !== -1) {
        route.push(nearestSite);
        totalDistance += shortestDistance;
        currentSiteIndex = nearestSite;
        remainingSites.delete(nearestSite);
      } else {
        // No valid next site found
        break;
      }
    }

    // Handle must visit last sites
    if (constraints.mustVisitLast && constraints.mustVisitLast.length > 0) {
      const lastSiteIndices = constraints.mustVisitLast
        .map((id) => sites.findIndex((s) => s._id.toString() === id))
        .filter((idx) => idx !== -1);

      // Sort by distance from current position
      lastSiteIndices.sort(
        (a, b) =>
          distanceMatrix[currentSiteIndex][a] -
          distanceMatrix[currentSiteIndex][b]
      );

      for (const idx of lastSiteIndices) {
        if (remainingSites.has(idx)) {
          route.push(idx);
          totalDistance += distanceMatrix[currentSiteIndex][idx];
          currentSiteIndex = idx;
          remainingSites.delete(idx);
        }
      }
    }

    // Map indices back to actual sites
    const optimizedRoute = route.map((idx) => ({
      site: {
        id: sites[idx]._id,
        code: sites[idx].id,
        name: sites[idx].locationName,
        coordinates: {
          latitude: sites[idx].latitude,
          longitude: sites[idx].longitude,
        },
        address: sites[idx].address,
      },
      estimatedVisitTime:
        constraints.visitDurations?.[sites[idx]._id.toString()] || 60, // Default 60 minutes
      distanceFromPrevious:
        idx === 0 ? 0 : distanceMatrix[route[route.indexOf(idx) - 1]][idx],
    }));

    const unvisitedSites = Array.from(remainingSites).map((idx) => ({
      id: sites[idx]._id,
      code: sites[idx].id,
      name: sites[idx].locationName,
    }));

    return {
      success: true,
      optimizedRoute,
      totalDistance,
      estimatedTime: optimizedRoute.reduce(
        (sum, site) => sum + site.estimatedVisitTime,
        0
      ),
      unvisitedSites: unvisitedSites.length > 0 ? unvisitedSites : undefined,
    };
  } catch (error) {
    console.error("Error optimizing survey route:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to optimize survey route",
    };
  }
}

// Predict project delays based on weather forecasts and historical data
export async function predictWeatherImpact(
  siteId: string,
  forecastDays: number = 15
) {
  try {
    await connectToDatabase();

    // Get site and extended data
    const [site, siteExtended] = await Promise.all([
      RailwaySite.findById(siteId).lean(),
      RailwaySiteExtended.findOne({ siteId }).lean(),
    ]);

    if (!site) {
      return { success: false, error: "Site not found" };
    }

    if (!siteExtended) {
      return { success: false, error: "Site extended data not found" };
    }

    // In a real implementation, this would call a weather API for forecast data
    // For this demo, we'll generate simulated weather forecast
    const today = new Date();
    const forecast = Array.from({ length: forecastDays }, (_, i) => {
      const forecastDate = new Date(today);
      forecastDate.setDate(today.getDate() + i);

      // Simulate seasonal weather patterns - more rain in monsoon months
      const month = forecastDate.getMonth();
      const isRainyMonth = month >= 5 && month <= 8; // June to September

      // Generate weather conditions with higher chance of rain in monsoon
      const rainProbability = isRainyMonth ? 0.4 : 0.1;
      const willRain = Math.random() < rainProbability;

      return {
        date: forecastDate,
        temperature: Math.round(20 + Math.random() * 15), // 20-35°C
        conditions: willRain
          ? Math.random() > 0.5
            ? "Heavy Rain"
            : "Light Rain"
          : Math.random() > 0.5
          ? "Sunny"
          : "Partly Cloudy",
        rainfall: willRain ? Math.round(Math.random() * 50) : 0, // 0-50mm
        humidity: Math.round(50 + Math.random() * 50), // 50-100%
        windSpeed: Math.round(Math.random() * 30), // 0-30 km/h
        predictedImpact: "unknown" as
          | "none"
          | "low"
          | "medium"
          | "high"
          | "unknown",
      };
    });

    // Analyze historical weather impact
    const historicalWeather = siteExtended.weatherHistory || [];

    // If we have sufficient historical data, use it to predict impact
    if (historicalWeather.length >= 5) {
      // Simple ML model simulation - in real implementation, this would be a trained model
      forecast.forEach((day) => {
        // Calculate impact based on similar historical days
        if (day.rainfall > 30) {
          // Check past high rainfall days
          const highRainDays = historicalWeather.filter(
            (hw) => hw.rainfall > 30
          );
          if (highRainDays.length > 0) {
            const avgImpact =
              highRainDays.reduce((sum, hw) => {
                return (
                  sum +
                  (hw.impact === "high"
                    ? 3
                    : hw.impact === "medium"
                    ? 2
                    : hw.impact === "low"
                    ? 1
                    : 0)
                );
              }, 0) / highRainDays.length;

            day.predictedImpact =
              avgImpact > 2.5 ? "high" : avgImpact > 1.5 ? "medium" : "low";
          } else {
            day.predictedImpact = "high"; // Default for heavy rain
          }
        } else if (day.rainfall > 10) {
          // Medium rainfall
          const mediumRainDays = historicalWeather.filter(
            (hw) => hw.rainfall > 10 && hw.rainfall <= 30
          );
          if (mediumRainDays.length > 0) {
            const avgImpact =
              mediumRainDays.reduce((sum, hw) => {
                return (
                  sum +
                  (hw.impact === "high"
                    ? 3
                    : hw.impact === "medium"
                    ? 2
                    : hw.impact === "low"
                    ? 1
                    : 0)
                );
              }, 0) / mediumRainDays.length;

            day.predictedImpact =
              avgImpact > 2.5 ? "high" : avgImpact > 1.5 ? "medium" : "low";
          } else {
            day.predictedImpact = "medium"; // Default for medium rain
          }
        } else if (day.windSpeed > 25) {
          day.predictedImpact = "medium"; // High winds
        } else {
          day.predictedImpact = "low";
        }
      });
    } else {
      // Without sufficient historical data, use general rules
      forecast.forEach((day) => {
        if (day.rainfall > 30) {
          day.predictedImpact = "high";
        } else if (day.rainfall > 10 || day.windSpeed > 25) {
          day.predictedImpact = "medium";
        } else if (day.conditions.includes("Rain")) {
          day.predictedImpact = "low";
        } else {
          day.predictedImpact = "none";
        }
      });
    }

    // Calculate potential delay based on forecast and current project phase
    const currentPhase =
      siteExtended.projectProgress?.currentPhase || "planning";
    const isConstructionPhase = ["construction", "installation"].includes(
      currentPhase.toLowerCase()
    );
    const isDesignPhase = ["design", "planning"].includes(
      currentPhase.toLowerCase()
    );

    // Count high/medium impact days
    const highImpactDays = forecast.filter(
      (day) => day.predictedImpact === "high"
    ).length;
    const mediumImpactDays = forecast.filter(
      (day) => day.predictedImpact === "medium"
    ).length;

    // Calculate predicted delay
    let predictedDelay = 0;
    if (isConstructionPhase) {
      // Construction is highly affected by weather
      predictedDelay = highImpactDays * 1.0 + mediumImpactDays * 0.5;
    } else if (isDesignPhase) {
      // Design phase less affected
      predictedDelay = highImpactDays * 0.2 + mediumImpactDays * 0.1;
    } else {
      // Other phases
      predictedDelay = highImpactDays * 0.5 + mediumImpactDays * 0.25;
    }

    // Round to nearest half day
    predictedDelay = Math.round(predictedDelay * 2) / 2;

    // Generate recommendations based on weather impact
    const recommendations = [];
    if (predictedDelay > 3) {
      recommendations.push(
        `Consider adding ${Math.ceil(
          predictedDelay
        )} buffer days to the timeline due to forecast adverse weather`
      );
      recommendations.push(
        "Plan indoor work activities during predicted heavy rainfall days"
      );
    }

    if (highImpactDays > 2 && isConstructionPhase) {
      recommendations.push(
        "Secure construction materials and equipment for upcoming high impact weather days"
      );
    }

    if (forecast.some((day) => day.rainfall > 30)) {
      recommendations.push(
        "Implement drainage inspection before heavy rainfall days"
      );
    }

    return {
      success: true,
      forecast,
      predictedDelay,
      recommendations,
      highImpactDays,
      mediumImpactDays,
      lowImpactDays: forecast.filter((day) => day.predictedImpact === "low")
        .length,
      currentPhase,
    };
  } catch (error) {
    console.error("Error predicting weather impact:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to predict weather impact",
    };
  }
}

/**
 * Analyzes resource allocation across multiple sites and suggests optimization strategies
 * Uses AI algorithms to identify inefficiencies and recommend resource reallocation
 */
export async function analyzeResourceAllocation(
  regionId?: string,
  maxDistance: number = 100
) {
  try {
    await connectToDatabase();

    // Get all active sites (or filter by region if provided)
    const query = regionId
      ? { region: regionId, status: { $ne: "completed" } }
      : { status: { $ne: "completed" } };
    const sites = await RailwaySite.find(query).lean();

    if (!sites || sites.length === 0) {
      return {
        success: false,
        error: "No active sites found for resource analysis",
      };
    }

    // Get extended data for all sites
    const siteIds = sites.map((site) => site._id?.toString());
    const extendedSites = await RailwaySiteExtended.find({
      siteId: { $in: siteIds },
    }).lean();

    // Create a map for quick access to extended data
    const extendedSitesMap = new Map<string, IRailwaySiteExtended>();
    extendedSites.forEach((site) => {
      extendedSitesMap.set(site.siteId.toString(), site);
    });

    // Analyze resource allocation and identify optimization opportunities
    const resourceAnalysis: {
      overallocatedResources: string[];
      underallocatedResources: string[];
      resourceTransferSuggestions: string[];
      equipmentUtilization: Record<string, number>;
      skillGaps: string[];
      overallEfficiency: number;
    } = {
      overallocatedResources: [],
      underallocatedResources: [],
      resourceTransferSuggestions: [],
      equipmentUtilization: {},
      skillGaps: [],
      overallEfficiency: 0,
    };

    // Calculate geographical clusters of sites
    const siteClusters = calculateSiteClusters(sites, maxDistance);

    // For each cluster, identify resource optimization opportunities
    for (const cluster of siteClusters) {
      if (cluster.siteIds.length < 2) continue; // Skip clusters with only one site

      // Get detailed information for sites in this cluster
      const clusterSites = sites.filter((site) =>
        cluster.siteIds.includes(site._id?.toString() || "")
      );

      const clusterExtendedSites = clusterSites
        .map((site) => {
          const extendedData = extendedSitesMap.get(site._id?.toString() || "");
          return {
            site,
            extendedData,
            hasExtendedData: !!extendedData,
          };
        })
        .filter((item) => item.hasExtendedData);

      if (clusterExtendedSites.length < 2) continue;

      // Analyze team allocation across sites
      const teamAllocation = analyzeTeamAllocation(clusterExtendedSites);

      // Analyze equipment usage across sites
      const equipmentUsage = analyzeEquipmentUsage(clusterExtendedSites);

      // Generate transfer suggestions based on project phases and priorities
      const transferSuggestions = generateTransferSuggestions(
        clusterExtendedSites,
        teamAllocation,
        equipmentUsage
      );

      // Add to overall analysis
      resourceAnalysis.resourceTransferSuggestions.push(...transferSuggestions);

      // Update equipment utilization data
      Object.entries(equipmentUsage.utilizationByType).forEach(
        ([type, utilization]) => {
          if (!resourceAnalysis.equipmentUtilization[type]) {
            resourceAnalysis.equipmentUtilization[type] = utilization;
          } else {
            // Average the utilization across clusters
            resourceAnalysis.equipmentUtilization[type] =
              (resourceAnalysis.equipmentUtilization[type] + utilization) / 2;
          }
        }
      );

      // Add skill gaps identified
      resourceAnalysis.skillGaps.push(...teamAllocation.skillGaps);
    }

    // Remove duplicate suggestions and skill gaps
    resourceAnalysis.resourceTransferSuggestions = Array.from(
      new Set(resourceAnalysis.resourceTransferSuggestions)
    );

    resourceAnalysis.skillGaps = Array.from(
      new Set(resourceAnalysis.skillGaps)
    );

    // Calculate overall efficiency score
    resourceAnalysis.overallEfficiency = calculateOverallEfficiency(
      resourceAnalysis.equipmentUtilization,
      resourceAnalysis.resourceTransferSuggestions.length,
      sites.length
    );

    return {
      success: true,
      resourceAnalysis,
    };
  } catch (error) {
    console.error("Error analyzing resource allocation:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to analyze resource allocation",
    };
  }
}

/**
 * Calculates geographical clusters of sites based on location proximity
 */
function calculateSiteClusters(
  sites: Array<{
    _id?: { toString: () => string };
    location?: {
      latitude?: number;
      longitude?: number;
    };
    [key: string]: unknown;
  }>,
  maxDistance: number
): Array<{
  centroid: { lat: number; lng: number };
  siteIds: string[];
}> {
  const clusters: Array<{
    centroid: { lat: number; lng: number };
    siteIds: string[];
  }> = [];
  const processedSites = new Set<string>();

  // Process each site
  for (const site of sites) {
    const siteId = site._id?.toString() || "";
    if (processedSites.has(siteId)) continue;

    const currentCluster = {
      centroid: {
        lat: site.location?.latitude || 0,
        lng: site.location?.longitude || 0,
      },
      siteIds: [siteId],
    };

    processedSites.add(siteId);

    // Find all sites within maxDistance km of this site
    for (const otherSite of sites) {
      const otherSiteId = otherSite._id?.toString() || "";

      if (siteId === otherSiteId || processedSites.has(otherSiteId)) {
        continue;
      }

      const distance = calculateDistance(
        site.location?.latitude || 0,
        site.location?.longitude || 0,
        otherSite.location?.latitude || 0,
        otherSite.location?.longitude || 0
      );

      if (distance <= maxDistance) {
        currentCluster.siteIds.push(otherSiteId);
        processedSites.add(otherSiteId);
      }
    }

    clusters.push(currentCluster);
  }

  return clusters;
}

interface TeamMember {
  role: string;
  name?: string;
  [key: string]: unknown;
}

interface ClusterSite {
  site: {
    _id?: { toString: () => string };
    name: string;
    priority?: string;
    [key: string]: unknown;
  };
  extendedData: {
    team?: TeamMember[];
    equipment?: Array<{
      type: string;
      id: string;
      status: string;
      scheduledUntil?: string | Date | null;
      [key: string]: unknown;
    }>;
    projectProgress?: {
      overallCompletion?: number;
      milestones?: Array<{
        phase: string;
        status: string;
        tasks?: Array<{
          [key: string]: unknown;
        }>;
        [key: string]: unknown;
      }>;
      [key: string]: unknown;
    };
    [key: string]: unknown;
  };
  hasExtendedData: boolean;
}

interface TeamAllocationResult {
  overallocatedRoles: string[];
  underallocatedRoles: string[];
  skillGaps: string[];
}

type ProjectPhase =
  | "planning"
  | "design"
  | "procurement"
  | "construction"
  | "commissioning";

/**
 * Analyzes team allocation across sites in a cluster
 */
function analyzeTeamAllocation(
  clusterSites: ClusterSite[]
): TeamAllocationResult {
  const result: TeamAllocationResult = {
    overallocatedRoles: [],
    underallocatedRoles: [],
    skillGaps: [],
  };

  // Count team members by role across all sites
  const roleCount: Record<
    string,
    {
      count: number;
      sites: Map<string, number>;
    }
  > = {};

  const sitesByPhase: Record<
    ProjectPhase,
    Array<{
      siteId: string;
      siteName: string;
      team: TeamMember[];
    }>
  > = {
    planning: [],
    design: [],
    procurement: [],
    construction: [],
    commissioning: [],
  };

  // Collect data about team allocation and project phases
  clusterSites.forEach(({ site, extendedData }) => {
    const team = extendedData.team || [];

    // Categorize site by its primary current phase
    let currentPhase: ProjectPhase = "planning";
    if (
      extendedData.projectProgress &&
      extendedData.projectProgress.milestones
    ) {
      const activePhases = extendedData.projectProgress.milestones
        .filter((m) => m.status === "in-progress")
        .map((m) => m.phase);

      if (activePhases.includes("commissioning")) {
        currentPhase = "commissioning";
      } else if (activePhases.includes("construction")) {
        currentPhase = "construction";
      } else if (activePhases.includes("procurement")) {
        currentPhase = "procurement";
      } else if (activePhases.includes("design")) {
        currentPhase = "design";
      }
    }

    sitesByPhase[currentPhase].push({
      siteId: site._id?.toString() || "",
      siteName: site.name || "Unknown Site",
      team,
    });

    // Count team roles
    team.forEach((member: TeamMember) => {
      if (!roleCount[member.role]) {
        roleCount[member.role] = {
          count: 0,
          sites: new Map<string, number>(),
        };
      }

      roleCount[member.role].count++;

      const siteId = site._id?.toString() || "";
      if (!roleCount[member.role].sites.has(siteId)) {
        roleCount[member.role].sites.set(siteId, 0);
      }

      roleCount[member.role].sites.set(
        siteId,
        (roleCount[member.role].sites.get(siteId) || 0) + 1
      );
    });
  });

  // Identify overallocated and underallocated roles
  const phases: ProjectPhase[] = [
    "planning",
    "design",
    "procurement",
    "construction",
    "commissioning",
  ];

  // Define role requirements by phase
  const roleRequirements: Record<ProjectPhase, string[]> = {
    planning: ["Project Manager", "Site Surveyor", "Planner"],
    design: ["Design Engineer", "Electrical Engineer", "Structural Engineer"],
    procurement: ["Procurement Specialist", "Logistics Coordinator"],
    construction: [
      "Construction Manager",
      "Electrical Technician",
      "Installer",
      "Safety Officer",
    ],
    commissioning: [
      "Commissioning Engineer",
      "Quality Control",
      "Electrical Engineer",
    ],
  };

  // Identify skill gaps by phase
  phases.forEach((phase) => {
    if (sitesByPhase[phase].length === 0) return;

    const requiredRoles = roleRequirements[phase];

    sitesByPhase[phase].forEach((site) => {
      const availableRoles = site.team.map((member) => member.role);

      // Find missing critical roles for this phase
      const missingRoles = requiredRoles.filter(
        (role) => !availableRoles.includes(role)
      );

      if (missingRoles.length > 0) {
        missingRoles.forEach((role) => {
          result.skillGaps.push(
            `${site.siteName} is missing ${role} required for ${phase} phase`
          );
        });
      }
    });
  });

  // Identify allocation issues
  Object.entries(roleCount).forEach(([role, data]) => {
    // Check for overallocation (same person assigned to multiple sites)
    const sitesWithRole = data.sites;

    sitesWithRole.forEach((count, siteId) => {
      if (count > 2) {
        const siteName =
          clusterSites.find((s) => s.site._id?.toString() === siteId)?.site
            .name || siteId;
        result.overallocatedRoles.push(
          `${siteName} has ${count} people with role ${role}`
        );
      }
    });
  });

  return result;
}

interface EquipmentItem {
  type: string;
  id: string;
  status: string;
  scheduledUntil?: Date | string | null;
  [key: string]: unknown;
}

interface EquipmentUsageResult {
  utilizationByType: Record<string, number>;
  sharingOpportunities: string[];
}

/**
 * Analyzes equipment usage across sites in a cluster
 */
function analyzeEquipmentUsage(
  clusterSites: ClusterSite[]
): EquipmentUsageResult {
  const result: EquipmentUsageResult = {
    utilizationByType: {},
    sharingOpportunities: [],
  };

  // Count equipment by type across all sites
  const equipmentByType: Record<
    string,
    {
      count: number;
      inUse: number;
      sites: Array<{
        siteId: string;
        siteName: string;
        equipmentId: string;
        status: string;
        scheduledUntil: Date | string | null;
      }>;
    }
  > = {};

  // Collect data about equipment allocation
  clusterSites.forEach(({ site, extendedData }) => {
    const equipment = (extendedData.equipment || []) as EquipmentItem[];

    equipment.forEach((item) => {
      if (!equipmentByType[item.type]) {
        equipmentByType[item.type] = {
          count: 0,
          inUse: 0,
          sites: [],
        };
      }

      equipmentByType[item.type].count++;

      if (item.status === "in-use") {
        equipmentByType[item.type].inUse++;
      }

      equipmentByType[item.type].sites.push({
        siteId: site._id?.toString() || "",
        siteName: site.name || "Unknown Site",
        equipmentId: item.id,
        status: item.status,
        scheduledUntil: item.scheduledUntil || null,
      });
    });
  });

  // Calculate utilization and identify sharing opportunities
  Object.entries(equipmentByType).forEach(([type, data]) => {
    // Calculate utilization percentage
    const utilization = data.count > 0 ? (data.inUse / data.count) * 100 : 0;
    result.utilizationByType[type] = Math.round(utilization);

    // Identify potential sharing opportunities
    if (utilization < 60 && data.count >= 2) {
      // Group by site to find sites with multiple idle equipment of same type
      const siteEquipmentCount: Record<
        string,
        {
          siteName: string;
          total: number;
          idle: number;
        }
      > = {};

      data.sites.forEach((entry) => {
        if (!siteEquipmentCount[entry.siteId]) {
          siteEquipmentCount[entry.siteId] = {
            siteName: entry.siteName,
            total: 0,
            idle: 0,
          };
        }

        siteEquipmentCount[entry.siteId].total++;

        if (entry.status !== "in-use") {
          siteEquipmentCount[entry.siteId].idle++;
        }
      });

      // Find sites with multiple idle equipment that could share
      const sitesWithIdleEquipment = Object.entries(siteEquipmentCount)
        .filter(([, data]) => data.idle >= 2)
        .map(([siteId, data]) => ({
          siteId,
          siteName: data.siteName,
          idleCount: data.idle,
        }));

      sitesWithIdleEquipment.forEach((site) => {
        result.sharingOpportunities.push(
          `${site.siteName} has ${site.idleCount} idle ${type} equipment that could be shared`
        );
      });
    }
  });

  return result;
}

/**
 * Generates suggestions for resource transfers between sites
 */
function generateTransferSuggestions(
  clusterSites: ClusterSite[],
  teamAllocation: TeamAllocationResult,
  equipmentUsage: EquipmentUsageResult
): string[] {
  const suggestions: string[] = [];

  // Identify sites by phase
  const sitesByPhase: Record<
    ProjectPhase,
    Array<{
      siteId: string;
      siteName: string;
      priority: string;
      team: TeamMember[];
      equipment: EquipmentItem[];
      progress: number;
    }>
  > = {
    planning: [],
    design: [],
    procurement: [],
    construction: [],
    commissioning: [],
  };

  clusterSites.forEach(({ site, extendedData }) => {
    // Determine current primary phase
    let currentPhase: ProjectPhase = "planning";

    if (
      extendedData.projectProgress &&
      extendedData.projectProgress.milestones
    ) {
      const phases: ProjectPhase[] = [
        "commissioning",
        "construction",
        "procurement",
        "design",
        "planning",
      ];

      for (const phase of phases) {
        const hasActivePhase = extendedData.projectProgress.milestones.some(
          (m: { phase: string; status: string }) =>
            m.phase === phase && m.status === "in-progress"
        );

        if (hasActivePhase) {
          currentPhase = phase;
          break;
        }
      }
    }

    sitesByPhase[currentPhase].push({
      siteId: site._id?.toString() || "",
      siteName: site.name || "Unknown Site",
      priority: site.priority || "medium",
      team: extendedData.team || [],
      equipment: extendedData.equipment || [],
      progress: extendedData.projectProgress?.overallCompletion || 0,
    });
  });

  // Suggest transfers from nearly complete sites to new sites
  const nearlyCompleteSites = [
    ...sitesByPhase.commissioning,
    ...sitesByPhase.construction.filter((site) => site.progress >= 85),
  ];

  const newSites = [...sitesByPhase.planning, ...sitesByPhase.design];

  // Prioritize high priority sites in planning/design phases
  const highPriorityNewSites = newSites.filter(
    (site) => site.priority === "high"
  );

  if (nearlyCompleteSites.length > 0 && newSites.length > 0) {
    // For each nearly complete site, suggest resource transfers
    nearlyCompleteSites.forEach((completeSite) => {
      // Target high priority sites first, then others
      const targetSites =
        highPriorityNewSites.length > 0 ? highPriorityNewSites : newSites;

      if (targetSites.length > 0) {
        const targetSite = targetSites[0]; // Just take the first one for simplicity

        suggestions.push(
          `Consider transferring resources from ${
            completeSite.siteName
          } (${Math.round(completeSite.progress)}% complete) to ${
            targetSite.siteName
          } (high priority)`
        );
      }
    });
  }

  // Add equipment sharing suggestions
  equipmentUsage.sharingOpportunities.forEach((opportunity) => {
    suggestions.push(opportunity);
  });

  return suggestions;
}

/**
 * Calculate overall resource efficiency score
 */
function calculateOverallEfficiency(
  equipmentUtilization: Record<string, number>,
  transferSuggestionsCount: number,
  totalSites: number
): number {
  // Calculate average equipment utilization
  const utilizationValues = Object.values(equipmentUtilization);
  const avgUtilization =
    utilizationValues.length > 0
      ? utilizationValues.reduce((sum, val) => sum + val, 0) /
        utilizationValues.length
      : 50; // Default if no data

  // Calculate optimization potential (lower is better)
  const optimizationRatio =
    totalSites > 0 ? transferSuggestionsCount / totalSites : 0;

  // Calculate efficiency score (0-100)
  const baseScore = avgUtilization;
  const optimizationPenalty = optimizationRatio * 20; // Penalty for having many optimization opportunities

  const efficiency = Math.min(
    100,
    Math.max(0, baseScore - optimizationPenalty)
  );

  return Math.round(efficiency);
}

/**
 * Analyzes project data to detect potential quality issues
 * Uses pattern recognition in progress data, issue frequency, and task completion rates
 */
export async function detectQualityIssues(siteId: string) {
  try {
    await connectToDatabase();

    // Get site extended data
    const siteExtended = await RailwaySiteExtended.findOne({ siteId });
    if (!siteExtended) {
      return { success: false, error: "Site extended data not found" };
    }

    const qualityAnalysis = {
      potentialIssues: [] as string[],
      recommendedChecks: [] as string[],
      riskLevel: "low" as "low" | "medium" | "high",
      affectedComponents: [] as string[],
    };

    // Analyze rapid progress patterns - unusually fast progress can indicate quality shortcuts
    if (
      siteExtended.projectProgress &&
      siteExtended.projectProgress.progressHistory
    ) {
      const progressHistory = siteExtended.projectProgress.progressHistory;

      // Check for unusual spikes in progress (more than 15% in a week)
      let hasProgressAnomaly = false;
      for (let i = 1; i < progressHistory.length; i++) {
        const currentEntry = progressHistory[i];
        const previousEntry = progressHistory[i - 1];

        const currentDate = new Date(currentEntry.date);
        const previousDate = new Date(previousEntry.date);
        const daysDiff =
          (currentDate.getTime() - previousDate.getTime()) /
          (1000 * 60 * 60 * 24);

        if (daysDiff <= 7) {
          const progressDiff = currentEntry.value - previousEntry.value;
          const dailyProgressRate = progressDiff / daysDiff;

          // Flag unusually rapid progress (>3% per day is suspicious for solar projects)
          if (dailyProgressRate > 3) {
            hasProgressAnomaly = true;
            qualityAnalysis.potentialIssues.push(
              `Unusually rapid progress detected between ${previousDate.toLocaleDateString()} and ${currentDate.toLocaleDateString()} (${progressDiff.toFixed(
                1
              )}% in ${daysDiff.toFixed(1)} days)`
            );
            qualityAnalysis.recommendedChecks.push(
              "Perform detailed quality inspection on recently completed work"
            );
          }
        }
      }

      if (hasProgressAnomaly) {
        qualityAnalysis.riskLevel = "medium";
      }
    }

    // Analyze issue patterns across tasks and milestones
    if (
      siteExtended.projectProgress &&
      siteExtended.projectProgress.milestones
    ) {
      const milestones = siteExtended.projectProgress.milestones;

      // Count issues by type across all tasks
      const issuesByType: Record<
        string,
        { count: number; components: Set<string> }
      > = {};
      let totalTasks = 0;
      let tasksWithIssues = 0;

      milestones.forEach(
        (milestone: {
          tasks?: Array<{
            issues?: Array<{ type: string; component?: string }>;
            [key: string]: unknown;
          }>;
          [key: string]: unknown;
        }) => {
          if (milestone.tasks) {
            totalTasks += milestone.tasks.length;

            milestone.tasks.forEach((task) => {
              if (task.issues && task.issues.length > 0) {
                tasksWithIssues++;

                task.issues.forEach(
                  (issue: { type: string; component?: string }) => {
                    if (!issuesByType[issue.type]) {
                      issuesByType[issue.type] = {
                        count: 0,
                        components: new Set<string>(),
                      };
                    }

                    issuesByType[issue.type].count++;

                    if (issue.component) {
                      issuesByType[issue.type].components.add(issue.component);
                    }
                  }
                );
              }
            });
          }
        }
      );

      // Identify recurring issue types (potential systematic problems)
      Object.entries(issuesByType).forEach(([issueType, data]) => {
        if (data.count >= 3) {
          qualityAnalysis.potentialIssues.push(
            `Recurring "${issueType}" issues detected (${data.count} occurrences)`
          );

          // Add affected components to analysis
          data.components.forEach((component) => {
            if (!qualityAnalysis.affectedComponents.includes(component)) {
              qualityAnalysis.affectedComponents.push(component);
            }
          });

          // Suggest appropriate checks
          switch (issueType.toLowerCase()) {
            case "electrical":
              qualityAnalysis.recommendedChecks.push(
                "Perform comprehensive electrical safety inspection"
              );
              break;
            case "structural":
              qualityAnalysis.recommendedChecks.push(
                "Review structural integrity and mounting specifications"
              );
              break;
            case "water ingress":
            case "leak":
              qualityAnalysis.recommendedChecks.push(
                "Check all weather sealing and roof penetrations"
              );
              break;
            default:
              qualityAnalysis.recommendedChecks.push(
                `Review all instances of "${issueType}" issues for systematic problems`
              );
          }

          if (data.count >= 5) {
            qualityAnalysis.riskLevel = "high";
          } else if (qualityAnalysis.riskLevel !== "high") {
            qualityAnalysis.riskLevel = "medium";
          }
        }
      });

      // Check for high issue rate across the project
      const issueRate =
        totalTasks > 0 ? (tasksWithIssues / totalTasks) * 100 : 0;

      if (issueRate >= 25) {
        qualityAnalysis.potentialIssues.push(
          `High issue rate detected (${issueRate.toFixed(
            1
          )}% of tasks affected)`
        );
        qualityAnalysis.recommendedChecks.push(
          "Consider comprehensive project review with quality assurance team"
        );

        if (qualityAnalysis.riskLevel !== "high") {
          qualityAnalysis.riskLevel = "medium";
        }
      }
    }

    // Check installation parameters against standards
    if (siteExtended.designParameters && siteExtended.actualParameters) {
      const design = siteExtended.designParameters;
      const actual = siteExtended.actualParameters;

      // Check for deviations between design and actual parameters
      const deviations = [];

      if (design.panelTilt && actual.panelTilt) {
        const tiltDeviation = Math.abs(design.panelTilt - actual.panelTilt);
        if (tiltDeviation > 5) {
          deviations.push(
            `Panel tilt deviation of ${tiltDeviation.toFixed(1)} degrees`
          );
        }
      }

      if (design.azimuth && actual.azimuth) {
        const azimuthDeviation = Math.abs(design.azimuth - actual.azimuth);
        if (azimuthDeviation > 10) {
          deviations.push(
            `Azimuth deviation of ${azimuthDeviation.toFixed(1)} degrees`
          );
        }
      }

      if (design.stringConfig && actual.stringConfig) {
        if (design.stringConfig !== actual.stringConfig) {
          deviations.push(
            "String configuration differs from design specifications"
          );
        }
      }

      // Add deviations to quality issues if found
      if (deviations.length > 0) {
        qualityAnalysis.potentialIssues.push(
          `Installation parameter deviations detected: ${deviations.join(", ")}`
        );

        qualityAnalysis.recommendedChecks.push(
          "Verify that parameter deviations are within acceptable performance tolerances"
        );

        if (deviations.length >= 3) {
          qualityAnalysis.riskLevel = "high";
        } else if (qualityAnalysis.riskLevel !== "high") {
          qualityAnalysis.riskLevel = "medium";
        }
      }
    }

    // If no issues were detected, add a positive note
    if (qualityAnalysis.potentialIssues.length === 0) {
      qualityAnalysis.potentialIssues.push(
        "No significant quality issues detected based on available data"
      );
      qualityAnalysis.recommendedChecks.push(
        "Continue regular quality assurance checks as per standard protocol"
      );
    }

    // Remove any duplicate recommendations
    qualityAnalysis.recommendedChecks = Array.from(
      new Set(qualityAnalysis.recommendedChecks)
    );

    // Update extended site data with quality analysis
    siteExtended.qualityAnalysis = {
      ...qualityAnalysis,
      lastUpdated: new Date(),
    };

    await siteExtended.save();

    return {
      success: true,
      qualityAnalysis,
    };
  } catch (error) {
    console.error("Error detecting quality issues:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to detect quality issues",
    };
  }
}
