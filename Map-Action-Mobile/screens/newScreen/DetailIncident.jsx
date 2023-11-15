import React, { Component } from "react";
import * as FileSystem from "expo-file-system";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
  Image,
  Platform,
  Animated,
} from "react-native";

import { connect } from "react-redux";
import { ActivityIndicator } from "react-native-paper";
import { MaterialIcons, AntDesign } from "@expo/vector-icons";
import HeaderLeft from "../../utils/HeaderLeft";
import { Audio } from "expo-av";
import { getImage } from "../../utils/http/http";
import { ApiUrl } from "../../utils/http/http";
import { ScrollView } from "react-native-gesture-handler";
import { getBadge } from "../../utils/location";
import Popup from "../../shared/Popup";
import IconBadge from "react-native-icon-badge";
import { Icon } from "react-native-elements";
import Share from "../badge/Share";
import MyVideoPlayer from "./MyVideoPlayer";
import AudioReader from "../../shared/AudioReader";
import moment from "moment";
class DetailIncident extends Component {
  state = {
    playStatus: null,
    modalShowed: false,
    askLoginModalShowed: false,
    audioProgress: new Animated.Value(0),
    video: null,
    loading: false,
  };

  async componentDidMount() {
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      playsInSilentModeIOS: false,
      shouldDuckAndroid: true,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
      playThroughEarpieceAndroid: false,
      staysActiveInBackground: false,
    });
  }
  renderAudio() {
    const item = this.props.route.params.item;
    return <AudioReader url={ApiUrl + item.audio} />;
  }
  renderAskLogin() {
    if (
      this.props.route.params?.add &&
      this.props.token === null &&
      !this.state.askLoginModalShowed
    ) {
      return (
        <Popup onHide={() => this.setState({ askLoginModalShowed: true })}>
          <TouchableOpacity
            style={{ alignSelf: "flex-end" }}
            onPress={() => this.setState({ askLoginModalShowed: true })}
          >
            <Icon type="MaterialIcons" name="close" color="black" size={20} />
          </TouchableOpacity>
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontWeight: "bold",
                marginBottom: 40,
                color: "#757474",
                textAlign: "center",
              }}
            >
              veuillez vous inscrire pour mieux suivre le traitement de
              l'incident
            </Text>
            <View style={{ marginTop: 10 }}>
              <TouchableOpacity
                onPress={() => {
                  this.setState({ askLoginModalShowed: true });
                  this.props.navigation.push("Inscription", {
                    flow: true,
                    params: { item: this.props.route.params.item, add: true },
                    nextRoute: "DetailIncident",
                  });
                }}
                style={{
                  backgroundColor: "#49DD7B",
                  marginTop: 10,
                  borderRadius: 15,
                  paddingHorizontal: 20,
                  alignItems: "center",
                  height: 50,
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 20,
                    lineHeight: 24,
                    color: "#fff",
                    marginRight: 10,
                    fontWeight: "bold",
                  }}
                >
                  S'inscrire
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Popup>
      );
    }
    return null;
  }

  renderShowBadge() {
    const { incidents: incs } = this.props;
    const user = this.props.route.params.item.user;
    const incidents = incs.filter((i) => i.user_id === user.id);
    const badge = getBadge(incidents.length);
    const badge2 = getBadge(incidents.length - 1);
    if (badge2.label === badge.label) return null;

    return (
      <Popup onHide={() => this.setState({ modalShowed: true })}>
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            marginRight: 20,
            paddingTop: 20,
          }}
        >
          <TouchableOpacity
            style={{ alignSelf: "flex-end" }}
            onPress={() => this.setState({ modalShowed: true })}
          >
            <Icon type="MaterialIcons" name="close" color="black" size={20} />
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 14,
              paddingHorizontal: 30,
              fontWeight: "600",
              marginVertical: 20,
              color: "#757474",
              textAlign: "center",
            }}
          >
            Félicitation ! vous avez gagné un nouveau badge
          </Text>
          <IconBadge
            MainElement={
              <View style={{ justifyContent: "center", marginStart: 20 }}>
                <Image
                  resizeMode="cover"
                  style={{ width: 90, height: 90, borderRadius: 70 }}
                  source={getImage(user.avatar, "d")}
                />
              </View>
            }
            BadgeElement={
              <MaterialIcons name="stars" size={30} color={badge.color} />
            }
            IconBadgeStyle={{
              width: 30,
              height: 30,
              backgroundColor: "#fff",
            }}
          />
          <View style={{ marginStart: 20 }}>
            <Text
              style={{
                fontSize: 20,
                fontWeight: "600",
                color: "#757474",
                alignSelf: "center",
                justifyContent: "center",
              }}
            >
              {user.first_name} {user.last_name}
            </Text>
            <Text
              style={{
                fontSize: 10,
                fontWeight: "300",
                color: "#858585",
                alignSelf: "center",
              }}
            >
              {badge.label}
            </Text>
          </View>
        </View>
      </Popup>
    );
  }

  render() {
    const item = this.props.route.params.item;
    const add = this.props.route.params.add;
    return (
      <View style={{ flex: 1 }}>
        <ScrollView style={styles.container}>
          {add &&
            this.props.token !== null &&
            !this.state.modalShowed &&
            this.renderShowBadge()}
          {this.renderAskLogin()}
          <ImageBackground
            source={getImage(item.photo, true)}
            style={{
              justifyContent: "space-around",
              height: Dimensions.get("window").height * 0.45,
              paddingTop: Platform.OS === "ios" ? 15 : 10,
              backgroundColor: "#ccc",
            }}
          >
            {this.state.loading && (
              <View
                style={{
                  zIndex: 10,
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "rgba(255,255,255,.5)",
                }}
              >
                <ActivityIndicator color={"#083451"} size={"small"} />
              </View>
            )}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <View>
                <HeaderLeft colors="#FFF" />
              </View>
              <Share
                style={{ marginRight: 10 }}
                color="#FFF"
                title={item.zone + " - " + item.title}
                id={item.id}
                incident
                small={false}
                content={item.description}
              />
            </View>

            <View
              style={{
                marginHorizontal: 10,
                flexDirection: "row",
                alignItems: "flex-end",
                justifyContent: "space-around",
                flex: 1,
                paddingBottom: 20,
              }}
            >
              <View
                style={{ flexDirection: "row", flex: 1, alignItems: "center" }}
              >
                <MaterialIcons name="location-on" color={"#fff"} size={20} />
                <View>
                  <Text
                    style={{
                      fontWeight: "bold",
                      color: "#fff",
                      marginStart: 6,
                    }}
                  >
                    {item.zone}
                  </Text>
                  <Text style={{ color: "#fff", marginStart: 6, fontSize: 12 }}>
                    {moment(item.created_at).format("L")}
                  </Text>
                </View>
              </View>
              <View>
                <Text
                  style={{
                    fontSize: 14,
                    textAlign: "center",
                    fontWeight: "bold",
                    color: "#fff",
                  }}
                >
                  {item.title}
                </Text>
              </View>
            </View>
          </ImageBackground>

          <View
            style={{
              backgroundColor: "#fff",
              borderBottomLeftRadius: 15,
              shadowColor: "#ccc",
              borderBottomEndRadius: 15,
              paddingBottom: 50,
              paddingHorizontal: 10,
              elevation: 5,
              shadowOpacity: 0.3,
              shadowRadius: 0.2,
              shadowOffset: {
                width: 3,
                height: 3,
              },
            }}
          >
            <View style={{ marginVertical: 15, paddingHorizontal: 15 }}>
              <Text>{item.description}</Text>
            </View>
            {item.audio && this.renderAudio()}
            {item.video !== null && (
              <MyVideoPlayer item_id={item.id} video={item.video} />
            )}
          </View>
          <View style={{ marginVertical: 40 }}>
            <TouchableOpacity
              onPress={() => this.props.navigation.push("Picture")}
              style={{
                flexDirection: "row",
                backgroundColor: "#49DD7B",
                marginVertical: 20,
                borderRadius: 100,
                alignItems: "center",
                height: 50,
                justifyContent: "center",
                marginHorizontal: 20,
              }}
            >
              <Text
                style={{
                  fontSize: 20,
                  lineHeight: 24,
                  color: "#fff",
                  marginRight: 10,
                  fontWeight: "bold",
                }}
              >
                Reporter un problème
              </Text>
              <AntDesign name="arrowright" color={"#fff"} size={30} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.props.navigation.push("DrawerNavigation")}
              style={{
                height: 70,
                alignSelf: "center",
                borderColor: "#49DD7B",
                borderWidth: 1,
                justifyContent: "center",
                alignItems: "center",
                width: 70,
                borderRadius: 100,
              }}
            >
              <AntDesign name="home" color={"#49DD7B"} size={30} />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingBottom: 20,
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
    marginTop: 14,
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    shadowColor: "#ccc",
    shadowOpacity: 0.5,
    shadowRadius: 1,
    elevation: 2,
    shadowOffset: {
      width: 3,
      height: 3,
    },
  },
  searchIcon: {
    padding: 10,
  },
  itemStyle: {
    marginBottom: 10,
    flex: 1,
  },
});
const mapState = ({ incidents, user }) => ({
  incidents,
  token: user?.token || null,
});

export default connect(mapState, null)(DetailIncident);
