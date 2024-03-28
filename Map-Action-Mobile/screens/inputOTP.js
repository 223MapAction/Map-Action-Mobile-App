import React, { useEffect, useRef, useState } from "react";
import { Text, View, StyleSheet, TextInput, Touchable, TouchableOpacity } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  inputText: {
    fontSize: 14,
    color: "rgba(0,0,0,.5)",
    marginBottom:'5%',
    marginHorizontal:'5%',
    marginTop:'10%',

  },
  containerInput:{
    justifyContent:'center',
    alignItems:'center',
    flexDirection:'row'
  },
  place:{
    paddingVertical:11,
    width:40,
    margin:5,
    justifyContent:'center',
    alignItems:'center',
    borderBottomWidth:1,
    marginBottom:'50%'
  },
  placeText:{
    fontSize:12,
  },
  bottonView:{
    flexDirection:'row',
    flex:1,
    alignItems:'flex-end',
    
  },
  bottonViewText:{
    color: "rgba(0,0,0,.5)",
  },
  send:{
    width:150,
    height:50,
    borderRadius:5,
    alignItems:'flex-end',
    justifyContent:'center'
  },
  msg:{
    width:150,
    height:50,
    borderRadius:5,
    alignItems:'flex-start',
    justifyContent:'center'
  },
  sendText:{
    alignItems:'center',
    fontSize:16,
    color:'#234DB7'
  }
});

  
export default function InputOTP() {
    const [internalValue, setInternalValue] = useState(""); 
    const lengthInput = 6; 
    const textInput = useRef(null);
  
    useEffect(() => {
      textInput.current.focus(); 
    }, []);
  
    const onChangeText = (val) => {
      setInternalValue(val);
    };
  
    return (
      <View style={styles.container}>
        <Text style={styles.inputText}>
          Veuillez fournir le code de 6 chiffres qui a été envoyé sur le numéro que vous avez indiqué
        </Text>
        <View>
          <TextInput
            ref={textInput} 
            onChangeText={onChangeText}
            value={internalValue}
            style={{ width: 0, height: 0 }}
            maxLength={lengthInput} 
            returnKeyType="done"
            keyboardType="numeric"
          />
          <View style={styles.containerInput}>
            {
                Array(lengthInput).fill().map((data, index) => (
                    <View style={styles.place} key={index}>
                        <Text 
                            style={[
                                styles.placeText,
                                {
                                    borderBottomColor: index === internalValue.length ? '#FB6C6A':'#234D87'
                                }
                                ]}

                            onPress={()=> textInput.current.focus()}
                            >
                            {internalValue && internalValue.length > 0 ? internalValue[index] : ""}
                        </Text>
                    </View>
                ))
            }
            
          </View>
        </View>
        <View style={styles.bottonView}>
            <TouchableOpacity>
                <View style={styles.msg}>
                    <Text style={styles.bottonViewText}>Vous ne l'avez pas reçu ?</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity>
                <View style={styles.send}>
                <Text style={styles.sendText}>Réenvoyer</Text>
                </View>
            </TouchableOpacity>
            
          
        </View>
      </View>
    );
  }