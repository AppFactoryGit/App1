import React from 'react';
import {
  Text,
  TouchableOpacity,
  View,
 } from 'react-native';

 import {
   FONT,
   NAVY,
   GOLD,
   GRAY,
   DARK_GRAY,
   ORANGE,
 } from '../colors';

const ExternalButton = (props) => {
  const button = (
    props.enabled ? (
      <TouchableOpacity
        onPress={props.onPress}
        style={[(styles[props.style] || styles.navy), styles.buttonStyleEnabled]}
      >
        <Text
          style={props.style !== 'white' ? styles.textStyleEnabled : styles.textStyleBlack}
        >
          {props.children}
        </Text>
        <Text
          style={props.style !== 'white' ? styles.textStyleEnabledArrow :
            styles.textStyleBlackArrow}
        >
          {'>'}
        </Text>
      </TouchableOpacity>)
  : (
      <View
        style={styles.buttonStyleDisabled}
      >
        <Text
          style={styles.textStyleDisabled}
        >
          {props.children}
        </Text>
      </View>
    ));

  return (
    button
  );
};

const styles = {
  navy: {
    backgroundColor: DARK_GRAY,
    borderColor: DARK_GRAY,
  },
  danger: {
    backgroundColor: 'red',
    borderColor: 'red',
  },
  gold: {
    backgroundColor: GOLD,
    borderColor: GOLD,
  },
  white: {
    backgroundColor: 'white',
    borderColor: 'white',
  },
  buttonStyleEnabled: {
    margin: 5,
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingTop: 10,
    paddingBottom: 10,
    borderTopColor: DARK_GRAY,
    borderBottomColor: DARK_GRAY,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    flexDirection: 'row',
  },
  textStyleEnabled: {
    color: '#fff',
    fontSize: 15,
    fontFamily: FONT,
    fontWeight: '600',
    flex: 1,
  },
  textStyleBlack: {
    color: DARK_GRAY,
    fontFamily: FONT,
    fontSize: 15,
    fontWeight: '600',
    flex: 1,
    paddingLeft: 5,
  },
  textStyleEnabledArrow: {
    color: '#fff',
    fontSize: 15,
    fontFamily: FONT,
    fontWeight: '600',
    paddingRight: 5,
  },
  textStyleBlackArrow: {
    color: DARK_GRAY,
    fontFamily: FONT,
    fontSize: 15,
    fontWeight: '600',
    paddingRight: 5,
  },
  buttonStyleDisabled: {
    backgroundColor: '#eee',
    borderRadius: 5,
    borderColor: '#fff',
    borderWidth: 2,
    margin: 5,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10,
    paddingBottom: 10,
  },
  textStyleDisabled: {
    color: '#fff',
    fontFamily: FONT,
    fontSize: 15,
    fontWeight: '600',
  }
};

export default ExternalButton;
