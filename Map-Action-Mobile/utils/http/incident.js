import http from "./http";
import { makeid } from "./challenge";

export async function create_incident(
  { photo, audio, video, ...data },
  onUploadProgress
) {
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
  if (audio) {
    let parts = audio.split("/");
    let filename = parts[parts.length - 1];
    parts = filename.split(".");
    formdata.append("audio", {
      uri: audio,
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

  console.log("formData", formdata);

  return http.upload(formdata, "/incident/", onUploadProgress);
}

export function update_incident(id, data) {
  return http.put("/incident/" + id + "/", data);
}

export async function list_incident() {
  const res = await http.get("/incident/");

  const { results, ...rest } = res;
  console.log(rest);
  const finalData = [];
  results.map((res) => {
    if (res.user_id) {
      res.user = res.user_id;
      res.user_id = res.user.id;
      finalData.push(res);
    } else {
      finalData.push({ ...res, user: {} });
    }

    return res;
  });

  return finalData;
}

export async function list_categories() {
  const { results } = await http.get("/category/");

  return results;
}

export async function list_zone() {
  const { results } = await http.get("/zone/");

  return results;
}
