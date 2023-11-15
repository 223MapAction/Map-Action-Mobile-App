import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { connect } from "react-redux";
import { getPays, ensure, getVille } from "../utils/location";
import { list_zone } from "../utils/http/incident";
import { onGetCommunaute } from "../redux/communautes/action";
import { list_communaute } from "../utils/http/communaute";

class Ville extends Component {
  state = {
    search: "",
    loading: true,
    villes: [],
  };

  async componentDidMount() {
    try {
      let villes = await list_zone();
      villes = villes.map((v) => {
        v.incidents = [];
        v.users = [];
        this.props.incidents.map((i) => {
          if (i.zone === v.name) {
            v.incidents.push(i);
          }
        });
        return v;
      });
      const realVilles = [];
      const status = await ensure();
      if (status) {
        for (let v of villes) {
          const location = {
            latitude: parseFloat(v.lattitude),
            longitude: parseFloat(v.longitude),
          };
          const rville = await getVille(location);
          if (rville) {
            const index = realVilles.findIndex((rv) => rv.ville === rville);
            if (index === -1) {
              realVilles.push({
                ville: rville,
                zones: [v],
                pays: await getPays(rville),
              });
            } else {
              realVilles[index].zones.push(v);
            }
          }
        }
      }
      this.setState({ villes: realVilles, loading: false });
    } catch (ex) {
      console.log(ex);
      this.setState({ loading: false });
    }
  }

  filter = () => {
    let { search, villes } = this.state;
    if (search.trim().length > 0) {
      search = search.toLowerCase();
      return villes.filter((p) => p.ville.toLowerCase().includes(search));
    }
    return villes;
  };
  render() {
    const { search, loading } = this.state;
    const data = this.filter();
    if (loading) {
      return (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <ActivityIndicator color="#57A4FF" size="small" />
        </View>
      );
    }
    return (
      <View style={styles.container}>
        <View
          style={{
            paddingHorizontal: 15,
            marginVertical: 10,
            flexDirection: "row",
            backgroundColor: "#F2F2F2",
            justifyContent: "space-between",
            borderRadius: 30,
            alignItems: "center",
          }}
        >
          <TextInput
            placeholderTextColor="#6A6A6A"
            placeholder="Cherchez une ville"
            style={{ padding: 10, fontSize: 18 }}
            value={search}
            onChangeText={(text) => this.setState({ search: text })}
          />
          <MaterialIcons
            name="search"
            size={30}
            style={{ zIndex: 2 }}
            color="#787777"
          />
        </View>
        {data.length === 0 && (
          <Text style={{ fontSize: 18, textAlign: "center", marginTop: 50 }}>
            Aucun résultat trouvé.
          </Text>
        )}
        <FlatList
          data={data}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item.ville}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() =>
                this.props.navigation.navigate("DetailVilles", {
                  item: item,
                })
              }
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                borderColor: "#ccc",
                borderBottomWidth: 1,
                paddingVertical: 14,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 20,
                      color: "rgba(0, 0, 0, 0.87)",
                      lineHeight: 20,
                    }}
                  >
                    {item.ville}
                  </Text>
                  <Text style={{ fontSize: 14, color: "rgba(0, 0, 0, 0.87))" }}>
                    {" "}
                    {item.pays}
                  </Text>
                </View>
              </View>
              <View>
                <Text
                  style={{ fontSize: 14, color: "#57A4FF", marginStart: 10 }}
                >
                  {item.zones.reduce((acc, cur) => {
                    return cur.incidents.length + acc;
                  }, 0)}
                </Text>
                <Text style={{ fontSize: 10, color: "rgba(0, 0, 0, 0.39)" }}>
                  problèmes
                </Text>
                <Text style={{ fontSize: 10, color: "rgba(0, 0, 0, 0.39)" }}>
                  reportés
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
  },
});

const mapState = ({ user, incidents, communautes }) => ({
  token: user.token ? user.token : null,
  user: user.token ? user.user : {},
  users: user.users,
  communautes,
  incidents,
});

export default connect(mapState, { onGetCommunaute })(Ville);
