// OrderStatus.js
import { API_URL, BACKEND_URL } from '@env'
import axios from 'axios'
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import Modal from 'react-native-modal';

const OrderStatus = ({ route, navigation }) => {
  const { name, gender, age, total, itemsOrdered } = route.params;
  const [isModalVisible, setModalVisible] = useState(false);

  const OrderSender = async () => {
    let orders = []
    for(let i = 0; i < itemsOrdered.length; i++) {
      orders.push({
        itemId: itemsOrdered[i].id,
        itemSize: itemsOrdered[i].size,
        itemQuantity: itemsOrdered[i].quantity
      })
    }
    try {
      console.log(BACKEND_URL+'/orders/v1/add')
      await axios.post(BACKEND_URL+'/orders/v1/add', {
        orders: orders,
        Name: name,
        gender: gender,
        age: age,
        price: total
      }).then((response) => {
        console.log(response.data.text)
        console.log(response.status)
      })
    } catch(err) {
      console.log(err.code)
    }
    toggleModal()
  }

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handleConfirm = () => {
    toggleModal(); // Close the modal
    // Add any additional logic you need on confirmation

    // Navigate back to LoginPage
    navigation.navigate('LoginPage');
  };

  const handleBack = () => {
    // Add any logic you need when going back
    navigation.goBack();
  };

  return (
    <ImageBackground
      source={require('../assets/D.png')}
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <View style={styles.messageContainer}>
          <Text>Summary of {name} Orders:{'\n'}</Text>
          {itemsOrdered.map((item) => (
            <Text key={item.cartItemId}>
              {item.name} - ₱{item.price.toFixed(0)} (Size: {item.size}, Qty: {item.quantity})
            </Text>
          ))}
          <Text>{'\n'}Your total amount is: ₱{total}</Text>

          {/* BACK and CONFIRM buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
              <Text style={styles.buttonText}>BACK</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.confirmButton} onPress={OrderSender}>
              <Text style={styles.buttonText}>CONFIRM</Text>
            </TouchableOpacity>
          </View>

          {/* Modal for confirmation message */}
          <Modal isVisible={isModalVisible} animationIn="slideInUp" animationOut="slideOutDown">
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.boldText}>Your order has been confirmed!{'\n'}</Text>
                <Text style={styles.boldText}>{name} Orders is now Preparing...{'\n'}</Text>
                <TouchableOpacity style={styles.okButton} onPress={handleConfirm}>
                  <Text style={styles.buttonText}>OK</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
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
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  messageContainer: {
    borderRadius: 10,
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    elevation: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  backButton: {
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#6F4E37', // Change to black
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginVertical: 5,
  },
  confirmButton: {
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#6F4E37', // Change to black
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginVertical: 5,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
  modalContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  okButton: {
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#6F4E37',
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginVertical: 10,
  },
  boldText: {
    fontWeight: 'bold',
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
});

export default OrderStatus;
