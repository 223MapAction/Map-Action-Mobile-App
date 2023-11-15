import React, { Component } from "react";
import { ActivityIndicator } from "react-native";
import { View, Text } from "react-native";
import { Image } from "react-native-elements";
import MapView from "react-native-maps";
import { Callout } from "react-native-maps";
import { getImage } from "../utils/http/http";
import { getLatLon, reverseGeocode } from "../utils/location";
import moment from "moment";
export default class Map extends Component {
  state = {
    location: {
      latitudeDelta: 10,
      longitudeDelta: 5,
    },
    region: {},
    loading: true,
  };
  async componentDidMount() {
    const region2 = {
      latitudeDelta: 10,
      longitudeDelta: 5,
    };
    try {
      const { zone } = this.props;
      if (zone) {
        const location = await reverseGeocode(zone);
        if (location) {
          this.setState({
            region: {
              ...region2,
              ...location,
            },
          });
        } else {
          const latLong = await getLatLon();
          this.setState({ region: { ...region2, ...latLong } });
        }
      } else {
        const latLong = await getLatLon();
        this.setState({ region: { ...region2, ...latLong } });
      }
    } catch (ex) {
      const { lattitude: latitude, longitude } =
        this.props.places.find((p) => p.lattitude && p.longitude) || {};

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
  ref = React.createRef();
  renderMarkers() {
    const { navigation } = this.props;
    return this.props.places.map((item, i) => (
      <View
        key={i}
        style={{
          width: 80,
          height: 140,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <MapView.Marker
          flat
          title={item.title}
          coordinate={{
            latitude: parseFloat(item.lattitude) || 0,
            longitude: parseFloat(item.longitude) || 0,
          }}
        >
          <Callout
            onPress={() => navigation.navigate("DetailIncident", { item })}
            style={{
              width: 120,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <View style={{ alignItems: "center" }}>
              <Image
                source={getImage(item.photo, true)}
                resizeMode={"contain"}
                style={{ width: 110, height: 80, zIndex: 100 }}
              />
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                {item.title}
              </Text>
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
              <Text
                style={{ fontSize: 8, textAlign: "center" }}
                numberOfLines={3}
              >
                {item.description}
              </Text>
              <Text
                style={{ fontSize: 8, textAlign: "center" }}
                numberOfLines={3}
              >
                {moment(item.created_at).format("L")}
              </Text>
            </View>
          </Callout>
        </MapView.Marker>
      </View>
    ));
  }

  render() {
    if (this.state.loading) {
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
        <MapView
          style={styles.container}
          region={this.state.region}
          showsMyLocationButton={true}
        >
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

export function SimpleMap({ style, location, title }) {
  location = {
    latitude: parseFloat(location.latitude),
    longitude: parseFloat(location.longitude),
  };
  const region = {
    latitudeDelta: 0.04,
    longitudeDelta: 0.05,
    latitude: location.latitude,
    longitude: location.longitude,
  };
  return (
    <MapView style={style} region={region} showsMyLocationButton={true}>
      <MapView.Marker title={title} coordinate={location} />
    </MapView>
  );
}
