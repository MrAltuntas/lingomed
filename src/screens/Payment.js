import LinearGradient from '../components/LinearGradient';
import React, { Component, useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import { CreditCardInput, LiteCreditCardInput } from "../components/CreditCardInput";


const Payment = () => {

    const [cardType, setCardType] = useState(false)


    const onChange = (formData) => console.log(JSON.stringify(formData, null, " "));
    const onFocus = (field) => console.log("focusing", field);

    const handleCardType = () => {
        setCardType(!cardType)
    }

    return (
        <View style={styles.container}>
            <LinearGradient startPlace={1} endPlace={0} height={300} />
            
            <View style={styles.vtitle}>
                <Text style={styles.texttitle}>Ödeme sayfası</Text>
            </View>

            <CreditCardInput
                autoFocus
                requiresName
                requiresCVC

                labelStyle={styles.label}
                inputStyle={styles.input}
                allowScroll={true}
                validColor={"black"}
                invalidColor={"red"}
                placeholderColor={"darkgray"}

                onFocus={onFocus}
                onChange={onChange} />

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 0,
        backgroundColor: '#C5EBFE',
    },
    vtitle: {
        marginLeft: 20,
        marginRight: 20,
        borderBottomColor: '#075CAB',
        borderBottomWidth: 1,
        marginBottom: 30
    },
    texttitle: {
        color: '#075CAB',
        fontWeight: 'bold',
        fontSize: 40,
        marginTop: 40,
        textAlign: 'center',
        width: '100%',
    },
    containerInner: {
        backgroundColor: "#F5F5F5",
        marginTop: 60,
    },
    label: {
        color: "black",
        fontSize: 12,

    },
    input: {
        fontSize: 16,
        color: "black",
    },
});

export default Payment