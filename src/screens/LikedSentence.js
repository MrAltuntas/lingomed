import React, { useState, useContext, useEffect } from "react";

import { Context as LangContext } from '../context/LangContext'
import { Context as UserContext } from '../context/UserContext'

import { ScrollView, View, Text, StyleSheet, Image, TouchableOpacity, FlatList, ActivityIndicator, TextInput } from 'react-native'

import { useNavigation } from '@react-navigation/native';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage'
import mainApi from "../api/mainApi";
import { Button, Paragraph, Dialog, Portal, Provider } from 'react-native-paper';
import useCollectionByIdMultiple from "../hooks/useCollectionByIdMultiple";


const LikedSentence = () => {
    const contextLang = useContext(LangContext)
    const userContext = useContext(UserContext)

    const [targetLang, setTargetLang] = useState({ symbol: "en", likedSentenceIds: [], sentenceIds: [] })

    const [collectionApi, collectionWords, errorMessage] = useCollectionByIdMultiple()

    const navigation = useNavigation()

    const [deleted, SetDeleted] = useState(true)

    useEffect(async () => {
        let ids = []
        let _ids = []
        userContext.state.likedSentences.map(likedSentence => {
            if (likedSentence.symbol == userContext.state.targetLang) {
                ids.push(likedSentence.id)
                _ids.push(likedSentence._id)
            }
        })

        collectionApi("sentences", ids)
        setTargetLang({ symbol: userContext.state.targetLang, likedSentenceIds: _ids, sentenceIds: ids })
    }, [deleted])


    const deleteSentence = async (id) => {
        try {
            const token = await AsyncStorage.getItem("token");

            const config = {
                headers: { Authorization: `Arflok: ${token}` }
            };
            const response = await mainApi.post(`/data/removeData/users/${userContext.state.email}/likedSentences`, {id: id}, config)

            if (response.data.success) {
                userContext.updateUser("removeLikedSentence", id)
                showDialog()
                SetDeleted(!deleted)
                console.log(contextLang.state.removedLiked);
            }

        } catch (error) {
            alert(contextLang.state.anError)
            console.log(error.response.data);
        }
    }
    // alert alert
    const [visible, setVisible] = React.useState(false);
    const showDialog = () => setVisible(true);
    const hideDialog = () => setVisible(false);
    // for alert

    return (
        <Provider>

            <View style={styles.container}>
            <View style={{ marginLeft: 20, marginRight: 20, borderBottomColor: '#075CAB', borderBottomWidth: 1, marginBottom: 30, }}>
                    <Text style={styles.texttitle}>{contextLang.state.lessons}</Text>
                </View>
                <View style={styles.innerContainer}>

                    <View style={styles.wordsCover}>
                        <FlatList
                            data={collectionWords}
                            showsHorizontalScrollIndicator={false}
                            keyExtractor={(selectedWords,index) => index}
                            renderItem={({ item, index }) => {
                                return (
                                    <View style={{ flexDirection: "row", borderColor: "#ECECEC", borderRadius: 5, borderWidth: 1, marginTop: 15}}>
                                        <TouchableOpacity onPress={() => navigation.navigate("LikedSentencesDetail", { id: item._id })} style={[styles.wordsInnerCover, { flex: 8 }]} >
                                            <Text style={styles.wordText}>{item.flashCards.filter(flashCard => flashCard.symbol == targetLang.symbol)[0].sentence}</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => deleteSentence(targetLang.likedSentenceIds[index])} style={[styles.wordsInnerCover, { flex: 1 }]}>
                                            <Icon name="text-box-remove" size={26} />
                                        </TouchableOpacity>
                                    </View>
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
                            <Paragraph style={styles.modalText}>{contextLang.state.removedLiked}</Paragraph>
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

export default LikedSentence