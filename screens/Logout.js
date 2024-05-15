import React, { Component } from "react";
import { View } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { onLogout } from "../redux/user/action";
import { connect } from "react-redux";
import Storage from "../utils/userStorage";
class Logout extends Component {
  async componentDidMount() {
    await Storage.logout();
    this.props.onLogout();
    this.props.navigation.replace("Login");
  }

  render() {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator color="#49DD7B" size="large" />
      </View>
    );
  }
}

export default connect(null, { onLogout })(Logout);
