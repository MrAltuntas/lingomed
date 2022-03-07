import React, { useState, useContext } from "react";

import { Context as LangContext } from '../context/LangContext'

import { ScrollView,View,Text,StyleSheet,Image, TouchableOpacity} from 'react-native'
import LinearGradient from '../components/LinearGradient';
import GlobalStyles from '../style/Global';
import FormSubmitButton from '../components/Forms/FormSubmitButton';

import { useNavigation } from '@react-navigation/native';
import { backgroundColor } from "react-native/Libraries/Components/View/ReactNativeStyleAttributes";

const Welcome = () => {
    const contextLang = useContext(LangContext)

    const navigation = useNavigation();
    const [nativeLang, setNativeLang] = useState(contextLang.state.lang);

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1, minHeight: '100%' }} canCancelContentTouches="false">
            <View style={GlobalStyles.container}>
                <LinearGradient startPlace={1} endPlace={0} height={200} />
                <View style={[styles.controlSpace]}>
                    <Text style={styles.texttitle}>Ana dilinizi seçiniz</Text>

                    <TouchableOpacity style={styles.buttonView} onPress={() => setNativeLang("tr")}>
                        <Image style={{ width: 93, height: 93 }, [nativeLang == "tr" ? {opacity: 1}:{opacity: 0.3}]} source={require('../../assets/tr.png')} />
                        <Text style={styles.text}>Türkçe</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.buttonView} onPress={() => setNativeLang("en")}>
                        <Image style={{ width: 93, height: 93 }, [nativeLang == "en" ? {opacity: 1}:{opacity: 0.3}]} source={require('../../assets/en.png')} />
                        <Text style={styles.text}>English</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.buttonView} onPress={() => setNativeLang("de")}>
                        <Image style={{ width: 93, height: 93 }, [nativeLang == "en" ? {opacity: 1}:{opacity: 0.3}]} source={require('../../assets/de.png')} />
                        <Text style={styles.text}>Deutsch</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.buttonView} onPress={() => setNativeLang("ar")}>
                        <Image style={{ width: 93, height: 93 }, [nativeLang == "ar" ? {opacity: 1}:{opacity: 0.3}]} source={require('../../assets/ar.png')} />
                        <Text style={styles.text}>عربى</Text>
                    </TouchableOpacity>

                </View>
                
                <FormSubmitButton title='Seç ve Devam Et' onPress={() => navigation.navigate('Welcome2', {nativeLang:nativeLang})}/>
            </View>
        </ScrollView>
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
    text: { textAlign: 'center', color: '#075CAB', fontSize: 15, margin: 10 },
});

export default Welcome