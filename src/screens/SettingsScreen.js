import React, { Component } from 'react';
import {
  StyleSheet,
  ScrollView,
  TextInput,
  View,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Platform,
  Text,
  Alert,
  AppState,
} from 'react-native';
import firebase from 'firebase';
import { connect } from 'react-redux';
import RNFetchBlob from 'react-native-fetch-blob';
import { web } from 'react-native-communications';
import _ from 'lodash';
import Permissions from 'react-native-permissions';
import FCM, {
  FCMEvent,
  RemoteNotificationResult,
  WillPresentNotificationResult,
  NotificationType
} from 'react-native-fcm';
import {
  Button,
  Icon,
} from 'react-native-elements';

import {
  FONT,
  BLUE,
} from '../colors';
import * as actions from '../actions';

import ExternalButton from '../components/externalButton';

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

class SettingsScreen extends Component {
  static navigationOptions = {
    title: 'Settings',
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
        name='gear'
        color='#fff'
      />
    ),
  }

  constructor(props) {
    super(props);

    this.notifications = false;

    this.state = {
      uploading: false,
      userName: this.props.userP.user.userName,
      displayName: !this.props.userP.user.displayName ||
        this.props.userP.user.displayName === this.props.userP.user.userName ?
        '' : this.props.userP.user.displayName,
      tried: false,
      success: false,
    };
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  componentWillReceiveProps(props) {
    if (props.userP.user && props.userP.user.userName) {
      this.setState({
        userName: props.userP.user.userName,
        displayName: !props.userP.user.displayName ||
        props.userP.user.displayName === props.userP.user.userName ?
          '' : props.userP.user.displayName,
      });
      if (!this.notifications) {
        this.notifications = true;
        this.checkNotifications();
      }
    }
  }

  checkNotifications() {
    if (Platform.OS === 'ios') {
      Permissions.getPermissionStatus('notification').then((response) => {
        if (response === Permissions.StatusUndetermined) {
          Alert.alert(
            'Push Notifications',
            'Please allow Neighborly to send you ' +
            'Push Notifications so you\'ll know when somebody sends you an alert!',
            [
              { text: 'Cancel', onPress: () => { } },
              {
                text: 'OK!',
                onPress: () => {
                  this.handleNotifications();
                }
              },
            ]
          );
        } else if (response === Permissions.StatusDenied) {
          //
        } else if (response === Permissions.StatusAuthorized) {
          setTimeout(() => {
            this.handleNotifications();
          }, 2000);
        } else if (response === Permissions.StatusRestricted) {
          //
        }
      });
    } else {
      setTimeout(() => {
        this.handleNotifications();
      }, 2000);
    }
  }

  handleAppStateChange() {
    FCM.setBadgeNumber(0);
    FCM.removeAllDeliveredNotifications();
    this.props.userP.ref.update({
      badge: 0,
    });
  }

  handleNotifications() {
    FCM.requestPermissions(); // for iOS
    FCM.setBadgeNumber(0);
    FCM.removeAllDeliveredNotifications();
    this.props.userP.ref.update({
      badge: 0,
    });
    AppState.addEventListener('change', this.handleAppStateChange.bind(this));
    FCM.getFCMToken().then(token => {
      //console.log(token);
      firebase.database().ref(`/users/${this.props.user.uid}/FCMTokens/${token}`).update({
        token,
      });
        // store fcm token in your server
    });
    this.notificationListener = FCM.on(FCMEvent.Notification, async (notif) => {
      FCM.setBadgeNumber(0);
      FCM.removeAllDeliveredNotifications();
      this.props.userP.ref.update({
        badge: 0,
      });
      // there are two parts of notif. notif.notification contains the
      // notification payload, notif.data contains data payload
      if (notif.local_notification) {
        //this is a local notification
      }
      if (notif.opened_from_tray) {
        //app is open/resumed because user clicked banner
      }
      //await someAsyncCall();

      if (Platform.OS === 'ios') {
        //optional
        //iOS requires developers to call completionHandler to end notification
        //process. If you do not call it your background remote notifications
        //could be throttled, to read more about it see the above documentation link.
        //This library handles it for you automatically with default behavior
        //(for remote notification, finish with NoData; for WillPresent, finish
        //depend on "show_in_foreground"). However if you want to return different
        //result, follow the following code to override
        //notif._notificationType is available for iOS platfrom
        switch (notif._notificationType) {
          case NotificationType.Remote:
            notif.finish(RemoteNotificationResult.NewData); //other types available:
            //RemoteNotificationResult.NewData, RemoteNotificationResult.ResultFailed
            break;
          case NotificationType.NotificationResponse:
            notif.finish();
            break;
          case NotificationType.WillPresent:
            notif.finish(WillPresentNotificationResult.All); //other
            //types available: WillPresentNotificationResult.None
            break;
          default:
            //
        }
      }
    });
    this.refreshTokenListener = FCM.on(FCMEvent.RefreshToken, (token) => {
        console.log(token);
        // fcm token may not be available on first load, catch it here
    });
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

  updateDisplayName() {
    this.props.userP.ref.update({
      displayName: this.state.displayName && this.state.displayName !== '' ?
      this.state.displayName :
      this.props.userP.user.userName,
    });
  }

  completion() {
    let uid = this.props.user.uid;
    firebase.auth().signOut().then(() => {
      this.props.currentUserEmpty();
      this.props.currentUserPropertiesOff(uid);
      this.props.currentUserItemsOff(uid);
      this.notifications = false;
      this.notificationListener.remove();
      this.refreshTokenListener.remove();
      AppState.removeEventListener('change', this.handleAppStateChange.bind(this));
      this.props.navigation.navigate('auth');
    });
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
    return (
      <View style={{
          flex: 1,
          backgroundColor: '#fff',
          paddingBottom: 60,
        }}
      >
        <ScrollView
          style={styles.scrollContainer}
        >
          <View style={styles.container}>
            <View style={styles.groupContainer} >
              <TouchableOpacity style={styles.picHolder} onPress={() => { this.takePicture(); }}>
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
                <Text
                  style={styles.userNameStyle}
                >
                  {this.props.userP.user ? this.props.userP.user.userName : ''}
                </Text>
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
                  onBlur={this.updateDisplayName.bind(this)}
                />
              </View>
            </View>

            <View style={styles.groupContainerExternal}>
              <View style={styles.containerRowExternal}>
                <ExternalButton
                  enabled={true}
                  onPress={() => { web('http://www.hoot-messenger.com/tos.html'); }}
                  style={'white'}
                >
                  {'Terms of Service'}
                </ExternalButton>
                <ExternalButton
                  enabled={true}
                  onPress={() => { web('http://www.hoot-messenger.com/pp.html'); }}
                  style={'white'}
                >
                  {'Privacy Policy'}
                </ExternalButton>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
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
    paddingTop: 20,
		backgroundColor: 'white',
	},
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    fontFamily: FONT,
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
		fontSize: 16,
    fontFamily: FONT,
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
  userNameStyle: {
    marginLeft: 10,
    color: BLUE,
    fontFamily: FONT,
    fontSize: 20,
  },
});

const mapStateToProps = state => {
  return {
    user: state.user,
    userP: state.userP
  };
};

export default connect(mapStateToProps, actions)(SettingsScreen);
