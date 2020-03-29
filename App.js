/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import MainComponent from "./components/MainComponent"

const App = () => {
  return (
    <>
      <NavigationContainer>
        <MainComponent/>
      </NavigationContainer>
    </>
  );
};

export default App;
