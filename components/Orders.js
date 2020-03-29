import React, { Component } from 'react'
import { View, Text, FlatList, StyleSheet, Dimensions } from "react-native"
import { Button } from "react-native-elements"
import { db, getInstanceId } from "./firebase/init"
class Orders extends Component {
    constructor(props) {
        super(props);
        this.state = {
            orders: [{
                tel: "",
                adresse: "",
                dateDemande: "",
                service: ""
            }],
            keys: [],
            errorMessage: 'لا يوجد طلب',
        };
    }

    componentDidMount() {
        this.readData();
    }

    componentDidUpdate(){
        this.readData();
    }

    async handleDelete(index) {
        // Get the users ID
        const uid = getInstanceId();

        let userRef = db.ref(`${uid}/services/${this.state.keys[index].toString()}`);
        try {
            await userRef.remove()
        } catch (e) {
            this.setState({ errorMessage: "error occured" })
        }
    }

    async readData() {

        // Get the users ID
        const uid = getInstanceId();

        // Create a reference
        const ref = db.ref(`${uid}/services`);

        // Fetch the data snapshot
        try {
            await ref.on("value", (snapshot) => {
                const val = snapshot.val()
                if (val) {
                    let result = Object.keys(val).map((key, index) => {
                        return val[key];
                    });
                    let keys = Object.keys(val);
                    this.setState({ orders: result, keys: keys, errorMessage:"" })
                }
            });



        } catch (e) {
            this.setState({ errorMessage: 'problème de connexion...' })
            return;
        }


    }

    render() {

        const renderReturnItem = ({ item, index }) => {
            return (
                <View>
                    <View style={
                        styles.orders
                    }>
                        <View>
                            <Text
                                style={styles.date}
                            >
                                {item.dateDemande}
                            </Text>
                        </View>
                        <View>
                            {item.service ? item.service.split("\n").map((order, index1) => {
                                return (
                                    <Text key={index1} style={styles.order}>
                                        {order}
                                    </Text>
                                )
                            })
                                : <View></View>
                            }
                        </View>
                    </View>
                    {item.service.length >= 1 && <Button title="حذف" buttonStyle={styles.delete} onPress={() => this.handleDelete(index)} />}
                </View>
            )
        }
        return (
            <View>
                {
                    this.state.errorMessage === "" ? <FlatList
                        data={this.state.orders}
                        renderItem={renderReturnItem}
                        keyExtractor={item => item.tel.toString()}
                    /> : <Button title={this.state.errorMessage} containerStyle={{ display: "flex", alignItems: 'center' }} buttonStyle={styles.error} />
                }
            </View>

        )
    }
}

const { width, height } = Dimensions.get("window")

const styles = StyleSheet.create({
    orders: {
        borderBottomColor: "#DCDCDC",
        borderBottomWidth: 1,
        width: width,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 25
    },
    date: {
        fontSize: 8,
        marginRight: 5
    },
    order: {
        fontSize: 15
    },
    delete: {
        backgroundColor: 'red',
        width: 70,
        height: 30
    },
    error: {
        width: width * .6,
        marginTop: 55,
        backgroundColor: 'red'
    }
})

export default Orders;

