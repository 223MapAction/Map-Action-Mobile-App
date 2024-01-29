import * as location from "expo-location";
import { Alert } from "react-native";
import axios from 'axios';



export async function getLocationPermissions() {
  const { granted } = await location.requestForegroundPermissionsAsync();
  return granted;
}

export async function getCurrentPosition() {
    const Map_Box_api = 'pk.eyJ1IjoiYTc1NDJzIiwiYSI6ImNscmYzanhqeTAxMmgycW9iaXh1N2xoOHAifQ._ZPygGz31WSjc06zwpHNKA'
  try {
    const granted = await getLocationPermissions();
    if (!granted) {
      Alert.alert("", "Vous n'avez pas activé le service de localisation");
      return null;
    } else {
      const { coords } = await location.getCurrentPositionAsync();
      const { data } = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${coords.longitude},${coords.latitude}.json?access_token=${Map_Box_api}`);

      const city = getCurrentCityFromAddress(data.features);
      
      return {
        address: data.features[0].place_name,
        latitude: coords.latitude,
        city: city,
        longitude: coords.longitude,
      };
    }
  } catch (ex) {
    console.log("error", ex);
    return null;
  }
}

export async function getPositionFromAddress(address) {
  try {
    const granted = await getLocationPermissions();
    if (!granted) {
      Alert.alert("", "Vous n'avez pas activé le service de localisation");
      return null;
    } else {
      const { data } = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${address}.json?access_token=${Map_Box_api}`);
      console.log(data)

      const city = getCurrentCityFromAddress(data.features);
      console.log(city)
      
      return {
        address: data.features[0].place_name,
        latitude: data.features[0].center[1],
        city: city,
        longitude: data.features[0].center[0],
      };
    }
  } catch (ex) {
    console.log("error", ex);
    return null;
  }
}

// Fonction pour extraire la ville à partir des résultats de géocodage
export function getCurrentCityFromAddress(results) {
  let res = getAddress(results, ["locality"]);
  // console.log(res)
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

// Fonction pour extraire une composante d'adresse en fonction des critères donnés
function getAddress(results, criters) {
  for (const result of results) { // Utilisez const pour éviter les modifications accidentelles
    if (result && result.address_components) { // Vérifiez si address_components existe
      for (const ad of result.address_components) {
        let exists = true;
        for (const type of criters) {
          if (!ad.types.includes(type)) exists = false;
        }
        if (exists === true) {
          console.log("exists", ad);
          return ad.long_name;
        }
      }
    }
  }
  // console.log(results)
  return null; // Renvoyez null pour indiquer l'absence de résultat
}
