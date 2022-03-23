import React, { useContext, useState } from "react";

import { useNavigation } from '@react-navigation/native';

import { Context as LangContext } from '../context/LangContext'
import LinearGradient from '../components/LinearGradient';
import { RadioButton } from 'react-native-paper';
import FormSubmitButton from "../components/Forms/FormSubmitButton";
import { Alert, Modal, Pressable,Label, View, Text, StyleSheet, Image, ImageBackground, TouchableOpacity, FlatList } from 'react-native'

import useCollection from "../hooks/useCollection";
import { Badge } from 'react-native-paper';
const Question = () => {

    const [modalVisible, setModalVisible] = useState(false);

    const contextLang = useContext(LangContext)
    const [value, setValue] = React.useState('first');
    const navigation = useNavigation();
    const [nativeLang, setNativeLang] = useState(contextLang.state.lang);
    const [collectionApi, langs, errorMessage] = useCollection("lang")
    const slicedArray = langs.slice(0, 1);
    const position = langs.length - 1

    return (
        <View style={styles.container}>
            <LinearGradient startPlace={1} endPlace={0} height={300}/>
            <View style={styles.vtitle}>
                <Text style={styles.texttitle}>7 / 10</Text>
                <Text style={styles.texttitle2}>Doğru şıkkı seçin</Text>
            </View>
            <View style={styles.fview}>
                <FlatList
                    data={slicedArray}
                    horizontal={false}
                    numColumns={1}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={(lang) => lang._id}
                    ListHeaderComponent={null}
                    ListFooterComponent={null}
                    renderItem={({ item }) => {
                        return (
                            <View style={{ marginLeft:20, marginRight:20}}>
                                <View style={{ flex:1, flexDirection:"row", alignItems:"center",justifyContent: "center", marginBottom:50}}>
                                    <View style={styles.soundiconcircle} >
                                        <View style={styles.mt14}><Image source={require('../../assets/sound.png')} /></View>
                                    </View>                                
                                    <Text style={{ fontSize:20, color:"#075CAB", margin:15}}>Das ist meine SchwesterDas</Text>                                    
                                </View>
                                <RadioButton.Group onValueChange={value => setValue(value)} value={value}>
                                    <RadioButton.Item style={styles.radioinput} color="#FFB400" label="Bu benim annem" value="first" />
                                    <RadioButton.Item style={styles.radioinput} color="#FFB400" label="Bu benim erkek kardeşim" value="second" />
                                    <RadioButton.Item style={styles.radioinput} color="#FFB400" label="Bu benim kız kardeşim" value="three" />
                                </RadioButton.Group>
                                <View style={styles.mt20} >
                                    <FormSubmitButton title='Kontrol Et' onPress={() => handleSubmit({ targetLang, level: checked, nativeLang })} />
                                </View>
                            </View>
                        )
                    }}
                />
            </View>
        </View>

    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 0,
        backgroundColor: '#C5EBFE',
    },
    radioinput:{
        borderRadius:10,
        margin:5,
        backgroundColor:"#fff"
    },
    mt20:{
        marginTop:20
    },
    vtitle: { 
        marginLeft: 20, 
        marginRight: 20, 
        borderBottomColor: '#075CAB', 
        borderBottomWidth: 1, 
        marginBottom: 30 
    },
    texttitle: {
        color: '#075CAB',
        fontWeight: 'bold',
        fontSize: 40,
        marginTop: 40,
        textAlign: 'center',
        width: '100%',
    },
    texttitle2: {
        color: '#757575',
        fontSize: 13,
        marginBottom: 10,
        textAlign: 'center',
        width: '100%',
    },
    fview: { 
        flex: 4, 
        paddingLeft: 20, 
        paddingRight: 20
    },
    soundiconcircle: { 
        width: 70, 
        height: 70, 
        lineHeight: 0, 
        alignItems: 'center', 
        borderRadius: 100, 
        backgroundColor: 'orange' 
    },
    mt14: { 
        marginTop: 14 
    },


});

export default Question