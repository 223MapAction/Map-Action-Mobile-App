import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert,
} from "react-native";
import { getImage } from "./http/http";
import { Card } from "react-native-elements";

function Municipal({ navigation, item }) {
  return (
    <View>
      <View style={{ marginVertical: 10, marginHorizontal: 10 }}>
        <Text
          style={{
            fontSize: 16,
            fontWeight: "bold",
            color: "rgba(0, 0, 0, 0.5)",
          }}
        >
          Municipalités
        </Text>
      </View>

      <FlatList
        data={item.zones}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <View
            style={{
              marginVertical: 15,
              width: Dimensions.get("window").width,
            }}
          >
            <Text style={{ textAlign: "center" }}>Vide!</Text>
          </View>
        }
        horizontal={true}
        renderItem={({ item }) => {
          return (
            <TouchableWithoutFeedback
              onPress={() => {
                navigation.navigate("Messages", {
                  item,
                });
              }}
              style={{ height: 150 }}
            >
              <Card containerStyle={{ borderRadius: 15 }}>
                <Image
                  style={{
                    width: 55,
                    height: 40,
                    alignSelf: "center",
                    marginBottom: 5,
                  }}
                  resizeMode="cover"
                  source={getImage(item.photo)}
                />
                <Text
                  numberOfLines={3}
                  style={{
                    color: "rgba(0, 0, 0, 0.5)",
                    fontSize: 12,
                    textAlign: "center",
                  }}
                >
                  {item.name}
                </Text>
              </Card>
            </TouchableWithoutFeedback>
          );
        }}
      />
    </View>
  );
}

export default Municipal;
