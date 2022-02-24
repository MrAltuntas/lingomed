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
    fullName: yup.string().trim().min(3, 'Invalid name!').required('Name is required!'),
    email: yup.string().email('Invalid email!').required('Email is required!'),
    password: yup.string().trim().min(6, 'Password is too short!').required('password is required!'),
    confirmPassword: yup.string().equals([yup.ref('password'), null], "Does not match with password!"),
});

const Register = (props) => {
    const contextLang = useContext(LangContext)
    const { signUp } = useContext(AuthContext2)

    const userInfo = { fullName: "", email: "", password: "", confirmPassword: "" }
    const navigation = useNavigation();

    console.log(contextLang.state.merhaba);
    return (
        <>

            <Formik validationSchema={validationSchema} initialValues={userInfo} onSubmit={(values) => signUp(values)}>

                {({ values, errors, handleSubmit, handleChange }) => {
                    const { fullName, email, password, confirmPassword } = values
                    return (
                        <>
                            <FormInput value={fullName}
                                style={styles.textInput}
                                placeholder="Full Name"
                                error={errors.fullName}
                                onChangeText={handleChange("fullName")} />

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

                            <FormInput value={confirmPassword}
                                style={styles.textInput}
                                placeholder="******"
                                error={errors.confirmPassword}
                                onChangeText={handleChange("confirmPassword")} />

                            <FormSubmitButton
                                onPress={handleSubmit}
                                title='Sign up' />
                            {/* {state.errorMessage ? <Text>{state.errorMessage}</Text> : null} */}
                        </>
                    )
                }}
            </Formik>
            <Button title="login" onPress={() => navigation.navigate("Login")}/>

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

export default Register