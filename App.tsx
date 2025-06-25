import React, {JSX} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import Home from './src/components/home/Home'; 
import DrawerContent from './src/components/drawerContent';
import {Provider} from 'react-redux';
import {store} from './src/app/store';
import Settings from './src/components/moreSettings/Settings';
import {ScrollViewProvider} from './src/contexts/scrollViewProvider';
import StoryDisplay from './src/components/story/Story';

const AppDrawerContent = () => <DrawerContent />;

function App(): JSX.Element {
  const Drawer = createDrawerNavigator();
  return (
    <Provider store={store}>
      <ScrollViewProvider>
        <NavigationContainer>
          <Drawer.Navigator
            screenOptions={{headerShown: false}}
            initialRouteName="Home"
            drawerContent={AppDrawerContent}>
            <Drawer.Screen name="Home" component={Home} />
            <Drawer.Screen name="Settings" component={Settings} />
            <Drawer.Screen name="Story" component={StoryDisplay} />
          </Drawer.Navigator>
        </NavigationContainer>
      </ScrollViewProvider>
    </Provider>
  );
}

export default App;
