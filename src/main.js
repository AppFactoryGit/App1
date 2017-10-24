/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  StatusBar,
  Platform,
} from 'react-native';
import { Provider, connect } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';
import { TabNavigator, StackNavigator } from 'react-navigation';
import { axios } from 'axios';
import Permissions from 'react-native-permissions';
import firebase from 'firebase';

import store from './store';
import {
  FONT,
  BLUE,
  DARK_GRAY,
} from './colors';

import LoadingScreen from './screens/LoadingScreen';
import AuthScreen from './screens/AuthScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import SetUserScreen from './screens/SetUserScreen';
import AlertScreen from './screens/AlertScreen';
import CarsScreen from './screens/CarsScreen';
import AddACarScreen from './screens/AddACarScreen';
import NotifyScreen from './screens/NotifyScreen';
import SettingsScreen from './screens/SettingsScreen';

import reducers from './reducers';
import TabBar from './components/tabBarBottom';

class Main extends Component {
  componentWillMount() {
    firebase.initializeApp({
      apiKey: 'AIzaSyCxMY41NfJcQyI-m3Fi5toqWsDx7HCDlCo',
      authDomain: 'parkassist-c2273.firebaseapp.com',
      databaseURL: 'https://parkassist-c2273.firebaseio.com',
      storageBucket: 'parkassist-c2273.appspot.com',
      messagingSenderId: '27841531667'
    });
  }

  render() {
    const MainNavigator = TabNavigator({
      welcome: {
        screen: WelcomeScreen,
      },
      loading: {
        screen: LoadingScreen,
      },
      auth: {
        screen: AuthScreen,
      },
      setuser: {
        screen: SetUserScreen,
      },
      main: {
        screen: TabNavigator({
          cars: {
            screen: StackNavigator({
              yourcars: {
                screen: CarsScreen,
              },
              add: {
                screen: AddACarScreen,
              }
            },
            {
              navigationOptions: {

              },
              mode: 'modal',
              initialRouteName: 'yourcars',
              lazy: true,
            }),
          },
          alerts: {
            screen: StackNavigator({
              youralerts: {
                screen: AlertScreen,
              },
            },
            {

            }),
          },
          notify: {
            screen: StackNavigator({
              younotify: {
                screen: NotifyScreen,
              },
            },
            {

            }),
          },
          settings: {
            screen: StackNavigator({
              yoursettings: {
                screen: SettingsScreen,
              },
            },
            {

            }),
          },
        },
        {
          navigationOptions: ( state ) => {
            return {
              tabBarVisible: true,
              tabBarLabel: '',
            };
          },
          tabBarOptions: {
            style: {
              height: 50,
              backgroundColor: BLUE,
            },
            inactiveTintColor: 'white',
            activeTintColor: 'yellow',
          },
          tabBarComponent: TabBar,
          tabBarPosition: 'bottom',
          initialRouteName: 'notify',
          lazy: false,
          animationEnabled: true,
          backBehavior: 'none',
        }),
      },
    },
    {
      navigationOptions: {
        tabBarVisible: false,
      },
      tabBarOptions: {

      },
      tabBarPosition: 'bottom',
      swipeEnabled: false,
      initialRouteName: 'loading',
      animationEnabled: true,
      backBehavior: 'none',
    });

    return (
      <Provider store={store}>
        <MainNavigator />
      </Provider>
    );
  }
}

export default Main;
