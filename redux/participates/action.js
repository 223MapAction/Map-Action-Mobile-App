import constants from "./constantes";

export function onGetParticipates(challenges) {
  const action = { type: constants.ON_GET_PARTICIPATES, challenges };
  return (dispatch) => {
    return dispatch(action);
  };
}
export function onAddParticipate(challenge) {
  const action = { type: constants.ON_ADD_PARTICIPATE, challenge };
  return (dispatch) => {
    return dispatch(action);
  };
}

export function onDeleteParticipate(challenge) {
  const action = { type: constants.ON_DELETE_PARTICIPATE, challenge };
  return (dispatch) => {
    return dispatch(action);
  };
}
