import React from "react";

import { Modal, View, ActivityIndicator, Text } from "react-native";

import { DIMENSIONS } from "../constants/constants";

const { width } = DIMENSIONS;

const Loader = ({
  visible,
  title = "Chargement...",
  backgroundOpacity = 0.2,
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={() => {}}
    >
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor:
            backgroundOpacity === 1
              ? "#FFF"
              : `rgba(0,0,0,${backgroundOpacity})`,
        }}
      >
        <View
          style={[
            {
              backgroundColor: "#FFF",
              width: width * 0.8,
              height: 140,
              justifyContent: "center",
              borderRadius: 10,
              alignItems: "center",
            },
          ]}
        >
          <ActivityIndicator color={"#2d9cdb"} size="large" />
          <Text
            style={{
              fontSize: 12,
              color: "rgba(0,0,0,.7)",
              marginVertical: 20,
            }}
          >
            {title}
          </Text>
        </View>
      </View>
    </Modal>
  );
};

export default Loader;
