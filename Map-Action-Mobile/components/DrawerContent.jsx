import React from "react";
import Icon from "../shared/icon";
import { Divider } from "react-native-elements";
import {
  View,
  Text,
  ImageBackground,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { DrawerActions } from "@react-navigation/native";
import { styles } from "../shared/config";
import { MaterialIcons, SimpleLineIcons } from "@expo/vector-icons";
import image from "../assets/actionmapBlanc.png";
import { connect } from "react-redux";

class DrawerContent extends React.Component {
  navigate(route, params = {}) {
    this.props.navigation.dispatch(DrawerActions.closeDrawer());
    this.props.navigation.navigate(route, params);
  }
  render() {
    const { navigation, state, ...props } = this.props;
    const index = state.index;
    return (
      <>
        <View style={{ ...style.top, paddingTop: 30 }}>
          <MaterialIcons name="menu" size={30} color={"#2d9cdb"} />
          <Text style={{ color: "#38A3D0", fontSize: 20, marginLeft: 20 }}>
            Menu
          </Text>
        </View>
        <DrawerContentScrollView {...props} style={style.container}>
          <>
            {/* <DrawerRoute
              {...props}
              title="Carte"
              icon="place" 
            /> */}
            <DrawerRoute
              {...props}
              title="Challenges"
              icon="place"
              onPress={() => this.navigate("ListChallenge2")}
            />
            {this.props.token !== null && (
              <DrawerRoute
                {...props}
                title="Communautés"
                icon="supervisor-account"
                onPress={() => this.navigate("Communaute")}
              />
            )}
            {this.props.token === null && (
              <DrawerGri
                {...props}
                title="Communautés"
                icon="supervisor-account"
              />
            )}
            <DrawerRoute
              {...props}
              title="Villes"
              icon="location-city"
              onPress={() => this.navigate("Ville")}
            />
            {this.props.token !== null && (
              <DraweBadge
                {...props}
                title="Mon badge"
                onPress={() => this.navigate("Badge")}
              />
            )}
            {this.props.token === null && (
              <DraweBadge
                {...props}
                title="Gagner un badge"
                onPress={() => this.navigate("Badge")}
              />
            )}
            <DrawerRoute
              {...props}
              title="Nous contacter"
              icon="public"
              onPress={() => this.navigate("Contact")}
            />
            {this.props.token === null && (
              <DrawerDeconnexion
                {...props}
                title="Se Connecter"
                onPress={() => this.navigate("Login")}
              />
            )}
            {this.props.token !== null && (
              <DrawerDeconnexion
                {...props}
                title="Déconnexion"
                onPress={() =>
                  Alert.alert(
                    "Confirmation",
                    "Voulez-vous vraiment vous déconnecter ? ",
                    [
                      {
                        text: "oui",
                        onPress: () => this.navigate("Logout"),
                      },
                      { text: "Non", style: "cancel" },
                    ]
                  )
                }
              />
            )}
          </>

          <Image
            style={{
              width: 150,
              height: 76,
              alignSelf: "center",
              marginTop: 30,
            }}
            source={image}
          />
        </DrawerContentScrollView>
      </>
    );
  }
}

const DrawerRoute = ({ title, icon, onPress, focused, ...rest }) => {
  return (
    <DrawerItem
      {...rest}
      focused={focused}
      label={() => {
        return (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              width: 250,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <MaterialIcons
                focused={true}
                name={icon}
                size={25}
                color={"#38A3D0"}
              />
              <Text style={style.route}>{title}</Text>
            </View>
          </View>
        );
      }}
      onPress={onPress}
    />
  );
};

const DraweBadge = ({ title, icon, onPress, focused, ...rest }) => {
  return (
    <DrawerItem
      {...rest}
      focused={focused}
      label={() => {
        return (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              width: 250,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <SimpleLineIcons
                focused={true}
                name="badge"
                size={25}
                color={"#38A3D0"}
              />
              <Text style={style.route}>{title}</Text>
            </View>
          </View>
        );
      }}
      onPress={onPress}
    />
  );
};

const DrawerGri = ({ title, icon, onPress, focused, ...rest }) => {
  return (
    <DrawerItem
      {...rest}
      focused={focused}
      label={() => {
        return (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              width: 250,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                opacity: 0.5,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <MaterialIcons
                focused={true}
                name={icon}
                size={25}
                color={"#38A3D0"}
              />
              <Text style={style.route}>{title}</Text>
            </View>
          </View>
        );
      }}
      onPress={onPress}
    />
  );
};

const DrawerDeconnexion = ({ title, icon, onPress, focused, ...rest }) => {
  return (
    <DrawerItem
      {...rest}
      focused={focused}
      label={() => {
        return (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              width: 250,
            }}
          >
            <View style={{ flexDirection: "row" }}>
              <Text
                style={{
                  color: "#38A3D0",
                  fontSize: 18,
                  marginLeft: 40,
                  fontWeight: "bold",
                }}
              >
                {title}
              </Text>
            </View>
          </View>
        );
      }}
      onPress={onPress}
    />
  );
};
const style = {
  container: { backgroundColor: "#fff" },
  top: {
    marginLeft: 20,
    width: "100%",
    alignItems: "center",
    flexDirection: "row",
  },
  user: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 5,
    justifyContent: "center",
    marginTop: 10,
  },
  imageContainer: { marginRight: 3, padding: 2, borderRadius: 20 },
  textContainer: { width: 190, padding: 1, justifyContent: "center" },
  displayName: {
    color: "#fff",
    fontSize: 20,
    textAlign: "center",
    marginBottom: 5,
  },
  email: {
    fontWeight: "bold",
    textAlign: "center",
    color: "#fff",
    fontSize: 10,
  },
  route: { color: "#8A8A8A", fontSize: 16, marginLeft: 20 },
  sectionTitle: {
    marginBottom: 5,
    marginLeft: 5,
    textTransform: "uppercase",
    color: "rgba(0,0,0,.5)",
  },
};

const mapState = ({ user }) => ({ token: user.token ? user.token : null });
export default connect(mapState, null)(DrawerContent);
