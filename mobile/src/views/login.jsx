/* eslint-disable prettier/prettier */
import React, {useState} from 'react';
import {View, Text, TextInput, Button, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


const LoginScreen = ({navigation, route }) => {
  const { handleLogin } = route.params || {};
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLoginButton = async () => {
    try {
      const response = await fetch('http://10.0.2.2:8080/loginUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      if (response.ok) {
        console.log('Login successful');
        const data = await response.json();
        await AsyncStorage.setItem('userToken', data.token);
        handleLogin();
        navigation.navigate('Dashboard');
      } else {
        console.error('Login failed:', response.status);
      }
    } catch (error) {
      console.error('Login failed:', error.message);
    }
  };

  const goToRegister = () => {
    navigation.navigate('Register');
  };

  return (
    <View style={styles.container}>
      <View style={styles.cardContainer}>
        <Text style={styles.welcomeText}>Selamat Datang di Quizz App</Text>
        <Text style={styles.label}>Email:</Text>
        <TextInput
          style={styles.input}
          onChangeText={text => setEmail(text)}
          value={email}
          placeholder="Masukkan email"
          keyboardType="email-address"
        />

        <Text style={styles.label}>Password:</Text>
        <TextInput
          style={styles.input}
          onChangeText={text => setPassword(text)}
          value={password}
          placeholder="Masukkan password"
          secureTextEntry
        />

        <Button title="Masuk" onPress={handleLoginButton} />

        <Text style={styles.registerText}>
          Belum punya akun?{' '}
          <Text style={styles.link} onPress={goToRegister}>
            Daftar disini
          </Text>
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#E4F1FE',
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  cardContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 3,
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    paddingBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
    borderRadius: 5,
  },
  registerText: {
    marginTop: 16,
    textAlign: 'center',
  },
  link: {
    color: 'blue',
  },
});

export default LoginScreen;
