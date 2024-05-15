import React from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { Text, View, TouchableOpacity, Image } from "react-native";
import { styles } from "../shared/config";
import { useNavigation } from "@react-navigation/native";
import icon from "../assets/mercycorps.png";
import image from "../assets/image.jpg";
import IconBadge from "react-native-icon-badge";
import HeaderLeft from "./HeaderLeft";

/* import NotificationIcon from "./NotificationIcon"; */
export default ({ title, navigation, image }) => {
  if (!navigation) {
    navigation = useNavigation();
  }
  return (
    <View
      style={{ ...styles.container, backgroundColor: "#FBFBFB", height: 120 }}
    >
      <HeaderLeft colors={"#2D9CDB"} />
      <Image
        style={{
          width: 60,
          height: 60,
          borderRadius: 100,
          alignSelf: "center",
        }}
        source={image}
      />
      <Text style={{ ...styles.title, paddingStart: 20 }}>{title}</Text>
    </View>
  );
};
