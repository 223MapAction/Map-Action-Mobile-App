import http from "./http";
import { list_user } from "./user";
export function create_challenge({ photo, video, ...data }, uploadProgress) {
  let formdata = new FormData();
  if (photo) {
    let parts = photo.split("/");
    let filename = parts[parts.length - 1];
    parts = filename.split(".");
    formdata.append("photo", {
      uri: photo,
      name: `${makeid(60)}.${parts[parts.length - 1]}`,
      type: "multipart/form-data",
    });
  }
  if (video) {
    let parts = video.split("/");
    let filename = parts[parts.length - 1];
    parts = filename.split(".");
    formdata.append("video", {
      uri: video,
      name: `${makeid(60)}.${parts[parts.length - 1]}`,
      type: "multipart/form-data",
    });
  }
  Object.keys(data).map((k) => {
    formdata.append(k, data[k]);
  });
  return http.upload(
    formdata,
    // "/evenement/",
    "/Event/",
    video && video !== "" ? uploadProgress : () => null
  );
}

export async function list_challenge() {
  // const { results } = await http.get("/evenement/");
  const { results } = await http.get("/Event/");
  console.log("les evenements", results)
  const usersId = Array.from(new Set(results.map((r) => r.user_id)));
  const users = (await list_user()).filter((f) => usersId.includes(f.id));
  const participates = await list_participate();
  const finalData = [];
  results.forEach((res) => {
    res.participates = [];
    res.user = users.find((u) => u.id === res.user_id) || {};
    for (let p of participates) {
      if (p.evenement_id === res.id) {
        res.participates.push(p);
      }
    }
    finalData.push(res);
  });
  return finalData;
}

export function participate(user_id, evenement_id) {
  return http.post("/participate/", { user_id, evenement_id });
}
export function un_participate(id) {
  return http.delete("/participate/" + id + "/");
}
export async function list_participate() {
  const { results } = await http.get("/participate/");
  return results;
}
export function makeid(length) {
  let result = "";
  let characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
