import http, { makeid } from "./http";

export async function register({ avatar, ...data }) {
  let formdata = new FormData();
  if (avatar) {
    let parts = avatar.split("/");
    let filename = parts[parts.length - 1];
    const last = parts[parts.length - 1];
    const extension = last.length > 3 ? "png" : last;
    console.log(extension);
    parts = filename.split(".");
    formdata.append("avatar", {
      uri: avatar,
      name: `${makeid(40)}.${extension}`,
      type: "multipart/form-data",
    });
  }

  Object.keys(data).map((k) => {
    formdata.append(k, data[k]);
  });

  const options = {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  };
  return http.post("/auth/register/", formdata, options);
}
export function login(user) {
  return http.post("/auth/login/", user);
}

export function verify_token(token) {
  return http.post("/auth/verify-token/", { token });
}
export function refresh_token(data) {
  return http.post("/auth/refresh-token/", data);
}

export function get_token(email, password) {
  return http.post("/auth/get-token/", { email, password });
}
export function getTokenByEmail(email) {
  return http.post("/gettoken_bymail/", { email });
}
export function login_with_google(user){
  return http.post("/accounts/google/login/")
}
export function login_with_facebook(user){
  return http.post("/accounts/facebook/login/")
}
export function login_with_apple(user){
  return http.post("/accounts/apple/login/")
}

export default {
  register,
  login,
  verify_token,
  login_with_google,
  login_with_facebook,
  login_with_apple,
};
