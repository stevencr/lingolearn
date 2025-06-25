import * as React from 'react';
import {Alert, StyleSheet, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {ActivityIndicator, Text} from 'react-native-paper';
import {Question} from './storyApi';
import {FetchBaseQueryError} from '@reduxjs/toolkit/query';
import {SerializedError} from '@reduxjs/toolkit';

type OptionMap = {[key: number]: string};
const arr: OptionMap = {1: 'a)  ', 2: 'b)  ', 3: 'c)  ', 4: 'd)  '};

interface QuestionsProps {
  questions: Question[];
  error: FetchBaseQueryError | SerializedError | undefined;
  loading: boolean;
}

const Questions: React.FC<QuestionsProps> = ({questions, error, loading}) => {
  if (loading) {
    return (
      <>
        <Text style={styles.loading}>Loading story...</Text>
        <ActivityIndicator size="large" />
      </>
    );
  }

  if (error !== undefined) {
    return (
      <Text>
        Oops, an error occurred loading the questions: {JSON.stringify(error)}
      </Text>
    );
  }
  return (
    <View style={styles.questions}>
      {questions.map((question, num) => (
        <View key={'n_' + num} style={styles.questionContainer}>
          <Text style={styles.question}>
            {num + 1}. {question.question}
          </Text>

          {question.answerOptions.map((option, i) => (
            <TouchableOpacity
              key={'a' + i}
              onPress={() => {
                Alert.alert(
                  option.correct ? 'Correct!' : 'Incorrect',
                  option.correct ? 'Well done!' : 'Try again...',
                );
              }}>
              <Text
                style={
                  option.correct ? styles.correctOption : styles.incorrectOption
                }>
                {arr[i + 1]} {option.option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      ))}
    </View>
  );
};
const styles = StyleSheet.create({
  loading: {
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  questionContainer: {
    marginBottom: 32,
  },
  questions: {
    flex: 1,
    padding: 32,
  },
  question: {
    fontWeight: '500',
    paddingVertical: 8,
    color: '#333',
  },
  correctOption: {color: '#333'},
  incorrectOption: {color: '#333'},
});

export default Questions;
