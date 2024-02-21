// import * as Google from "expo-google-app-auth";
import * as Google from "expo-auth-session/providers/google"
import axios from "axios";
const config = {
  iosClientId:
    /* "853178679023-di2lnclenhm3ob0cqkignc7d76o8efoj.apps.googleusercontent.com", */
    "110249823000-t1l6jl7g0qpaop5ogui51ku1c4it0t5f.apps.googleusercontent.com",
  ClientId:
    /* "853178679023-oa1rs2n9ci8707qn5mo1ipha7hkbou8l.apps.googleusercontent.com", */
    "292571474979-qkev39d82s0f2ntpnv9jh5puel8hjhog.apps.googleusercontent.com",
  iosStandaloneAppClientId:
    /* "853178679023-mjgffq5c4kaq65718e49p5b1km888lqr.apps.googleusercontent.com" */
    "110249823000-o91i5p0t6eer4bh44cab412hf6vph5kg.apps.googleusercontent.com",
  androidStandaloneAppClientId:
    /* "853178679023-8b42n4ls5es0dpaf8t7gakls5h2g998c.apps.googleusercontent.com" */
    "110249823000-60mqqour4lel08fsf571ub2lrgcn96rl.apps.googleusercontent.com",
  scopes: ["profile"],
};
export async function loginAsync() {
  try {
    const { type, ...rest } = await Google.logInAsync(config);

    if (type === 'success') {
      return rest;
    } else if (type === 'error') {
      console.error('Erreur lors de la connexion:', rest.error);
      return null;
    } else {
      console.warn('Connexion annulée par l\'utilisateur');
      return null;
    }
  } catch (error) {
    console.error('Erreur inattendue lors de la connexion:', error);
    return null;
  }
}


export async function loginWithLinkedIn(token) {
  const { data } = await axios.get("https://api.linkedin.com/v2/me", {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return data;
}

export async function loginWithLinkedInAndGetEmails(token) {
  const { data } = await axios.get(
    "https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))",
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return data;
}
