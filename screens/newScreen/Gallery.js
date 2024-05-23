import React, { useEffect } from "react";
import { Dimensions, View, Animated, FlatList } from "react-native";
import { getImage } from "../../utils/http/http";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

const { width } = Dimensions.get("window");
const [WIDTH] = [width];

export default ({
  route: {
    params: { photos },
  },
  navigation,
}) => {
  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={photos}
        contentContainerStyle={{
          alignItems: "center",
        }}
        keyExtractor={(item) => item}
        renderItem={({ item, index }) => {
          const source = getImage(item);

          return (
            <TouchableWithoutFeedback
              onPress={() => navigation.push("Image", { source })}
            >
              <ImageThumb source={source} />
            </TouchableWithoutFeedback>
          );
        }}
        numColumns={2}
      />
    </View>
  );
};

export const ImageThumb = ({ source }) => {
  const width = WIDTH * 0.45;
  const height = width * 0.7;
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
    outputRange: [-height / 4, 0],
  });
  return (
    <Animated.Image
      source={source}
      resizeMode="cover"
      style={{
        marginHorizontal: WIDTH * 0.025,
        marginVertical: WIDTH * 0.025,
        width: width,
        height: height,
        transform: [{ scale }, { translateY }],
      }}
    />
  );
};
