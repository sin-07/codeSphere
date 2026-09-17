import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { CONFIG } from '../config';

let isConnected = false;
let fallbackMode = false;

export async function connectDB(): Promise<void> {
  if (isConnected) return;

  try {
    // Attempt MongoDB connection with 2 second timeout
    await mongoose.connect(CONFIG.MONGODB_URI, {
      serverSelectionTimeoutMS: 2000,
      connectTimeoutMS: 2000,
    });
    isConnected = true;
    fallbackMode = false;
    console.log(`[Database] Successfully connected to MongoDB at ${CONFIG.MONGODB_URI}`);
  } catch (error: any) {
    console.warn(`[Database] MongoDB connection unavailable (${error.message}). Activating high-performance local memory/disk store mode.`);
    fallbackMode = true;
    isConnected = true;
    initLocalStore();
  }
}

export function isFallback(): boolean {
  return fallbackMode;
}

// In-Memory & Local Disk Store Implementation for zero-friction local execution
const localDataDir = path.resolve(process.cwd(), '../../storage/data');
const inMemoryStore: Record<string, any[]> = {};

function initLocalStore() {
  if (!fs.existsSync(localDataDir)) {
    fs.mkdirSync(localDataDir, { recursive: true });
  }

  const collections = [
    'users', 'repositories', 'pullrequests', 'issues', 
    'comments', 'cipipelineruns', 'notifications', 'auditlogs', 'organizations'
  ];

  for (const col of collections) {
    const file = path.join(localDataDir, `${col}.json`);
    if (fs.existsSync(file)) {
      try {
        inMemoryStore[col] = JSON.parse(fs.readFileSync(file, 'utf-8'));
      } catch {
        inMemoryStore[col] = [];
      }
    } else {
      inMemoryStore[col] = [];
    }
  }
}

export function saveLocalCollection(collectionName: string) {
  if (!fallbackMode) return;
  const file = path.join(localDataDir, `${collectionName}.json`);
  fs.writeFileSync(file, JSON.stringify(inMemoryStore[collectionName] || [], null, 2), 'utf-8');
}

export function getLocalCollection(collectionName: string): any[] {
  if (!inMemoryStore[collectionName]) {
    inMemoryStore[collectionName] = [];
  }
  return inMemoryStore[collectionName];
}
