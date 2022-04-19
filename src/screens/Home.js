import React, { useState, useContext, useEffect } from "react";

import { Context as LangContext } from '../context/LangContext'

import { ScrollView, View, Text, StyleSheet, Image, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native'
import LinearGradient from '../components/LinearGradient';
import GlobalStyles from '../style/Global';
import FormSubmitButton from '../components/Forms/FormSubmitButton';

import { useNavigation } from '@react-navigation/native';
import { backgroundColor } from "react-native/Libraries/Components/View/ReactNativeStyleAttributes";
import { API_URL } from '../../config'
import useCollection from "../hooks/useCollection";
import { Context as UserContext } from '../context/UserContext'
import SetLang from "../helpers/SetLang";
import SetUserInfo from "../helpers/SetUserInfo";
import LingomedBottomMenu from "../components/NavigationMenus/BottomMenu/LingomedBottomMenu";

const Home = () => {
    const contextLang = useContext(LangContext)
    const userContext = useContext(UserContext)

    const navigation = useNavigation();
    const [nativeLang, setNativeLang] = useState(contextLang.state.lang);

    useEffect(async () => {
        await SetLang(contextLang)
        await SetUserInfo(userContext)
    }, [])

    return (
            <View style={styles.container}>
                <View style={{ flex: 1, justifyContent: "center", flexDirection:"column", alignItems: "center" }}>
                    <TouchableOpacity style={styles.buttonView} onPress={() => navigation.navigate("Categories")}>
                        <Image style={styles.images} source={require('../../assets/books.jpg')} />
                        <Text style={styles.text}>Dersler</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.buttonView} onPress={() => navigation.navigate("Dictionary")}>
                        <Image style={styles.images} source={require('../../assets/books.jpg')} />
                        <Text style={styles.text}>Sözlük</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.buttonView} onPress={() => navigation.navigate("Exams")}>
                        <Image style={styles.images} source={require('../../assets/books.jpg')} />
                        <Text style={styles.text}>Sınavlar</Text>
                    </TouchableOpacity>
                </View>
                <LingomedBottomMenu contextLang={contextLang} navigation={navigation} />
            </View>
    )

}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#C5EBFE',
    },
    texttitle: {
        color: '#075CAB',
        fontWeight: '500',
        fontSize: 20,
        marginTop: 10,
        textAlign: 'center',
        width: '100%',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
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
        textAlign: 'center',
    },
    tinyLogo: {
        width: 93,
        height: 93
    },
    text: { textAlign: 'center', color: '#075CAB', fontSize: 18, margin: 10, fontWeight: "600" },
    images:{
        width: 120, height: 120, opacity: 1, borderRadius: 100,
        borderColor: "#075CAB", borderWidth: 3
    }
});
export default Home