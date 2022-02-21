import createDataContext from './createDataContext';
import { NativeModules, Platform } from 'react-native'
const en = require('../lang/en.json');
const tr = require('../lang/tr.json');


console.log("firsttt lang");


const DefaultLang = () => {
    if (Platform.OS === "android") {

        switch (NativeModules.I18nManager.localeIdentifier.split("_")[0]) {
            case "en":
                return en
            case "tr":
                return tr

            default:
                return tr
        }
    } else {
        switch (NativeModules.SettingsManager.settings.AppleLanguages[0].split("-")[0]) {
            case "en":
                return en
            case "tr":
                return tr

            default:
                return tr
        }
    }
}



const langReducer = (state, action) => {
    switch (action.type) {
        case 'en':
            return en
        case 'tr':
            return tr

        default:
            return en
    }
}


const changeLang = (dispatch) => {
    return (lang) => {
        dispatch({ type: lang })
    }
}


export const { Context, Provider } = createDataContext(langReducer, { changeLang }, DefaultLang())