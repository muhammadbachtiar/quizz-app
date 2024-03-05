/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

const RegisterScreen = ({ navigation }) => {
  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [registrationStatus, setRegistrationStatus] = useState(null);

  const handleRegister = async () => {
    const userData = {
      Nama: nama,
      Email: email,
      Password: password,
      Role: 'user',
    };

    try {
      const response = await fetch('http://10.0.2.2:8080/users/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        console.log('Success Register');
        setRegistrationStatus('Pendaftaran berhasil!');
        navigation.navigate('Login');
      } else {
        console.error('Failed Register:', response.status);
        setRegistrationStatus('Pendaftaran gagal. Silakan coba lagi.');
      }
    } catch (error) {
      console.error('Failed:', error.message);
      setRegistrationStatus('Terjadi kesalahan. Silakan coba lagi.');
    }
  };

  return (
    <View style={styles.container}>
        <View style={styles.cardContainer}>
            {registrationStatus && <Text style={styles.failedMessage}>{registrationStatus}</Text>}
            <Text style={styles.label}>Nama:</Text>
            <TextInput
                style={styles.input}
                onChangeText={(text) => setNama(text)}
                value={nama}
                placeholder="Masukkan nama"
            />

            <Text style={styles.label}>Email:</Text>
            <TextInput
                style={styles.input}
                onChangeText={(text) => setEmail(text)}
                value={email}
                placeholder="Masukkan email"
                keyboardType="email-address"
            />

            <Text style={styles.label}>Password:</Text>
            <TextInput
                style={styles.input}
                onChangeText={(text) => setPassword(text)}
                value={password}
                placeholder="Masukkan password"
                secureTextEntry
            />

            <Button title="Register" onPress={handleRegister} />
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
  successMessage: {
    color: 'green',
    marginTop: 10,
  },
  failedMessage: {
    color: 'red',
    marginBottom: 10,
  },
});

export default RegisterScreen;
