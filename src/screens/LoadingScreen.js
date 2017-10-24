import React, { Component } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  AsyncStorage,
  Alert,
  BackHandler,
} from 'react-native';
import { connect } from 'react-redux';
import axios from 'axios';
import Permissions from 'react-native-permissions';
import firebase from 'firebase';
import * as actions from '../actions';

class LoadingScreen extends Component {
  static navigationOptions = {

  }

  constructor(props) {
    super(props);
    this.checked = false;
  }

  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress.bind(this));
  }

  componentDidMount () {
    setTimeout(() => {
//      AsyncStorage.removeItem('welcome_seen');
      this.props.checkWelcomeSeen();
//      this.onWelcomeCheck(this.props);
    }, 200);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress.bind(this));
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.welcomeSeen === null && nextProps.welcomeSeen && !this.checked) {
      this.checked = true;
      this.props.navigation.navigate('auth');
    } else if (this.props.welcomeSeen === null && nextProps.welcomeSeen !== null && !nextProps.welcomeSeen && !this.checked) {
      this.checked = true;
      this.props.navigation.navigate('welcome');
    }
  }

  handleBackPress() {
    if (this.props.navigation.state.key === 'loading') {
      this.props.navigation.dispatch({type: "Navigation/BACK"})
      return true
    } else {
      return false
    }
  }

  render () {
    if (1 === 1) {
      return (
        <View style={styles.container}>

        </View>
      );
    }
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
}

const styles = {
  indicator: {

  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#03A9F4',
  },
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
    welcomeSeen: state.welcomeSeen,
  };
}

export default connect(mapStateToProps, actions)(LoadingScreen);
