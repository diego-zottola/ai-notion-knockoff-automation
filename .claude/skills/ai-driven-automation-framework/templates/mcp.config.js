// TEMPLATE — edit this file to update the scaffold for all future projects.
// Playwright MCP configuration — controls what the MCP server can access.
// Copy to .mcp.json in the target project root at bootstrap time.

export default {
  server: {
    port: process.env.PLAYWRIGHT_MCP_PORT ?? 3000,
  },
  // Restrict MCP to read-only browser actions in CI
  // Set to false locally if you need mutation actions during exploration
  readOnly: process.env.CI === 'true',
  // Allowed origins — restrict to the app under test
  allowedOrigins: [
    process.env.BASE_URL ?? 'http://localhost:3000',
  ],
};
