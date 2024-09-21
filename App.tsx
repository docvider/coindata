import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import LoginScreen from './screen/LoginScreen';
import DataScreen from './screen/DataScreen';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedSymbol, setSymbol] = useState('');

  const updateSymbol = (newSymbol: any) => {
    setSymbol(newSymbol);
  };

  const resetSymbol = () => {
    setSymbol('');
  };

  const handleLogin = (symbol: any) => {
    setIsLoggedIn(true);
    updateSymbol(symbol);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    resetSymbol();
  };
  
  return (
    <View style={styles.container}>
      {isLoggedIn ? (
        <>
        <DataScreen
          onLogout={handleLogout}
          selectedSymbol={selectedSymbol}
        />
        </>
      ) : (
        <LoginScreen onLogin={handleLogin} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
