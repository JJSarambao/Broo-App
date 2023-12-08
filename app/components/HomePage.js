import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, Image } from 'react-native';

const HomePage = ({ navigation, route }) => {
  const { name, age, gender } = route.params;

  const navigateToViewMenu = () => {
    navigation.navigate('ViewMenu', { name, age, gender });
  };

  const navigateToAdmin = () => {
    // Pass user information to the Admin screen
    navigation.navigate('Admin', { adminName: 'Admin', userInfo: { name, age, gender } });
  };

  return (
    <ImageBackground
      source={require('../assets/E.png')}
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <View style={styles.messageContainer}>
          <Image source={require('../assets/C.png')} style={styles.coffeeIcon} />
          <Text style={styles.welcomeText}>Welcome, {name}!</Text>
          <TouchableOpacity style={styles.button} onPress={navigateToViewMenu}>
            <Text style={styles.buttonText}>View Menu</Text>
          </TouchableOpacity>
          <View style={styles.buttonSpacing} />
          <TouchableOpacity style={styles.button} onPress={navigateToAdmin}>
            <Text style={styles.buttonText}>Admin</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  messageContainer: {
    borderRadius: 10,
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)', // Semi-transparent white background
    elevation: 5,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  coffeeIcon: {
    width: 150,
    height: 100,
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 18,
    marginBottom: 20,
  },
  button: {
    borderRadius: 8,
    backgroundColor: '#6F4E37',
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginVertical: 5,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },
  buttonSpacing: {
    height: 10,
  },
});

export default HomePage;