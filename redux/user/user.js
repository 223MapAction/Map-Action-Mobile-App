import constants from "./constantes";
export default (state = { users: [], token: null, user: {} }, action = {}) => {
  switch (action.type) {
    case constants.LOGIN:
      return { ...state, ...action.user };
    case constants.LIST:
      return { ...state, users: action.users };
    case constants.LOGOUT:
      return { token: null, user: {}, users: state.users };
    default:
      return state;
  }
};
