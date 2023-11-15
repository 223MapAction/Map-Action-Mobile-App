import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback,
  Dimensions,
} from "react-native";
import { Feather, FontAwesome5, MaterialIcons } from "@expo/vector-icons";

import iconApp from "../../assets/iconApp.png";
import CardChallenge from "../badge/CardChallenge";
import Modal from "react-native-modal";
import { connect } from "react-redux";
import { has_access, getBadge } from "../../utils/location";
import Constants from "../../utils/constants";

const { height, width } = Dimensions.get("window");

class Challenges extends Component {
  state = {
    phone: "",
    nom: "",
    email: "",
    isModalVisible: false,
  };

  toggleModal = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible });
  };
  BadgeModal = () => {
    this.props.navigation.navigate("Badge");
    this.setState({ isModalVisible: !this.state.isModalVisible });
  };

  render() {
    const h = height * 0.7;

    const incidents = this.props.incidents.filter(
      (i) => i.user_id === this.props.user.id
    );
    const badge = getBadge(incidents.length);
    const hasAccess = has_access(badge, Constants.permissions.add_challenge);

    return (
      <View style={styles.container}>
        <Modal isVisible={this.state.isModalVisible}>
          <View
            style={{
              height: 245,
              backgroundColor: "#fff",
              borderRadius: 15,
              justifyContent: "space-around",
            }}
          >
            <TouchableOpacity
              onPress={this.toggleModal}
              style={{
                zIndex: 10,
                alignSelf: "flex-end",
                paddingRight: 20,
              }}
            >
              <MaterialIcons name="close" size={30} color={"#666666"} />
            </TouchableOpacity>
            <Text style={{ textAlign: "center", fontSize: 20 }}>
              Votre statut ne vous permet pas de créer un challenge.
            </Text>

            <TouchableOpacity
              style={{
                backgroundColor: "#2D9CDB",
                borderRadius: 10,
                width: 200,
                height: 53,
                marginTop: 20,
                alignSelf: "center",
              }}
              onPress={this.BadgeModal}
            >
              <Text
                style={{
                  textAlign: "center",
                  color: "#fff",
                  fontSize: 20,
                  marginTop: 10,
                }}
              >
                En savoir plus
              </Text>
            </TouchableOpacity>
          </View>
        </Modal>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View>
            <View style={{ alignItems: "center", justifyContent: "center" }}>
              <Image
                source={iconApp}
                style={{
                  height: 120,
                  width: 150,
                  justifyContent: "center",
                  alignSelf: "center",
                  marginTop: 50,
                }}
              />
            </View>

            <View style={styles.text}>
              <View style={{ paddingHorizontal: 10 }}>
                <Text
                  style={{ color: "#2D9CDB", fontWeight: "500", fontSize: 14 }}
                >
                  De quoi s’agit-il
                </Text>
                <Text
                  style={{
                    color: "rgba(0,0,0,.7)",
                    fontWeight: "normal",
                    fontSize: 12,
                  }}
                >
                  Un challenge est une action communautaire que vous pouvez
                  initier en invitant les autres utilisateurs de MAP ACTION à
                  vous rejoindre « physiquement » pour mener des activités
                  telles que curer un caniveau, procéder à une campagne de
                  reboisement, assainir la cour d’une école publique, reprendre
                  la peinture d’un banc public, etc. Pour cela, il vous suffit
                  de{" "}
                  <Text style={{ fontWeight: "bold" }}>prendre en photo</Text>{" "}
                  l’objet ou le lieu du challenge,{" "}
                  <Text style={{ fontWeight: "bold" }}>
                    inscrire la date souhaitée{" "}
                  </Text>
                  de réalisation,{" "}
                  <Text style={{ fontWeight: "bold" }}>donner les détails</Text>{" "}
                  et <Text style={{ fontWeight: "bold" }}>les raisons</Text> de
                  l’action communautaire puis{" "}
                  <Text style={{ fontWeight: "bold" }}>approuver</Text>. Votre
                  challenge sera visible par tous les utilisateurs de MAP ACTION
                  qui pourront ainsi participer et vous aider à mettre en place
                  votre action communautaire le jour J.
                </Text>
              </View>

              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  marginTop: 30,
                  marginBottom: 20,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    paddingHorizontal: 10,
                    justifyContent: "space-between",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "bold",
                      color: "rgba(0, 0, 0, 0.32)",
                    }}
                  >
                    Mes challenges
                  </Text>
                </View>

                {this.props.token !== null && hasAccess && (
                  <TouchableWithoutFeedback
                    onPress={() =>
                      this.props.navigation.navigate("NewChallenge")
                    }
                  >
                    <View
                      style={{
                        marginTop: 15,
                        shadowColor: "#ccc",
                        width: 180,
                        shadowOpacity: 0.3,
                        shadowRadius: 0.7,
                        shadowOffset: {
                          width: 3,
                          height: 3,
                        },
                      }}
                    >
                      <View style={styles.bg}>
                        <FontAwesome5 name="plus" size={30} color={"#D8D8D8"} />
                      </View>

                      <View style={[styles.itemContainer]}>
                        <Text
                          style={{
                            justifyContent: "center",
                            textAlign: "center",
                            color: "#6F6F6F",
                            fontSize: 12,
                            fontWeight: "500",
                          }}
                        >
                          {" "}
                          Ajouter un challenge
                        </Text>
                      </View>
                    </View>
                  </TouchableWithoutFeedback>
                )}

                {(this.props.token === null || !hasAccess) && (
                  <TouchableWithoutFeedback onPress={this.toggleModal}>
                    <View
                      style={{
                        marginTop: 15,
                        shadowColor: "#ccc",
                        width: 180,
                        shadowOpacity: 0.3,
                        shadowRadius: 0.7,
                        shadowOffset: {
                          width: 3,
                          height: 3,
                        },
                      }}
                    >
                      <View style={styles.bg}>
                        <FontAwesome5 name="plus" size={30} color={"#D8D8D8"} />
                      </View>

                      <View style={[styles.itemContainer]}>
                        <Text
                          style={{
                            justifyContent: "center",
                            textAlign: "center",
                            color: "#6F6F6F",
                            fontSize: 12,
                            fontWeight: "500",
                          }}
                        >
                          {" "}
                          Ajouter un challenge
                        </Text>
                      </View>
                    </View>
                  </TouchableWithoutFeedback>
                )}

                <CardChallenge navigation={this.props.navigation} />
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  bg: {
    width: "100%",
    height: 100,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F2F2F2",
    borderTopLeftRadius: 15,
    borderTopEndRadius: 15,
  },
  itemContainer: {
    justifyContent: "center",
    backgroundColor: "#FAFAFA",
    borderBottomLeftRadius: 15,
    borderBottomEndRadius: 15,
    elevation: 2,
    height: 70,
    padding: 10,
  },
  calendrier: {
    backgroundColor: "#fff",
    borderRadius: 15,
    width: 89,
    height: 95,
    shadowColor: "#ccc",
    elevation: 2,
    shadowOpacity: 0.5,
    shadowRadius: 1,
    shadowOffset: {
      width: 3,
      height: 3,
    },
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
    marginTop: 20,
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
    paddingHorizontal: 10,
  },
  searchIcon: {
    padding: 10,
  },
  itemStyle: {
    marginBottom: 10,
    flex: 1,
  },
  modifier: {
    marginTop: 10,
    borderRadius: 15,
    backgroundColor: "#fff",
    width: 137,
    height: 38,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#ccc",
    shadowOpacity: 0.5,
    elevation: 2,
    shadowRadius: 1,
    shadowOffset: {
      width: 3,
      height: 3,
    },
  },
});

const mapState = ({ user, incidents }) => ({
  token: user.token ? user.token : null,
  user: user.user || {},
  incidents,
});
export default connect(mapState, null)(Challenges);
