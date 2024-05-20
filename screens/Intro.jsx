import React, { Component } from "react";
import { View, StatusBar } from "react-native";
import { Icon } from "react-native-elements";
import AppIntroSlider from "react-native-app-intro-slider";
import Slide1 from "./slides/Slide1";
import Slide2 from "./slides/Slide2";
import Slide3 from "./slides/Slide3";
import { BackgroundApp, MajjalImage } from "../shared/BackgroundApp";
import Colors from "../constants/Colors";
import { TextBold, TextLight } from "../components/StyledText";
import Layout from "../constants/Layout";
export class Intro extends Component {
  items = [
    { Content: Slide1, key: "0" },
    { Content: Slide2, key: "1" },
    { Content: Slide3, key: "3" },
  ];
  renderItem = ({ item }) => {
    const { Content } = item;
    return (
      <View style={{ paddingHorizontal: 25 }}>
        <View
          style={{ marginBottom: 70, marginTop: 83 - Layout.window.paddingTop }}
        >
          <MajjalImage />
        </View>
        <TextBold style={{ color: "#FFF", fontSize: 25, marginBottom: 30 }}>
          Maajjaal
          <TextLight style={{ fontWeight: "normal" }}> C'est ...</TextLight>
        </TextBold>
        <Content />
      </View>
    );
  };
  renderButton = () => {
    return (
      <View style={{ marginBottom: 40, marginTop: 30 }}>
        <Icon
          name="arrow-right-circle"
          color={Colors.green}
          type="simple-line-icon"
          size={50}
        />
      </View>
    );
  };
  onDone = () => {
    this.props.navigation.navigate("Login");
  };
  render() {
    return (
      <BackgroundApp>
        <AppIntroSlider
          renderItem={this.renderItem}
          data={this.items}
          bottomButton
          dotStyle={{ backgroundColor: "rgba(255,255,255,.4)" }}
          keyExtractor={(item) => item.key}
          renderNextButton={this.renderButton}
          renderDoneButton={this.renderButton}
          onDone={this.onDone}
        />
      </BackgroundApp>
    );
  }
}
