import React, { useContext } from 'react'
import { Text, StyleSheet,Button } from 'react-native'

import { Context as LangContext } from '../../src/context/LangContext'
import { AuthContext2 } from '../../src/context/AuthContext2'

import { useNavigation } from '@react-navigation/native';
import { Formik } from 'formik'
import * as yup from 'yup';
import FormInput from '../components/Forms/FormInput';
import FormSubmitButton from '../components/Forms/FormSubmitButton';

let validationSchema = yup.object().shape({
    email: yup.string().email('Invalid email!').required('Email is required!'),
    password: yup.string().trim().min(6, 'Password is too short!').required('password is required!'),
});

const Login = (props) => {

    const contextLang = useContext(LangContext)
    const { signIn } = useContext(AuthContext2)

    const userInfo = {  email: "", password: ""}
    const navigation = useNavigation();

    console.log(contextLang.state.merhaba);

    return(
        <>

            <Formik validationSchema={validationSchema} initialValues={userInfo} onSubmit={(values) => signIn(values)}>

                {({ values, errors, handleSubmit, handleChange }) => {
                    const { email, password } = values
                    return (
                        <>

                            <FormInput value={email}
                                style={styles.textInput}
                                placeholder="Email"
                                error={errors.email}
                                onChangeText={handleChange("email")} />

                            <FormInput value={password}
                                style={styles.textInput}
                                placeholder="******"
                                error={errors.password}
                                onChangeText={handleChange("password")} />

                            <FormSubmitButton
                                onPress={handleSubmit}
                                title='Sign up' />
                            {/* {state.errorMessage ? <Text>{state.errorMessage}</Text> : null} */}
                        </>
                    )
                }}
            </Formik>
            <Button title="register" onPress={() => navigation.navigate("Register")}/>
            <Button title="Forget your password?" onPress={() => navigation.navigate("ForgetPassword")}/>
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