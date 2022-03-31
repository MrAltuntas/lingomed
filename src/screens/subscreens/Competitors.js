import React, {useContext} from "react";
import { ScrollView, View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native'

import { useNavigation } from '@react-navigation/native';
import LingomedBottomMenu from "../../components/NavigationMenus/BottomMenu/LingomedBottomMenu";

import { Context as LangContext } from '../../context/LangContext'

const Competitors = () => {
    const navigation = useNavigation();
    const contextLang = useContext(LangContext)

    return (
        <View style={styles.container}>
            <Text>Competitors Page</Text>
            <View style={{ marginLeft: 20, marginRight: 20, marginBottom: 30, }}>
            </View>
            <View style={{ flex: 4, padding: 20, flexDirection: "row" }}>

               
            </View>
            <LingomedBottomMenu contextLang={contextLang} navigation={navigation} />
        </View>
    )
}
const styles = StyleSheet.create({
    texttitle: {
        color: '#075CAB',
        fontWeight: '500',
        fontSize: 20,
        marginTop: 50,
        marginBottom: 10,
        textAlign: 'left',
        width: '100%',

    },
    container: {
        flex: 1,
        padding: 0,
        backgroundColor: '#C5EBFE',
    },
    controlSpace: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 30
    },
    buttonView: {
        width: '100%',
        alignItems: "center",
        textAlign: 'center'
    },
    tinyLogo: {
        width: 93,
        height: 93
    },
    text: {
        textAlign: 'left',
        color: '#075CAB',
        fontSize: 15,
        margin: 10,
    },
    textCover: {
        width: "80%",
        height: 50,
        backgroundColor: "#ffff",
        borderRadius: 10,
        marginTop: 10,
        justifyContent: "center"
    }
});


export default Competitors