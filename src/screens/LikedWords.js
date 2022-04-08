import React, { useState, useContext, useEffect } from "react";

import { Context as LangContext } from '../context/LangContext'
import { Context as UserContext } from '../context/UserContext'

import { ScrollView, View, Text, StyleSheet, Image, TouchableOpacity, FlatList, ActivityIndicator, TextInput } from 'react-native'

import { Audio } from 'expo-av';

import AsyncStorage from '@react-native-async-storage/async-storage'
import mainApi from "../api/mainApi";
import ModalDictionary from "../components/ModalDictionary";
import { Button, Paragraph, Dialog, Portal, Provider } from 'react-native-paper';
import useCollectionByIdMultiple from "../hooks/useCollectionByIdMultiple";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LingomedBottomMenu from "../components/NavigationMenus/BottomMenu/LingomedBottomMenu";


const LikedWords = () => {
    const contextLang = useContext(LangContext)
    const userContext = useContext(UserContext)

    const [targetLang, setTargetLang] = useState({ symbol: "en", order: 1, alphabet: [] })

    const [collectionApi, collectionWords, errorMessage] = useCollectionByIdMultiple()
    const [collectionApiColored, collectionColored, errorMessageColored] = useCollectionByIdMultiple()

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



        let ids = []
        let _ids = []
        userContext.state.likedWords.map(likedWord => {
            if (likedWord.symbol == userContext.state.targetLang) {
                ids.push(likedWord.id)
                _ids.push(likedWord._id)
            }
        })

        collectionApi("dictionary", ids)
        collectionApiColored("coloredWords", ids)
        setTargetLang({ symbol: userContext.state.targetLang, likedWordIds: _ids, wordIds: ids })

    }, [visible])

    async function playSound(url) {
        const { sound } = await Audio.Sound.createAsync({ uri: url }, { shouldPlay: true });
    }

    const deleteWord = async (id) => {
        try {
            const token = await AsyncStorage.getItem("token");

            const config = {
                headers: { Authorization: `Arflok: ${token}` }
            };
            const response = await mainApi.post(`/data/removeData/users/${userContext.state.email}/likedWords`, { id }, config)

            if (response.data.success) {
                userContext.updateUser("removeLikedWord", id)
                showDialog()
                console.log("eklendi");
            }

        } catch (error) {
            alert("Favori Cümlelere Eklenemedi!!!")
            console.log(error.response.data);
        }
    }
    let data = collectionWords.concat(collectionColored)
    return (
        <Provider>
            <View style={styles.container}>
                <View style={{ marginLeft: 20, marginRight: 20, borderBottomColor: '#075CAB', borderBottomWidth: 1, marginBottom: 30, }}>
                    <Text style={styles.texttitle}>{contextLang.state.lessons} </Text>
                </View>
                <View style={styles.innerContainer}>
                    <View style={styles.wordsCover}>
                        <FlatList
                            data={data}
                            showsHorizontalScrollIndicator={false}
                            keyExtractor={(selectedWords) => selectedWords._id}
                            renderItem={({ item, index }) => {
                                console.log(item);
                                return (
                                    <>
                                        {item.flashCardId ? item.symbol == targetLang.symbol ?
                                        
                                            <View style={{ flexDirection: "row", borderColor: "#ECECEC", borderRadius: 5, borderWidth: 1, marginTop: 15 }}>
                                                <TouchableOpacity onPress={() => setModalVisible(index)} style={[styles.wordsInnerCover, { flex: 8 }]} >
                                                    <Text style={styles.wordText}>{item.word}</Text>
                                                    <ModalDictionary coloredObj={item} colored={true} index={index} showDialog={showDialog} modalVisible={modalVisible} setModalVisible={setModalVisible} likedWordId={targetLang.likedWordIds[index]} id={item._id} word={item.translations}
                                                        playSound={playSound} nativeLang={contextLang.state.lang} targetLang={targetLang.symbol} deleteData={true} />
                                                </TouchableOpacity>
                                                <TouchableOpacity onPress={() => deleteWord(targetLang.likedWordIds[index])} style={[styles.wordsInnerCover, { flex: 1 }]}>
                                                    <Icon name="text-box-remove" size={26} />
                                                </TouchableOpacity>
                                            </View>
                                            :
                                            null
                                            :
                                            <View style={{ flexDirection: "row", borderColor: "#ECECEC", borderRadius: 5, borderWidth: 1, marginTop: 15 }}>
                                                <TouchableOpacity onPress={() => setModalVisible(index)} style={[styles.wordsInnerCover, { flex: 8 }]} >
                                                    <Text style={styles.wordText}>{item.words.filter(word => word.symbol == targetLang.symbol)[0].word}</Text>
                                                    <ModalDictionary index={index} showDialog={showDialog} modalVisible={modalVisible} setModalVisible={setModalVisible} likedWordId={targetLang.likedWordIds[index]} id={item._id} word={item.words}
                                                        playSound={playSound} nativeLang={contextLang.state.lang} targetLang={targetLang.symbol} deleteData={true} />
                                                </TouchableOpacity>
                                                <TouchableOpacity onPress={() => deleteWord(targetLang.likedWordIds[index])} style={[styles.wordsInnerCover, { flex: 1 }]}>
                                                    <Icon name="text-box-remove" size={26} />
                                                </TouchableOpacity>
                                            </View>
                                        }
                                    </>

                                )
                            }}
                        />
                    </View>
                </View>

            </View>
            <View>
                <Portal>
                    <Dialog visible={visible} onDismiss={hideDialog}>
                        <Dialog.Title>Favori</Dialog.Title>
                        <Dialog.Content>
                            <Paragraph>{contextLang.state.addedToFavori}</Paragraph>
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button onPress={hideDialog}>Done</Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal>
            </View>
        </Provider>

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
        marginTop: 0,
    },
    wordText: {
        fontSize: 16,
        color: "#505050",
        marginLeft: 10
    },
    texttitle: {
        color: '#075CAB',
        fontWeight: '500',
        fontSize: 17,
        marginTop: 40,
        marginBottom: 10,
        textAlign: 'left',
        width: '100%',
    },
});

export default LikedWords