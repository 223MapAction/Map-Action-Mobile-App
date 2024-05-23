import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Image,
  Dimensions,
  ImageBackground,
  StatusBar,
} from "react-native";
import { onLogin } from "../redux/user/action";
import { connect } from "react-redux";
import Storage, { logout, setUser } from "../utils/userStorage";
import { ActivityIndicator } from "react-native";
import { verify_token } from "../utils/http/auth";
import JwtDecode from "jwt-decode";
import { read_user } from "../utils/http/user";
import { list_communaute } from "../utils/http/communaute";
import { onGetCommunaute } from "../redux/communautes/action";

class Welcome extends Component {
  state = { loading: true, token: null };

  async componentDidMount() {
    const data = await Storage.getUser();
    let ok = false;
    if (data.token) {
      try {
        await verify_token(data.token);
        let { user_id } = JwtDecode(data.token);

        const user = await read_user(user_id);
        this.setState({ token: data.token });
        this.props.onLogin({ token: data.token, user });
        setUser({ token: data.token, user });
        ok = true;
      } catch (ex) {
        await logout();
        console.log(ex);
      }
    }
    list_communaute().then((lists) => {
      this.props.onGetCommunaute(lists);
    });
    this.setState({ loading: false });
    if (ok) {
      this.props.navigation.replace("DrawerNavigation");
    } else {
      setTimeout(() => {
        this.props.navigation.replace("Accueil");
      }, 400);
    }
  }
  render() {
    const { width, height } = Dimensions.get("window");
    return (
      <ImageBackground
        resizeMode="contain"
        style={{
          width,
          height: height - (StatusBar.currentHeight || 0),
          backgroundColor: "#2d9cdb",
        }}
        source={require("../assets/splash.png")}
      >
        <View style={styles.container}>
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              zIndex: 1000,
              bottom: 0,
              alignItems: "center",
              justifyContent: "flex-end",
            }}
          >
            <ActivityIndicator
              color="#fff"
              size="small"
              style={{ marginBottom: 20 }}
            />
          </View>
        </View>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  bienvenue: {
    justifyContent: "center",
    alignSelf: "center",
  },
});
export default connect(null, { onLogin, onGetCommunaute })(Welcome);
