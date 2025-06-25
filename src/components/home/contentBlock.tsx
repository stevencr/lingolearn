import {StyleSheet, View} from 'react-native';
import {Avatar, Text, Card, Button} from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import React, {useEffect, JSX, useCallback} from 'react';
import {useAppSelector, useAppDispatch} from '../../app/hooks';
import Animated, {BounceInDown} from 'react-native-reanimated';
import Tts from 'react-native-tts';
import {getLangCode} from '../settings/languages';
import {IMessage} from '../../types/types';
import {markAsPlayed} from './conversationsSlice';

interface ContentBlockProps {
  message: IMessage;
  avatarSrc: string;
  isLastMessage: boolean;
}

const speak = (phrase: string) => {
  Tts.getInitStatus().then(() => {
    Tts.speak(phrase);
  });
};

const ContentBlock: React.FC<ContentBlockProps> = ({
  message,
  avatarSrc,
  isLastMessage,
}): JSX.Element => {
  const {id, targetLang, sourceLang, isBot, played} = message;
  const settings = useAppSelector(state => state.settings);
  const {showTranslation, autoPlay} = settings;
  const dispatch = useAppDispatch();

  const langCode: string = getLangCode(settings.targetLang);

  Tts.setDefaultLanguage(langCode);

  const handleAutoPlay = useCallback(() => {
    if (
      isBot &&
      isLastMessage &&
      !played &&
      autoPlay &&
      targetLang !== 'typing...'
    ) {
      dispatch(markAsPlayed({id}));
      speak(targetLang);
    }
  }, [isBot, isLastMessage, autoPlay, played, id, dispatch, targetLang]);

  useEffect(() => {
    handleAutoPlay();
  }, [handleAutoPlay, isLastMessage, autoPlay, dispatch, message]);

  return isBot ? (
    <Animated.View entering={BounceInDown.delay(0).duration(1000)}>
      <Card style={styles.botCard}>
        <View style={[styles.block, styles.botBlock]}>
          <Avatar.Image
            size={48}
            source={{
              uri: avatarSrc,
            }}
          />
          <View>
            <Text style={styles.targetText}>{targetLang}</Text>
            {showTranslation && (
              <Text style={styles.sourceText}>{sourceLang}</Text>
            )}
          </View>
        </View>
        {targetLang !== 'typing...' && (
          <View style={styles.audioContainer}>
            <Button
              style={styles.audioButton}
              onPress={() => speak(targetLang)}
              icon={() => (
                <Icon
                  name={'play-circle'}
                  style={styles.audioIcon}
                  size={26}
                  color="green"
                />
              )}>
              &nbsp;
            </Button>
          </View>
        )}
      </Card>
    </Animated.View>
  ) : (
    <Animated.View entering={BounceInDown.duration(1000)}>
      <Card style={styles.userCard}>
        <View style={[styles.block, styles.userBlock]}>
          <Text style={[styles.targetText]}>{targetLang}</Text>
          <Avatar.Image
            size={48}
            source={{
              uri: avatarSrc,
            }}
          />
        </View>
      </Card>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  id: {
    position: 'absolute',
    top: 0,
    left: 0,
    fontSize: 10,
  },
  botCard: {
    backgroundColor: '#F2F8F8',
    justifyContent: 'flex-start',
    margin: 8,
    padding: 8,
    paddingRight: 16,
  },
  userCard: {
    backgroundColor: '#F8F2F2',
    justifyContent: 'flex-start',
    margin: 8,
    padding: 8,
  },
  audioContainer: {
    borderTopColor: '#ccc',
    borderTopWidth: 1,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  audioButton: {
    marginTop: 8,
    width: 40,
    right: -4,
    zIndex: 2000,
  },
  audioIcon: {
    left: 10,
    padding: 0,
  },
  block: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 8,
    borderRadius: 8,
    padding: 2,
    paddingHorizontal: 12,
  },
  botBlock: {
    backgroundColor: '#F2F8F8',
    justifyContent: 'flex-start',
    paddingTop: 16,
    left: -10,
  },
  userBlock: {
    backgroundColor: '#F8F2F2',
    justifyContent: 'flex-end',
    left: 10,
  },
  targetText: {
    fontSize: 16,
    color: '#595757',
    paddingVertical: 6,
    paddingHorizontal: 16,

    textAlign: 'left',
  },
  sourceText: {
    fontSize: 11,
    color: '#595757',
    paddingTop: 18,
    paddingHorizontal: 16,
    textAlign: 'left',
  },
});

export default ContentBlock;
