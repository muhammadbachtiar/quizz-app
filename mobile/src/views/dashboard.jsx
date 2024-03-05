/* eslint-disable prettier/prettier */
import React, {useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity  } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Dashboard = ({navigation}) => {
    const [dataQuiz, setDataQuiz] = useState('');
    useEffect(() => {
        const fetchQuizData = async () => {
          try {
            const token = await AsyncStorage.getItem('userToken');

            if (token) {
              const response = await fetch('http://10.0.2.2:8080/quiz', {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `${token}`,
                },
              });

              if (response.ok) {
                const quizData = await response.json();
                setDataQuiz(quizData);
              } else {
                console.error('Failed to fetch Quiz data:', response.status);
              }
            } else {
              console.error('Token not available.');
            }
          } catch (error) {
            console.error('Error fetching Quiz data:', error.message);
          }
        };

        fetchQuizData();
      }, []);

    const renderQuizItem = ({ item }) => (
      <TouchableOpacity onPress={() => navigateToQuizDetail(item.ID)}>
        <View style={styles.quizItem}>
          <Text style={styles.quizTitle}>{item.Judul}</Text>
          <Text style={styles.quizDescription}>{item.Deskripsi}</Text>
        </View>
      </TouchableOpacity>
  );

  const navigateToQuizDetail = (quizId) => {
    navigation.navigate('QuizDetail', { quizId });
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error Log Out:', error.message);
    }
  };

  return (
    <View style={styles.container}>
        <View style={styles.header}>
            <Text style={styles.headerText}>Dashboard</Text>
            <TouchableOpacity onPress={handleLogout}>
                <Text style={styles.logoutButton}>Logout</Text>
            </TouchableOpacity>
      </View>
      <FlatList
        data={dataQuiz}
        keyExtractor={(item) => item.ID.toString()}
        renderItem={renderQuizItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#E4F1FE',
  },
  quizItem: {
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#ccc',
    padding: 16,
    borderRadius: 8,
    backgroundColor: 'white',
  },
  quizTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  quizDescription: {
    fontSize: 16,
    color: '#555',
  },
  header: {
    borderRadius: 6,
    padding:10,
    backgroundColor: '#8DC6FF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  logoutButton: {
    fontSize: 16,
    color: '#34495E',
  },
});

export default Dashboard;
