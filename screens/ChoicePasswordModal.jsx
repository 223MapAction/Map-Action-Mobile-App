import { Modal, View, Dimensions, TouchableOpacity, Text } from "react-native";
import { Button, Icon, Input as TextInput } from "react-native-elements";

import yup from "../utils/validator";

import React, { Component } from "react";
const width = Dimensions.get("window").width;
export default class ChoicePasswordModal extends Component {
  Schema = yup.object().shape({
    password: yup.string().min(5).label("Mot De Passe"),
  });
  state = {
    password: "",
    password_confirmation: "",
    loading: false,
    showPassword: false,
    errors: {},
    visible: true,
  };

  submit = () => {
    if (this.state.loading) return;
    this.setState({ loading: true });
    const { password, password_confirmation } = this.state;
    this.Schema.validate({ password }, { abortEarly: false })
      .then(async () => {
        if (password !== password_confirmation) {
          this.setState({
            errors: { password: "les mots de passe ne sont pas les memes" },
          });
          return;
        }
        this.setState({ errors: {} });

        try {
          this.props.onDone(password);
          this.props.onHide();
        } catch (e) {
          this.setState({ loading: false });
          console.log("error", e);
        }
      })
      .catch((ex) => {
        const errors = {};
        ex.inner.forEach((error) => {
          errors[error.path] = error.errors[0];
        });
        this.setState({ errors, loading: false });
      });
  };
  componentDidUpdate(nextState) {
    if (!this.state.visible) {
      this.props.onHide();
    }
  }
  renderIcon() {
    const { showPassword } = this.state;
    let icon = "eye";
    if (showPassword) {
      icon = "eye-with-line";
    }
    return {
      type: "entypo",
      name: icon,
      onPress: () => this.setState({ showPassword: !showPassword }),
    };
  }

  render() {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.state.visible}
        onRequestClose={() => {
          this.setState({ visible: false });
        }}
      >
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(0,0,0,.5)",
          }}
        >
          <View
            style={[
              {
                backgroundColor: "#FFF",
                width: width * 0.9,
                justifyContent: "center",
                alignItems: "center",
              },
            ]}
          >
            <TouchableOpacity
              style={{ alignSelf: "flex-end", marginRight: 10, marginTop: 10 }}
              onPress={() => this.setState({ visible: false })}
            >
              <Icon
                type="entypo"
                name="squared-cross"
                color="black"
                size={20}
              />
            </TouchableOpacity>
            {this.renderInput("password", "mot de passe", {
              secureTextEntry: true,
            })}
            {this.renderInput("password_confirmation", "Confirmation", {
              secureTextEntry: true,
            })}
            <View style={{ flexDirection: "row", paddingBottom: 40 }}>
              <Button
                title={"Modifier"}
                onPress={this.submit}
                loading={this.state.loading}
                buttonStyle={{
                  backgroundColor: "#083451",
                  height: 55,
                  marginTop: 30,
                  width: "75%",
                  alignItems: "center",
                  alignSelf: "center",
                }}
                titleStyle={{
                  color: "white",
                  fontWeight: "bold",
                  fontSize: 15,
                }}
              />
            </View>
          </View>
        </View>
      </Modal>
    );
  }
  renderInput(name, label, options = {}) {
    const error = this.state.errors[name];
    if (this.state.showPassword) {
      delete options.secureTextEntry;
    }
    return (
      <View>
        <TextInput
          {...options}
          placeholderTextColor="grey"
          inputContainerStyle={{ width: width * 0.8 }}
          inputStyle={{
            height: 50,
            color: "grey",
            borderWidth: 0,
            padding: 15,
            marginTop: 10,
            width: width * 0.8,
          }}
          placeholder={label}
          onChangeText={(value) => this.setState({ [name]: value })}
          rightIcon={this.renderIcon()}
          value={this.state[name]}
        />
        {error && (
          <Text
            style={{
              fontSize: 12,
              color: "#F00",
              marginTop: 5,
              marginLeft: 15,
            }}
          >
            {error}
          </Text>
        )}
      </View>
    );
  }
}
