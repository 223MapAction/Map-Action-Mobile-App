import http from "./http";
import { list_user } from "./user";

export function create_message(data) {
  return http.post("/message/", data);
}

export default {
  create_message,
};

export async function list_messages(id) {
  // const res = await http.get("/messagebyuser/" + id + "/");
  const res = await http.get("/message_user/" + id + "/");
  return res;
}

export async function responsebymessage(id) {
  // const res = await http.get("/responsebymessage/" + id + "/");
  const res = await http.get("/response_msg/" + id + "/");
  return res;
}
