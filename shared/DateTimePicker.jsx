import DateTimePicker from "@react-native-community/datetimepicker";
import { View, Platform } from "react-native";
import { Button, Overlay } from "react-native-elements";
import React, { Component } from "react";
import moment from "moment";
export default class DateTimePicker2 extends Component {
  constructor(props) {
    super(props);
    const { date } = this.props;
    if (date) {
      this.state = {
        date: moment(date).toDate(),
      };
    } else {
      this.state = {
        date: moment().toDate(),
      };
    }
  }
  render() {
    return Platform.OS === "ios" ? this.renderIos() : this.renderAndroid();
  }
  renderIos() {
    const mode = this.props.mode || "date";
    return (
      <Overlay
        isVisible={true}
        overlayBackgroundColor="transparent"
        height="auto"
      >
        <DateTimePicker
          testID="dateTimePicker"
          timeZoneOffsetInMinutes={0}
          mode={mode}
          locale="fr"
          display="default"
          value={this.state.date}
          onChange={(event, date) => this.setState({ date: date })}
          style={{
            backgroundColor: "white",
          }}
        />
        <Button
          title="Selectionner"
          buttonStyle={{
            height: 50,
            marginTop: 50,
            borderRadius: 25,
            justifyContent: "center",
            alignSelf: "center",
            width: "70%",
          }}
          containerStyle={{ justifyContent: "center" }}
          titleStyle={{
            color: "white",
            fontWeight: "bold",
            fontSize: 22,
          }}
          onPress={() => this.setDate({ type: "set" }, this.state.date)}
        />
      </Overlay>
    );
  }
  setDate = ({ type }, date) => {
    if (type === "set") this.props.onChange(date);
    else {
      this.props.onHide();
    }
  };
  renderAndroid() {
    const mode = this.props.mode || "date";
    return (
      <View>
        <DateTimePicker
          testID="dateTimePicker"
          timeZoneOffsetInMinutes={0}
          mode={mode}
          locale="fr"
          display="spinner"
          value={this.state.date}
          onChange={this.setDate}
        />
      </View>
    );
  }
}
