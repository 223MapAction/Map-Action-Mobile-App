import React, { Component } from "react";
import { View, Text, Dimensions } from "react-native";
import { Image } from "react-native-elements";
import { MyImage } from "./Slide3";
const { width, height } = Dimensions.get("window");
export default class Slide2 extends Component {
  render() {
    return (
      <View style={{ alignItems: "center" }}>
        <MyImage
          resizeMode="contain"
          source={require("../../assets/ill2.gif")}
          style={{
            width: width * 0.8,
            height: height * 0.3,
            marginBottom: 20,
          }}
        />

        <Text
          style={{
            color: "#2D9CDB",
            width: width * 0.7,
            textAlign: "center",
            marginBottom: 20,
            fontSize: 22,
          }}
          numberOfLines={2}
        >
          <Text style={{ fontWeight: "bold" }}>Impactez positivement</Text>{" "}
          votre communauté
        </Text>
        <Text
          style={{ color: "rgba(0,0,0,.7)", textAlign: "center", fontSize: 15 }}
        >
          Créez des challenges afin de fédérer les membres de votre communauté
          autour d’actions concrètes que vous pourrez mener. L’union fait la
          force !
        </Text>
      </View>
    );
  }
}
