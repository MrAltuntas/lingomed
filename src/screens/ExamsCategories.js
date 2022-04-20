import React, { useContext, useState, useEffect } from "react";

import { useNavigation } from '@react-navigation/native';

import { Context as LangContext } from '../context/LangContext'
import { Context as UserContext } from '../context/UserContext'

import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native'
import { Badge } from 'react-native-paper';
import LingomedBottomMenu from "../components/NavigationMenus/BottomMenu/LingomedBottomMenu";

import useCollection from "../hooks/useCollection";



const ExamsCategories = ({ route }) => {
    const contextLang = useContext(LangContext)
    const userContext = useContext(UserContext)

    const { examId, examName } = route.params

    const navigation = useNavigation();
    const [collectionApi, examsCategories, errorMessage] = useCollection("examsCategories")

    const names = []
    examsCategories.map(category => {
        if(category.examId == examId){

            category.names.map(name => {
                if (name.symbol == userContext.state.nativeLang) {
                    let obj = {
                        name: name.name,
                        _id: name._id,
                        examsCategoryId: category._id
                    }
                    names.push(obj)
                }
            })

        }
    })

    return (
        <View style={styles.container}>

            <View style={{ marginLeft: 20, marginRight: 20, borderBottomColor: '#075CAB', borderBottomWidth: 1, marginBottom: 30, }}>
                <Text style={styles.texttitle}>{examName}</Text>
            </View>
            <View style={{ flex: 4, padding: 20, flexDirection: "row" }}>

                <FlatList style={{ width: "100%" }}
                    data={names}
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(category) => category._id}
                    renderItem={({ item, index }) => {
                        return (
                            <TouchableOpacity style={styles.buttonView} onPress={() => navigation.navigate('ExamsFlashCard', { examsCategoryId: item.examsCategoryId, examsCategoryName: item.name, examId: examId, examName: examName})}>
                                <View style={styles.textCover}>
                                    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                        <Badge style={{ margin: 10, marginRight: 0, backgroundColor: "#ffff", borderColor: "#075CAB", borderWidth: 1, color: "#075CAB" }}>{index + 1}</Badge>
                                        <Text style={styles.text}>{item.name}</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        )
                    }}
                />
            </View>

            <LingomedBottomMenu contextLang={contextLang} navigation={navigation}/>

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

export default ExamsCategories