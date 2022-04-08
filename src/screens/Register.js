import React, { useContext } from 'react'
import { Text, StyleSheet, Button, ScrollView, View } from 'react-native'

import { Context as LangContext } from '../../src/context/LangContext'
import { AuthContext2 } from '../../src/context/AuthContext2'

import { useNavigation } from '@react-navigation/native';
import { Formik } from 'formik'
import * as yup from 'yup';
import FormInput from '../components/Forms/FormInput';
import FormSubmitButton from '../components/Forms/FormSubmitButton';
import Logo from '../components/Logo';
import LinearGradient from '../components/LinearGradient';

import GlobalStyles from '../style/Global';

let validationSchema = yup.object().shape({
    fullName: yup.string().trim().min(3, 'İsiminizi kontrol ediniz!').required('İsim giriniz!'),
    email: yup.string().email('Mailinizi kontrol ediniz!').required('Mail giriniz!'),
    password: yup.string().trim().min(6, 'Şifreniz çok kısa!').required('Şifre giriniz!'),
    confirmPassword: yup.string().equals([yup.ref('password'), null], "Şifre eşleşmiyor!"),
});

const Register = (props) => {
    const contextLang = useContext(LangContext)
    const { signUp } = useContext(AuthContext2)

    const userInfo = { fullName: "", email: "", password: "", confirmPassword: "" }
    const navigation = useNavigation();

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1, minHeight: '100%' }} canCancelContentTouches="true">
            <View style={GlobalStyles.container}>
            <LinearGradient startPlace={1} endPlace={0} height={300}/>
            <Logo />
                <Formik validationSchema={validationSchema} initialValues={userInfo} onSubmit={(values) => signUp(values)}>

                    {({ values, errors, handleSubmit, handleChange }) => {
                        const { fullName, email, password, confirmPassword } = values
                        return (
                            <>
                                <FormInput value={fullName}
                                    style={GlobalStyles.input}
                                    placeholder="Ad & Soyad"
                                    autoCapitalize={"none"}
                                    error={errors.fullName}
                                    placeholderTextColor="#9D9FA0"
                                    onChangeText={handleChange("fullName")} />

                                <FormInput value={email}
                                    style={GlobalStyles.input}
                                    placeholder="Email"
                                    autoCapitalize={"none"}
                                    keyboardType={"email-address"}
                                    error={errors.email}
                                    placeholderTextColor="#9D9FA0"
                                    onChangeText={handleChange("email")} />

                                <FormInput value={password}
                                    autoCapitalize={"none"}
                                    style={GlobalStyles.input}
                                    placeholder="******"
                                    error={errors.password}
                                    secureTextEntry={true}
                                    placeholderTextColor="#9D9FA0"
                                    onChangeText={handleChange("password")} />

                                <FormInput value={confirmPassword}
                                    autoCapitalize={"none"}
                                    style={GlobalStyles.input}
                                    placeholder="******"
                                    error={errors.confirmPassword}
                                    secureTextEntry={true}
                                    placeholderTextColor="#9D9FA0"
                                    onChangeText={handleChange("confirmPassword")} />

                                <FormSubmitButton
                                    onPress={handleSubmit}
                                    title='KAYIT OL' />
                                {/* {state.errorMessage ? <Text>{state.errorMessage}</Text> : null} */}
                            </>
                        )
                    }}
                </Formik>
                {/* <Button title="login" onPress={() => navigation.navigate("Login")} /> */}
                <View style={[styles.yho, { flexDirection: "row"}]}>                    
                <Text onPress={() => navigation.navigate("Login")} style={[GlobalStyles.titlewhite,{ textAlign:'center' }]}>
                    <Text style={[styles.textorange, {textAlign:'center',marginTop:15}]}>Giriş Yap</Text>
                </Text>
            </View>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    collar: {
        padding: 10,
        margin: 5
    },
    textorange:{
        color:'#FEB401',
        fontSize:16,
        fontWeight:'700'
    },
    yho: {
       
        padding: 10,
        margin: 25,
        bottom: 10
    },
    createlogo: {
        width: 24,
        height: 28,
    },
    loginlogo: {
        width: 21,
        height: 21,
    },
    button: {
        backgroundColor: '#075CAB',
        padding: 15,
        alignItems: 'center',
        borderRadius: 15,
        width: "100%",
        fontSize: 15,
        margin: 15,
    },
    text: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 15
    },
    title: {
        color: '#075CAB',
        fontWeight: '600',
        margin: 15,
        fontSize: 15
    },
    logintitle: {
        color: '#075CAB',
        fontWeight: '600',
        margin: 3,
        fontSize: 13
    },
})

export default Register