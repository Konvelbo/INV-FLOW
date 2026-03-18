/**
 * Shared in-memory store for bridging the Google OAuth session from Chrome to Electron.
 * Using the global object ensures the map persists across HMR in development.
 */
const globalWithBridge = global as typeof globalThis & {
  bridgeSessions?: Map<string, string>;
};

if (!globalWithBridge.bridgeSessions) {
  globalWithBridge.bridgeSessions = new Map<string, string>();
}

export const bridgeSessions = globalWithBridge.bridgeSessions;
