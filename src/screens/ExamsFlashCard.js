import React, { useContext, useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, ImageBackground } from 'react-native'
import useCollection from "../hooks/useCollection";
import { useNavigation } from '@react-navigation/native';
import { Context as LangContext } from '../context/LangContext'
import { Context as UserContext } from '../context/UserContext'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { API_URL } from '../../config'
import { Audio } from 'expo-av';
import mainApi from "../api/mainApi";

import { Button, Paragraph, Dialog, Portal, Provider } from 'react-native-paper';
import ColoredModal from "../components/ColoredModal";

const Sentence = ({ route }) => {
    const [collectionApi, examSentences, errorMessage] = useCollection("examSentences")
    const contextLang = useContext(LangContext)
    const userContext = useContext(UserContext)

    const navigation = useNavigation();

    const [modalVisible, setModalVisible] = useState(-1);
    const [visible, setVisible] = useState(false);

    const [hiddenCount, setHiddenCount] = useState(0)

    const { examId, examName, examsCategoryId, examsCategoryName } = route.params


    let selection = examSentences.filter(sentence => sentence.examId == examId)
    selection = selection.filter(sentence => sentence.categoryId.includes(examsCategoryId))

    const handleHidden = () => {
        if (selection.length - 1 == hiddenCount) {
            navigation.navigate("Question", { categoryId })
            setHiddenCount(0)
        }
        else if (selection.length > hiddenCount) {
            setHiddenCount(hiddenCount + 1)
        }
    }
    const sound = new Audio.Sound()

    async function playSound(url) {
        //setSoundObj(await Audio.Sound.createAsync({ uri: url },{ shouldPlay: true }))
        await sound.unloadAsync();
        await sound.loadAsync({ uri: url })
        await sound.playAsync();
    }

    const like = async () => {
        try {
            const token = await AsyncStorage.getItem("token");
            const config = {
                headers: { Authorization: `Arflok: ${token}` }
            };
            const response = await mainApi.post(`/data/pushData/users/${userContext.state.email}/likedSentences`, { id: selection[hiddenCount]._id, symbol: userContext.state.targetLang }, config)
            if (response.data.success && response.data.data.likedSentences.length > 0) {
                userContext.updateUser("pushLikedSentence", { id: selection[hiddenCount]._id, symbol: userContext.state.targetLang, _id: response.data.data.likedSentences.slice(-1)[0]._id })

                setVisible(true)
            }

        } catch (error) {
            alert("Favori Cümlelere Eklenemedi!!!")
            console.log(error);
        }
    }
    const hideDialog = () => setVisible(false);

    return (
        <Provider>
            <View style={styles.container}>
                <View style={{ marginLeft: 20, marginRight: 20, borderBottomColor: '#075CAB', borderBottomWidth: 1, marginBottom: 30, }}>
                    <Text style={styles.texttitle}>{contextLang.state.lessons} / {examsCategoryName}</Text>
                </View>
                <View style={styles.fview}>
                    <FlatList style={{ width: "100%" }}
                        data={selection}
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(select) => select._id}
                        renderItem={({ item, index }) => {
                            let flashCardTarget = item.flashCards.filter(flashCard => flashCard.symbol == userContext.state.targetLang)[0]
                            let flashCardNative = item.flashCards.filter(flashCard => flashCard.symbol == userContext.state.nativeLang)[0]

                            return (
                                <>
                                    {index == hiddenCount ?
                                        <View hidden={true} style={{ paddingTop: 50, flexDirection: "column", justifyContent: "center" }}>
                                            <View style={{ flexDirection: "row", justifyContent: "center"}}>
                                                <View style={styles.soundiconcircle} >
                                                    <TouchableOpacity onPress={() => playSound(API_URL + flashCardTarget.audioPath)} style={styles.mt14}><Image source={require('../../assets/sound.png')} /></TouchableOpacity>
                                                </View>
                                            </View>

                                            <View style={[styles.textview, {marginTop: 50}]}>
                                                <Text style={styles.text1}>{flashCardTarget.sentence}</Text>
                                                <Text style={styles.text2}>{flashCardNative.sentence}</Text>
                                            </View>

                                            {/* <TouchableOpacity onPress={() => navigation.navigate("Question")} >
                                                <Text style={{ textAlign: "center", marginTop: 25 }}>Quiz Sayfasına Geç</Text>
                                            </TouchableOpacity> */}

                                        </View>
                                        : null}
                                </>
                            )
                        }}
                    />
                </View>

                <View style={styles.bottomContainer}>
                    <ImageBackground source={require('../../assets/footer_bg.png')} resizeMode="stretch" style={styles.image}>
                        <TouchableOpacity onPress={() => playSound(API_URL + selection[hiddenCount].flashCards.filter(flashCard => flashCard.symbol == userContext.state.targetLang)[0].dailyAudioPath)} style={styles.footerview}>
                            <Image style={styles.footerimage} source={require('../../assets/soundyellow.png')} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.footerview} onPress={() => handleHidden()}>
                            <Image style={styles.footerimage} source={require('../../assets/change.png')} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.footerview} onPress={() => like()}>
                            <Image style={styles.footerimage} source={require('../../assets/begen.png')} />
                        </TouchableOpacity>
                    </ImageBackground>
                </View>


                <Portal>
                    <Dialog visible={visible} onDismiss={hideDialog}>
                        <Dialog.Title>Favori</Dialog.Title>
                        <Dialog.Content>
                            <Paragraph>{contextLang.state.addedToFavori}</Paragraph>
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button onPress={hideDialog}>Ok</Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal>
            </View>
        </Provider>
    )
}


const styles = StyleSheet.create({
    textview: {
        alignItems: "center"
    },
    mt14: {
        marginTop: 14
    },
    soundiconcircle: {
        width: 70,
        height: 70,
        alignItems: 'center',
        borderRadius: 100,
        backgroundColor: 'orange'
    },
    soundicon1: { position: "absolute", bottom: -30 },
    br10: { borderRadius: 10 },
    fview: { flex: 4, paddingLeft: 20, paddingRight: 20 },
    text1: {
        color: "#F6AE00",
        fontWeight: "bold",
        fontSize: 22
    },
    text2: {
        color: "#7DA0B9", fontSize: 18
    },
    text3: {
        color: "#F6AE00", fontWeight: "500", fontSize: 14, marginTop: 50, textAlign: "center"
    },
    text4: {
        color: "#7DA0B9", fontWeight: "500", fontSize: 14, marginTop: 50, textAlign: "center"
    },
    footerview: {
        flex: 1, alignItems: "center"
    },
    image: {
        flex: 1,
        justifyContent: "center",
        width: "100%",
        alignContent: "center",
        alignItems: "center",
        flexDirection: "row"
    },
    bosimage: {
        justifyContent: "center",
        width: "100%",
        height: 200,
        alignContent: "center",
        alignItems: "center",
        flexDirection: "row",
        position: "relative",
        borderRadius: 20
    },
    bottomContainer: {
        height: 101,
        justifyContent: 'flex-end',
        marginTop: 0,

    },
    container: {
        flex: 1,
        padding: 0,
        backgroundColor: '#C5EBFE',
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
    footerimage: {
        marginTop: 20,
        alignItems: "center",
        width: 35,
        height: 32
    }
});



export default Sentence