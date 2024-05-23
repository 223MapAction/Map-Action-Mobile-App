import React,{Component} from 'react'
import {View,Text,StyleSheet,Image,TouchableOpacity} from 'react-native'
import {Icon} from "react-native-elements";
import image from "../assets/image.jpg";
import { LinearGradient } from 'expo-linear-gradient';

class DetailOng extends Component{
     
    constructor(props) {
        super(props);
    
        props.navigation.setOptions({ title: this.props.route.params.title || "Détail ONG" });
    }
    
    render(){
        return(
            <View style={styles.container}>
                
                <View>

                
                <Image source={image} style={styles.discussion}/>
                
                    <View style={{paddingHorizontal:10, marginTop:30}}>
                        <Text style={{color:'#2D9CDB', fontWeight:"500", fontSize:14}}>Qui sommes-nous ?</Text>
                        <Text style={{color:'#858585', fontWeight:"300", fontSize:12}}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do , consectetur adipiscing elit, sed do , consectetur adipiscing elit, sed do</Text>
                    </View>
                    
                    <TouchableOpacity style={{backgroundColor:'#49DD7B', marginTop:40 , borderRadius:100, width:60, height:60, alignSelf:"center", justifyContent:"center"}} /* onPress={() => this.props.navigation.navigate('Picture')} */>
                        <Icon name={'question-answer'} type={'MaterialIcons'} size={25} color={'#FFF'}/>
                    </TouchableOpacity>
                </View>

                
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingStart:10,
        backgroundColor: '#fff',
        flexDirection:"column",
        justifyContent:"space-between"
    },
    discussion:{
        width:150,height:150, justifyContent:"center",alignSelf:"center", marginTop:10,
        shadowOpacity:0.5,
        shadowRadius:1,
        shadowOffset:{
            width:3,
            height:3
        },
        shadowColor:"#ccc",
        elevation:5,
    }
});
export default DetailOng
