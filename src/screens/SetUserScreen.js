import React, { Component } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  AsyncStorage,
  Alert,
  StyleSheet,
  Dimensions,
  StatusBar,
  Platform,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
} from 'react-native';
import { connect } from 'react-redux';
import axios from 'axios';
import Permissions from 'react-native-permissions';
import firebase from 'firebase';

import RNFetchBlob from 'react-native-fetch-blob';
import { web } from 'react-native-communications';
import { Button } from 'react-native-elements';
import * as actions from '../actions';

import {
  FONT,
  BLUE,
} from '../colors';

const Blob = RNFetchBlob.polyfill.Blob;
window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
window.Blob = Blob;
const ImagePicker = require('react-native-image-picker');

const options = {
  title: 'Profile Picture!', // specify null or empty string to remove the title
  cancelButtonTitle: 'Cancel',
  takePhotoButtonTitle: 'Take Photo...', // specify null or empty string to remove this button
  chooseFromLibraryButtonTitle: 'Choose from Library...',
  // specify null or empty string to remove this button

  maxWidth: 500,
  maxHeight: 500,
  quality: 1.0,
  allowsEditing: true, // Built in iOS functionality to resize/reposition the image
  noData: false,
  // Disables the base64 `data` field from being generated
  //(greatly improves performance on large photos)
  storageOptions: {
    // if this key is provided, the image will get saved in the
    //documents directory (rather than a temporary directory)
    skipBackup: true, // image will NOT be backed up to icloud
    path: 'images' // will save image at /Documents/images rather than the root
  }
};

class SetUserScreen extends Component {
  static navigationOptions = {
    title: 'Account Setup',
  }

  constructor(props) {
    super(props);

    this.state = {
      uploading: false,
      userName: this.props.userP.user.userName,
      displayName: !this.props.userP.user.displayName ||
        this.props.userP.user.displayName === this.props.userP.user.userName ?
        '' : this.props.userP.user.displayName,
      tried: false,
      success: false,
      show: false,
    };
  }

  componentDidMount() {
    if (this.props.userP.ref !== null) {
      this.setState({
        show: (this.props.userP.ref && this.props.userP.user && (!this.props.userP.user.userName || this.props.userP.user.userName === '')),
      });
    }
  }

  componentWillReceiveProps(props) {
    if (props.userP.ref !== null && !this.state.show) {
      this.setState({
        show: (props.userP.ref && props.userP.user && (!props.userP.user.userName || props.userP.user.userName === '')),
      });
    }
  }

  inputFocused() {

  }

  isValid(str) {
    return /^\w+$/.test(str);
  }

  takePicture() {
    if (this.state.uploading) {
      return;
    }
    const This = this;

    ImagePicker.showImagePicker(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        if (!response.data) {
          return;
        }
        this.setState({ uploading: true });
        // You can display the image using either data...
        //const source = {uri: response.uri.replace('file://', ''), isStatic: true};
        const elem = response.uri.split('/');
        const filename = elem[elem.length - 1];

        const storage = firebase.storage();
        const storageRef = storage.ref();

        const uri = Platform.OS === 'ios' ? response.uri.replace('file://', '') : response.uri;

        const rnfbURI = RNFetchBlob.wrap(uri);
        Blob.build(rnfbURI, { type: 'image/jpg;' }).then((blob) => {
          const profileRef = storageRef.child('profilePic/' + this.props.user.uid + '/' + filename);
          profileRef.put(blob, { contentType: 'image/jpg' }).then((snapshot) => {
            const url = snapshot.metadata.downloadURLs[0];
            this.props.userP.ref.update({
              picUrl: url,
            });
            This.setState({ uploading: false, });
          })
          .catch((error) => {
            console.log(error);
          });
        })
        .catch((error) => {
          console.log(error);
        });
      }
    });
  }

  checkForUniqueness() {
    if (this.state.userName) {
      if (this.isValid(this.state.userName.toUpperCase())) {
        this.props.userP.ref.update({
          userName: this.state.userName.toUpperCase()
        }).then(() => {
          let taken = '';
          const searchRef = firebase.database().ref('users');
          searchRef.orderByChild('userName').equalTo(this.state.userName.toUpperCase())
          .limitToLast(10)
          .once('value', (snapshot) => {
            let success = false;
            if (Object.keys(snapshot.val()).length === 1 &&
            Object.keys(snapshot.val())[0] === this.props.user.uid) {
              success = true;
            } else {
              taken = 'User Name ' + this.state.userName + ' is taken!';
              this.props.userP.ref.update({
                userName: ''
              });
            }
            this.setState({
              tried: true,
              success,
              reason: taken,
            });
          });
        });
      } else {
        let error = 'Please, only letters/numbers in User Name';
        if (this.state.userName === '') {
          error = 'Please enter a username!';
        }
        this.setState({
          tried: true,
          success: false,
          reason: error,
          userName: '',
        });
        this.props.userP.ref.update({
          userName: ''
        });
      }
    }
  }

  submitChanges() {
    this.props.userP.ref.update({
      displayName: this.state.displayName !== '' ?
        this.state.displayName :
        this.props.userP.user.userName,
    });
    this.props.navigation.navigate('main');
  }

  render() {
		let url = '';
		if (this.props.userP &&
      this.props.userP.user &&
      this.props.userP.user.picUrl &&
      this.props.userP.user.picUrl !== 'notfound') {
			url = this.props.userP.user.picUrl;
		} else {
			url = 'https://furbioparse.performance-software.com/profilepic.png';
		}

    if (this.state.show) {
      return (
        <View style={{flex:1}}>
          <View style={styles.bannerContainer}>
            <View style={styles.bannerRow}>
              <Button
                title="Account Setup"
                buttonStyle={styles.bannerButtonStyle}
                color={'#fff'}
                onPress={() => {}}
              />
            </View>
          </View>
          <ScrollView
            style={styles.scrollContainer}
          >
            <View style={styles.container}>
              <View style={styles.groupContainer} >
                <TouchableOpacity onPress={() => { this.takePicture(); }}>
                  {!this.state.uploading ?
                    <Image
                      style={Platform.OS === 'ios' ?
                      styles.pic : styles.picAndroid}
                      source={{ uri: url }}
                    /> :
                    <ActivityIndicator
                      style={styles.picWait}
                      color={BLUE}
                      size="small"
                    />
                  }
                </TouchableOpacity>

                <View style={styles.containerRow} >
                  <TextInput
                    style={styles.newInput}
                    value={this.state.userName}
                    autoCorrect={false}
                    spellCheck={false}
                    blurOnSubmit={true}
                    returnKeyType="done"
                    placeholder="User Name"
                    placeholderTextColor="#aaa"
                    clearButtonMode="always"
                    multiline={false}
                    ref="userName"
                    onFocus={this.inputFocused.bind(this, 'userName')}
                    underlineColorAndroid="#fff"
                    onChangeText={(text) => { this.setState({ userName: text }); }}
                    onBlur={this.checkForUniqueness.bind(this)}
                  />
                  <TextInput
                    style={styles.newInput}
                    value={this.state.displayName}
                    autoCorrect={false}
                    spellCheck={false}
                    blurOnSubmit={true}
                    returnKeyType="done"
                    placeholder="Display Name (optional)"
                    placeholderTextColor="#aaa"
                    clearButtonMode="always"
                    multiline={false}
                    autoCapitalize="none"
                    ref="displayName"
                    onFocus={this.inputFocused.bind(this, 'displayName')}
                    underlineColorAndroid="#fff"
                    onChangeText={(text) => { this.setState({ displayName: text }); }}
                  />
                </View>
              </View>
              <View style={styles.groupContainer}>
                <View style={styles.containerRow}>
                  <Text style={styles.errorText} >
                    {!this.state.sucess && this.state.tried ? this.state.reason : ''}
                  </Text>
                </View>
              </View>
              <View style={styles.groupContainer}>
                <View style={styles.containerRow}>
                  <Button
                    title="All Set!"
                    raised
                    buttonStyle={styles.buttonStyle}
                    color="#fff"
                    onPress={this.submitChanges.bind(this)}
                    disabled={!this.state.tried && !this.state.success && this.state.userName === ''}
                  />
                </View>
              </View>
              <View style={styles.groupContainer}>
                <View style={styles.containerRow}>
                  <Text style={styles.tos}>
                    {'By clicking \'All Set!\' you agree to our ' +
                    ' Terms of Service and our Privacy Policy detailed below:'}
                  </Text>
                </View>
              </View>
              <View style={styles.groupContainer}>
                <View style={styles.containerRow}>
                  <Button
                    title="Terms of Service"
                    buttonStyle={styles.buttonStyleWhite}
                    color={BLUE}
                    onPress={() => { web('http://www.hoot-messenger.com/tos.html'); }}
                  />
                </View>
              </View>
              <View style={styles.groupContainer}>
                <View style={styles.containerRow}>
                  <Button
                    title="Privacy Policy"
                    buttonStyle={styles.buttonStyleWhite}
                    color={BLUE}
                    onPress={() => { web('http://www.hoot-messenger.com/pp.html'); }}
                  />
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      );
    }
    return (
      <View style={{
          flex: 1,
          backgroundColor: BLUE,
        }}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
	scrollContainer: {
    flex: 1,
		backgroundColor: 'white',
    paddingTop: 20,
	},
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    fontFamily: FONT,
    margin: 10,
    color: '#000000',
  },
	picAndroid: {
		width: 90,
		height: 90,
		resizeMode: 'cover',
    borderRadius: 45,
	},
	pic: {
		width: 90,
		height: 90,
		resizeMode: 'cover',
    borderRadius: 45,
	},
	newInput: {
		flex: 1,
		letterSpacing: 1.1,
    fontFamily: FONT,
		fontSize: 16,
		height: 50,
		borderBottomWidth: 1,
		borderBottomColor: '#ccc',
		paddingLeft: 10,
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
	bannerContainer: {
		flexDirection: 'row',
	},
	bannerRow: {
		flex: 1,
	},
	picWait: {
		width: 90,
		height: 90,
	},
  errorText: {
    fontSize: 12,
    fontFamily: FONT,
    color: 'red',
    textAlign: 'center',
  },
  tos: {
    fontSize: 14,
    fontFamily: FONT,
    color: BLUE,
    textAlign: 'center',
  },
  buttonStyle: {
    backgroundColor: BLUE,
    marginLeft: 0,
    marginRight: 0,
  },
  bannerButtonStyle: {
    backgroundColor: BLUE,
    marginLeft: 0,
    marginRight: 0,
    height: 60,
    paddingTop: 30,
  },
  buttonStyleWhite: {
    backgroundColor: '#fff',
    marginBottom: 45,
    height: 45,
  },
});

const mapStateToProps = (state) => {
  return {
    user: state.user,
    userP: state.userP,
    welcomeSeen: state.welcomeSeen,
  };
}

export default connect(mapStateToProps, actions)(SetUserScreen);
