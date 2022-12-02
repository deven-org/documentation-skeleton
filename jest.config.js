module.exports = {
  preset: "ts-jest",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  testMatch: ["**/__tests__/**/*.spec.(js|ts)"],
  verbose: false,
  collectCoverageFrom: ["src/**/*.ts", "!**/node_modules/**"],
  coverageReporters: ["html", "text", "text-summary", "cobertura"],
  coverageThreshold: {
    global: {
      lines: 90,
    },
  },
};
