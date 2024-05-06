import http, { makeid,  } from "./http";
const csrfTokenUrl = '/get_csrf_token/';
async function fetchCSRFToken() {
  try {
    const response = await http.get(csrfTokenUrl);
    // console.log('Réponse de récupération du jeton CSRF :', response);
    const csrfToken = response.csrf_token;
    console.log('CSRF Token:', csrfToken);
    return csrfToken;
  } catch (error) {
    console.error('Erreur lors de la récupération du jeton CSRF :', error);
    throw error;
  }
}


export async function register({ avatar, ...data }) {
  console.log("La fonction register est appelée avec les données suivantes :", data);
  try {
    // const csrfToken = await fetchCSRFToken();
    // console.log('CSRF Token:', csrfToken);

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
        // 'X-CSRFToken': csrfToken,
        'Content-Type': 'multipart/form-data',
      }
    };
    console.log('Options headers:', options.headers);
    const response = await http.post('/register/', formdata, options);
    console.log('les infos', response)
    return response;
  } catch (error) {
    throw error;
  }
}

export async function login(user) {
  // const csrfToken = await fetchCSRFToken();
  // const formData = new FormData();
  // formData.append('email', user.email);
  // formData.append('password', user.password);
  // console.log("Les utilisateurs ",user)

  // const options = {
  //   headers: {
  //     'X-CSRFToken': csrfToken,
  //   },
  // };

  try {
    console.log("Avant l'appel de l'API login"); 
    const response = await http.post("/login/", user);
    console.log("Réponse de l'API login:", response); 
    return response;
  } catch (error) {
    console.log("Erreur lors de la connexion:", error); 
    throw error; 
  }
}


export function verify_token(token) {
  // return http.post("/auth/verify-token/", { token });
  return http.post("/verify-token/", { token });
}
export function refresh_token(data) {
  return http.post("/token/refresh/", data);
}

export function get_token(email, password) {
  return http.post("/api/token/", { email, password });
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
