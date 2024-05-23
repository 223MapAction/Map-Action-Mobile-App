import constants from "./constantes";
import { order } from "./action";
export default (state = [], action = {}) => {
  switch (action.type) {
    case constants.ON_GET_CHALLENGES:
      return action.challenges;
    case constants.ON_ADD_CHALLENGE:
      return order([action.challenge, ...state]);
    case constants.ON_DELETE_CHALLENGE:
      return state.filter((ag) => ag.id !== action.challenge.id);
    case constants.ON_EDIT_CHALLENGE:
      const data = [...state];
      const index = data.findIndex((ag) => ag.id === action.challenge.id);
      data[index] = { ...data[index], ...action.challenge };
      return data;
    default:
      return state;
  }
};
