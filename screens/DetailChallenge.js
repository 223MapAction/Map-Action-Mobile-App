import React, { Component } from "react";
import {
  View,
  ScrollView,
  Text,
  Image,
  Alert,
  TouchableOpacity,
} from "react-native";

import { MaterialIcons, AntDesign } from "@expo/vector-icons";
import { DoneButton } from "./newScreen/Contact";
import { getImage } from "../utils/http/http";
import moment from "moment";
import { participate, un_participate } from "../utils/http/challenge";
import { connect } from "react-redux";
import { onEditChallenge } from "../redux/challenges/action";
import Share from "./badge/Share";
import { getBadge, has_access } from "../utils/location";
import Constants from "../utils/constants";
import MyVideoPlayer from "./newScreen/MyVideoPlayer";
import { SimpleMap } from "../shared/Map";
import { DIMENSIONS } from "../constants/constants";
class DetailChallenge extends Component {
  constructor(props) {
    super(props);
    props.navigation.setOptions({ title: this.getItem().title });
    this.state = {
      item: this.getItem(),
      loading: false,
    };
  }
  partcipe = async () => {
    if (this.state.loading) return null;
    this.setState({ loading: true });
    const item = this.state.item;
    const evenement_id = item.id;
    const user_id = this.props.user.id;
    if (user_id) {
      try {
        const res = await participate(user_id, evenement_id);
        const event = { ...item, participates: [...item.participates, res] };
        this.setState({ item: event });
        this.props.onEditChallenge(event);
      } catch (ex) {
        console.log(ex);
      }
    }
    this.setState({ loading: false });
  };
  isPassed() {
    const item = this.getItem();
    const toDay = moment().subtract(1, "d").toDate().getTime();
    return toDay > moment(item.date).toDate().getTime();
  }
  unParticipate() {
    const item = this.state.item;
    const deleteParticipate = async () => {
      try {
        this.setState({ loading: true });
        const part = item.participates.find(
          (p) => p.user_id === this.props.user.id
        );
        await un_participate(part.id);
        item.participates = item.participates.filter((p) => p.id !== part.id);
        this.props.onEditChallenge(item);
        this.setState({
          loading: false,
          item,
        });
      } catch (ex) {
        this.setState({ loading: false });
        alert(ex);
      }
    };
    Alert.alert("", "Voulez-vous vraiment annuler votre participation", [
      {
        text: "Oui",
        onPress: () => deleteParticipate(),
      },
      {
        text: "Non",
        style: "cancel",
      },
    ]);
  }
  getItem() {
    return this.props.route?.params?.item || {};
  }
  render() {
    const item = this.state.item;
    const allredy =
      item.participates.findIndex((p) => p.user_id === this.props.user.id) !==
      -1;
    const incidents = this.props.incidents.filter(
      (i) => i.user_id === this.props.user.id
    );
    const badge = getBadge(incidents.length);
    const hasAccess = has_access(
      badge,
      Constants.permissions.participate_challenge
    );

    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        style={{ paddingHorizontal: 10, backgroundColor: "#fff" }}
      >
        <View>
          <Image
            style={{
              width: "100%",
              height: 200,
              marginTop: 20,
              borderTopLeftRadius: 15,
              borderTopRightRadius: 15,
            }}
            source={getImage(item.photo)}
          />
        </View>
        <View
          style={{
            backgroundColor: "#fff",
            borderBottomLeftRadius: 0,
            shadowColor: "#ccc",
            borderBottomRightRadius: 0,
            paddingBottom: 10,
            paddingHorizontal: 0,
            elevation: 5,
            shadowOpacity: 0.3,
            shadowRadius: 0.2,
            shadowOffset: {
              width: 3,
              height: 3,
            },
          }}
        >
          <Image
            style={{
              width: 60,
              height: 60,
              borderRadius: 60,
              alignSelf: "center",
              marginTop: -30,
            }}
            source={getImage(item.user.avatar, "d")}
          />
          <View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text style={{ color: "#4E4C4C", fontSize: 18, width: "65%" }}>
                {item.title}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  textAlign: "center",
                  color: "#2D9CDB",
                  justifyContent: "flex-end",
                }}
              >
                {moment(item.date || "0000 00 00").format("L")}
              </Text>
            </View>
            <Text style={{ color: "#4E4C4C", fontSize: 12, marginTop: 10 }}>
              {item.user.first_name} {item.user.last_name}
            </Text>
            <View
              style={{
                flexDirection: "row",
                marginTop: 10,
                justifyContent: "flex-start",
                alignItems: "center",
              }}
            >
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
                  opacity: 0.5,
                }}
              >
                {item.participates.length} Participant
                {item.participates.length > 1 ? "s" : ""}
              </Text>
              <View style={{ marginLeft: "auto" }}>
                <Share
                  color="rgba(102, 102, 102, 0.5)"
                  title={item.title}
                  challenge
                  id={item.id}
                  small={false}
                  url={item.photo}
                  content={item.description}
                />
              </View>
            </View>
          </View>
          <View style={{ paddingVertical: 30 }}>
            <Text
              style={{
                color: "rgba(0, 0, 0, 0.56)",
                fontSize: 16,
                fontWeight: "bold",
                marginVertical: 5,
              }}
            >
              Détail
            </Text>
            <Text style={{ color: "#848484", fontSize: 14, fontWeight: "300" }}>
              {item.description}
            </Text>
          </View>
          {item.video && <MyVideoPlayer item_id={item.id} video={item.video} />}
        </View>
        <SimpleMap
          style={{ height: DIMENSIONS.height * 0.4, width: "100%" }}
          title={item.lieu}
          location={{
            latitude: item.latitude || 0,
            longitude: item.longitude || 0,
          }}
        />
        {/* 
        {!passe && ( */}
        <View style={{ marginTop: 30, paddingHorizontal: 10 }}>
          {!this.isPassed() && (
            <DoneButton
              loading={this.state.loading}
              backgroundColor={allredy ? "#2D9CDB" : "#49DD7B"}
              title={"JE PARTICIPE"}
              onPress={() => {
                hasAccess
                  ? allredy
                    ? this.unParticipate()
                    : this.partcipe()
                  : Alert.alert(
                      "",
                      "Votre statut ne vous permet pas de participer à un challenge. "
                    );
              }}
              {...(allredy
                ? {
                    icon: { name: "check", color: "#FFF", size: 30 },
                    iconRight: true,
                  }
                : {})}
            />
          )}
        </View>

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
            marginTop: 10,
            borderRadius: 100,
          }}
        >
          <AntDesign name="home" color={"#49DD7B"} size={30} />
        </TouchableOpacity>
      </ScrollView>
    );
  }
}

const mapState = ({ user, incidents }) => ({
  user: user?.user || {},
  token: user?.token || null,
  incidents,
});

export default connect(mapState, { onEditChallenge })(DetailChallenge);
