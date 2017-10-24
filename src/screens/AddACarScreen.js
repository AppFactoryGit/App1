import React, { Component } from 'react';
import {
  View,
  Text,
  Platform,
  StyleSheet,
  TextInput,
  Picker,
} from 'react-native';
const Item = Picker.Item;
import { connect } from 'react-redux';
import firebase from 'firebase';
import {
  Button
} from 'react-native-elements';
import { NavigationActions } from 'react-navigation';
import * as actions from '../actions';

import {
  FONT,
  BLUE
} from '../colors';
import {
  STATES
} from '../components/states';

class CarsScreen extends Component {
  static navigationOptions = {
    headerTitle: 'Add A Car',
    headerBackTitle: '',
    headerTintColor: 'white',
    title: 'Your Cars',
    headerStyle: {
      marginTop: Platform.OS === 'android' ? 24 : 0,
      backgroundColor: BLUE,
    },
    tabBarVisible: false,
  }

  constructor(props) {
    super(props);

    this.state = {
      plate: '',
      plateState: 'AL',
    };
  }

  componentWillMount() {
    const setParamsAction = NavigationActions.setParams({
      params: {
        visible: false,
        disableSwipe: true,
      },
      key: 'cars',
    });
    this.props.navigation.dispatch(setParamsAction);
  }

  componentWillUnmount() {
    const setParamsAction = NavigationActions.setParams({
      params: {
        visible: true,
        disableSwipe: false,
      },
      key: 'cars',
    });
    this.props.navigation.dispatch(setParamsAction);
  }

  inputFocused() {

  }

  onPlateState(key, value) {
    this.setState({
      plateState: value,
    });
  }

  addCar() {
    firebase.database().ref(`/allItems`).push({

    }).then((ref) => {
      const data = {
        identifier: this.state.plate,
        idStripped: this.state.plate.replace(/\W/g, '').toUpperCase(),
        state: this.state.plateState,
        uid: this.props.user.uid,
        idStateIndex: this.state.plateState + '|' + this.state.plate.replace(/\W/g, '').toUpperCase(),
        date: new Date(),
      };
      ref.update(data);
      firebase.database().ref(`/userItems/${this.props.user.uid}/${ref.key}`).update(data);
      this.props.navigation.goBack();
    });
  }

  render () {
    return (
      <View style={styles.container} >
        <View style={styles.groupContainer}>
          <View style={styles.containerRow}>
            <Text
              style={styles.inputTitle}
            >
              {'Plate Number'}
            </Text>
            <TextInput
              style={styles.newInput}
              value={this.state.plate}
              autoCorrect={false}
              spellCheck={false}
              blurOnSubmit={true}
              returnKeyType="done"
              placeholder="Plate Number"
              placeholderTextColor="#aaa"
              multiline={false}
              autoCapitalize="characters"
              ref="plate"
              onFocus={this.inputFocused.bind(this, 'plate')}
              underlineColorAndroid="#fff"
              onChangeText={(text) => { this.setState({ plate: text }); }}
              onBlur={() => { }}
            />
          </View>
        </View>
        <View style={styles.groupContainer}>
          <View style={styles.containerRow}>
            <Text
              style={styles.inputTitle}
            >
              {'State'}
            </Text>
            <Picker
              style={styles.picker}
              selectedValue={this.state.plateState}
              onValueChange={this.onPlateState.bind(this, 'plateState')} >
                {STATES.map((state) => {
                  return (
                    <Item key={state.abbreviation} label={state.name} value={state.abbreviation} />
                  );
                })}
            </Picker>
          </View>
        </View>
        <View style={styles.groupContainer}>
          <View style={styles.containerRow}>
            <Button
              buttonStyle={styles.button}
              onPress={this.addCar.bind(this)}
              disabled={this.state.plate === ''}
              title={'ADD CAR'}
            />
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
	newInput: {
		letterSpacing: 1.1,
		fontSize: 16,
    fontFamily: FONT,
		height: 50,
		borderBottomWidth: 1,
		borderBottomColor: '#ccc',
    textAlign: 'center',
	},
  inputTitle: {
    fontWeight: 'bold',
    marginTop: 20,
    fontFamily: FONT,
    fontSize: 16,
    color: BLUE,
    textAlign: 'center',
  },
	groupContainer: {
		flexDirection: 'row',
		marginLeft: 50,
		marginRight: 50,
		marginBottom: 20,
	},
	containerRow: {
		flex: 1,
	},
	groupContainerFunction: {
		flexDirection: 'row',
		marginLeft: 5,
		marginRight: 5,
		marginBottom: 30,
	},
	groupContainerExternal: {
		flexDirection: 'row',
		marginLeft: 5,
		marginRight: 5,
		marginBottom: 5,
    marginTop: 50,
    alignSelf: 'flex-end',
	},
	containerRowExternal: {
		flex: 1,
	},
	picWait: {
		width: 90,
		height: 90,
	},
  errorText: {
    fontSize: 12,
    color: 'red',
    fontFamily: FONT,
    textAlign: 'center',
  },
  DigitsAuthenticateButton: {
    flexDirection: 'row',
    height: 50,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: 5,
    margin: 5,
    borderWidth: 1,
    borderColor: BLUE,
    paddingTop: 10,
    paddingBottom: 10,
    marginBottom: 30,
  },
  DigitsAuthenticateButtonText: {
    flex: 1,
    fontSize: 14,
    color: BLUE,
    fontFamily: FONT,
    alignSelf: 'center',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  userNameStyle: {
    marginLeft: 10,
    color: BLUE,
    fontFamily: FONT,
    fontSize: 20,
  },
  button: {
    backgroundColor: BLUE,
    marginLeft: 0,
    marginRight: 0,
  },
});

const mapStateToProps = state => {
  return {
    user: state.user,
    userP: state.userP
  };
};

export default connect(mapStateToProps, actions)(CarsScreen);
