import http from "axios";

import { Alert } from "react-native";
import { getUser } from "../userStorage";

// export const ApiUrl = "http://137.74.196.127:8000";
//http://192.168.1.255:8000

export const ApiUrl = "http://139.144.63.238";
// export const ApiUrl = "https://backend-dashboard.map-action.com";

export const ShareUrl = "https://www.actionmap.withvolkeno.com";
// const apiEndPoint = ApiUrl + "/api";
const apiEndPoint = ApiUrl + "/MapApi";


const axios = http.create({
  baseURL: apiEndPoint,
  timeout: 20000,
});

// export const ResetPasswordUrl = apiEndPoint + "/password_reset";
export const ResetPasswordUrl = apiEndPoint + "/password_reset/";
axios.interceptors.response.use(null, (error) => {
  console.log("error from http", error);
  const status = error?.response?.status || null;

  if (status && !(status >= 200 && status < 300)) {
    if (status >= 400 && status < 500) {
      const data = error.response.data;
      if (data?.detail === "Signature has expired.") {
        // Alert.alert("session expirée veuillez vous reconnecter");
      }
      return Promise.reject(data);
    } else {
      Alert.alert("Server Error", "Please try again", error);
    }
  }
  return Promise.reject(error);
});
function getUrl(url) {
  return url;
}

async function get(url, options = {}) {
  const opt = await getOptions(options);
  return axios.get(getUrl(url), opt).then((res) => res.data);
}

async function post(url, data, options = {}) {
  const opt = await getOptions(options);
  return axios.post(getUrl(url), data, opt).then((res) => res.data);
}
async function put(url, data, options = {}) {
  const opt = await getOptions(options);
  return axios.put(getUrl(url), data, opt).then((res) => res.data);
}
async function deleteItem(url, options = {}) {
  const opt = await getOptions(options);
  return axios.delete(getUrl(url), opt).then((res) => res.data);
}
async function getOptions(options) {
  if (!options.headers) options.headers = {};
  if (!options.headers["Content-Type"])
    options.headers["Content-Type"] = `application/json`;
  if (!options.headers["Authorization"]) {
    const { token } = await getUser();
    if (token) {
      options.headers["Authorization"] = `Bearer ${token}`;
    }
  }
  options.timeout = 30000;
  return options;
}

export function getImage(uri, flag = false) {
  if (uri) {
    if (flag !== false) {
      if (uri === "/uploads/avatars/default.png")
        return require("../../assets/image.jpg");
      else {
        return { uri: ApiUrl + uri };
      }
    } else {
      return { uri: ApiUrl + uri };
    }
  }
  return flag === false
    ? require("../../assets/default.png")
    : require("../../assets/image.jpg");
}

function upload(data, route, onUploadProgress) {
  const config = {
    onUploadProgress: function (progressEvent) {
      let percentCompleted = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
      );
      onUploadProgress(percentCompleted);
    },
    headers: {
      "Content-Type": "multipart/form-data",
    },
  };

  return post(route, data, config);
}

export function makeid(length) {
  let result = "";
  let characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export default {
  get,
  put,
  delete: deleteItem,
  post,
  upload,
};
