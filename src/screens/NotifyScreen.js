import React, { Component } from 'react';
import {
  View,
  Text,
  Platform,
  StyleSheet,
  TextInput,
  Picker,
  ScrollView,
  Alert,
} from 'react-native';
const Item = Picker.Item;
import { connect } from 'react-redux';
import firebase from 'firebase';
import {
  Button,
  Icon,
} from 'react-native-elements';
import * as actions from '../actions';

import {
  FONT,
  BLUE
} from '../colors';
import {
  STATES
} from '../components/states';
import {
  CAR_MESSAGES
} from '../components/car_messages';

class NotifyScreen extends Component {
  static navigationOptions = {
    title: 'Notify',
    headerTitle: 'Notify a Car Owner',
    headerStyle: {
      marginTop: Platform.OS === 'android' ? 24 : 0,
      backgroundColor: BLUE,
    },
    headerTintColor: 'white',
    tabBarIcon: (
      <Icon
        raised
        type='font-awesome'
        style={{
          height: 34,
          width: 34,
          alignItems: 'center',
          justifyContent: 'center',
        }}
        name='send'
        color='#fff'
      />
    ),
  }

  constructor(props) {
    super(props);

    this.state = {
      plate: '',
      plateState: 'AL',
      message: 'Your lights are on!',
    }
  }

  inputFocused() {

  }

  onPlateState(key, value) {
    this.setState({
      plateState: value,
    });
  }

  onMessage(key, value) {
    this.setState({
      message: value,
    });
  }

  notify() {
		Alert.alert(
			"Send Message?",
			"Are you sure you want send,\n\n'" + this.state.message + "'\n\nto\n\n" +
        this.state.plateState + " - " + this.state.plate,
			[
				{text: 'Cancel', onPress: () => {}, style:'destructive'},
				{text: 'Yes', onPress: () => {
          firebase.database().ref(`/allNotifications`).push({

          }).then((ref) => {
            const data = {
              identifier: this.state.plate,
              idStripped: this.state.plate.replace(/\W/g, '').toUpperCase(),
              state: this.state.plateState,
              uid: this.props.user.uid,
              idStateIndex: this.state.plateState + '|' + this.state.plate.replace(/\W/g, '').toUpperCase(),
              message: this.state.message,
              date: new Date(),
              key: ref.key,
              username: this.props.userP.user.userName,
              userPic: this.props.userP.user.picUrl,
            };
            ref.update(data);
            firebase.database().ref(`/userSentNotifications/${this.props.user.uid}/${ref.key}`).update(data);
            this.setState({
              plate: '',
              plateState: 'AL',
              message: 'Your lights are on!',
            });
          });
          Alert.alert(
      			"Success!",
      			"Your message has been sent! We greatly appreciate your help!",
      			[
      				{text: 'OK', onPress: () => {}, style:'confirm'},
      			]
      		);
        }, style: 'confirm'},
			]
		);
  }

  render () {
    return (
      <ScrollView style={styles.scrollContainer} >
        <View style={styles.container}>
          <View style={styles.plateStateContainer}>
            <View style={styles.plateStateGroup}>
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
            <View style={styles.plateStateGroup}>
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
              <Text
                style={styles.inputTitle}
              >
                {'Message'}
              </Text>
              <Picker
                style={styles.picker}
                selectedValue={this.state.message}
                onValueChange={this.onMessage.bind(this, 'message')} >
                  {CAR_MESSAGES.map((message) => {
                    return (
                      <Item key={message.key} label={message.text} value={message.text} />
                    );
                  })}
              </Picker>
            </View>
          </View>
          <View style={styles.groupContainer}>
            <View style={styles.containerRow}>
              <Button
                buttonStyle={styles.button}
                onPress={this.notify.bind(this)}
                disabled={this.state.plate === ''}
                title={'SEND NOTIFICATION'}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingBottom: 20,
  },
	scrollContainer: {
    flex: 1,
		backgroundColor: 'white',
    marginBottom: 50,
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
  plateStateContainer: {
    flexDirection: 'row',
    flex: 1,
  },
  plateStateGroup: {
    flex: 1,
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
  picker: {

  }
});

const mapStateToProps = state => {
  return {
    user: state.user,
    userP: state.userP
  };
};

export default connect(mapStateToProps, actions)(NotifyScreen);
