import React, { useEffect } from "react"
import { View, ImageBackground, Text, StyleSheet, Dimensions } from "react-native"
import { Button } from "react-native-elements"
import {THEME} from "./theme"
import {permissionLocation} from "../shared/location"
const Home = ({navigation}) => {
    useEffect(()=>{
        if(!permissionLocation){
            alert("vous devez accorder la permission de localisation")
        }
    })
    return (
        <ImageBackground
            source={require('./images/bg.jpg')}
            style={style.backgroundImage}
        >
            <Text style={style.text}>
                اطلب القضية الي تحب علاها واحنا نجيبوهالك
            </Text>
            <Button
                title="اطلب قضية جديدة"
                buttonStyle={style.button1}
                titleStyle={style.textButton1}
                onPress={()=>{navigation.navigate('NewOrder')}}
            />
            <Button
                title="شوف قضياتك"
                buttonStyle={style.button2}
                titleStyle={style.textButton2}
                onPress={()=>{navigation.navigate('Orders')}}
            />
        </ImageBackground>
    )
}

export default Home;
const {width,height} = Dimensions.get('window');

const style = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        opacity: 1,

    },
    button1: {
        backgroundColor: THEME.backgroundColor1,
        width: width * 0.75,
        marginTop: 25,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#FEFEFE',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    button2: {
        backgroundColor: THEME.backgroundColor2,
        width: width * 0.75,
        marginTop: 25,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#FEFEFE',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    textButton1:{
        fontSize:24,
        color:THEME.Color2,
        fontWeight:"bold"
    },
    textButton2:{
        fontSize:24,
        color:THEME.Color1,
        fontWeight:"bold"
    },
    text:{
        fontSize:28,
        textAlign: "center",
        color: THEME.Color2
    }
})