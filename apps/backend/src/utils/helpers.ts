import dotenv from 'dotenv';
import { existsSync } from 'fs';
import { join } from 'path';

export enum Environment {
  PRODUCTION = 'production',
  DEVELOPMENT = 'development',
  TEST = 'test',
}

const environmentFileMap: Record<Environment, string> = {
  [Environment.PRODUCTION]: '.env',
  [Environment.DEVELOPMENT]: '.env.development',
  [Environment.TEST]: '.env.test',
};

const validEnvs = Object.values(Environment).map((validEnv) =>
  validEnv.toString(),
);

export const getEnvironmentOrThrow = (): Environment => {
  const env = process.env.NODE_ENV;
  if (env == null) throw new Error('NODE_ENV not set');
  if (!validEnvs.includes(env)) throw new Error('INVALID Environment value');

  return env as Environment;
};

export const requireEnv = (key: string): string => {
  const requestedEnv = process.env[key];
  if (requestedEnv == null)
    throw new Error(`Environment variable: "${key}" is not set`);

  return requestedEnv;
};

export const getEnvPath = (): string | null => {
  try {
    const env = getEnvironmentOrThrow();
    const envFile = environmentFileMap[env];
    const path = join(process.cwd(), envFile);

    if (!existsSync(path)) {
      console.warn(
        `No environment file found: "${path}", falling back to defaults`,
      );
      return null;
    }

    return path;
  } catch (error) {
    console.warn(`${error}, falling back to defaults`);
    return null;
  }
};

export const loadEnvs = () => {
  const path = getEnvPath();

  if (path == null) return;

  dotenv.config({
    path,
    override: true,
  });
};
