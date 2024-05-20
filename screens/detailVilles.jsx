import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  FlatList,
  ImageBackground,
} from "react-native";

import HeaderVilles from "../utils/HeaderVilles";
import { getPays, ensure } from "../utils/location";
import Municipal from "../utils/municipal";
import Constants from "../utils/constants";
import { getImage } from "../utils/http/http";
class DetailVilles extends Component {
  constructor(props) {
    super(props);
    this.state = {
      item: props.route.params.item,
    };
  }
  async componentDidMount() {
    const item = this.state.item;
    if (!item.pays) {
      const status = await ensure();
      if (status) {
        const pays = await getPays(item.ville);
        this.setState({ item: { ...item, pays } });
      }
    }
  }
  getNumberIncidentsResolved() {
    return this.state.item.zones.reduce((acc, cur) => {
      return (
        cur.incidents.filter(
          (i) => i.etat === Constants.incidents.state.resolved
        ).length + acc
      );
    }, 0);
  }

  render() {
    const item = this.state.item;

    return (
      <View style={styles.container}>
        <HeaderVilles pays={item.pays} ville={item.ville} />
        <ScrollView>
          <View style={styles.text}>
            <TouchableOpacity
              onPress={() =>
                this.props.navigation.navigate("ListIncidents", {
                  item: {
                    zone: item.ville,
                    incidents: item.zones.reduce(
                      (acc, cur) => [...cur.incidents, ...acc],
                      []
                    ),
                  },
                })
              }
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
                  {this.state.item.zones.reduce((acc, cur) => {
                    return cur.incidents.length + acc;
                  }, 0)}
                </Text>
                <Text
                  style={{
                    fontSize: 16,
                    color: "#fff",
                    marginLeft: 20,
                    lineHeight: 30,
                  }}
                >
                  {this.getNumberIncidentsResolved()}
                </Text>
                <Text style={{ fontSize: 16, color: "#fff", lineHeight: 30 }}>
                  {" "}
                  résolus
                </Text>
              </View>
            </TouchableOpacity>

            <View style={{ flex: 1, marginTop: 30 }}>
              <Municipal navigation={this.props.navigation} item={item} />
            </View>
          </View>
          {/* <View style={{ marginTop: 20 }}>
            <Ong navigation={this.props.navigation} />
          </View> */}
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
  text: {
    marginHorizontal: 10,
    justifyContent: "center",
    flex: 1,
    marginTop: 50,
  },
  flatGrid: {
    width: 112,
    height: 50,
    borderRadius: 30,
    shadowOpacity: 0.5,
    shadowRadius: 0.3,
    shadowOffset: {
      width: 3,
      height: 3,
    },
    shadowColor: "#ccc",
    elevation: 5,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
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

export default DetailVilles;
