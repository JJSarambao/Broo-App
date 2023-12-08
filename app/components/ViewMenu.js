import React, { useState } from 'react';
import { View, Text, Button, Image, ImageBackground, FlatList, StyleSheet, Modal, Pressable } from 'react-native';
import OrderStatus from './OrderStatus'; // Import OrderStatus component

const ViewMenu = ({ route, navigation }) => {
  const { name, age, gender } = route.params;
  const [cart, setCart] = useState([]);
  const [isCartVisible, setIsCartVisible] = useState(false);

  const coffeeMenu = [
    {
      id: 1,
      name: 'Long Black',
      prices: { S: 50, M: 60, L: 70 },
      sizes: ['S', 'M', 'L'],
      image: require('../assets/LongBlack.png')
    },
    {
      id: 2,
      name: 'Cafe Latte',
      prices: { S: 69, M: 79, L: 89 },
      sizes: ['S', 'M', 'L'],
      image: require('../assets/CafeLatte.jpg')
    },
    {
      id: 3,
      name: 'Cappuccino',
      prices: { S: 75, M: 85, L: 95 },
      sizes: ['S', 'M', 'L'],
      image: require('../assets/Cappuccino.jpg')
    },
    {
      id: 4,
      name: 'Spanish Latte',
      prices: { S: 79, M: 89, L: 99 },
      sizes: ['S', 'M', 'L'],
      image: require('../assets/SpanishLatte.jpg')
    },
    {
      id: 5,
      name: 'Dark Mocha',
      prices: { S: 80, M: 95, L: 110 },
      sizes: ['S', 'M', 'L'],
      image: require('../assets/DarkMocha.jpg')
    },
    {
      id: 6,
      name: 'French Vanilla',
      prices: { S: 75, M: 95, L: 120 },
      sizes: ['S', 'M', 'L'],
      image: require('../assets/FrenchVanilla.jpg')
    },
    {
      id: 7,
      name: 'Caramel Macchiato',
      prices: { S: 75, M: 95, L: 120 },
      sizes: ['S', 'M', 'L'],
      image: require('../assets/CaramelMacchiato.jpg')
    },
    {
      id: 8,
      name: 'Hazelnut Macchiato',
      prices: { S: 75, M: 95, L: 120 },
      sizes: ['S', 'M', 'L'],
      image: require('../assets/HazelnutMacchiato.jpg')
    },
  ];


  const addToCart = (item, quantity, size) => {
    if (quantity > 0) {
      const cartItemId = `${item.id}-${item.name}-${size}`;
      setCart([...cart, { ...item, quantity, size, cartItemId }]);
      setIsCartVisible(true);
    }
  };

  const removeFromCart = (itemId) => {
    const updatedCart = cart.filter((item) => item.cartItemId !== itemId);
    setCart(updatedCart);
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(0);
  };

  const renderOrderStatus = () => {
    navigation.navigate('OrderStatus', { name, gender, age, total: calculateTotal(), itemsOrdered: cart });
  };

  const renderItem = ({ item }) => {
    return <CoffeeItem item={item} addToCart={addToCart} />;
  };

  return (
    <ImageBackground
      source={require('../assets/F.jpg')} // Replace with the path to your background image
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <Text>Welcome Customer, {name}😊!</Text>
        <Text>{'\n'} Here are our Menu 👉☕👈, Enjoy your Coffee and Tea 😘{'\n'} </Text>
        <FlatList
          data={coffeeMenu}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
        />
        <Modal
          animationType="slide"
          transparent={true}
          visible={isCartVisible}
          onRequestClose={() => {
            setIsCartVisible(!isCartVisible);
          }}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text>Your Cart:</Text>
              {cart.map((item) => (
                <CartItem key={item.cartItemId} item={item} removeFromCart={removeFromCart} />
              ))}
              <View style={styles.totalContainer}>
                <Text>Total: ₱{calculateTotal()}</Text>
              </View>
              <View style={styles.buttonContainerModal}>
                <Pressable
                  style={styles.backButton}
                  onPress={() => {
                    setIsCartVisible(!isCartVisible);
                  }}
                >
                  <Text>Back</Text>
                </Pressable>
                <Pressable
                  style={styles.confirmButton}
                  onPress={() => {
                    renderOrderStatus(); // Call renderOrderStatus to navigate to OrderStatus screen
                    setIsCartVisible(!isCartVisible);
                  }}
                >
                  <Text>Confirm</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </ImageBackground>
  );
};

const CoffeeItem = ({ item, addToCart }) => {
  const [quantity, setQuantity] = useState(0);
  const [selectedSize, setSelectedSize] = useState(item.sizes[0]);

  const handleAddToCart = () => {
    if (quantity > 0) {
      const price = item.prices[selectedSize];
      addToCart({ ...item, price }, quantity, selectedSize);
      setQuantity(0);
    }
  };

  return (
    <View key={`${item.id}-${selectedSize}`} style={styles.menuItem}>
      <Image source={item.image} style={styles.image} />
      <Text>
        {item.name} - ₱{item.prices[selectedSize].toFixed(0)}
      </Text>
      <View style={styles.sizeContainer}>
        {item.sizes.map((size) => (
          <Button
            key={`${item.id}-${size}`}
            title={size}
            onPress={() => setSelectedSize(size)}
            color={size === selectedSize ? '#C19A6B' : '#6F4E37'}
          />
        ))}
      </View>
      <View style={styles.buttonContainer}>
        <Button title="-" onPress={() => setQuantity(quantity > 0 ? quantity - 1 : 0)} color="#6F4E37" />
        <Text style={styles.quantityText}>{quantity}</Text>
        <Button title="+" onPress={() => setQuantity(quantity + 1)} color="#6F4E37" />
        <View style={styles.buttonSpacing} />
        <Button title="Add to Cart" onPress={handleAddToCart} disabled={quantity === 0} color="#C19A6B" />
      </View>
    </View>
  );
};

const CartItem = ({ item, removeFromCart }) => {
  return (
    <View key={item.cartItemId} style={styles.cartItem}>
      <Text>
        {item.name} - ₱{item.price.toFixed(0)} (Size: {item.size}, Qty: {item.quantity})
      </Text>
      <View style={styles.removeButtonContainer}>
        <Button title="Remove" onPress={() => removeFromCart(item.cartItemId)} color="#C19A6B" />
      </View>
    </View>
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
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover', // or 'stretch'
  },
  menuItem: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
    padding: 50, // Increase padding for a larger container
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.10)',
    elevation: 10,
  },
  sizeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityText: {
    marginHorizontal: 10,
  },
  buttonSpacing: {
    width: 5,
  },
  cartItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
    padding: 15,
    borderRadius: 10,
    backgroundColor: 'white',
    elevation: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  totalContainer: {
    marginVertical: 10,
  },
  buttonContainerModal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  backButton: {
    backgroundColor: '#FFE5B4',
    padding: 10,
    borderRadius: 10,
  },
  confirmButton: {
    backgroundColor: '#C19A6B',
    padding: 10,
    borderRadius: 10,
  },
  removeButtonContainer: {
    marginLeft: 10,
  },
  image: {
    width: 100, // Set the width as needed
    height: 100, // Set the height as needed
    borderRadius: 10,
    marginBottom: 10,
  },
});

export default ViewMenu;
