import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  FlatList,
  RefreshControl,
} from "react-native";
import { connect } from "react-redux";
import Historique from "../../utils/Historique";
import CardChallenge from "../badge/CardChallenge";
import { list_incident } from "../../utils/http/incident";
import { onGetIncidents } from "../../redux/incidents/action";
import { getImage } from "../../utils/http/http";
import { list_user } from "../../utils/http/user";
import { onGetUsers } from "../../redux/user/action";
import Constants from "../../utils/constants";
import _ from "lodash";
import { Avatar } from "react-native-elements";

class Dashboard extends Component {
  state = {
    refreshing: false,
  };
  async componentDidMount() {
    await this.loadData();
  }
  async loadData() {
    this.setState({ refreshing: true });
    try {
      if (this.props.incidents.length === 0) {
        try {
          const incidents = await list_incident();
          this.props.onGetIncidents(incidents);
        } catch (ex) {
          console.log("Error Incident", ex);
        }
      }
      if (this.props.users.length === 0) {
        try {
          const users = await list_user();
          this.props.onGetUsers(users);
        } catch (ex) {
          console.log("Error Incident", ex);
        }
      }
    } catch (ex) {}
    this.setState({ refreshing: false });
  }
  getUsers = () => {
    let users = [];
    const incidents = this.props.incidents;
    incidents.map((i) => {
      if (!i.user_id) return;
      if (users.findIndex((user) => user.id === i.user_id) === -1) {
        users.push(i.user);
      }
    });
    return users;
  };
  getUser = () => {
    let users = [];
    const incidents = this.props.incidents;
    incidents.map((i) => {
      if (
        users.findIndex((user) => user.id === i.user_id && i.user_id) === -1
      ) {
        users.push(i.user);
      }
    });
    return users.map((user) => {
      const obj = { ...user };
      obj.incidents = incidents.filter((i) => i.user_id === user.id);
      obj.nbIncidents = obj.incidents.length;
      return obj;
    });
  };
  getNumberIncidentsResolved() {
    return this.props.incidents.filter(
      (i) => i.etat === Constants.incidents.state.resolved
    ).length;
  }

  render() {
    const incidents = this.props.incidents;
    const users = this.getUser();
    const usersData = _(users)
      .orderBy(["nbIncidents"], ["desc"])
      .take(15)
      .value();
    return (
      <View style={styles.container}>
        <ScrollView
          refreshControl={
            <RefreshControl
              onRefresh={() => this.loadData()}
              refreshing={this.state.refreshing}
              colors={["#56EC92"]}
              backgroundColor="#FFF"
            />
          }
        >
          <View style={styles.text}>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate("ListIncidents")}
              style={{
                backgroundColor: "#38A3D0",
                borderRadius: 15,
                height: 95,
                width: "97%",
                paddingHorizontal: 20,
                alignSelf: "center",
                justifyContent: "space-around",
              }}
            >
              <Text style={{ fontSize: 16, color: "#fff" }}>
                Nombre de problèmes reportés
              </Text>
              <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
                <Text
                  style={{
                    fontSize: 35,
                    fontWeight: "bold",
                    color: "#56EC92",
                  }}
                >
                  {incidents.length}
                </Text>
                <Text
                  style={{
                    fontSize: 16,
                    color: "#fff",
                    marginLeft: 20,
                    lineHeight: 34,
                  }}
                >
                  {this.getNumberIncidentsResolved()}
                </Text>
                <Text style={{ fontSize: 16, color: "#fff", lineHeight: 34 }}>
                  {"   "}
                  résolus
                </Text>
              </View>
            </TouchableOpacity>

            <View style={{ flex: 1, justifyContent: "center", marginTop: 30 }}>
              <Historique navigation={this.props.navigation} />
              {this.props.token !== null && (
                <View>
                  <View
                    style={{
                      marginTop: 20,
                      flexDirection: "row",
                      marginHorizontal: 20,
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
                      Communauté
                    </Text>
                    <TouchableOpacity
                      onPress={() =>
                        this.props.navigation.navigate("Communaute")
                      }
                    >
                      <Text
                        style={{
                          fontSize: 14,
                          color: "#38A3D0",
                          fontWeight: "500",
                        }}
                      >
                        Voir tout
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <FlatList
                    data={usersData}
                    showsHorizontalScrollIndicator={false}
                    horizontal={true}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                      <View
                        style={{
                          height: 150,
                          marginVertical: 15,
                          marginHorizontal: 10,
                        }}
                      >
                        <Avatar
                          rounded
                          size={70}
                          source={getImage(item.avatar, "f")}
                        />
                        <Text
                          numberOfLines={2}
                          style={{
                            fontSize: 12,
                            width: 70,
                            textAlign: "center",
                            marginTop: 5,
                          }}
                        >
                          {item.first_name} {item.last_name}
                        </Text>
                      </View>
                    )}
                  />
                </View>
              )}

              {this.props.token === null && (
                <CardChallenge navigation={this.props.navigation} />
              )}
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
    backgroundColor: "#fff",
  },
  calendrier: {
    backgroundColor: "#fff",
    borderRadius: 15,
    width: 89,
    height: 95,
    shadowColor: "#ccc",
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
    backgroundColor: "#fff",
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
  bg: {
    width: "100%",
    backgroundColor: "#F8F8F8",
    alignItems: "center",
    height: 130,
    overflow: "hidden",
    marginVertical: 3,
    borderRadius: 3,
    flex: 1,
  },
});

const mapState = ({ user, incidents }) => ({
  token: user.token ? user.token : null,
  users: user.users,
  incidents,
});
export default connect(mapState, { onGetIncidents, onGetUsers })(Dashboard);
