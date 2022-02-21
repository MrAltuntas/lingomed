import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Register from './src/screens/Register';
import { Provider as LangProvider } from './src/context/LangContext'
import { Provider as AuthProvider } from './src/context/AuthContext'
import Welcome from './src/screens/Welcome';
import { navigationRef } from './src/RootNavigation';
import mainApi from './src/api/mainApi';
import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native'
import Login from './src/screens/Login';
import ForgetPassword from './src/screens/ForgetPassword'
console.log("third app");

const Stack = createNativeStackNavigator();

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

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    )
  }
  console.log(isLoading, isSignedIn, "isloading", "isSignedIn");
  return (
    <LangProvider>
      <AuthProvider>
        <NavigationContainer ref={navigationRef}>
          {isSignedIn ?
            <Stack.Navigator initialRouteName="Welcome">
              <Stack.Screen options={{ title: 'Lingomed' }} name="Register" component={Register} />
              <Stack.Screen options={{ title: 'Welcome' }} name="Welcome" component={Welcome} />
              <Stack.Screen options={{ title: 'Login' }} name="Login" component={Login} />
              <Stack.Screen options={{ title: 'Forget your password' }} name="ForgetPassword" component={ForgetPassword} />
            </Stack.Navigator>
            :
            <Stack.Navigator initialRouteName="Login">
              <Stack.Screen options={{ title: 'Lingomed' }} name="Register" component={Register} />
              <Stack.Screen options={{ title: 'Welcome' }} name="Welcome" component={Welcome} />
              <Stack.Screen options={{ title: 'Login' }} name="Login" component={Login} />
              <Stack.Screen options={{ title: 'Forget your password' }} name="ForgetPassword" component={ForgetPassword} />
            </Stack.Navigator>
          }

        </NavigationContainer>
      </AuthProvider>
    </LangProvider>
  );
}

export default App;