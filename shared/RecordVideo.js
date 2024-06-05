import {
  Modal,
  View,
  Dimensions,
  StatusBar,
  TouchableOpacity,
  Platform,
} from "react-native";

import React, { Component } from "react";
import { Camera } from "expo-camera";
import { Audio } from "expo-av";
import {
  Feather,
  Entypo,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";

let { width, height } = Dimensions.get("window");
const [WIDTH, HEIGHT] = [width, height * 0.78];
const btnHeight = (height - HEIGHT) * 0.5;
export default class RecordVideo extends Component {
  state = {
    visible: this.props.visible,
  };

  ref = null;
  async componentWillMount() {
    const { status } = await Audio.requestPermissionsAsync();
    if (status === "granted") {
      let status = (await Camera.useCameraPermissions()).status;
      if (status !== "granted") {
        alert("Sorry, we need camera permissions to make this work!");
        this.props.onHide();
      }
    }
  }

  componentDidUpdate() {
    if (!this.state.visible) {
      this.props.onHide();
    }
  }
  recordAsync = async () => {
    const options = Platform.select({
      android: {
        quality: Camera.Constants.VideoQuality["480p"],
      },
      ios: {},
    });
    this.setState({ recording: true });
    const { uri } = await this.ref.recordAsync({
      ...options,
      maxDuration: 5,
    });
    this.setState({ recording: false, visible: false });
    this.props.onFinish(uri);
  };

  render() {
    return (
      <Modal
        animationType="slide"
        transparent={false}
        presentationStyle={"pageSheet"}
        visible={this.state.visible}
        onRequestClose={() => {
          this.setState({ visible: false });
        }}
      >
        <View
          style={{
            flex: 1,
            alignItems: "center",
            backgroundColor: "#000",
          }}
        >
          <View
            style={{ position: "absolute", left: 10, top: 10, zIndex: 1000 }}
          >
            <TouchableOpacity onPress={() => this.setState({ visible: false })}>
              <MaterialIcons name="arrow-back" size={27} color={"#FFF"} />
            </TouchableOpacity>
          </View>
          <Camera
            ref={(ref) => (this.ref = ref)}
            pictureSize={"640x480"}
            style={{ width: WIDTH, height: HEIGHT }}
            ratio={"4:3"}
          />
          <View
            style={{
              flex: 1,
              backgroundColor: "#2D9CDB",
              width,
              justifyContent: "center",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <TouchableOpacity
            testID="record-video"
              style={{
                width: btnHeight,
                height: btnHeight,
                borderRadius: btnHeight,
                zIndex: 1000,
                backgroundColor: "#313232",
                alignItems: "center",
                justifyContent: "center",
              }}
              onPress={this.recordAsync}
            >
              {!this.state.recording && (
                <Feather name="video" color="white" size={btnHeight * 0.5} />
              )}
              {this.state.recording && (
                <MaterialCommunityIcons
                  name="stop-circle-outline"
                  color="red"
                  size={btnHeight * 0.5}
                />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }
}
