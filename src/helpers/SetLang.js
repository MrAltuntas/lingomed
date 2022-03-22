
import AsyncStorage from '@react-native-async-storage/async-storage'

const SetLang = async(contextLang) => {
    const nativeLang = await AsyncStorage.getItem("nativeLang");
    contextLang.changeLang(nativeLang)
}

export default SetLang