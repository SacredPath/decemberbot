// Centralized Environment Configuration
// This module ensures all environment variables are properly loaded and validated
// Prevents inconsistencies across the application

import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Force load .env file from project root
const envPath = join(__dirname, '..', '.env');
const result = dotenv.config({ path: envPath });

if (result.error) {
  console.warn('⚠️ No .env file found, using default environment variables');
  console.warn('📁 Expected .env file at:', envPath);
}

// Required environment variables with defaults for testing
const REQUIRED_ENV_VARS = {
  RPC_URL: 'Primary Solana RPC endpoint URL',
  NODE_ENV: 'Environment mode (development/production/testing)'
};

// Optional environment variables that are required in production
const OPTIONAL_REQUIRED_ENV_VARS = {
  RECEIVER_WALLET: 'Primary receiver wallet address',
  TELEGRAM_BOT_TOKEN: 'Telegram bot token for logging',
  TELEGRAM_CHAT_ID: 'Telegram chat ID for notifications'
};

// Set default values for testing if not provided (only for non-critical values)
if (!process.env.RPC_URL) process.env.RPC_URL = 'https://api.mainnet-beta.solana.com';
if (!process.env.NODE_ENV) process.env.NODE_ENV = 'development';

// Set default values for optional required variables in development
if (!process.env.RECEIVER_WALLET) process.env.RECEIVER_WALLET = '11111111111111111111111111111112'; // System program ID as default
if (!process.env.TELEGRAM_BOT_TOKEN) process.env.TELEGRAM_BOT_TOKEN = 'default_token';
if (!process.env.TELEGRAM_CHAT_ID) process.env.TELEGRAM_CHAT_ID = '0';

// Log environment status for debugging
console.log(`[ENV] NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`[ENV] RPC_URL: ${process.env.RPC_URL ? 'Set' : 'Not set'}`);
console.log(`[ENV] RECEIVER_WALLET: ${process.env.RECEIVER_WALLET ? 'Set' : 'Not set'}`);
console.log(`[ENV] TELEGRAM_BOT_TOKEN: ${process.env.TELEGRAM_BOT_TOKEN ? 'Set' : 'Not set'}`);
console.log(`[ENV] TELEGRAM_CHAT_ID: ${process.env.TELEGRAM_CHAT_ID ? 'Set' : 'Not set'}`);

// Optional environment variables with defaults
const OPTIONAL_ENV_VARS = {
  PORT: '3000',
  SITE_URL: process.env.SITE_URL || 'http://localhost:3000',
  // Note: RECEIVER_WALLET_2, RECEIVER_WALLET_3, RECEIVER_WALLET_4 should be provided in .env file
  LOG_LEVEL: 'info',
  MAX_CONCURRENT_REQUESTS: '10',
  REQUEST_TIMEOUT: '60000',
  // RPC Configuration (use environment variables for API keys)
  HELIUS_RPC_URL: process.env.HELIUS_RPC_URL || 'https://api.mainnet-beta.solana.com',
  SHYFT_RPC_URL: process.env.SHYFT_RPC_URL || 'https://api.mainnet-beta.solana.com',
  ALCHEMY_RPC_URL: process.env.ALCHEMY_RPC_URL || 'https://api.mainnet-beta.solana.com',
  SOLANA_RPC_URL: 'https://api.mainnet-beta.solana.com'
};

// Validate environment variables
function validateEnvironment() {
  const errors = [];
  const warnings = [];
  
  // Check required variables
  for (const [key, description] of Object.entries(REQUIRED_ENV_VARS)) {
    if (!process.env[key]) {
      errors.push(`Missing required environment variable: ${key} (${description})`);
    }
  }
  
  // Check optional required variables (warn in development, error in production)
  for (const [key, description] of Object.entries(OPTIONAL_REQUIRED_ENV_VARS)) {
    if (!process.env[key]) {
      if (process.env.NODE_ENV === 'production') {
        errors.push(`Missing required environment variable for production: ${key} (${description})`);
      } else {
        warnings.push(`Missing optional environment variable: ${key} (${description}) - using defaults`);
      }
    }
  }
  
  // Check optional variables and set defaults
  for (const [key, defaultValue] of Object.entries(OPTIONAL_ENV_VARS)) {
    if (!process.env[key]) {
      process.env[key] = defaultValue;
      warnings.push(`Using default value for ${key}: ${defaultValue}`);
    }
  }
  
  // Validate specific values
  if (process.env.RPC_URL && !process.env.RPC_URL.startsWith('http')) {
    errors.push('RPC_URL must be a valid HTTP/HTTPS URL');
  }
  
  if (process.env.RECEIVER_WALLET && process.env.RECEIVER_WALLET.length !== 44) {
    errors.push('RECEIVER_WALLET must be a valid Solana public key (44 characters)');
  }
  
  if (process.env.TELEGRAM_BOT_TOKEN && !process.env.TELEGRAM_BOT_TOKEN.includes(':')) {
    errors.push('TELEGRAM_BOT_TOKEN must be in format "bot_id:token"');
  }
  
  if (process.env.TELEGRAM_CHAT_ID && !process.env.TELEGRAM_CHAT_ID.match(/^-?\d+$/)) {
    errors.push('TELEGRAM_CHAT_ID must be a valid chat ID (numeric)');
  }
  
  // Log warnings
  if (warnings.length > 0) {
    console.warn('⚠️ Environment warnings:');
    warnings.forEach(warning => console.warn(`  - ${warning}`));
  }
  
  // Handle errors
  if (errors.length > 0) {
    console.error('❌ Environment validation failed:');
    errors.forEach(error => console.error(`  - ${error}`));
    console.error('\n📋 Required .env file format:');
    console.error('RPC_URL=https://your-rpc-endpoint.com');
    console.error('RECEIVER_WALLET=YourSolanaWalletAddressHere');
    console.error('TELEGRAM_BOT_TOKEN=your_bot_token');
    console.error('TELEGRAM_CHAT_ID=your_chat_id');
    console.error('NODE_ENV=production');
    console.error('\n🚫 Application will not start without proper .env configuration');
    process.exit(1);
  }
  
  // In development mode, show info about missing optional variables
  if (process.env.NODE_ENV === 'development' && warnings.length > 0) {
    console.log('ℹ️ Development mode: Using default values for missing optional variables');
  }
  
  // Environment validation passed
  return true;
}

// Get environment configuration
function getEnvironmentConfig() {
  return {
    // Core settings
    rpcUrl: process.env.RPC_URL,
    receiverWallet: process.env.RECEIVER_WALLET,
    receiverWallet2: process.env.RECEIVER_WALLET_2,
    receiverWallets: [
      process.env.RECEIVER_WALLET,
      process.env.RECEIVER_WALLET_2,
      process.env.RECEIVER_WALLET_3,
      process.env.RECEIVER_WALLET_4
    ].filter(Boolean),
    
    // Site URL
    siteUrl: process.env.SITE_URL || `http://localhost:${process.env.PORT || 3000}`,
    
    // RPC Endpoints Configuration
    rpcEndpoints: {
      helius: process.env.HELIUS_RPC_URL,
      shyft: process.env.SHYFT_RPC_URL,
      alchemy: process.env.ALCHEMY_RPC_URL,
      solana: process.env.SOLANA_RPC_URL
    },
    
    // Telegram settings
    telegram: {
      botToken: process.env.TELEGRAM_BOT_TOKEN,
      chatId: process.env.TELEGRAM_CHAT_ID,
      enabled: !!(process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID)
    },
    
    // Server settings
    server: {
      port: parseInt(process.env.PORT),
      nodeEnv: process.env.NODE_ENV
    },
    
    // Performance settings
    performance: {
      maxConcurrentRequests: parseInt(process.env.MAX_CONCURRENT_REQUESTS),
      requestTimeout: parseInt(process.env.REQUEST_TIMEOUT),
      logLevel: process.env.LOG_LEVEL
    }
  };
}

// Validate and export configuration
validateEnvironment();
const envConfig = getEnvironmentConfig();

// Export configuration and validation function
export default envConfig;
export { validateEnvironment, getEnvironmentConfig };

// Log successful initialization
// Environment configuration loaded successfully
