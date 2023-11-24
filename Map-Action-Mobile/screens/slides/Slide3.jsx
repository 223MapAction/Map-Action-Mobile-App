import React, { Component } from "react";
import { View, Text, Dimensions } from "react-native";
import { Image } from "react-native-elements";
import { Asset } from "expo-asset";
const { width, height } = Dimensions.get("window");
export default class Slide3 extends Component {
  render() {
    return (
      <View style={{ alignItems: "center" }}>
        <MyImage
          resizeMode="contain"
          source={require("../../assets/ill3.gif")}
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
          Faites du bien à{" "}
          <Text style={{ fontWeight: "bold" }}>votre ville</Text> et
          <Text style={{ fontWeight: "bold" }}> gagnez des lots</Text>
        </Text>
        <Text
          style={{ color: "rgba(0,0,0,.7)", textAlign: "center", fontSize: 15 }}
        >
          Plus vous reportez des incidents ou organisez des challenges, plus
          vous remportez des badges qui permettent de débloquer des
          fonctionnalités de l’application et gagnez de nombreux lots avec nos
          partenaires.
        </Text>
      </View>
    );
  }
}

export function MyImage({ source, ...props }) {
  return <Image {...props} source={source} />;
}
