import React, { useContext, useEffect } from 'react'
import { AuthContext2 } from '../context/AuthContext2'
import { Text, StyleSheet,Button } from 'react-native'

const Profile = () => {
    const { signOut } = useContext(AuthContext2)

   
    return(
        <Button title="Sign Out" onPress={() => signOut()} />
    )
}

export default Profile