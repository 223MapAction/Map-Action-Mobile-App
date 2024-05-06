import React from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { Text, View, TouchableOpacity, Image } from "react-native";
import { styles } from "../shared/config";
import HeaderLeft from "./HeaderLeft";

export default ({ pays, ville }) => {
  return (
    <View
      style={{
        backgroundColor: "#38A3D0",
        height: 80,
        paddingHorizontal: 20,
        justifyContent: "center",
      }}
    >
      <Text
        style={{
          color: "#fff",
          fontSize: 14,
        }}
      >
        {pays}
      </Text>
      <Text
        style={{
          color: "#fff",
          fontSize: 20,
          fontWeight: "bold",
        }}
      >
        {ville}
      </Text>
    </View>
  );
};
