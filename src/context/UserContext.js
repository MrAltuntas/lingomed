import createDataContext from './createDataContext';

console.log("second userContext");

const deafultUserInfo = {
    fullName: "Jhon Doe",
    email: "example@mail.com",
    picture: "/assets/defaultAvatar.png",
    nativeLang: "tr",
    targetLang: "en",
    voiceAutoplay: true,
    voiceEffect: true,
    likedSentences: [],
    likedWords: []
}

const userReducer = (state, action) => {

    switch (action.type) {
        case "update": {
            let payload = action.payload
            return Object.assign({}, state, payload)
        }
        case "pushLikedSentence":
            return Object.assign({}, state, { likedSentences: state.likedSentences.concat(action.payload) })

        case "removeLikedSentence":{
            let newLikedSentences = []
            state.likedSentences.map(likedSentence => {
                if (likedSentence._id.localeCompare(action.payload) == 0) {
                    console.log("bingo");
                } else {
                    newLikedSentences.push(likedSentence)
                }
            })
            return Object.assign({}, state, { likedSentences: newLikedSentences })
        }
        case "pushLikedWord":
            return Object.assign({}, state, { likedWords: state.likedWords.concat(action.payload) })

        case "removeLikedWord":
            let newLikedWords = []
            state.likedWords.map(likedWord => {
                if (likedWord._id.localeCompare(action.payload) == 0) {
                    console.log("bingo");
                } else {
                    newLikedWords.push(likedWord)
                }
            })
            return Object.assign({}, state, { likedWords: newLikedWords })

        case "deafult":
            return deafultUserInfo

        default:
            return state
    }
}


const updateUser = (dispatch) => {
    return (type, payload) => {
        dispatch({ type: type, payload: payload })
    }
}


export const { Context, Provider } = createDataContext(userReducer, { updateUser }, deafultUserInfo)