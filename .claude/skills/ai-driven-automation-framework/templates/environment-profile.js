/**
 * TEMPLATE — edit this file to update the scaffold for all future projects.
 *
 * Environment Profile primitive — replaces the ad-hoc storageState + multi-role pattern.
 * Each profile maps a named environment to its base URL, credentials env prefix,
 * and the storageState file that global-setup generates for it.
 *
 * Usage in specs:
 *   test.use(environmentFixtures['admin'])
 *
 * Usage in global-setup:
 *   for (const profile of Object.values(PROFILES)) { ...login and save storageState... }
 */

// One entry per role/environment combination used in this project.
// credentialsEnvPrefix: the env var prefix — e.g. 'ADMIN' resolves to
//   process.env.ADMIN_EMAIL and process.env.ADMIN_PASSWORD
export const PROFILES = {
  default: {
    name: 'default',
    baseUrl: process.env.BASE_URL,
    credentialsEnvPrefix: 'TEST_USER',
    storageStatePath: 'auth/default.storageState.json',
  },
  admin: {
    name: 'admin',
    baseUrl: process.env.BASE_URL,
    credentialsEnvPrefix: 'ADMIN',
    storageStatePath: 'auth/admin.storageState.json',
  },
  // Add more roles here — one block per role, no code changes elsewhere needed.
};

/**
 * Returns a Playwright fixture config object for a given profile name.
 * Use as: test.use(useEnvironment('admin'))
 */
export function useEnvironment(profileName) {
  const profile = PROFILES[profileName];
  if (!profile) throw new Error(`Unknown environment profile: "${profileName}". Add it to PROFILES in environment-profile.js`);
  return {
    baseURL: profile.baseUrl,
    storageState: profile.storageStatePath,
  };
}
