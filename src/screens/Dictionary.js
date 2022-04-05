import React, { useState, useContext, useEffect } from "react";

import { Context as LangContext } from '../context/LangContext'

import { ScrollView, View, Text, StyleSheet, Image, TouchableOpacity, FlatList, ActivityIndicator, TextInput } from 'react-native'
import LinearGradient from '../components/LinearGradient';
import GlobalStyles from '../style/Global';
import FormSubmitButton from '../components/Forms/FormSubmitButton';
import { Audio } from 'expo-av';

import { useNavigation } from '@react-navigation/native';
import { backgroundColor } from "react-native/Libraries/Components/View/ReactNativeStyleAttributes";
import { API_URL } from '../../config'
import useCollection from "../hooks/useCollection";
import useCollectionStartsWith from "../hooks/useCollectionStartsWith";
import useCollectionIncludes from "../hooks/useCollectionIncludes";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage'
import ColoredModal from "../components/ColoredModal";
import mainApi from "../api/mainApi";
import ModalDictionary from "../components/ModalDictionary";


const Dictionary = () => {
    const contextLang = useContext(LangContext)

    const [nativeLang, setNativeLang] = useState(contextLang.state.lang);
    const [targetLang, setTargetLang] = useState({symbol: "en", order: 1, alphabet: []})

    const [collectionApi, collectionWords, errorMessage] = useCollectionStartsWith()
    const [includesApi, includesWords, includesError] = useCollectionIncludes()

    const [selectedFilter, setSelectedFilter] = useState("A");

    const [modalVisible, setModalVisible] = useState(-1);
    const [searchString, setSearchString] = useState(-1);

    useEffect(async () => {
        await Audio.setAudioModeAsync({
            staysActiveInBackground: true,
            interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
            shouldDuckAndroid: false,
            playThroughEarpieceAndroid: false,
            allowsRecordingIOS: false,
            interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
            playsInSilentModeIOS: true,
        });

        const token = await AsyncStorage.getItem("token");
        const config = {
            headers: { Authorization: `Arflok: ${token}` }
        };
        let targetLang = await AsyncStorage.getItem("targetLang")

        try {
            const response = await mainApi.get(`/data/getAccessible/lang`, config)
            if (response.data.success) {

                response.data.data.map(lang => {

                    if (lang.symbol == targetLang) {
                        collectionApi("dictionary", "words."+lang.order+".word", "a")
                        setTargetLang({symbol: targetLang, order: lang.order, alphabet: lang.alphabet})
                    }
                })

            }
        } catch (error) {
            console.log(error);
        }

    }, [])

    const handleChrachterChange = (chrachter) => {
        collectionApi("dictionary", "words."+targetLang.order+".word", chrachter)
        setSelectedFilter(chrachter)
    }
    async function playSound(url) {
        //await Audio.requestPermissionsAsync();
        const { sound } = await Audio.Sound.createAsync({ uri: url },
            { shouldPlay: true });
    }
    const handleSearch = async (searchString) => {
        await includesApi("dictionary", "words."+targetLang.order+".word", searchString ? searchString : ">£#$£>#$dsfasdf")
    }
    console.log("aaaa");
    // const selectedWords = words.filter(word => word.symbol == targetLang)
    // const selectedIncludesWords = includesWords.filter(word => word.symbol == targetLang)
    return (
        <View style={styles.container}>
            <View style={styles.innerContainer}>
                <View style={styles.searchSection}>
                    <Icon style={styles.searchIcon} name="magnify" size={20} color="#000" />
                    <TextInput
                        style={styles.input}
                        placeholder="Aranacak Kelimeyi Giriniz"
                        onChangeText={(searchString) => handleSearch(searchString)}
                        underlineColorAndroid="transparent"

                    />
                </View>

                <View style={styles.filterCover}>

                    <View style={{ flex: 0.1, }}>
                        <Icon style={{ textAlign: "right" }} name="chevron-left" size={24} color="gray" />
                    </View>

                    <FlatList
                        style={{ flex: 10, }}
                        data={targetLang.alphabet}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(alphabet, index) => index}
                        renderItem={({ item }) => {
                            return (
                                <TouchableOpacity onPress={() => handleChrachterChange(item)}>
                                    <Text style={selectedFilter == item ? styles.filterTextSelected : styles.filterText}>{item}</Text>
                                </TouchableOpacity>
                            )
                        }}
                    />
                    <View style={{ flex: 0.1, }}>
                        <Icon style={{ textAlign: "right" }} name="chevron-right" size={24} color="gray" />
                    </View>

                </View>

                <View style={styles.wordsCover}>
                    
                    <FlatList
                        data={includesWords.length !== 0 ? includesWords : collectionWords}
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(selectedWords) => selectedWords._id}
                        renderItem={({ item, index }) => {
                            return (
                                <TouchableOpacity onPress={() => setModalVisible(index)} style={styles.wordsInnerCover} >
                                    <Text style={styles.wordText}>{item.words.filter(word => word.symbol == targetLang.symbol)[0].word}</Text>
                                    <ModalDictionary index={index} modalVisible={modalVisible} setModalVisible={setModalVisible} word={item.words} playSound={playSound} nativeLang={contextLang.state.lang} targetLang={targetLang.symbol}/>
                                </TouchableOpacity>
                            )
                        }}
                    />
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#C5EBFE',
        borderColor: "#E1E1E1",
        borderWidth: 1
    },
    innerContainer: {
        flex: 1,
        backgroundColor: "#fff",
        borderRadius: 20,
        padding: 20
    },
    searchSection: {
        height: 50,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderColor: "#707070",
        borderBottomWidth: 1
    },
    searchIcon: {
        padding: 10,
    },
    input: {
        flex: 1,
        paddingTop: 10,
        paddingRight: 10,
        paddingBottom: 10,
        paddingLeft: 0,
        backgroundColor: '#fff',
        color: '#424242',
    },
    filterText: {
        fontSize: 15,
        marginLeft: 10,
        marginRight: 10,
        color: "#505050"
    },
    filterTextSelected: {
        fontSize: 15,
        marginLeft: 10,
        marginRight: 10,
        color: "#EC0B0B"
    },
    filterCover: {
        marginTop: 20,
        flexDirection: 'row',
    },
    wordsCover: {
        flexDirection: 'column',
        paddingLeft: 10,
        paddingRight: 10,
        marginTop: 20
    },
    wordsInnerCover: {
        padding: 5,
        marginTop: 20,
        borderColor: "#ECECEC",
        borderRadius: 5,
        borderWidth: 1,

    },
    wordText: {
        fontSize: 16,
        color: "#505050",
        marginLeft: 10
    }
});

export default Dictionary