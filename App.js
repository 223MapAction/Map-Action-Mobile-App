import React from "react";
import { Text, View, StatusBar, } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { AppLoading } from "expo";
import { createStore, applyMiddleware } from "redux";
import { Asset } from "expo-asset";
import thunk from "redux-thunk";
import { Provider } from "react-redux";
import root from "./redux/root";
const store = createStore(root, applyMiddleware(thunk));
import * as FileSystem from "expo-file-system";
import StackNavigation from "./components/StackNavigation";
import MapboxPlacesInput from "./shared/MapPlace";
import InputOTP from "./screens/inputOTP";
import InscriptionChoice from "./screens/inscriptionChoice";
import PhoneIncription from "./screens/phoneInscription";

export default class App  extends React.Component  {
  // state = {
  //   isLoadingComplete: false,
  //   assetLoaded: false,
  // };

  async componentDidMount() {

    console.disableYellowBox = true;
    this.loadAssets();
    try {
      await FileSystem.readDirectoryAsync(
        FileSystem.cacheDirectory + "mapaction"
      );
      FileSystem.deleteAsync(FileSystem.cacheDirectory + "mapaction");
    } catch (ex) {}
    try {
      await FileSystem.readDirectoryAsync(
        FileSystem.cacheDirectory + "mapactionvideo"
      );
      FileSystem.deleteAsync(FileSystem.cacheDirectory + "mapactionvideo");
    } catch (ex) {}
  }
  async loadAssets() {
    const images = [
      require("./assets/actionmap.png"),
      require("./assets/actionmapBlanc.png"),
      require("./assets/iconApp.png"),
      require("./assets/ill1.gif"),
      require("./assets/ill2.gif"),
      require("./assets/ill3.gif"),
      require("./assets/icon.png"),
    ];

    const promises = images.map((i) => Asset.fromModule(i).downloadAsync());
    await Promise.all(promises);
    this.setState({ assetLoaded: true });
  }
  render() {
    // const { isLoadingComplete } = this.state;
    // if (
    //   !isLoadingComplete &&
    //   !this.props.skipLoadingScreen &&
    //   !this.state.assetLoaded
    // ) {
    //   return (
    //     <AppLoading
    //       startAsync={() => null}
    //       onError={() => <Text>Error</Text>}
    //       onFinish={() => this.setState({ isLoadingComplete: true })}
    //     />
    //   );
    // }
    
    return (
      
      <View style={{ flex: 1, backgroundColor: "#2D9CDB" }}>
          <StatusBar barStyle="light-content" backgroundColor="#2D9CDB" />
          <SafeAreaProvider>
            <SafeAreaView style={{ flex: 1 }}>
              <Provider store={store}>
              
                <StackNavigation />
                {/* <InscriptionChoice/> */}
                {/* < MapboxPlacesInput /> */}
                {/* < InputOTP /> */}
                {/* <PhoneIncription/> */}
              </Provider>
            </SafeAreaView>
          </SafeAreaProvider>
      </View>
      
    );
  }
}
