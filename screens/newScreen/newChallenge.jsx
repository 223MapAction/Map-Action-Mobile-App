import React, { Component } from "react";
import Popup from "../../shared/Popup";

import moment from "moment";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  TouchableWithoutFeedback,
  TextInput,
  Alert,
} from "react-native";
import {
  MaterialIcons,
  MaterialCommunityIcons,
  Feather,
} from "@expo/vector-icons";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { connect } from "react-redux";
import { create_challenge } from "../../utils/http/challenge";
import * as ImagePicker from "expo-image-picker";

import Validator from "../../utils/validator";
import { Input } from "react-native-elements";
import DateTimePicker2 from "../../shared/DateTimePicker";
import pickImage from "../../utils/image";
import { ActivityIndicator } from "react-native-paper";
import { onAddChallenge } from "../../redux/challenges/action";
import { getCurrentCity } from "../../utils/location";
import RecordVideo from "../../shared/RecordVideo";
import MyVideoPlayer from "./MyVideoPlayer";
import { read_user } from "../../utils/http/user";
import { onLogin } from "../../redux/user/action";
import { setUser } from "../../utils/userStorage";
import { GooglePlaceModal } from "../../shared/GooglePlace";
import {MapboxPlaceModal} from "../../shared/MapPlace"
class NewChallenge extends Component {
  state = {
    zone: "",
    description: "",
    date: moment(),
    photo: "",
    title: "",
    lieu: "",
    isModalVisible: false,
    video: "",
    datePicker: false,
    showPlace: false,
    recordVideo: false,
    pourcent: null,
    errors: {},
    loading: false,
  };
  uploadProgress = (pourcent) => {
    this.setState({ pourcent });
  };
  Schema = Validator.object().shape({
    title: Validator.string().required().label("Titre"),
    zone: Validator.string().required().label("Zone"),
    lieu: Validator.string().required().label("Lieu"),
    description: Validator.string().min(10).required().label("Description"),
  });

  submit = async () => {
    if (this.props.token === null) {
      Alert.alert(
        "Information",
        "Veuillez vous connecter pour continuer",
        [
          {
            text: "Ok",
            onPress: () =>
              this.props.navigation.push("Login", {
                nextRoute: "NewChallenge",
              }),
          },
        ],
        { cancelable: false }
      );
    }
    const {
      errors: _,
      loading,
      photo,
      datePicker,
      pourcent,
      recordVideo,
      isModalVisible,
      video,
      date,
      ...data
    } = this.state;
    if (loading) return;
    this.setState({ loading: true });
    this.Schema.validate(data, { abortEarly: false })
      .then(async () => {
        this.setState({ errors: {} });
        if (photo !== "") data.photo = photo;
        if (video !== "") data.video = video;
        data.user_id = this.props.user.id;
        data.date = moment(date).format("YYYY[-]MM[-]DD [00:00:00]");

        await this.create_challenge(data);
      })
      .catch((ex) => {
        const errors = {};
        ex.inner.forEach((error) => {
          errors[error.path] = error.errors[0];
        });
        this.setState({ errors });
      });
    this.setState({ loading: false });
  };
  async create_challenge(data) {
    this.setState({ loading: true });
    try {
      const res = await create_challenge(data, this.uploadProgress);
      const item = {
        ...res,
        user: this.props.user,
        participates: [],
      };
      this.props.onAddChallenge(item);
      this.setState({
        isModalVisible: true,
        onFinish: () => {
          this.props.navigation.replace("DetailChallenge", { item });
        },
      });
      if (this.props.token) {
        const user = await read_user(this.props.user.id);
        await setUser({ token: this.props.token, user });
        this.props.onLogin({ token: this.props.token, user });
        console.log({ token: this.props.token, user });
      }
    } catch (error) {
      console.log("error", error);
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
  pickVideo = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: false,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.cancelled) {
        this.setState({ video: result.uri });
      }
    } catch (E) {
      console.log(E);
    }
  };

  async pickImage() {
    const { uri } = await pickImage();
    if (uri) {
      this.setState({ photo: uri });
    }
  }

  render() {
    return (
      <View style={styles.container}>
        {this.state.recordVideo && (
          <RecordVideo
            onFinish={(video) => {
              this.setState({ video: "" });
              this.setState({ video, recordVideo: false });
            }}
            onHide={() => this.setState({ recordVideo: false })}
            visible={this.state.recordVideo}
          />
        )}
        {this.state.isModalVisible && this.renderModal()}
        {this.state.pourcent !== null &&
          this.state.pourcent != 100 &&
          this.renderUploadModal()}
        {this.state.datePicker && (
          <DateTimePicker2
            onHide={() => this.setState({ datePicker: false })}
            onChange={(date) =>
              this.setState({
                date: moment(date),
                datePicker: false,
              })
            }
          />
        )}

        <KeyboardAwareScrollView
          keyboardShouldPersistTaps="always"
          style={{ paddingTop: 15, paddingBottom: 30 }}
        >
          <View style={{ ...styles.section }}>
            <TextInput
              style={{
                width: "90%",
                backgroundColor: "transparant",
                marginLeft: 20,
              }}
              placeholder="Titre"
              value={this.state.title}
              placeholderTextColor="rgba(74, 72, 72, 0.83)"
              onChangeText={(title) => this.setState({ title })}
            />
          </View>
          {this.renderError("title")}
          <LieuInput
            label="Lieu"
            error={this.state.errors.lieu}
            onChange={(data) => {
              this.setState({ ...data });
            }}
            value={this.state.lieu}
          />

          {this.renderError("lieu")}
          <TouchableWithoutFeedback
            onPress={() => this.setState({ datePicker: true })}
          >
            <View style={{ ...styles.section }}>
              <MaterialCommunityIcons
                name="calendar"
                color={"#2D9CDB"}
                size={20}
                style={{ marginRight: 20 }}
              />
              <Text>{this.state.date.format("L")}</Text>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={() => this.pickImage()}>
            <View
              style={{ ...styles.section, justifyContent: "space-between" }}
            >
              {this.state.photo !== "" && (
                <Text
                  style={{ marginLeft: 20, width: "90%" }}
                  numberOfLines={1}
                >
                  {this.state.photo}
                </Text>
              )}
              {this.state.photo === "" && (
                <Text style={{ marginLeft: 20 }}>Joindre une photo</Text>
              )}
              <MaterialIcons name="file-upload" color={"#2D9CDB"} size={20} />
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            onPress={() => this.setState({ recordVideo: true })}
          >
            <View
              style={{ ...styles.section, justifyContent: "space-between" }}
            >
              <Text style={{ marginLeft: 20 }}>Joindre une vidéo</Text>

              <Feather name="video" color="#2D9CDB" size={20} />
            </View>
          </TouchableWithoutFeedback>
          {this.state.video !== "" && (
            <View style={{ paddingHorizontal: 10, marginTop: 10 }}>
              <MyVideoPlayer localVideo={this.state.video} />
            </View>
          )}
          <View style={styles.section}>
            <Input
              inputStyle={{
                color: "#8E8E8E",
                paddingVertical: 5,
                fontSize: 14,
                height: 140,
                textAlignVertical: "top",
              }}
              multiline
              inputContainerStyle={{
                width: "100%",
                borderBottomWidth: 0,
              }}
              placeholder="Description"
              leftIconContainerStyle={{ alignItems: "flex-start" }}
              errorMessage={null}
              onChangeText={(description) => this.setState({ description })}
              value={this.state.description}
              placeholderTextColor="rgba(74, 72, 72, 0.83)"
            />
          </View>
          {this.renderError("description")}
          <View style={{ marginTop: 20, marginBottom: 30 }}>
            <TouchableOpacity
              onPress={() => this.submit()}
              style={{
                backgroundColor: "#49DD7B",
                borderRadius: 35,
                alignItems: "center",
                height: 50,
                justifyContent: "center",
                marginHorizontal: 10,
              }}
            >
              {this.state.loading && (
                <ActivityIndicator size="large" color="#FFF" />
              )}
              {this.state.loading === false && (
                <Text
                  style={{
                    fontSize: 20,
                    lineHeight: 24,
                    color: "#fff",
                    fontWeight: "bold",
                  }}
                >
                  TERMINER
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAwareScrollView>
      </View>
    );
  }
  renderModal() {
    return (
      <Popup
        onHide={() => {
          this.setState({ isModalVisible: false });
          this.state.onFinish();
        }}
      >
        <Text style={{ textAlign: "center", fontSize: 20 }}>
          Vous avez créer un évenement avec succès.
        </Text>
        <TouchableOpacity
          style={{
            backgroundColor: "#2D9CDB",
            borderRadius: 10,
            width: 200,
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
  renderUploadModal() {
    return (
      <Popup onHide={() => null}>
        <Text style={{ textAlign: "center", fontSize: 20 }}>
          Création d'évenement en cours...
        </Text>
        <TouchableOpacity
          style={{
            backgroundColor: "#2D9CDB",
            borderRadius: 10,
            width: 200,
            height: 53,
            marginTop: 20,
            alignSelf: "center",
          }}
          onPress={() => this.setState({ isModalVisible: false })}
        >
          <Text
            style={{
              textAlign: "center",
              color: "#fff",
              fontSize: 20,
              marginTop: 10,
            }}
          >
            {this.state.pourcent}%
          </Text>
        </TouchableOpacity>
      </Popup>
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
}

export function LieuInput({
  label,
  value,
  onChange,
  error,
  containerStyle,
  iconColor = "#2D9CDB",
}) {
  const [show, setShow] = React.useState(false);
  return (
    <React.Fragment>
      {/* <GooglePlaceModal
        onChange={({ adresse, latitude, longitude, ville }) => {
          console.log("change", adresse);
          onChange({
            latitude,
            lieu: adresse,
            longitude,
            zone: ville,
          });
          setShow(false);
        }}
        onHide={() => setShow(false)}
        value={value}
        visible={show}
      /> */}
      <MapboxPlaceModal
        onChange={({ adresse, latitude, longitude, ville }) => {
          console.log("change", adresse);
          onChange({
            latitude,
            lieu: adresse,
            longitude,
            zone: ville,
          });
          setShow(false);
        }}
        onHide={() => setShow(false)}
        value={value}
        visible={show}
      />
      <TouchableWithoutFeedback onPress={() => setShow(true)}>
        <View style={containerStyle ? containerStyle : { ...styles.section }}>
          <MaterialIcons
            style={{ marginRight: 20 }}
            name="place"
            color={iconColor}
            size={20}
          />
          <Text>{value || label}</Text>
        </View>
      </TouchableWithoutFeedback>
      {!!error && (
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
      )}
    </React.Fragment>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    backgroundColor: "#fff",
    marginTop: 14,
    minHeight: 60,
    borderColor: "#ccc",
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    overflow: "hidden",
    shadowColor: "#ccc",
    shadowOpacity: 0.5,
    shadowRadius: 1,
    elevation: 2,
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
const mapState = ({ user }) => ({
  token: user.token ? user.token : null,
  user: user.user,
});

export default connect(mapState, { onAddChallenge, onLogin })(NewChallenge);
