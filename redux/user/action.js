// 
import constants from "./constantes";

export function onLogin(user) {
  return { type: constants.LOGIN, user };
}

export function onGetUsers(users) {
  return { type: constants.LIST, users };
}

export function onLogout() {
  return { type: constants.LOGOUT };
}
