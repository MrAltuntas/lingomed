import { useEffect, useState } from "react";
import mainApi from '../api/mainApi';
import AsyncStorage from '@react-native-async-storage/async-storage'

export default (collection, ids) => {
    const [results, setResults] = useState([])
    const [errorMessage, setErrorMessage] = useState('')

    const collectionApi = async(collection, ids) => {

        const token = await AsyncStorage.getItem("token");
        const config = {
            headers: { Authorization: `Arflok: ${token}` }
        };
        try {
            const response = await mainApi.post(`/data/getByIdMultiple/${collection}`, {ids:ids}, config)

            if (response.data.success) {
                setResults(response.data.data)
            }else{
                setErrorMessage('something went wrong')
            }

        } catch (error) {
            console.log(error);
            setErrorMessage('something went wrong')
        }
    }

  

    return [collectionApi, results, errorMessage]
}