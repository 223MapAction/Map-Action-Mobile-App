import React, { Component } from "react";
import { View, ScrollView, Alert } from "react-native";
import { Input, CheckBox, Button } from "react-native-elements";
import { connect } from "react-redux";
import { Icon } from "react-native-elements";
import { create_contact } from "../../utils/http/contact";
import Validator from "../../utils/validator";
import SafeAreaView from "react-native-safe-area-view";

class Contact extends Component {
  state = {
    email: this.props.token ? this.props.user.email : "",
    objet: "",
    message: "",
    mail_me: false,
    loading: false,
    errors: {},
  };
  Schema = Validator.object().shape({
    email: Validator.string().email().required().label("Adresse Mail"),
    objet: Validator.string().min(3).required().max(50).label("Objet"),
    message: Validator.string().min(10).required().max(255).label("Message"),
  });

  submit = async () => {
    const { errors: _, loading, mail_me, ...data } = this.state;

    if (loading) return;

    this.Schema.validate(data, { abortEarly: false })
      .then(async () => {
        this.setState({ errors: {} });
        await this.create_contact(data);
      })
      .catch((ex) => {
        const errors = {};
        ex.inner.forEach((error) => {
          errors[error.path] = error.errors[0];
        });
        this.setState({ errors });
      });
  };
  async create_contact(data) {
    this.setState({ loading: true });
    try {
      const res = await create_contact(data);
      console.log(res);
      Alert.alert("Confirmation", "Votre message à bien été envoyé");
      this.setState({
        loading: false,
        objet: "",
        message: "",
        email: this.props.token ? this.props.user.email : "",
        mail_me: false,
      });
    } catch ({ error }) {
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
  render() {
    return (
      <View style={{ flex: 1 }}>
        <ScrollView
          style={{
            paddingHorizontal: 10,
            marginBottom: 10,
            backgroundColor: "#fff",
          }}
        >
          {this.renderInput("objet", "Objet")}
          {this.props.token === null && this.renderInput("email", "Email")}
          <Input
            inputStyle={{
              color: "#8E8E8E",
              paddingHorizontal: 5,
              paddingVertical: 5,

              fontSize: 14,
              height: 140,
              textAlignVertical: "top",
            }}
            multiline
            inputContainerStyle={{
              width: "100%",
              borderWidth: 1,
              borderColor: "#B9B9B9",
              marginVertical: 10,
              paddingHorizontal: 15,
            }}
            label={"Message"}
            leftIconContainerStyle={{ alignItems: "flex-start" }}
            labelStyle={{
              fontSize: 14,
              color: "#8E8E8E",
              marginTop: 10,
            }}
            errorMessage={this.state.errors.message}
            onChangeText={(message) => this.setState({ message })}
            value={this.state.message}
            placeholderTextColor="#8E8E8E"
          />
          {this.renderCheckbox(
            "mail_me",
            "Recevoir une copie du mail",
            (value) => this.setState({ mail_me: value })
          )}
          <DoneButton onPress={this.submit} loading={this.state.loading} />
        </ScrollView>
      </View>
    );
  }
  renderCheckbox(name, label, onChange) {
    const value = this.state[name];

    return (
      <CheckBox
        checkedIcon={
          <Icon
            name="check-box"
            size={25}
            color="#49DD7B"
            type="material-icon"
          />
        }
        uncheckedIcon={
          <Icon
            name="check-box-outline-blank"
            size={25}
            color="#49DD7B"
            type="material-icon"
          />
        }
        containerStyle={{
          backgroundColor: "transparent",
          borderWidth: 0,
          alignSelf: "flex-start",
        }}
        title={label}
        titleProps={{
          style: {
            backgroundColor: "transparent",
            color: "#8E8E8E",
            fontSize: 14,
            marginLeft: 10,
          },
        }}
        textStyle={{ color: "#8E8E8E" }}
        onPress={() => onChange(!value)}
        checked={this.state[name]}
      />
    );
  }
  renderInput(name, label, options = {}) {
    return (
      <Input
        inputStyle={{
          color: "#8E8E8E",
          paddingHorizontal: 10,
          fontSize: 14,
        }}
        {...options}
        errorMessage={this.state.errors[name]}
        errorStyle={{ color: "#F00" }}
        inputContainerStyle={{
          width: "100%",
          borderWidth: 1,
          borderColor: "#B9B9B9",
          marginVertical: 10,
          paddingHorizontal: 15,
        }}
        label={label}
        leftIconContainerStyle={{ alignItems: "flex-start" }}
        labelStyle={{
          fontSize: 14,
          color: "#8E8E8E",
          marginTop: 10,
        }}
        onChangeText={(objet) => this.setState({ [name]: objet })}
        value={this.state[name]}
        placeholderTextColor="#8E8E8E"
      />
    );
  }
}

const mapState = ({ user }) => ({
  token: user?.token || null,
  user: user?.user,
});
export default connect(mapState, null)(Contact);

export function DoneButton({
  title = "Envoyer",
  onPress,
  backgroundColor,
  ...rest
}) {
  return (
    <Button
      {...rest}
      title={title}
      buttonStyle={{
        backgroundColor: backgroundColor || "#49DD7B",
        height: 50,
        marginVertical: 15,
        width: "100%",
        alignItems: "center",
        alignSelf: "center",
        borderRadius: 5,
      }}
      titleStyle={{
        color: "white",
        fontWeight: "700",
        letterSpacing: 2,
        fontSize: 20,
      }}
      onPress={() => {
        onPress();
      }}
    />
  );
}
