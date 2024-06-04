module.exports = {
    preset: "react-native",
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    transform: {
        '^.+\\.[t|j]sx?$': 'babel-jest',
    },
    transformIgnorePatterns: [
        "expo/build/winter",
        "node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg|@expo/vector-icons)"
    ],
    collectCoverage: true,
    coverageReporters: ['text', 'cobertura'],
    testPathIgnorePatterns: [
        "/node_modules/",
        "/ios/",
        "/android/"
    ],
    setupFiles: ['./config/jestSetupFile.js'],
    // setupFiles: ['./node_modules/jest-expo/src/preset/setup.js'],
    
};
