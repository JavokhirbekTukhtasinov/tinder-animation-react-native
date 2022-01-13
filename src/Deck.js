import React, {useState} from 'react';
import {View, Text, PanResponder, Animated, Dimensions} from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const Deck = ({data, renderData}) => {
  const [position, setPostion] = useState({x: null, y: null});
  const panResponder = React.useRef(
    PanResponder.create({
      // Ask to be the responder:
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
      onPanResponderGrant: (evt, gestureState) => {
        // The gesture has started. Show visual feedback so the user knows
        // what is happening!
        // gestureState.d{x,y} will be set to zero now
      },
      onPanResponderMove: (evt, gestureState) => {
        setPostion({
          x: gestureState.dx,
          y: gestureState.dy,
        });
        // The most recent move distance is gestureState.move{X,Y}
        // The accumulated gesture distance since becoming responder is
        // gestureState.d{x,y}
      },
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onPanResponderRelease: (evt, gestureState) => {
        resetPosition();
        console.log('stopped');
      },
      onPanResponderTerminate: (evt, gestureState) => {
        // Another component has become the responder, so this gesture
        // should be cancelled
      },
      onShouldBlockNativeResponder: (evt, gestureState) => {
        // Returns whether this component should block native components from becoming the JS
        // responder. Returns true by default. Is currently only supported on android.
        return true;
      },
    }),
  ).current;

  // Animayion
  const animation = new Animated.ValueXY();
  Animated.spring(animation, {
    toValue: {
      x: position.x,
      y: position.y,
    },
    useNativeDriver: false,
  }).start();

  const resetPosition = () => {
    Animated.spring(animation, {
      toValue: {
        x: 0,
        y: 0,
      },
      useNativeDriver: false,
    }).start();
  };

  const getCardStyle = () => {
    const rotate = animation.x.interpolate({
      inputRange: [-SCREEN_WIDTH * 1.5, 0, SCREEN_WIDTH * 1.5],
      outputRange: ['-120deg', '0deg', '120deg'],
    });

    return {
      ...animation.getLayout(),
      transform: [{rotate}],
    };
  };

  const renderCards = () => {
    return data.map((item, index) => {
      if (index === 0) {
        return (
          <Animated.View
            key={index}
            style={getCardStyle()}
            {...panResponder.panHandlers}>
            {renderData(item)}
          </Animated.View>
        );
      }
      return renderData(item);
    });
  };
  return <View>{renderCards()}</View>;
};

export default Deck;
