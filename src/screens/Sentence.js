import React, { useContext, useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, ImageBackground } from 'react-native'
import useCollection from "../hooks/useCollection";
import { useNavigation } from '@react-navigation/native';
import { Context as LangContext } from '../context/LangContext'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { API_URL } from '../../config'
import { Audio } from 'expo-av';
import mainApi from "../api/mainApi";

import { Button, Paragraph, Dialog, Portal, Provider } from 'react-native-paper';
import ColoredModal from "../components/ColoredModal";

const Sentence = ({ route }) => {
    const [collectionApi, sentences, errorMessage] = useCollection("sentences")
    const [wordsApi, coloredWords, wordsErrorMessage] = useCollection("coloredWords")
    const contextLang = useContext(LangContext)
    const navigation = useNavigation();

    const [targetLang, setTargetLang] = useState("en")
    const [modalVisible, setModalVisible] = useState(-1);
    const [visible, setVisible] = useState(false);

    const [hiddenCount, setHiddenCount] = useState(0)
    const [level, setLevel] = useState();

    const { categoryId, categoryName } = route.params

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

        setTargetLang(await AsyncStorage.getItem("targetLang"))
        setLevel(await AsyncStorage.getItem("level"))
    }, [])

    let selection = sentences.filter(sentence => sentence.categoryId.includes(categoryId))
    selection = selection.filter(select => select.level.includes(level))

    const handleHidden = () => {
        console.log(selection.length, " ", hiddenCount);

        if (selection.length - 1 == hiddenCount) {
            setHiddenCount(0)
        }
        else if (selection.length > hiddenCount) {
            setHiddenCount(hiddenCount + 1)
        }
    }

    async function playSound(url) {
        //await Audio.requestPermissionsAsync();
        const { sound } = await Audio.Sound.createAsync({ uri: url },
            { shouldPlay: true });
    }

    const like = async () => {

        try {
            const email = await AsyncStorage.getItem("email")
            const token = await AsyncStorage.getItem("token");
            const config = {
                headers: { Authorization: `Arflok: ${token}` }
            };
            const response = await mainApi.post(`/data/pushData/users/${email}/likedSentences`, { likedSentenceId: selection[hiddenCount]._id, targetLangSymbol: selection[hiddenCount].symbol, symbol: contextLang.state.lang, sentence: selection[hiddenCount].sentence }, config)

            if (response.data.success) {
                setVisible(true)
                console.log("eklendi");
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
                    <Text style={styles.texttitle}>{contextLang.state.lessons} / {categoryName}</Text>
                </View>
                <View style={styles.fview}>
                    <FlatList style={{ width: "100%" }}
                        data={selection}
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(select) => select._id}
                        renderItem={({ item, index }) => {
                            let flashCardTarget = item.flashCards.filter(flashCard => flashCard.symbol == targetLang)[0]
                            let flashCardNative = item.flashCards.filter(flashCard => flashCard.symbol == contextLang.state.lang)[0]

                            let flashCardColoredWords = coloredWords.filter(word => word.flashCardId == flashCardTarget._id)
                            console.log(flashCardColoredWords, "$$$$$$$$$$$$$$$$$$$$$");
                            return (
                                <>
                                    {index == hiddenCount ?
                                        <View hidden={true} style={{ paddingTop: 20 }}>
                                            <ImageBackground source={{ uri: API_URL + item.img }} imageStyle={styles.br10} resizeMode="stretch" style={styles.bosimage}>
                                                <View style={styles.soundicon1}>
                                                    <View style={styles.soundiconcircle} >
                                                        <TouchableOpacity onPress={() => playSound(API_URL + flashCardTarget.audioPath)} style={styles.mt14}><Image source={require('../../assets/sound.png')} /></TouchableOpacity>
                                                    </View>
                                                </View>
                                            </ImageBackground>
                                            <View style={styles.textview}>
                                                <Text style={styles.text1}>{flashCardTarget.sentence}</Text>
                                                <Text style={styles.text2}>{flashCardNative.sentence}</Text>
                                                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>

                                                    {flashCardTarget.dailySentence.split(" ").map((sentence, index) => {
                                                        let word = flashCardColoredWords.filter(word => word.word == sentence)

                                                        if (word.length > 0) {
                                                            return (
                                                                <View key={index}>
                                                                    <TouchableOpacity onPress={() => setModalVisible(index)}><Text style={styles.text3}>{word[0].word} </Text></TouchableOpacity>
                                                                    <ColoredModal index={index} modalVisible={modalVisible} setModalVisible={setModalVisible}  word={word[0]} playSound={playSound} nativeLang={contextLang.state.lang}/>
                                                                </View>
                                                            )
                                                        } else {
                                                            return (<Text key={sentence} style={styles.text4}>{sentence} </Text>)

                                                        }
                                                    })}
                                                </View>

                                            </View>

                                            <TouchableOpacity onPress={() => navigation.navigate("Question")} >
                                                <Text style={{ textAlign: "center", marginTop: 25 }}>Quiz Sayfasına Geç</Text>
                                            </TouchableOpacity>

                                        </View>
                                        : null}
                                </>
                            )
                        }}
                    />
                </View>
                <View style={styles.bottomContainer}>
                    <ImageBackground source={require('../../assets/footer_bg.png')} resizeMode="stretch" style={styles.image}>
                        <TouchableOpacity style={styles.footerview}>
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
        alignItems: "center",
        marginTop: 50
    },
    mt14: {
        marginTop: 14
    },
    soundiconcircle: {
        width: 70,
        height: 70,
        lineHeight: 0,
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
        color: "#F6AE00", fontWeight: "500", fontSize: 18, marginTop: 50, textAlign: "center"
    },
    text4: {
        color: "#7DA0B9", fontWeight: "500", fontSize: 18, marginTop: 50, textAlign: "center"
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