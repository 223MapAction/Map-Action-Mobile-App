import React, { Component } from "react";
import { View, Text, Dimensions } from "react-native";
import { Image } from "react-native-elements";
import { MyImage } from "./Slide3";
const { width, height } = Dimensions.get("window");

export default class Slide1 extends Component {
  render() {
    return (
      <View style={{ alignItems: "center" }}>
        <MyImage
          resizeMode="contain"
          source={require("../../assets/ill1.gif")}
          style={{
            width: width * 0.8,
            height: height * 0.3,
            marginBottom: 22,
          }}
        />
        <Text
          style={{
            color: "#2D9CDB",
            width: width * 0.7,
            textAlign: "center",
            fontSize: 20,
            marginBottom: 10,
          }}
          numberOfLines={2}
        >
          <Text style={{ fontWeight: "bold" }}>Déclarer un incident</Text> en
          seulement 3 clics.
        </Text>
        <Text
          style={{ color: "rgba(0,0,0,.7)", textAlign: "center", fontSize: 14 }}
        >
          Participer efficacement à l’assainissement et la protection de votre
          environnement en rapportant les incidents tels qu’un dépôt d’ordure
          sauvage, une canalisation perforée, une route endommagée, etc. grâce à
          l’application MAP ACTION. Prenez la photo de l’incident, documentez
          avec une vidéo, un message vocal ou un texte et envoyez aux autorités
          compétentes !
        </Text>
      </View>
    );
  }
}
