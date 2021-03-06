import { useEffect, useState } from "react";
import mainApi from '../api/mainApi';
import AsyncStorage from '@react-native-async-storage/async-storage'

export default (collection) => {
    const [results, setResults] = useState([])
    const [errorMessage, setErrorMessage] = useState('')

    const collectionApi = async(collection) => {

        const token = await AsyncStorage.getItem("token");
        const config = {
            headers: { Authorization: `Arflok: ${token}` }
        };
        try {
            const response = await mainApi.get(`/data/getAccessible/${collection}`, config)

            if (response.data.success) {
                setResults(response.data.data)
            }else{
                setErrorMessage('something went wrong')
            }

        } catch (error) {
            console.log(error);
            setErrorMessage(error)
        }
    }

    useEffect(() => {
        collectionApi(collection)
    }, [])

    return [collectionApi, results, errorMessage]
}