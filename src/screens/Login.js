import React, { useContext, useEffect } from 'react'
import { Text, StyleSheet, Button, Pressable, ScrollView, View, Image } from 'react-native'

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

import SetLang from '../helpers/SetLang';



const Login = (props) => {

    const contextLang = useContext(LangContext)
    const { signIn } = useContext(AuthContext2)

    const userInfo = { email: "", password: "" }
    const navigation = useNavigation();

    let validationSchema = yup.object().shape({
        email: yup.string().email(contextLang.state.unCorrectEmail).required(contextLang.state.enterEmail),
        password: yup.string().trim().min(6, contextLang.state.unCorrectPassword).required(contextLang.state.enterPassword),
    });

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1, minHeight: '100%' }} canCancelContentTouches="true">
            <View style={GlobalStyles.container}>
                <LinearGradient startPlace={1} endPlace={0} height={200} />
                <Logo />
                <Formik validationSchema={validationSchema} initialValues={userInfo} onSubmit={(values) => signIn(values)}>

                    {({ values, errors, handleSubmit, handleChange }) => {
                        const { email, password } = values
                        return (
                            <>

                                <FormInput value={email}
                                    style={GlobalStyles.input}
                                    placeholder="E-mail"
                                    keyboardType={"email-address"}
                                    autoCapitalize={"none"}
                                    placeholderTextColor="#9D9FA0"
                                    error={errors.email}
                                    onChangeText={handleChange("email")} />

                                <FormInput value={password}
                                    style={GlobalStyles.input}
                                    placeholder={contextLang.state.password}
                                    placeholderTextColor="#9D9FA0"
                                    error={errors.password}
                                    autoCapitalize={"none"}
                                    secureTextEntry={true}
                                    onChangeText={handleChange("password")} />

                                <FormSubmitButton
                                    onPress={handleSubmit}
                                    title={contextLang.state.login} />


                                {/* {state.errorMessage ? <Text>{state.errorMessage}</Text> : null} */}
                            </>
                        )
                    }}
                </Formik>
                <Text onPress={() => navigation.navigate("ForgetPassword")} style={styles.title}>
                    {contextLang.state.forgetPassword}
                </Text>

                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                    <View style={{ flex: 1, height: 1, backgroundColor: '#61A0D2' }} />
                    <View>
                        <Text style={{ width: 50, textAlign: 'center', color: '#61A0D2' }}>{contextLang.state.or}</Text>
                    </View>
                    <View style={{ flex: 1, height: 1, backgroundColor: '#61A0D2' }} />
                </View>

                <View style={[styles.collar, {
                    flexDirection: "row"
                }]}>
                    <View style={{ flexDirection: "row", margin: 15, }}>
                        <Image style={styles.loginlogo} source={require('../../assets/facebook.png')} />
                        <Text style={styles.logintitle}>
                            Facebook
                        </Text>
                    </View>
                    <View style={{ flexDirection: "row", margin: 15, }}>
                        <Image style={styles.loginlogo} source={require('../../assets/google.png')} />
                        <Text style={styles.logintitle}>
                            Google
                        </Text>
                    </View>
                    <View style={{ flexDirection: "row", margin: 15, }}>
                        <Image style={styles.loginlogo} source={require('../../assets/apple.png')} />
                        <Text style={styles.logintitle}>
                            Apple
                        </Text>
                    </View>
                </View>

                <View style={styles.yho}>
                    <View style={{flexDirection: "row"}}>
                        <Image style={styles.createlogo} source={require('../../assets/yenihesapolustur.png')} />
                        <Text onPress={() => navigation.navigate("Register")} style={GlobalStyles.titlewhite}>
                            {contextLang.state.createNewAccount}
                        </Text>
                    </View>
                </View>

                {/* <Button title="register" onPress={() => navigation.navigate("Register")} />
                <Button title="Forget your password?" onPress={() => navigation.navigate("ForgetPassword")} /> */}
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    collar: {
        padding: 10,
        margin: 5
    },
    yho: {
        padding: 10,
        marginBottom: 40,
        flex: 1,
        justifyContent: "flex-end",
        flexDirection: "column"
    },
    createlogo: {
        width: 24,
        height: 28,
    },
    loginlogo: {
        width: 21,
        height: 21,
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
});

export default Login