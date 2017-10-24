import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { connect } from 'react-redux';
import axios from 'axios';
import Permissions from 'react-native-permissions';
import firebase from 'firebase';
import {
  Button,
  Icon,
} from 'react-native-elements';

import * as actions from '../actions';
import {
  FONT,
  BLUE,
} from '../colors';

class AuthScreen extends Component {
  static navigationOptions = {

  }

  constructor(props) {
    super(props);

    this.state = {
      checked: false,
      logged: false,
      response: {},
			session: { userID: '', phoneNumber: '+1' },
    }
  }

  componentWillMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user && this.state.session.userID !== '' && this.props.welcomeSeen && !this.props.userItems) {
        this.props.getCurrentUserProperties();
        this.props.getCurrentUserItems();
        this.props.getCurrentAlertItems();

        if (Platform.OS === 'ios') {
          Permissions.getPermissionStatus('contacts').then(response => {
            if (response === Permissions.StatusUndetermined) {
              //
            } else if (response === Permissions.StatusDenied) {
              //
            } else if (response === Permissions.StatusAuthorized) {
//              this.props.loadContacts(this.state.session.phoneNumber);
            } else if (response === Permissions.StatusRestricted) {
              //
            }
          });
        } else {
//          this.props.loadContacts(this.state.session.phoneNumber);
        }
        firebase.database().ref('users/' + user.uid).once('value', (snapshot) => {
          if (!snapshot.val() ||
          !snapshot.val().phoneNumber ||
          !snapshot.val().userName) {
            snapshot.ref.update({
              uid: user.uid,
              phoneNumber: this.state.session.phoneNumber,
            });
            if (!snapshot.val() || !snapshot.val().userName) {
              this.props.navigation.navigate('setuser');
            } else {
              this.props.navigation.navigate('notify');
            }
          } else {
            this.props.navigation.navigate('notify');
          }
        });
      } else if (this.props.welcomeSeen !== null && !this.state.checked) {
        this.setState({
          logged: false,
        });
      }
    });
  }

  componentWillReceiveProps(nextProps) {

  }

  completion() {

  }

  render () {
    if (this.props.welcomeSeen && this.state.checked && !this.state.logged) {
      return (
        <View style={styles.container}>
          <View style={styles.container}>
          </View>
        </View>
      );
    } else if (this.props.welcomeSeen) {
      return (
        <View style={styles.container}>
          <ActivityIndicator
            style={styles.indicator}
            size="large"
            color={'#fff'}
          />
        </View>
      );
    }
    return (
      <View style={styles.container}>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  blankContainer: {
    flex: 1,
    backgroundColor: BLUE
  },
  container: {
    flex: 1,
    backgroundColor: BLUE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonStyle: {
    backgroundColor: '#fff',
    marginBottom: 45,
    height: 45,
  },
});

const mapStateToProps = (state) => {
  return {
    user: state.user,
    welcomeSeen: state.welcomeSeen,
    userItems: state.userItems,
  };
}

export default connect(mapStateToProps, actions)(AuthScreen);
