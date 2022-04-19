

import AsyncStorage from '@react-native-async-storage/async-storage'
import mainApi from '../api/mainApi';

const finishedCategory = async (symbol, categoryId, level, email, userContext) => {
    const token = await AsyncStorage.getItem("token");

    const config = {
        headers: { Authorization: `Arflok: ${token}` }
    };

    try {
        const response = await mainApi.post(`/data/pushData/users/${email}/finishedCategories`, { symbol: symbol, categoryId:categoryId, level:level }, config)
        userContext.updateUser("finishedCategories", { symbol: symbol, categoryId:categoryId, level:level })
    } catch (error) {
        console.log(error.response);
    }
}

export default finishedCategory