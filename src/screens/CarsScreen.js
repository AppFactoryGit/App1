import React, { Component } from 'react';
import {
  View,
  Text,
  Platform,
  StyleSheet,
  ListView,
  TouchableOpacity,
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

class CarsScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Cars',
      headerStyle: {
        marginTop: Platform.OS === 'android' ? 24 : 0,
        backgroundColor: BLUE,
      },
      headerTintColor: 'white',
      tabBarVisible: false,
      headerRight: (
        <Button
          title={'Add Car'}
          backgroundColor="transparent"
          onPress={ () => { navigation.navigate('add'); }}
          color={'white'}
        />
      ),
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
          name='car'
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
      this.setDataRows(this.props.userItems);
    }, 1000);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.userItems !== this.props.userItems) {
      this.setDataRows(nextProps.userItems);
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
    return (
      <TouchableOpacity
        style={styles.cardRow}
        onPress={() => { }}
      >
        <Text style={styles.cardTypeText}>
          {rowData.identifier.toUpperCase()}
        </Text>
        <Text style={styles.cardNumText}>
          {rowData.state}
        </Text>
      </TouchableOpacity>
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
          title="ADD A CAR"
          color={'#fff'}
          onPress={this.onClick.bind(this)}
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
    height: 60,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  cardTypeText: {
    color: DARK_GRAY,
    fontSize: 18,
    textAlign: 'left',
    marginLeft: 15,
    fontWeight: 'bold',
  },
  cardNumText: {
    color: DARK_GRAY,
    fontSize: 14,
    textAlign: 'left',
    marginLeft: 6,
    flex: 1,
  },
  defaultCCText: {
    color: 'green',
    fontSize: 14,
    textAlign: 'right',
    marginRight: 20,
  }
});

const mapStateToProps = state => {
  return {
    user: state.user,
    userP: state.userP,
    userItems: state.userItems,
  };
};

export default connect(mapStateToProps, actions)(CarsScreen);
