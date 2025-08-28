// scripts/migrateToAppwrite.ts
/**
 * Migration script to transfer data from MongoDB to Appwrite
 *
 * Usage:
 * 1. Configure your MongoDB and Appwrite credentials in .env.local
 * 2. Run: npx ts-node scripts/migrateToAppwrite.ts
 */

import * as dotenv from "dotenv";
import { MongoClient } from "mongodb";
import { Client, Databases, Query, ID, Permission, Role } from "appwrite";

// Load environment variables
dotenv.config({ path: ".env.local" });

// MongoDB connection
const mongoUri = process.env.MONGODB_URI;
if (!mongoUri) {
  console.error("MongoDB URI not defined in .env.local");
  process.exit(1);
}

// Appwrite configuration
const appwriteEndpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
const appwriteProjectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const appwriteDatabaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
const appwriteApiKey = process.env.APPWRITE_API_KEY; // Create an API key in Appwrite console

if (
  !appwriteEndpoint ||
  !appwriteProjectId ||
  !appwriteDatabaseId ||
  !appwriteApiKey
) {
  console.error("Appwrite credentials not defined in .env.local");
  process.exit(1);
}

// Initialize Appwrite client
const appwriteClient = new Client();
appwriteClient
  .setEndpoint(appwriteEndpoint)
  .setProject(appwriteProjectId)
  .setKey(appwriteApiKey);

const databases = new Databases(appwriteClient);

// Collection mappings
const COLLECTION_MAPPINGS = {
  railwaysites: "sites",
  epcprojects: "epc_projects",
  solarinstallations: "solar_installations",
  energyproductions: "energy_production",
  divisions: "railway_hierarchy",
  zones: "railway_hierarchy",
  stations: "railway_hierarchy",
  solarprojects: "solar_project_hierarchy",
};

// Transform MongoDB document to Appwrite format
function transformDocument(doc: any, collectionName: string): any {
  // Remove MongoDB specific fields
  const { _id, __v, ...rest } = doc;

  // Transform based on collection type
  switch (collectionName) {
    case "railwaysites":
      return {
        ...rest,
        type: "railway",
        location: {
          latitude: rest.latitude || 0,
          longitude: rest.longitude || 0,
          address: rest.address || "",
          city: rest.city,
          state: rest.state,
          country: "India",
        },
      };

    case "epcprojects":
      return {
        ...rest,
        location: {
          latitude: rest.latitude || 0,
          longitude: rest.longitude || 0,
          address: rest.address || "",
          city: rest.city,
          state: rest.state,
          country: "India",
        },
        progress: rest.progress || 0,
        budget: rest.budget || 0,
        contractValue: rest.contractValue || 0,
      };

    case "solarinstallations":
      return {
        ...rest,
        panels: rest.panelCount || 0,
        efficiency: rest.efficiency || 0,
      };

    case "divisions":
      return {
        ...rest,
        type: "division",
      };

    case "zones":
      return {
        ...rest,
        type: "zone",
      };

    case "stations":
      return {
        ...rest,
        type: "station",
      };

    default:
      return rest;
  }
}

// Main migration function
async function migrateData() {
  console.log("Starting migration from MongoDB to Appwrite...");

  // Connect to MongoDB
  const mongoClient = new MongoClient(mongoUri);
  await mongoClient.connect();
  console.log("Connected to MongoDB");

  const db = mongoClient.db();

  // Migrate each collection
  for (const [mongoCollection, appwriteCollection] of Object.entries(
    COLLECTION_MAPPINGS
  )) {
    try {
      console.log(`Migrating ${mongoCollection} to ${appwriteCollection}...`);

      // Get all documents from MongoDB collection
      const documents = await db.collection(mongoCollection).find({}).toArray();
      console.log(`Found ${documents.length} documents in ${mongoCollection}`);

      // Skip if no documents
      if (documents.length === 0) {
        console.log(`No documents in ${mongoCollection}, skipping...`);
        continue;
      }

      // Transform and insert documents to Appwrite
      let successCount = 0;
      let errorCount = 0;

      for (const doc of documents) {
        try {
          const transformedDoc = transformDocument(doc, mongoCollection);

          // Create document in Appwrite
          await databases.createDocument(
            appwriteDatabaseId,
            appwriteCollection,
            ID.unique(),
            transformedDoc,
            [
              Permission.read(Role.any()),
              Permission.update(Role.team("admin")),
              Permission.delete(Role.team("admin")),
            ]
          );

          successCount++;
        } catch (error) {
          console.error(`Error migrating document ${doc._id}:`, error);
          errorCount++;
        }
      }

      console.log(
        `Migration of ${mongoCollection} completed: ${successCount} successful, ${errorCount} failed`
      );
    } catch (error) {
      console.error(`Error migrating collection ${mongoCollection}:`, error);
    }
  }

  // Close MongoDB connection
  await mongoClient.close();
  console.log("Migration completed!");
}

// Run the migration
migrateData().catch((error) => {
  console.error("Migration failed:", error);
  process.exit(1);
});
