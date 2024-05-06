import {React, useState, useEffect, useRef} from 'react'
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native'

export default function EmailInscription(){
    const [email, onChangeEmail] = useState('');
    return (
        <View style={styles.container}>
            <View style={styles.input}>
                <TextInput 
                    onChangeText={onChangeEmail}
                    value={email}
                    placeholder='Entrez votre email'
                    autoComplete='tel'
                />
            </View>
            <View style={styles.send}>
                <TouchableOpacity>
                    <Text style={styles.sendText}>Envoyer</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        alignItems:'center',
        backgroundColor:'#fff'
    },
    input:{
        width:'65%',
        height:'5%',
        borderRadius:5,
        borderWidth:0.5,
        marginBottom:'50%',
        justifyContent:'center',
        alignItems:'center',
        marginTop:'60%'
    },
    inputText:{

    },
    send:{
        width:'40%',
        height:'5%',
        borderRadius:20,
        backgroundColor:'#21a33f',
        justifyContent:'center',
        alignItems:'center'
    },
    sendText:{
        color:'white',
        fontWeight:'600'

    }

    
})