import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import actionmap from "../../assets/actionmapBlanc.png";
import image from "../../assets/image.jpg";
import { MaterialIcons } from "@expo/vector-icons";
import { Icon } from "react-native-elements";
import IconBadge from "react-native-icon-badge";
import { LinearGradient } from "expo-linear-gradient";
import TabBar from "../../components/TabBar";
import { connect } from "react-redux";
import { getImage } from "../../utils/http/http";
import { getBadge } from "../../utils/location";

class Badge extends Component {
  render() {
    const { user, incidents: incs } = this.props;
    const incidents = incs.filter((i) => i.user_id === user.id);
    const badge = getBadge(incidents.length);
    return (
      <View style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 80, paddingHorizontal: 10 }}
        >
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              marginTop: 50,
            }}
          >
            {this.props.token === null && (
              <IconBadge
                MainElement={
                  <View style={{ justifyContent: "flex-end", marginStart: 20 }}>
                    <Image
                      style={{ width: 80, height: 80, borderRadius: 100 }}
                      source={image}
                    />
                  </View>
                }
                BadgeElement={
                  <MaterialIcons name="stars" size={30} color={"#16DAB7"} />
                }
                IconBadgeStyle={{
                  width: 30,
                  height: 30,
                  backgroundColor: "#fff",
                }}
              />
            )}

            {this.props.token !== null && (
              <IconBadge
                MainElement={
                  <View style={{ justifyContent: "center" }}>
                    <Image
                      resizeMode="cover"
                      style={{ width: 90, height: 90, borderRadius: 100 }}
                      source={getImage(user.avatar, "d")}
                    />
                  </View>
                }
                BadgeElement={
                  <MaterialIcons name="stars" size={30} color={badge.color} />
                }
                IconBadgeStyle={{
                  width: 30,
                  height: 30,
                  backgroundColor: "#fff",
                }}
              />
            )}
          </View>

          <View style={{ marginTop: 30 }}>
            <Text style={{ color: "#2D9CDB", fontWeight: "500", fontSize: 14 }}>
              De quoi s’agit-il
            </Text>
            <Text style={{ ...styles.textExplication, paddingTop: 6 }}>
              Le badge montre votre implication et engagement citoyen à travers
              votre utilisation de l’application Map Action. Vous pouvez gagner
              2 différents types de badges :
            </Text>
            <Text style={{ ...styles.textExplication, paddingTop: 6 }}>
              1) Les Badges classiques : chaque badge classique gagné correspond
              à l’atteinte d’un niveau de participation et débloque à chaque
              fois une fonctionnalité clé de l’application.
            </Text>
            <Text style={{ ...styles.textExplication, paddingTop: 5 }}>
              2) Les Badges récompense : ils offrent la possibilité de recevoir
              des cadeaux offerts par nos partenaires et peuvent être gagnés
              chaque mois grâce des signalements de problématiques et
              organisations/participations à des challenges.
            </Text>
          </View>

          <View style={{ marginTop: 20 }}>
            <Text style={{ color: "#2D9CDB", fontWeight: "500", fontSize: 14 }}>
              Comment gagner un badge ?
            </Text>

            <Text
              style={{
                fontWeight: "bold",
                textDecorationLine: "underline",
                paddingTop: 6,
              }}
            >
              Badges classiques
            </Text>
          </View>

          <View style={{ marginTop: 20 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingBottom: 10,
              }}
            >
              <MaterialIcons name="stars" size={30} color={"#B87333"} />
              <Text
                style={{
                  color: "#2D9CDB",
                  fontWeight: "500",
                  fontSize: 14,
                  paddingStart: 20,
                }}
              >
                Badge cuivre = 1er incident signalé
              </Text>
            </View>

            <Text style={{ ...styles.textExplication }}>
              Dès le 1er incident signalé. Il vous donne la possibilité de
              participer à des challenges communautaires organisés par d’autres
              utilisateurs de l’application.
            </Text>
          </View>

          <View style={{ marginTop: 20 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingBottom: 10,
              }}
            >
              <MaterialIcons name="stars" size={30} color={"#F0C016"} />
              <Text
                style={{
                  color: "#2D9CDB",
                  fontWeight: "500",
                  fontSize: 14,
                  paddingStart: 20,
                }}
              >
                Badge bronze = 3 incidents signalés{" "}
              </Text>
            </View>

            <Text style={{ ...styles.textExplication }}>
              A partir de 3 signalements vous débloquez le badge bronze qui vous
              permettra désormais de féliciter ou promouvoir un acte citoyen
              auprès des utilisateurs de l’application et de le partager sur nos
              plateformes des différents réseaux sociaux.
            </Text>
          </View>

          <View style={{ marginTop: 20 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingBottom: 10,
              }}
            >
              <MaterialIcons name="stars" size={30} color={"#DBDBDB"} />
              <Text
                style={{
                  color: "#2D9CDB",
                  fontWeight: "500",
                  fontSize: 14,
                  paddingStart: 20,
                }}
              >
                Badge argent = 5 incidents signalés{" "}
              </Text>
            </View>

            <Text style={{ ...styles.textExplication }}>
              A partir de 5 signalements. Il vous donne la possibilité de créer
              vos propres challenges communautaires et inviter d’autres
              utilisateurs à y participer.
            </Text>
          </View>

          <View style={{ marginTop: 20 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingBottom: 10,
              }}
            >
              <MaterialIcons name="stars" size={30} color={"#F8F14F"} />
              <Text
                style={{
                  color: "#2D9CDB",
                  fontWeight: "500",
                  fontSize: 14,
                  paddingStart: 20,
                }}
              >
                Badge gold= 10 incidents signalés
              </Text>
            </View>

            <Text style={{ ...styles.textExplication }}>
              A partir de 10 signalements. Il débloque la fonctionnalité de
              pouvoir parler directement avec les organisations (mairies, ONG,
              etc.) à travers une messagerie privée afin de faire un suivi
              personnel des incidents que vous avez reporté.
            </Text>
          </View>

          <View style={{ marginTop: 20 }}>
            <Text
              style={{
                fontWeight: "bold",
                textDecorationLine: "underline",
                paddingTop: 20,
              }}
            >
              Badges récompenses
            </Text>
            <Text style={{ ...styles.textExplication, paddingTop: 6 }}>
              Les badges récompenses sont gagnés chaque mois à travers
              l’atteinte de différents objectifs fixés selon le challenge en
              cours. Ils vous donnent accès à des récompenses connues à l’avance
              ou des surprises offertes par nos partenaires.
            </Text>
          </View>

          {/* <View style={{ marginTop: 20 }}>
            <Text
              style={{
                fontWeight: "bold",
                textDecorationLine: "underline",
                paddingTop: 20,
              }}
            >
              Système de point
            </Text>
            <Text style={{ ...styles.textExplication, paddingTop: 6 }}>
              - 1 point gagné pour chaque signalement d’incident ou de
              problématique approuvé.{" "}
            </Text>
            <Text style={{ ...styles.textExplication, paddingTop: 6 }}>
              - 1.5 points pour chaque signalement d’incident ou de
              problématique approuvé fait en ayant mentionné la bonne catégorie.{" "}
            </Text>
            <Text style={{ ...styles.textExplication, paddingTop: 6 }}>
              - 2 points pour chaque participation effective à un challenge
              communautaire{" "}
            </Text>
            <Text style={{ ...styles.textExplication, paddingTop: 6 }}>
              - 2 points pour chaque challenge communautaire organisé avec
              succès ayant rassemblé au moins 5 utilisateurs
            </Text>
          </View> */}
        </ScrollView>

        <View
          style={{
            alignSelf: "center",
            zIndex: 20,
            bottom: 10,
            position: "absolute",
          }}
        >
          <TabBar navigation={this.props.navigation} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  text: {
    marginHorizontal: 30,
    justifyContent: "center",
    alignSelf: "center",
    flex: 1,
  },
  textExplication: {
    color: "#858585",
    fontWeight: "300",
    fontSize: 12,
    textAlign: "justify",
    paddingLeft: 25,
  },
  textStyles: {
    color: "#2D9CDB" /* 
        fontFamily:"Poppins", */,
    fontSize: 22,
    lineHeight: 24,
    marginTop: 20,
    alignSelf: "center",
  },
  textContainte: {
    /* 
        fontFamily:"Poppins", */

    fontSize: 14,
    lineHeight: 21,
    marginTop: 20,
    alignSelf: "center",
    fontWeight: "300",
  },
  ellipse: {
    width: 282,
    height: 45,
    alignSelf: "center",
    justifyContent: "center",
    borderRadius: 100,
    alignItems: "center",
    backgroundColor: "#49DD7B",
    borderColor: "#FFF",
    borderWidth: 1,
  },
  ellipse2: {
    width: 10,
    height: 10,
    alignSelf: "center",
    justifyContent: "center",
    borderRadius: 10,
    marginStart: 8,
    backgroundColor: "rgba(196, 196, 196, 0.45)",
    borderColor: "#FFF",
    borderWidth: 1,
  },
  ellipse2Select: {
    width: 10,
    height: 10,
    alignSelf: "center",
    justifyContent: "center",
    borderRadius: 10,
    marginStart: 8,
    backgroundColor: "#1F84E6",
    borderColor: "#FFF",
    borderWidth: 1,
  },
});
const mapState = ({ user, incidents, challenges }) => ({
  token: user.token ? user.token : null,
  user: user.token ? user.user : {},
  incidents,
  challenges,
});

export default connect(mapState, null)(Badge);
