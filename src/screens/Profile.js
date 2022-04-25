import React, { useContext, useState, useEffect, useRef } from "react";

import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Context as LangContext } from '../context/LangContext'
import { Context as UserContext } from '../context/UserContext'
import LinearGradient from '../components/LinearGradient';
import FormSubmitButton from "../components/Forms/FormSubmitButton";
import { TouchableHighlight, Modal, ScrollView, Pressable, Label, View, Text, StyleSheet, Image, ImageBackground, TouchableOpacity, FlatList } from 'react-native'
import GlobalStyles from '../style/Global';
import { Formik } from 'formik'
import * as yup from 'yup';
import FormInput from '../components/Forms/FormInput';
import mainApi from "../api/mainApi";
import { Switch } from 'react-native-paper';
import { API_URL } from "../../config";
import * as ImagePicker from 'expo-image-picker';
import { Button, Paragraph, Dialog, Portal, Provider } from 'react-native-paper';

let validationSchema = yup.object().shape({
    email: yup.string().email('Invalid email!'),
});

const Profile = () => {
    const contextLang = useContext(LangContext)
    const userContext = useContext(UserContext)

    const [voiceEffect, setVoiceEffect] = useState(userContext.state.voiceEffect);
    const [voiceAutoplay, setVoiceAutoplay] = useState(userContext.state.voiceAutoplay);
    const navigation = useNavigation();
    const [image, setImage] = useState(null);
    const [visible, setVisible] = React.useState(false);

    const textInputRef = useRef();

    const onToggleSwitch = () => setVoiceEffect(!voiceEffect);
    const onToggleSwitch2 = () => setVoiceAutoplay(!voiceAutoplay);

    const handleSubmit = async (values) => {
        values["voiceEffect"] = voiceEffect
        values["voiceAutoplay"] = voiceAutoplay

        const token = await AsyncStorage.getItem("token");

        const config = {
            headers: { Authorization: `Arflok: ${token}` }
        };

        try {
            const response = await mainApi.post('/data/updateUser', values, config)

            if (response.data.success == true) {
                userContext.updateUser("update", values)
                setVisible(true)

            }
        } catch (error) {
            console.log(error.response);
        }
    }
    const hideDialog = () => setVisible(false);

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.cancelled) {
            setImage(result.uri);
            const token = await AsyncStorage.getItem("token");

            // ImagePicker saves the taken photo to disk and returns a local URI to it
            let localUri = result.uri;
            let filename = localUri.split('/').pop();

            // Infer the type of the image
            let match = /\.(\w+)$/.exec(filename);
            let type = match ? `image/${match[1]}` : `image`;

            // Upload the image using the fetch and FormData APIs
            let formData = new FormData();
            // Assume "photo" is the name of the form field the server expects
            formData.append('image', { uri: localUri, name: filename, type });

            const reponse = await fetch(`${API_URL}/api/clientUploads/single`, {
                method: 'POST',
                body: formData,
                headers: {
                    'content-type': 'multipart/form-data',
                    Authorization: `Arflok: ${token}`
                },
            });
            const resultt = await reponse.json()
            if (resultt.success == true) {
                const config = {
                    headers: { Authorization: `Arflok: ${token}` }
                };

                try {
                    const response = await mainApi.post('/data/updateUser', { picture: resultt.path }, config)
                    if (response.data.success == true) {
                        userContext.updateUser("update", { picture: resultt.path })
                    }
                } catch (error) {
                    console.log(error.response);
                }

            }
        }
    }

    return (
        <Provider>
            <ScrollView contentContainerStyle={{ flexGrow: 1, minHeight: '100%' }} canCancelContentTouches="true">
                <View style={styles.container}>
                    <LinearGradient startPlace={1} endPlace={0} height={300} />
                    <View style={{ flex: 1, alignItems: "center", marginTop: 40 }}>
                        <View style={styles.profileImgContainer}>
                            <Image source={image ? { uri: image } : { uri: `${API_URL}/${userContext.state.picture}` }} style={styles.profileImg} />
                            <View style={styles.circlewhite}>
                                <TouchableOpacity onPress={pickImage} style={styles.editimgview}>
                                    <Image source={require('../../assets/edit.png')} style={styles.editimg} />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <Formik validationSchema={validationSchema} initialValues={userContext.state} onSubmit={(values) => handleSubmit(values)}>
                            {({ values, errors, handleSubmit, handleChange }) => {

                                return (
                                    <>
                                        <View style={styles.w100}>
                                            <FormInput
                                                style={GlobalStyles.input}
                                                placeholder={userContext.state.fullName}
                                                error={errors.fullName}
                                                placeholderTextColor="#9D9FA0"
                                                onChangeText={handleChange("fullName")}
                                                innerRef={textInputRef} />

                                            <TouchableOpacity style={styles.inputediticon}>
                                                <Image source={require('../../assets/edit.png')} style={styles.editimg} />
                                            </TouchableOpacity>

                                        </View>
                                        <View style={styles.w100}>
                                            <FormInput
                                                style={GlobalStyles.input}
                                                placeholder={userContext.state.email}
                                                keyboardType={"email-address"}
                                                error={errors.email}
                                                placeholderTextColor="#9D9FA0"
                                                onChangeText={handleChange("email")}
                                                editable={false} />
                                            {/* <TouchableOpacity onPress={() => setEditable({ ...editable, email: !editable.email })} style={styles.inputediticon}>
                                            <Image source={require('../../assets/edit.png')} style={styles.editimg} />
                                        </TouchableOpacity> */}
                                        </View>

                                        <FormSubmitButton
                                            onPress={handleSubmit}
                                            title={contextLang.state.save} />

                                        <View style={[styles.wbox, styles.mt50]}>
                                            <View style={styles.spacebetween}>
                                                <Text style={styles.boxtext}>{contextLang.state.selectLang}</Text>
                                                <Image source={{ uri: `${API_URL}/assets/${userContext.state.nativeLang}.png` }} style={[styles.editimg, styles.ml10]} />
                                                <Text style={styles.ml10}>{userContext.state.nativeLang}</Text>
                                            </View>
                                            <TouchableOpacity style={{ marginRight: 15 }} onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Welcome' }], })}>
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
            <View>
                <Portal>
                    <Dialog style={styles.modalView} visible={visible} onDismiss={hideDialog}>
                        <Dialog.Content>
                            <Paragraph style={styles.modalText}>{contextLang.state.userUpdated}</Paragraph>
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