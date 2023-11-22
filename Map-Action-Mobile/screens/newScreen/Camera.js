import React, { Component } from "react";
import {
  Alert,
  Dimensions,
  Platform,
  TouchableOpacity,
  View,
} from "react-native";
import Camera from "../../shared/Camera";
import * as ImagePicker from "expo-image-picker";
import Constants from "expo-constants";
import * as Permissions from "expo-permissions";
import { Icon } from "react-native-elements";
import SafeAreaView from "react-native-safe-area-view";
import { MaterialIcons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");
const [WIDTH, HEIGHT] = [width, height * 0.78];
const btnHeight = (height - HEIGHT) * 0.5;
// export default class Scan extends Component {
//   state = {
//     ref: null,
//     image: null,
//     gettingPermission: true,
//   };

//   async UNSAFE_componentWillMount() {
//     let promise = Platform.select({
//       android: ImagePicker.requestCameraPermissionsAsync(),
//       ios: ImagePicker.requestCameraRollPermissionsAsync(),
//     });
//     promise.then((status) => {
//       if (status.granted) {
//         ImagePicker.launchCameraAsync({
//           allowsEditing: true,
//           quality: 0.5,
//           mediaTypes: ImagePicker.MediaTypeOptions.Images,
//         })
//           .then((res) => {
//             if (res.cancelled) {
//               this.onCancel();
//             } else {
//               this.onSave(res.uri);
//             }
//           })
//           .catch((ex) => {
//             this.onCancel();
//           });
//       } else {
//         Alert.alert("", "Camera permissions denied");
//         this.onCancel();
//       }
//     });
//   }

//   onSave(uri) {
//     this.props.navigation.replace("IncidentForm", { image: uri });
//   }
//   onCancel() {
//     this.props.navigation.pop();
//   }

//   render() {
//     return null;
//   }
// }

export default class Scan extends Component {
  async componentDidMount() {
    if (Platform.OS === 'android') {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('', 'Camera permissions denied');
        this.onCancel();
        return;
      }
    } else if (Platform.OS === 'ios') {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('', 'Camera permissions denied');
        this.onCancel();
        return;
      }
    }

    ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.5,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    })
      .then((res) => {
        if (res.canceled) {
          this.onCancel();
        } else {
          this.onSave(res.uri);
        }
      })
      .catch((ex) => {
        this.onCancel();
      });
  }

  onSave(uri) {
    this.props.navigation.replace('IncidentForm', { image: uri });
  }

  onCancel() {
    this.props.navigation.pop();
  }

  render() {
    return null;
  }
}
