import { AsyncStorage } from 'react-native';
import firebase from 'firebase';
import Contacts from 'react-native-contacts';
import Permissions from 'react-native-permissions';
import PhoneFormat from 'phoneformat.js';

import {
  CURRENT_USER_ITEMS,
  CURRENT_USER_ITEMS_EMPTY,
} from './types';

export const getCurrentUserItems = () => {
  const { currentUser } = firebase.auth();

  return (dispatch) => {
    firebase.database().ref(`/userItems/${currentUser.uid}`).on('value', (snapshot) => {
      dispatch({
        type: CURRENT_USER_ITEMS,
        payload: snapshot.val(),
      });
    });
  };
};

export const currentUserItemsOff = (userID) => {
  firebase.database().ref(`/userItems/${userID}`).off();
  return {
    type: CURRENT_USER_ITEMS_EMPTY,
    payload: null,
  };
};
