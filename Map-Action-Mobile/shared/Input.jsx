import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";

const Input = ({
  label,
  value,
  onChange,
  editable,
  onFocus,
  onBlur,
  ...options
}) => {
  const [focused, setFocused] = React.useState(false);
  return (
    <View>
      <Text style={style.label}>{label}</Text>
      <TextInput
        {...options}
        underlineColorAndroid="transparent"
        style={[
          !focused ? style.input : style.inputFocused,
          !editable ? { backgroundColor: "#ccc" } : {},
        ]}
        value={value}
        editable={editable}
        placeholder={label}
        onFocus={() => {
          setFocused(true);
          if (onFocus) onFocus();
        }}
        onBlur={() => {
          setFocused(false);
          if (onBlur) {
            onBlur();
          }
        }}
        onChangeText={onChange}
      />
    </View>
  );
};
Input.defaultProps = {
  editable: true,
};
export default Input;

const style = StyleSheet.create({
  input: {
    height: 40,
    marginBottom: 5,
    width: "100%",
    paddingHorizontal: 5,
    paddingTop: 5,
    backgroundColor: "#f1f3f4",
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
