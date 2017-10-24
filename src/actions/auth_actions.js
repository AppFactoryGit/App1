import { AsyncStorage } from 'react-native';
import firebase from 'firebase';
import Contacts from 'react-native-contacts';
import Permissions from 'react-native-permissions';
import PhoneFormat from 'phoneformat.js';

import {
  LOGIN_SUCCESS,
  WELCOME_SEEN,
  CURRENT_USER,
  CURRENT_USER_PROPERTIES,
} from './types';

export const checkWelcomeSeen = () => async dispatch => {
  const welcome_seen = await AsyncStorage.getItem('welcome_seen');

  if (welcome_seen === 'yes') {
    dispatch({
      type: WELCOME_SEEN,
      payload: true,
    });
  } else {
    dispatch({
      type: WELCOME_SEEN,
      payload: false,
    });
  }
}

export const firebaseAuth = (token) => {
  return (dispatch) => {
    firebase.auth().signInWithCustomToken(token).then((user) => {
      dispatch({
        type: CURRENT_USER,
        payload: user,
      });
    }).catch((error) => {
      console.log(error);
      dispatch({
        type: CURRENT_USER,
        payload: null,
      });
    });
  };
};

export const getCurrentUserProperties = () => {
  const { currentUser } = firebase.auth();

  return (dispatch) => {
    firebase.database().ref(`/users/${currentUser.uid}`).on('value', (snapshot) => {
      const ref = firebase.database().ref(`users/${currentUser.uid}`);
      dispatch({
        type: CURRENT_USER_PROPERTIES,
        payload: {
          user: snapshot.val(),
          ref,
        }
      });
    });
  };
};

export const currentUserEmpty = () => {
  return {
    type: CURRENT_USER,
    payload: null,
  };
};

export const currentUserPropertiesOff = (userID) => {
  firebase.database().ref(`/users/${userID}`).off();
  return {
    type: CURRENT_USER_PROPERTIES,
    payload: {
      user: null,
      ref: null,
    }
  };
};
