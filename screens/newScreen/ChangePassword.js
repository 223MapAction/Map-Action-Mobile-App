import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Text,
  Alert,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import SafeAreaView from "react-native-safe-area-view";

import { Avatar } from "react-native-elements";
import validator from "../../utils/validator";
import { connect } from "react-redux";

import { MaterialIcons } from "@expo/vector-icons";
import { update_user } from "../../utils/http/user";

export default class Account extends Component {
  state = {
    password: "",
    password1: "",
    loading: false,
    errors: {},
  };

  Schema = validator.object().shape({
    password: validator
      .string()
      .min(5)
      .required()
      .label("Nouveau mot de passe"),
    password1: validator
      .string()
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

  submit = async () => {
    const { errors: _, loading, showModal, photo, ...data } = this.state;
    if (loading) return;
    this.Schema.validate(data, { abortEarly: false })
      .then(async () => {
        this.setState({ errors: {} });
        await this.update_user({ password: data.password });
      })
      .catch((ex) => {
        const errors = {};
        ex.inner.forEach((error) => {
          errors[error.path] = error.errors[0];
        });
        this.setState({ errors });
      });
  };
  async update_user(data) {
    this.setState({ loading: true });
    try {
      await update_user(this.props.route.params.user.id, data);
      Alert.alert("", "données modifiées");
      this.props.navigation.goBack();
    } catch (error) {
      if (error) {
        const errors = {};
        Object.keys(error).map((field) => {
          const err = error[field];
          errors[field] = err[0];
        });
        this.setState({ errors });
      }
    }
    this.setState({ loading: false });
  }
  renderInput(name, label, icon = "person", options = {}) {
    const error = this.state.errors[name];
    return (
      <>
        <View style={styles.section}>
          <MaterialIcons name={icon} color={"#666666"} size={20} />
          <TextInput
            style={{
              width: "90%",
              paddingLeft: 10,
            }}
            {...options}
            value={this.state[name]}
            placeholder={label}
            placeholderTextColor="#888787"
            keyboardType="default"
            onChangeText={(first_name) => this.setState({ [name]: first_name })}
          />
        </View>
        {error && (
          <Text
            style={{
              color: "#F00",
              marginBottom: 5,
              marginLeft: 20,
              fontSize: 12,
            }}
          >
            {error}
          </Text>
        )}
      </>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ marginBottom: 20 }}
        >
          <View style={styles.container}>
            <View style={styles.center}>
              {this.renderInput("password", "Nouveau mot de passe")}
              {this.renderInput("password1", "Confirmer mot de passe")}
              <View style={{ marginTop: 30 }}>
                <TouchableOpacity
                  onPress={() => this.submit()}
                  style={{
                    backgroundColor: "#49DD7B",
                    borderRadius: 35,
                    alignItems: "center",
                    height: 50,
                    justifyContent: "center",
                  }}
                >
                  {this.state.loading && (
                    <ActivityIndicator color={"#fff"} size="small" />
                  )}
                  {!this.state.loading && (
                    <Text
                      style={{
                        fontSize: 20,
                        lineHeight: 24,
                        color: "#fff",
                        fontWeight: "bold",
                      }}
                    >
                      Modifier
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    paddingTop: 15,
    flex: 1,
    backgroundColor: "#fff",
  },
  center: {
    flex: 1,
    //alignItems: 'center',
    marginTop: 15,
    padding: 15,
    // justifyContent: 'center',
  },
  text: {
    color: "rgba(0,0,0,.5)",
    alignSelf: "center",
    fontSize: 18,
    paddingTop: 20,
    fontWeight: "bold",
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
