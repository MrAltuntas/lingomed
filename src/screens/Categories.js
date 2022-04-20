import React, { useContext, useState, useEffect } from "react";
import { useNavigation } from '@react-navigation/native';

import { Context as LangContext } from '../context/LangContext'
import { Context as UserContext } from '../context/UserContext'

import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Badge } from 'react-native-paper';

import useCollection from "../hooks/useCollection";
import LingomedBottomMenu from "../components/NavigationMenus/BottomMenu/LingomedBottomMenu";

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
                                        {innerStylies.beginner ? <Icon name="check" style={{ position: "absolute", top: -15, right: 30, opacity: 1, color: "green"}} size={26} />:null}
                                        {innerStylies.intermediate ? <Icon name="check" style={{ position: "absolute", top: -15, right: 15, opacity: 1, color:"orange"}} size={26} />:null}
                                        {innerStylies.advance ? <Icon name="check" style={{ position: "absolute", top: -15, right: 0, opacity: 1, color:"red"}} size={26} />:null}

                                        <Badge style={{ margin: 10, marginRight: 0, backgroundColor: "#ffff", borderColor: "#075CAB", borderWidth: 1, color: "#075CAB" }}>{index + 1}</Badge>
                                        <Text style={styles.text}>{item.name}</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        )
                    }}
                />
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
        width: "100%",
        height: 50,
        backgroundColor: "#ffff",
        borderRadius: 10,
        marginTop: 10,
        justifyContent: "center"
    }
});

export default Categories