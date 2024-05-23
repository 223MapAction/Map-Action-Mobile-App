import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Icon, Image } from "react-native-elements";
const { width } = Dimensions.get("window");
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import Camera from "../shared/Camera";

const [WIDTH, HEIGHT] = [640, 580];
const REST = WIDTH - width;

export default class Picture extends Component {
  state = {
    ref: null,
    image: null,
    overlayVisible: false,
    data: {},
    crop: null,
  };

  takePicture = async () => {
    const result = await this.state.ref.current.takePictureAsync();
    this.props.navigation.navigate("DetailSecteur", { photo: result.uri });
    console.log(result, "azerty");

    this.setState({
      image: result.uri,
      overlayVisible: true,
      crop: cropResult,
    });
  };
  /* takePicture = async () => {
    if (this.camera) {
      let photoData = await this.camera.takePictureAsync();
      console.log(photoData);
      this.props.navigation.navigate('DetailSecteur', {photo: photoData.uri})
      //this.setState({ capturing: false, captures: [photoData, ...this.state.captures] }) 
    }
  } */

  setData(field, value) {
    const data = { ...this.state.data };
    data[field] = value;
    this.setState({ data });
  }
  render() {
    if (this.state.test) {
      console.log(this.state.test);
      return (
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#0F0",
          }}
        >
          <Image
            source={{ uri: this.state.test.uri }}
            style={{
              width: this.state.test.width,
              height: this.state.test.height,
            }}
          />
        </View>
      );
    }
    return (
      <>
        <View
          style={{
            backgroundColor: "#2D9CDB",
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Camera
            setRef={(ref) => this.setState({ ref })}
            pictureSize={`${WIDTH}x${HEIGHT}`}
            style={{
              height: HEIGHT,
              width: WIDTH,
              position: "relative",
              alignItems: "center",
              justifyContent: "center",
            }}
            onSetBarCode={(code) => this.setData("numC", code)}
          >
            <View
              style={{
                backgroundColor: "rgba(0,0,0,.8)",
                width: "100%",
              }}
            />
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-start",
              }}
            >
              <View
                style={{
                  backgroundColor: "rgba(0,0,0,.8)",
                }}
              />
              <View
                style={{
                  backgroundColor: "rgba(0,0,0,.8)",
                }}
              />
            </View>
            <View
              style={{
                backgroundColor: "rgba(0,0,0,.8)",
              }}
            />
          </Camera>
          <View
            style={{
              flex: 1,
              alignSelf: "flex-end",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "row",
            }}
          >
            <TouchableOpacity
              style={{
                width: width * 0.2,
                height: width * 0.2,
                borderRadius: width * 0.2,
                backgroundColor: "#313232",
                alignItems: "center",
                justifyContent: "center",
                marginRight: 80,
              }}
              onPress={this.takePicture}
            >
              <Icon
                name={"photo-camera"}
                type={"MaterialIcons"}
                size={30}
                color={"#FFF"}
              />
            </TouchableOpacity>

            <TouchableOpacity style={{ marginRight: 50 }}>
              <Icon
                name={"attach-file"}
                type={"MaterialIcons"}
                size={30}
                color={"rgba(255, 251, 251, 0.75)"}
              />
            </TouchableOpacity>
          </View>
        </View>
      </>
    );
  }
}

const styles = StyleSheet.create({
  link: {
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
    borderWidth: 1,
  },
  bg: {
    width: "100%",
    alignItems: "center",
    height: "50%",
    overflow: "hidden",
    marginVertical: 3,
    flex: 1,
  },
  item: {
    height: 190,
    borderRadius: 6,
    overflow: "hidden",
    marginVertical: 3,
  },
  itemBg: {
    height: 50,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  itemText: {
    textTransform: "uppercase",
    textAlign: "center",
    lineHeight: 50,
    fontSize: 18,
  },
});
