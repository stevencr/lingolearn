import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Button} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Story} from './storyApi';

interface AudioControlsProps {
  isPlaying: boolean;
  onStart: (text: string) => void;
  onStop: () => void;
  data: Story;
}

const AudioControls: React.FC<AudioControlsProps> = ({
  isPlaying,
  onStart,
  onStop,
  data,
}) => {
  const playStory = (...elements: string[]) => {
    const delay = 2000;
    const playElement = (index: number) => {
      if (index < elements.length) {
        onStart(elements[index]);
        setTimeout(() => {
          playElement(index + 1);
        }, delay);
      }
    };
    playElement(0);
  };

  return (
    <View style={styles.audioContainer}>
      {!isPlaying && (
        <Button
          style={styles.audioButton}
          onPress={() => playStory(data.title, data.by, data.story)}
          icon={() => (
            <Icon
              name="play-circle"
              style={styles.audioIcon}
              size={26}
              color="green"
            />
          )}>
          &nbsp;
        </Button>
      )}
      {isPlaying && (
        <Button
          style={styles.audioButton}
          onPress={onStop}
          icon={() => (
            <Icon
              name="stop-circle"
              style={styles.audioIcon}
              size={26}
              color="red"
            />
          )}>
          &nbsp;
        </Button>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  audioContainer: {
    borderTopColor: '#ccc',
    borderTopWidth: 1,
    marginBottom: 8,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  audioButton: {zIndex: 2000},
  audioIcon: {
    left: 10,
    padding: 0,
  },
});

export default AudioControls;
