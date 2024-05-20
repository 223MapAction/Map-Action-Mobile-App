import React, { Component } from "react";
import { ScrollView, View } from "react-native";
import CardIncident from "../badge/CardIncident";
import { connect } from "react-redux";
class Problemes extends Component {
  getIncident() {
    if (this.props.route?.params?.incidents)
      return this.props.route.params.incidents;
    return this.props.incidents;
  }
  render() {
    const incidents = this.getIncident();
    return (
      <ScrollView
        style={{
          paddingHorizontal: 10,
          paddingVertical: 20,
          marginBottom: 10,
          backgroundColor: "#fff",
        }}
      >
        <View style={{ marginBottom: 20 }}>
          <CardIncident
            incidents={incidents}
            aproxy
            navigation={this.props.navigation}
          />
        </View>

        <CardIncident
          incidents={incidents}
          navigation={this.props.navigation}
        />
      </ScrollView>
    );
  }
}
const mapState = ({ incidents }) => ({ incidents });

export default connect(mapState, null)(Problemes);
