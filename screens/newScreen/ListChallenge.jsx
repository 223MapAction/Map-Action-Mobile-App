import React, { Component } from "react";
import { View, Text, StyleSheet, Image, FlatList } from "react-native";
import { getImage } from "../../utils/http/http";
import { connect } from "react-redux";
import { MaterialIcons } from "@expo/vector-icons";
import moment from "moment";
import { TouchableOpacity } from "react-native-gesture-handler";
import { list_challenge } from "../../utils/http/challenge";
import { onGetChallenges } from "../../redux/challenges/action";
import { ActivityIndicator } from "react-native";
import SafeAreaView from "react-native-safe-area-view";

class ListChallenge extends Component {
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
  getChallenges = () => {
    const challenges = this.props.challenges;
    const user_id = this.props.route?.params?.user_id || null;
    if (null === user_id) return challenges;
    return challenges.filter((i) => i.user_id === user_id);
  };

  render() {
    const challenges = this.getChallenges();

    return (
      <View style={styles.container}>
        <FlatList
          data={challenges}
          ListEmptyComponent={
            <View style={{ margin: 15 }}>
              {!this.state.loading && <Text>Aucun resultat</Text>}
              {this.state.loading && (
                <ActivityIndicator size="large" color="#49DD7B" />
              )}
            </View>
          }
          renderItem={({ item, index }) => (
            <TouchableOpacity
              onPress={() =>
                this.props.navigation.navigate("DetailChallenge", { item })
              }
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  borderColor: "#ccc",
                  borderBottomWidth: 1,
                  paddingVertical: 14,
                  paddingHorizontal: 10,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <Image
                    resizeMode="cover"
                    style={{
                      width: 90,
                      height: 85,
                      alignSelf: "center",
                    }}
                    source={getImage(item.photo)}
                  />
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginLeft: 10,
                    }}
                  >
                    <View
                      style={{
                        height: 85,
                        justifyContent: "space-between",
                        paddingVertical: 5,
                      }}
                    >
                      <Text
                        numberOfLines={2}
                        style={{
                          fontSize: 14,
                          fontWeight: "bold",
                          width: 150,
                          color: "#817979",
                        }}
                      >
                        {item.title}
                      </Text>
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        <MaterialIcons
                          name="place"
                          color={"#2D9CDB"}
                          size={20}
                        />
                        <Text
                          style={{
                            fontSize: 14,
                            color: "#817979",
                            marginLeft: 10,
                          }}
                        >
                          {item.lieu}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
                <View style={{ paddingVertical: 8, width: "20%" }}>
                  <Text style={{ color: "#817979", fontSize: 12 }}>
                    {moment(item.date).format("L")}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
const mapState = ({ challenges }) => ({ challenges });
export default connect(mapState, { onGetChallenges })(ListChallenge);
