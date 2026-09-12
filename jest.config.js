module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transformIgnorePatterns: [
    '/node_modules/(?!expo|@expo|@react-native-async-storage|react-native)/',
  ],
};
