import React, { Component } from 'react';
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  StyleSheet,
} from 'react-native';
import { Button } from 'react-native-elements';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

class Slides extends Component {
  renderProgress (index) {
    if (index === this.props.data.length - 1) {
      return (
        <Button
          title="Let's go!"
          raised
          buttonStyle={styles.buttonStyle}
          color="#03A9F4"
          onPress={this.props.onComplete}
        />
      );
    }
    return (
      <View style={styles.bubblesStyle}>
        {this.props.data.map((slide, i) => {
          if (i === index) {
            return (
              <View key={i} style={styles.bubbleStyle} />
            );
          }
          return (
            <View key={i} style={styles.bubbleStyleFilled} />
          );
        })}
      </View>
    );
  }

  renderSlides () {
    return this.props.data.map((slide, index) => {
      return (
        <View
          style={[styles.slideStyle, {
            backgroundColor: slide.color,
          }]}
          key={slide.text}
        >
          <View style={styles.textContainer}>
            <Text
              style={styles.textStyle}
            >
              {slide.text}
            </Text>
          </View>
          {this.renderProgress(index)}
        </View>
      );
    });
  }

  render () {
    return (
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        style={{
          flex: 1,
          backgroundColor: '#03A9F4',
        }}
      >
        {this.renderSlides()}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textStyle: {
    fontSize: 30,
    color: '#ffffff',
    textAlign: 'center',
  },
  slideStyle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: SCREEN_WIDTH,
  },
  buttonStyle: {
    backgroundColor: '#fff',
    marginBottom: 45,
    height: 45,
  },
  bubblesStyle: {
    marginBottom: 45,
    height: 45,
    backgroundColor: 'transparent',
    flexDirection: 'row',
  },
  bubbleStyleFilled: {
    height: 20,
    width: 20,
    margin: 2,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'white',
    backgroundColor: 'transparent',
  },
  bubbleStyle: {
    height: 20,
    width: 20,
    margin: 2,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'white',
    backgroundColor: 'white',
  },
});

export default Slides;
