import http, { makeid } from "./http";

export async function list_user() {
  const getData = async (route) => {
    const { results, next } = await http.get(route);
    if (next) {
      const res = await getData(next);
      return [...results, ...res];
    }
    return results;
  };
  return getData("/user/");
}

export async function read_user(id) {
  return await http.get("/user/" + id);
}

export async function update_user(id, { avatar, ...data }, token = null) {
  let formdata = new FormData();
  if (avatar) {
    let parts = avatar.split("/");
    let filename = parts[parts.length - 1];
    parts = filename.split(".");
    formdata.append("avatar", {
      uri: avatar,
      name: `${makeid(60)}.${parts[parts.length - 1]}`,
      type: "multipart/form-data",
    });
  }

  Object.keys(data).map((k) => {
    formdata.append(k, data[k]);
  });

  const options = {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  };
  if (token) {
    options.headers["Authorization"] = `Bearer ${token}`;
  }
  return http.put("/user/" + id + "/", formdata, options);
}

export default {
  list_user,
};
