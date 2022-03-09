import React, { useContext } from 'react'
import { StyleSheet} from 'react-native'

const GlobalStyles = StyleSheet.create({

    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: '#C5EBFE',
        padding: 0,
        paddingLeft: 15,
        paddingRight: 15,
        minHeight: '100%',
        paddingBottom: 10
    },
    input: {
        height: 60,
        width: '100%',
        margin: 0,
        borderWidth: 0,
        padding: 10,
        fontSize: 14,
        borderRadius: 15,
        backgroundColor: "#fff"
    },
    titlewhite: {
        color: '#fff',
        fontWeight: '600',
        margin: 5,
    },
    button: {
        backgroundColor: '#075CAB',
        padding: 15,
        alignItems: 'center',
        borderRadius: 15,
        width: "100%",
        fontSize: 15,
        marginTop: 15,
    },
    text: {
        color: "white"
    }
});

export default GlobalStyles