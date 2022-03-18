import React, { useContext, useState, useEffect } from "react";
import { ScrollView, View, Text, StyleSheet, Image, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native'
import useCollection from "../hooks/useCollection";
import { useNavigation } from '@react-navigation/native';
import { Context as LangContext } from '../context/LangContext'

const Sentence = ({ route }) => {
    const [collectionApi, sentences, errorMessage] = useCollection("sentences")
    const contextLang = useContext(LangContext)
    const navigation = useNavigation();

    const { categoryId } = route.params

    let selection = sentences.filter(sentence => sentence.categoryId.includes(categoryId))
    selection = selection.filter(select => select.symbol == contextLang.state.lang)
    console.log(selection);
    
    
    return (
        <>
            
            <FlatList style={{ width: "100%" }}
                    data={selection}
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(select) => select._id}
                    renderItem={({ item,index }) => {
                        return (
                            <Text>{item.sentence}</Text>

                        )
                    }}
                />
        </>
    )
}

export default Sentence