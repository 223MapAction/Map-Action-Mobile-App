import React from "react";
import { MaterialIcons } from '@expo/vector-icons';

export default ({focused,name,color,...rest})=>{
    let iconName = name;
    if(focused){
        iconName = name
    }
    return <MaterialIcons focused={focused} name={iconName} size={24} style={{color}} {...rest}/>
}