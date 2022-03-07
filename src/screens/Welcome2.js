import React, { useState } from "react";
import { ScrollView, View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native'
import LinearGradient from '../components/LinearGradient';
import GlobalStyles from '../style/Global';
import FormSubmitButton from '../components/Forms/FormSubmitButton';
import { RadioButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

import AsyncStorage from '@react-native-async-storage/async-storage'

import mainApi from '../api/mainApi';

const Welcome2 = ({ route }) => {
    const navigation = useNavigation();
    const { nativeLang } = route.params

    const [targetLang, setTargetLang] = useState(nativeLang === "en" ? "tr" : "en")
    const [checked, setChecked] = React.useState("beginner");

    const handleSubmit = async (userInit) => {

        const token = await AsyncStorage.getItem("token");
        const config = {
            headers: { Authorization: `Arflok: ${token}` }
        };

        try {
            const response = await mainApi.post('/data/initUser', userInit, config)
            if (response.data.success == true) {
                navigation.navigate('Lessons')
            }
        } catch (error) {
            console.log(error.response);
        }
    }


    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1, minHeight: '100%' }} canCancelContentTouches="false">
            <View style={GlobalStyles.container}>
                <LinearGradient startPlace={1} endPlace={0} height={200} />
                <View style={[styles.controlSpace]}>
                    <Text style={styles.texttitle}>Hangi Dili Öğrenmek İstiyorsunuz</Text>
                    {nativeLang == "tr" ?
                        null
                        :
                        < TouchableOpacity style={styles.buttonView} onPress={() => setTargetLang("tr")}>
                            <Image style={{ width: 93, height: 93 }, [targetLang == "tr" ? { opacity: 1 } : { opacity: 0.3 }]} source={require('../../assets/tr.png')} />
                            <Text style={styles.text}>Türkçe</Text>
                        </TouchableOpacity>
                    }

                    {nativeLang == "en" ?
                        null
                        :
                        <TouchableOpacity style={styles.buttonView} onPress={() => setTargetLang("en")}>
                            <Image style={{ width: 93, height: 93 }, [targetLang == "en" ? { opacity: 1 } : { opacity: 0.3 }]} source={require('../../assets/en.png')} />
                            <Text style={styles.text}>English</Text>
                        </TouchableOpacity>
                    }

                    {nativeLang == "de" ?
                        null
                        :
                        <TouchableOpacity style={nativeLang == "ar" ? styles.buttonView2 : styles.buttonView} onPress={() => setTargetLang("de")}>
                            <Image style={{ width: 93, height: 93 }, [targetLang == "de" ? { opacity: 1 } : { opacity: 0.3 }]} source={require('../../assets/de.png')} />
                            <Text style={styles.text}>Deutsch</Text>
                        </TouchableOpacity>
                    }

                    {nativeLang == "ar" ?
                        null
                        :
                        <TouchableOpacity style={nativeLang != "ar" ? styles.buttonView2 : styles.buttonView} onPress={() => setTargetLang("ar")}>
                            <Image style={{ width: 93, height: 93 }, [targetLang == "ar" ? { opacity: 1 } : { opacity: 0.3 }]} source={require('../../assets/ar.png')} />
                            <Text style={styles.text}>عربى</Text>
                        </TouchableOpacity>
                    }

                </View>
                <View style={{ flexDirection: "row" }}>
                    <RadioButton
                        value="beginner"
                        status={checked === 'beginner' ? 'checked' : 'unchecked'}
                        onPress={() => setChecked('beginner')}
                    />
                    <Text>Başlagıç</Text>
                    <RadioButton
                        value="intermediate"
                        status={checked === 'intermediate' ? 'checked' : 'unchecked'}
                        onPress={() => setChecked('intermediate')}
                    />
                    <Text>Orta Düzey</Text>
                    <RadioButton
                        value="advanced"
                        status={checked === 'advanced' ? 'checked' : 'unchecked'}
                        onPress={() => setChecked('advanced')}
                    />
                    <Text>İleri Düzey</Text>
                </View>
                <FormSubmitButton title='Seç ve Devam Et' onPress={() => handleSubmit({ targetLang, level: checked, nativeLang })} />
            </View>
        </ScrollView >
    )
}
const styles = StyleSheet.create({
    texttitle: {
        color: '#075CAB',
        fontWeight: '500',
        fontSize: 20,
        marginTop: 70,
        marginBottom: 50,
        textAlign: 'center',
        width: '100%',
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
    buttonView2: {
        width: '50%',
        padding: 10,
        alignItems: "center",
        textAlign: 'center',
        flex: 1
    },
    text: { textAlign: 'center', color: '#075CAB', fontSize: 15, margin: 10 },
});

export default Welcome2