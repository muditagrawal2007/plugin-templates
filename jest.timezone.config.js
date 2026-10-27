// A second test suite that runs in a timezone behind UTC.
//
// A date picker always submits an ISO "yyyy-mm-dd" value, which the
// JavaScript Date constructor reads as UTC midnight. Formatting that value in
// local time moved the date back by one day for every timezone west of UTC.
//
// Jest sandboxes process.env, so the local timezone can't be changed from
// inside a test. The tests that depend on it run here instead, in a process
// that has the timezone set up front.
//
// Run it with: npm run test:timezone
const baseConfig = require("./jest.config");

module.exports = {
    ...baseConfig,
    globalSetup: "<rootDir>/tests/jest-timezone-setup.js",
    testRegex: "/tests/.*\\.timezone\\.spec\\.(ts|tsx)$",
    testPathIgnorePatterns: ["/node_modules/"]
};
