import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ContactsScreen from './screens/ContactsScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Contacts">
        <Stack.Screen name="Contacts" component={ContactsScreen} options={{ title: 'Contatos' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
