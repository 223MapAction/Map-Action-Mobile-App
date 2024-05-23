import constants from "./constantes";

export function onGetIncidents(challenges) {
  const action = { type: constants.ON_GET_INCIDENTS, challenges };
  return (dispatch) => {
    return dispatch(action);
  };
}
export function onAddIncident(challenge) {
  const action = { type: constants.ON_ADD_INCIDENT, challenge };
  return (dispatch) => {
    return dispatch(action);
  };
}

export function onDeleteIncident(challenge) {
  const action = { type: constants.ON_DELETE_INCIDENT, challenge };
  return (dispatch) => {
    return dispatch(action);
  };
}
export function onEditIncident(challenge) {
  const action = { type: constants.ON_EDIT_INCIDENT, challenge };
  return (dispatch) => {
    return dispatch(action);
  };
}
