// import { createStackNavigator } from "@react-navigation/stack";
// import "moment/locale/fr";

// import React from "react";
// import { NavigationContainer } from "@react-navigation/native";
import Welcome from "../screens/welcome";
// import Accueil from "../screens/accueil";
// import DrawerNavigation from "./DrawerNavigation";

// import Badge from "../screens/badge/badge";
// import DetailSecteur from "../screens/detailSecteur";
// import Communaute from "../screens/newScreen/communaute";
// import Login from "../screens/login";
// import Logout from "../screens/Logout";
// import HeaderLeft from "../utils/HeaderLeft";
// import Inscription from "../screens/inscription";
// import Contact from "../screens/newScreen/Contact";

// import Ville from "../screens/villes";


// import Messages from "../screens/message";
// import Account from "../screens/account";
// import ListIncidents from "../screens/newScreen/ListIncidents";
// import ListIncidents2 from "../screens/badge/ListIncident2";
// import DetailIncident from "../screens/newScreen/DetailIncident";
// import ListChallenge from "../screens/newScreen/ListChallenge";
// import ListChallenge2 from "../screens/badge/ListChallenge2";
// import ChangePassword from "../screens/newScreen/ChangePassword";
// import RecordVideo from "../shared/RecordVideo";
// import Image from "../screens/newScreen/Image";
// import Gallery from "../screens/newScreen/Gallery";
// const Stack = createStackNavigator();
const config = {
  animation: "spring",
  config: {
    stiffness: 1000,
    damping: 500,
    mass: 3,
    overshootClamping: true,
    restDisplacementThreshold: 0.01,
    restSpeedThreshold: 0.01,
  },
};
const MyHeader = ({ scene, previous, navigation }) => {
  const { options } = scene.descriptor;
  const title =
    options.headerTitle !== undefined
      ? options.headerTitle
      : options.title !== undefined
      ? options.title
      : // : scene.route.name;
        "";
  if (options.headerShown === false) return null;

  const showImage = [
    "Register",
    "ForgotPassword",
    "Inscription",
    "Login",
  ].includes(scene.route.name);

  return (
    <Header
      navigation={navigation}
      style={options.headerStyle}
      showImage={showImage}
      title={title}
      leftButton={() => <HeaderLeft colors="#2D9CDB" />}
    />
  );
};
const screenOptions = {
  header: MyHeader,
  gestureEnabled: true,
  transitionSpec: {
    open: config,
    close: config,
  },
  gestureDirection: "vertical",
  cardStyleInterpolator: ({ current, layouts }) => {
    const translateY = current.progress.interpolate({
      inputRange: [0, 1],
      outputRange: [layouts.screen.height, 0],
    });
    const scale = Animated.divide(translateY, 1.5).interpolate({
      inputRange: [0, layouts.screen.height],
      outputRange: [1, 0.6],
    });
    const opacity = translateY.interpolate({
      inputRange: [0, layouts.screen.height],
      outputRange: [1, 0],
    });

    return {
      cardStyle: {
        transform: [{ translateY }, { scale }],
        opacity,
      },
    };
  },
};

// export default class StackNavigation extends React.Component {
//   render() {
//     let initialRouteName = "Welcome";

//     return (
//       <NavigationContainer>
//         <Stack.Navigator
//           headerMode="screen"
//           initialRouteName={initialRouteName}
//           screenOptions={screenOptions}
//         >
//           <Stack.Screen
//             name="Welcome"
//             component={Welcome}
//             options={{ headerShown: false }}
//           />
//           <Stack.Screen
//             name="Categories"
//             component={Categories}
//             options={{
//               title: "Classer l’incident",
//             }}
//           />
//           <Stack.Screen
//             name="Picture"
//             component={Camera}
//             options={{
//               headerShown: false,
//             }}
//           />
//           <Stack.Screen
//             name="Image"
//             component={Image}
//             options={{
//               title: "",
//             }}
//           />
//           <Stack.Screen
//             name="Gallery"
//             component={Gallery}
//             options={{
//               title: "Galerie",
//             }}
//           />

//           <Stack.Screen
//             name="Account"
//             component={Account}
//             options={{
//               title: "Modifier mon profile",
//             }}
//           />
//           <Stack.Screen
//             name="ChangePassword"
//             component={ChangePassword}
//             options={{
//               title: "Modifier mon mot de passe",
//             }}
//           />
//           <Stack.Screen
//             name="ListChallenge2"
//             component={ListChallenge2}
//             options={{
//               title: "Challenges",
//             }}
//           />
//           <Stack.Screen
//             name="ListIncidents"
//             component={ListIncidents}
//             options={{
//               title: "",
//             }}
//           />
//           <Stack.Screen
//             name="ListChallenge"
//             component={ListChallenge}
//             options={{
//               title: "évenements",
//             }}
//           />
//           <Stack.Screen
//             name="IncidentForm"
//             component={IncidentForm}
//             options={{
//               headerShown: false,
//             }}
//           />
//           <Stack.Screen
//             name="DetailIncident"
//             component={DetailIncident}
//             options={{
//               headerShown: false,
//             }}
//           />
//           <Stack.Screen
//             name="DetailSecteur"
//             component={DetailSecteur}
//             options={{
//               title: "",
//             }}
//           />

//           <Stack.Screen
//             name="Accueil"
//             component={Accueil}
//             options={{ headerShown: false }}
//           />
//           <Stack.Screen
//             name="Contact"
//             component={Contact}
//             options={{
//               title: "Nous contacter",
//             }}
//           />
//           <Stack.Screen name="DetailChallenge" component={DetailChallenge} />
//           <Stack.Screen name="DetailVilles" component={DetailVilles} />

//           <Stack.Screen name="DetailOng" component={DetailOng} />
//           <Stack.Screen
//             name="Communaute"
//             component={Communaute}
//             options={{
//               title: "Communautés",
//             }}
//           />
//           <Stack.Screen
//             name="Ville"
//             component={Ville}
//             options={{
//               title: "Villes",
//             }}
//           />
//           <Stack.Screen
//             name="Badge"
//             component={Badge}
//             options={{
//               title: "Gagner un Badge",
//             }}
//           />
//           <Stack.Screen
//             name="NewChallenge"
//             component={NewChallenge}
//             options={{
//               title: "Créer un challenge",
//             }}
//           />
//           <Stack.Screen
//             name="Messages"
//             component={Messages}
//             options={{
//               title: "Message",
//             }}
//           />

//           <Stack.Screen name="Register" component={Register} />
//           <Stack.Screen name="Login" component={Login} />
//           <Stack.Screen name="ForgotPassword" component={ForgotPassword} />

//           <Stack.Screen name="Inscription" component={Inscription} />

//           <Stack.Screen
//             name="Logout"
//             component={Logout}
//             options={{ headerShown: false }}
//           />

//           <Stack.Screen
//             name="DrawerNavigation"
//             component={DrawerNavigation}
//             options={{
//               headerShown: false,
//             }}
//           />
//         </Stack.Navigator>
//       </NavigationContainer>
//     );
//   }
// }
// import RecordVideo from "../shared/RecordVideo";
import Image from "../screens/newScreen/Image";
import Gallery from "../screens/newScreen/Gallery";
import Camera from "../screens/newScreen/Camera";
import IncidentForm from "../screens/newScreen/IncidentForm";
import ForgotPassword from "../screens/ForgotPassword";
import Register from "../screens/newScreen/register";
import Categories from "../screens/Categories";
// import NewChallenge from "../screens/newScreen/newChallenge";
import Messages from "../screens/message";
import Contact from "../screens/newScreen/Contact";
import DetailSecteur from "../screens/detailSecteur";
import Badge from "../screens/badge/badge";
import Ville from "../screens/villes";
import Communaute from "../screens/newScreen/communaute";
// import Inscription from "../screens/inscription";
import Logout from "../screens/Logout";
import DetailChallenge from "../screens/DetailChallenge";
import DetailVilles from "../screens/detailVilles";
import DetailOng from "../screens/detailOng";
import ListChallenge from "../screens/newScreen/ListChallenge";
import ListChallenge2 from "../screens/badge/ListChallenge2";
import Account from "../screens/account";
import ChangePassword from "../screens/newScreen/ChangePassword";
import ListIncidents from "../screens/newScreen/ListIncidents";
import DetailIncident from "../screens/newScreen/DetailIncident";

import Header from "../shared/header";
import { Animated } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import Accueil from "../screens/accueil";
import DrawerNavigation from "./DrawerNavigation";
import { NavigationContainer } from '@react-navigation/native';



const Stack = createStackNavigator();

const StackNavigation = () => {
  let initialRouteName = "Welcome";
  return (
    <NavigationContainer>
    <Stack.Navigator
        headerMode="screen"
        initialRouteName={initialRouteName}
        screenOptions={screenOptions}
    >
      <Stack.Screen
          name="Welcome"
          component={Welcome}
          options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Accueil"
        component={Accueil}
        options={{ headerShown: false }}
      />
      <Stack.Screen
          name="DrawerNavigation"
          component={DrawerNavigation}
          options={{
            headerShown: false,
          }}
        />
      <Stack.Screen
          name="IncidentForm"
          component={IncidentForm}
          options={{
            headerShown: false,
          }}
      />
      <Stack.Screen
          name="Picture"
          component={Camera}
          options={{
            headerShown: false,
          }}
      />
      <Stack.Screen
          name="Image"
          component={Image}
          options={{
            title: "",
          }}
      />
      <Stack.Screen
          name="Gallery"
          component={Gallery}
          options={{
            title: "Galerie",
          }}
      />
      <Stack.Screen
          name="Categories"
          component={Categories}
          options={{
            title: "Classer l’incident",
          }}
       />
       <Stack.Screen
          name="Communaute"
          component={Communaute}
          options={{
            title: "Communautés",
          }}
        />
        <Stack.Screen
          name="Account"
          component={Account}
          options={{
            title: "Modifier mon profile",
          }}
      />
      <Stack.Screen
          name="ChangePassword"
          component={ChangePassword}
          options={{
            title: "Modifier mon mot de passe",
          }}
      />
      {/* <Stack.Screen
          name="NewChallenge"
          component={NewChallenge}
          options={{
            title: "Créer un challenge",
          }}
      /> */}
      <Stack.Screen
          name="ListChallenge"
          component={ListChallenge}
          options={{
            title: "évenements",
          }}
      />
      <Stack.Screen
          name="ListChallenge2"
          component={ListChallenge2}
          options={{
            title: "Challenges",
          }}
      />
      <Stack.Screen
          name="ListIncidents"
          component={ListIncidents}
          options={{
            title: "",
          }}
      />
      <Stack.Screen
          name="DetailIncident"
          component={DetailIncident}
          options={{
            headerShown: false,
          }}
      />
      <Stack.Screen name="DetailChallenge" component={DetailChallenge} />
      <Stack.Screen name="DetailVilles" component={DetailVilles} />
      <Stack.Screen name="DetailOng" component={DetailOng} />
      <Stack.Screen
          name="Badge"
          component={Badge}
          options={{
            title: "Gagner un Badge",
          }}
      />
      <Stack.Screen
          name="Ville"
          component={Ville}
          options={{
            title: "Villes",
          }}
      />
      <Stack.Screen
          name="Messages"
          component={Messages}
          options={{
            title: "Message",
          }}
      />
      <Stack.Screen
          name="Contact"
          component={Contact}
          options={{
            title: "Nous contacter",
          }}
      />
      <Stack.Screen
          name="DetailSecteur"
          component={DetailSecteur}
          options={{
            title: "",
          }}
      />
      
      <Stack.Screen name="Register" component={Register} />
      {/* <Stack.Screen name="Login" component={Login} /> */}
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
      {/* <Stack.Screen name="Inscription" component={Inscription} /> */}

      <Stack.Screen
          name="Logout"
          component={Logout}
          options={{ headerShown: false }}
      />
    </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigation;
