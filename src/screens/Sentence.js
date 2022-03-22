import React, { useContext, useState, useEffect } from "react";
import { ScrollView, View, Text, StyleSheet, Image, TouchableOpacity, FlatList, ActivityIndicator, ImageBackground } from 'react-native'
import useCollection from "../hooks/useCollection";
import { useNavigation } from '@react-navigation/native';
import { Context as LangContext } from '../context/LangContext'
import AsyncStorage from '@react-native-async-storage/async-storage'
import FormSubmitButton from "../components/Forms/FormSubmitButton";
import { API_URL } from '../../config'
import LingomedBottomMenu from "../components/NavigationMenus/BottomMenu/LingomedBottomMenu";
import { Audio } from 'expo-av';

const Sentence = ({ route }) => {
    const [collectionApi, sentences, errorMessage] = useCollection("sentences")
    const contextLang = useContext(LangContext)
    const navigation = useNavigation();
    const [targetLang, setTargetLang] = useState("en")
    const { categoryId } = route.params
    const [hiddenCount, setHiddenCount] = useState(0)
    const [sound, setSound] = useState();

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
    }, [])

    let selection = sentences.filter(sentence => sentence.categoryId.includes(categoryId))
    selection = selection.filter(select => select.symbol == targetLang)

    const handleHidden = () => {
        console.log(selection.length, " ", hiddenCount);

        if (selection.length - 1 == hiddenCount) {
            setHiddenCount(0)
        }
        else if (selection.length > hiddenCount) {
            setHiddenCount(hiddenCount + 1)
        }
    }

    console.log(selection);
    console.log(targetLang);

    async function playSound() {
        await Audio.requestPermissionsAsync();

        console.log('Loading Sound');
        const { sound } = await Audio.Sound.createAsync({ uri: "https://service.borubukmemakinasi.com/audio/hava.mp3" },
            { shouldPlay: true });
        setSound(sound);

        console.log('Playing Sound');
        //await sound.playAsync();
    }

    return (
        <View style={styles.container}>
            <View style={{ marginLeft: 20, marginRight: 20, borderBottomColor: '#075CAB', borderBottomWidth: 1, marginBottom: 30, }}>
                <Text style={styles.texttitle}>Dersler / Kategori ismi 1</Text>
            </View>
            <View style={styles.fview}>
                <FlatList style={{ width: "100%" }}
                    data={selection}
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(select) => select._id}
                    renderItem={({ item, index }) => {
                        return (
                            <>
                                {index == hiddenCount ?


                                    <View hidden={true} style={{ paddingTop: 20 }}>
                                        <ImageBackground imageStyle={styles.br10} source={{ uri: API_URL + item.img }} resizeMode="stretch" style={styles.bosimage}>
                                            <View style={styles.soundicon1}>
                                                <View style={styles.soundiconcircle} >
                                                    <TouchableOpacity onPress={() => playSound()} style={styles.mt14}><Image source={require('../../assets/sound.png')} /></TouchableOpacity>
                                                </View>
                                            </View>
                                        </ImageBackground>
                                        <View style={styles.textview}>
                                            <Text style={styles.text1}>{item.sentence}</Text>
                                            <Text style={styles.text2}>{item.translations.filter(translation => translation.symbol == contextLang.state.lang)[0].sentence}</Text>


                                        </View>
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
                    <TouchableOpacity style={styles.footerview}>
                        <Image style={styles.footerimage} source={require('../../assets/begen.png')} />
                    </TouchableOpacity>
                </ImageBackground>
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    textview: { alignItems: "center", marginTop: 50 },
    mt14: { marginTop: 14 },
    soundiconcircle: { width: 70, height: 70, lineHeight: 0, alignItems: 'center', borderRadius: 100, backgroundColor: 'orange' },
    soundicon1: { position: "absolute", bottom: -30 },
    br10: { borderRadius: 10 },
    fview: { flex: 4, paddingLeft: 20, paddingRight: 20 },
    vtitle: { marginLeft: 20, marginRight: 20, borderBottomColor: '#075CAB', borderBottomWidth: 1, marginBottom: 30 },
    text1: {
        color: "#F6AE00",
        fontWeight: "bold",
        fontSize: 22
    },
    text2: {
        color: "#7DA0B9", fontSize: 18
    },
    text3: {
        color: "#F6AE00", fontWeight: "500", fontSize: 22, marginTop: 50, textAlign: "center"
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