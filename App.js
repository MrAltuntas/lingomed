import { NavigationContainer } from '@react-navigation/native'
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { DrawerContent } from './src/screens/NavigationContents/DrawerContent';

import { Provider as LangProvider } from './src/context/LangContext'
import { navigationRef } from './src/RootNavigation';

import mainApi from './src/api/mainApi';
import AsyncStorage from '@react-native-async-storage/async-storage'

import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native'

import { AuthContext2 } from "./src/context/AuthContext2";
import { UserContext } from "./src/context/UserContext";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';


//screens
import LessonsAndDic from './src/screens/LessonsAndDic';
import Profile from './src/screens/Profile';
import Login from './src/screens/Login';
import ForgetPassword from './src/screens/ForgetPassword'
import Register from './src/screens/Register';
import Welcome from './src/screens/Welcome';
import Welcome2 from './src/screens/Welcome2';
import Sentence from './src/screens/Sentence';
import Question from './src/screens/Quesetion';

//sub screens
import Competitors from './src/screens/subscreens/Competitors';
import Friends from './src/screens/subscreens/Friends';
import Statistics from './src/screens/subscreens/Statistics';
import WriteUs from './src/screens/subscreens/WriteUs';
import Categories from './src/screens/Categories';

// headers
import HeaderWithBell from './src/headers/HeaderWithBell';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();
const AuthStack = createNativeStackNavigator()


const Tab = createMaterialBottomTabNavigator();
const MainTabScreen = ({ navigaiton, route }) => {
  return (
    <Tab.Navigator activeColor="#fff">

      <Tab.Screen name="writetous" component={WriteUs} options={{
        tabBarLabel: 'Bize Yazın', tabBarColor: '#009387',
        tabBarIcon: ({ color }) => (
          <Icon name="email" color={color} size={26} />
        ),
      }}
      />

      <Tab.Screen name="friends" component={Friends} options={{
        tabBarVisible: false,
        tabBarLabel: 'Arkadaşlar', tabBarColor: '#009387',
        tabBarIcon: ({ color }) => (
          <Icon name="account-group" color={color} size={26} />
        ),
      }}
      />

      <Tab.Screen name="statistics" component={Statistics} options={{
        tabBarLabel: 'İstatistik', tabBarColor: '#009387',
        tabBarIcon: ({ color }) => (
          <Icon name="chart-areaspline" color={color} size={26} />
        ),
      }}
      />

      <Tab.Screen name="competitors" component={Competitors} options={{
        tabBarLabel: 'Rakipler', tabBarColor: '#009387',
        tabBarIcon: ({ color }) => (
          <Icon name="license" color={color} size={26} />
        ),
      }}
      />

    </Tab.Navigator>
  )

};


const MainStackScreen = () => {
  return (
    <Stack.Navigator initialRouteName="Categories" screenOptions={{ drawerPosition: "right", header: ({ scene, navigation }) => (<HeaderWithBell navigation={navigation} />) }}>
      <Stack.Screen options={{ title: 'Categories' }} name="Categories" component={Categories} />
      <Stack.Screen options={{ title: 'Sentence' }} name="Sentence" component={Sentence} />
      <Stack.Screen options={{ title: 'Question' }} name="Question" component={Question} />
      <Stack.Screen options={{ title: 'Profile' }} name="Profile" component={Profile} />
      <Stack.Screen options={{ title: 'writetous' }} name="writetous" component={WriteUs} />
      <Stack.Screen options={{ title: 'friends' }} name="friends" component={Friends} />
      <Stack.Screen options={{ title: 'statistics' }} name="statistics" component={Statistics} />
      <Stack.Screen options={{ title: 'competitors' }} name="competitors" component={Competitors} />
    </Stack.Navigator>
  );
}



function App() {
  const [isLoading, setIsLoading] = useState(true)
  const [isSignedIn, setIsSignIn] = useState(false)
  const [isUserInit, setUserInit] = useState(false)


  useEffect(async () => {

    const token = await AsyncStorage.getItem("token");
    const isUserInit = await AsyncStorage.getItem("targetLang");
    setUserInit(isUserInit)

    const config = {
      headers: { Authorization: `Arflok: ${token}` }
    };
    try {
      const response = await mainApi.post('/data/checkToken', {}, config)

      if (response.data.success) {
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
              await AsyncStorage.setItem("email", userInfo.email)

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

  return (
    <LangProvider>
      <AuthContext2.Provider value={authContext}>
        <NavigationContainer ref={navigationRef}>
          {isSignedIn ? isUserInit ?
            <Drawer.Navigator initialRouteName="MainStackScreen" screenOptions={{ drawerPosition: "right", header: ({ scene, navigation }) => (<HeaderWithBell navigation={navigation} />) }} drawerContent={props => <DrawerContent {...props} />}>
              <Drawer.Screen options={{ title: 'Categories', headerShown: false }} name="MainStackScreen" component={MainStackScreen} />
              <Drawer.Screen options={{ title: 'Welcome' }} name="Welcome" component={Welcome} />
              <Drawer.Screen options={{ title: 'Welcome2' }} name="Welcome2" component={Welcome2} />
              <Drawer.Screen options={{ title: 'Lessons' }} name="Lessons" component={MainTabScreen} />
            </Drawer.Navigator>
            :
            <Drawer.Navigator initialRouteName="Welcome" screenOptions={{ drawerPosition: "right", header: ({ scene, navigation }) => (<HeaderWithBell navigation={navigation} />) }} drawerContent={props => <DrawerContent {...props} />}>
              <Drawer.Screen options={{ title: 'Categories', headerShown: false }} name="MainStackScreen" component={MainStackScreen} />
              <Drawer.Screen options={{ title: 'Welcome' }} name="Welcome" component={Welcome} />
              <Drawer.Screen options={{ title: 'Welcome2' }} name="Welcome2" component={Welcome2} />
              <Drawer.Screen options={{ title: 'Lessons' }} name="Lessons" component={MainTabScreen} />
            </Drawer.Navigator>
            :
            <AuthStack.Navigator initialRouteName="Login">
              <AuthStack.Screen options={{ title: 'Lingomed', headerShown: false }} name="Register" component={Register} />
              <AuthStack.Screen options={{ title: 'Login', headerShown: false }} name="Login" component={Login} />
              <AuthStack.Screen options={{ title: 'Forget your password', headerShown: false }} name="ForgetPassword" component={ForgetPassword} />
            </AuthStack.Navigator>
          }
        </NavigationContainer>
      </AuthContext2.Provider>
    </LangProvider>
  );
}

export default App;