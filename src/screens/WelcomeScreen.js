import React, { Component } from 'react';
import {
  View,
  Text,
  AsyncStorage,
} from 'react-native';
import { connect } from 'react-redux';
import * as actions from '../actions';

import Slides from '../components/slides';

const SLIDE_DATA = [
  {
    text: 'Welcome to assistant',
    color: '#03A9F4',
  },
  {
    text: 'Enter your license plate to register for notifications',
    color: '#009688',
  },
  {
    text: "If somebody sees your car's lights on, they can tell you!",
    color: '#03A9F4',
  },
];

class WelcomeScreen extends Component {
  onSlidesComplete = () => {
    AsyncStorage.setItem('welcome_seen', 'yes').then(() => {
      this.props.checkWelcomeSeen();
      this.props.navigation.navigate('auth');
    })
    .catch((error) => {
      console.log(error);
    });
  }

  render () {
    return (
      <Slides
        data={SLIDE_DATA}
        onComplete={this.onSlidesComplete}
      />
    );
  }
}

const mapStateToProps = (state) => {
  return {
    welcomeSeen: state.welcomeSeen,
  };
}

export default connect(mapStateToProps, actions)(WelcomeScreen);
