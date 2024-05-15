import React, { Component } from "react";
import { View, Text, Alert, TouchableOpacity, Dimensions } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import * as Facebook from "react-native-fbsdk-next";
import { LoginManager, AccessToken } from "react-native-fbsdk-next";
// import LinkedInModal from "react-native-linkedin";
import manifest from "../app.json";
import { Icon } from "react-native-elements";
import { authorize, refresh, revoke } from 'react-native-app-auth';
import { prefetchConfiguration } from 'react-native-app-auth';
import * as AppleAuthentication from "expo-apple-authentication";
import {jwtDecode} from "jwt-decode";
import "core-js/stable/atob";
import {
  loginAsync,
  loginWithLinkedIn,
  loginWithLinkedInAndGetEmails,
} from "../utils/google";

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
    try {
      console.log("Début de la fonction registerWithGoogle");
      let clientId = '';
      let redirectUrl = '';

      if (Platform.OS === 'ios') {
          clientId = '483002182680-0s842plrl4ooejd72ofcubetsh78fcis.apps.googleusercontent.com';
          redirectUrl = 'com.googleusercontent.apps.483002182680-0s842plrl4ooejd72ofcubetsh78fcis:/oauth2redirect/google';
      } else if (Platform.OS === 'android') {
          clientId = '292571474979-0iat5mvc9fbnlfdhsj3b9uk456nvml2g.apps.googleusercontent.com';
          redirectUrl = 'com.googleusercontent.apps.292571474979-0iat5mvc9fbnlfdhsj3b9uk456nvml2g:/oauth2redirect/google';
      }

      // const data = await loginAsync();
      const config = {
        warmAndPrefetchChrome: true,
        issuer: 'https://accounts.google.com',
        clientId: clientId,
        redirectUrl: redirectUrl,
        scopes: ['openid', 'profile', 'email',]
      };
      console.log("Configuration:", config);
      prefetchConfiguration(config);

      console.log("Appel de la fonction authorize");
      const authState = await authorize(config);
      console.log("la fonction est appelee ici ", authState)
      const idTokenPayload = jwtDecode(authState.idToken);
      const userInfo = {
        email: idTokenPayload?.email,
        first_name: idTokenPayload?.given_name,
        last_name: idTokenPayload?.family_name,
        avatar: idTokenPayload?.picture,
        address: "",
        phone: "",
        provider: "Google",
       
      };
      console.log("user info ", userInfo)
  
      this.onFinish(userInfo);

      // Refresh token
      console.log("Appel de la fonction refresh avec le token:", authState);
      const refreshedState = await refresh(config, {
        refreshToken: authState.refreshToken
      });
      
      // Revoke token
      await revoke(config, {
        tokenToRevoke: authState.refreshToken
      });
      
    } catch (error) {
      console.log("erreur ", error)
      Alert.alert('erreur', 'error when we tried to register with google', error.message)
    }
    
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
        clientID="7407210972645627"
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
          const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);
          
          if (result.isCancelled) {
            throw new Error('User cancelled the login process');
          }
    
          const data = await AccessToken.getCurrentAccessToken();
          
          if (!data) {
            throw new Error('Something went wrong obtaining access token');
          }
          
          const accessToken = data.accessToken.toString();
          console.log(accessToken);
          
          // Use the access token to make requests to Facebook API
          // For example, you can get user information like this:
          const response = await fetch(`https://graph.facebook.com/me?access_token=${accessToken}&fields=id,name,email,picture`);
          const userData = await response.json();
          console.log(userData);
          
        } catch (error) {
          console.log(error);
          Alert.alert('Error', error.message);
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
        {/* {this.renderSocial(
          { name: "linkedin", type: "font-awesome" },
          () => this.renderLinkedInModal(title),
          "rgb(1, 111, 171)",
          () => this.setState({ linkedInModal: true })
        )} */}

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
                  let { email } = jwtDecode(token);
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
                    Alert.alert("", "Error when login with apple ");
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
