import React, {Component} from 'react';
import {StyleSheet, Text, View, Animated} from 'react-native';

export default class Ball extends Component {
  constructor(props) {
    super(props);
    this.postion = new Animated.ValueXY(0, 0);
  }
  componentDidMount() {
    Animated.spring(this.postion, {
      toValue: {
        x: 300,
        y: 500,
      },
      useNativeDriver: true,
    }).start();
  }
  render() {
    return (
      <Animated.View style={this.postion.getLayout()}>
        <View style={styles.ball} />
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  ball: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'black',
  },
});
