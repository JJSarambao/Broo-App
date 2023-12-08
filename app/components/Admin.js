import React, { useState } from 'react';
import axios from 'axios';
import { BACKEND_URL } from '@env'
import { View, TextInput, Button, Text, StyleSheet, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const AdminLogin = ({ route }) => {
  const { adminName, userInfo } = route.params;
  const navigation = useNavigation();

  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');

  const loginAsAdmin = async () => {
    try {
      console.log(BACKEND_URL+'/login/')
      await axios.post(BACKEND_URL+'/login/', 
      {
        username: adminUsername, password: adminPassword
      }).then((response) => {
        console.log(response.data)
      })
      // Pass user information to the AdminHome screen
      console.log('Logged in as:', adminName);
      navigation.navigate('AdminHome', { adminName, userInfo });
    } catch (err) {
      alert("Invalid Credentials!")
      setAdminPassword('')
      setAdminUsername('')
    }
  };

  return (
    <ImageBackground
      source={require('../assets/Ice.jpg')}
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <View style={styles.messageContainer}>
          <Text>Login as Admin.</Text>
          <TextInput
            style={styles.input}
            placeholder="Admin Username"
            value={adminUsername}
            onChangeText={(text) => setAdminUsername(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Admin Password"
            value={adminPassword}
            onChangeText={(text) => setAdminPassword(text)}
            secureTextEntry={true}
          />
          <View style={styles.buttonContainer}>
            <Button title="Login" onPress={loginAsAdmin} color="#6F4E37" />
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageContainer: {
    borderRadius: 10,
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)', // White background with 80% opacity
    elevation: 5,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    margin: 10,
    padding: 10,
    width: 200,
    backgroundColor: 'white',
  },
  buttonContainer: {
    marginTop: 10,
    borderRadius: 8, // Adjust the value to change the button's rounded rectangle shape
    overflow: 'hidden', // This ensures the content inside the button stays within the rounded borders
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover', // or 'stretch'
  },
});

export default AdminLogin;