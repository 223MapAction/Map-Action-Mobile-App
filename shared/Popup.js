import { Modal, View, Dimensions, ActivityIndicator } from "react-native";

import React, { Component } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { MaterialIcons } from "@expo/vector-icons";

const width = Dimensions.get("window").width;

export default class Popup extends Component {
  state = {
    visible: true,
  };

  componentDidUpdate() {
    if (!this.state.visible) {
      this.props.onHide();
    }
  }

  render() {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.state.visible}
        onRequestClose={() => {
          this.setState({ visible: false });
        }}
      >
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,.2)",
          }}
        >
          <View
            style={[
              {
                width: width * 0.9,
                paddingHorizontal: 10,
                backgroundColor: "#fff",
                paddingVertical: 20,
                borderRadius: 15,
                justifyContent: "space-around",
              },
            ]}
          >
            {/* <View
              onPress={() => this.setState({ visible: false })}
              style={{
                marginVertical: 10,
                width: width * 0.9,
                posdition: "absolute",
                top: -40,
                zIndex: 1,
                marginRight: 10,
                flexDirection: "row",
                justifyContent: "flex-end",
              }}
            >
              <TouchableOpacity
                onPress={() => this.setState({ visible: false })}
                style={{
                  zIndex: 10,
                  alignSelf: "flex-end",
                  paddingRight: 20,
                }}
              >
                <MaterialIcons name="close" size={30} color={"#666666"} />
              </TouchableOpacity>
            </View> */}
            {this.props.children}
          </View>
        </View>
      </Modal>
    );
  }
}
