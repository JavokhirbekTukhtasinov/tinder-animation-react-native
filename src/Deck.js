import React, {useState} from 'react';
import {
  View,
  Text,
  PanResponder,
  Animated,
  Dimensions,
  StyleSheet,
} from 'react-native';
import {Button, Card} from 'react-native-elements';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = 0.5 * SCREEN_WIDTH;
const SWIPE_OUT_DURATION = 250;

const Deck = ({
  data,
  renderData,
  onSwipeLeft = () => {},
  onSwipeRight = () => {},
}) => {
  //   const [position, setPostion] = useState({x: null, y: null});
  const [index, setIndex] = useState(0);

  const animation = new Animated.ValueXY();
  const panResponder = PanResponder.create({
    // Ask to be the responder:
    onStartShouldSetPanResponder: (evt, gestureState) => true,

    onPanResponderMove: (evt, gestureState) => {
      animation.setValue({x: gestureState.dx, y: gestureState.dy});
    },

    onPanResponderRelease: (evt, gestureState) => {
      if (gestureState.dx > SWIPE_THRESHOLD) {
        foreSwipe('right');
      } else if (gestureState.dx < -SWIPE_THRESHOLD) {
        foreSwipe('left');
      } else {
        resetPosition();
      }
    },
  });

  // Animayion
  Animated.spring(animation, {
    toValue: {
      x: 0,
      y: 0,
    },
    useNativeDriver: false,
  }).start();

  const foreSwipe = direction => {
    const x = direction === 'right' ? SCREEN_WIDTH : -SCREEN_WIDTH;
    Animated.timing(animation, {
      toValue: {x, y: 0},
      duration: SWIPE_OUT_DURATION,
      useNativeDriver: false,
    }).start(() => onSwipteComplete(direction));
  };

  const onSwipteComplete = direction => {
    const item = data[index];
    direction === 'rigth' ? onSwipeRight(item) : onSwipeLeft(item);
    setIndex(index + 1);
  };

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

  const noMoreCard = () => {
    return (
      <Card>
        <Card.Title>No More Card</Card.Title>
        <Card.Divider />
        <Text>
          If you want to see more cads then please pres "Get more" button
        </Text>
        <Button title={'Get more'} onPress={() => setIndex(0)} />
      </Card>
    );
  };

  const renderCards = () => {
    if (index >= data.length) {
      return noMoreCard();
    }
    return data.map((item, i) => {
      if (i < index) return null;
      if (i === index) {
        return (
          <Animated.View
            key={item.id}
            style={[getCardStyle(), {position: 'absolute'}]}
            {...panResponder.panHandlers}>
            {renderData(item)}
          </Animated.View>
        );
      }
      return renderData(item);
    });
  };
  return (
    <View style={{height: '100%'}}>
      <Animated.View>{renderCards()}</Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    position: 'absolute',
    width: SCREEN_WIDTH,
    height: '100%',
  },
});
export default Deck;
