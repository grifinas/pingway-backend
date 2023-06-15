module.exports = {
  testEnvironment: "node",
  roots: ["<rootDir>"],
  moduleDirectories: ["node_modules", "."],
  transform: {
    "^.+\\.ts?$": "ts-jest",
  },
  testRegex: "(/__tests__/.*|(\\.|/)(test))\\.ts?$",
  moduleFileExtensions: ["js", "ts", "node"],
  moduleNameMapper: {
    "@lambda-handlers/(.*)": "<rootDir>/lambda-handlers/$1",
    "@core/(.*)": "<rootDir>/core/$1",
    "@common/(.*)": "<rootDir>/common/$1",
  },
};
