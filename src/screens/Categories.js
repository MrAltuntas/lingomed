import React, { useContext, useState } from "react";

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

const Categories = () => {
    const contextLang = useContext(LangContext)

    const navigation = useNavigation();
    const [count, setCount]=useState(0);
    const [collectionApi, Categories, errorMessage] = useCollection("lessonsCategories")
    
    const categoryNames = []

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
        <View contentContainerStyle={{ flexGrow: 1, minHeight: '100%' }} canCancelContentTouches="false">
            <View style={GlobalStyles.container}>
                <LinearGradient startPlace={1} endPlace={0} height={200} />
                <Text style={styles.texttitle}>Dersler</Text>
                <FlatList style={{ width: "100%" }}
                    data={categoryNames}
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(category) => category._id}
                    renderItem={({ item,index }) => {
                        return (
                            <TouchableOpacity style={styles.buttonView} onPress={() => navigation.navigate('Sentence', { categoryId: item.categoryId })}>
                                <View style={styles.textCover}>
                                    <View style={{flexDirection:'row', flexWrap:'wrap'}}>
                                        <Badge style={{margin: 10, marginRight: 0, backgroundColor: "#ffff", borderColor: "#075CAB", borderWidth: 1,  color: "#075CAB"}}>{index+1}</Badge>
                                        <Text style={styles.text}>{item.name}</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        )
                    }}
                />

            </View>
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
        borderBottomColor: "#075CAB",
        borderBottomWidth: 1
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

export default Categories