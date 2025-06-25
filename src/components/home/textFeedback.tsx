import {StyleSheet, Text} from 'react-native';
import React, {useEffect, useState} from 'react';
import {PropsWithChildren} from 'react';
import {FadeIn, LightSpeedOutLeft} from 'react-native-reanimated';
import Animated from 'react-native-reanimated';
import {PERFECT_SCORE} from '../../constants/const';
import {useScrollView} from '../../contexts/scrollViewProvider';

type Props = PropsWithChildren<{
  rating?: number;
  text: string | string[] | undefined;
}>;

const TextFeedback = ({rating, text}: Props) => {
  const FEEDBACK_HIDE_DELAY = 4000;
  const scrollView = useScrollView();

  const [showFeedback, setShowFeedback] = useState(true);
  const errors: string[] =
    typeof text === 'string' ? [text] : text === undefined ? [] : text;

  const isCorrect = rating === PERFECT_SCORE;
  useEffect(() => {
    if (rating === PERFECT_SCORE) {
      const timeoutId = setTimeout(() => {
        setShowFeedback(false);
      }, FEEDBACK_HIDE_DELAY);
      return () => clearTimeout(timeoutId);
    }
    return () => {};
  });

  useEffect(() => {
    if (showFeedback) {
      scrollView.scrollToEnd();
    }
  }, [showFeedback, scrollView]);

  if (!showFeedback) {
    return null;
  }

  return (
    <Animated.View
      entering={FadeIn.duration(750)}
      exiting={LightSpeedOutLeft}
      style={[
        styles.commonStyle,
        isCorrect ? styles.correct : styles.incorrect,
      ]}>
      <>
        {errors.map((error: string, index: number) => (
          <Text
            key={index}
            style={isCorrect ? styles.correctText : styles.incorrectText}>
            {error}
          </Text>
        ))}
      </>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  commonStyle: {
    position: 'relative',
    top: -20,
    height: 'auto',
    marginBottom: -15,
    margin: 8,
    borderRadius: 8,
    shadowColor: '#171717',
    shadowOffset: {width: 2, height: 4},
    shadowOpacity: 0.9,
    shadowRadius: 3,
  },
  incorrect: {
    flex: 1,
    alignSelf: 'center',
    width: 300,
    marginRight: 16,
    borderColor: '#333',
    backgroundColor: '#E11A1A',
    borderWidth: 1,
    opacity: 1,
    padding: 8,
  },
  correct: {
    alignSelf: 'flex-end',
    marginRight: 16,
    backgroundColor: '#7BF55C',
    padding: 8,
  },
  correctText: {
    color: 'black',
    fontSize: 13,
    textAlign: 'center',
  },
  incorrectText: {
    color: 'white',
    fontSize: 13,
    textAlign: 'left',
    padding: 2,
  },
});

export default TextFeedback;
