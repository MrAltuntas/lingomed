import React, { useState, useContext, useEffect } from "react";

import { Context as LangContext } from '../context/LangContext'
import { Context as UserContext } from '../context/UserContext'

import { ScrollView, View, Text, StyleSheet, Image, TouchableOpacity, FlatList, ActivityIndicator, TextInput } from 'react-native'

import { Audio } from 'expo-av';
import useCollectionStartsWith from "../hooks/useCollectionStartsWith";
import useCollectionIncludes from "../hooks/useCollectionIncludes";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage'
import mainApi from "../api/mainApi";
import ModalDictionary from "../components/ModalDictionary";
import { Button, Paragraph, Dialog, Portal, Provider } from 'react-native-paper';


const Dictionary = () => {
    const contextLang = useContext(LangContext)
    const userContext = useContext(UserContext)

    const [targetLang, setTargetLang] = useState({ symbol: "en", order: 1, alphabet: [] })

    const [collectionApi, collectionWords, errorMessage] = useCollectionStartsWith()
    const [includesApi, includesWords, includesError] = useCollectionIncludes()

    const [selectedFilter, setSelectedFilter] = useState("A");

    const [modalVisible, setModalVisible] = useState(-1);

    // alert alert
    const [visible, setVisible] = React.useState(false);
    const showDialog = () => setVisible(true);
    const hideDialog = () => setVisible(false);
    // for alert

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
        let targetLang = userContext.state.targetLang

        try {
            const response = await mainApi.get(`/data/getAccessible/lang`, config)
            if (response.data.success) {

                response.data.data.map(lang => {

                    if (lang.symbol == targetLang) {
                        collectionApi("dictionary", "words." + lang.order + ".word", "a")
                        setTargetLang({ symbol: targetLang, order: lang.order, alphabet: lang.alphabet })
                    }
                })

            }
        } catch (error) {
            console.log(error);
        }

    }, [])

    const handleChrachterChange = (chrachter) => {
        collectionApi("dictionary", "words." + targetLang.order + ".word", chrachter)
        setSelectedFilter(chrachter)
    }
    async function playSound(url) {
        const { sound } = await Audio.Sound.createAsync({ uri: url }, { shouldPlay: true });
    }
    const handleSearch = async (searchString) => {
        await includesApi("dictionary", "words." + targetLang.order + ".word", searchString ? searchString : ">£#$£>#$dsfasdf")
    }

    return (
        <Provider>
            <View style={styles.container}>
                <View style={styles.innerContainer}>
                    <View style={styles.searchSection}>
                        <Icon style={styles.searchIcon} name="magnify" size={20} color="#000" />
                        <TextInput
                            style={styles.input}
                            placeholder={contextLang.state.searchWord}
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
                                        <ModalDictionary userContext={userContext} index={index} showDialog={showDialog} modalVisible={modalVisible} setModalVisible={setModalVisible} id={item._id} word={item.words} playSound={playSound} nativeLang={userContext.state.nativeLang} targetLang={targetLang.symbol} />
                                    </TouchableOpacity>
                                )
                            }}
                        />
                    </View>
                </View>
            </View>
            <View>
                <Portal>
                    <Dialog style={styles.modalView} visible={visible} onDismiss={hideDialog}>
                        <Dialog.Content>
                            <Paragraph style={styles.modalText}>{contextLang.state.addedToFavori}</Paragraph>
                        </Dialog.Content>
                    </Dialog>
                </Portal>
            </View>
        </Provider>

    )
}

const styles = StyleSheet.create({
    modalText: {
        color: "#fff",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalView: {
        margin: 0,
        backgroundColor: "#1566B1",
        borderRadius: 20,
        padding: 5,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
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