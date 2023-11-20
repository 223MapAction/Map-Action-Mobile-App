import * as Location from "expo-location";
import Geocoder from "react-native-geocoding";
import manifest from "../app.json";
// Geocoder.init(manifest.expo.android.config.googleMaps.apiKey);
Geocoder.init("AIzaSyD0klc1PQS8QK--Be3rF3i8kW_idy04AVQ");
import { Alert } from "react-native";
import Constants from "../utils/constants";
export const getLocation = async () => {
  const status = await ensure();
  if (!status) return null;
  const latLong = await getLatLon();
  let geocode = await Location.reverseGeocodeAsync(latLong);

  return geocode;
};

export async function reverseGeocode(asress) {
  await ensure();
  const geocode = await Location.geocodeAsync(asress);
  if (geocode.length > 0) {
    return {
      latitude: geocode[0].latitude,
      longitude: geocode[0].longitude,
    };
  }
  return null;
}
export async function ensure() {
  const status = await Location.requestPermissionsAsync();
  if (!status.granted) {
    Alert.alert("", "Permission to access location was denied");
    return false;
  }
  try {
    Location.hasServicesEnabledAsync().then((bool) => {
      if (!bool) Location.enableNetworkProviderAsync();
    });
  } catch (ex) {}
  return true;
}

export async function getCurrentCity() {
  return new Promise(async (resolve) => {
    await ensure();
    const latLong = await getLatLon();
    Geocoder.from(latLong)
      .then(({ results }) => {
        let res = getAddress(results, ["sublocality", "sublocality_level_1"]);
        if (res === false) {
          res = getAddress(results, ["sublocality"]);
        }
        if (res === false) {
          res = getAddress(results, ["administrative_area_level_2"]);
        }
        if (res === false) {
          res = getAddress(results, ["administrative_area_level_1"]);
        }
        resolve(!!res ? res : "");
      })
      .catch((ex) => {
        Alert.alert("", ex);
        resolve("");
      });
  });
}
function getAddress(results, criters) {
  for (let { address_components } of results) {
    for (let ad of address_components) {
      let exists = true;
      for (let type of criters) {
        if (!ad.types.includes(type)) exists = false;
      }
      if (exists === true) {
        console.log("exists", ad);
        return ad.long_name;
      }
    }
  }
  return false;
}

export async function getPays(city) {
  const geocode = await Location.geocodeAsync(city);
  if (geocode && geocode.length > 0) {
    const result = await Location.reverseGeocodeAsync(geocode[0]);
    if (result.length > 0) return result[0].country;
  }
  return "";
}
export async function getVille(location) {
  console.log("location", location);
  if (!location.latitude || !location.longitude) return "";
  const result = await Location.reverseGeocodeAsync(location);
  if (result && result.length > 0) return result[0].city || result[0].region;

  return "";
}
export async function getLatLon() {
  await ensure();
  const location = await Location.getCurrentPositionAsync({});
  const latlong = {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
  };
  return latlong;
}

export function getBadge(count) {
  const badges = Constants.badges;
  if (count === 0 || !count) {
    return badges.aucun;
  } else if (count < 3) {
    return badges.cuivre;
  } else if (count < 5) {
    return badges.bronze;
  } else if (count < 10) return badges.argent;
  return badges.gold;
}

export function has_access(badge, permission) {
  return badge.permissions.includes(permission);
}

export default getLocation;
