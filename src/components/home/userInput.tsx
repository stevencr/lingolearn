import React from 'react';
import {View, StyleSheet, TextInput} from 'react-native';
import {Button} from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
interface UserInputProps {
  userMessage: string | undefined;
  setUserMessage: React.Dispatch<React.SetStateAction<string | undefined>>;
  addUserMessage: () => void;
  clearMessages: () => void;
  loading: boolean;
}

const UserInput: React.FC<UserInputProps> = ({
  userMessage,
  setUserMessage,
  addUserMessage,
  loading,
}) => {
  return (
    <View style={styles.userInput}>
      <View style={styles.messageInputContainer}>
        <View style={styles.messageInput}>
          <TextInput
            value={userMessage}
            placeholder="Enter message"
            placeholderTextColor={'#666'}
            onChangeText={message => setUserMessage(message)}
            style={styles.textInput}
          />
          <Button
            style={styles.messageInputBtnInset}
            onPress={addUserMessage}
            mode="contained-tonal"
            icon={() => (
              <Icon
                size={32}
                style={loading ? styles.goDisabled : styles.go}
                name="arrow-circle-right"
              />
            )}
            disabled={loading}
            children={undefined}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  go: {color: 'green', opacity: 0.9, marginLeft: 16},
  goDisabled: {color: 'green', opacity: 0.2, marginLeft: 16},

  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  textInput: {
    borderRadius: 16,
    marginHorizontal: 12,
    padding: 12,
    paddingHorizontal: 16,
    color: '#222',
    borderColor: '#333',
    borderWidth: 1,
    fontSize: 14,
    borderStyle: 'solid',
  },
  userInput: {
    flexDirection: 'row',
    marginTop: 32,
  },
  messageInputContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  messageInput: {
    flex: 1,
  },
  messageInputBtnInset: {
    position: 'absolute',
    backgroundColor: 'transparent',
    top: 6,
    margin: 0,
    padding: 0,
    width: 12,
    right: 12,
    justifyContent: 'center',
  },
});

export default UserInput;
