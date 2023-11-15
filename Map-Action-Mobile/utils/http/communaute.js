import http from "./http";
export function create_communaute(data) {
  return http.post("/communaute/", data);
}

export async function list_communaute() {
  const { results } = await http.get("/communaute/");
  return results;
}

export default {
  create_communaute,
};
