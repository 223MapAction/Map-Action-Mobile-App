import React,{Component} from 'react'
import {View,Text,StyleSheet,FlatList, ScrollView, TouchableOpacity, Image} from 'react-native'
import mercy from "../assets/image.jpg";

function Ong ({navigation}){
     
        return(
            <View>
                <View style={{flexDirection:"row", marginHorizontal:20, justifyContent:"space-between"}}>
                    <Text style={{fontSize:16, fontWeight:"bold", color:"rgba(0, 0, 0, 0.32)"}}>ONG et autres organismes</Text>
                    <Text style={{fontSize:14, color:"#38A3D0", fontWeight:"500"}}>Voir tout</Text>
                </View>

                <FlatList
                    data={[
                        { mois: "mars", chiffre:275 },
                        { mois: "Fev", chiffre:150 },
                        { mois: "janv", chiffre:45 },
                        { mois: "Dec", chiffre:45 },
                        { mois: "Nov", chiffre:40 },
                        { mois: "Oct", chiffre:30 },
                    ]}
                    showsHorizontalScrollIndicator={false} 
                    horizontal={true}
                    renderItem={({ item }) =>(
                        <ScrollView horizontal={true} style={{height:150}} showsHorizontalScrollIndicator={false} >
                            <TouchableOpacity onPress={()=> navigation.navigate('DetailOng', {title:"Mercy corps"})} style={styles.calendrier}>
                                <Image
                                    style={{width:60, height:60, borderRadius:100, alignSelf:"center"}}
                                    source={mercy}
                                />
                                <Text style={{color:"rgba(0, 0, 0, 0.5)",fontSize:12,}}>Mercy corps</Text>
                                            
                            </TouchableOpacity>
                        </ScrollView>
                    )}
                />
            </View>
        );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingStart:10,
       /*  backgroundColor: '#2d9cdb' */
    },
    calendrier:{
        backgroundColor:"#fff", borderRadius:30, width:115, height:115,shadowColor:"#ccc",
        shadowOpacity:0.5,elevation:5,
        shadowRadius:1,
        shadowOffset:{
            width:3,
            height:3
        },
        justifyContent:"center",
        alignItems:"center",
        marginRight:10,
        marginTop:20
    },
    text:{
        marginHorizontal:10, 
        justifyContent:"center",
        flex:1,
        marginTop:50
    },
    iconStyle: {
        color: '#5a52a5',
        fontSize: 28,
        marginLeft: 15
    },

    ellipse:{
        width:50, 
        height:50, 
        alignSelf:"center",
        justifyContent:"center",
        borderRadius: 50,
        alignItems:"center",
        backgroundColor:"#49DD7B", borderColor:"#FFF", borderWidth:1, 
    },
    ellipse2:{
        width:10, 
        height:10, 
        alignSelf:"center",
        justifyContent:"center",
        borderRadius: 10,
        marginStart:8,
        backgroundColor:"rgba(196, 196, 196, 0.45)", borderColor:"#FFF", borderWidth:1, 
    },

    section: {
        backgroundColor:"#fff", flexDirection: 'row',justifyContent: 'flex-start',alignItems:"center", paddingHorizontal:10, 
    },
    searchIcon: {
        padding: 10,
    },
    itemStyle: {
        marginBottom: 10,flex:1
    },
    bg:{
        width: '100%',
        backgroundColor:"#F8F8F8",
        alignItems: 'center',height: 130,
        overflow: 'hidden',
        marginVertical: 3,
        borderRadius:3,
        flex: 1
    },

});
export default Ong