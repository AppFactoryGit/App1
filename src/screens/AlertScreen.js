import React, { Component } from 'react';
import {
  View,
  Text,
  Platform,
  StyleSheet,
  ListView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { connect } from 'react-redux';
import firebase from 'firebase';
import {
  Button,
  Icon,
} from 'react-native-elements';
import _ from 'lodash';
import * as actions from '../actions';

import {
  FONT,
  BLUE,
  DARK_GRAY,
} from '../colors';

class AlertScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Alerts',
      headerStyle: {
        marginTop: Platform.OS === 'android' ? 24 : 0,
        backgroundColor: BLUE,
      },
      headerTintColor: 'white',
      tabBarVisible: false,
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
          name='exclamation'
          color='#fff'
        />
      ),
    };
  }

  constructor(props) {
    super(props);

    this.clicked = false;
		const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

    this.state = {
      items: [],
      dataSource: ds.cloneWithRows([]),
    };
  }

  componentDidMount() {
    setTimeout(() => {
      this.setDataRows(this.props.alertItems);
    }, 1000);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.alertItems !== this.props.alertItems) {
      this.setDataRows(nextProps.alertItems);
    }
  }

  setDataRows(obj) {
    let array = [];
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    if (obj) {
      Object.keys(obj).forEach((key, index) => {
        obj[key].thisRef = key;
      });
      array = _.values(obj);
    }

    this.setState({
      dataSource: ds.cloneWithRows(array),
      items: array,
    });
  }

  onClick() {
    if (!this.clicked) {
      this.clicked = true;
      this.props.navigation.navigate('add');
      setTimeout(() => {
        this.clicked = false;
      }, 1000);
    }
  }

  renderRow(rowData, sectionID, rowID) {
		let url = '';
		if (rowData &&
      rowData.userPic &&
      rowData.userPic !== 'notfound') {
			url = rowData.userPic;
		} else {
			url = 'https://furbioparse.performance-software.com/profilepic.png';
		}
    const date = new Date(rowData.date);
    const options = {
      weekday: "long", year: "numeric", month: "short",
      day: "numeric", hour: "2-digit", minute: "2-digit"
    };
    return (
      <View>
        <View
          style={styles.cardRow}
        >
          <Image
            style={Platform.OS === 'ios' ?
            styles.pic : styles.picAndroid}
            source={{ uri:url }}
          />
          <View
            style={styles.nameMessageWrap}
          >
            <Text style={styles.cardTypeText}>
              {date.toLocaleTimeString("en-us", options)}
            </Text>
            <Text style={styles.cardNumText}>
              {rowData.username.toUpperCase() + " says: " + rowData.message}
            </Text>
            <Text style={styles.plateStateText}>
              {rowData.state + "  " + (this.props.userItems !== null && this.props.userItems[rowData.userItemID] !== null ? this.props.userItems[rowData.usersItemID].identifier.toUpperCase() : '')}
            </Text>
          </View>
        </View>
      </View>
		);
  }

  itemsListView() {
    return (
      <ListView style={styles.listView}
        automaticallyAdjustContentInsets={false}
        showsVerticalScrollIndicator={true}
        scrollEnabled={true}
        enableEmptySections={true}
        dataSource={this.state.dataSource}
        ref='listView'
        renderRow={this.renderRow.bind(this)} />
    );
  }

  render () {
    if (this.state.items) {
      return (
        <View style={styles.container} >
          {this.itemsListView()}
        </View>
      );
    }
    return (
      <View style={styles.container} >
        <Button
          raised
          title="YOU HAVE NO ALERTS"
          color={'#fff'}
          onPress={() => { }}
          buttonStyle={styles.buttonStyle}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingBottom: 50,
  },
  buttonStyle: {
    backgroundColor: BLUE,
  },
	listView: {
		flex: 1,
		padding: 1,
    backgroundColor: 'transparent',
	},
  cardRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: DARK_GRAY,
    paddingTop: 10,
    paddingBottom: 10,
  },
  nameMessageWrap: {
    flex: 1,
    flexDirection: 'column',
  },
  cardTypeText: {
    color: DARK_GRAY,
    fontSize: 18,
    textAlign: 'left',
    marginLeft: 10,
    marginTop: 5,
    fontWeight: 'bold',
    flex: 1,
    marginBottom: 3,
  },
  plateStateText: {
    color: DARK_GRAY,
    fontSize: 14,
    textAlign: 'left',
    marginLeft: 10,
    flex: 1,
    marginBottom: 3,
  },
  cardNumText: {
    color: DARK_GRAY,
    fontSize: 14,
    textAlign: 'left',
    marginLeft: 10,
    flex: 1,
    marginBottom: 3,
  },
  defaultCCText: {
    color: 'green',
    fontSize: 14,
    textAlign: 'right',
    marginRight: 20,
  },
	picAndroid: {
		width: 46,
		height: 46,
		resizeMode: 'cover',
    borderRadius: 23,
    marginLeft: 10,
	},
	pic: {
		width: 46,
		height: 46,
		resizeMode: 'cover',
    borderRadius: 23,
    marginLeft: 10,
	},
});

const mapStateToProps = state => {
  return {
    user: state.user,
    userP: state.userP,
    alertItems: state.alertItems,
    userItems: state.userItems,
  };
};

export default connect(mapStateToProps, actions)(AlertScreen);
