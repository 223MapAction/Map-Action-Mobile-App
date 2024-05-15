import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import { Camera } from "expo-camera";
export default async function pickImage() {
  console.log("La fonction pickImage est appelée.");
  const status = await askAsync();
  let result;
  if (status) {
    result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    if (!result.cancelled) {
      return result;
    }
  }

  return {};
}

export async function getCameraPermission() {
  const { status } = await Camera.requestPermissionsAsync();
  return status === "granted";
}

async function askAsync() {
  let status = (await Permissions.askAsync(Permissions.CAMERA_ROLL)).status;
  if (status !== "granted") {
    alert("Sorry, we need camera permissions to make this work!");
    return false;
  }
  return true;
}
