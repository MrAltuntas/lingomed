import React, { useState, useContext, useEffect } from "react";

import { ScrollView, View, Text, StyleSheet, Image, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native'
import { useNavigation } from '@react-navigation/native';

import { Context as UserContext } from '../context/UserContext'
import { Context as LangContext } from '../context/LangContext'

import SetUserInfo from "../helpers/SetUserInfo";
import LingomedBottomMenu from "../components/NavigationMenus/BottomMenu/LingomedBottomMenu";

const Home = () => {
    const contextLang = useContext(LangContext)
    const userContext = useContext(UserContext)

    const navigation = useNavigation();

    useEffect(async () => {
        await SetUserInfo(userContext)
        console.log(userContext.state.nativeLang);
        contextLang.changeLang(userContext.state.nativeLang)
    }, [])

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1, minHeight: '100%' }} canCancelContentTouches="true">

            <View style={styles.container}>
                <View style={{ flex: 1, justifyContent: "center", flexDirection:"column", alignItems: "center" }}>
                    <TouchableOpacity style={styles.buttonView} onPress={() => navigation.navigate("Categories")}>
                        <Image style={styles.images} source={require('../../assets/dersler.png')} />
                        <Text style={styles.text}>{contextLang.state.lessons}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.buttonView} onPress={() => navigation.navigate("Dictionary")}>
                        <Image style={styles.images} source={require('../../assets/sozluk.png')} />
                        <Text style={styles.text}>{contextLang.state.dictionary}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.buttonView} onPress={() => navigation.navigate("Exams")}>
                        <Image style={styles.images} source={require('../../assets/books.jpg')} />
                        <Text style={styles.text}>{contextLang.state.exams}</Text>
                    </TouchableOpacity>
                </View>
                {/* <LingomedBottomMenu contextLang={contextLang} navigation={navigation} /> */}
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#C5EBFE',
    },
    texttitle: {
        color: '#075CAB',
        fontWeight: '500',
        fontSize: 20,
        marginTop: 10,
        textAlign: 'center',
        width: '100%',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    controlSpace: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 30
    },
    buttonView: {
        width: '50%',
        padding: 10,
        alignItems: "center",
        textAlign: 'center',
    },
    tinyLogo: {
        width: 93,
        height: 93
    },
    text: { textAlign: 'center', color: '#075CAB', fontSize: 20, margin: 10, fontWeight: "bold" },
    images:{
        width: 120, height: 120, opacity: 1, borderRadius: 100,
        borderColor: "#075CAB", borderWidth: 3
    }
});
export default Home