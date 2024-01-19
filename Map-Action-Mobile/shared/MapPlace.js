// import React from "react";
// import MapboxPlacesAutocomplete from "react-native-mapbox-places-autocomplete";
// // import Config from "react-native-config";
// import { useDispatch } from 'react-redux';
// import { setOrigin, setDestination } from './act'


// const MapboxPlacesInput = () => {
//   const MAPBOX_PUBLIC_TOKEN = 'pk.eyJ1IjoiYTc1NDJzIiwiYSI6ImNscmYzanhqeTAxMmgycW9iaXh1N2xoOHAifQ._ZPygGz31WSjc06zwpHNKA';
//   const dispatch = useDispatch();

//   const onPlaceSelect = async (data) => {
//     try {
//       const longitude = data.geometry.coordinates[0];
//       const latitude = data.geometry.coordinates[1];
      
//       // Utilisez l'API de géocodage inverse de Mapbox pour obtenir des informations sur le lieu
//       const response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${MAPBOX_PUBLIC_TOKEN}`);
//       const result = await response.json();

   
//     } catch (error) {
//       console.error('Erreur lors de la recherche du lieu:', error);
//     }
//   };

//   return (
//     <MapboxPlacesAutocomplete
//       id="origin"
//       placeholder="Recherche"
//       accessToken={MAPBOX_PUBLIC_TOKEN}
//       onPlaceSelect={onPlaceSelect}
//       onClearInput={({ id }) => {
//         id === "origin" && dispatch(setOrigin(null));
//       }}
//       countryId="id"
//       containerStyle={{
//         marginBottom: 12,
//       }}
//     />
//   );
// };

// export default MapboxPlacesInput;

import React, { useRef, useEffect, useCallback, useState } from "react";
import { View, StyleSheet, Modal } from "react-native";
import MapboxPlacesAutocomplete from "react-native-mapbox-places-autocomplete";
import Input from "./Input2";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "../constants/constants";
import { getCurrentCityFromAdress, getCurrentPosition } from "../utils/locationMap";
import Loader from "./Loader";

const MapboxAutoComplete = ({ value, onChange }) => {
  const onLocationChange = (location) => {
    onChange(location);
  };

  const ref = useRef();
  const [loading, setLoading] = useState(false);

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
    <View style={{ flex: 1, backgroundColor: "#FFF" }}>
      <MapboxPlacesAutocomplete
        style={{ backgroundColor: "transparent" }}
        contentContainerStyle={{
          paddingHorizontal: 15,
          paddingVertical: 0,
          backgroundColor: "transparent",
        }}
        keyboardShouldPersistTaps="handled"
        query={{
          apiKey: 'pk.eyJ1IjoiYTc1NDJzIiwiYSI6ImNscmYzanhqeTAxMmgycW9iaXh1N2xoOHAifQ._ZPygGz31WSjc06zwpHNKA', // Ajoutez votre clé Mapbox
          language: "fr",
        }}
        ref={ref}
        fetchDetails={true}
        renderLeftButton={() => null}
        renderRightButton={() => null}
        listViewDisplayed={null}
        onPress={(data, details = null) => {
          onLocationChange({
            adresse: data.place_name,
            latitude: details.geometry.coordinates[1],
            longitude: details.geometry.coordinates[0],
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
    height: 40,
    marginBottom: 5,
    width: "100%",
    paddingHorizontal: 5,
    backgroundColor: "#FFF",
    justifyContent: "center",
  },
});

