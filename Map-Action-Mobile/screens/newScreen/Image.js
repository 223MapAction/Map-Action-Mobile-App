import React, { Component, useEffect } from "react";
import { Dimensions, Image, View, Animated } from "react-native";
import { Icon } from "react-native-elements";

const { width, height } = Dimensions.get("window");
const [WIDTH, HEIGHT] = [width, height];

export default ({
  route: {
    params: { source },
  },
}) => {
  const transition = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(transition, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  }, []);

  const scale = transition.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 1],
  });
  const translateY = transition.interpolate({
    inputRange: [0, 1],
    outputRange: [-HEIGHT / 4, 0],
  });
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#000",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Animated.Image
        source={source}
        resizeMode="contain"
        style={{
          width: WIDTH,
          height: HEIGHT,
          transform: [{ scale }, { translateY }],
        }}
      />
    </View>
  );
};
