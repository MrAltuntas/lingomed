import React, { useContext, useState, useEffect } from "react";

import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Context as LangContext } from '../context/LangContext'
import LinearGradient from '../components/LinearGradient';
import { RadioButton } from 'react-native-paper';
import FormSubmitButton from "../components/Forms/FormSubmitButton";
import { TouchableHighlight, Modal, ScrollView, Pressable, Label, View, Text, StyleSheet, Image, ImageBackground, TouchableOpacity, FlatList } from 'react-native'
import GlobalStyles from '../style/Global';
import { Formik } from 'formik'
import * as yup from 'yup';
import FormInput from '../components/Forms/FormInput';
import mainApi from "../api/mainApi";
import useCollection from "../hooks/useCollection";
import { Switch } from 'react-native-paper';
import { API_URL } from "../../config";
import { navigationRef } from "../RootNavigation";

let validationSchema = yup.object().shape({
    email: yup.string().email('Invalid email!').required('Email is required!'),
    password: yup.string().trim().min(6, 'Password is too short!').required('password is required!'),
});

const Profile = () => {
    const [userInfo, setUserInfo] = useState({})
    const [voiceEffect, setVoiceEffect] = useState();
    const [voiceAutoplay, setVoiceAutoplay] = useState();
    const navigation = useNavigation();

    const contextLang = useContext(LangContext)


    const onToggleSwitch = () => setVoiceEffect(!voiceEffect);
    const onToggleSwitch2 = () => setVoiceAutoplay(!voiceAutoplay);


    useEffect(async () => {
        const email = await AsyncStorage.getItem("email");
        const token = await AsyncStorage.getItem("token");

        const config = {
            headers: { Authorization: `Arflok: ${token}` }
        };

        try {
            const response = await mainApi.post('/data/userinfo', { email: email }, config)

            if (response.data.success == true) {
                console.log(response.data.data, "#############################");
                setUserInfo(response.data.data)
                setVoiceEffect(response.data.data.voiceEffect)
                setVoiceAutoplay(response.data.data.voiceAutoplay)
            }
        } catch (error) {
            console.log(error.response);
        }


    }, [])
    console.log(voiceEffect);

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1, minHeight: '100%' }} canCancelContentTouches="true">
            <View style={styles.container}>
                <LinearGradient startPlace={1} endPlace={0} height={300} />
                <View style={{ flex: 1, alignItems: "center", marginTop: 40 }}>
                    <View style={styles.profileImgContainer}>
                        <Image source={{ uri: `${API_URL}/${userInfo.picture}` }} style={styles.profileImg} />
                        <View style={styles.circlewhite}>
                            <View style={styles.editimgview}>
                                <Image source={require('../../assets/edit.png')} style={styles.editimg} />
                            </View>
                        </View>
                    </View>
                    <Formik validationSchema={validationSchema} initialValues={userInfo} onSubmit={(values) => signIn(values)}>
                        {({ values, errors, handleSubmit, handleChange }) => {
                            const { fullName, email, lang } = values
                            return (
                                <>
                                    <View style={styles.w100}>
                                        <FormInput value={fullName}
                                            style={GlobalStyles.input}
                                            placeholder={userInfo.fullName}
                                            error={errors.fullName}
                                            placeholderTextColor="#9D9FA0"
                                            onChangeText={handleChange("fullName")} />
                                        <View style={styles.inputediticon}>
                                            <Image source={require('../../assets/edit.png')} style={styles.editimg} />
                                        </View>
                                    </View>
                                    <View style={styles.w100}>
                                        <FormInput value={email}
                                            style={GlobalStyles.input}
                                            placeholder={userInfo.email}
                                            keyboardType={"email-address"}
                                            error={errors.email}
                                            placeholderTextColor="#9D9FA0"
                                            onChangeText={handleChange("email")} />
                                        <View style={styles.inputediticon}>
                                            <Image source={require('../../assets/edit.png')} style={styles.editimg} />
                                        </View>
                                    </View>

                                    <FormSubmitButton
                                        onPress={handleSubmit}
                                        title={contextLang.state.save} />

                                    <View style={[styles.wbox, styles.mt50]}>
                                        <View style={styles.spacebetween}>
                                            <Text style={styles.boxtext}>{contextLang.state.selectLang}</Text>
                                            <Image source={{ uri: `${API_URL}/assets/${userInfo.nativeLang}.png` }} style={[styles.editimg, styles.ml10]} />
                                            <Text style={styles.ml10}>{userInfo.nativeLang}</Text>
                                        </View>
                                        <TouchableOpacity style={{ marginRight: 15 }} onPress={() => navigation.reset({index: 0,routes: [{ name: 'Welcome' }],})}>
                                            <Image source={require('../../assets/edit.png')} style={styles.editimg} />
                                        </TouchableOpacity>
                                    </View>

                                    <View style={styles.wbox}>
                                        <Text style={styles.boxtext}>{contextLang.state.voiceEffect}</Text>
                                        <View>
                                            <Switch value={voiceEffect} onValueChange={onToggleSwitch} />
                                        </View>
                                    </View>

                                    <View style={[styles.wbox, styles.mb50]}>
                                        <Text style={styles.boxtext}>{contextLang.state.autoPlay}</Text>
                                        <View>
                                            <Switch value={voiceAutoplay} onValueChange={onToggleSwitch2} />
                                        </View>
                                    </View>
                                    {/* {state.errorMessage ? <Text>{state.errorMessage}</Text> : null} */}
                                </>
                            )
                        }}
                    </Formik>
                </View>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 0,
        backgroundColor: '#C5EBFE',
        paddingLeft: 20,
        paddingRight: 20,
    },
    wbox: {
        backgroundColor: "#fff",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        borderRadius: 15,
        margin: 10,
        padding: 12,
        alignContent: "center",
        flexDirection: "row",
        minHeight: 60
    },
    profileImgContainer: {
        marginLeft: 8,
        marginBottom: 50,
        height: 120,
        width: 120,
        borderRadius: 120,
        alignItems: "center",

    },
    profileImg: {
        height: 120,
        width: 120,
        borderRadius: 120,
        borderColor: '#075CAB',
        borderWidth: 2,

    },
    editimg: {
        width: 20,
        height: 20,
    },
    editimgview: {
        alignItems: "center",
        justifyContent: "center",
        height: 40
    },
    circlewhite: {
        backgroundColor: "#fff",
        width: 40,
        height: 40,
        lineHeight: 30,
        bottom: 20,
        textAlign: "center",
        borderRadius: 30,
        shadowColor: "#000",
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    inputediticon: {
        position: "absolute",
        right: 25,
        bottom: 20
    },
    w100: {
        width: "100%"
    },
    boxtext: {
        color: "#505050",
        marginLeft: 10
    },
    mt50: {
        marginTop: 50
    },
    mb50: {
        marginBottom: 50
    },
    spacebetween: {
        justifyContent: "space-between",
        flexDirection: "row"
    },
    ml10: {
        marginLeft: 10
    }
});

export default Profile