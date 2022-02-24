import { NavigationContainer } from '@react-navigation/native'
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { Provider as LangProvider } from './src/context/LangContext'
import { Provider as AuthProvider } from './src/context/AuthContext'
import { navigationRef } from './src/RootNavigation';

import mainApi from './src/api/mainApi';
import AsyncStorage from '@react-native-async-storage/async-storage'

import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native'

import Login from './src/screens/Login';
import ForgetPassword from './src/screens/ForgetPassword'
import Register from './src/screens/Register';
import Welcome from './src/screens/Welcome';

import { AuthContext2 } from "./src/context/AuthContext2";
import Profile from './src/screens/Profile';
const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();




const AuthStack = createNativeStackNavigator();
const AuthStackScreen = () => (
  <AuthStack.Navigator>
    <AuthStack.Screen
      name="SignIn"
      component={SignIn}
      options={{ title: "Sign In" }}
    />
    <AuthStack.Screen
      name="CreateAccount"
      component={Register}
      options={{ title: "Create Account" }}
    />
  </AuthStack.Navigator>
);

const HomeDrawer = createDrawerNavigator();
const HomeDrawerScreen = () => (
  <NavigationContainer ref={navigationRef}>
    <HomeDrawer.Navigator initialRouteName="Welcome">
      <HomeDrawer.Screen options={{ title: 'Lingomed', headerShown: false }} name="Register" component={Register} />
      <HomeDrawer.Screen options={{ title: 'Welcome' }} name="Welcome" component={Welcome} />
      <HomeDrawer.Screen options={{ title: 'Login', headerShown: false }} name="Login" component={Login} />
      <HomeDrawer.Screen options={{ title: 'Forget your password', headerShown: false }} name="ForgetPassword" component={ForgetPassword} />
    </HomeDrawer.Navigator>
  </NavigationContainer>
);


function App() {
  const [isLoading, setIsLoading] = useState(true)
  const [isSignedIn, setIsSignIn] = useState(false)


  useEffect(async () => {

    const token = await AsyncStorage.getItem("token");
    const config = {
      headers: { Authorization: `Arflok: ${token}` }
    };
    try {
      const response = await mainApi.post('/data/checkToken', {}, config)

      if (response.data.success) {
        console.log("#################");

        setIsSignIn(true)
        setIsLoading(false)
      }

    } catch (error) {
      setIsSignIn(false)
      setIsLoading(false)

    }

  }, []);


  const authContext = React.useMemo(() => {
    return {
      signIn: async (userInfo) => {
        console.log("Login", userInfo);
        try {
          const response = await mainApi.post('/data/login', userInfo)

          if (response.data.success) {
            try {
              await AsyncStorage.setItem("token", response.data.access_token)
              setIsLoading(false);
              setIsSignIn(true)

            } catch (error) {
              console.log(error);
            }
          }

        } catch (error) {
          if (error.response) {
            console.log(error.response);
            if (error.response.status == 400 || error.response.status == 403) {
              alert("Mail ya da şifre hatalı")
            } else {
              alert("İnternet Bağlantınızı kontrol edip lütfen daha sonra tekrar deneyiniz")
            }
          } else {
            alert("Bir hata ile karşılaşıldı lütfen daha sonra tekrar deneyiniz!")
          }
        }
      },
      signUp: async (userInfo) => {
        console.log("signin contextauth");
        try {
          const response = await mainApi.post('/data/register', userInfo)

          if (response.data.success == true) {
            try {
              await AsyncStorage.setItem("token", response.data.access_token)
            } catch (error) {
              console.log(error);
            }
            setIsLoading(false);
            setIsSignIn(true)
          }
        } catch (error) {
          if (error.response) {
            if (error.response.status == 409) {
              alert("Email adresi daha önce kullanılmış")
              setIsLoading(false);
              setIsSignIn(false)
            } else {
              alert("İnternet Bağlantınızı kontrol edip lütfen daha sonra tekrar deneyiniz")
            }
          } else {
            alert("Bir hata ile karşılaşıldı lütfen daha sonra tekrar deneyiniz!")
          }
        }
      },
      signOut: async () => {
        await AsyncStorage.removeItem("token")

        setIsLoading(false);
        setIsSignIn(false)

      }
    };
  }, []);




  if (isLoading) {
    return (
      <View styleDrawer={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    )
  }


  console.log(isLoading, isSignedIn, "isloading", "isSignedIn");
  return (
    <LangProvider>
      <AuthContext2.Provider value={authContext}>
        <NavigationContainer ref={navigationRef}>
          {isSignedIn ?
            <Drawer.Navigator initialRouteName="Welcome">
              <Drawer.Screen options={{ title: 'Welcome' }} name="Welcome" component={Welcome} />
              <Drawer.Screen options={{ title: 'signOut' }} name="signOut" component={Profile} />
            </Drawer.Navigator>
            :
            <AuthStack.Navigator initialRouteName="Login">
              <AuthStack.Screen options={{ title: 'Lingomed'}} name="Register" component={Register} />
              <AuthStack.Screen options={{ title: 'Login', headerShown: false }} name="Login" component={Login} />
              <AuthStack.Screen options={{ title: 'Forget your password'}} name="ForgetPassword" component={ForgetPassword} />
            </AuthStack.Navigator>
          }

        </NavigationContainer>
      </AuthContext2.Provider>
    </LangProvider>
  );
}

export default App;