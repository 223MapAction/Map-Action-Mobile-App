import constants from "./constantes";
export default (state = [], action = {}) => {
  switch (action.type) {
    case constants.ON_GET_PARTICIPATES:
      return action.challenges;
    case constants.ON_ADD_PARTICIPATE:
      return [action.challenge, ...state];
    case constants.ON_DELETE_PARTICIPATE:
      return state.filter((f) => f.id !== action.challenge.id);
    default:
      return state;
  }
};
