import React from "react";
import { TouchableOpacity } from "react-native";
import { Icon } from "react-native-elements";
import { LinearGradient } from "expo-linear-gradient";

export default function TabBar({ navigation }) {
  return (
    <TouchableOpacity testID="tab-bar-button" onPress={() => navigation.push("Picture")}>
      <LinearGradient
        colors={["#4CF284", "#09AB3F"]}
        style={{
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 30,
          width: 60,
          height: 60,
          marginTop: -20,
        }}
      >
        <Icon name={"camera"} type={"feather"} size={25} color={"#FFF"} />
      </LinearGradient>
    </TouchableOpacity>
  );
}
