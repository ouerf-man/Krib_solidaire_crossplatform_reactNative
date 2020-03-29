import React, { Component } from 'react'
import { ScrollView, View, Text, StyleSheet, Dimensions, KeyboardAvoidingView, TouchableOpacity, ToastAndroid } from "react-native"
import { Input, Icon, Button, Image } from "react-native-elements"
import { THEME } from "./theme"
import { db, getInstanceId } from './firebase/init';
import { permissionLocation } from "../shared/location"
import Geolocation from '@react-native-community/geolocation';


function zeroFill(num) {
    return (num < 10 ? '0' : '') + num;
}

function getDateString() {
    const date = new Date();

    return date.getFullYear() + '-' +
        zeroFill(date.getMonth() + 1) + '-' +
        zeroFill(date.getDate());
}

class NewOrder extends Component {

    constructor(props) {
        super(props);
        this.state = {
            service: [],
            user: "",
            adresse: "",
            tel: "",
            order: "",
            errorMessage: "",
            loading: false,
            lag: "",
            lng: "",
            errorPosition: ""
        };
        this.secondTextInput = {}
        this.thirdTextInput = {}
        this.forthTextInput = {}
    }

    fieldIsEmpty(name, adresse, phone, orders) {
        if (name.trim() === "" || adresse.trim() === "" || phone.trim() === "" || orders.length == 0) return true
    }

    componentDidMount() {
        if (permissionLocation) {
            Geolocation.getCurrentPosition((info) => {
                const result = info.coords;
                let lag = result.latitude
                let lng = result.longitude
                this.setState({ lag: lag, lng: lng })
            }, (err) => {
                this.setState({ errorMessage: err.message })
            }, { maximumAge: 9999999, timeout: 5000 })
        }
    }

    sendData() {
        if (this.state.lag === '' && this.state.errorMessage === "") {
            setTimeout(() => { this.sendData() }, 2000)
            return
        }
        if (this.state.errorMessage !== "") {
            ToastAndroid.show("الرجاء ملأ جميع الخانات", ToastAndroid.SHORT);
            return;
        }
        const date = new Date();
        const userId = getInstanceId();
        const orderId = Date.now() + userId.toString();
        const dateString = getDateString();
        const name = this.state.user.toString();
        const adress = this.state.adresse.toString();
        const phone = this.state.tel.toString();
        const service = this.state.service.join("");
        const lag = this.state.lag.toString()
        const lng = this.state.lng.toString()
        if (this.fieldIsEmpty(name, adress, phone, service)) {
            this.setState({ errorMessage: "الرجاء ملأ جميع الخانات" });
            ToastAndroid.show("الرجاء ملأ جميع الخانات", ToastAndroid.SHORT);
            return;
        }
        try {
            if (userId) {
                db.ref(`${userId}/services/${orderId}`).set({
                    user: name,
                    adresse: adress,
                    tel: phone,
                    service: service,
                    dateDemande: date.toString(),
                    lag: lag,
                    lng: lng,
                    etat: 0
                })
                    .then(() => {
                        this.setState({
                            service: [],
                            user: "",
                            adresse: "",
                            tel: "",
                            service: "",
                            errorMessage: "",
                            loading: false,
                            lag: "",
                            lng: ""

                        })
                    })
                    .catch(e => { throw new Error(e); this.setState({ errorMessage: "problème de connexion..." }) })
            }
        } catch (e) {

            this.setState({ errorMessage: 'Sorry, this order couldn\'t be saved :' + e.message });
        }
    }

    render() {

        const { service, user, adresse, tel, order } = this.state
        return (
            <ScrollView
                style={styles.wrapper}
            >
                <KeyboardAvoidingView>
                    <Input
                        inputStyle={styles.input}
                        labelStyle={styles.labelInput}
                        placeholder='الاسم'
                        label="الاسم"
                        returnKeyType="next"
                        autoFocus
                        value={user}
                        onChangeText={(text) => this.setState({ user: text })}
                        onSubmitEditing={() => { this.secondTextInput.focus(); }}
                        blurOnSubmit={false}
                    />
                    <Input
                        ref={(input) => { this.secondTextInput = input; }}
                        inputStyle={styles.input}
                        labelStyle={styles.labelInput}
                        placeholder='حي عبد ربه , نهج حسن عبد ربّه.. المنزل عدد 666'
                        label="العنوان"
                        returnKeyType="next"
                        value={adresse}
                        onChangeText={(text) => this.setState({ adresse: text })}
                        onSubmitEditing={() => { this.thirdTextInput.focus(); }}
                        blurOnSubmit={false}
                    />
                    <Input
                        ref={(input) => { this.thirdTextInput = input; }}
                        labelStyle={styles.labelInput}
                        inputStyle={styles.input}
                        placeholder='54 469 350'
                        label="الهاتف"
                        keyboardType="number-pad"
                        returnKeyType="next"
                        value={tel}
                        onChangeText={(text) => this.setState({ tel: text })}
                        onSubmitEditing={() => { this.forthTextInput.focus(); }}
                        blurOnSubmit={false}
                    />
                    <Input
                        ref={(input) => { this.forthTextInput = input; }}
                        labelStyle={styles.labelInput}
                        inputStyle={styles.input}
                        placeholder='كيلو سميد'
                        label="الطلبات"
                        value={order}
                        returnKeyType="done"
                        onChangeText={(text) => this.setState({ order: text })}
                        leftIcon={() => {
                            return (
                                <TouchableOpacity style={styles.icon} onPress={
                                    () => {
                                        if (order.trim() !== "") {
                                            if (!this.state.service.length) {
                                                this.setState((prevState) => { return prevState.service.push(order) });
                                                this.setState((prevState) => { return prevState.order = "" })
                                            } else {
                                                this.setState((prevState) => { return prevState.service.push(`\n${order}`) });
                                                this.setState((prevState) => { return prevState.order = "" })
                                            }

                                        }
                                    }
                                }>
                                    <Image source={require('./images/plus.png')}
                                        style={{ width: 40, height: 40 }}
                                    />
                                </TouchableOpacity>
                            )
                        }}

                    />
                </KeyboardAvoidingView>
                <View style={styles.orders}>
                    {service ? service.map((item, index) => <Text key={index} style={styles.text}>{item}</Text>) : <View></View>}
                </View>
                <View style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <Button
                        title="ابعث"
                        buttonStyle={styles.button1}
                        titleStyle={styles.textButton1}
                        onPress={() => {
                            this.setState({ loading: true })
                            setTimeout(() => { this.sendData() }, 3000)
                        }}
                        loading={this.state.loading}
                    />
                    {
                        this.state.errorMessage === "" ? <View></View> : <Button title={this.state.errorMessage} buttonStyle={styles.error} />
                    }
                </View>

            </ScrollView >
        );
    }
}

export default NewOrder;
const { width, height } = Dimensions.get('window')
const styles = StyleSheet.create({
    input: {
        textAlign: "right"
    },
    labelInput: {
        marginTop: 30,
        textAlign: "right"
    },
    wrapper: {
        padding: 10
    },
    orders: {
        padding: 40,
        borderBottomWidth: 1,
        borderBottomColor: "#DCDCDC",
        paddingBottom: 20
    },
    text: {
        fontSize: 18,
        marginBottom: 5
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
    textButton1: {
        fontSize: 24,
        color: THEME.Color2,
        fontWeight: "bold"
    },
    icon: {
        width: 50,
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
    },
    error: {
        width: width * .6,
        marginTop: 55,
        backgroundColor: 'red',
        borderRadius: 40
    }
})