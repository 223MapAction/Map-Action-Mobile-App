import constants from "./constantes";

export function onGetCommunaute(challenges) {
  const action = { type: constants.ON_GET_communauteS, challenges };
  return (dispatch) => {
    return dispatch(action);
  };
}
