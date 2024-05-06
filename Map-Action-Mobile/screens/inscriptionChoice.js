import {React, useCallback, useEffect, useRef, useState} from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialIcons, AntDesign, Entypo, Feather } from "@expo/vector-icons";

export default function InscriptionChoice(){
    return (
        <View style={styles.container}>
            <View style={styles.phone}>
            <Feather name="phone" size={24} color="white" />               
            <TouchableOpacity>
                    <Text style={styles.phoneText}>S'inscrire avec un numéro de téléphone</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.email}>
                <View style={{justifyContent:'flex-start'}}>
                    <AntDesign name="mail" size={24} color="white" />
                </View>
                <TouchableOpacity>
                    <Text style={styles.emailText}>S'inscrire avec un email</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.social}>
                <Entypo name="network" size={24} color="white" />
                <TouchableOpacity>
                    <Text style={styles.socialtext}>S'inscrire avec un réseau social</Text>
                </TouchableOpacity>
            </View>
        </View>
        
    )
}
const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'#fff',
    },
    phone:{
        backgroundColor: '#35c2de',
        width:'65%',
        height:50,
        borderRadius:20,
        alignItems:'center',
        margin:'3%',
        flexDirection:'row',
        justifyContent:'space-around',

    },
    phoneText:{
        color:'#fff',
        fontSize:14,
        fontWeight:'600'
    },
    email:{
        backgroundColor: '#85506e',
        width:'65%',
        height:50,
        borderRadius:20,
        alignItems:'center',
        justifyContent:'space-around',
        flexDirection:'row',
        // paddingHorizontal:10,
    },
    emailText:{
        color:'#fff',
        fontSize:14,
        fontWeight:'600'
    },
    social:{
        backgroundColor: '#5e5d5e',
        width:'65%',
        height:50,
        borderRadius:20,
        alignItems:'center',
        flexDirection:'row',
        justifyContent:'space-around',
        margin:'3%'

    },
    socialtext:{
        color:'#fff',
        fontSize:14,
        fontWeight:'600'
    },
})