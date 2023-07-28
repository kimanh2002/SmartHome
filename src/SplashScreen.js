import React, { useState, useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Image, View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { useFonts } from 'expo-font';
import logo from '../assets/logo.jpg';
//import LoginScreen from './src/LoginScreen';

const SplashScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
      navigation.navigate('LoginScreen');
    }, 5000);
  }, []);

  return (
    <LinearGradient
      colors={['#ffffff', '#ff4d4d']}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 0.8 }}
      style={styles.container}
    >
      <View style={styles.logoContainer}>
        <Animatable.Image
          animation="bounceIn"
          duration={1500}
          source={logo}
          style={styles.logo}
          resizeMode='contain'
        />
        <Text style={styles.header}>One Piece</Text>
      </View>
      {loading && (
        <View style={styles.loading}>
          <ActivityIndicator size="large" />
        </View>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 30,
    marginBottom: 50,
    borderRadius: 15,
    overflow: 'hidden',
  },
  logoContainer: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 80,
    flex: 1,
  },
  logo: {
    width: 250,
    height: 250,
    borderRadius: 15,
  },
  header: {
    fontSize: 40,
    //fontFamily: 'Alex',
    color: '#00004d',
    marginTop: 20,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  loading: {
    marginTop: 20,
  },
});

export default SplashScreen;
