import React, {useState, useEffect, useMemo, JSX} from 'react';
import {Button, Snackbar} from 'react-native-paper';
import {SafeAreaView, ScrollView, StyleSheet, Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {nanoid} from '@reduxjs/toolkit';
import {useAppSelector, useAppDispatch} from '../../app/hooks';
import {getAssessmentPrompt, conversePrompt} from '../../prompts/prompts';
import {translatedPhrases} from '../settings/languages';
import {useNavigation} from '@react-navigation/native';
import {
  addMessage,
  getAIMessageAsync,
  addUserMessage,
  clearAllMessages,
  getAIAssessmentAsync,
} from './conversationsSlice';
import AppBar from '../appBar';
import Conversation from './conversation';
import UserInput from './userInput';
import {StatusType} from '../../types/types';
import {DELAY_BEFORE_REPLY} from '../../constants/const';
import {useScrollView} from '../../contexts/scrollViewProvider';

function Home(): JSX.Element {
  const settings = useAppSelector(state => state.settings);
  const {scrollViewRef, scrollToEnd} = useScrollView();
  const {userName, botName, targetLang, sourceLang, debugMode} = settings;
  const [userMessage, setUserMessage] = useState<string | undefined>('');
  const [started, setStarted] = useState(false);
  const [snackbarText, setSnackbarText] = useState<string | null>('');
  const [snackbarDismissed, setSnackbarDismissed] = useState(false);
  const conversations = useAppSelector(state => state.conversations);
  const dispatch = useAppDispatch();
  const [status, setStatus] = useState<StatusType>('idle');
  const loading = status === 'loading';
  const error = conversations.error;
  const hasMessages = conversations.messages.length > 0;
  const navigation = useNavigation();
  const clearMessages = () => {
    setStarted(false);
    dispatch(clearAllMessages());
  };

  const addUsersMessage = async () => {
    if (userMessage && userMessage.length > 0) {
      const message = userMessage.slice();
      setUserMessage('');
      const id = nanoid();
      dispatch(addUserMessage({id, message}));
      try {
        const prompt = getAssessmentPrompt(
          targetLang,
          sourceLang,
          message,
          settings.severityLevel,
          conversations,
        );
        dispatch(getAIAssessmentAsync({id, prompt, targetLang, debugMode}));
        scrollToEnd();
      } catch (err) {
        handleSnackbarError('Yikes, an error occurred!');
        console.error(err);
      }
    }
  };

  const handleSnackbarError = (errorMessage: string) => {
    setSnackbarText(errorMessage);
    setSnackbarDismissed(false);
  };

  useEffect(() => {
    if (!started) {
      setSnackbarDismissed(true);
    } else if (error !== undefined && error != null) {
      handleSnackbarError(error);
    }
  }, [error, started]);

  useEffect(() => {
    let isMounted = true;

    const askAI = async () => {
      const id = nanoid();
      dispatch(
        addMessage({
          id,
          sourceLang: '',
          targetLang: 'typing...',
          isBot: true,
          played: false,
        }),
      );
      scrollToEnd();
      try {
        const prompt = conversePrompt(
          userName,
          botName,
          targetLang,
          sourceLang,
          conversations,
        );
        setStatus('loading');
        await dispatch(getAIMessageAsync({id, prompt, targetLang, debugMode}));
      } catch (err: any) {
        handleSnackbarError(err.message);
      } finally {
        scrollToEnd();
        setStatus('idle');
      }
    };

    const fetchData = async () => {
      if (!hasMessages) {
        await askAI();
      } else if (
        hasMessages &&
        !conversations.messages[conversations.messages.length - 1].isBot
      ) {
        setStatus('loading');
        setTimeout(async () => {
          await askAI();
        }, DELAY_BEFORE_REPLY);
      }
    };

    if (!loading && started && isMounted) {
      fetchData();
    }

    return () => {
      isMounted = false;
    };
  }, [
    conversations,
    started,
    hasMessages,
    loading,
    sourceLang,
    targetLang,
    dispatch,
    botName,
    userName,
    debugMode,
    scrollToEnd,
  ]);

  const renderSnackbar = () => (
    <Snackbar
      visible={
        error !== undefined &&
        error !== null &&
        snackbarText !== '' &&
        !snackbarDismissed &&
        started
      }
      onDismiss={() => {}}
      style={styles.snackbar}
      action={{
        label: 'Close',
        onPress: () => setSnackbarDismissed(true),
      }}>
      {error}
    </Snackbar>
  );

  const renderRestartButton = () => (
    <Button
      style={styles.restartContainer}
      mode="contained-tonal"
      onPress={clearMessages}
      disabled={loading}>
      <Icon
        size={16}
        style={loading ? styles.restartDisabled : styles.restart}
        name="refresh"
      />
    </Button>
  );

  const renderLetsGoButton = () => (
    <View style={styles.letsgoContainer}>
      <View style={{}}>
        <Button
          style={styles.letsgo}
          mode="contained"
          onPress={() => setStarted(true)}>
          {translatedPhrases[targetLang]}
        </Button>
        <Text style={styles.orText}>-- or --</Text>
        <Button
          style={styles.letsgo}
          mode="contained"
          onPress={() => navigation.navigate('Story')}>
          Story time!
        </Button>
      </View>
    </View>
  );

  const renderInputView = () => (
    <View style={styles.inputContainer}>
      <UserInput
        userMessage={userMessage}
        setUserMessage={setUserMessage}
        addUserMessage={addUsersMessage}
        clearMessages={clearMessages}
        loading={loading}
      />
    </View>
  );

  const MemoizedConversation = useMemo(() => React.memo(Conversation), []);

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        ref={scrollViewRef}
        style={styles.scrollView}>
        {!debugMode && <Text style={styles.liveWarning}>LIVE GPT</Text>}
        {hasMessages && renderRestartButton()}
        <AppBar />
        <View style={styles.body}>
          {!hasMessages && !started && renderLetsGoButton()}
          <MemoizedConversation conversation={conversations} />
        </View>
      </ScrollView>
      {started && renderInputView()}
      {renderSnackbar()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollView: {
    flex: 1,
  },
  welcome: {
    fontSize: 18,
    fontFamily: 'Verdana',
    color: '#111',
    marginTop: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  snackbar: {
    backgroundColor: '#E11A1A',
  },

  body: {
    backgroundColor: 'white',

    padding: 8,
    marginTop: 50,
  },
  liveWarning: {
    backgroundColor: 'red',
    height: 'auto',
    position: 'absolute',
    fontFamily: 'Verdana',
    left: 40,
    top: 150,
    padding: 8,
    color: 'white',
    fontWeight: '800',
    fontSize: 14,
    zIndex: 1000,
  },
  letsgoContainer: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',

    alignItems: 'center',
    marginTop: 124,
    flexDirection: 'column',
  },
  letsgo: {
    flex: 1,
    marginTop: 16,
    width: 'auto',
  },
  restart: {color: '#333', opacity: 0.9},
  restartDisabled: {color: 'darkgray', opacity: 0.2},
  restartContainer: {
    backgroundColor: 'transparent',
    position: 'absolute',
    top: 120,
    right: -5,
    zIndex: 1000,
  },
  orText: {
    textAlign: 'center',
    marginTop: 16,
  },
});

export default Home;
