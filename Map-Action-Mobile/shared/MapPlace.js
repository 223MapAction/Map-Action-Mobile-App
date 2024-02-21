import React, { useRef, useEffect, useCallback, useState } from "react";
import { View, StyleSheet, Modal } from "react-native";
import MapboxPlacesAutocomplete from "react-native-mapbox-places-autocomplete";
import Input from "./Input2";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "../constants/constants";
import { getCurrentCityFromAddress, getCurrentPosition } from "../utils/locationMap";
import Loader from "./Loader";

const MapboxAutoComplete = ({ value, onChange }) => {
  const onLocationChange = (location) => {
    onChange(location);
  };

  const ref = useRef();
  const [loading, setLoading] = useState(false);
  const [countryId, setCountryId] = useState(null);

  useEffect(() => {
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
  }, [value]);

  const onSelectPosition = useCallback(async () => {
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
    <View style={{ flex: 1, backgroundColor: "#FFF", marginTop:"8%"}}>
      <MapboxPlacesAutocomplete
        id="oridin"
        inputStyle={style.input}
        containerStyle={{
          paddingHorizontal: "5%",
          paddingVertical: 5,
          backgroundColor: "transparent",
          borderRadius: 10,
          marginBottom: 12,
          height:"8%",
          // borderWidth:0.25,

        }}
        countryId="fr,id,ml,sn" 
        accessToken= 'pk.eyJ1IjoiYTc1NDJzIiwiYSI6ImNscmYzanhqeTAxMmgycW9iaXh1N2xoOHAifQ._ZPygGz31WSjc06zwpHNKA' // Ajoutez votre clé Mapbox
        onPlaceSelect={(data, details = null) => {
          console.log(data)
          onLocationChange({
            adresse: data.place_name,
            latitude: data.geometry.coordinates[1],
            longitude: data.geometry.coordinates[0],
            ville: getCurrentCityFromAddress([data]),
          });
        }}
        placeholder="Chercher un lieu"
        // textInputProps={{
        //   autoFocus: false,
        //   InputComp: InputComp,
        //   textChanged: () => {},
        //   onHide: () => onChange(null),
        //   clearButtonMode: "never",
        //   autoCompleteType: "off",
        //   autoCorrect: false,
        //   autoCapitalize: "none",
        //   keyboardType: "web-search",
        //   onSelectPosition: onSelectPosition,
        // }}
        // onFail={(error) => console.error(error)}
        // rowStyle={{
        //   backgroundColor: "#FFFFFF",
        //   padding: 13,
        //   marginBottom: 5,
        //   minHeight: 44,
        //   flexDirection: "row",
        // }}
        // textInputContainerStyle={{
        //   backgroundColor: "rgba(0,0,0,0)",
        //   borderTopWidth: 0,
        //   paddingHorizontal: 10,
        //   borderBottomWidth: 0,
        // }}
        // textInputStyle={{
        //   height: 40,
        //   marginBottom: 5,
        //   width: "100%",
        //   paddingHorizontal: 5,
        //   backgroundColor: "#FFF",
        //   justifyContent: "center",
        // }}
        // predefinedPlacesDescription={{
        //   color: "#1faadb",
        // }}
      />
      <Loader visible={loading} />
    </View>
  );
};

const InputComp = React.forwardRef((p, ref) => {
  const { onHide, onSelectPosition, textChanged, onChangeText, value, ...rest } = p;

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

export function MapboxPlaceModal({ visible, value, onChange, onHide }) {
  return (
    <Modal visible={visible} onRequestClose={onHide}>
      <SafeAreaView style={{ flex: 1 }}>
        {visible && (
          <MapboxAutoComplete
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
};

const style = StyleSheet.create({
  input: {
    height: 20,
    // marginBottom: 10,
    // marginTop: "7%",
    width: "100%",
    paddingHorizontal: 5,
    backgroundColor: "#FFF",
    justifyContent: "center",
    borderRadius: 5,
    borderWidth: 0.25,
    minHeight: 50,
    maxHeight: 50,
    fontSize:16,
    alignItems:'center',
    alignContent:"center"
  },
});

