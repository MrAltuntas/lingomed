import React, { useState, useContext, useEffect } from "react";

import { Context as LangContext } from '../context/LangContext'
import { Context as UserContext } from '../context/UserContext'

import { ScrollView, View, Text, StyleSheet, Image, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native'
import LinearGradient from '../components/LinearGradient';
import GlobalStyles from '../style/Global';
import FormSubmitButton from '../components/Forms/FormSubmitButton';

import { useNavigation } from '@react-navigation/native';
import { backgroundColor } from "react-native/Libraries/Components/View/ReactNativeStyleAttributes";
import { API_URL } from '../../config'
import useCollection from "../hooks/useCollection";

const Welcome = () => {
    const contextLang = useContext(LangContext)
    const userContext = useContext(UserContext)

    const navigation = useNavigation();
    const [nativeLang, setNativeLang] = useState(userContext.state.nativeLang);

    const [collectionApi, langs, errorMessage] = useCollection("lang")


    const handleLangChange = (lang) => {
        contextLang.changeLang(lang)
        setNativeLang(lang)
    }

    return (
        <View style={styles.container}>
            <View style={{ flex: 1 }}>
                <Text style={styles.texttitle}>{contextLang.state.chooseNativeLang}</Text>
            </View>
            <View style={{ flex: langs.length-1 }}>
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
                            <TouchableOpacity style={styles.buttonView} onPress={() => handleLangChange(item.symbol)}>
                                {nativeLang == item.symbol ?
                                    <Image style={{ width: 93, height: 93, opacity: 1 }} source={{ uri: API_URL + item.img }} />
                                    :
                                    <Image style={{ width: 93, height: 93, opacity: 0.3 }} source={{ uri: API_URL + item.img }} />}
                                <Text style={styles.text}>{item.name}</Text>
                            </TouchableOpacity>
                        )
                    }}
                />
            </View>
            <View style={{ flex: 1 }}>
                <FormSubmitButton title={contextLang.state.chooseGo} onPress={() => navigation.navigate('Welcome2', { nativeLang: nativeLang })} />
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
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
        textAlign: 'center'
    },
    tinyLogo: {
        width: 93,
        height: 93
    },
    text: { textAlign: 'center', color: '#075CAB', fontSize: 15, margin: 10 },
});

export default Welcome