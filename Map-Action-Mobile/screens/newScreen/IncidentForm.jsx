import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Dimensions,
  TextInput,
  TouchableWithoutFeedback,
  Alert,
  ImageBackground,
} from "react-native";
import SafeAreaView from "react-native-safe-area-view";

import RecordVideo from "../../shared/RecordVideo";
import { connect } from "react-redux";
import { create_incident } from "../../utils/http/incident";
import Validator from "../../utils/validator";
import { Input, Icon } from "react-native-elements";
import { ActivityIndicator } from "react-native-paper";
import { onAddIncident } from "../../redux/incidents/action";
import { MaterialIcons, Feather } from "@expo/vector-icons";
import HeaderLeft from "../../utils/HeaderLeft";
import Popup from "../../shared/Popup";
import { Audio } from "expo-av";
import { getCurrentCity, getLatLon } from "../../utils/location";
import * as ImagePicker from "expo-image-picker";
import { setIncident, setUser } from "../../utils/userStorage";
import { ScrollView } from "react-native-gesture-handler";
import MyVideoPlayer from "./MyVideoPlayer";
import { read_user } from "../../utils/http/user";
import { onLogin } from "../../redux/user/action";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AudioReader from "../../shared/AudioReader";
export const recordingOptions = {
  android: {
    extension: '.mp3',
    outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4,
    audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC,
    sampleRate: 44100,
    bitRate: 128000,
    numberOfChannels: 2,
    // ... autres options Android
  },
  ios: {
    extension: ".mp4",
    audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_MAX,
    sampleRate: 44100,
    numberOfChannels: 2,
    bitRate: 128000,
    outputFormat: Audio.RECORDING_OPTION_IOS_OUTPUT_FORMAT_MPEG4AAC,
    linearPCMBitDepth: 16,
    linearPCMIsBigEndian: false,
    linearPCMIsFloat: false,
  },
};
class IncidentForm extends Component {
  state = {
    zone: this.props.route?.params?.zone || "",
    title: this.props.route?.params?.title || "",
    description: this.props.route?.params?.description || "",
    photo: this.props.route.params?.photo || this.props.route.params?.image,
    errors: {},
    audio: this.props.route?.params?.audio || null,
    loading: false,
    video: this.props.route?.params?.video || "",
    askCategories: false,
    pourcent: null,
    playStatus: {},
    recordVideo: false,
    isModalVisible: false,
    status: {},
    lattitude: 0,
    audioProgress: new Animated.Value(0),
    longitude: 0,
  };
  Schema = Validator.object().shape({
    title: Validator.string().required().label("Titre"),
    zone: Validator.string().required().label("Zone"),
    description: Validator.string().label("Description"),
  });
  pickVideo = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,

        quality: 1,
      });
      if (!result.canceled) {
        this.setState({ video: result.uri });
      }
    } catch (E) {
      console.log(E);
    }
  };

  askAsync() {
    return new Promise((resolve) => {
      Alert.alert(
        "",
        "Vous n'êtes pas connecté voulez-vous continuer ?",
        [
          {
            text: "Ne pas se connecter",
            onPress: () => {
              this.props.navigation.replace("Login", {
                nextRoute: "IncidentForm",
                params: { ...this.state },
              });
              resolve(false);
            },
          },
          { text: "Oui continuer", onPress: () => resolve(true) },
        ],
        { cancelable: false }
      );
    });
  }

  submit = async () => {
    if (this.state.zone === "") {
      alert("nous n'avons pas encore déterminé votre position");
      await this.getCurrentCity();
    }
    if (this.state.status.isRecording) {
      await this.stopRecording();
    }
    if (this.props.token === null) {
      const ok = await this.askAsync();
      if (!ok) return;
    }
    const {
      errors: _,
      loading,
      audio,
      video,
      isModalVisible,
      playStatus,
      recordVideo,
      askCategories,
      pourcent,
      audioProgress,
      status,
      ...data
    } = this.state;
    if (loading) return;
    this.Schema.validate(data, { abortEarly: false })
      .then(async () => {
        this.setState({ errors: {} });
        if (this.props.token !== null) {
          data.user_id = this.props.user.id;
        }
        if (audio) {
          data.audio = audio;
        }
        if (video) {
          data.video = video;
        }

        this.setState({ data, askCategories: true });
      })
      .catch((ex) => {
        const errors = {};
        ex.inner.forEach((error) => {
          errors[error.path] = error.errors[0];
        });
        this.setState({ errors, loading: false });
      });
  };

  async create_incident(data) {
    this.setState({ loading: true });
    try {
      const res = await create_incident(data, this.uploadProgress);
      // if (this.props.token === null) {
      //   setIncident(res.id);
      // }
      this.props.onAddIncident({ ...res, user: this.props.user });
      this.setState({
        isModalVisible: true,
        onFinish: () => {
          this.props.navigation.replace("DetailIncident", {
            item: { ...res, user: this.props.user },
            add: true,
          });
        },
      });
      if (this.props.token) {
        const user = await read_user(this.props.user.id);
        await setUser({ token: this.props.token, user });
        this.props.onLogin({ token: this.props.token, user });
      }
    } catch (error) {
      console.log("error", error);
      if (error.message && error.message.includes("Network Error")) {
        Alert.alert("", "Échec de l'enregistrement de l'incident", [
          {
            text: "Réssayer",
            onPress: () => {
              this.setState({ pourcent: null });
              this.create_incident(this.state.data);
            },
          },
          { text: "Annuler", style: "cancel" },
        ]);
      } else {
        Alert.alert("", `Error: ${error.message}`);
        this.setState({ pourcent: null });
        if (error) {
          const errors = {};
          // Object.keys(error).map((field) => {
          //   const err = error[field];
          //   errors[field] = err[0];
          // });
          this.setState({ errors });
        }
      }
    }
    this.setState({ loading: false });
  }

  async componentDidMount() {
    await this.getCurrentCity();
  }
  uploadProgress = (pourcent) => {
    this.setState({ pourcent });
  };
  async getCurrentCity() {
    try {
      const zone = await getCurrentCity();
      this.setState({ zone });
      const { latitude: lattitude, longitude } = await getLatLon();
      this.setState({ lattitude, longitude });
    } catch (ex) {
      alert(ex);
    }
  }

  async recordAsync() {
    this.setState({ audio: null });
    const { status } = await Audio.requestPermissionsAsync();
    if (status === "granted") {
      const recording = new Audio.Recording();
      Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
        playThroughEarpieceAndroid: false,
        staysActiveInBackground: true,
      });
      this.recording = recording;
      const racordingUpdate = (status) => {
        console.log("B");
        this.setState({ status });
      };
      try {
        const status = await recording.prepareToRecordAsync(recordingOptions);
        if (status.canRecord) {
          recording.setOnRecordingStatusUpdate(racordingUpdate);
          await recording.startAsync();
        } else {
          Alert.alert("Enregistrement impossible");
        }

        // You are now recording!
      } catch (error) {
        console.log("Rc Error", error);
      }
    } else {
      Alert.alert("Permissions non accordées");
    }
  }

  async stopRecording() {
    try {
      const status = await this.recording.stopAndUnloadAsync();
      if (status.isDoneRecording) {
        this.setState({ audio: this.recording.getURI() });
      } else {
        Alert.alert("Erreur d'enregistrement");
      }
    } catch (ex) {
      console.log(ex);
    }
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
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
        {this.renderAskCategory()}
        <View style={styles.container}>
          {this.state.isModalVisible && this.renderModal()}
          {this.state.pourcent !== null &&
            this.state.pourcent != 100 &&
            this.renderUploadModal()}
          <ScrollView>
            <ImageBackground
              source={{ uri: this.state.photo }}
              style={{
                justifyContent: "space-around",
                height: 300,
                paddingTop: 5,
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <HeaderLeft colors="#FFF" />
                <Text
                  style={{
                    fontWeight: "bold",
                    fontSize: 18,
                    color: "#FFF",
                    marginLeft: 20,
                  }}
                >
                  Ajouter des détails
                </Text>
              </View>

              <View
                style={{
                  marginHorizontal: 10,
                  flexDirection: "row",
                  alignItems: "flex-end",
                  justifyContent: "space-around",
                  flex: 1,
                  paddingBottom: 20,
                }}
              >
                <View style={{ flexDirection: "row", flex: 1 }}>
                  <MaterialIcons name="location-on" color={"#fff"} size={20} />
                  <Text
                    style={{
                      fontWeight: "bold",
                      color: "#fff",
                      marginStart: 6,
                    }}
                  >
                    {this.state.zone}
                  </Text>
                </View>
                <View style={{}}>
                  <Text
                    style={{
                      fontSize: 14,
                      textAlign: "center",
                      fontWeight: "bold",
                      color: "#fff",
                    }}
                  >
                    {this.state.title}
                  </Text>
                </View>
              </View>
            </ImageBackground>
            <View style={{ ...styles.section }}>
              <TextInput
                style={{ marginLeft: 20, width: "100%" }}
                placeholder="Titre"
                value={this.state.title}
                placeholderTextColor="rgba(74, 72, 72, 0.83)"
                onChangeText={(title) => this.setState({ title })}
              />
            </View>
            {this.renderError("title")}
            {this.renderError("zone")}

            <View style={styles.section}>
              {!this.state.status.isRecording && (
                <Text>Ajouter un commentaire</Text>
              )}
              {this.state.status.isRecording && (
                <Text>
                  {Math.round(this.state.status.durationMillis / 1000)}
                </Text>
              )}
              <TouchableOpacity
                style={{ marginLeft: "auto" }}
                onPress={() => {
                  this.setState({ audio: null });
                  this.state.status.isRecording
                    ? this.stopRecording()
                    : this.recordAsync();
                }}
              >
                {!this.state.status.isRecording && (
                  <MaterialIcons name="mic-none" color={"#2D9CDB"} size={30} />
                )}
                {this.state.status.isRecording && (
                  <View>
                    <MaterialCommunityIcons
                      name="stop-circle-outline"
                      size={45}
                      color="#49DD7B"
                    />
                  </View>
                )}
              </TouchableOpacity>
            </View>
            {!this.state.status.isRecording && this.state.audio !== null && (
              <AudioReader url={this.state.audio} />
            )}
            <TouchableWithoutFeedback
              onPress={() => this.setState({ recordVideo: true })}
            >
              <View
                style={{ ...styles.section, justifyContent: "space-between" }}
              >
                <Text>Joindre une vidéo</Text>
                <Feather name="video" color="#2D9CDB" size={20} />
              </View>
            </TouchableWithoutFeedback>
            {this.state.video !== "" && (
              <View style={{ paddingHorizontal: 10, marginTop: 10 }}>
                <MyVideoPlayer localVideo={this.state.video} />
              </View>
            )}
            <View>
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
                placeholder="Description"
                leftIconContainerStyle={{ alignItems: "flex-start" }}
                labelStyle={{
                  fontSize: 14,
                  color: "#8E8E8E",
                  marginTop: 10,
                }}
                errorMessage={null}
                onChangeText={(description) => this.setState({ description })}
                value={this.state.description}
                placeholderTextColor="#8E8E8E"
              />
            </View>
            {this.renderError("description")}
            <View style={{ marginTop: 80 }}>
              <TouchableOpacity
                onPress={() => this.submit()}
                style={{
                  flexDirection: "row",
                  backgroundColor: "#49DD7B",
                  marginTop: 20,
                  borderRadius: 100,
                  alignItems: "center",
                  height: 50,
                  justifyContent: "center",
                  marginHorizontal: 20,
                }}
              >
                {this.state.loading && (
                  <ActivityIndicator size="small" color="#FFF" />
                )}
                {this.state.loading === false && (
                  <>
                    <Text
                      style={{
                        fontSize: 20,
                        lineHeight: 24,
                        color: "#fff",
                        marginRight: 10,
                        fontWeight: "bold",
                      }}
                    >
                      ENVOYER
                    </Text>
                    <MaterialIcons name="send" color={"#fff"} size={30} />
                  </>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
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
  onHideAskCategory(flag) {
    this.setState({ askCategories: false });
    if (flag) {
      this.props.navigation.push("Categories", {
        done: (category) => {
          const data = this.state.data;
          data.category_id = category.id;
          this.create_incident(data);
        },
      });
    } else {
      this.create_incident(this.state.data);
    }
  }
  renderAskCategory() {
    if (this.state.askCategories) {
      return (
        <Popup onHide={() => this.onHideAskCategory(false)}>
          <TouchableOpacity
            style={{ alignSelf: "flex-end" }}
            onPress={() => this.onHideAskCategory(false)}
          >
            <Icon type="MaterialIcons" name="close" color="black" size={20} />
          </TouchableOpacity>
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontWeight: "bold",
                marginBottom: 40,
                color: "#757474",
                textAlign: "center",
              }}
            >
              Souhaitez-vous classer l’incident dans une catégorie
            </Text>
            <View
              style={{
                marginTop: 10,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <TouchableOpacity
                onPress={() => this.onHideAskCategory(true)}
                style={{
                  backgroundColor: "#2D9CDB",
                  borderRadius: 5,
                  paddingHorizontal: 15,
                  marginHorizontal: 10,
                  alignItems: "center",
                  height: 35,
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    color: "#fff",
                    fontWeight: "bold",
                  }}
                >
                  OUI
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.onHideAskCategory(false)}
                style={{
                  backgroundColor: "#F82F2F",
                  borderRadius: 5,
                  paddingHorizontal: 15,
                  marginHorizontal: 10,
                  alignItems: "center",
                  height: 35,
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    color: "#fff",
                    fontWeight: "bold",
                  }}
                >
                  NON
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Popup>
      );
    }
    return null;
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
          Vous avez reporté un problème avec succès.
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
  renderUploadModal() {
    return (
      <Popup onHide={() => null}>
        <Text style={{ textAlign: "center", fontSize: 20 }}>
          Création d'incident en cours...
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
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingBottom: 20,
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
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
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
  user: user.user || {},
});

export default connect(mapState, { onAddIncident, onLogin })(IncidentForm);
