import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage"
const APP_STORAGE_KEY = "123456544GGGFGGFFFGFGFGFG";
const USER_STORAGE_KEY = "12345654DBGFHRGGSGSG";
export async function getUser() {
  return await getData(USER_STORAGE_KEY, { token: null, user: {} });
}
export async function setUser(user) {
  setData(USER_STORAGE_KEY, user);
}
export async function getData(key, defaultValue = null) {
  try {
    const data = await AsyncStorage.getItem(key);
    if (data) return JSON.parse(data);
  } catch (e) {
    return defaultValue;
  }

  return defaultValue;
}
export function setData(key, data) {
  AsyncStorage.setItem(key, JSON.stringify(data));
}

export function deleteData(key) {
  AsyncStorage.removeItem(key);
}

export async function setIncident(incident) {
  const incidents = await getIncidents();
  incidents.push(incident);
  await setData("inc", incidents);
}

export async function getIncidents() {
  return await getData("inc", []);
}

export async function logout() {
  await deleteData(USER_STORAGE_KEY);
}
const storage = {
  logout,
  setUser,
  getUser,
};

export default storage;
