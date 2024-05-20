import { combineReducers } from "redux";
import user from "./user/user";
import challenges from "./challenges/challenge";
import incidents from "./incidents/incident";
import communautes from "./communautes/participate";
import messages from "./messages/incident";

export default combineReducers({
  user,
  challenges,
  incidents,
  communautes,
  messages,
});
