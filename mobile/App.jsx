import React, {useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import LoginScreen from './src/views/login';
import RegisterScreen from './src/views/register';
import Dashboard from './src/views/dashboard';
import QuizDetailPage from './src/views/quizDetail';

const Stack = createStackNavigator();

const App = () => {
  const [isLoggedIn, setLoggedIn] = useState(false);
  console.log(isLoggedIn);

  const handleLogin = () => {
    setLoggedIn(true);
  };

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={isLoggedIn ? 'Dashboard' : 'Login'}>
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          initialParams={{handleLogin}}
        />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen
          name="Dashboard"
          component={Dashboard}
          options={{
            headerShown: !isLoggedIn,
          }}
        />
        <Stack.Screen name="QuizDetail" component={QuizDetailPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
