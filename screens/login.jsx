import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { ActivityIndicator } from "react-native-paper";
import { connect } from "react-redux";
import { onLogin, onGetUsers } from "../redux/user/action";
import { login, getTokenByEmail } from "../utils/http/auth";
import Validator from "../utils/validator";
import Storage from "../utils/userStorage";
import {jwtDecode} from "jwt-decode";
import "core-js/stable/atob";
import { read_user } from "../utils/http/user";
import Popup from "../shared/Popup";
import Auth from "./Auth";
class Login extends Auth {
  state = {
    errors: {},
    email: "",
    password: "",
    isModalVisible: false,
    // linkedInModal: true,
    loading: false,
  };
  Schema = Validator.object().shape({
    email: Validator.string().email().required().label("Adresse Mail"),
    password: Validator.string().required().label("Mot de passe"),
  });
  async submit() {
    this.Schema.validate(
      { email: this.state.email, password: this.state.password },
      { abortEarly: false }
    )
      .then(async () => {
        this.setState({ errors: {} });
        await this.loginWithCredentials();
      })
      .catch((ex) => {
        const errors = {};
        ex.inner.forEach((error) => {
          errors[error.path] = error.errors[0];
        });
        this.setState({ errors });
      });
  }

  async redirect() {
    this.setState({
      isModalVisible: true,
    });
  }

  async onFinish(userInfo) {
    this.setState({ loading: true });
    let token;
    try {
      const data = await getTokenByEmail(userInfo.email);
      console.log("l'email de l'utilisateur ", data)
      token = data.token;
    } catch (ex) {
      console.log("error", ex.response);
    }
    if (!token) {
      Alert.alert("votre compte est introuvable, inscrivez-vous maintenant");
    } else {
      if (true) {
        try {
          let { user_id } = jwtDecode(token);
          const user = await read_user(user_id);
          this.props.onLogin({ token: token, user });
          await Storage.setUser({ token: token, user });
          this.redirect();
        } catch (ex) {
          console.log(ex);
        }
      } else {
        Alert.alert(
          "",
          "veuillez vérifier si votre compte a été créé avec " +
            userInfo.provider
        );
      }
    }
    this.setState({ loading: false });
  }

  async loginWithCredentials() {
    this.setState({ loading: true });
    const { email, password } = this.state;
    const user = { email, password }; 
    console.log("Les utilisateurs ", user); 
    console.log("User est-il défini ici ?", user);

    try {
      console.log("Avant la fonction")
      const data = await login(user);
      console.log("les données", data)
      let user_id = jwtDecode(data.token);
      const user = await read_user(user_id.user_id);
      console.log("user", user_id);
      this.props.onLogin({ token: data.token, user });
      await Storage.setUser({ token: data.token, user });
      this.redirect();
    } catch (error) {
      console.error("Error during login:", error);
      if (error) {
        const errors = {};
        if (error.non_field_errors) {
          errors["email"] = error.non_field_errors[0];
        } else {
          Object.keys(error).map((field) => {
            const err = error[field];
            errors[field] = err[0];
          });
        }

        this.setState({ errors });
      }
    }
    this.setState({ loading: false });
}


  renderModal() {
    const onPress = () => {
      this.setState({ isModalVisible: false });
      const nextRoute = this.props.route?.params?.nextRoute;
      if (nextRoute) {
        this.props.navigation.navigate(nextRoute, {
          ...(this.props.route?.params?.params || {}),
        });
      } else {
        this.props.navigation.navigate("DrawerNavigation");
      }
    };
    return (
      <Popup onHide={onPress}>
        <TouchableOpacity
          onPress={onPress}
          style={{
            zIndex: 10,
            alignSelf: "flex-end",
            paddingRight: 20,
          }}
        >
          <MaterialIcons name="close" size={30} color={"#666666"} />
        </TouchableOpacity>
        <Text style={{ textAlign: "center", fontSize: 20 }}>
          Connexion réussie
        </Text>
        <TouchableOpacity
          style={{
            backgroundColor: "#2D9CDB",
            borderRadius: 10,
            width: 68,
            height: 53,
            marginTop: 20,
            alignSelf: "center",
          }}
          onPress={onPress}
        >
          <Text
            style={{
              textAlign: "center",
              color: "#fff",
              fontSize: 20,
              marginTop: 10,
            }}
          >
            OK
          </Text>
        </TouchableOpacity>
      </Popup>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        {this.state.isModalVisible && this.renderModal()}
        {this.state.loading && this.renderLoadingModal()}
        {this.renderTwitterModal()}
        <ScrollView style={{}} showsVerticalScrollIndicator={false}>
          <View style={styles.text}>
            <View style={{ flex: 1, justifyContent: "center" }}>
              <Text
                style={{
                  alignSelf: "flex-start",
                  color: "#38A3D0",
                  fontStyle: "normal",
                  fontSize: 32,
                }}
              >
                Se
              </Text>
              <Text
                style={{
                  alignSelf: "flex-start",
                  color: "#38A3D0",
                  fontStyle: "normal",
                  fontWeight: "bold",
                  fontSize: 32,
                }}
              >
                connecter
              </Text>
              <View style={{ marginTop: 20, ...styles.section }}>
                <MaterialIcons name="email" color={"#666666"} size={20} />
                <TextInput
                  mode="flat"
                  style={{
                    width: "90%",
                    paddingLeft: 10,
                  }}
                  value={this.state.email}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  placeholder="Adresse mail du citoyen"
                  placeholderTextColor="#888787"
                  onChangeText={(email) => this.setState({ email })}
                />
              </View>
              {this.state.errors.email && (
                <Text
                  style={{
                    color: "#F00",
                    marginLeft: 25,
                    marginVertical: 5,
                  }}
                >
                  {this.state.errors.email}
                </Text>
              )}
              <View style={{ marginTop: 30, ...styles.section }}>
                <MaterialIcons name="https" color={"#666666"} size={20} />
                <TextInput
                  mode="flat"
                  style={{
                    paddingLeft: 10,
                    width: "90%",
                  }}
                  value={this.state.password}
                  placeholder="mot de passe"
                  placeholderTextColor="#888787"
                  secureTextEntry={true}
                  onChangeText={(password) => this.setState({ password })}
                />
              </View>
              {this.state.errors.password && (
                <Text
                  style={{
                    color: "#F00",
                    marginLeft: 25,
                    marginVertical: 5,
                  }}
                >
                  {this.state.errors.password}
                </Text>
              )}
              <TouchableOpacity
                style={{ paddingVertical: 10 }}
                onPress={() => this.props.navigation.navigate("ForgotPassword")}
              >
                <Text
                  style={{
                    color: "#707070",
                    alignSelf: "flex-end",
                    marginTop: 5,
                    fontSize: 12,
                  }}
                >
                  Mot de passe oublié
                </Text>
              </TouchableOpacity>
              <View style={{ marginTop: 20, paddingVertical: 30 }}>
                <TouchableOpacity
                  onPress={() => this.submit()}
                  style={{
                    backgroundColor: "#49DD7B",
                    borderRadius: 35,
                    alignItems: "center",
                    height: 50,
                    marginHorizontal: 8,
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 20,
                      color: "#fff",
                      fontWeight: "bold",
                    }}
                  >
                    Se connecter
                  </Text>
                </TouchableOpacity>
              </View>
              {this.renderSocialButtons("Se connecter")}
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                marginVertical: 50,
              }}
            >
              <Text style={{ color: "#827F7F" }}>Pas encore de compte ? </Text>
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate("Inscription")}
              >
                <Text style={{ fontWeight: "bold", color: "#827F7F" }}>
                  S’inscrire
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingStart: 10,
    backgroundColor: "#fff",
  },
  text: {
    marginHorizontal: 10,
    justifyContent: "center",
    flex: 1,
    marginTop: 50,
  },
  iconStyle: {
    color: "#5a52a5",
    fontSize: 28,
    marginLeft: 15,
  },

  ellipse: {
    width: 50,
    height: 50,
    alignSelf: "center",
    justifyContent: "center",
    borderRadius: 50,
    alignItems: "center",
    backgroundColor: "#49DD7B",
    borderColor: "#FFF",
    borderWidth: 1,
  },
  ellipse2: {
    width: 10,
    height: 10,
    alignSelf: "center",
    justifyContent: "center",
    borderRadius: 10,
    marginStart: 8,
    backgroundColor: "rgba(196, 196, 196, 0.45)",
    borderColor: "#FFF",
    borderWidth: 1,
  },

  section: {
    height: 50,
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    borderRadius: 35,
    paddingHorizontal: 20,
    shadowColor: "#ccc",
    elevation: 5,
    shadowOpacity: 0.5,
    shadowRadius: 1,
    shadowOffset: {
      width: 3,
      height: 3,
    },
  },
  searchIcon: {
    padding: 10,
  },
  itemStyle: {
    marginBottom: 10,
    flex: 1,
  },
});
const mapState = ({ user }) => ({ users: user.users });

export default connect(mapState, { onLogin, onGetUsers })(Login);
