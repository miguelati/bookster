import React, {useEffect, useMemo} from 'react';
import {Dimensions, StyleSheet, SafeAreaView} from 'react-native';
import Animated, {
  withTiming,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withDelay,
  withSequence,
} from 'react-native-reanimated';

const COMMON_TIME = 2000;
const BOX_WIDTH = 90;
const BOX_HEIGHT = 90;
const BOTTOM_MARGIN = 60;
const COLORS = ['#0000FF', '#FF0000', '#FF00FF', '#00FF00'];
const SCREEN_WIDTH = Dimensions.get('screen').width;
const SCREEN_HEIGHT = Dimensions.get('screen').height;

function App(): React.JSX.Element {
  const sharedX = useSharedValue(0);
  const sharedY = useSharedValue(0);
  const sharedColor = useSharedValue(COLORS[0]);

  const sharedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: sharedX.value,
      },
      {
        translateY: sharedY.value,
      },
    ],
    backgroundColor: sharedColor.value,
  }));

  const sequenceX = useMemo(
    () =>
      withSequence(
        withTiming(
          SCREEN_WIDTH - BOX_WIDTH,
          {duration: COMMON_TIME},
          () =>
            (sharedColor.value = withTiming(COLORS[2], {
              duration: COMMON_TIME,
            })),
        ),
        withDelay(
          COMMON_TIME,
          withTiming(
            0,
            {duration: COMMON_TIME},
            () =>
              (sharedColor.value = withTiming(COLORS[3], {
                duration: COMMON_TIME,
              })),
          ),
        ),
        withTiming(0, {duration: COMMON_TIME}),
      ),
    [sharedColor],
  );

  const sequenceY = useMemo(
    () =>
      withSequence(
        withDelay(
          COMMON_TIME,
          withTiming(
            SCREEN_HEIGHT - BOX_HEIGHT - BOTTOM_MARGIN,
            {duration: COMMON_TIME},
            () =>
              (sharedColor.value = withTiming(COLORS[0], {
                duration: COMMON_TIME,
              })),
          ),
        ),
        withDelay(
          COMMON_TIME,
          withTiming(
            0,
            {duration: COMMON_TIME},
            () =>
              (sharedColor.value = withTiming(COLORS[1], {
                duration: COMMON_TIME,
              })),
          ),
        ),
      ),
    [sharedColor],
  );

  useEffect(() => {
    sharedColor.value = withTiming(COLORS[1], {
      duration: COMMON_TIME,
    });
    sharedX.value = withRepeat(sequenceX, -1, false);
    sharedY.value = withRepeat(sequenceY, -1, false);
  }, [sequenceX, sequenceY, sharedColor, sharedX, sharedY]);

  return (
    <SafeAreaView>
      <Animated.View style={[styles.square, sharedStyle]} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  square: {width: BOX_WIDTH, height: BOX_HEIGHT, backgroundColor: '#999'},
});

export default App;
