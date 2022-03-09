import React, { useState, useContext, useEffect } from "react";

import { Context as LangContext } from '../context/LangContext'

import { ScrollView, View, Text, StyleSheet, Image, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native'
import LinearGradient from '../components/LinearGradient';
import GlobalStyles from '../style/Global';
import FormSubmitButton from '../components/Forms/FormSubmitButton';

import { useNavigation } from '@react-navigation/native';
import { backgroundColor } from "react-native/Libraries/Components/View/ReactNativeStyleAttributes";
import {API_URL} from '../../config'
import useCollection from "../hooks/useCollection";

const Welcome = () => {
    const contextLang = useContext(LangContext)

    const navigation = useNavigation();
    const [nativeLang, setNativeLang] = useState(contextLang.state.lang);
    const [collectionApi, langs, errorMessage] = useCollection("lang")
    

    return (
        <View contentContainerStyle={{ flexGrow: 1, minHeight: '100%' }} canCancelContentTouches="false">
            <View style={GlobalStyles.container}>
                <LinearGradient startPlace={1} endPlace={0} height={200} />
                <Text style={styles.texttitle}>Ana dilinizi seçiniz</Text>
                <FlatList
                        data={langs}
                        horizontal={false}
                        numColumns={2}
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(lang) => lang._id}
                        ListHeaderComponent={null}
                        ListFooterComponent={null}
                        renderItem={({ item }) => {
                            return (
                                <TouchableOpacity  style={styles.buttonView} onPress={() => setNativeLang(item.symbol)}>
                                    {nativeLang == item.symbol ? 
                                    <Image style={{ width: 93, height: 93, opacity: 1 }} source={{ uri: API_URL+item.img }} />
                                    :
                                    <Image style={{ width: 93, height: 93, opacity: 0.3 }} source={{ uri: API_URL+item.img }} />}
                                    <Text style={styles.text}>{item.name}</Text>
                                </TouchableOpacity>
                            )
                        }}
                    />
                    <FormSubmitButton title='Seç ve Devam Et' onPress={() => navigation.navigate('Welcome2', { nativeLang: nativeLang })} />
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    texttitle: {
        color: '#075CAB',
        fontWeight: '500',
        fontSize: 20,
        marginTop: 10,
        marginBottom: 50,
        textAlign: 'center',
        width: '100%',
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
        textAlign: 'center'
    },
    tinyLogo: {
        width: 93,
        height: 93
    },
    text: { textAlign: 'center', color: '#075CAB', fontSize: 15, margin: 10 },
});

export default Welcome