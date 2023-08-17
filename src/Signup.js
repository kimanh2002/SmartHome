import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, Alert } from 'react-native';
import smart from '../assets/smart.png';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { FireBaseConfigAPP } from "../firebase/FireBaseConfigAPP";

const SignUpScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailChange = (email) => {
    setEmail(email);
  };

  const handlePasswordChange = (password) => {
    setPassword(password);
  };

  const handleSignUpPress = () => {
    const auth = getAuth(FireBaseConfigAPP);
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        updateProfile(auth.currentUser, {
          displayName: 'N/A',
          photoURL: 'N/A'
        })
          .then(() => {
            Alert.alert(
              "Đăng ký thành công",
              `Đăng ký thành công ${email}`,
              [
                {
                  text: "Cancel",
                  onPress: () => console.log("Cancel Pressed"),
                  style: "cancel",
                },
                { text: "OK", onPress: () => navigation.navigate('LoginScreen') },
              ]
            );
            setEmail('');
            setPassword('');
          })
          .catch((error) => {
            console.log("Failed to update profile");
          });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log("Failed to signUp");
      });
  };

  const handleSignInPress = () => {
    navigation.navigate('LoginScreen');
  };

  return (
    <View style={styles.container}>
      <Image style={styles.logo} source={smart} resizeMode='contain' />
      <Text style={styles.header}>Đăng ký</Text>
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Nhập email"
          value={email}
          onChangeText={handleEmailChange}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Mật khẩu</Text>
        <TextInput
          style={styles.input}
          placeholder="Nhập mật khẩu"
          value={password}
          onChangeText={handlePasswordChange}
          secureTextEntry
        />
      </View>
      <TouchableOpacity style={styles.buttonContainer} onPress={handleSignUpPress}>
        <Text style={styles.buttonText}>Đăng ký</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleSignInPress}>
        <Text style={styles.signIn}>Đã có tài khoản? Đăng nhập!</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#ff9999',
    padding: 5,
  },
  logo: {
    width: 150,
    height: 150,
    marginTop: -10,
  },
  header: {
    fontSize: 40,
    color: '#202060',
    marginBottom: 30,
    fontWeight: 'bold',
  },
  inputContainer: {
    width: '90%',
    marginBottom: 15,
  },
  inputLabel: {
    fontWeight: '600',
    color: '#202060',
    marginBottom: 5,
  },
  input: {
    width: '100%',
    height: 40,
    paddingHorizontal: 10,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  buttonContainer: {
    backgroundColor: '#202060',
    paddingVertical: 10,
    borderRadius: 20,
    width: '50%',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  signIn: {
    color: '#0000b3',
    marginTop: 3,
    textDecorationLine: 'underline',
  },
});

export default SignUpScreen;

