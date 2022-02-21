import AsyncStorage from '@react-native-async-storage/async-storage'
import createDataContext from "./createDataContext";
import mainApi from '../api/mainApi';
import * as RootNavigation from '../RootNavigation';

const authReducer = (state, action) => {
  switch (action.type) {
    case "add_error":
      return { ...state, errorMessage: action.payload };
    case "signin":
      return { errorMessage: "", token: action.payload };
    case "localSignin":
      return { isSignedIn: action.payload };
    case "clear_error_message":
      return { ...state, errorMessage: "" };
    case "signout":
      return { token: null, errorMessage: "" };
    default:
      return state;
  }
};


const tryLocalSignin = (dispatch) => async () => {
  const token = await AsyncStorage.getItem("token");
  console.log("tokennnnnnnnnnnnnnnnnnnnnnn");

  dispatch({ type: "localSignin", payload: true });

  // if (token) {
  //   dispatch({ type: "signin", payload: token });
  //   navigate("Welcome");
  // } else {
  //   navigate("Register");
  // }
};


const clearErrorMessage = (dispatch) => () => {
  dispatch({ type: "clear_error_message" });
};

const login = (dispatch) => async (userInfo) => {
  console.log("Login",userInfo);
  try {
    const response = await mainApi.post('/data/login', userInfo)

    if (response.data.success){
      try {
        await AsyncStorage.setItem("token", response.data.access_token)
        RootNavigation.navigate('Welcome');
        
      } catch (error) {
        console.log(error);
      }
    }

  } catch (error) {
    if(error.response){
      console.log(error.response);
      if (error.response.status == 400 || error.response.status == 403) {
        alert("Mail ya da şifre hatalı")
      } else {
        alert("İnternet Bağlantınızı kontrol edip lütfen daha sonra tekrar deneyiniz")
      }
    }else {
      alert("Bir hata ile karşılaşıldı lütfen daha sonra tekrar deneyiniz!")
    }
  }

  // try {
  //   const response = await trackerApi.post("/signup", { email, password });
  //   await AsyncStorage.setItem("token", response.data.token);
  //   dispatch({ type: "signin", payload: response.data.token });

  //   navigate("Welcome");
  // } catch (err) {
  //   dispatch({
  //     type: "add_error",
  //     payload: "Something went wrong with sign up",
  //   });
  // }
};

const signin = (dispatch) => async (userInfo) => {
  console.log("signin contextauth");
  try {
    const response = await mainApi.post('/data/register', userInfo)

    if (response.data.success == true) {
      try {
        await AsyncStorage.setItem("token", response.data.access_token)
      } catch (error) {
        console.log(error);
      }
      dispatch({ type: "signin", payload: response.data.access_token});

      RootNavigation.navigate('Welcome');
    }
  } catch (error) {
    if(error.response){
      if (error.response.status == 409) {
        alert("Email adresi daha önce kullanılmış")
        RootNavigation.navigate('SignIn');
      } else {
        alert("İnternet Bağlantınızı kontrol edip lütfen daha sonra tekrar deneyiniz")
      }
    }else {
      alert("Bir hata ile karşılaşıldı lütfen daha sonra tekrar deneyiniz!")
      dispatch({ type: "add_error", payload: "Something went wrong with sign up"});

    }
  }
};

const signout = (dispatch) => async () => {
  await AsyncStorage.removeItem("token");
  dispatch({ type: "signout" });
  navigate("loginFlow");
};

export const { Provider, Context } = createDataContext(
  authReducer,
  { signin, signout, login, clearErrorMessage, tryLocalSignin },
  { token: null, errorMessage: "" }
);
