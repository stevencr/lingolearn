import React, {JSX} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import AppBar from '../appBar';
import {SafeAreaView} from 'react-native-safe-area-context';
import {availableBotAvatars} from '../settings/avatars';
import {availableModels} from '../settings/models';
import {useAppDispatch, useAppSelector} from '../../app/hooks';
import {setSetting} from '../settings/settingsSlice';
import {useNavigation} from '@react-navigation/native';

function Settings(): JSX.Element {
  const dispatch = useAppDispatch();
  const nav = useNavigation();
  const selectedModel = useAppSelector(state => state.settings.selectedModel);

  const handleImagePress = (avatar: string) => {
    dispatch(setSetting({key: 'botAvatar', value: avatar}));
    if (nav.canGoBack()) {
      nav.goBack();
    }
  };

  const handleModelChange = (model: string) => {
    dispatch(setSetting({key: 'selectedModel', value: model}));
  };

  return (
    <SafeAreaView>
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <AppBar />
        <View style={styles.body}>
          {/* Model Selection */}
          <Text style={styles.heading}>Choose AI Model:</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedModel}
              onValueChange={handleModelChange}
              style={styles.picker}>
              {availableModels.map(model => (
                <Picker.Item
                  key={model.id}
                  label={`${model.name} - ${model.description}`}
                  value={model.id}
                />
              ))}
            </Picker>
          </View>

          {/* Avatar Selection */}
          <Text style={styles.heading}>Choose your chat partner:</Text>
          <View style={styles.imagesView}>
            {availableBotAvatars.map((avatar, index) => {
              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleImagePress(avatar)}
                  style={styles.imageContainer}>
                  <Image source={{uri: avatar}} style={styles.image} />
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  heading: {
    fontSize: 18,
    fontWeight: '800',
    backgroundColor: 'white',
    color: '#666',
    margin: 8,
    marginTop: 20,
  },
  body: {
    backgroundColor: 'white',
    width: '100%',
    padding: 16,
    margin: 8,
    marginTop: 50,
  },
  pickerContainer: {
    backgroundColor: 'lightblue',
    borderRadius: 4,
    margin: 8,
    marginBottom: 20,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  image: {
    width: 100,
    height: 100,
    margin: 4,
  },
  imagesView: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  imageContainer: {
    margin: 5,
    borderRadius: 4,
    overflow: 'hidden',
    width: 'auto',
    backgroundColor: 'lightgreen',
  },
});

export default Settings;
