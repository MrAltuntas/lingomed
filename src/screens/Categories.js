import React, { useContext, useState, useEffect } from "react";
import { useNavigation } from '@react-navigation/native';

import { Context as LangContext } from '../context/LangContext'
import { Context as UserContext } from '../context/UserContext'

import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Badge } from 'react-native-paper';

import useCollection from "../hooks/useCollection";
import LingomedBottomMenu from "../components/NavigationMenus/BottomMenu/LingomedBottomMenu";
import AppLoading from 'expo-app-loading';
import { useFonts, ArchivoBlack_400Regular } from '@expo-google-fonts/archivo-black'

import {
    Roboto_100Thin,
    Roboto_100Thin_Italic,
    Roboto_300Light,
    Roboto_300Light_Italic,
    Roboto_400Regular,
    Roboto_400Regular_Italic,
    Roboto_500Medium,
    Roboto_500Medium_Italic,
    Roboto_700Bold,
    Roboto_700Bold_Italic,
    Roboto_900Black,
    Roboto_900Black_Italic
} from '@expo-google-fonts/roboto'

const Categories = () => {
    const contextLang = useContext(LangContext)
    const userContext = useContext(UserContext)

    const navigation = useNavigation();
    const [collectionApi, Categories, errorMessage] = useCollection("lessonsCategories")

    const categoryNames = []
    Categories.map(category => {
        category.categoryNames.map(categoryName => {
            if (categoryName.symbol == userContext.state.nativeLang) {
                let obj = {
                    name: categoryName.name,
                    _id: categoryName._id,
                    categoryId: category._id
                }
                categoryNames.push(obj)
            }
        })
    })

    let [fontsLoaded] = useFonts({
        ArchivoBlack_400Regular,
        Roboto_700Bold,
    });

    if (!fontsLoaded) {
        return <AppLoading />; 
    }

    return (
        <View style={styles.container}>

            <View style={{ marginLeft: 20, marginRight: 20, borderBottomColor: '#075CAB', borderBottomWidth: 1, marginBottom: 30, }}>
                <Text style={styles.texttitle}>{contextLang.state.lessons}</Text>
            </View>
            <View style={{ flex: 4, padding: 20, flexDirection: "row" }}>

                <FlatList style={{ width: "100%" }}
                    data={categoryNames}
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(category) => category._id}
                    renderItem={({ item, index }) => {

                        const finishedCategories = userContext.state.finishedCategories.filter(finishedCategories => finishedCategories.categoryId == item.categoryId && finishedCategories.symbol == userContext.state.targetLang)

                        const innerStylies = {
                            beginner: false,
                            intermediate: false,
                            advance: false
                        }
                        finishedCategories.map(finishedCategory => {
                            switch (finishedCategory.level) {
                                case "beginner":
                                    innerStylies.beginner = true
                                    break;

                                case "intermediate":
                                    innerStylies.intermediate = true
                                    break;

                                case "advance":
                                    innerStylies.advance = true
                                    break;

                                default:
                                    break;
                            }
                        })

                        return (
                            <TouchableOpacity style={styles.buttonView} onPress={() => navigation.navigate('Sentence', { categoryId: item.categoryId, categoryName: item.name })}>
                                <View style={styles.textCover}>
                                    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                        {innerStylies.beginner ? <Icon name="check" style={{ position: "absolute", top: 5, right: 30, opacity: 1, color: "green" }} size={26} /> : null}
                                        {innerStylies.intermediate ? <Icon name="check" style={{ position: "absolute", top: 5, right: 15, opacity: 1, color: "#075CAB" }} size={26} /> : null}
                                        {innerStylies.advance ? <Icon name="check" style={{ position: "absolute", top: 5, right: 0, opacity: 1, color: "red" }} size={26} /> : null}

                                        <Badge style={{ margin: 10, marginRight: 0, fontWeight: "bold", backgroundColor: "#FFB400", borderColor: "#fff", borderWidth: 1, color: "#fff" }}>{index + 1}</Badge>
                                        <Text style={styles.text}>{item.name}</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        )
                    }}
                />
            </View>

            {/* <LingomedBottomMenu contextLang={contextLang} navigation={navigation} />  */}

        </View>
    )
}
const styles = StyleSheet.create({
    texttitle: {
        color: '#075CAB',
        fontSize: 24,
        marginTop: 50,
        marginBottom: 10,
        textAlign: 'left',
        width: '100%',
        fontFamily: "Roboto_700Bold"
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
        color: '#fff',
        fontSize: 15,
        margin: 10,
        fontFamily: "Roboto_700Bold"
    },
    textCover: {
        width: "100%",
        height: 50,
        backgroundColor: "#ffb400",
        borderRadius: 10,
        marginTop: 10,
        justifyContent: "center"
    }
});

export default Categories