import React, { Component } from "react";
import {
  View,
  Switch,
  Picker,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert,
} from "react-native";

import * as firebase from "firebase";
import Input from "../shared/Input";
import Card from "../shared/card";
import Spinner from "./spinner";
import Icon from "./icon";
import { Divider } from "react-native-elements";
import { base64toBlob, getDefaultImage } from "../utils/fileUpload";
import Camera from "./Camera";
import { getCameraPermission } from "../utils/image";

class Form extends Component {
  formatFields = ["latitude", "longitude", "prix"];
  directory = "";
  normalizeNumber(string) {
    if (!string && string !== 0) return "";
    let str = string.toString().replace(",", ".");

    if (["-", "."].includes(str)) return str;

    if (
      (str.length > 0 && str[str.length - 1]) === "." ||
      (str.length > 1 &&
        str[str.length - 1] === "0" &&
        str[str.length - 2] === ".")
    )
      return str;

    if (isNaN(parseFloat(str))) {
      return 0;
    }
    return parseFloat(str);
  }

  renderButton(label = "Enregistrer", styles = {}) {
    const { backgroundColor, ...rest } = {
      color: "#fff",
      backgroundColor: "#000",
      textAlign: "center",
      fontWeight: "bold",
      ...styles,
    };
    return (
      <Card style={{ marginBottom: 20 }}>
        <TouchableOpacity
          onPress={this.handleSubmit}
          style={{
            paddingVertical: 12,
            backgroundColor,
            borderRadius: 10,
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <Text style={rest}>{label}</Text>
          <Icon name="pencil-box" size={24} color="#fff" />
        </TouchableOpacity>
      </Card>
    );
  }

  renderDeleteButton() {
    const { backgroundColor, ...rest } = {
      color: "#fff",
      backgroundColor: "#c00000",
      textAlign: "center",
      fontWeight: "bold",
    };
    return (
      <Card style={{ marginBottom: 20 }}>
        <TouchableOpacity
          onPress={this.handleDelete}
          style={{
            paddingVertical: 12,
            backgroundColor,
            borderRadius: 10,
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <Text style={rest}>Supprimer</Text>
          <Icon name="trash-can" size={24} color="#fff" />
        </TouchableOpacity>
      </Card>
    );
  }

  _pickImage = async () => {
    if ((await getCameraPermission()) === false) {
      Alert.alert(
        "",
        "Désolé, nous avons besoin d'autorisations de caméra pour que cela fonctionne!"
      );
    } else {
      this.setState({ camera: true });
    }
  };
  getDefaultImage() {
    return getDefaultImage();
  }
  renderError(name) {
    if (this.state.errors) {
      const error = this.state.errors[name];
      if (error) {
        return (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Icon size={20} color="#F00" name="alert-circle" />
            <Text style={{ color: "#F00", marginRight: 5 }}>{error}</Text>
          </View>
        );
      }
    }

    return null;
  }
  validate(fieldArray) {
    const errors = { ...this.state.errors };

    for (let filed of fieldArray) {
      const value = this.state[filed];
      if (!value || value.toString().trim().length <= 0) {
        errors[filed] = "veuillez remplir ce champ";
      } else {
        delete errors[filed];
      }
    }
    return errors;
  }
  renderSpinner() {
    if (this.state.loading) return <Spinner bg="transparent" />;
    return null;
  }
  renderInput(label, name, options = {}) {
    let onChange = (text) => this.setState({ [name]: text });

    let value = this.state[name];
    if (this.formatFields.includes(name)) {
      if (!value && value !== 0) value = "";
      else if (!["-", "."].includes(value)) {
        if (value >= 0) value = value.toString();
        else if (isNaN(value)) value = "0";
        else {
          value = value * -1;
          value = "-" + value.toString();
        }
      }
      onChange = (text) =>
        this.setState({ [name]: this.normalizeNumber(text) });
    }
    return (
      <View>
        <Input value={value} onChange={onChange} label={label} {...options} />
        {this.renderError(name)}
      </View>
    );
  }
  renderPicker(items, name, prompt) {
    return (
      <View>
        <Text>{prompt}</Text>
        <Picker
          prompt={prompt}
          selectedValue={this.state[name]}
          onValueChange={(itemValue) => this.setState({ [name]: itemValue })}
        >
          {items.map((c) => (
            <Picker.Item label={c} value={c} key={c} />
          ))}
        </Picker>
      </View>
    );
  }

  renderDivider(color = "#ccc") {
    return <Divider backgroundColor={color} />;
  }
  renderSwitch(name, label, options = {}) {
    options = {
      onValueChange: (value) => this.setState({ [name]: value }),
      ...options,
    };
    return (
      <View
        style={{
          justifyContent: "space-between",
          alignItems: "center",
          flexDirection: "row",
          marginVertical: 10,
        }}
      >
        <Text>{label}</Text>
        <Switch
          {...options}
          style={{ borderWidth: 0 }}
          value={this.state[name]}
        />
      </View>
    );
  }
  static toast(message, callback = null, cancellable = false) {
    if (!callback) {
      callback = () => false;
    }
    let buttons = [{ text: "Ok", style: "confirm", onPress: callback }];
    if (cancellable) {
      buttons = [{ text: "Annuler", style: "cancel" }, ...buttons];
    }
    Alert.alert("", message, buttons, { cancelable: false });
  }
  async deleteImage(name) {
    this.setState({ _deletingImage: true });
    await this.onDeleteImage(name);
    this.setState({ _deletingImage: false });
  }
  renderImagePicker(name, styles = {}, rounded = false) {
    const { camera, _deletingImage } = this.state;
    let width = Dimensions.get("window").width - 40;
    if (styles.width) {
      width = styles.width;
    }
    const rest = { width, height: 208, ...styles };
    if (rounded) {
      rest.borderRadius = rest.width;
    }
    const photo =
      this.state[name] && this.state[name] !== "" ? this.state[name] : null;
    return (
      <View style={{ alignItems: "center", justifyContent: "center" }}>
        <View>
          {camera && (
            <Camera
              onPick={(uri) =>
                uri
                  ? this.onPickImage(name, uri)
                  : this.setState({ camera: false })
              }
            />
          )}
          <TouchableOpacity
            onPress={() => this._pickImage(name)}
            style={inputContainer}
          >
            <Image
              source={photo ? { uri: photo } : this.getDefaultImage()}
              style={rest}
            />
            <View
              style={{
                position: "absolute",
                top: rest.height / 2 - 20,
                right: rest.width / 2 - 20,
                zIndex: 2,
              }}
            >
              <Icon name="square-edit" focused={false} size={40} color="#FFF" />
            </View>
          </TouchableOpacity>
        </View>
        {this.state.progress !== false && (
          <View
            style={{
              width: rest.width,
              height: 8,
              borderWidth: 1,
              paddingBottom: 10,
            }}
          >
            <View
              style={{
                width: this.state.progress + "%",
                backgroundColor: "#000",
                height: 11,
              }}
            >
              <Text style={{ textAlign: "center", color: "#FFF", fontSize: 8 }}>
                {this.state.progress.toFixed(2)}%
              </Text>
            </View>
          </View>
        )}
        <View>
          {photo && this.state.progress === false && (
            <TouchableOpacity
              onPress={() => this.deleteImage(name)}
              style={{
                alignItems: "center",
                justifyContent: "center",
                height: 25,
                backgroundColor: "#F00",
                width: _deletingImage ? width : 50,
              }}
            >
              {_deletingImage && (
                <Text style={{ color: "#fff", fontSize: 10 }}>
                  Suppression en cours
                </Text>
              )}

              {!_deletingImage && (
                <Icon name="trash-can" focused={true} size={20} color="#FFF" />
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }

  async onPickImage(name, uri) {
    let blob = await base64toBlob(uri);
    if (this.state.id) {
      this.task = firebase
        .storage()
        .ref(this.directory)
        .child(this.state.id)
        .put(blob);
      this.task.then(async (snapshot) => {
        const uri = await snapshot.ref.getDownloadURL();
        this.saveImage(name, uri, this.state.id).then(() => {
          if (this.state.mounted) {
            this.setState({ progress: false });
            Form.toast("Enrégistrement d'image terminé avec Succès");
          }
        });
      });
      this.task.on("state_changed", (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if (this.state.mounted) {
          this.setState({ progress });
        }
      });
    }

    this.setState({ [name]: uri, camera: false });
  }
}

const inputContainer = {
  width: "100%",
  marginVertical: 8,
};

export default Form;
