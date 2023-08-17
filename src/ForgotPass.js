import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, Alert } from 'react-native';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { FireBaseConfigAPP } from '../firebase/FireBaseConfigAPP';
import logo from '../assets/logo.jpg';

const ForgotPassScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');

  const handleEmailChange = (email) => {
    setEmail(email);
  };

  const handleResetPasswordPress = async () => {
    const auth = getAuth(FireBaseConfigAPP);

    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert(
        'Password Reset Email Sent',
        'Please check your email to reset your password.'
      );
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to send password reset email. Please try again.');
    }
  };

  const handleSignInPress = () => {
    navigation.navigate('LoginScreen');
  };

  return (
    <View style={styles.container}>
      <Image style={styles.logo} source={logo} resizeMode='contain' />
      <Text style={styles.header}>Forgot Password</Text>
      <TextInput
        style={styles.input}
        placeholder='Email'
        value={email}
        onChangeText={handleEmailChange}
        autoCapitalize='none'
        keyboardType='email-address'
      />
      <TouchableOpacity style={styles.buttonContainer} onPress={handleResetPasswordPress}>
        <Text style={styles.buttonText}>Reset Password</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleSignInPress}>
        <Text style={styles.signIn}>Back to Sign In</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ff9999',
    padding: 20,
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 30,
  },
  header: {
    fontSize: 30,
    color: '#202060',
    marginBottom: 30,
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    height: 40,
    backgroundColor: 'white',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    backgroundColor: '#202060',
    paddingVertical: 10,
    borderRadius: 30,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  signIn: {
    color: '#0000b3',
    marginTop: 15,
    textDecorationLine: 'underline',
  },
});

export default ForgotPassScreen;
