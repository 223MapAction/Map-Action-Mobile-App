import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Slide2 from './screens/slides/Slide2';
//import StackNavigation from './components/StackNavigation';
// import Inscription from './screens/Auth';
import Accueil from './screens/accueil';

export default function App() {
  return (
    // <View style={styles.container}>
    //   <Text>Welcome!</Text>
    //   <StatusBar style="auto" />
    // </View>
    <Accueil/>
  );
}

