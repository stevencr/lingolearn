import React, {useState} from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
} from 'react-native';
import {useGetQuestionsQuery, useGetStoryQuery} from './storyApi';
import {getQuestionsPrompt, getStoryPrompt} from '../../prompts/prompts';
import {useAppSelector} from '../../app/hooks';
import AppBar from '../appBar';
import useTTS from '../../hooks/useTTS';
import AudioControls from './audioControls';
import {getLangCode} from '../settings/languages';
import Questions from './Questions';

const StoryDisplay: React.FC = () => {
  const settings = useAppSelector(state => state.settings);
  const [dataLoaded, setDataLoaded] = useState(false);
  const {isPlaying, onStart, onStop} = useTTS({
    defaultLanguage: getLangCode(settings.targetLang),
  });

  const {data, error, isLoading} = useGetStoryQuery({
    prompt: getStoryPrompt(settings.userName, settings.targetLang),
  });

  const {
    data: questionsData,
    error: questionsError,
    isLoading: questionsIsLoading,
  } = useGetQuestionsQuery(
    {
      prompt: getQuestionsPrompt(data?.story!, settings.targetLang),
      getQuestions: 1, //only used for mock api
    },
    {skip: data === undefined},
  );
  console.log("qd", questionsData);
  const header = (title: string, by: string) => (
    <>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.by}>{by}</Text>
    </>
  );
  return (
    <View style={styles.container}>
      <AppBar />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={styles.scrollbar}>
        {data && !isLoading && (
          <>
            {header(data.title, data.by)}
            <AudioControls
              data={data}
              isPlaying={isPlaying}
              onStart={onStart}
              onStop={onStop}
            />
            <Text style={styles.story}>{data.story}</Text>
            {questionsData && (
              <Questions
                questions={questionsData}
                loading={questionsIsLoading}
                error={questionsError}
              />
            )}
          </>
        )}
        {isLoading && (
          <>
            <Text style={styles.loading}>Loading story...</Text>
            <ActivityIndicator size="large" />
          </>
        )}
        {!isLoading && error && (
          <Text style={styles.error}>Error: {JSON.stringify(error)}</Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'white',
  },
  error: {
    color: 'red',
  },
  loading: {
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  scrollbar: {
    marginTop: 50,
    margin: 8,
    padding: 32,
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    fontFamily: 'Verdana',
    marginBottom: 8,
    color: '#333',
  },
  by: {
    color: '#333',
  },
  story: {
    fontFamily: 'Verdana',
    color: '#333',
  },
});
export default StoryDisplay;
