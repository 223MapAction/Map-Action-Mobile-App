import constants from "./constantes";

export function onLogin(user) {
  const action = { type: constants.LOGIN, user };
  return (dispatch) => {
    return dispatch(action);
  };
}

export function onGetUsers(users) {
  const action = { type: constants.LIST, users };
  return (dispatch) => {
    return dispatch(action);
  };
}

export function onLogout() {
  const action = { type: constants.LOGOUT };
  return (dispatch) => {
    return dispatch(action);
  };
}
