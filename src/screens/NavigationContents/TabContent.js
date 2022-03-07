import React, { useContext } from 'react';
import {
    MaterialBottomTabView,

} from '@react-navigation/material-bottom-tabs';


export function DrawerContent(props) {
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
}