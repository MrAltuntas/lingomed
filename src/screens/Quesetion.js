import React, { useContext, useState } from "react";

import { useNavigation } from '@react-navigation/native';

import { Context as LangContext } from '../context/LangContext'
import { Context as UserContext } from '../context/UserContext'

import LinearGradient from '../components/LinearGradient';
import { RadioButton } from 'react-native-paper';
import FormSubmitButton from "../components/Forms/FormSubmitButton";
import { Alert, Modal, Pressable, Label, View, Text, StyleSheet, Image, ImageBackground, TouchableOpacity, FlatList } from 'react-native'
import { Audio } from 'expo-av';

import useCollection from "../hooks/useCollection";
import { API_URL } from "../../config";
import finishedCategory from "../helpers/finishedCategory";

const Question = ({ route }) => {
    const { categoryId } = route.params

    const [questionsApi, questions, questionsErrorMessage] = useCollection("questions")

    const contextLang = useContext(LangContext)
    const userContext = useContext(UserContext)
    const navigation = useNavigation();
    const [checked, setChecked] = React.useState();

    const [value, setValue] = React.useState(false);
    const [hiddenCount, setHiddenCount] = useState(0)


    const handleHidden = () => {
        if (datas.length - 1 == hiddenCount) {
            if (value) {
                alert("bingo")

                finishedCategory(userContext.state.targetLang, categoryId, userContext.state.level, userContext.state.email, userContext)
                navigation.navigate("Categories")
                setHiddenCount(0)
            }
        }
        else if (datas.length > hiddenCount) {
            if (value) {
                setHiddenCount(hiddenCount + 1)
                setValue(false)
            }
        }
    }

    const handleCheck = () => {
        if (value) {
            alert("bingo")
        }
    }

    const sound = new Audio.Sound()
    async function playSound(url) {
        //setSoundObj(await Audio.Sound.createAsync({ uri: url },{ shouldPlay: true }))
        await sound.unloadAsync();
        await sound.loadAsync({ uri: url })
        await sound.playAsync();
    }

    const datas = questions.filter(question => question.categoryId.includes(categoryId) && question.level.includes(userContext.state.level) && question.symbol == userContext.state.targetLang )

    return (
        <View style={styles.container}>
            <LinearGradient startPlace={1} endPlace={0} height={300} />
            <View style={styles.vtitle}>
                <Text style={styles.texttitle}>{hiddenCount+1 } / {datas.length}</Text>
                <Text style={styles.texttitle2}>Doğru şıkkı seçin</Text>
            </View>
            <View style={styles.fview}>
                <FlatList
                    data={datas}
                    horizontal={false}
                    numColumns={1}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={(lang) => lang._id}
                    ListHeaderComponent={null}
                    ListFooterComponent={null}
                    renderItem={({ item, index }) => {

                        let selections = []

                        item.selections.map(selection => {
                            if (selection.symbol == userContext.state.nativeLang) {
                                selection.options.map(subSelection => {
                                    selections.push({ selection: subSelection.option, answer: subSelection.answer })
                                })
                            }
                        })
                        return (
                            <>
                                {index == hiddenCount ?
                                    <View style={{ marginLeft: 20, marginRight: 20 }}>
                                        <View style={{ flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", marginBottom: 50 }}>
                                            <TouchableOpacity onPress={() => playSound(API_URL + item.audioPath)} style={styles.soundiconcircle} >
                                                <View style={styles.mt14}><Image source={require('../../assets/sound.png')} /></View>
                                            </TouchableOpacity>
                                            <Text style={{ fontSize: 20, color: "#075CAB", margin: 15 }}>{item.sentence}</Text>
                                        </View>
                                        <RadioButton.Group >
                                            <RadioButton.Item onPress={() => { setChecked(selections[0].selection), setValue(selections[0].answer) }} status={checked === selections[0].selection ? 'checked' : 'unchecked'} style={styles.radioinput} color="#FFB400" label={selections[0].selection} value={selections[0]} />
                                            <RadioButton.Item onPress={() => { setChecked(selections[1].selection), setValue(selections[1].answer) }} status={checked === selections[1].selection ? 'checked' : 'unchecked'} style={styles.radioinput} color="#FFB400" label={selections[1].selection} value={selections[1]} />
                                            <RadioButton.Item onPress={() => { setChecked(selections[2].selection), setValue(selections[2].answer) }} status={checked === selections[2].selection ? 'checked' : 'unchecked'} style={styles.radioinput} color="#FFB400" label={selections[2].selection} value={selections[2]} />
                                        </RadioButton.Group>
                                        <View style={styles.mt20} >
                                            <FormSubmitButton title='Kontrol Et' onPress={() => handleCheck()} />
                                        </View>
                                    </View>
                                    :
                                    null}
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
        </View>

    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 0,
        backgroundColor: '#C5EBFE',
    },
    radioinput: {
        borderRadius: 10,
        margin: 5,
        backgroundColor: "#fff"
    },
    mt20: {
        marginTop: 20
    },
    vtitle: {
        marginLeft: 20,
        marginRight: 20,
        borderBottomColor: '#075CAB',
        borderBottomWidth: 1,
        marginBottom: 30
    },
    texttitle: {
        color: '#075CAB',
        fontWeight: 'bold',
        fontSize: 40,
        marginTop: 40,
        textAlign: 'center',
        width: '100%',
    },
    texttitle2: {
        color: '#757575',
        fontSize: 13,
        marginBottom: 10,
        textAlign: 'center',
        width: '100%',
    },
    fview: {
        flex: 4,
        paddingLeft: 20,
        paddingRight: 20
    },
    soundiconcircle: {
        width: 70,
        height: 70,
        lineHeight: 0,
        alignItems: 'center',
        borderRadius: 100,
        backgroundColor: 'orange'
    },
    mt14: {
        marginTop: 14
    },

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

export default Question