import React from "react";
import {Appbar} from 'react-native-paper';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import { StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const HeaderWithBell=()=>{
    // const {options}=scene.descriptor;
    // const title = navigation;
    const navigation = useNavigation();
    
    return (
        <Appbar.Header style={styles.header}>
            {
                navigation.canGoBack()?
                (
                    <Appbar.BackAction onPress={()=> navigation.goBack()}/>
                )
                :
                null
            }
            <Appbar.Content />
            <Appbar.Action icon="bell" onPress={()=>console.log("Notification pressed")}/>
            <Appbar.Action icon="menu" onPress={()=>navigation.toggleDrawer()}/>

        </Appbar.Header>
    )
};

export default HeaderWithBell;

const styles = StyleSheet.create({
    header: {
      backgroundColor: "#085cab"
    },
});