import React, { useState, useContext } from "react";

import { Context as LangContext } from '../context/LangContext'
import { Context as UserContext } from '../context/UserContext'

import { ScrollView, View, Text, StyleSheet, Image, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native'
import LinearGradient from '../components/LinearGradient';
import GlobalStyles from '../style/Global';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage'
import mainApi from '../api/mainApi';
import useCollection from "../hooks/useCollection";
import { API_URL } from '../../config'
import { RadioButton } from 'react-native-paper';
import FormSubmitButton from "../components/Forms/FormSubmitButton";
const Welcome2 = ({ route }) => {
    const contextLang = useContext(LangContext)
    const userContext = useContext(UserContext)

    const navigation = useNavigation();
    const { nativeLang } = route.params
    const [checked, setChecked] = React.useState("beginner");

    const [targetLang, setTargetLang] = useState()
    const [collectionApi, langs, errorMessage] = useCollection("lang")

    const handleSubmit = async (userInit) => {

        const token = await AsyncStorage.getItem("token");
        await AsyncStorage.setItem("isUserInit", "true");
        const config = {
            headers: { Authorization: `Arflok: ${token}` }
        };

        try {
            const response = await mainApi.post('/data/initUser', userInit, config)
            if (response.data.success == true) {
                userContext.updateUser("update", {targetLang: userInit.targetLang, nativeLang: userInit.nativeLang, level: userInit.level})
                navigation.navigate('MainStackScreen')
            }
        } catch (error) {
            console.log(error.response);
        }
    }

    if (langs.length == 0) {
        return (
            <View styleDrawer={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size="large" />
            </View>
        )
    }

    const result = langs.filter(lang => lang.symbol != nativeLang);
    return (
        <View style={styles.container}>
            <View style={{ flex: 1 }}>
                <Text style={styles.texttitle}>{contextLang.state.whicLanguage}</Text>
            </View>
            <View style={{ flex: 4 }}>

                <FlatList
                    data={result}
                    horizontal={false}
                    numColumns={2}
                    ListHeaderComponent={null}
                    ListFooterComponent={null}
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(lang) => lang._id}
                    renderItem={({ item }) => {
                        return (
                            < TouchableOpacity style={styles.buttonView} onPress={() => setTargetLang(item.symbol)}>
                                {targetLang == item.symbol ?
                                    <Image style={{ width: 93, height: 93, opacity: 1 }} source={{ uri: API_URL + item.img }} />
                                    :
                                    <Image style={{ width: 93, height: 93, opacity: 0.3 }} source={{ uri: API_URL + item.img }} />}
                                <Text style={styles.text}>{item.name}</Text>
                            </TouchableOpacity>
                        )
                    }}
                />
                <View style={{ flexDirection: "row", justifyContent: "center"}}>
                    <TouchableOpacity style={{ flexDirection: "row", justifyContent: "center", marginTop: 20 }} onPress={() => setChecked('beginner')}>

                        <RadioButton color="#075CAB"
                            value="beginner"
                            status={checked === 'beginner' ? 'checked' : 'unchecked'}
                            onPress={() => setChecked('beginner')}/>
                        <Text style={styles.rtext}>{contextLang.state.beginner}</Text>

                    </TouchableOpacity>

                    <TouchableOpacity style={{ flexDirection: "row", justifyContent: "center", marginTop: 20 }} onPress={() => setChecked('intermediate')}>
                        <RadioButton color="#075CAB"
                            value="intermediate"
                            status={checked === 'intermediate' ? 'checked' : 'unchecked'}
                            onPress={() => setChecked('intermediate')}
                        />
                        <Text style={styles.rtext}>{contextLang.state.intermediate}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={{ flexDirection: "row", justifyContent: "center", marginTop: 20 }} onPress={() => setChecked('advance')}>
                        <RadioButton color="#075CAB"
                            value="advance"
                            status={checked === 'advance' ? 'checked' : 'unchecked'}
                            onPress={() => setChecked('advance')}
                        />
                        <Text style={styles.rtext}>{contextLang.state.advance}</Text>
                    </TouchableOpacity>

                </View>
            </View>
            <View style={{ flex: 1, justifyContent: "center" }}>
                <FormSubmitButton title={contextLang.state.chooseGo} onPress={() => handleSubmit({ targetLang, level: checked, nativeLang })} />
            </View>
        </View >
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
        marginTop: 15,
        marginBottom: 50,
        textAlign: 'center',
        width: '100%',
    },
    rtext: {
        color: '#505050',
        margin: 8,
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
    text: { textAlign: 'center', color: '#075CAB', fontSize: 15, margin: 10 },
});

export default Welcome2