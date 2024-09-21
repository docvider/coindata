
import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import DataTable from '../component/DataTable';

const DataScreen = ({ onLogout, selectedSymbol }) => {
    const [symbolData, setSymbolData] = useState({ bids: [], asks: [] });
    const [averagesData, setAveragesData] = useState({ avgBidsPrice: 0, avgAsksPrice: 0, totalBidsSize: 0, totalAsksSize: 0 });

    const handleBackButtonPress = useCallback(() => {
        closeWebSocket();
        onLogout();
    }, []);

    const renderHeader = () => (
    <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Size</Text>
        <Text style={styles.headerText}>Bid</Text>
        <Text style={styles.headerText}>Ask</Text>
        <Text style={styles.headerText}>Size</Text>
    </View>
    );

    const handleDataProcessed = (symbolData, averagesData) => {
        setSymbolData(symbolData);
        setAveragesData(averagesData);
    };

    const renderFooter = () => (
        <View style={styles.footerContainer}>
            <Text style={styles.footerText}>Total Size</Text>
            <Text style={styles.footerText}>Bid</Text>
            <Text style={styles.footerText}>Ask</Text>
            <Text style={styles.footerText}>Total Size</Text>
        </View>
    );
    
    const renderBottomRow = () => (
        <View style={styles.bottomRowContainer}>
            <Text style={styles.bottomRowText}>{averagesData.totalBidsSize}</Text>
            <Text style={[styles.bottomRowText, styles.greenText]}>{averagesData.avgBidsPrice}</Text>
            <Text style={[styles.bottomRowText, styles.redText]}>{averagesData.avgAsksPrice}</Text>
            <Text style={styles.bottomRowText}>{averagesData.totalAsksSize}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            {/* (A) Back Button */}
            <View style={styles.content}>
                <TouchableOpacity style={styles.button} onPress={handleBackButtonPress}>
                    <Text style={styles.buttonText}>{"< "}Logout</Text>
                </TouchableOpacity>
                <Text style={styles.symbolText}>{selectedSymbol}</Text>
                <View style={styles.button}></View>
            </View>

            {/* (B) Non-scrollable TableView Header */}
            <View style={styles.headerTableView}>
                {renderHeader()}
            </View>

            {/* (C) Scrollable TableView */}
            <DataTable
                symbol={selectedSymbol}
                onDataProcessed={handleDataProcessed}
                closeWebSocket={(closeFunc) => {
                    closeWebSocket = closeFunc;
                }}
            />
            <View style={styles.vertDotLine} />

            {/* (D) Non-scrollable TableView Footer */}
            <View style={styles.tableView}>
                {renderFooter()}
            </View>

            {/* (E) Non-scrollable TableView with specific data */}
            <View style={styles.tableView}>
                {renderBottomRow()}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 24,
        paddingLeft: 0,
        paddingRight: 0,
        paddingBottom: 0,
        backgroundColor: 'white',
    },
    content: {
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        justifyContent: 'space-between',
    },
    button: {
        height: 44,
        width: '20%',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 0,
        backgroundColor: 'white',
    },
    buttonText: {
        color: 'black',
        fontSize: 16,
        textAlign: 'left',
        fontWeight: 'normal',
    },
    symbolText: {
        height: 44,
        marginBottom: 0,
        lineHeight: 44,
        textAlign: 'center', 
        fontWeight: 'bold',
        fontSize: 20,
        backgroundColor: 'white',
        flex: 1,
    },
    headerTableView: {
        height: 44,
        justifyContent: 'center',
        backgroundColor: '#ffffff',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        backgroundColor: 'white',
        shadowColor: '#000000',
        shadowOffset: {
            width: 0,       // Horizontal offset
            height: 2,      // Vertical offset
        },
        shadowOpacity: 0.3, // Shadow opacity
        shadowRadius: 4,    // Shadow blur radius
        elevation: 5,       // For Android support
    },
    tableView: {
        height: 44,
        justifyContent: 'center',
        backgroundColor: '#ffffff',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    headerContainer: {
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    headerText: {
        fontWeight: 'bold',
        textAlign: 'center',
    },
    row: {
        flexDirection: 'row',
        padding: 10,
        borderBottomWidth: 0,
        borderBottomColor: '#ddd',
    },
    cellText: {
        flex: 1,
        textAlign: 'center',
        fontSize: 14,
        backgroundColor: 'white',
    },
    scrollableTable: {
        marginBottom: 0,
    },
    vertDotLine: {
        position: 'absolute',
        top: 120,
        bottom: 0,
        left: '50%',
        width: 2,
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderStyle: 'dotted',
        borderColor: 'gray',
    },
    footerContainer: {
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    footerText: {
        fontWeight: 'bold',
        textAlign: 'center',
    },
    bottomRowContainer: {
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    bottomRowText: {
        fontWeight: 'normal',
        textAlign: 'center',
    },
    greenText: {
        color: 'green',
    },
    redText: {
        color: 'red',
    },
});

export default DataScreen;
