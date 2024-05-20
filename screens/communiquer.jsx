import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import Constants from "../utils/constants";
import { connect } from "react-redux";
import { getImage } from "../utils/http/http";
import { getBadge, has_access } from "../utils/location";
import { list_zone } from "../utils/http/incident";
import { Alert } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { RefreshControl } from "react-native";

const Communiquer = ({ navigation, incidents, user }) => {
  const [loading, setLoading] = React.useState(false);
  const [zones, setZones] = React.useState([]);
  const [search, setSearch] = React.useState("");
  const isFocused = useIsFocused();
  const getZones = React.useCallback(() => {
    setLoading(true);
    list_zone()
      .then((zones) => {
        setZones(zones);
        setLoading(false);
      })
      .catch((ex) => {
        Alert.alert("", "Erreur lors de la récupération des zones");
        setLoading(false);
      });
  }, []);
  const filter = React.useCallback(() => {
    const search2 = search.trim().toLowerCase();
    if (search2.length > 0) {
      return zones.filter((p) => p.name.toLowerCase().includes(search2));
    }
    return zones;
  }, [search, zones]);
  const renderVide = React.useCallback(() => {
    return (
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          flex: 1,
          backgroundColor: "#fff",
        }}
      >
        <Text
          style={{
            color: "#2d9cdb",
            fontSize: 18,
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          Votre statut ne vous permet pas de communiquer.
        </Text>
      </View>
    );
  }, []);
  React.useEffect(() => {
    if (isFocused) {
      getZones();
    }
  }, [isFocused]);
  if (!user?.id) {
    return renderVide();
  }
  const nbIncidents = incidents.filter((i) => i.user_id === user.id).length;
  const badge = getBadge(nbIncidents);
  const hasAccess = has_access(badge, Constants.permissions.discussion);
  if (!hasAccess) {
    return renderVide();
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={filter()}
        refreshControl={
          <RefreshControl
            onRefresh={getZones}
            refreshing={loading}
            colors={["#38A3D0", "#000"]}
          />
        }
        ListHeaderComponent={
          <View
            style={{
              flexDirection: "row",
              backgroundColor: "#fff",
              justifyContent: "space-between",
              borderRadius: 30,
              alignItems: "center",
              paddingHorizontal: 10,
            }}
          >
            <TextInput
              placeholderTextColor="#6A6A6A"
              placeholder="Rechercher"
              style={{ padding: 10, fontSize: 18, flex: 1 }}
              value={search}
              underlineColorAndroid="#38A3D0"
              onChangeText={setSearch}
            />
            <MaterialIcons
              name="search"
              size={30}
              style={{ zIndex: 2 }}
              color="#38A3D0"
            />
          </View>
        }
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ paddingHorizontal: 10 }}
        ListEmptyComponent={
          <View
            style={{
              alignItems: "center",
              paddingVertical: 20,
              justifyContent: "center",
            }}
          >
            {!loading && (
              <Text style={{ fontSize: 16 }}>Aucun résultat trouvé</Text>
            )}
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Messages", {
                item: item,
              });
            }}
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-start",
              paddingVertical: 14,
            }}
          >
            <Image
              style={{
                width: 50,
                height: 50,
                borderRadius: 50,
                borderWidth: 1,
                borderColor: "#ccc",
                alignSelf: "center",
              }}
              source={getImage(item.photo)}
            />
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                paddingStart: 20,
                color: "rgba(0, 0, 0, 0.5)",
              }}
            >
              {item.name}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
const mapState = ({ user, incidents }) => ({
  user: user.user,
  incidents,
  token: user.token ? user.token : null,
});
export default connect(mapState)(Communiquer);
