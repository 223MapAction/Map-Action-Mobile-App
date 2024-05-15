import constants from "./constantes";
import _ from "lodash";
import moment from "moment";
export function order(challenges) {
  const data = challenges.map((d) => {
    d.dateOrder = moment(d.date).toDate().getTime();
    return d;
  });
  const toDay = moment().subtract(1, "d").toDate().getTime();
  const filtred = _(data)
    .orderBy(["dateOrder"], ["asc"])
    .filter((item) => item.dateOrder > toDay)
    .value();
  const rest = _(data)
    .orderBy(["dateOrder"], ["desc"])
    .filter((item) => item.dateOrder <= toDay)
    .value();
  return [...filtred, ...rest];
}
export function onGetChallenges(challenges) {
  const action = {
    type: constants.ON_GET_CHALLENGES,
    challenges: order(challenges),
  };
  return (dispatch) => {
    return dispatch(action);
  };
}
export function onAddChallenge(challenge) {
  const action = { type: constants.ON_ADD_CHALLENGE, challenge };
  return (dispatch) => {
    return dispatch(action);
  };
}

export function onDeleteChallenge(challenge) {
  const action = { type: constants.ON_DELETE_CHALLENGE, challenge };
  return (dispatch) => {
    return dispatch(action);
  };
}
export function onEditChallenge(challenge) {
  const action = { type: constants.ON_EDIT_CHALLENGE, challenge };
  return (dispatch) => {
    return dispatch(action);
  };
}
