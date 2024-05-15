import * as Location from "expo-location";
import axios from 'axios';

const Map_Box_api = 'sk.eyJ1IjoiYTc1NDJzIiwiYSI6ImNscmtqOHpjbzBmcnIycWs0ZzByeHJhdHAifQ.YFurGvpr4p_tR4059faHvg'


export const getLocation = async () => {
  const status = await ensure();
  if (!status) return null;
  const latLong = await getLatLon();
  let geocode = await reverseGeocode(latLong);

  return geocode;
};

export async function reverseGeocode(address) {
  await ensure();
  const { data } = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${address.longitude},${address.latitude}.json?access_token=Map_Box_api`);


  if (data.features.length > 0) {
    return {
      latitude: data.features[0].center[1],
      longitude: data.features[0].center[0],
    };
  }
  return null;
}

export async function ensure() {
  const status = await Location.requestForegroundPermissionsAsync();
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
    const { data } = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${latLong.longitude},${latLong.latitude}.json?access_token=Map_Box_api`);

    let res = getAddress(data.features, ["sublocality", "sublocality_level_1"]);
    if (res === false) {
      res = getAddress(data.features, ["sublocality"]);
    }
    if (res === false) {
      res = getAddress(data.features, ["administrative_area_level_2"]);
    }
    if (res === false) {
      res = getAddress(data.features, ["administrative_area_level_1"]);
    }
    resolve(!!res ? res : "");
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
  const { data } = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${city}.json?access_token=Map_Box_api`);

  if (data.features.length > 0) {
    const result = await reverseGeocode(data.features[0]);
    if (result) return result.country;
  }
  return "";
}

export async function getVille(location) {
  console.log("location", location);
  if (!location.latitude || !location.longitude) return "";
  const { data } = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${location.longitude},${location.latitude}.json?access_token=Map_Box_api`);

  const result = getAddress(data.features);
  if (result) return result.city || result.region;

  return "";
}

export async function getLatLon() {
  await ensure();
  const location = await Location.getCurrentPositionAsync({});
  const latLong = {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
  };
  return latLong;
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
