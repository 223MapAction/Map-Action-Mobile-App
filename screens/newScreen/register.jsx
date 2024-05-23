
import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import icon from "../../assets/actionmapBlanc.png";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { TextInput } from "react-native-paper";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

class Register extends Component {
  state = {
    phone: "",
    nom: "",
    email: "",
  };

  render() {
    return (
      <View style={styles.container}>
        <ScrollView style={{ flex: 1 }}>
          <View>

            <KeyboardAwareScrollView>
              <View style={styles.text}>
                <Text
                  style={{
                    flex: 1,
                    fontStyle: "normal",
                    fontWeight: "normal",
                    fontSize: 15,
                    lineHeight: 18,
                    textAlign: "justify",
                    color: "#726B6B",
                  }}
                >
                  Nous nous engageons au respect lorem ipsu ipsum dolor sit
                  amet, consectetur jlorem ipsu adipiscing elit, sed do eiusmod
                  temporare na isaa incididunt ut labore et dolgageon lorem
                  lorems...
                  <Text
                    onPress={() => null}
                    style={{ color: "#2D9CDB", fontWeight: "bold" }}
                  >
                    Read more
                  </Text>
                </Text>

                <View
                  style={{ flex: 1, justifyContent: "center", marginTop: 30 }}
                >
                  <View
                    style={{ flex: 1, justifyContent: "center", marginTop: 30 }}
                  >
                    <Text
                      style={{
                        alignSelf: "center",
                        color: "#38A3D0",
                        fontStyle: "normal",
                        fontWeight: "bold",
                        fontSize: 18,
                        lineHeight: 24,
                      }}
                    >
                      Enregistrez vos coordonnées
                    </Text>

                    <View style={{ marginTop: 30, ...styles.section }}>
                      <MaterialIcons name="person" color={"#ccc"} size={20} />
                      <TextInput
                        mode="flat"
                        style={{
                          backgroundColor: "transparant",
                          width: "90%",
                          borderBottomColor: "transparant",
                          paddingRight: 10,
                        }}
                        value={this.state.nom}
                        placeholder="Nom d'utilisateur"
                        underlineColor="transparant"
                        onChangeText={(nom) => this.setState({ nom })}
                      />
                    </View>
                    <View style={{ marginTop: 20, ...styles.section }}>
                      <MaterialIcons
                        name="settings-phone"
                        color={"#ccc"}
                        size={20}
                      />
                      <TextInput
                        mode="flat"
                        style={{
                          backgroundColor: "transparant",
                          width: "90%",
                          borderBottomColor: "transparant",
                          paddingRight: 10,
                        }}
                        value={this.state.phone}
                        placeholder="N° de téléphone du citoyen"
                        underlineColor="transparant"
                        onChangeText={(phone) => this.setState({ phone })}
                      />
                    </View>

                    <View
                      style={{ marginTop: 20, height: 50, ...styles.section }}
                    >
                      <MaterialIcons name="email" color={"#ccc"} size={20} />
                      <TextInput
                        mode="flat"
                        style={{
                          backgroundColor: "transparant",
                          width: "90%",
                          borderBottomColor: "transparant",
                          paddingRight: 10,
                        }}
                        value={this.state.email}
                        placeholder="Adresse mail du citoyen"
                        underlineColor="transparant"
                        onChangeText={(email) => this.setState({ email })}
                      />
                    </View>
                    

                    <View style={{ marginTop: 30 }}>
                      <TouchableOpacity
                        onPress={() =>
                          this.props.navigation.navigate("DrawerNavigation")
                        }
                        style={{
                          backgroundColor: "#49DD7B",
                          borderRadius: 35,
                          alignItems: "center",
                          height: 50,
                          justifyContent: "center",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 20,
                            lineHeight: 24,
                            color: "#fff",
                            fontWeight: "bold",
                          }}
                        >
                          Valider
                        </Text>
                      </TouchableOpacity>
                    </View>
                    
                  </View>
                </View>
              </View>
            </KeyboardAwareScrollView>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingStart: 10,
    backgroundColor: "#fff",
  },
  text: {
    marginHorizontal: 10,
    justifyContent: "center",
    flex: 1,
    marginTop: 50,
  },
  iconStyle: {
    color: "#5a52a5",
    fontSize: 28,
    marginLeft: 15,
  },

  ellipse: {
    width: 50,
    height: 50,
    alignSelf: "center",
    justifyContent: "center",
    borderRadius: 50,
    alignItems: "center",
    backgroundColor: "#49DD7B",
    borderColor: "#FFF",
    borderWidth: 1,
  },
  ellipse2: {
    width: 10,
    height: 10,
    alignSelf: "center",
    justifyContent: "center",
    borderRadius: 10,
    marginStart: 8,
    backgroundColor: "rgba(196, 196, 196, 0.45)",
    borderColor: "#FFF",
    borderWidth: 1,
  },

  section: {
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: 30,
    borderRadius: 35,
    shadowColor: "#ccc",
    shadowOpacity: 0.5,
    shadowRadius: 1,
    shadowOffset: {
      width: 3,
      height: 3,
    },
  },
  searchIcon: {
    padding: 10,
  },
  itemStyle: {
    marginBottom: 10,
    flex: 1,
  },
});
export default Register;
