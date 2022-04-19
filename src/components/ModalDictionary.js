import { ScrollView, View, Text, StyleSheet, Modal, Image, TouchableOpacity, Pressable, FlatList, ActivityIndicator, ImageBackground } from 'react-native'
import { API_URL } from '../../config'
import AsyncStorage from '@react-native-async-storage/async-storage'
import mainApi from "../api/mainApi";

const ModalDictionary = ({coloredObj={},colored=false,userContext, index, modalVisible, setModalVisible, word, playSound, nativeLang, targetLang, showDialog, id, deleteData = false, likedWordId, collectionApiObj }) => {
    const like = async () => {

        try {
            const email = await AsyncStorage.getItem("email")
            const token = await AsyncStorage.getItem("token");
            const config = {
                headers: { Authorization: `Arflok: ${token}` }
            };
            const response = await mainApi.post(`/data/pushData/users/${email}/likedWords`, { id: id, symbol:targetLang }, config)

            if (response.data.success && response.data.data.likedWords.length > 0) {
                userContext.updateUser("pushLikedWord", { id: id, symbol: targetLang, _id: response.data.data.likedWords.slice(-1)[0]._id })
                setModalVisible(-1);
                showDialog()
                console.log("eklendi");
            }

        } catch (error) {
            alert("Favori Cümlelere Eklenemedi!!!")
            console.log(error);
        }
    }

    const deleteWord = async () => {

        try {
            const token = await AsyncStorage.getItem("token");

            const config = {
                headers: { Authorization: `Arflok: ${token}` }
            };
            const response = await mainApi.post(`/data/removeData/users/${userContext.state.email}/likedWords/${likedWordId}`,{}, config)

            if (response.data.success) {
                setModalVisible(-10);
                showDialog()
                console.log("eklendi");
            }

        } catch (error) {
            alert("Favori Cümlelere Eklenemedi!!!")
            console.log(error.response.data);
        }
    }
    if (!nativeLang || !targetLang ) {
        return (
            null
        )
    } else {
        let audioPath = colored ? coloredObj.audioPath:word.filter(word => word.symbol == targetLang)[0].audioPath

        return (
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible==index ? true:false}
                onRequestClose={() => {
                    Alert.alert("Modal has been closed.");
                    setModalVisible(-10);
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>

                        <Text style={styles.modalText}>{colored ? coloredObj.word:word.filter(word => word.symbol == targetLang)[0].word}</Text>
                        <Text style={styles.modalText2}>{colored ? coloredObj.translations.filter(word => word.symbol == nativeLang)[0].word:word.filter(word => word.symbol == nativeLang)[0].word}</Text>

                        <View style={styles.bottomContainer}>
                            <View style={styles.popupwp}>
                                <TouchableOpacity onPress={() => playSound(API_URL + audioPath)} >
                                    <Image style={styles.popupimage} source={require('../../assets/soundyellow.png')} />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={deleteData ? () => deleteWord(word):() => like()}>
                                    <Image style={styles.popupimage} source={require('../../assets/begen.png')} />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <Pressable
                            style={styles.closecircle}
                            onPress={() => setModalVisible(-1)}
                        >
                            <Text style={styles.closecircletext}>X</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        )
    }

}
const styles = StyleSheet.create({
    popupwp: {
        flex: 1,
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center",
        flexDirection: "row"
    },
    modalText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 25,
        marginBottom: 20,
        textAlign: "center"
    },
    modalText2: {
        color: "#fff",
        fontWeight: "400",
        fontSize: 14,
        marginBottom: 5,
        textAlign: "center",
        borderBottomColor: "#ffffff90",
        borderBottomWidth: 2
    },
    modalView: {
        margin: 0,
        backgroundColor: "#1566B1",
        borderRadius: 20,
        padding: 35,
        paddingBottom: 10,

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
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#00000090",
    },
    closecircle: {
        alignItems: 'center',
        borderRadius: 100,
        backgroundColor: 'orange',
        position: "absolute",
        right: 0,
        top: -10,
        textAlign: "center"
    },

    closecircletext: {
        color: "#fff", textAlign: "center", width: 30, height: 30, lineHeight: 28,
    },
    text2: {
        color: "#7DA0B9", fontSize: 18
    },
    bottomContainer: {
        height: 101,
        justifyContent: 'flex-end',
        marginTop: 0,

    },
    popupimage: {
        margin: 0,
        marginLeft: 20,
        marginRight: 20,
        alignItems: "center",
        width: 35,
        height: 32
    }
});

export default ModalDictionary