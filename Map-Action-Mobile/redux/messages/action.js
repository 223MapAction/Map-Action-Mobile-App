import constants from "./constantes";

export function onGetMessages(challenges) {
  const action = { type: constants.ON_GET_MESSAGES, challenges };
  return (dispatch) => {
    return dispatch(action);
  };
}
export function onAddMessage(challenge) {
  const action = { type: constants.ON_ADD_MESSAGE, challenge };
  return (dispatch) => {
    return dispatch(action);
  };
}

export function onDeleteMessage(challenge) {
  const action = { type: constants.ON_DELETE_MESSAGE, challenge };
  return (dispatch) => {
    return dispatch(action);
  };
}
export function onEditMessage(challenge) {
  const action = { type: constants.ON_EDIT_MESSAGE, challenge };
  return (dispatch) => {
    return dispatch(action);
  };
}
