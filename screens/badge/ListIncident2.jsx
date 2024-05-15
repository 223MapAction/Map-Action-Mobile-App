import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import moment from "moment";
import { connect } from "react-redux";
import { getImage } from "../../utils/http/http";
const width = Dimensions.get("window").width;
class ListIncident2 extends React.Component {
  getIncidents = () => {
    const item = this.props.route?.params?.item;
    if (item) {
      this.props.navigation.setOptions({ title: item.month || item.zone });
      return item.incidents;
    }
    const incidents = this.props.incidents;
    const user_id = this.props.route?.params?.user_id || null;
    if (null === user_id) return incidents;
    return incidents.filter((i) => i.user_id === user_id);
  };
  render() {
    const { navigation } = this.props;
    const incidents = this.getIncidents();
    return (
      <View style={{ marginVertical: 10 }}>
        <FlatList
          data={incidents}
          numColumns={2}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{
            alignItems: "center",
            justifyContent: "center",
          }}
          ListEmptyComponent={
            <View
              style={{
                margin: 40,
                alignItems: "center",
                width,
                justifyContent: "center",
              }}
            >
              <Text style={{ fontSize: 16 }}>Aucun problème trouvé</Text>
            </View>
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => navigation.navigate("DetailIncident", { item })}
            >
              <View
                style={{
                  marginHorizontal: 5,
                  width: (width - 10) * 0.48,
                  marginTop: 20,
                  shadowColor: "#fff",
                  height: 190,
                  borderRadius: 10,
                  borderWidth: 0,
                  overflow: "hidden",
                  elevation: 0.3,
                  shadowOpacity: 0.3,
                  shadowOffset: {
                    width: 0,
                    height: 1,
                  },
                }}
              >
                <View style={{ zIndex: 1, height: 111 }}>
                  <Image
                    style={{
                      width: 170,
                      height: 120,
                    }}
                    imageStyle={{ width: 210, height: 111 }}
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
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    );
  }
}

const mapState = ({ incidents }) => ({ incidents });

export default connect(mapState, null)(ListIncident2);
