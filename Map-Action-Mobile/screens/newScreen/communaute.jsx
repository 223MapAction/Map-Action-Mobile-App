import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Alert,
} from "react-native";
import icon from "../../assets/image.jpg";
import { getImage } from "../../utils/http/http";
import { list_incident } from "../../utils/http/incident";
import { connect } from "react-redux";
import _ from "lodash";
class Communaute extends Component {
  state = {
    users: [],
    incidents: [],
  };

  async componentDidMount() {
    await this.getUser();
  }

  getUser = async () => {
    let users = [];
    const incidents = this.props.incidents;
    incidents.map((i) => {
      if (
        users.findIndex((user) => user.id === i.user_id && i.user_id) === -1
      ) {
        users.push(i.user);
      }
    });
    users = users.map((user) => {
      const obj = { ...user };
      obj.incidents = incidents.filter((i) => i.user_id === user.id);
      obj.nbIncidents = obj.incidents.length;
      return obj;
    });
    this.setState({ users: users.filter((u) => u.incidents.length > 0) });
  };

  render() {
    const users = _(this.state.users)
      .orderBy(["nbIncidents"], ["desc"])
      .value();

    return (
      <View style={styles.container}>
        <FlatList
          data={users}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              onPress={() =>
                this.props.navigation.navigate("ListIncidents", {
                  user_id: item.id,
                  title: `${item.first_name} ${item.last_name}`,
                })
              }
              style={{
                flexDirection: "row",
                alignItems: "center",
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
                  alignItems: "center",
                }}
              >
                <Image
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 50,
                    alignSelf: "center",
                  }}
                  source={getImage(item.avatar, "d")}
                />
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "flex-end",
                    justifyContent: "space-between",
                    marginStart: 15,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      color: "rgba(0, 0, 0, 0.87)",
                      maxWidth: 110,
                      marginRight: 3,
                    }}
                    numberOfLines={1}
                  >
                    {item.first_name || "Visiteur"}
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      color: "rgba(0, 0, 0, 0.87))",
                      lineHeight: 20,
                      width: 100,
                    }}
                    numberOfLines={1}
                  >
                    {" "}
                    {item.last_name}
                  </Text>
                </View>
              </View>
              <View>
                <Text style={{ fontSize: 14, color: "#57A4FF" }}>
                  {item.incidents.length}
                </Text>
                <Text style={{ fontSize: 8, color: "rgba(0, 0, 0, 0.39)" }}>
                  problèmes
                </Text>
                <Text style={{ fontSize: 8, color: "rgba(0, 0, 0, 0.39)" }}>
                  reportés
                </Text>
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
const mapState = ({ incidents }) => ({ incidents });
export default connect(mapState, null)(Communaute);
