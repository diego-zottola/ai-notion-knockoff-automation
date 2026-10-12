// Environment Profile primitive: one entry per role. global-setup logs in once per profile.
export const PROFILES = {
  default: {
    name: 'default',
    baseUrl: process.env.BASE_URL,
    credentialsEnvPrefix: 'TEST_USER',
    storageStatePath: 'auth/default.storageState.json',
  },
  // Second identity for permission tests (VIEWER on shared pages). Credentials: VIEWER_USER_USERNAME / VIEWER_USER_PASSWORD.
  viewer: {
    name: 'viewer',
    baseUrl: process.env.BASE_URL,
    credentialsEnvPrefix: 'VIEWER_USER',
    storageStatePath: 'auth/viewer.storageState.json',
  },
};

export function useEnvironment(profileName) {
  const profile = PROFILES[profileName];
  if (!profile) throw new Error(`Unknown environment profile: "${profileName}". Add it to PROFILES in environment-profile.js`);
  return { baseURL: profile.baseUrl, storageState: profile.storageStatePath };
}
