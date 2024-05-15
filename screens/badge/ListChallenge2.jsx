import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import moment from "moment";
import { connect } from "react-redux";
import { getImage } from "../../utils/http/http";
import CardChallenge from "./CardChallenge";
import { list_challenge } from "../../utils/http/challenge";
import { onGetChallenges } from "../../redux/challenges/action";
import SafeAreaView from "react-native-safe-area-view";
import Share from "./Share";
import { MaterialIcons } from "@expo/vector-icons";

const width = Dimensions.get("window").width;
class ListIncident2 extends React.Component {
  state = {
    loading: false,
  };
  async componentDidMount() {
    if (this.props.challenges.length === 0) {
      this.setState({ loading: true });
      try {
        const res = await list_challenge();
        this.props.onGetChallenges(res);
      } catch (ex) {
        console.log("error challenges", ex);
      }
      this.setState({ loading: false });
    }
  }
  getIncidents = () => {
    const passe = this.props.route.params?.passe || true;
    return CardChallenge.getChallenges(this.props.challenges, passe);
  };
  render() {
    const { navigation } = this.props;
    const incidents = this.getIncidents();
    return (
      <View style={{ paddingBottom: 10, backgroundColor: "#fff", flex: 1 }}>
        <FlatList
          data={incidents}
          numColumns={2}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{
            // alignItems: "center",
            justifyContent: "center",
          }}
          ListEmptyComponent={
            <View
              style={{
                padding: 40,
                alignItems: "center",
                width,
                backgroundColor: "#fff",
                justifyContent: "center",
              }}
            >
              {!this.state.loading && (
                <Text style={{ fontSize: 16 }}>Aucun challenge trouvé</Text>
              )}
              {this.state.loading && (
                <ActivityIndicator color={"#666"} size={"large"} />
              )}
            </View>
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => navigation.navigate("DetailChallenge", { item })}
            >
              <View
                style={{
                  marginHorizontal: 5,
                  width: (width - 10) * 0.48,
                  marginTop: 20,
                  shadowColor: "#ccc",
                  backgroundColor: "#FFF",
                  height: 220,
                  borderRadius: 10,
                  borderWidth: 0,
                  elevation: 2,
                  borderColor: "#CCC",
                  shadowOpacity: 0.3,
                  shadowRadius: 0.2,
                  shadowOffset: {
                    width: 3,
                    height: 3,
                  },
                  borderWidth: 0.3,
                }}
              >
                <View style={{ zIndex: 1, height: 111 }}>
                  <Image
                    style={{
                      height: 111,
                      borderTopLeftRadius: 15,
                      borderTopRightRadius: 15,
                    }}
                    source={getImage(item.photo)}
                  ></Image>
                </View>
                <View>
                  <View
                    style={{
                      paddingHorizontal: 5,
                      width: "100%",
                      marginTop: 10,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        marginTop: 8,
                        paddingHorizontal: 5,
                        justifyContent: "space-between",
                      }}
                    >
                      <Text
                        numberOfLines={2}
                        style={{
                          color: "#4E4C4C",
                          fontSize: 10,
                          width: "65%",
                          fontWeight: "bold",
                        }}
                      >
                        {item.title}
                      </Text>
                      <Text
                        style={{
                          fontSize: 8,
                          width: "35%",
                          textAlign: "center",
                          fontWeight: "normal",
                          color: "#57A4FF",
                          alignSelf: "flex-start",
                          justifyContent: "flex-end",
                        }}
                      >
                        {moment(item.created_at).format("L")}
                      </Text>
                    </View>
                    <Text
                      style={{
                        color: "#4E4C4C",
                        fontSize: 10,
                        marginTop: 10,
                        paddingHorizontal: 8,
                        fontWeight: "bold",
                      }}
                    >
                      Par {item.user.first_name} {item.user.last_name}
                    </Text>
                  </View>
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
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
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
          )}
        />
      </View>
    );
  }
}

const mapState = ({ challenges }) => ({ challenges });

export default connect(mapState, { onGetChallenges })(ListIncident2);
