import { ScrollView, View, Text, StyleSheet, Modal, Image, TouchableOpacity, Pressable, FlatList, ActivityIndicator, ImageBackground } from 'react-native'
import { API_URL } from '../../config'

const ColoredModal = ({ modalVisible, setModalVisible, word, playSound, nativeLang }) => {
    console.log(nativeLang);

    if (!nativeLang ) {
        return (
            null
        )
    } else {
        return (
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    Alert.alert("Modal has been closed.");
                    setModalVisible(!modalVisible);
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>

                        <Text style={styles.modalText}>{word.word}</Text>
                        <Text style={styles.modalText2}>{word.translations.filter(translation => translation.symbol == nativeLang)[0].translation}</Text>

                        <View style={styles.bottomContainer}>
                            <View style={styles.popupwp}>
                                <TouchableOpacity onPress={() => playSound(API_URL + word.audioPath)} >
                                    <Image style={styles.popupimage} source={require('../../assets/soundyellow.png')} />
                                </TouchableOpacity>
                                <View>
                                    <Image style={styles.popupimage} source={require('../../assets/begen.png')} />
                                </View>
                            </View>
                        </View>
                        <Pressable
                            style={styles.closecircle}
                            onPress={() => setModalVisible(!modalVisible)}
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

export default ColoredModal