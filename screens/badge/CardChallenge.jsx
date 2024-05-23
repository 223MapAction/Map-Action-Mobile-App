import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  Dimensions,
  TouchableOpacity,
  TouchableHighlight,
} from "react-native";
import moment from "moment";
import { MaterialIcons } from "@expo/vector-icons";
import { list_challenge } from "../../utils/http/challenge";
import { connect } from "react-redux";
import { onGetChallenges } from "../../redux/challenges/action";
import { getImage } from "../../utils/http/http";
import { ActivityIndicator } from "react-native";
import Share from "./Share";
import { Icon } from "react-native-elements";
class CardChallenge extends React.Component {
  state = {
    loading: false,
    showAll: false,
  };
  async componentDidMount() {
    if (this.props.challenges.length === 0) {
      this.setState({ loading: true });
      try {
        const res = await list_challenge();
        this.props.onGetChallenges(res);
      } catch (ex) {}
      this.setState({ loading: false });
    }
  }
  static getChallenges(list, passe = false) {
    const toDay = moment().subtract(1, "d").toDate().getTime();
    return list.filter((l) => {
      return passe ? l.dateOrder < toDay : l.dateOrder > toDay;
    });
  }

  render() {
    const { navigation, challenges: data } = this.props;
    const challenges = CardChallenge.getChallenges(data);
    const ids = challenges.map((c) => c.id);
    const rest = data.filter((f) => !ids.includes(f.id));
    return (
      <View
        style={{
          paddingBottom: 20,
        }}
      >
        <View
          style={{
            paddingTop: 20,
            flexDirection: "row",
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
            Challenges à proximité
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("ListChallenge2")}
          >
            <Text style={{ fontSize: 14, color: "#38A3D0", fontWeight: "500" }}>
              Voir tout
            </Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={this.state.showAll ? [...challenges, ...rest] : challenges}
          keyExtractor={(item) => item.id.toString()}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          ListEmptyComponent={
            <View
              style={{
                alignItems: "center",
                paddingVertical: 20,
                width: Dimensions.get("window").width,
                justifyContent: "center",
              }}
            >
              {this.state.loading && (
                <ActivityIndicator color="#49DD7B" size="large" />
              )}
              {!this.state.loading && (
                <View
                  style={{
                    marginRight: 20,
                    marginTop: 30,
                    width: 210,
                    height: 220,
                    alignItems: "center",
                    borderRadius: 20,
                    justifyContent: "center",
                    zIndex: 20,
                    shadowColor: "#ccc",
                    backgroundColor: "#fff",
                    paddingVertical: 10,
                    elevation: 5,
                    shadowOpacity: 0.3,
                    shadowRadius: 0.7,
                    shadowOffset: {
                      width: 0,
                      height: 2,
                    },
                  }}
                >
                  <TouchableOpacity
                    onPress={() =>
                      // this.props.navigation.navigate("ListChallenge2", {
                      //   passe: true,
                      // })
                      this.setState({ showAll: true })
                    }
                  >
                    <Icon
                      name="library-books"
                      size={60}
                      color={"rgba(0,0,0,.4)"}
                      type="MaterialIcons"
                    />
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "bold",
                        color: "rgba(0,0,0,.4)",
                        marginTop: 30,
                      }}
                    >
                      événements passés
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          }
          renderItem={({ item, index }) => (
            <View style={{ flexDirection: "row" }}>
              <View
                style={{
                  marginRight: 20,
                  marginTop: 20,
                  zIndex: 20,
                  shadowColor: "#ccc",
                  paddingVertical: 10,
                  elevation: 5,
                  shadowOpacity: 0.5,
                  shadowRadius: 1,
                  shadowOffset: {
                    width: 3,
                    height: 3,
                  },
                }}
              >
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() =>
                    this.props.navigation.navigate("DetailChallenge", { item })
                  }
                >
                  <View style={{ zIndex: 1, height: 111 }}>
                    <Image
                      style={{
                        width: 210,
                        height: 111,
                        borderTopLeftRadius: 15,
                        backgroundColor: "#CCC",
                        borderTopRightRadius: 15,
                      }}
                      imageStyle={{ width: 210, height: 111 }}
                      source={getImage(item.photo)}
                    ></Image>
                  </View>
                  <View
                    style={{
                      backgroundColor: "#fff",
                      width: 210,
                      paddingBottom: 10,
                      borderBottomLeftRadius: 15,
                      borderBottomEndRadius: 15,
                      elevation: 5,
                      zIndex: 3,
                    }}
                  >
                    <Image
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 50,
                        alignSelf: "center",
                        marginTop: -20,
                      }}
                      source={getImage(item.user.avatar, "a")}
                    />
                    <View style={{ paddingHorizontal: 5, width: "100%" }}>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        <Text
                          numberOfLines={1}
                          style={{
                            color: "#4E4C4C",
                            fontSize: 12,
                            width: "65%",
                          }}
                        >
                          {item.title}
                        </Text>
                        <Text
                          style={{
                            fontSize: 10,
                            width: "35%",
                            textAlign: "center",
                            fontWeight: "normal",
                            color: "#57A4FF",
                            alignSelf: "flex-start",
                            justifyContent: "flex-end",
                          }}
                        >
                          {moment(item.date || "10/09/2020").format("L")}
                        </Text>
                      </View>
                      <Text
                        numberOfLines={1}
                        style={{
                          color: "#4E4C4C",
                          fontSize: 10,
                          marginTop: 10,
                        }}
                      >
                        {item.user.first_name} {item.user.last_name}
                      </Text>
                    </View>

                    <View
                      style={{
                        flexDirection: "row",
                        marginTop: 10,
                        paddingHorizontal: 5,
                        backgroundColor: "#fff",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        <MaterialIcons
                          name="people-outline"
                          size={19}
                          color={"rgba(102, 102, 102, 0.5)"}
                        />
                        <Text
                          style={{
                            color: "rgba(0, 0, 0, 0.56)",
                            fontSize: 14,
                            marginStart: 10,
                          }}
                        >
                          {item.participates.length} Participant
                          {item.participates.length > 1 ? "s" : ""}
                        </Text>
                      </View>
                      <Share
                        style={{ zIndex: 10000 }}
                        color="rgba(102, 102, 102, 0.5)"
                        challenge
                        id={item.id}
                        title={item.title}
                        content={item.description}
                      />
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
              {index === challenges.length - 1 && !this.state.showAll && (
                <View
                  style={{
                    marginRight: 20,
                    marginTop: 30,
                    width: 210,
                    height: 220,
                    alignItems: "center",
                    borderRadius: 20,
                    justifyContent: "center",
                    zIndex: 20,
                    shadowColor: "#ccc",
                    backgroundColor: "#fff",
                    paddingVertical: 10,
                    elevation: 5,
                    shadowOpacity: 0.3,
                    shadowRadius: 0.7,
                    shadowOffset: {
                      width: 0,
                      height: 2,
                    },
                  }}
                >
                  <TouchableOpacity
                    onPress={() =>
                      // this.props.navigation.navigate("ListChallenge2", {
                      //   passe: true,
                      // })
                      this.setState({ showAll: true })
                    }
                  >
                    <Icon
                      name="library-books"
                      size={60}
                      color={"rgba(0,0,0,.4)"}
                      type="MaterialIcons"
                    />
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "bold",
                        color: "rgba(0,0,0,.4)",
                        marginTop: 30,
                      }}
                    >
                      événements passés
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}
        />
      </View>
    );
  }
}

const mapState = ({ challenges }) => ({ challenges });

export default connect(mapState, { onGetChallenges })(CardChallenge);
