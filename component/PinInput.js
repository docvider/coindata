
import React, { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

const PinInput = ({ value, onChangeText }) => {
    return (
        <View style={styles.container}>
            <TextInput
                style={styles.textInput}
                placeholder="Enter PIN"
                value={value}
                onChangeText={onChangeText}
                keyboardType="default"
                secureTextEntry={false}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        paddingHorizontal: 10,
        paddingVertical: 20,
        backgroundColor: 'white',
        borderWidth: 1,
        borderRadius: 5,
        borderColor: 'gray',
        height: 60,
        justifyContent: 'center',
    },
    input: {
        height: 60,
    },
});

export default PinInput;
