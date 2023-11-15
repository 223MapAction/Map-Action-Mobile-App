import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
//import { register, get_token } from "../utils/http/auth";
//import Validator from "../utils/validator";
//import Popup from "../shared/Popup";
//import { setUser } from "../utils/userStorage";
//import { update_incident } from "../utils/http/incident";
import { onLogin } from "../redux/user/action";
import { connect } from "react-redux";
import Auth from "./Auth";
//import { update_user } from "../utils/http/user";
// import ChoicePasswordModal from "./ChoicePasswordModal";
// import { LieuInput } from "./newScreen/newChallenge";

class Inscription extends Auth {
  state = {
    errors: {},
    phone: "",
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    password_confirmation: "",
    adress: "",
    loading: false,
    isModalVisible: false,
    userInfo: {},
    linkedInModal: true,
    choicePasswordVisible: false,
  };
  Schema = Validator.object().shape({
    email: Validator.string().email().required().label("Adresse Mail"),
    phone: Validator.string().label("N° de téléphone du citoyen"),
    first_name: Validator.string().min(2).required().max(30).label("Prénom"),
    last_name: Validator.string().min(2).required().max(30).label("Nom"),
    adress: Validator.string().max(255).label("Adresse"),
    password: Validator.string().min(5).required().label("Mot De Passe"),
    password_confirmation: Validator.string()
      .label("Confirmer mot de passe")
      .required()
      .test(
        "passwords-match",
        "Confirmer mot de passe must match Mot De Passe",
        function (value) {
          return this.parent.password === value;
        }
      ),
  });
  onFinish(data) {
    if (!data.email) {
      Alert.alert("", `Votre compte ${data.provider} ne contient pas d'email!`);
    } else {
      // this.setState({ choicePasswordVisible: true, userInfo: data });
      if (true) {
        delete data.avatar;
      }
      this.register(
        {
          ...data,
          password: data.provider,
        },
        true
      );
    }
  }
  async submit() {
    const {
      errors: _,
      loading,
      userInfo,
      isModalVisible,
      linkedInModal,
      choicePasswordVisible,
      ...data
    } = this.state;
    if (loading) return;
    this.Schema.validate(data, { abortEarly: false })
      .then(async () => {
        this.setState({ errors: {} });
        data.provider = "Form";
        await this.register(data);
      })
      .catch((ex) => {
        const errors = {};
        ex.inner.forEach((error) => {
          errors[error.path] = error.errors[0];
        });
        this.setState({ errors });
      });
  }
  async register(data, flag = false) {
    console.log("data To send", data);

    this.setState({ loading: true });
    try {
      let { data: res } = await register(data);

      const { token } = await get_token(data.email, data.password);
      data.password = res.password;
      data.is_active = true;
      res = await update_user(res.id, data, token);
      await setUser({ token, user: res });
      this.props.onLogin({ token, user: res });
      if (this.props.route.params?.flow) {
        const { params, nextRoute } = this.props.route.params;
        const { item } = params;
        await update_incident(item.id, { zone: item.zone, user_id: res.id });
        item.user = res;
        this.setState({
          isModalVisible: true,
          onFinish: () => {
            this.props.navigation.navigate(nextRoute, { ...params, item });
          },
        });
      } else {
        this.setState({
          isModalVisible: true,
          onFinish: () => this.props.navigation.navigate("DrawerNavigation"),
        });
      }
    } catch (ex) {
      console.log("Register error", ex);
      const { error } = ex;
      if (error) {
        const errors = {};
        Object.keys(error).map((field) => {
          const err = error[field];
          errors[field] = err[0];
        });
        console.log(errors);
        if (flag) {
          Alert.alert("", errors["email"], [{ text: "Ok", style: "cancel" }]);
        } else {
          this.setState({ errors });
        }
      }
    }
    this.setState({ loading: false });
  }

  renderChoicePassword() {
    if (this.state.choicePasswordVisible === false) return null;
    return (
      <ChoicePasswordModal
        onHide={() => this.setState({ choicePasswordVisible: false })}
        onDone={(password) => {
          this.register(
            {
              ...this.state.userInfo,
              password,
            },
            true
          );
        }}
      />
    );
  }

  render() {
    return (
      <View style={styles.container}>
        {this.state.isModalVisible && this.renderModal()}
        {this.renderLoadingModal()}
        {this.renderChoicePassword()}
        {this.renderTwitterModal()}

        <ScrollView
          keyboardShouldPersistTaps="always"
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
        >
          <View>
            <KeyboardAwareScrollView keyboardShouldPersistTaps="always">
              <View style={styles.text}>
                <Text
                  style={{
                    alignSelf: "flex-start",
                    color: "#38A3D0",
                    fontStyle: "normal",
                    fontSize: 32,
                  }}
                >
                  Créer
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
                  un compte
                </Text>

                <View
                  style={{ flex: 1, justifyContent: "center", marginTop: 20 }}
                >
                  <View style={styles.section}>
                    <MaterialIcons name="person" color={"#666666"} size={20} />
                    <TextInput
                      style={{
                        width: "90%",
                        paddingLeft: 10,
                      }}
                      value={this.state.first_name}
                      placeholder="Prénom"
                      placeholderTextColor="#888787"
                      keyboardType="default"
                      onChangeText={(first_name) =>
                        this.setState({ first_name })
                      }
                    />
                    <Text
                      style={{
                        color: "#F00",
                        fontSize: 20,
                        paddingRight: 10,
                        fontWeight: "700",
                        justifyContent: "center",
                      }}
                    >
                      *
                    </Text>
                  </View>
                  {this.renderError("first_name")}
                  <View style={styles.section}>
                    <MaterialIcons name="person" color={"#666666"} size={20} />
                    <TextInput
                      style={{
                        width: "90%",
                        paddingLeft: 10,
                      }}
                      value={this.state.nom}
                      placeholder="Nom"
                      placeholderTextColor="#888787"
                      onChangeText={(last_name) => this.setState({ last_name })}
                    />
                    <Text
                      style={{
                        color: "#F00",
                        fontSize: 20,
                        paddingRight: 10,
                        marginVertical: 5,
                        fontWeight: "700",
                        alignItems: "center",
                      }}
                    >
                      *
                    </Text>
                  </View>
                  {this.renderError("last_name")}
                  <View style={styles.section}>
                    <MaterialIcons
                      name="settings-phone"
                      color={"#666666"}
                      size={20}
                    />
                    <TextInput
                      mode="flat"
                      style={{
                        width: "90%",
                        paddingLeft: 10,
                      }}
                      value={this.state.phone}
                      keyboardType="number-pad"
                      placeholder="N° de téléphone du citoyen"
                      placeholderTextColor="#888787"
                      onChangeText={(phone) => this.setState({ phone })}
                    />
                  </View>
                  {this.renderError("phone")}

                  <LieuInput
                    containerStyle={styles.section}
                    label="Adresse"
                    iconColor={"#666666"}
                    error={this.state.errors.adress}
                    onChange={({ latitude, lieu, longitude, zone }) => {
                      this.setState({ latitude, adress: lieu, longitude });
                    }}
                    value={this.state.adress}
                  />
                  <View style={styles.section}>
                    <MaterialIcons name="email" color={"#666666"} size={20} />
                    <TextInput
                      style={{
                        width: "90%",
                        paddingLeft: 10,
                      }}
                      value={this.state.email}
                      placeholder="Adresse mail du citoyen"
                      placeholderTextColor="#888787"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      onChangeText={(email) => this.setState({ email })}
                    />
                    <Text
                      style={{
                        color: "#F00",
                        fontSize: 20,
                        paddingRight: 10,
                        marginVertical: 5,
                        fontWeight: "700",
                        alignItems: "center",
                      }}
                    >
                      *
                    </Text>
                  </View>
                  {this.renderError("email")}
                  <View style={styles.section}>
                    <MaterialIcons name="https" color={"#666666"} size={20} />
                    <TextInput
                      style={{
                        width: "90%",
                        paddingLeft: 10,
                      }}
                      value={this.state.password}
                      placeholder="Mot de passe"
                      secureTextEntry={true}
                      keyboardType="visible-password"
                      placeholderTextColor="#888787"
                      onChangeText={(password) => this.setState({ password })}
                    />
                    <Text
                      style={{
                        color: "#F00",
                        fontSize: 20,
                        paddingRight: 10,
                        marginVertical: 5,
                        fontWeight: "700",
                        alignItems: "center",
                      }}
                    >
                      *
                    </Text>
                  </View>
                  {this.renderError("password")}
                  <View style={styles.section}>
                    <MaterialIcons name="https" color={"#666666"} size={20} />
                    <TextInput
                      style={{
                        width: "90%",
                        paddingLeft: 10,
                      }}
                      value={this.state.password_confirmation}
                      placeholder="Confirmer mot de passe"
                      placeholderTextColor="#888787"
                      keyboardType="visible-password"
                      secureTextEntry={true}
                      onChangeText={(password_confirmation) =>
                        this.setState({ password_confirmation })
                      }
                    />
                    <Text
                      style={{
                        color: "#F00",
                        fontSize: 20,
                        paddingRight: 10,
                        marginVertical: 5,
                        fontWeight: "700",
                        alignItems: "center",
                      }}
                    >
                      *
                    </Text>
                  </View>
                  {this.renderError("password_confirmation")}
                  <View style={{ paddingVertical: 30 }}>
                    <TouchableOpacity
                      onPress={() => this.submit()}
                      style={{
                        backgroundColor: "#49DD7B",
                        borderRadius: 35,
                        alignItems: "center",
                        height: 53,
                        marginHorizontal: 8,
                        justifyContent: "center",
                      }}
                    >
                      {/* {this.state.loading && (
                        <ActivityIndicator color={"#fff"} size="small" />
                      )} */}
                      {/* {!this.state.loading || */}
                      {/* (true && ( */}
                      <Text
                        style={{
                          fontSize: 20,
                          lineHeight: 24,
                          color: "#fff",
                          fontWeight: "bold",
                        }}
                      >
                        Créer un compte
                      </Text>
                      {/* ))} */}
                    </TouchableOpacity>
                  </View>

                  {this.renderSocialButtons()}

                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "center",
                      marginTop: 50,
                      marginBottom: 50,
                    }}
                  >
                    <Text style={{ color: "#827F7F" }}>Déjà inscrit ? </Text>
                    <TouchableOpacity
                      onPress={() => this.props.navigation.navigate("Login")}
                    >
                      <Text style={{ fontWeight: "bold", color: "#827F7F" }}>
                        Se connecter
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </KeyboardAwareScrollView>
          </View>
        </ScrollView>
      </View>
    );
  }

  renderModal() {
    return (
      <Popup onHide={() => this.setState({ isModalVisible: false })}>
        <TouchableOpacity
          onPress={() => this.setState({ isModalVisible: false })}
          style={{
            zIndex: 10,
            alignSelf: "flex-end",
            paddingRight: 20,
          }}
        >
          <MaterialIcons name="close" size={30} color={"#666666"} />
        </TouchableOpacity>
        <Text style={{ textAlign: "center", fontSize: 20 }}>
          Votre inscription est prise en compe !
        </Text>
        <TouchableOpacity
          style={{
            backgroundColor: "#2D9CDB",
            borderRadius: 10,
            width: 70,
            height: 53,
            marginTop: 20,
            alignSelf: "center",
          }}
          onPress={() => {
            this.setState({ isModalVisible: false });
            this.state.onFinish();
          }}
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
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  text: {
    marginEnd: 10,
    justifyContent: "center",
    flex: 1,
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
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: 30,
    marginTop: 20,
    borderRadius: 35,
    shadowColor: "#ccc",
    shadowOpacity: 0.5,
    elevation: 5,
    shadowRadius: 1,
    height: 50,
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
export default connect(null, { onLogin })(Inscription);
