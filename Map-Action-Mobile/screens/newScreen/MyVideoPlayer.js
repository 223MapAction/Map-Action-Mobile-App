import React from "react";
import { Video } from "expo-av";
import { View, Dimensions, ActivityIndicator, StyleSheet } from "react-native";
import { ApiUrl } from "../../utils/http/http";
export default function VP({ video, localVideo }) {
  const [loading, setLoading] = React.useState(false);
  const v = localVideo || ApiUrl + video;
  return (
    <View style={{}}>
      {loading && (
        <View
          style={{
            ...StyleSheet.absoluteFillObject,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#000",
            zIndex: 1000,
          }}
        >
          <ActivityIndicator color="#FFF" size="small" />
        </View>
      )}
      <Video
        source={{
          uri: v,
        }}
        shouldPlay={true}
        style={{
          height: Dimensions.get("window").height * 0.6,
          width: "100%",
          backgroundColor: "#000",
          zIndex: 2,
        }}
        onLoadStart={() => setLoading(true)}
        onLoad={() => setLoading(false)}
        useNativeControls={true}
        volume={1}
        resizeMode="contain"
        isLooping={false}
        rate={1.0}
        onError={(error) => console.log("error video", error)}
      />
    </View>
  );
}
