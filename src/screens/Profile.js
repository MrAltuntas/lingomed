import React, { useContext, useState } from "react";

import { useNavigation } from '@react-navigation/native';

import { Context as LangContext } from '../context/LangContext'
import LinearGradient from '../components/LinearGradient';
import { RadioButton } from 'react-native-paper';
import FormSubmitButton from "../components/Forms/FormSubmitButton";
import { TouchableHighlight, Modal,ScrollView, Pressable,Label, View, Text, StyleSheet, Image, ImageBackground, TouchableOpacity, FlatList } from 'react-native'
import GlobalStyles from '../style/Global';
import { Formik } from 'formik'
import * as yup from 'yup';
import FormInput from '../components/Forms/FormInput';

import useCollection from "../hooks/useCollection";
import { Switch } from 'react-native-paper';

let validationSchema = yup.object().shape({
    email: yup.string().email('Invalid email!').required('Email is required!'),
    password: yup.string().trim().min(6, 'Password is too short!').required('password is required!'),
});

const Profile = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const userInfo = { email: "", password: "" }
    const contextLang = useContext(LangContext)
    const [value, setValue] = React.useState('first');
    const navigation = useNavigation();
    const [nativeLang, setNativeLang] = useState(contextLang.state.lang);
    const [collectionApi, langs, errorMessage] = useCollection("lang")
    const slicedArray = langs.slice(0, 1);
    const position = langs.length - 1
    const [isSwitchOn, setIsSwitchOn] = React.useState(false);
    const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);
    return(
        <ScrollView contentContainerStyle={{ flexGrow: 1, minHeight: '100%' }} canCancelContentTouches="true">
        <View style={styles.container}>
            <LinearGradient startPlace={1} endPlace={0} height={300}/>            
            <View style={{ flex: 1,alignItems:"center", marginTop:40}}>                    
                <View style={styles.profileImgContainer}>
                    <Image source={require('../../assets/user.jpg')} style={styles.profileImg} />                
                    <View style={styles.circlewhite}>
                        <View style={ styles.editimgview}>
                            <Image source={require('../../assets/edit.png')} style={styles.editimg} /> 
                        </View>
                    </View>                      
                </View>
                <Formik validationSchema={validationSchema} initialValues={userInfo} onSubmit={(values) => signIn(values)}>
                    {({ values, errors, handleSubmit, handleChange }) => {
                        const { fullName, email,lang} = values
                        return (
                            <>
                                <View style={styles.w100}>
                                    <FormInput value={fullName}
                                        style={GlobalStyles.input}
                                        placeholder="Full Name"                                        
                                        error={errors.fullName}
                                        placeholderTextColor="#9D9FA0"
                                        onChangeText={handleChange("fullName")} />
                                    <View style={ styles.inputediticon}>
                                        <Image source={require('../../assets/edit.png')} style={styles.editimg} /> 
                                    </View>
                                </View>
                                <View style={styles.w100}>
                                    <FormInput value={email}
                                        style={GlobalStyles.input}
                                        placeholder="Email"
                                        keyboardType={"email-address"}
                                        error={errors.email}
                                        placeholderTextColor="#9D9FA0"
                                        onChangeText={handleChange("email")} />
                                    <View style={ styles.inputediticon}>
                                        <Image source={require('../../assets/edit.png')} style={styles.editimg} /> 
                                    </View>
                                </View>

                                

                                
                                <FormSubmitButton
                                    onPress={handleSubmit}
                                    title='Kaydet' />

                                <View style={[styles.wbox,styles.mt50]}>
                                    <View style={styles.spacebetween}>
                                        <Text style={styles.boxtext}>Dil Seçimi : </Text>
                                        <Image source={require('../../assets/tr.png')} style={[styles.editimg,styles.ml10]} /> 
                                        <Text style={styles.ml10}>Türkçe</Text>
                                    </View>
                                    <View style={{ marginRight:15}}>
                                    <Image source={require('../../assets/edit.png')} style={styles.editimg} /> 
                                    </View>
                                </View>
                                    
                                <View style={styles.wbox}>
                                    <Text style={styles.boxtext}>Ses Efekti</Text>
                                    <View>
                                        <Switch value={isSwitchOn} onValueChange={onToggleSwitch} />
                                    </View>
                                </View>

                                <View style={[styles.wbox,styles.mb50]}>
                                    <Text style={styles.boxtext}>Otomatik ses oynatıcı</Text>
                                    <View>
                                        <Switch value={isSwitchOn} onValueChange={onToggleSwitch} />
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
    wbox:{
        backgroundColor:"#fff",
        justifyContent :"space-between",
        alignItems:"center",
        width:"100%",
        borderRadius:15,
        margin:10,
        padding:12,
        alignContent:"center",
        flexDirection:"row",
        minHeight:60
    },
    profileImgContainer: {
        marginLeft: 8,
        marginBottom:50,
        height: 120,
        width: 120,
        borderRadius: 120,
        alignItems:"center",
       
      },
      profileImg: {
        height: 120,
        width: 120,
        borderRadius: 120,
        borderColor: '#075CAB',
        borderWidth:2,
        
      },
      editimg:{
          width:20,
          height:20,
      },
      editimgview:{
        alignItems:"center",
        justifyContent:"center",
        height:40
      },
      circlewhite:{
          backgroundColor:"#fff", 
          width:40,
          height:40, 
          lineHeight:30, 
          bottom:20, 
          textAlign:"center", 
          borderRadius:30,
          shadowColor: "#000",
          shadowOpacity: 0.25, 
          shadowRadius: 3.84,},
    inputediticon:{
        position:"absolute",
        right:25,
        bottom:20
    },
    w100:{
        width:"100%"
    },
    boxtext:{
        color:"#505050",
        marginLeft:10
    },
    mt50:{
        marginTop: 50
    },
    mb50:{
        marginBottom: 50
    },
    spacebetween:{
        justifyContent:"space-between",
        flexDirection:"row"
    },
    ml10:{
        marginLeft:10
    }
});

export default Profile