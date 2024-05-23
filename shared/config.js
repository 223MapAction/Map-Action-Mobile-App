import React from "react";
import { StyleSheet, StatusBar, Platform } from "react-native";
/* import NotificationIcon from "../../shared/NotificationIcon"; */
import HeaderLeft from "../utils/HeaderLeft";
let paddingTop = StatusBar.currentHeight;
if (Platform.OS === "ios") paddingTop = 30;

paddingTop = 0;

const headStyles = {
  shadowColor: "#fff",
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.5,
  elevation: 1,
  borderWidth: 0,
};

export default function navigationOption() {
  return {
    headerTitleAlign: "center",
    headerStyle: { ...headStyles },
    headerRightContainerStyle: { marginRight: 15 },
    /* headerRight: () => <NotificationIcon />, */
    headerLeft: () => <HeaderLeft />,
  };
}
export const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    // justifyContent: "flex-start" || "flex-end",
    paddingHorizontal: 15,
    height: 60,
    backgroundColor: "#fff",
    borderBottomColor: "#fff",
  },
  notification: { marginRight: 8 },
  title: {
    fontSize: 16,
    textAlign: "center",
    fontWeight: "bold",
    color: "#38A3D0",
  },
  colorApp: {
    color: "#f43c4e",
  },
});
