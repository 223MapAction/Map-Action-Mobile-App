import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import TabNavigation from "./TabNavigation";
import DrawerContent from "./DrawerContent";
const Drawer = createDrawerNavigator();

import { connect } from "react-redux";

class DrawerNavigation extends React.Component {
  render() {
    let initialRouteName = "TabNavigation";
    const { navigation } = this.props;

    return (
      <Drawer.Navigator
        initialRouteName={initialRouteName}
        drawerType="front"
        activeTintColor="transparent"
        contentContainerStyle={{ flex: 1 }}
        drawerContent={(props) => (
          <DrawerContent stackNavigation={navigation} {...props} />
        )}
      >
        <Drawer.Screen name="TabNavigation" options={{
                                            headerShown: false, 
                                            }}>
          {(props) => <TabNavigation {...props} />}
        </Drawer.Screen>
      </Drawer.Navigator>
    );
  }
}

const mapState = ({ user }) => ({ token: user.token ? user.token : null });
export default connect(mapState, null)(DrawerNavigation);
