import { AsyncStorage } from 'react-native';
import firebase from 'firebase';
import Contacts from 'react-native-contacts';
import Permissions from 'react-native-permissions';
import PhoneFormat from 'phoneformat.js';

import {
  CURRENT_ALERT_ITEMS,
  CURRENT_ALERT_ITEMS_EMPTY,
} from './types';

export const getCurrentAlertItems = () => {
  const { currentUser } = firebase.auth();

  return (dispatch) => {
    firebase.database().ref(`/userNotifications/${currentUser.uid}`).on('value', (snapshot) => {
      dispatch({
        type: CURRENT_ALERT_ITEMS,
        payload: snapshot.val(),
      });
    });
  };
};

export const currentAlertItemsOff = (userID) => {
  firebase.database().ref(`/userNotifications/${userID}`).off();
  return {
    type: CURRENT_ALERT_ITEMS_EMPTY,
    payload: null,
  };
};
