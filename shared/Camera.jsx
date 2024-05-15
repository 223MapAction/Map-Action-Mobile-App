import React from "react";
import { Alert } from "react-native";
import { Camera } from "expo-camera";
import { getCameraPermission } from "../utils/image";

export default class Camera2 extends React.Component {
  ref = React.createRef();
  async componentDidMount() {
    if ((await getCameraPermission()) === false) {
      Alert.alert(
        "",
        "Désolé, nous avons besoin d'autorisations de caméra pour que cela fonctionne!"
      );
    }
    this.props.setRef(this.ref);
  }

  render() {
    const style = this.props.style;
    return (
      <Camera
        pictureSize="640x480"
        ref={this.ref}
        style={style}
        type={Camera.Constants.Type.back}
      />
    );
  }
}
