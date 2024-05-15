import constants from "./constantes";
export default (state = [], action = {}) => {
  switch (action.type) {
    case constants.ON_GET_INCIDENTS:
      return action.challenges;
    case constants.ON_ADD_INCIDENT:
      return [action.challenge, ...state];
    case constants.ON_DELETE_INCIDENT:
      return state.filter((ag) => ag.id !== action.challenge.id);
    case constants.ON_EDIT_INCIDENT:
      const data = [...state];
      const index = data.findIndex((ag) => ag.id === action.challenge.id);
      data[index] = { ...data[index], ...action.challenge };
      return data;
    default:
      return state;
  }
};
