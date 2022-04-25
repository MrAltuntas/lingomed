import React, { useContext } from 'react'
import { Text, StyleSheet, Button, ScrollView, View } from 'react-native'
import mainApi from '../api/mainApi';

import { Context as LangContext } from '../../src/context/LangContext'

import { useNavigation } from '@react-navigation/native';
import { Formik } from 'formik'
import * as yup from 'yup';
import FormInput from '../components/Forms/FormInput';
import FormSubmitButton from '../components/Forms/FormSubmitButton';

import Logo from '../components/Logo';
import LinearGradient from '../components/LinearGradient';

import GlobalStyles from '../style/Global';

let validationSchema = yup.object().shape({
    email: yup.string().email('Invalid email!').required('Email is required!'),
});

const ForgetPassword = (props) => {
    const contextLang = useContext(LangContext)

    const userInfo = { email: "" }
    const navigation = useNavigation();

    const handleForgotPassword = async ({ email }) => {
        try {
            const response = await mainApi.post('/data/forgotpassword', { email })

            if (response.data.success) {
                alert(contextLang.state.resetPasswordLink)
                navigation.navigate("Login")
            } else {
                alert(contextLang.state.anError)
                navigation.navigate("Login")
            }
        } catch (error) {
            if (error.response) {
                console.log(error.response);
                if (error.response.status == 400) {
                    alert(contextLang.state.emailCantFind)
                } else {
                    alert(contextLang.state.checkNetwork)
                    navigation.navigate("Login")

                }
            } else {
                alert(contextLang.state.anError)
                navigation.navigate("Login")
            }
        }

    }

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1, minHeight: '100%' }} canCancelContentTouches="true">
            <View style={GlobalStyles.container}>
                <LinearGradient startPlace={1} endPlace={0} height={300} />
                <Logo />
                <Formik validationSchema={validationSchema} initialValues={userInfo} onSubmit={(values) => handleForgotPassword(values)}>

                    {({ values, errors, handleSubmit, handleChange }) => {
                        const { email } = values
                        return (
                            <>

                                <FormInput value={email}
                                    style={GlobalStyles.input}
                                    placeholder="Email"
                                    keyboardType={"email-address"}
                                    autoCapitalize={"none"}
                                    error={errors.email}
                                    onChangeText={handleChange("email")} />

                                <FormSubmitButton
                                    onPress={handleSubmit}
                                    title={contextLang.state.forgetPassword} />
                            </>
                        )
                    }}
                </Formik>

                <Text onPress={() => navigation.navigate("Login")} style={styles.title}>
                    {contextLang.state.login}
                </Text>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
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
})

export default ForgetPassword