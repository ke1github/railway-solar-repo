// lib/mongodb.ts
import { MongoClient } from 'mongodb';
import mongoose from 'mongoose';

const uri = process.env.MONGODB_URI;

if (!uri) {
  if (process.env.NODE_ENV === 'production' && !process.env.VERCEL_ENV) {
    throw new Error('Please add your MongoDB URI to .env.local');
  }
  console.warn('MongoDB URI not found. Database operations will fail.');
}

const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient> | undefined;

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

// Only initialize MongoDB client if URI is available
if (uri) {
  if (process.env.NODE_ENV === 'development') {
    if (!global._mongoClientPromise) {
      client = new MongoClient(uri, options);
      global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
  } else {
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
  }
}

// Mongoose connection
let isConnected = false;

export const connectToDatabase = async () => {
  if (!uri) {
    throw new Error('MongoDB URI is not defined');
  }
  
  if (isConnected) {
    return;
  }

  try {
    await mongoose.connect(uri);
    isConnected = true;
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

export default clientPromise;
