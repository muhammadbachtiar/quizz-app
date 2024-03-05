/* eslint-disable prettier/prettier */
import React, {useEffect, useState} from 'react';
import {View, Text, FlatList, StyleSheet, TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const QuizDetailPage = ({route}) => {
  const {quizId} = route.params;
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const fetchQuestions = async () => {
        const token = await AsyncStorage.getItem('userToken');
      try {
        if (token) {
            const response = await fetch(`http://10.0.2.2:8080/pertanyaan/quiz/${quizId}`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `${token}`,
              },
            });

            if (response.ok) {
              const questionData = await response.json();
              setQuestions(questionData);
            } else {
              console.error('Failed to fetch Quiz data:', response.status);
            }
          } else {
            console.error('Token not available.');
          }
      } catch (error) {
        console.error('Error fetching questions:', error.message);
      }
    };

    fetchQuestions();
  }, [quizId]);

  const renderQuestionQuiz = ({ item }) => (
    <View style={styles.quizItem}>
      <Text style={styles.quizTitle}>{item.Pertanyaan}</Text>
      {item.AnswerOption.length > 0 ? (
        <View style={styles.answerOptions}>
          {item.AnswerOption.map((option) => (
            <Text
              key={option.ID}
            >
              {option.Jawaban}
            </Text>
          ))}
        </View>
      ) : (
        <Text>No Answer Options</Text>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={questions}
        keyExtractor={(item) => item.ID.toString()}
        renderItem={renderQuestionQuiz}
      />
      <TouchableOpacity style={styles.buttonStart}  >
                <Text >Kerjakan</Text>
            </TouchableOpacity>
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
      borderWidth: 1,
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
    answerOptions: {
      marginTop: 8,
    },
    correctAnswer: {
      color: 'green',
    },
    incorrectAnswer: {
      color: 'red',
    },
    buttonStart: {
        backgroundColor: '#3498db',
        padding: 10,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 10,
      },
  });

export default QuizDetailPage;
