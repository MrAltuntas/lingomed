import React, { useContext, useState, useEffect } from "react";

import { useNavigation } from '@react-navigation/native';

import { Context as LangContext } from '../context/LangContext'

import { ScrollView, View, Text, StyleSheet, Image, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native'
import LinearGradient from '../components/LinearGradient';
import GlobalStyles from '../style/Global';
import FormSubmitButton from '../components/Forms/FormSubmitButton';

import { backgroundColor } from "react-native/Libraries/Components/View/ReactNativeStyleAttributes";
import { API_URL } from '../../config'
import useCollection from "../hooks/useCollection";
import { Badge } from 'react-native-paper';
import LingomedBottomMenu from "../components/NavigationMenus/BottomMenu/LingomedBottomMenu";
import SetLang from "../helpers/SetLang";

const Categories = () => {
    const contextLang = useContext(LangContext)

    const navigation = useNavigation();
    const [count, setCount] = useState(0);
    const [collectionApi, Categories, errorMessage] = useCollection("lessonsCategories")


    useEffect(async () => {
        await SetLang(contextLang)
    }, [])


    const categoryNames = []
    console.log(contextLang.state);
    Categories.map(category => {
        category.categoryNames.map(categoryName => {
            if (categoryName.symbol == contextLang.state.lang) {
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
            {/* <LinearGradient startPlace={1} endPlace={0} height={200} /> */}

            <View style={{ marginLeft: 20, marginRight: 20, borderBottomColor: '#075CAB', borderBottomWidth: 1, marginBottom: 30, }}>
                <Text style={styles.texttitle}>{contextLang.state.lessons}</Text>
            </View>
            <View style={{ flex: 4, padding: 20, flexDirection: "row" }}>

                <FlatList style={{ width: "100%" }}
                    data={categoryNames}
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(category) => category._id}
                    renderItem={({ item, index }) => {
                        return (
                            <TouchableOpacity style={styles.buttonView} onPress={() => navigation.navigate('Sentence', { categoryId: item.categoryId, categoryName: item.name})}>
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

export default Categories