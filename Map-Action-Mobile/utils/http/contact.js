import http from "./http";
export function create_contact(data) {
  return http.post("/contact/", data);
}

export default {
  create_contact,
};
