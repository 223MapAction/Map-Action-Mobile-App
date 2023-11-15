import React from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { Text, View, TouchableOpacity, Platform } from "react-native";
import { styles } from "./config";
import { useNavigation } from "@react-navigation/native";
import icon from "../assets/actionmapBlanc.png";
import { Image, Avatar } from "react-native-elements";
import { connect } from "react-redux";
import { ApiUrl } from "../utils/http/http";
import { MyImage } from "../screens/slides/Slide3";
const Header = ({ title, navigation, user, leftButton, showImage, style }) => {
  if (!navigation) {
    navigation = useNavigation();
  }

  return (
    <View
      style={{
        ...styles.container,
        height: 60,
        overflow: "hidden",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        ...style,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        {!leftButton && (
          <TouchableOpacity
            onPress={() => navigation.openDrawer()}
            style={{ padding: 5, marginRight: 5 }}
          >
            <MaterialIcons name="menu" size={30} color={"#2d9cdb"} />
          </TouchableOpacity>
        )}
        {leftButton && leftButton()}
        {!!!title && !showImage && (
          <Image
            style={{ width: 100, height: 40, alignSelf: "center" }}
            resizeMode="contain"
            rounded
            source={icon}
          />
        )}
        {showImage && (
          <MyImage
            style={{ width: 100, height: 40, alignSelf: "center" }}
            resizeMode="contain"
            rounded
            source={icon}
          />
        )}
        {!!title && <Text style={styles.title}>{title}</Text>}
      </View>
      {!leftButton && !!user && user?.id && (
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("TabNavigation", {
              screen: "ProfilStackNavigation",
            })
          }
          style={{ alignItems: "center" }}
        >
          <Avatar
            size="small"
            rounded
            source={{ uri: ApiUrl + user.avatar }}
            // containerStyle={{ width: 40, height: 40 }}
          />
          <Text
            numberOfLines={2}
            style={{
              color: "#757474",
              fontSize: 8,
              maxWidth: 90,
              textAlign: "center",
            }}
          >
            {user.first_name + " " + user.last_name}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const mapState = ({ user }) => ({ user: user.user ? user.user : null });
export default connect(mapState, null)(Header);
