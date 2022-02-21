import React, { useContext } from 'react'
import { Text, StyleSheet,Button } from 'react-native'
import mainApi from '../api/mainApi';

import { Context as LangContext } from '../../src/context/LangContext'

import { useNavigation } from '@react-navigation/native';
import { Formik } from 'formik'
import * as yup from 'yup';
import FormInput from '../components/Forms/FormInput';
import FormSubmitButton from '../components/Forms/FormSubmitButton';

let validationSchema = yup.object().shape({
    email: yup.string().email('Invalid email!').required('Email is required!'),
});

const Login = (props) => {
    const contextLang = useContext(LangContext)

    const userInfo = {  email: ""}
    const navigation = useNavigation();

    const handleForgotPassword = async ({email}) => {
        try {
            console.log(email);
            const response = await mainApi.post('/data/forgotpassword', {email})
            console.log(response.data);

            if(response.data.success){
                alert("Şifre sıfırlama linki mail adresinize gönderildi")
                navigation.navigate("Login")
            }else{
                alert("Bir hata oluştu daha sonra tekrar deneyiniz")
                navigation.navigate("Login")
            }
        } catch (error) {
            if(error.response){
                console.log(error.response);
                if (error.response.status == 400 ) {
                  alert("Email adresi bulunamadı")
                } else {
                  alert("İnternet Bağlantınızı kontrol edip lütfen daha sonra tekrar deneyiniz")
                  navigation.navigate("Login")

                }
              }else {
                alert("Bir hata ile karşılaşıldı lütfen daha sonra tekrar deneyiniz!")
                navigation.navigate("Login")
              }
        }

    }

    console.log(contextLang.state.merhaba);

    return(
        <>

            <Formik validationSchema={validationSchema} initialValues={userInfo} onSubmit={(values) => handleForgotPassword(values)}>

                {({ values, errors, handleSubmit, handleChange }) => {
                    const { email } = values
                    return (
                        <>

                            <FormInput value={email}
                                style={styles.textInput}
                                placeholder="Email"
                                error={errors.email}
                                onChangeText={handleChange("email")} />

                            <FormSubmitButton
                                onPress={handleSubmit}
                                title='Sign up' />
                        </>
                    )
                }}
            </Formik>
        </>
    )
}

const styles = StyleSheet.create({
    textInput: {
        height: 50,
        fontSize: 18,
        borderBottomWidth: 1,
        borderBottomColor: "gray"
    },
    container: {
        flexDirection: 'column',
    }
})

export default Login