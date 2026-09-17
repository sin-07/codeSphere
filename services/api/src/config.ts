import path from 'path';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

function getStoragePath(): string {
  if (process.env.STORAGE_REPOS_PATH) return path.resolve(process.env.STORAGE_REPOS_PATH);
  // Check if cwd has storage/repos
  if (fs.existsSync(path.resolve(process.cwd(), 'storage/repos'))) {
    return path.resolve(process.cwd(), 'storage/repos');
  }
  // If running inside services/api
  if (fs.existsSync(path.resolve(process.cwd(), '../../storage/repos'))) {
    return path.resolve(process.cwd(), '../../storage/repos');
  }
  return path.resolve(process.cwd(), 'storage/repos');
}

export const CONFIG = {
  PORT: parseInt(process.env.PORT || '4000', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/codesphere',
  JWT_SECRET: process.env.JWT_SECRET || 'codesphere_super_secret_jwt_key_2026',
  JWT_EXPIRES_IN: '7d',
  STORAGE_REPOS_PATH: getStoragePath(),
  AI_ENGINE_URL: process.env.AI_ENGINE_URL || 'http://localhost:8000',
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',
};
