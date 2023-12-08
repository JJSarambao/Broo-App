import axios from 'axios';
import { BACKEND_URL } from '@env'
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

const AdminAnalytics = ({ route }) => {
  const [salesInfo, setSalesInfo] = useState([]);
  const [isLoading, setLoadingState] = useState(true);
  const [getSales, setSales] = useState('');
  const fetchAnal = async () => {
    try {
      console.log(BACKEND_URL)
      await axios.get(BACKEND_URL+'/orders/v1/view').then((response) => {
        setSalesInfo(response.data.orderList)
        setLoadingState(false)
      })
      await axios.get(BACKEND_URL+'/orders/v1/total').then((response) => {
        setSales(response.data.total)
      })
    } catch (err) {
      console.log(err)
    }
  }
  useEffect(() => {
    fetchAnal()
  }, [])

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Analytics Page</Text>
      {isLoading ? <Text>Fetching data...</Text> : (
        <View style={styles.table}>
          <View style={styles.row}>
            <Text style={styles.header}>Name</Text>
            <Text style={styles.header}>Age</Text>
            <Text style={styles.header}>Gender</Text>
          </View>
          <FlatList
              data={salesInfo}
              keyExtractor={(item) => item.orderId}
              renderItem={({ item }) => 
              <View style={styles.row}>
                <Text style={styles.cell}>{item.customerInfo.Name}</Text>
                <Text style={styles.cell}>{item.customerInfo.age}</Text>
                <Text style={styles.cell}>{item.customerInfo.gender}</Text>
              </View>
            }
          />
        </View>
      )}
      <Text style={styles.title}>Total Sales: {getSales}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  table: {
    width: '80%',
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  header: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    padding: 10,
    textAlign: 'center',
  },
  cell: {
    flex: 1,
    fontSize: 16,
    padding: 10,
    textAlign: 'center',
  },
});

export default AdminAnalytics;
