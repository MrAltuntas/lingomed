import { useEffect, useState } from "react";
import mainApi from '../api/mainApi';
import AsyncStorage from '@react-native-async-storage/async-storage'

export default (collection, field, chrachter) => {
    const [results, setResults] = useState([])
    const [errorMessage, setErrorMessage] = useState('')

    const collectionApi = async(collection, field, chrachter) => {

        const token = await AsyncStorage.getItem("token");
        const config = {
            headers: { Authorization: `Arflok: ${token}` }
        };
        try {
            const response = await mainApi.get(`/data/getStartsWith/${collection}/${field}/${chrachter}`, config)

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
        collectionApi(collection, field, chrachter)
    }, [])

    return [collectionApi, results, errorMessage]
}