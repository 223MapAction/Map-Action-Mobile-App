import React, { Component } from "react";
import { View, Text, FlatList } from "react-native";
import { connect } from "react-redux";
import moment from "moment";
import { TouchableNativeFeedback } from "react-native-gesture-handler";
import _ from "lodash";
import DateTimePicker2 from "../shared/DateTimePicker";
class Historique extends Component {
  constructor(props) {
    super(props);
    const dates = [];
    for (let i of _.range(0, 12)) {
      dates.unshift(moment().subtract(i, "month"));
    }
    this.state = {
      datePicker: false,
      dates: dates.map((d) => {
        return {
          month: d.format("MMM"),
          year: d.format("YYYY"),
          total: 0,
          incidents: [],
        };
      }),
    };
  }
  scrollRef = React.createRef();
  componentDidMount() {
    setTimeout(() => {
      this.setIncidents(this.props.incidents);
    }, 1000);
  }
  //WARNING! To be deprecated in React v17. Use new lifecycle static getDerivedStateFromProps instead.
  UNSAFE_componentWillReceiveProps({ incidents }) {
    if (this.props.incidents.length !== incidents.length) {
      this.setIncidents(incidents);
    }
  }

  setIncidents(incidents) {
    const { profile, user } = this.props;
    const finalData = [];
    this.state.dates.forEach((date) => {
      const incs = [];
      incidents.forEach((incident) => {
        const date2 = moment(incident.created_at);
        if (
          date.year === date2.format("YYYY") &&
          date.month == date2.format("MMM") &&
          (profile ? incident.user_id === user.id : true)
        ) {
          incs.push(incident);
        }
      });
      finalData.push({
        ...date,
        incidents: incs,
      });
    });
    const total = finalData.reduce((acc, cur) => acc + cur.incidents.length, 0);
    this.setState({ dates: finalData, total }, () => {
      this.scrollRef.current.scrollToEnd({ animated: true });
    });
  }
  render() {
    const { dates: data, total } = this.state;
    const params = this.props.profile ? { user_id: this.props.user_id } : {};
    const currentMonth = moment().format("MMM");
    const { year } = this.state;
    return (
      <View>
        {this.state.datePicker && (
          <DateTimePicker2
            onHide={() => this.setState({ datePicker: false })}
            mode="date"
            onChange={(date) =>
              this.setState({
                year: moment(date).format("YYYY"),
                datePicker: false,
              })
            }
          />
        )}
        <View
          style={{
            flexDirection: "row",

            justifyContent: "space-between",
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: "700",
              color: "rgba(0, 0, 0, 0.32)",
            }}
          >
            Historique
          </Text>
          <TouchableNativeFeedback
            onPress={() =>
              this.props.navigation.navigate("ListIncidents", {
                item: {
                  month: year,
                  incidents: data.reduce((acc, cur) => {
                    return [...acc, ...cur.incidents];
                  }, []),
                },
              })
            }
          >
            <Text style={{ fontSize: 14, color: "#38A3D0", fontWeight: "500" }}>
              Voir tout
            </Text>
          </TouchableNativeFeedback>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <View
            style={{
              height: 202,
              paddingBottom: 20,
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {_.range(0, 120, 20)
              .reverse()
              .map((item, index) => {
                return (
                  <View key={index}>
                    <Text style={{ fontSize: 8, color: "rgba(0,0,0,.6)" }}>
                      {item}%
                    </Text>
                  </View>
                );
              })}
          </View>
          <FlatList
            data={data}
            style={{ marginVertical: 10 }}
            ref={this.scrollRef}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            horizontal={true}
            renderItem={({ item, index }) => {
              const current = item.month === currentMonth;
              return (
                <View
                  style={{
                    height: 202,
                    justifyContent: "flex-end",
                    alignItems: "center",
                    marginHorizontal: 15,
                  }}
                >
                  <TouchableNativeFeedback
                    onPress={() =>
                      this.props.navigation.navigate("ListIncidents", {
                        ...params,
                        item,
                      })
                    }
                  >
                    <View>
                      <Text
                        style={{
                          fontSize: 8,
                          textAlign: "center",
                          color: current ? "#38A3D0" : "#ACAEAF",
                        }}
                      >
                        {item.incidents.length}
                      </Text>
                      <View
                        style={{
                          height:
                            (item.incidents.length / (total || 1)) * 200 + 2,
                          backgroundColor: current ? "#38A3D0" : "#DDD",
                          width: 6,

                          alignSelf: "center",
                        }}
                      />
                      <Text
                        style={{
                          color: current ? "#38A3D0" : "#ACAEAF",
                          fontWeight: "700",
                          marginTop: 10,
                          fontSize: 8,
                          textTransform: "uppercase",
                          textAlign: "center",
                        }}
                      >
                        {item.month}
                      </Text>
                    </View>
                  </TouchableNativeFeedback>
                </View>
              );
            }}
          />
        </View>
      </View>
    );
  }
}

const mapState = ({ user, incidents }) => ({
  token: user.token ? user.token : null,
  user: user.token ? user.user : {},
  incidents,
});
export default connect(mapState, null)(Historique);
