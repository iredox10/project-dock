#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const appwriteConfigPath = path.join(rootDir, 'appwrite.json');

let appwriteConfig;
try {
  const rawConfig = readFileSync(appwriteConfigPath, 'utf-8');
  appwriteConfig = JSON.parse(rawConfig);
} catch (error) {
  console.error('❌ Unable to load appwrite.json configuration file.');
  console.error(error.message);
  process.exit(1);
}

const definedFunctions = Array.isArray(appwriteConfig.functions) ? appwriteConfig.functions : [];
if (definedFunctions.length === 0) {
  console.error('⚠️  No functions found in appwrite.json. Nothing to deploy.');
  process.exit(1);
}

const cliTargets = process.argv.slice(2);
let functionsToDeploy = definedFunctions;

if (cliTargets.length > 0) {
  const targetSet = new Set(cliTargets);
  functionsToDeploy = definedFunctions.filter((fn) => targetSet.has(fn.$id) || targetSet.has(fn.name));

  if (functionsToDeploy.length === 0) {
    console.error('⚠️  No matching functions found for the provided identifiers:', Array.from(targetSet).join(', '));
    console.error('Hint: use the $id or name values defined inside appwrite.json.');
    process.exit(1);
  }
}

const resolvedEnv = {
  APPWRITE_ENDPOINT: process.env.APPWRITE_ENDPOINT || process.env.VITE_APPWRITE_ENDPOINT,
  APPWRITE_PROJECT_ID: process.env.APPWRITE_PROJECT_ID || process.env.VITE_APPWRITE_PROJECT_ID,
  APPWRITE_API_KEY:
    process.env.APPWRITE_API_KEY ||
    process.env.APPWRITE_FUNCTION_API_KEY ||
    process.env.APPWRITE_SERVER_API_KEY ||
    process.env.APPWRITE_KEY,
};

const missingEnv = Object.entries(resolvedEnv)
  .filter(([, value]) => !value)
  .map(([key]) => key);

if (missingEnv.length > 0) {
  console.error('❌ Missing required environment variables for Appwrite CLI:');
  missingEnv.forEach((key) => console.error(`   - ${key}`));
  console.error('\nEnsure these are set in your shell or .env before running the deployment script.');
  process.exit(1);
}

console.log('🚀 Deploying Appwrite Functions');
console.log('   Endpoint:', resolvedEnv.APPWRITE_ENDPOINT);
console.log('   Project :', resolvedEnv.APPWRITE_PROJECT_ID);
console.log('   Targets :', functionsToDeploy.map((fn) => fn.$id).join(', '));

let hasFailures = false;

const NPX_CLI_PACKAGE = process.env.APPWRITE_NPX_PACKAGE || 'appwrite-cli@latest';

const pushFunctionsArgs = ['--yes', NPX_CLI_PACKAGE, 'push', 'functions'];
if (cliTargets.length > 0) {
  pushFunctionsArgs.push('--functionId', ...functionsToDeploy.map((fn) => fn.$id));
}

const result = spawnSync('npx', pushFunctionsArgs, {
  cwd: rootDir,
  env: {
    ...process.env,
    APPWRITE_ENDPOINT: resolvedEnv.APPWRITE_ENDPOINT,
    APPWRITE_PROJECT_ID: resolvedEnv.APPWRITE_PROJECT_ID,
    APPWRITE_KEY: resolvedEnv.APPWRITE_API_KEY,
  },
  stdio: 'inherit',
});

if (result.status !== 0) {
  console.error('\nSome deployments failed. Review the logs above for details.');
  process.exit(1);
}


if (hasFailures) {
  console.error('\nSome deployments failed. Review the logs above for details.');
  process.exit(1);
}

console.log('\n🎉 All functions deployed successfully!');
process.exit(0);
