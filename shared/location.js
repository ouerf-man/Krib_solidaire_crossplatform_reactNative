import Geolocation from 'react-native-geolocation-service';
import { PermissionsAndroid } from "react-native";

let granted = false
try {
     granted =  PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
            title: "Krib solidaire location Permission",
            message:
                "Cool Photo App needs access to your location ",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK"
        }
    );
    
} catch (error) {
    alert('kcp')
}


export const permissionLocation = granted;