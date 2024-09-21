
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, FlatList } from 'react-native';

const HomeScreen = ({ onLogout }) => {

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={onLogout}>
        <Text style={styles.buttonText}>Back</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Welcome to the App!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingTop: StatusBar.currentHeight + 20,
    backgroundColor: 'yellow',
    paddingHorizontal: 16,
  },
  button: {
    height: 44,
    width: '25%',
    backgroundColor: 'blue',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
   buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'left',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});

export default HomeScreen;
