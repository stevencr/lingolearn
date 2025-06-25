import React, {JSX} from 'react';
import {StyleSheet, View, Image} from 'react-native';
import {Text} from 'react-native-paper';

export default function AppBar(): JSX.Element {
  return (
    <>
      <Image
        source={require('../../assets/Wave.png')}
        style={styles.waveLogo}
      />

      {/* <Image
        source={require('../../assets/BackLogo.png')}
        style={styles.backLogo}
      /> */}

      <View style={styles.header}>
        <Text style={styles.headerText}>LingoLearn</Text>
      </View>

      <View style={styles.circle1} />
      <View style={styles.circle2} />
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#E7AD19',
    height: 130,
  },
  headerText: {
    fontFamily: 'InknutAntiqua-ExtraBold',
    fontSize: 36,
    textAlign: 'center',
    marginTop: 25,
    color: 'black',
    textShadowOffset: {width: 2, height: 2},
    textShadowColor: '#666',
    textShadowRadius: 5,
    zIndex: 100,
  },
  circle1: {
    backgroundColor: 'red',
    width: 90,
    height: 90,
    position: 'absolute',
    top: -45,
    left: -5,
    opacity: 0.9,
    borderRadius: 45,
    zIndex: 1,
  },
  circle2: {
    backgroundColor: 'green',
    width: 90,
    height: 90,
    position: 'absolute',
    top: -25,
    left: -40,
    opacity: 0.8,
    borderRadius: 45,
    zIndex: 2,
  },
  circle3: {
    backgroundColor: 'blue',
    width: 40,
    height: 40,
    position: 'absolute',
    top: -15,
    left: -15,
    opacity: 0.8,
    borderRadius: 45,
    zIndex: 10,
  },
  backLogo: {
    position: 'absolute',
    top: -16,
    left: -4,
    zIndex: 1,
  },
  waveLogo: {
    position: 'absolute',
    top: 125,
    left: 0,
    zIndex: 1,
    width: '120%',
  },
});
