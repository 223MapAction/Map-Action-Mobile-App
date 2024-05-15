import React, { Component } from "react";
import { Platform, View } from "react-native";
import { WebView } from "react-native-webview";
import { ResetPasswordUrl } from "../utils/http/http";

class ForgotPassword extends Component {
  render() {
    return (
      <View style={{ flex: 1, paddingTop: Platform.OS === "ios" ? 5 : 0 }}>
        <WebView
          containerStyle={{ backgroundColor: "#FFF", flex: 1 }}
          source={{ uri: ResetPasswordUrl }}
        />
      </View>
    );
  }
}
export default ForgotPassword;
