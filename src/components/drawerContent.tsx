import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {DrawerItem, DrawerContentScrollView} from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/FontAwesome';
import DropDownPicker from 'react-native-dropdown-picker';
import {Settings, setSetting} from './settings/settingsSlice';
import {useAppDispatch, useAppSelector} from '../app/hooks';
import {languageList} from './settings/languages';
import {useNavigation} from '@react-navigation/native';
import {
  Avatar,
  Title,
  Caption,
  Button,
  Paragraph,
  Drawer,
  Text,
  TouchableRipple,
  Switch,
} from 'react-native-paper';

const ProfileItem = () => (
  <DrawerItem
    icon={({color, size}) => <Icon name="user" color={color} size={size} />}
    label="Profile"
    onPress={() => {}}
  />
);

const DrawerContent: React.FC = props => {
  const settings = useAppSelector(state => state.settings);
  const navigation = useNavigation();
  const {
    userAvatar,
    targetLang,
    sourceLang,
    debugMode,
    showTranslation,
    autoPlay,
  } = settings;
  const languages = languageList.map(language => ({
    label: language.name,
    value: language.name,
  }));
  const dispatch = useAppDispatch();
  const [openTarget, setOpenTarget] = useState(false);
  const [openSource, setOpenSource] = useState(false);
  const [targetItems, setTargetItems] = useState(languages);
  const [sourceItems, setSourceItems] = useState(languages);

  const updateSetting = <K extends keyof Settings>(
    key: K,
    value: Settings[K],
  ) => {
    dispatch(setSetting({key, value}));
  };

  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.drawerContent}>
        <View style={styles.userInfoSection}>
          <Avatar.Image
            source={{
              uri: userAvatar,
            }}
            size={50}
          />
          <Title style={styles.title}>Steven Cranfield</Title>
          <Caption style={styles.caption}>@stevencranfield</Caption>
          <View style={styles.row}>
            <View style={styles.section}>
              <Paragraph style={[styles.paragraph, styles.caption]}>
                1
              </Paragraph>
              <Caption style={styles.caption}>Following</Caption>
            </View>
            <View style={styles.section}>
              <Paragraph style={[styles.paragraph, styles.caption]}>
                4
              </Paragraph>
              <Caption style={styles.caption}>Followers</Caption>
            </View>
          </View>
        </View>
        <Drawer.Section style={styles.drawerSection}>
          <ProfileItem />
        </Drawer.Section>
        <Drawer.Section title="Preferences">
          <View style={styles.preference}>
            <TouchableRipple
              onPress={() => {
                updateSetting('showTranslation', !showTranslation);
              }}>
              <View style={styles.showTranslation}>
                <Text>Show translation</Text>
                <View pointerEvents="none">
                  <Switch value={showTranslation} />
                </View>
              </View>
            </TouchableRipple>
            <TouchableRipple
              onPress={() => {
                updateSetting('debugMode', !debugMode);
              }}>
              <View style={styles.debugMode}>
                <Text>Test mode</Text>
                <View pointerEvents="none">
                  <Switch value={debugMode} />
                </View>
              </View>
            </TouchableRipple>
            <TouchableRipple
              onPress={() => {
                updateSetting('autoPlay', !autoPlay);
              }}>
              <View style={styles.debugMode}>
                <Text>Auto audio</Text>
                <View pointerEvents="none">
                  <Switch value={autoPlay} />
                </View>
              </View>
            </TouchableRipple>
            <Text style={styles.target}>Target language: {targetLang}</Text>
            <DropDownPicker
              open={openTarget}
              value={settings.targetLang}
              items={targetItems}
              showArrowIcon={true}
              setOpen={setOpenTarget}
              setValue={value => updateSetting('targetLang', value())}
              setItems={setTargetItems}
              listMode="MODAL"
            />
            <Text style={styles.source}>Your language: {sourceLang}</Text>
            <DropDownPicker
              open={openSource}
              value={sourceLang}
              items={sourceItems}
              showArrowIcon={true}
              setOpen={setOpenSource}
              setValue={value => updateSetting('sourceLang', value())}
              setItems={setSourceItems}
              listMode="MODAL"
              style={styles.sourceDropdown}
            />
            <Button onPress={() => navigation.navigate('Settings')}>
              More settings...
            </Button>
          </View>
        </Drawer.Section>
      </View>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
    marginTop: 32,
  },
  userInfoSection: {
    paddingLeft: 20,
  },
  title: {
    marginTop: 20,
    fontWeight: 'bold',
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
  },
  row: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  paragraph: {
    fontWeight: 'bold',
    marginRight: 3,
  },
  drawerSection: {
    marginTop: 5,
  },
  target: {
    marginTop: 18,
    marginBottom: 12,
  },
  source: {
    marginTop: 18,
    marginBottom: 12,
  },
  sourceDropdown: {
    marginBottom: 32,
  },
  showTranslation: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  debugMode: {
    marginTop: 18,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  preference: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingHorizontal: 32,
    marginTop: 0,
    paddingLeft: 28,
  },
});

export default DrawerContent;
