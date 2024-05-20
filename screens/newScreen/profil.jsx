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
import { MaterialIcons, AntDesign } from "@expo/vector-icons";
import IconBadge from "react-native-icon-badge";
import Historique from "../../utils/Historique";
import { connect } from "react-redux";
import moment from "moment";
import { getImage, ShareUrl } from "../../utils/http/http";
import { getBadge } from "../../utils/location";
import Share from "../badge/Share";
import { Icon } from "react-native-elements";
import { list_challenge } from "../../utils/http/challenge";
import { onGetChallenges } from "../../redux/challenges/action";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { ImageThumb } from "./Gallery";
class Profil extends Component {
  state = {
    points: 0,
    nbre_incidents: 0,
    photos: [],
    nbre_challenges: 0,
    nbre_challenges_created: 0,
    loading: false,
    badge: {},
  };
  async componentDidMount() {
    await this.fetchData(this.props.user);
  }
  async UNSAFE_componentWillReceiveProps(nextProps) {
    console.log("fetching data");
    await this.fetchData(nextProps.user);
  }
  async fetchData(user = null) {
    if (null === user) return;
    const { id: user_id } = user;
    this.setState({ loading: true });
    let { incidents: incs, challenges } = this.props;

    if (challenges.length === 0) {
      try {
        challenges = await list_challenge();
        this.props.onGetChallenges(challenges);
      } catch (ex) {
        console.log("error challenges", ex);
      }
    }
    const incidents = incs.filter((i) => i.user_id === user_id);
    const nbre_incidents = incidents.length;
    this.setState({
      badge: getBadge(nbre_incidents),
      nbre_incidents: nbre_incidents,
    });
    const participated_challenges = challenges.filter(
      (c) => c.participates.findIndex((p) => p.user_id === user_id) !== -1
    );
    const created_challenges = challenges.filter((c) => c.user_id === user_id);
    let points = user?.points || 0;
    this.setState({
      points: points,
      nbre_challenges: participated_challenges.length,
      nbre_challenges_created: created_challenges.length,
      loading: false,
      photos: [
        ...incidents.map((i) => i.photo),
        created_challenges.map((i) => i.photo),
      ],
    });
  }
  render() {
    const {
      points,
      nbre_incidents,
      nbre_challenges,
      nbre_challenges_created,
      loading,
      badge,
    } = this.state;
    const { user } = this.props;

    return (
      <View style={styles.container}>
        {this.props.token !== null && (
          <ScrollView
            contentContainerStyle={{ marginBottom: 40 }}
            refreshControl={
              <RefreshControl
                onRefresh={() => this.fetchData(user)}
                refreshing={loading}
              />
            }
          >
            <View>
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  paddingTop: 20,
                }}
              >
                <IconBadge
                  MainElement={
                    <View style={{ justifyContent: "center" }}>
                      <Image
                        resizeMode="cover"
                        style={{ width: 90, height: 90, borderRadius: 100 }}
                        source={getImage(user.avatar, "d")}
                      />
                    </View>
                  }
                  BadgeElement={
                    <MaterialIcons name="stars" size={30} color={badge.color} />
                  }
                  IconBadgeStyle={{
                    width: 30,
                    height: 30,
                    backgroundColor: "#fff",
                  }}
                />
                <View style={{}}>
                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: "600",
                      color: "#757474",
                      alignSelf: "center",
                      justifyContent: "center",
                    }}
                  >
                    {user.first_name} {user.last_name}
                  </Text>
                  <Text
                    style={{
                      fontSize: 10,
                      fontWeight: "300",
                      color: "#858585",
                      alignSelf: "center",
                    }}
                  >
                    Inscrit depuis{" "}
                    {moment(user.date_joined).format("MMMM YYYY")}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                  }}
                >
                  <TouchableOpacity
                    style={styles.modifier}
                    onPress={() => this.props.navigation.push("Account")}
                  >
                    <Text
                      style={{
                        fontSize: 12,
                        color: "#38A3D0",
                        fontWeight: "bold",
                      }}
                    >
                      Modifier votre profil
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() =>
                      Share.share(
                        `je suis ${user.first_name} ${
                          user.last_name
                        }\nj'utilise Action map depuis ${moment(
                          user.created_at
                        ).format(
                          "MMMM YYYY"
                        )}\nj'ai signalé ${nbre_incidents} incidents \nJ'ai créé ${nbre_challenges_created} challenges et participé dans ${nbre_challenges} challenges\nmon statut:   ${
                          user.user_type
                        } \nmon badge :  ${
                          badge.label
                        }\n${ShareUrl}/api/usermap/${user.id}/`
                      )
                    }
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      ...styles.modifier,
                    }}
                  >
                    <Icon size={20} name="share" color={"#38A3D0"} />
                    <Text
                      style={{
                        fontSize: 12,
                        color: "#38A3D0",
                        fontWeight: "bold",
                        marginLeft: 5,
                      }}
                    >
                      Partager mon statut
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.text}>
                <View
                  style={{
                    backgroundColor: "#38A3D0",
                    borderRadius: 15,
                    height: 95,
                    width: "97%",
                    paddingHorizontal: 20,
                    flexDirection: "row",
                    justifyContent: "space-around",
                    alignItems: "center",
                  }}
                >
                  <TouchableOpacity
                    onPress={() =>
                      this.props.navigation.navigate("ListIncidents", {
                        user_id: user.id,
                      })
                    }
                  >
                    <Text style={{ fontSize: 14, color: "#fff" }}>
                      Vous avez reporté
                    </Text>
                    <Text
                      style={{
                        fontSize: 35,
                        fontWeight: "bold",
                        color: "#56EC92",
                      }}
                    >
                      {nbre_incidents}
                    </Text>
                    <Text style={{ fontSize: 12, color: "#fff" }}>
                      Problèmes
                    </Text>
                  </TouchableOpacity>

                  <View>
                    <Text style={{ fontSize: 12, color: "#fff" }}>
                      Satut actuel :{" "}
                      <Text style={{ fontWeight: "bold" }}>
                        {user.user_type}
                      </Text>
                    </Text>
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <MaterialIcons
                        name="stars"
                        size={30}
                        color={badge.color}
                      />
                      <Text
                        style={{
                          fontSize: 12,
                          color: "#fff",
                          marginLeft: 5,
                          fontWeight: "bold",
                        }}
                      >
                        {badge.label}
                      </Text>
                    </View>
                    <Text style={{ fontSize: 12, color: "#fff" }}>
                      Mes points :{" "}
                      <Text style={{ fontWeight: "bold" }}>
                        {points} points
                      </Text>
                    </Text>
                  </View>
                </View>

                <View
                  style={{ flex: 1, justifyContent: "center", marginTop: 30 }}
                >
                  <Historique
                    user_id={user.id}
                    profile
                    navigation={this.props.navigation}
                  />

                  <View
                    style={{
                      marginVertical: 10,
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
                      Galerie
                    </Text>
                    <TouchableOpacity
                      onPress={() =>
                        this.props.navigation.push("Gallery", {
                          photos: this.state.photos,
                        })
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
                    data={this.state.photos.slice(0, 15)}
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(_, index) => String(index)}
                    horizontal={true}
                    ListEmptyComponent={
                      <View style={{ margin: 20 }}>
                        <Text>Galerie vide</Text>
                      </View>
                    }
                    renderItem={({ item }) => (
                      <TouchableWithoutFeedback
                        onPress={() =>
                          this.props.navigation.push("Image", {
                            source: getImage(item),
                          })
                        }
                      >
                        <ImageThumb source={getImage(item)} />
                      </TouchableWithoutFeedback>
                    )}
                  />
                </View>
              </View>
            </View>
          </ScrollView>
        )}
        {this.props.token === null && (
          <View
            style={{ alignItems: "center", justifyContent: "center", flex: 1 }}
          >
            <Text
              style={{
                color: "#2d9cdb",
                fontSize: 18,
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              Veuillez vous connecter pour voir votre profil
            </Text>
            <TouchableOpacity
              onPress={() => this.props.navigation.push("Login")}
              style={{
                marginTop: 20,
                height: 70,
                alignSelf: "center",
                borderColor: "#49DD7B",
                borderWidth: 1,
                justifyContent: "center",
                alignItems: "center",
                width: 70,
                borderRadius: 100,
              }}
            >
              <AntDesign name="login" color={"#49DD7B"} size={30} />
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingStart: 10,
    backgroundColor: "#fff",
    /*  backgroundColor: '#2d9cdb' */
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
  modifier: {
    marginTop: 10,
    borderRadius: 15,
    backgroundColor: "#fff",
    width: 150,
    height: 38,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 2.5,
    shadowColor: "#ccc",
    shadowOpacity: 0.5,
    shadowRadius: 1,
    elevation: 5,
    shadowOffset: {
      width: 3,
      height: 3,
    },
  },
});

const mapState = ({ user, incidents, challenges }) => ({
  token: user.token ? user.token : null,
  user: user.token ? user.user : {},
  incidents,
  challenges,
});
export default connect(mapState, { onGetChallenges })(Profil);
