import React from "react";
import { ActivityIndicator,View ,Keyboard} from 'react-native';
import {styles} from '../secreens/commandes/config'

const Spinner  = ({bg,color})=>{
    Keyboard.dismiss
    const style={
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 10,
        elevation: 3,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: bg
    }

   return  <View style={style}>
        <ActivityIndicator color={color} size="large"/>
    </View>
}
Spinner.defaultProps={
    bg: "#fff",
    color: styles.colorApp.color,
}
export default Spinner

