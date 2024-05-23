import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
} from "react-native";
import moment from "moment";
import { connect } from "react-redux";
import { getImage } from "../../utils/http/http";
import { ActivityIndicator } from "react-native-paper";
class CardChallenge extends React.Component {
  state = {
    loading: false,
  };

  render() {
    const { navigation, incidents, aproxy = false } = this.props;
    return (
      <View>
        <View
          style={{
            marginTop: 10,
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
            {aproxy ? "Problèmes  à proximité" : "Tous les problèmes"}
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("ListIncidents", { incidents })}
          >
            <Text style={{ fontSize: 14, color: "#38A3D0", fontWeight: "500" }}>
              Voir tout
            </Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={incidents}
          horizontal={true}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          ListEmptyComponent={
            <View
              style={{
                margin: 40,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {this.state.loading && (
                <ActivityIndicator color="#49DD7B" size="large" />
              )}
              {!this.state.loading && (
                <Text style={{ fontSize: 16 }}>Aucun problème trouvé</Text>
              )}
            </View>
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => navigation.navigate("DetailIncident", { item })}
            >
              <View
                style={{
                  marginRight: 5,
                  marginTop: 20,
                  shadowColor: "#fff",
                  width: 170,
                  height: 190,
                  borderRadius: 10,
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

const mapState = ({}) => ({});

export default connect(mapState, null)(CardChallenge);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingStart: 10,
    backgroundColor: "#fff",
    /*  backgroundColor: '#2d9cdb' */
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
    backgroundColor: "#FFF",
    borderBottomLeftRadius: 15,
    borderBottomEndRadius: 15,
    height: 70,
    padding: 10,
  },
  calendrier: {
    backgroundColor: "#fff",
    borderRadius: 15,
    width: 89,
    height: 95,
    shadowColor: "#ccc",

    shadowOpacity: 0.5,
    elevation: 5,
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
    elevation: 5,
    shadowRadius: 1,
    shadowOffset: {
      width: 3,
      height: 3,
    },
  },
});
