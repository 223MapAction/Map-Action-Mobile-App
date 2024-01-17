import React, { Component } from "react";
import { ActivityIndicator, View, Text } from "react-native";
import { Image } from "react-native-elements";
import MapView, { Marker, Callout } from "react-native-maps";
import { getImage } from "../utils/http/http";
import { getLatLon, reverseGeocode } from "../utils/location";
import moment from "moment";

export default class Map extends Component {
  state = {
    region: {},
    loading: true,
  };

  async componentDidMount() {
    const { zone, places } = this.props;
    const region2 = { latitudeDelta: 10, longitudeDelta: 5 };

    try {
      const location = zone ? await reverseGeocode(zone) : null;
      const updatedRegion = location || (await getLatLon());

      this.setState({
        region: { ...region2, ...updatedRegion },
      });
    } catch (ex) {
      const { latitude, longitude } =
        places.find((p) => p.latitude && p.longitude) || {};

      this.setState({
        region: {
          ...region2,
          latitude: parseFloat(latitude) || 0,
          longitude: parseFloat(longitude) || 0,
        },
      });
    }

    this.setState({ loading: false });
  }

  renderMarkers() {
    const { navigation, places } = this.props;

    return places.map((item, i) => (
      <View key={i} style={{ width: 80, height: 140, position: "relative", overflow: "hidden" }}>
        <Marker
          flat
          title={item.title}
          coordinate={{
            latitude: parseFloat(item.latitude) || 0,
            longitude: parseFloat(item.longitude) || 0,
          }}
        >
          <Callout
            onPress={() => navigation.navigate("DetailIncident", { item })}
            style={{ width: 120, alignItems: "center", justifyContent: "center" }}
          >
            <View style={{ alignItems: "center" }}>
              <Image
                source={getImage(item.photo, true)}
                resizeMode={"contain"}
                style={{ width: 110, height: 80, zIndex: 100 }}
              />
              <Text style={{ fontSize: 16, fontWeight: "bold", textAlign: "center" }}>{item.title}</Text>
              {item.category_id && (
                <Text
                  style={{
                    fontSize: 10,
                    fontWeight: "bold",
                    color: "#2D9CDB",
                    textAlign: "center",
                  }}
                >
                  {item.category_id.name}
                </Text>
              )}
              <Text style={{ fontSize: 8, textAlign: "center" }} numberOfLines={3}>
                {item.description}
              </Text>
              <Text style={{ fontSize: 8, textAlign: "center" }} numberOfLines={3}>
                {moment(item.created_at).format("L")}
              </Text>
            </View>
          </Callout>
        </Marker>
      </View>
    ));
  }

  render() {
    const { loading, region } = this.state;

    if (loading) {
      return (
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#FFF",
          }}
        >
          <ActivityIndicator color="#000" size="large" />
        </View>
      );
    }

    return (
      <View style={{ flex: 1 }}>
        <MapView style={styles.container} region={region} showsMyLocationButton={true}>
          {this.renderMarkers()}
        </MapView>
      </View>
    );
  }
}

const styles = {
  container: {
    flex: 1,
  },
};
