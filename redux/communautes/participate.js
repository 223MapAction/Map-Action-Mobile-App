import constants from "./constantes";
export default (state = [], action = {}) => {
  switch (action.type) {
    case constants.ON_GET_communauteS:
      return action.challenges;

    default:
      return state;
  }
};
