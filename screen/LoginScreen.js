
import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, View, Alert } from 'react-native';
import axios from 'axios';
import PinInput from '../component/PinInput';
import SymbolDropdown from '../component/SymbolDropdown';
import LoginButton from '../component/LoginButton';

const LoginScreen = ({ onLogin }) => {
  const [pin, setPin] = useState('');
  const [symbol, setSymbol] = useState('');
  
  const handleLoginPress = async () => {
    if (pin === "") {
      Alert.alert("Error", "Please enter PIN");
    } else if (symbol === null || symbol === '') {
      Alert.alert("Error", "Please select a Symbol");
    } else {
      try {
        const response = await axios.post('http://localhost:3000/login', { pin });
        const { token } = response.data;
        onLogin(symbol);
      } catch (error) {
        Alert.alert('Login Failed', 'Invalid PIN');
      }
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mainContent}>
        <PinInput value={pin} onChangeText={setPin} />
        <SymbolDropdown onValueChange={setSymbol} />
      </View>
      <LoginButton onPress={handleLoginPress} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
});

export default LoginScreen;
