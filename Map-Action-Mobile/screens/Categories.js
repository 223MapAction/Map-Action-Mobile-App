import React, { useEffect } from "react";
import {
  FlatList,
  Dimensions,
  View,
  ActivityIndicator,
  Animated,
} from "react-native";
import { Card, Image, Text } from "react-native-elements";
import { list_categories } from "../utils/http/incident";
import { ApiUrl } from "../utils/http/http";

import {
  TouchableWithoutFeedback,
  TouchableOpacity,
} from "react-native-gesture-handler";
import { MaterialIcons } from "@expo/vector-icons";
const { width } = Dimensions.get("window");
const SPACE = 20;
const ITEM_WIDTH = (width - SPACE) * 0.4;
const Categories = ({
  route: {
    params: { done },
  },
  navigation,
}) => {
  const [categories, setCategories] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [category, setCategory] = React.useState({});
  React.useEffect(() => {
    list_categories().then((categories) => {
      setCategories(categories);
      setLoading(false);
      setCategory(categories[0]);
    });
  }, []);
  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="small" color="#004FAC" />
      </View>
    );
  }
  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={categories}
        contentContainerStyle={{
          alignItems: "center",
        }}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item, index }) => (
          <Item
            isActive={category === item}
            category={item}
            onPress={setCategory}
          />
        )}
        numColumns={2}
        ListFooterComponent={
          <View style={{ marginVertical: 20 }}>
            <TouchableOpacity
              onPress={() => {
                navigation.pop();
                done(category);
              }}
              style={{
                flexDirection: "row",
                backgroundColor: "#49DD7B",
                marginTop: 20,
                borderRadius: 100,
                alignItems: "center",
                width: ITEM_WIDTH * 2,
                height: 50,
                justifyContent: "center",
                marginHorizontal: 20,
              }}
            >
              <Text
                style={{
                  fontSize: 20,
                  lineHeight: 24,
                  color: "#fff",
                  marginRight: 10,
                  fontWeight: "bold",
                }}
              >
                ENVOYER
              </Text>
              <MaterialIcons name="send" color={"#fff"} size={30} />
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
};

export default Categories;
const MyCard = Animated.createAnimatedComponent(Card);
const Item = ({ category, onPress, isActive }) => {
  const animation = React.useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(animation, {
      useNativeDriver: false,
      duration: 400,
      toValue: isActive ? 1 : 0,
    }).start();
  }, [isActive]);

  const { name, photo } = category;
  const backgroundColor = animation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ["#FFF", "#eee", "#EAF4FF"],
  });

  return (
    <TouchableWithoutFeedback onPress={() => onPress(category)}>
      <MyCard
        wrapperStyle={{
          margin: 0,
          padding: 0,
          alignItems: "center",
        }}
        containerStyle={{
          padding: 0,
          alignItems: "center",
          justifyContent: "center",
          width: ITEM_WIDTH,
          height: ITEM_WIDTH * 0.9,
        }}
      >
        <Animated.View
          style={{
            padding: 10,
            backgroundColor,
            alignItems: "center",
            justifyContent: "center",
            width: ITEM_WIDTH,
            height: ITEM_WIDTH * 0.9,
          }}
        >
          <Image
            style={{ width: ITEM_WIDTH * 0.35, height: ITEM_WIDTH * 0.35 }}
            resizeMode="contain"
            source={{ uri: ApiUrl + photo }}
          />
          <Text
            style={{
              textAlign: "center",
              color: "#4E4C4C",
              fontSize: 12,
              marginTop: 5,
            }}
          >
            {name}
          </Text>
        </Animated.View>
      </MyCard>
    </TouchableWithoutFeedback>
  );
};
