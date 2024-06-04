import 'react-native-gesture-handler/jestSetup';
import { NativeModules } from 'react-native';

NativeModules.RNCNetInfo = {
  getCurrentState: jest.fn(),
};

jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');

  Reanimated.default.call = () => {};
  return Reanimated;
});

jest.mock('@react-native-async-storage/async-storage', () => require('@react-native-async-storage/async-storage/jest/async-storage-mock'));

NativeModules.EXModule = {};

jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

jest.mock('@expo/vector-icons', () => ({
  MaterialIcons: 'MaterialIcons'
}));
jest.mock('expo-camera', () => ({
  Camera: "Camera"
}));
jest.mock('expo-asset', () => ({
  Asset: "Asset"
}));
jest.mock('expo-location', () => ({
  Location: "Location"
}));
jest.mock('expo-av', () => ({
  Audio: "Audio"
}));
jest.mock('expo-image-picker', () => ({
  ImagePicker: "ImagePicker"
}));
jest.mock('react-native-paper', () => ({
  ActivityIndicator: "ActivityIndicator"
}));
jest.mock('react-native-fbsdk-next', () => ({
  LoginManager: "LoginManager",
  AccessToken: "AccessToken"
}));
jest.mock('expo-apple-authentication', () => ({
  AppleAuthentication: "AppleAuthentication"
}));
jest.mock('expo-auth-session/providers/google', () => ({
  Google: "Google"
}));
jest.mock('react-native-simple-twitter', () => ({
  useTwitter: "useTwitter"
}));
jest.mock('@expo/vector-icons', () => ({
  Feather: "Feather",
  MaterialIcons: "MaterialIcons"
}));
// jest.mock('react-native', () => ({
//   Alert: {
//     alert: jest.fn(),
//   },
// }));




