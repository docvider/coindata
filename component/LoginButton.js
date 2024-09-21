
import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';

const LoginButton = ({ onPress }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
        <Text style={styles.buttonText}>Login</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#007BFF',
        paddingVertical: 15,
        borderRadius: 5,
        alignItems: 'center',
        position: 'absolute',
        bottom: 20,
        width: '100%',
      },
      buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
      },
});

export default LoginButton;
