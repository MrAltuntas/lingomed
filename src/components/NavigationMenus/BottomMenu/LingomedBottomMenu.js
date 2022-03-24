import React, { useContext, useState, useEffect } from "react";
import { ScrollView, View, Text, StyleSheet, Image, TouchableOpacity, FlatList, ActivityIndicator, ImageBackground } from 'react-native'


const LingomedBottomMenu = ({navigation, contextLang}) => {
    return (
        <View style={styles.bottomContainer}>
            <ImageBackground source={require('../../../../assets/footer_bg.png')} resizeMode="stretch" style={styles.image}>
                <TouchableOpacity style={styles.footerview} onPress={() => navigation.navigate("writetous")}>
                    <Image style={styles.footerimage} source={require('../../../../assets/bizeyazin.png')} />
                    <Text style={styles.footertext}>{contextLang.state.writeToUs}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.footerview} onPress={() => navigation.navigate("friends")}>
                    <Image style={styles.footerimage} source={require('../../../../assets/arkadaslar.png')} />
                    <Text style={styles.footertext}>Arkadaşlar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.footerview} onPress={() => navigation.navigate("statistics")}>
                    <Image style={styles.footerimage} source={require('../../../../assets/istatistik.png')} />
                    <Text style={styles.footertext}>İstatistik</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.footerview} onPress={() => navigation.navigate("competitors")}>
                    <Image style={styles.footerimage} source={require('../../../../assets/rakipler.png')} />
                    <Text style={styles.footertext}>Rakipler</Text>
                </TouchableOpacity>
            </ImageBackground>
        </View>
    )
}

const styles = StyleSheet.create({
    footerview: {
        flex: 1, alignItems: "center"
    },
    image: {
        flex: 1,
        justifyContent: "center",
        width: "100%",
        alignContent: "center",
        alignItems: "center",
        flexDirection: "row"
    },
    bottomContainer: {
        height: 101,
        justifyContent: 'flex-end',
        marginTop: 0,

    },
    footerimage: {
        marginTop: 40,
        alignItems: "center",
        width: 25,
        height: 23
    },
    footertext: {
        textAlign: "center",
        color: '#fff',
        fontSize: 11,
        margin: 10,
    }
});

export default LingomedBottomMenu