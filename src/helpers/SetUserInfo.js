
import AsyncStorage from '@react-native-async-storage/async-storage'
import mainApi from '../api/mainApi';

const SetUserInfo = async (userContext) => {
    const email = await AsyncStorage.getItem("email");
    const token = await AsyncStorage.getItem("token");

    const config = {
        headers: { Authorization: `Arflok: ${token}` }
    };

    try {
        const response = await mainApi.post('/data/userinfo', { email: email }, config)

        if (response.data.success == true) {
            userContext.updateUser("update", response.data.data)
        }
    } catch (error) {
        console.log(error.response);
    }
}

export default SetUserInfo