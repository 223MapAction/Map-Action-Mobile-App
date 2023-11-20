import React, { Component } from "react";
import { View, Text, Alert, TouchableOpacity, Dimensions } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import * as Facebook from "expo-facebook";
import LinkedInModal from "react-native-linkedin";
import manifest from "../app.json";
import { Icon } from "react-native-elements";
// import * as AppleAuthentication from "expo-apple-authentication";
// import jwtDcode from "jwt-decode";
// import {
//   loginAsync,
//   loginWithLinkedIn,
//   loginWithLinkedInAndGetEmails,
// } from "../utils/google";

import { useTwitter } from "react-native-simple-twitter";
import { Platform } from "react-native";
import { getData, setData } from "../utils/userStorage";

function TwitterLogin({ onFinish, Tref }) {
  const { twitter, TWModal } = useTwitter({
    onSuccess: (user, accessToken) => {
      const parts = user.name.split(" ");
      const userInfo = {
        first_name: parts[0],
        last_name: parts[1] || parts[0],
        adress: user.location || "",
        email: user.email,
        phone: "",
        provider: "Twitter",
      };
      console.log(userInfo);
      onFinish(userInfo);
    },
    onError: (error) => console.log("Error", error),
  });

  const registerWithTwitter = async () => {
    try {
      twitter.setConsumerKey(
        "RsTOxG5wVtajV771N14lHMkRU",
        "U35FDVt10PVy0pGbQ0Ihbq4XaRnWVNWXOewnipuKIkMV1mbRHp"
      );
      await twitter.login();
    } catch (e) {
      console.log(e.errors);
    }
  };
  if (Tref) {
    Tref({ registerWithTwitter });
  }

  return <TWModal closeText="Annuler" />;
}

export default class Inscription extends Component {
  async registerWithGoogle() {
    const data = await loginAsync();
    const userInfo = {
      email: data.user.email,
      first_name: data.user.givenName,
      last_name: data.user.familyName,
      adress: "",
      phone: "",
      provider: "Google",
      avatar: data.user.photoUrl,
    };
    this.onFinish(userInfo);
  }
  twitterRef = React.createRef();

  renderTwitterModal() {
    return (
      <TwitterLogin
        Tref={(ref) => (this.twitterRef = ref)}
        onFinish={(data) => this.onFinish(data)}
      />
    );
  }

  async registerWithLinkedIn(token) {
    this.setState({ loading: true });
    try {
      const data = await loginWithLinkedIn(token);
      const finalData = {
        first_name: data.localizedFirstName,
        last_name: data.localizedLastName,
        adress: "",
        phone: "",
        provider: "LinkedIn",
      };
      const data2 = await loginWithLinkedInAndGetEmails(token);
      finalData.email = data2.elements[0]["handle~"].emailAddress;
      this.onFinish(finalData);
    } catch (ex) {
      Alert.alert("", "inscription impossible", [
        { text: "Ok", style: "cancel" },
      ]);
    }
    this.setState({ loading: false });
  }

  renderLinkedInModal(title = "") {
    if (!this.state.linkedInModal) return null;
    return (
      <LinkedInModal
        linkText={title + " avec LinkedIn"}
        clientSecret="PSXUn5CERO91Dpgr"
        permissions={["r_liteprofile", "r_emailaddress"]}
        clientID="78ljig6vq3qg4g"
        redirectUri="https://google.co.in"
        onError={() => null}
        onSuccess={({ access_token }) =>
          this.registerWithLinkedIn(access_token)
        }
      />
    );
  }

  logIn = async () => {
    try {
      await Facebook.initializeAsync(manifest.expo.facebookAppId);
      const { type, token } = await Facebook.logInWithReadPermissionsAsync(
        manifest.expo.facebookAppId,
        {
          permissions: ["public_profile", "email"],
        }
      );
      if (type === "success") {
        // Get the user's name using Facebook's Graph API
        const response = await fetch(
          `https://graph.facebook.com/me?access_token=${token}&fields=id,name,email,first_name,last_name,address`
        );

        const userInfo = await response.json();

        const data = {
          first_name: userInfo.first_name,
          last_name: userInfo.last_name,
          phone: "",
          adress: userInfo.address || "",
          email: userInfo.email,
          provider: "Facebook",
        };

        this.onFinish(data);
      }
    } catch ({ message }) {
      alert(
        `une erreur s'est produite lors de la connexion avec Facebook, veuillez réessayer ${message}`
      );
    }
  };

  logoutWithFacebook = async () => {
    this.setState({ userInfo: {} });
  };

  render() {
    return null;
  }
  submitModal() {
    this.setState({ isModalVisible: false });
    this.submit();
  }
  renderLoadingModal() {
    if (!this.state.loading) return null;
    return (
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          zIndex: 500,
        }}
      >
        <View
          style={{
            width: Dimensions.get("window").width,
            padding: 20,
            position: "absolute",
            backgroundColor: "rgba(0,0,0,.5)",
            borderRadius: 30,
            zIndex: 1000,
            top: Dimensions.get("window").height * 0.2,
            left: Dimensions.get("window").width * 0.05,
            width: Dimensions.get("window").width * 0.9,
          }}
          onHide={() => null}
        >
          <Text style={{ textAlign: "center", fontSize: 20, color: "#FFF" }}>
            chargement en cours...
          </Text>
          <View
            style={{
              padding: 20,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ActivityIndicator color={"#FFF"} size="small" />
          </View>
        </View>
      </View>
    );
  }

  renderError(field) {
    const error = this.state.errors[field];
    if (!error) return null;
    return (
      <Text
        style={{
          color: "#F00",
          fontSize: 12,
          marginLeft: 30,
          marginVertical: 5,
        }}
      >
        {error}
      </Text>
    );
  }
  renderSocialButtons(title = "S'inscrire") {
    return (
      <View style={{ alignSelf: "center" }}>
        {this.renderSocial(
          { name: "facebook", type: "font-awesome" },
          title + " avec Facebook",
          "#4267b2",
          this.logIn
        )}
        {this.renderSocial(
          { name: "twitter", type: "font-awesome" },
          title + " avec Twitter",
          "#1da1f2",
          () => this.twitterRef.registerWithTwitter()
        )}
        {this.renderSocial(
          { name: "google", type: "font-awesome" },
          title + " avec Google",
          "#e94235",
          () => this.registerWithGoogle()
        )}
        {this.renderSocial(
          { name: "linkedin", type: "font-awesome" },
          () => this.renderLinkedInModal(title),
          "rgb(1, 111, 171)",
          () => this.setState({ linkedInModal: true })
        )}

        {Platform.OS === "ios" && (
          <View
            style={{
              backgroundColor: "#000",
              height: 55,
              alignItems: "center",
              paddingHorizontal: 30,
              borderRadius: 50,
              marginTop: 10,
              width: 280,
              overflow: "hidden",
            }}
          >
            <AppleAuthentication.AppleAuthenticationButton
              buttonType={
                AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN
              }
              buttonStyle={
                AppleAuthentication.AppleAuthenticationButtonStyle.BLACK
              }
              cornerRadius={5}
              style={{
                height: 55,
                width: 280,
              }}
              onPress={async () => {
                try {
                  const credential = await AppleAuthentication.signInAsync({
                    requestedScopes: [
                      AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                      AppleAuthentication.AppleAuthenticationScope.EMAIL,
                    ],
                  });
                  let token = credential.identityToken;
                  let { email } = jwtDcode(token);
                  console.log("email", email);
                  console.log("cre", credential);
                  if (email) {
                    const userInfo = {
                      first_name: credential.fullName.givenName || "empty",
                      last_name: credential.fullName.familyName || "empty",
                      adress: "",
                      email,
                      phone: "",
                      provider: "Apple",
                    };
                    this.onFinish(userInfo);
                    setData("apple", credential);
                  } else {
                    const credential = await getData("apple", { fullName: {} });
                    const userInfo = {
                      email: credential.email,
                      first_name: credential.fullName.givenName,
                      last_name: credential.fullName.familyName,
                      adress: "",
                      phone: "",
                      provider: "Apple",
                    };
                    this.onFinish(userInfo);
                  }
                } catch (e) {
                  console.log("error", e);
                  if (e.code === "ERR_CANCELED") {
                    // handle that the user canceled the sign-in flow
                  } else {
                    Alert.alert("", "Error when login with apple");
                    // handle other errors
                  }
                }
              }}
            />
          </View>
        )}
      </View>
    );
  }
  renderSocial(icon, title, color, onPress) {
    return (
      <TouchableOpacity
        onPress={() => onPress()}
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 30,
          marginTop: 10,
          backgroundColor: color,
          height: 55,
          borderRadius: 50,
          width: 280,
        }}
      >
        <Icon
          {...icon}
          color="#000"
          containerStyle={{ marginRight: typeof title !== "string" ? 30 : 10 }}
        />
        {typeof title === "string" && (
          <Text style={{ color: "#000", fontWeight: "normal", marginLeft: 20 }}>
            {title}
          </Text>
        )}
        {typeof title !== "string" && title()}
      </TouchableOpacity>
    );
  }
}
