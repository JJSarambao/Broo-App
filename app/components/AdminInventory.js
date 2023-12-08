import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios'
import { BACKEND_URL } from '@env'
import { View, Text, TextInput, Button, FlatList, StyleSheet, TouchableOpacity, ImageBackground, Alert } from 'react-native';

const AdminInventory = () => {
  const [inventory, setInventory] = useState([]);
  const [isLoadingState, setLoadingState] = useState(true);
  const getInventory = async () => {
    try {
      console.log(BACKEND_URL)
      await axios.get(BACKEND_URL+'/inventory/v1/view').then((response) => {
        setInventory(response.data.itemList)
        setLoadingState(false)

      })
    } catch (err) {
      console.log(err)
    }
  }
  //Initial data fetch
  useEffect(() => {
    getInventory()
  }, [])

  //Near real-time updates by fetching API data every 60 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      getInventory()
    }, 5000)
    return () => clearInterval(interval)
  }, [])
  const [newItemName, setNewItemName] = useState('');
  const [newItemQuantity, setNewItemQuantity] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);

  
  const addItem = async () => {
    // Vibecheck
    await axios.post(BACKEND_URL+'/inventory/v1/vibecheck', {itemName: newItemName}).then((response) => {
      //Check if item already exists
      console.log(response.data.result)
      if (response.data.result == 1){
        Alert.alert("Item already in database", 
        "Product to be added is already in the database. Quantity value provided will then be added to the Item's current quantity.\n\nContinue?",
        [{
          text: "Update Item Info",
          onPress: async () => {
                          await axios.post(BACKEND_URL+'/inventory/v1/add',
                          {
                            itemId: inventory.filter(item => item.itemName == newItemName)[0].itemId,
                            itemName: newItemName,
                            itemQuantity: newItemQuantity
                          }).then((response) => {
                            alert(`Product Information Updated\n\nNew Item Quantity: ${response.data.stock}`)
                          })
                          }
        }, {
          text: "Cancel",
          onPress: () => {
                          setNewItemName('')
                          setNewItemQuantity('')
                          } 
        }])
      }
      if (response.data.result == 0) {
        try {
          axios.post(BACKEND_URL+'/inventory/v1/add', 
          {
            itemName: newItemName,
            itemQuantity: newItemQuantity
          }).then((response)=> {
              alert("Product Added")
              setNewItemName('')
              setNewItemQuantity('')
          })
        } catch (err) {
          console.log(err)
        }
      }
    })
  };


  const deleteItem = async (itemId) => {
    console.log(itemId)
    try {
      await axios.delete(BACKEND_URL+'/inventory/v1/remove', {
        data: {
          itemId: itemId
        }
      }).then((response) => {
        console.log(response.status)
      })
    } catch (err) {
      console.log(err)
    }
  };


  return (
    <ImageBackground
      source={require('../assets/N.png')} // Change the path to your actual image
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Coffee Shop Inventory</Text>


        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Item Name"
            value={newItemName}
            onChangeText={(text) => setNewItemName(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Quantity"
            value={newItemQuantity}
            onChangeText={(text) => setNewItemQuantity(text)}
            keyboardType="numeric"
          />
          <TouchableOpacity style={styles.addButton} onPress={addItem}>
            <Text style={styles.addButtonText}>Add Item</Text>
          </TouchableOpacity>
        </View>


        <View style={styles.tableContainer}>
          <View style={styles.tableHeader}>
            <Text style={[styles.columnHeader, styles.itemColumn]}>Item Name</Text>
            <Text style={[styles.columnHeader, styles.quantityColumn]}>Quantity</Text>
          </View>

          {isLoadingState? <Text> Fetching data...</Text> : 
          <FlatList
            data={inventory}
            keyExtractor={(item) => item.itemId}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.tableRow, selectedItem === item.itemId && styles.selectedItem]}
                onPress={() => setSelectedItem(item.itemId === selectedItem ? null : item.itemId)}
              >
                <Text style={[styles.column, styles.itemColumnText]}>{item.itemName}</Text>
                <Text style={[styles.column, styles.quantityColumnText]}>{item.itemStock}</Text>
                {selectedItem === item.itemId && (
                  <TouchableOpacity
                    style={styles.deleteButtonContainer}
                    onPress={() => deleteItem(item.itemId)}
                  >
                    <Text style={styles.deleteButtonText}>Delete</Text>
                  </TouchableOpacity>
                )}
              </TouchableOpacity>
            )}
          />
                }
        </View>
      </View>
    </ImageBackground>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#000000',
  },
  formContainer: {
    marginBottom: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 16,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#3e2723',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  input: {
    height: 40,
    borderColor: '#4e342e',
    borderWidth: 1,
    marginBottom: 8,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  addButton: {
    backgroundColor: '#806517',
    paddingVertical: 12,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 10,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  tableContainer: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 8,
    padding: 15,
    elevation: 2,
    shadowColor: '#3e2723',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 40,
    shadowRadius: 2,
  },
  tableHeader: {
    flexDirection: 'row',
    marginBottom: 15,
    borderBottomWidth: 3,
    paddingBottom: 5,
  },
  columnHeader: {
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'auto',
    color: '#3e2723',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#d7ccc8',
    borderRadius: 8,
  },
  column: {
    flex: 1,
  },
  itemColumn: {
    paddingLeft: 8,
  },
  quantityColumn: {
    textAlign: 'auto',
  },
  deleteButtonContainer: {
    backgroundColor: '#806517',
    padding: 8,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButtonText: {
    color: 'white',
  },
  selectedItem: {
    backgroundColor: '#d7ccc8',
  },
  itemColumnText: {
    color: 'black',
  },
  quantityColumnText: {
    color: 'black',
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
});


export default AdminInventory;