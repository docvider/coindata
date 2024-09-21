
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

const SymbolDropdown = ({ onValueChange }) => {
    const [symbols, setSymbols] = useState([]);
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState([]);
    const [selectedSymbolName, setSelectedSymbolName] = useState('');

    useEffect(() => {
        fetch('https://api.kucoin.com/api/v1/symbols')
        .then(response => response.json())
        .then(data => {
            if (data.code === "200000") {
                const symbolItems = data.data.map(item => ({
                    label: item.symbol,
                    value: item.symbol,
                }));
                setSymbols(symbolItems);
                setItems(symbolItems);
            }
        })
        .catch(error => console.error('Error fetching symbols:', error));
    }, []);
    
    const handleSelect = (value) => {
        const selectedItem = symbols.find(item => item.value === value);
        if (selectedItem) {
            setSelectedSymbolName(selectedItem.value);
            onValueChange(value);
        }
    };
        
    return (
        <View style={styles.container}>
        <DropDownPicker
            open={open}
            value={value}
            items={items}
            setOpen={setOpen}
            setValue={setValue}
            setItems={setItems}
            onChangeValue={handleSelect}
            placeholder="Select a Symbol"
        />
        
        {selectedSymbolName ? (
            <Text style={styles.selectedText}>Selected Symbol: {selectedSymbolName}</Text>
        ) : (
            <Text style={styles.selectedText}>Please select a symbol to proceed</Text>
        )}
        </View>
    );
};

const styles = StyleSheet.create({
  container: {
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  selectedText: {
    marginTop: 20,
    fontSize: 18,
  },
});

export default SymbolDropdown;
