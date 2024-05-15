import React, { useEffect } from "react";
import { Dimensions, Animated, Image, View } from "react-native";

const { width, height } = Dimensions.get("window");
const [WIDTH, HEIGHT] = [width, height];

const ImageFullScreen = ({
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
    return ( <
        View style = {
            {
                flex: 1,
                backgroundColor: "#000",
                alignItems: "center",
                justifyContent: "center",
            }
        } >
        <
        Animated.Image source = { source }
        resizeMode = "contain"
        style = {
            {
                width: WIDTH,
                height: HEIGHT,
                transform: [{ scale }, { translateY }],
            }
        }
        testID = "fullscreen-image" // Add testID for testing
        /
        >
        <
        /View>
    );
};

export default ImageFullScreen;