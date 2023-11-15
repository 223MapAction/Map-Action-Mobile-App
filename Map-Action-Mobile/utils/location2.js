import Geocoder from "react-native-geocoding";
import * as location from "expo-location";
import { Alert } from "react-native";
import manifest from "../app.json";
Geocoder.init(manifest.expo.android.config.googleMaps.apiKey);
// Geocoder.init("AIzaSyD0klc1PQS8QK--Be3rF3i8kW_idy04AVQ");
export async function getLocationPermissions() {
  const { granted } = await location.getPermissionsAsync();
  if (granted) return true;

  const { granted: g2 } = await location.requestPermissionsAsync();
  return g2;
}
export async function getCurrentPlaces() {
  try {
    const granted = await getLocationPermissions();
    if (!granted) {
      Alert.alert("", "vous n'avez pas activer la service de localisation");
      return [];
    } else {
      const { coords } = await location.getCurrentPositionAsync();
      const { results } = await Geocoder.from(coords);
      if (results) {
        console.log("reults", results[0]);
        const places = [];
        for (let item of results) {
          places.push({
            description: item.formatted_address,
            geometry: item.geometry,
          });
        }
        return places;
      }
      return [];
    }
  } catch (ex) {
    console.log("error", ex);
    return [];
  }
}
export async function getCurrentPosition() {
  try {
    const granted = await getLocationPermissions();
    if (!granted) {
      Alert.alert("", "vous n'avez pas activer la service de localisation");
      return null;
    } else {
      const { coords } = await location.getCurrentPositionAsync();
      const { results } = await Geocoder.from(coords);
      if (results) {
        const item = results[0];
        return {
          adresse: item.formatted_address,
          latitude: coords.latitude,
          ville: getCurrentCityFromAdress(results),
          longitude: coords.longitude,
        };
      }
      return null;
    }
  } catch (ex) {
    console.log("error", ex);
    return null;
  }
}
export async function getPositionFromAdresse(adresse) {
  try {
    const granted = await getLocationPermissions();
    if (!granted) {
      Alert.alert("", "vous n'avez pas activer la service de localisation");
      return null;
    } else {
      const { results } = await Geocoder.from(adresse);
      if (results) {
        const item = results[0];
        return {
          adresse: item.formatted_address,
          latitude: item.geometry.location.lat,
          ville: getCurrentCityFromAdress(results),
          longitude: item.geometry.location.lng,
        };
      }
      return null;
    }
  } catch (ex) {
    console.log("error", ex);
    return null;
  }
}
export function LocationFromAddress(address) {
  return Geocoder.from(address)
    .then(({ results }) => {
      if (results) {
        const item = results[0];
        if (item) {
          const data = {
            latitude: item.geometry.location.lat,
            longitude: item.geometry.location.lng,
          };
          return [data];
        }
      }
      return [];
    })
    .catch((ex) => []);
}

export function CityFromAddress(address) {
  return Geocoder.from(address)
    .then(({ results }) => {
      return getCurrentCityFromAdress(results);
    })
    .catch((ex) => null);
}

export function getCurrentCityFromAdress(results) {
  let res = getAddress(results, ["locality"]);
  if (res === false) {
    res = getAddress(results, ["sublocality_level_1"]);
  }
  if (res === false) {
    res = getAddress(results, ["sublocality"]);
  }
  if (res === false) {
    res = getAddress(results, ["administrative_area_level_2"]);
  }
  if (res === false) {
    res = getAddress(results, ["administrative_area_level_1"]);
  }
  return res;
}
function getAddress(results, criters) {
  for (let { address_components } of results) {
    for (let ad of address_components) {
      let exists = true;
      for (let type of criters) {
        if (!ad.types.includes(type)) exists = false;
      }
      if (exists === true) {
        return ad.long_name;
      }
    }
  }
  return false;
}
