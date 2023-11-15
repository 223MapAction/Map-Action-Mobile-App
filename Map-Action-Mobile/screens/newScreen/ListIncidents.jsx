import React, { Component } from "react";
import { View, Text, StyleSheet, Image, FlatList } from "react-native";
import { getImage } from "../../utils/http/http";
import { connect } from "react-redux";
import { MaterialIcons } from "@expo/vector-icons";
import moment from "moment";
import { TouchableOpacity } from "react-native-gesture-handler";
import Map from "../../shared/Map";
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";
import SafeAreaView from "react-native-safe-area-view";

const deltas = {
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

class ListIncidents extends Component {
  state = {
    region: null,
    coffeeShops: [],
  };

  componentDidMount() {
    const title = this.props.route?.params?.title;
    if (title) {
      this.props.navigation.setOptions({ title });
    }
  }
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

  UNSAFE_componentWillMount() {
    this.getLocationAsync();
  }

  getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== "granted") {
      this.setState({
        errorMessage: "La permission d'accéder à l'emplacement a été refusée",
      });
      return;
    }
    let location = await Location.getCurrentPositionAsync({});
    const region = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      ...deltas,
    };
    await this.setState({ region });
  };

  render() {
    const incidents = this.getIncidents();
    const item = this.props.route?.params?.item;
    const { region } = this.state;
    return (
      <View style={styles.container}>
        <Map
          region={region}
          places={incidents}
          zone={item?.zone}
          navigation={this.props.navigation}
        />
      </View>
    );
  }
  renderVide() {
    <View
      tyle={{
        ...styles.container,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={{ color: "#2d9cdb", fontSize: 16 }}>Aucun resultat</Text>
    </View>;
  }
  renderListe() {
    const incidents = this.getIncidents();

    return (
      <View style={styles.container}>
        <FlatList
          data={incidents}
          ListEmptyComponent={
            <View
              style={{
                ...styles.container,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ color: "#2d9cdb", fontSize: 16 }}>
                Aucun resultat
              </Text>
            </View>
          }
          renderItem={({ item, index }) => (
            <TouchableOpacity
              onPress={() =>
                this.props.navigation.navigate("DetailIncident", { item })
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
                        style={{
                          fontSize: 18,
                          fontWeight: "bold",
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
                            fontSize: 16,
                            color: "#817979",
                            marginLeft: 10,
                          }}
                        >
                          {item.zone}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
                <View style={{ paddingVertical: 8 }}>
                  <Text style={{ color: "#2D9CDB" }}>
                    {moment(item.created_at).format("L")}
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
const mapState = ({ incidents }) => ({ incidents });
export default connect(mapState, null)(ListIncidents);
