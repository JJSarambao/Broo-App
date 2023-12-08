import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, Image } from 'react-native';

const AdminHome = ({ navigation, route }) => {
  const { adminName, userInfo } = route.params;

  const navigateToInventory = () => {
    navigation.navigate('AdminInventory');
  };

  const navigateToAnalytics = () => {
    // Pass user information to the AdminAnalytics screen
    navigation.navigate('AdminAnalytics', { userInfo });
  };

  return (
    <ImageBackground
      source={require('../assets/Z.png')}
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <View style={styles.messageContainer}>
          <Image source={require('../assets/C.png')} style={styles.coffeeIcon} />
          <Text style={styles.welcomeText}>Welcome, Admin!</Text>
          <TouchableOpacity style={styles.button} onPress={navigateToInventory}>
            <Text style={styles.buttonText}>Inventory</Text>
          </TouchableOpacity>
          <View style={styles.buttonSpacing} />
          <TouchableOpacity style={styles.button} onPress={navigateToAnalytics}>
            <Text style={styles.buttonText}>Analytics</Text>
          </TouchableOpacity>
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
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover', // or 'stretch'
  },
});

export default AdminHome;