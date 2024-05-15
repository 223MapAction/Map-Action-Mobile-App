import React, { Component } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  Text,
  Alert,
} from "react-native";
import feu from "../assets/consequencefeudebrousse.jpg";
import { Feather, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Input, CheckBox, Button } from "react-native-elements";

export default class DetailSecteur extends Component {
  render() {
    return (
      <KeyboardAwareScrollView>
        <View style={{ flex: 1, width: "100%", backgroundColor: "#fff" }}>
          <ImageBackground
            source={feu}
            style={{ ...styles.bg, justifyContent: "space-around" }}
          >
            <View
              style={{
                marginHorizontal: 10,
                flexDirection: "row",
                alignItems: "flex-end",
                justifyContent: "space-around",
                flex: 1,
                paddingBottom: 20,
              }}
            >
              <View style={{ flexDirection: "row", flex: 1 }}>
                <MaterialIcons name="location-on" color={"#fff"} size={20} />
                <Text
                  style={{ fontWeight: "bold", color: "#fff", marginStart: 6 }}
                >
                  Bamako
                </Text>
              </View>
              <View style={{}}>
                <Text
                  style={{
                    fontSize: 14,
                    textAlign: "center",
                    fontWeight: "bold",
                    color: "#fff",
                  }}
                >
                  02/03/2020
                </Text>
              </View>
            </View>
          </ImageBackground>

          <View style={{ paddingTop: 30 }}>
            <View
              style={{
                borderBottomColor: "#F8F8F8",
                borderBottomWidth: 1,
                padding: 10,
              }}
            >
              <Text
                style={{
                  fontSize: 15,
                  textAlign: "center",
                  marginBottom: 10,
                  color: "#848484",
                }}
              >
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam,{" "}
              </Text>
            </View>

            <View style={{ flexDirection: "column", height: 60 }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: 10,
                }}
              >
                <TouchableOpacity style={{}}>
                  <MaterialIcons
                    name="play-circle-filled"
                    color={"#49DD7B"}
                    size={30}
                  />
                </TouchableOpacity>

                <TouchableOpacity style={styles.ellipse2} />
                <View style={styles.rectangle} />
              </View>
              <Text
                style={{
                  fontSize: 10,
                  justifyContent: "center",
                  alignSelf: "flex-end",
                  marginTop: -10,
                  paddingRight: 43,
                  color: "#A8A7A7",
                }}
              >
                06.20
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                height: 50,
                backgroundColor: "#F3F3F3",
                justifyContent: "center",
                alignItems: "center",
                marginHorizontal: 20,
                borderRadius: 10,
              }}
            >
              <TextInput
                mode="flat"
                selectionColor="#ccc"
                style={{ width: "86%", paddingRight: 10 }}
                /* value={this.state.email} */
                placeholder="Ajouter un commentaire"
                /* onChangeText={(email) => this.setState({email})} */
              />
              <TouchableOpacity>
                <MaterialIcons name="mic-none" color={"#2D9CDB"} size={30} />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              onPress={() => {
                Alert.alert(
                  "",
                  "Vous venez de débloquer l’option “communauté”, Inscrivez-vous pour continuer",
                  [
                    {
                      text: "OK",
                      onPress: () =>
                        this.props.navigation.navigate("DrawerNavigation"),
                    },
                  ],
                  { cancelable: false }
                );
              }}
              style={{
                flexDirection: "row",
                backgroundColor: "#49DD7B",
                marginTop: 20,
                borderRadius: 100,
                alignItems: "center",
                height: 50,
                justifyContent: "center",
                marginHorizontal: 20,
              }}
            >
              <Text
                style={{
                  fontSize: 20,
                  lineHeight: 24,
                  color: "#fff",
                  marginRight: 10,
                  fontWeight: "bold",
                }}
              >
                ENVOYER
              </Text>
              <MaterialIcons name="send" color={"#fff"} size={30} />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAwareScrollView>
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
  ellipse2: {
    width: 10,
    height: 10,
    alignSelf: "center",
    justifyContent: "center",
    borderRadius: 10,
    marginStart: 8,
    backgroundColor: "#49DD7B",
    borderColor: "#FFF",
    borderWidth: 1,
  },
  rectangle: {
    width: 280,
    height: 2,
    backgroundColor: "#D2D2D2",
    borderRadius: 5,
  },
  bg: {
    width: "100%",
    alignItems: "center",
    height: 430,
    overflow: "hidden",
    marginVertical: 3,
    flex: 1,
    backgroundColor: "#fff",
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
