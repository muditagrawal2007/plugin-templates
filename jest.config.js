module.exports = {
    transform: { "^.+\\.ts?$": "ts-jest" },
    testEnvironment: "node",
    testRegex: "/tests/.*\\.(test|spec)?\\.(ts|tsx)$",
    // The timezone dependent tests run in their own suite, see
    // jest.timezone.config.js.
    testPathIgnorePatterns: ["/node_modules/", "\\.timezone\\.spec\\.[jt]sx?$"],
    moduleFileExtensions: ["ts", "js", "json", "node"],
    moduleNameMapper: {
        "^@templates/(.*)$": "<rootDir>/src/$1",
        "^api$": "<rootDir>/tests/mock-joplin-api.ts",
        "^api/types$": "<rootDir>/api/types.ts"
    },
    globalSetup: "./tests/jest-setup.js",
    collectCoverageFrom: ["src/**/*.{js,ts}"]
};
