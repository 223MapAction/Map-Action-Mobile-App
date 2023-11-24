import React, { Component } from "react";
import { View, ScrollView, Alert, Text } from "react-native";
import { Input, Card, Avatar } from "react-native-elements";
import { connect } from "react-redux";
import {
  create_message,
  list_messages,
  responsebymessage,
} from "../utils/http/message";
import Validator from "../utils/validator";
import { DoneButton } from "./newScreen/Contact";
import { FlatList } from "react-native-gesture-handler";
import { ActivityIndicator } from "react-native-paper";
import moment from "moment";
import { getBadge, has_access } from "../utils/location";
import Constants from "../utils/constants";

import _ from "lodash";
import { onGetCommunaute } from "../redux/communautes/action";
import { list_communaute } from "../utils/http/communaute";
import { getImage } from "../utils/http/http";
class Contact extends Component {
  state = {
    objet: "",
    message: "",
    loading: false,
    messages: [],
    errors: {},
    zone: {},
    elus: [],
    messageLoading: false,
  };
  Schema = Validator.object().shape({
    objet: Validator.string().min(3).required().max(50).label("Objet"),
    message: Validator.string().min(10).required().max(255).label("Message"),
  });
  async componentDidMount() {
    this.setState({
      elus: this.props.users.filter((u) => u.user_type === Constants.roles.elu),
    });
    let zone = this.props.route.params.item;
    this.setState({ messageLoading: true, zone });
    const { user } = this.props;
    try {
      const myMessages = _.orderBy(
        (await list_messages(user.id))
          .filter((m) => m.zone === zone.id)
          .map((m) => {
            m.order = moment(m.created_at).toDate().getTime();
            return m;
          }),
        ["order"],
        ["desc"]
      );
      for (let m of myMessages) {
        m.responses = await responsebymessage(m.id);
        for (let r of m.responses) {
          r.userElu = {};
          for (let u of this.state.elus) {
            if (r.elu === u.id) {
              r.userElu = u;
            }
          }
        }
      }
      console.log(myMessages);
      this.setState({
        messages: myMessages,
        messageLoading: false,
      });
    } catch (ex) {
      Alert.alert("", "Imposible de réçcupérer la liste des messages");
    }
  }

  submit = async () => {
    const { objet, message } = this.state;
    let data = { objet, message };
    this.Schema.validate(data, { abortEarly: false })
      .then(async () => {
        this.setState({ errors: {} });
        await this.create_message(data);
      })
      .catch((ex) => {
        const errors = {};
        ex.inner.forEach((error) => {
          errors[error.path] = error.errors[0];
        });
        console.log(errors);
        this.setState({ errors });
      });
  };
  async create_message(data) {
    data.zone = this.state.zone.id;
    data.user_id = this.props.user.id;

    this.setState({ loading: true });
    try {
      const res = await create_message(data);
      const messages = [res, ...this.state.messages];
      this.setState({ messages });
      Alert.alert("", "Votre message à bien été envoyé");
      this.setState({
        loading: false,
        objet: "",
        message: "",
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
    const incidents = this.props.incidents.filter(
      (i) => i.user_id === this.props.user.id
    );
    const badge = getBadge(incidents.length);
    const hasAccess = has_access(badge, Constants.permissions.discussion);
    if (!this.props.user?.id) return this.renderVide();
    if (!hasAccess) return this.renderVide();
    const { zone } = this.state;
    return (
      <ScrollView
        style={{
          paddingHorizontal: 10,
          marginBottom: 10,
          backgroundColor: "#fff",
        }}
      >
        <View
          style={{ marginVertical: 5, flexDirection: "row", marginLeft: 10 }}
        >
          <Text style={{ fontSize: 16 }}>
            Envoyer un message aux autorités de la zone de {zone?.name}
          </Text>
        </View>

        {this.renderInput("objet", "Objet")}
        <Input
          inputStyle={{
            color: "#8E8E8E",
            paddingHorizontal: 5,
            paddingVertical: 5,
            fontSize: 12,
            height: 80,
            textAlignVertical: "top",
          }}
          placeholder={"Message"}
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

        <View style={{ paddingHorizontal: 10 }}>
          <DoneButton
            onPress={this.submit}
            loading={this.state.loading}
            disabled={this.state.loading}
          />
        </View>

        <View style={{ marginVertical: 5, paddingHorizontal: 15 }}>
          {this.state.messages.length === 0 && (
            <View style={{ alignItems: "center", justifyContent: "center" }}>
              {this.state.messageLoading && (
                <ActivityIndicator color={"#49DD7B"} size="small" />
              )}
              {!this.state.messageLoading && (
                <Text style={{ color: "#B9B9B9" }}>aucun messages</Text>
              )}
            </View>
          )}
          {this.state.messages.map((item) => {
            return (
              <Card
                key={item.id}
                containerStyle={{
                  borderRadius: 10,
                  marginBottom: 10,
                  padding: 10,
                  margin: 0,
                  borderWidth: 0,
                }}
              >
                <Text
                  style={{
                    color: "#000",
                    fontSize: 10,
                  }}
                >
                  {moment(item.created_at).format("DD/MM/YYYY")}
                </Text>
                <Text
                  style={{
                    fontWeight: "bold",
                    color: "#000",
                    fontSize: 16,
                  }}
                >
                  {item.objet}
                </Text>
                <Text
                  multiline
                  style={{
                    fontSize: 14,
                    color: "rgba(0,0,0,.6)",
                    marginVertical: 5,
                  }}
                >
                  {item.message}
                </Text>
                <View style={{ width: "95%", alignSelf: "flex-end" }}>
                  {item.responses?.map((r) => {
                    return (
                      <Card
                        key={r.id}
                        containerStyle={{
                          marginVertical: 10,
                          borderWidth: 0,
                          borderRadius: 10,
                          padding: 10,
                          margin: 0,
                        }}
                      >
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                          }}
                        >
                          <Avatar
                            rounded
                            size={35}
                            containerStyle={{ marginRight: 10 }}
                            source={getImage(r.userElu.avatar, "f")}
                          />
                          <Text
                            style={{ flex: 1 }}
                            numberOfLines={2}
                          >{`${r.userElu.first_name} ${r.userElu.last_name}`}</Text>
                        </View>
                        <Text
                          multiline
                          style={{
                            fontSize: 14,
                            color: "rgba(0,0,0,.6)",
                            marginVertical: 5,
                          }}
                        >
                          {r.response}
                        </Text>
                        <Text
                          style={{
                            color: "#000",
                            fontSize: 10,
                          }}
                        >
                          {moment(r.created_at).format("DD/MM/YYYY")}
                        </Text>
                      </Card>
                    );
                  })}
                </View>
              </Card>
            );
          })}
        </View>
      </ScrollView>
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
        placeholder={name}
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
  renderVide() {
    return (
      <View style={{ alignItems: "center", justifyContent: "center", flex: 1 }}>
        <Text
          style={{
            color: "#2d9cdb",
            fontSize: 18,
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          Votre statut ne vous permet pas de communiquer.
        </Text>
      </View>
    );
  }
}

const mapState = ({ user, communautes, incidents }) => ({
  token: user?.token || null,
  user: user?.user,
  users: user.users,
  communautes,
  incidents,
});
export default connect(mapState, { onGetCommunaute })(Contact);
