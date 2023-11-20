import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "../shared/icon";
import Dashboard from "../screens/newScreen/Dashboard";
import Profil from "../screens/newScreen/profil";
import Challenges from "../screens/newScreen/challenges";
import Header from "../shared/header";
import { View, Platform } from "react-native";
const Tab = createBottomTabNavigator();
import { createStackNavigator } from "@react-navigation/stack";
import Picture from "../screens/pictureComponent";
import TabBar from "./TabBar";
const Stack = createStackNavigator();

import { connect } from "react-redux";
import Communiquer from "../screens/communiquer";
import HeaderLeft from "../utils/HeaderLeft";
import Problemes from "../screens/newScreen/Problemes";
import ProfilStackNavigation from "./ProfilStackNavigation";

class TabNavigation extends React.Component {
  render() {
    return (
      <Tab.Navigator
        initialRouteName="Dashboard"
        activeColor="#39DF72"
        inactiveColor="rgba(0,0,0,.5)"
        backBehavior="initialRoute"
        shifting={false}
        tabBarOptions={{
          showLabel: false,
          style: { height: Platform.OS === "ios" ? 60 : 55 },
          tabStyle: { justifyContent: "center" },
        }}
      >
        <Tab.Screen
          name="Dashboard"
          options={{ tabBarLabel: "", tabBarIcon: this.renderIcon("home"), headerShown:false }}
          component={DashboardStack}
        />
        <Tab.Screen
          name="Communiquer"
          options={{
            tabBarLabel: "",
            tabBarIcon: this.renderIcon("question-answer"),
          }}
          component={CommuniquerStack}
        />
        <Tab.Screen
          name="Camera"
          options={{
            tabBarLabel: "",
            tabBarIcon: ({ props }) => (
              <TabBar {...props} navigation={this.props.navigation} />
            ),

          }}
          component={CameraStack}
        />

        <Tab.Screen
          name="ProfilStackNavigation"
          options={{ tabBarLabel: "", tabBarIcon: this.renderIcon("person"), headerShown:false }}
          component={ProfilStackNavigation}
        />
        <Tab.Screen
          name="Challenges"
          options={{ tabBarLabel: "", tabBarIcon: this.renderIcon("place"), headerShown:false }}
          component={ChallengesStack}
        />
      </Tab.Navigator>
    );
  }
  renderIcon(name) {
    return ({ focused, color }) => (
      <View style={{ marginTop: Platform.OS === "ios" ? 10 : 0 }}>
        <Icon focused={focused} name={name} size={24} color={color} />
      </View>
    );
  }
}

const mapState = ({ user }) => ({
  token: user.token ? user.token : null,
  user: user.user ? user.user : null,
});

const CameraStack = (props) => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Picture"
        component={Picture}
        options={{
          title: "",
          headerStyle: { backgroundColor: "#2D9CDB" },
          headerShown: false
        }}
      />
    </Stack.Navigator>
  );
};
const DashboardStack = connect(
  mapState,
  null
)((props) => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Dashboard"
        component={Dashboard}
        options={{
          header: () => (
            <Header navigation={props.navigation} user={props.user} />
          ),
        }}
      />
      <Stack.Screen
        name="Problemes"
        component={Problemes}
        options={{
          title: "Liste des problèmes",
          headerStyle: { backgroundColor: "#2D9CDB" },
          headerTitleStyle: { color: "#FFF" },
          headerLeft: () => <HeaderLeft colors={"#fff"} />,
        }}
      />
    </Stack.Navigator>
  );
});

const CommuniquerStack = connect(
  mapState,
  null
)((props) => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Communiquer"
        component={Communiquer}
        options={{
          header: () => (
            <Header
              navigation={props.navigation}
              user={props.user}
              title={"Messagerie"}
            />
          ),
        }}
      />
    </Stack.Navigator>
  );
});

const ChallengesStack = connect(
  mapState,
  null
)((props) => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Challenges"
        component={Challenges}
        options={{
          header: () => (
            <Header
              navigation={props.navigation}
              user={props.user}
              title={"Challenges"}
            />
          ),
        }}
      />
    </Stack.Navigator>
  );
});

export default connect(mapState, null)(TabNavigation);
