import {React, Component } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import {actionmap} from "../assets/actionmapBlanc.png";
import {icon} from "../assets/iconApp.png";
import {AppIntroSlider} from "react-native-app-intro-slider";
import {Slide1} from "./slides/Slide1";
import {Slide2} from "./slides/Slide2";
import {Slide3} from "./slides/Slide3";
class Accueil extends Component {
  items = [
    { Content: Slide1, key: "0" },
    { Content: Slide2, key: "1" },
    { Content: Slide3, key: "3" },
  ];
  renderItem = ({ item }) => {
    const { Content } = item;
    return (
      <View style={{ paddingHorizontal: 15 }}>
        <View style={{ marginBottom: 5, marginTop: '13%', alignItems: "center" }}>
          <Image
            source={actionmap}
            resizeMode="contain"
            style={{
              width: 125,
              height: 50,
            }}
          />
        </View>
        <Content />
      </View>
    );
  };
  renderButton = (title) => {
    return (
      <View
        style={styles.ellipse}
        // onPress={() => this.props.navigation.replace("DrawerNavigation")}
      >
        <Text style={{ color: "#fff", fontWeight: "bold" }}>{title}</Text>
      </View>
    );
  };
  onDone = () => {
    this.props.navigation.replace("DrawerNavigation");
  };
  render() {
    return (
      <View style={{ flex: 1, backgroundColor: "#FFF" }}>
        <AppIntroSlider
          renderItem={this.renderItem}
          data={this.items}
          bottomButton
          dotStyle={{ backgroundColor: "#eee" }}
          activeDotStyle={{ backgroundColor: "#2D9CDB" }}
          keyExtractor={(item) => item.key}
          renderNextButton={() => this.renderButton("SUIVANT")}
          renderDoneButton={() => this.renderButton("COMMENCER")}
          onDone={this.onDone}
        />
        <View style={{ marginBottom: 10, alignItems: "center" }}>
          <TouchableOpacity onPress={() => this.props.navigation.push("Login")}>
            <Text style={{ fontSize: 15, color: "rgba(0,0,0,.5)" }}>
              Déjà inscrit ?{" "}
              <Text style={{ fontWeight: "bold" }}>Se connecter</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  ellipse: {
    width: 282,
    height: 45,
    alignSelf: "center",
    justifyContent: "center",
    borderRadius: 100,
    alignItems: "center",
    backgroundColor: "#49DD7B",
    borderColor: "#FFF",
    borderWidth: 1,
  },
});
export default Accueil;
