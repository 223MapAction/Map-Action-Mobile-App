import * as React from "react";
import { View, StyleSheet, Modal } from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

import Input from "./Input2";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "../constants/constants";
import manifest from "../app.json";
import {
  getCurrentCityFromAdress,
  getCurrentPosition,
} from "../utils/location2";

import Loader from "./Loader";

const Google = ({ value, onChange }) => {
  const onLocationChange = (location) => {
    onChange(location);
  };
  const ref = React.useRef();
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (ref.current) {
      ref.current.setAddressText(value);
      setTimeout(() => {
        if (ref.current) {
          if (!value || value === "empty") {
            ref.current.focus();
          }
        }
      }, 500);
    }
  }, [ref.current]);

  const onSelectPosition = React.useCallback(async () => {
    setLoading(true);
    const location = await getCurrentPosition();
    if (location) {
      onLocationChange(location);
      setLoading(false);
    } else {
      setTimeout(() => {
        setLoading(false);
      }, 3000);
    }
  }, []);
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#FFF",
      }}
    >
      <GooglePlacesAutocomplete
        style={{ backgroundColor: "transparent" }}
        suppressDefaultStyles
        contentContainerStyle={{
          paddingHorizontal: 15,
          paddingVertical: 0,
          backgroundColor: "transparent",
        }}
        keyboardShouldPersistTaps="handled"
        query={{
          key: manifest.expo.android.config.googleMaps.apiKey,
          // key: "AIzaSyD0klc1PQS8QK--Be3rF3i8kW_idy04AVQ",
          language: "fr",
        }}
        ref={ref}
        fetchDetails={true}
        renderLeftButton={() => null}
        renderRightButton={() => null}
        listViewDisplayed={null}
        onPress={(data, details = null) => {
          onLocationChange({
            adresse: data.description,
            latitude: details.geometry.location.lat,
            longitude: details.geometry.location.lng,
            ville: getCurrentCityFromAdress([details]),
          });
        }}
        placeholder="Chercher un lieu"
        enablePoweredByContainer={false}
        textInputProps={{
          autoFocus: false,
          InputComp: InputComp,
          textChanged: () => {},
          onHide: () => onChange(null),
          clearButtonMode: "never",
          autoCompleteType: "off",
          autoCorrect: false,
          autoCapitalize: "none",
          keyboardType: "web-search",
          onSelectPosition: onSelectPosition,
        }}
        onFail={(error) => console.error(error)}
        styles={{
          container: { flex: 1 },
          row: {
            backgroundColor: "#FFFFFF",
            padding: 13,
            marginBottom: 5,
            minHeight: 44,
            flexDirection: "row",
          },
          textInputContainer: {
            backgroundColor: "rgba(0,0,0,0)",
            borderTopWidth: 0,
            paddingHorizontal: 10,
            borderBottomWidth: 0,
          },

          textInput: style.input,
          predefinedPlacesDescription: {
            color: "#1faadb",
          },
        }}
      ></GooglePlacesAutocomplete>
      <Loader visible={loading} />
    </View>
  );
};

const InputComp = React.forwardRef((p, ref) => {
  const {
    onHide,
    onSelectPosition,
    textChanged,
    onChangeText,
    value,
    ...rest
  } = p;

  return (
    <Input
      onChange={(val) => {
        onChangeText(val);
        textChanged();
      }}
      value={value}
      rightIcon={{
        name: "location-pin",
        type: "entypo",
        size: 28,
        color: COLORS.app3,
        onPress: onSelectPosition,
      }}
      leftIcon={{
        name: "keyboard-arrow-left",
        type: "material",
        size: 28,
        color: COLORS.app3,
        onPress: onHide,
      }}
      inputContainerStyle={{
        borderRadius: 10,
        paddingHorizontal: 5,
        borderWidth: 1,
        minHeight: 50,
        maxHeight: 50,
      }}
      ref={ref}
      {...rest}
    />
  );
});

export function GooglePlaceModal({ visible, value, onChange, onHide }) {
  return (
    <Modal visible={visible} onRequestClose={onHide}>
      <SafeAreaView style={{ flex: 1 }}>
        {visible && (
          <Google
            value={value}
            onChange={(val) => {
              if (val) {
                onChange(val);
              } else {
                onHide();
              }
            }}
          />
        )}
      </SafeAreaView>
    </Modal>
  );
}

const style = StyleSheet.create({
  input: {
    height: 40,
    marginBottom: 5,
    width: "100%",
    paddingHorizontal: 5,
    backgroundColor: "#FFF",
    justifyContent: "center",
  },
  inputFocused: {
    height: 36,
    marginBottom: 5,
    width: "100%",
    paddingHorizontal: 5,
    paddingTop: 5,
    backgroundColor: "#f1f3f4",
    borderBottomWidth: 2,
    borderBottomColor: "#db3974",
  },
  label: {
    fontSize: 16,
    color: "rgba(0,0,0,.6)",
    marginBottom: 3,
  },
});
