import React from "react";
import { View, Text, StyleSheet, TextInput, Button } from 'react-native'

const FormInput = (props) => {
    const {placeholder, label, error} = props
    return(
        <>
            <View>
                <Text>{label}</Text>
                {error? <Text>{error}</Text>:null}
            </View>
            <TextInput {...props} ref = {props.innerRef} placeholder={placeholder}/>
        </>
    )
}

export default FormInput