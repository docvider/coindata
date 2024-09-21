
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, FlatList, Text, StyleSheet } from 'react-native';
import axios from 'axios';

const DataTable = ({ symbol, onDataProcessed, closeWebSocket }) => {
    const [symbolData, setSymbolData] = useState({ bids: [], asks: [] });
    const [averagesData, setAveragesData] = useState({ avgBidsPrice: 0, avgAsksPrice: 0, totalBidsSize: 0, totalAsksSize: 0 });
    const [orderBook, setOrderBook] = useState({ asks: [], bids: [] });
    const [combinedAsks, setCombinedAsks] = useState([]);
    const [combinedBids, setCombinedBids] = useState([]);
    const ws = useRef(null);
    let isActive = true;

    const fetchData = useCallback(async () => {
        try {
            const response = await fetch(`https://api.kucoin.com/api/v1/market/orderbook/level2_100?symbol=${symbol}`);
            const jsonResponse = await response.json();
            if (jsonResponse.code === "200000") {
                processResponse(jsonResponse);
                processCalculation(jsonResponse.data.bids, jsonResponse.data.asks);
            }
        } catch (error) {
            console.error(error);
        }
    }, [symbol]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const getWebSocketToken = async () => {
        try {
            const response = await axios.post('https://api.kucoin.com/api/v1/bullet-public');
            if (response.data.code === "200000") {
                return response.data.data.token
            }
        } catch (error) {
          console.error('Get WebSocket token error', error);
        }
    };

    useEffect(() => {
        const connectWebSocket = async () => {
            const wsToken = await getWebSocketToken();
            if (wsToken) {
                console.log("calling WebSocket connection");
                ws.current = new WebSocket(`wss://ws-api-spot.kucoin.com/endpoint?connectId=8888&token=${wsToken}`);
                ws.current.onopen = () => {
                    console.log('WebSocket connected');
                    const subscribeMessage = {
                        id: "8888",
                        type: "subscribe",
                        topic: `/market/level2:${symbol}`,
                        response: true
                    };
                    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
                        ws.current.send(JSON.stringify(subscribeMessage));
                    }
                };
                ws.current.onmessage = (event) => {
                    if (isActive) {
                        const data = JSON.parse(event.data);
                        const changes = data.data?.changes || {};
                        const newAsks = (changes.asks) || [];
                        const newBids = (changes.bids) || [];

                        if (newAsks.length > 0) {
                            setCombinedAsks(prevAsks => (prevAsks || []).concat(newAsks));
                        }
                        if (newBids.length > 0) {
                            setCombinedBids(prevBids => (prevBids || []).concat(newBids));
                        }
                    }
                };
                const intervalId = setInterval(() => {
                    if (combinedBids || combinedAsks) {
                        handleWebSocketMessage();
                        processCalculation(orderBook.bids, orderBook.asks);
                        setCombinedAsks(null);
                        setCombinedBids(null);
                    }
                }, 60000); // 60000 milliseconds = 1 minute
                ws.current.onerror = (error) => {
                    console.error('WebSocket error', error);
                };
                ws.current.onclose = () => {
                    console.log("WebSocket closed");
                    clearInterval(intervalId);
                    const unsubscribeMessage = {
                        id: "8888",
                        type: "unsubscribe",
                        topic: `/market/level2:${symbol}`,
                        response: true
                    };
                    ws.current.send(JSON.stringify(unsubscribeMessage));
                };
                // Cleanup function to close the WebSocket connection
                return () => {
                    console.log('WebSocket connection closed from cleanup');
                    closeWebSocket();
                    clearInterval(intervalId);
                };
            }
        };
        connectWebSocket();
    }, [closeWebSocket]);

    closeWebSocketConnection = () => {
        console.log('WebSocket Prepare for Closure');
        if (ws.current) {
            isActive = false
            ws.current.close();
            ws.current = null; // Clear reference
        }
    };
    // Pass the close function to the parent
    React.useEffect(() => {
        closeWebSocket(closeWebSocketConnection);
    }, [closeWebSocket]);

    const handleWebSocketMessage = () => {
        updateOrderBook();
        const bids = groupByPrice(orderBook.bids);
        const asks = groupByPrice(orderBook.asks);
        setSymbolData({ bids, asks });
    };
    
    const updateOrderBook = () => {
        if (combinedBids) {
            combinedBids.forEach(bid => {
                const bidEntryIndex = orderBook.bids.findIndex(entry => entry[0] === bid[0]);
                if (bidEntryIndex !== -1) {
                    orderBook.bids[bidEntryIndex][1] = bid[1];
                } else {
                    const newEntry = [bid[0], bid[1]];
                    orderBook.bids.push(newEntry);
                }
            });
            // Remove entries where price or size is "0"
            orderBook.bids = orderBook.bids.filter(ask => {
                return parseFloat(ask[0]) !== 0 && parseFloat(ask[1]) !== 0;
            });
            // Sort in descending order for bid
            orderBook.bids.sort((a, b) => parseFloat(b[0]) - parseFloat(a[0]));
            orderBook.bids = orderBook.bids.slice(0, 100);
        }
        if (combinedAsks) {
            combinedAsks.forEach(ask => {
                const askEntryIndex = orderBook.asks.findIndex(entry => entry[0] === ask[0]);
                if (askEntryIndex !== -1) {
                    orderBook.asks[askEntryIndex][1] = ask[1];
                } else {
                    const newEntry = [ask[0], ask[1]];
                    orderBook.asks.push(newEntry);
                }
            });
            // Remove entries where price or size is "0"
            orderBook.asks = orderBook.asks.filter(ask => {
                return parseFloat(ask[0]) !== 0 && parseFloat(ask[1]) !== 0;
            });
            // Sort in descending order for ask
            orderBook.asks.sort((a, b) => parseFloat(a[0]) - parseFloat(b[0]));
            orderBook.asks = orderBook.asks.slice(0, 100);
        }
    };

    const processResponse = (data) => {
        setOrderBook(data.data);
        const bids = groupByPrice(data.data.bids);
        const asks = groupByPrice(data.data.asks);
        setSymbolData({ bids, asks });
    };

    const groupByPrice = (data) => {
        const grouped = {};
        data.forEach(([price, size]) => {
            // Round up to the nearest whole number
            const priceKey = Math.ceil(parseFloat(price));
            if (!grouped[priceKey]) {
                grouped[priceKey] = 0;
            }
            grouped[priceKey] += parseFloat(size);
        });
        return Object.entries(grouped).map(([price, size]) => [price, size.toFixed(2)]);
    };

    const processCalculation = (bids, asks) => {
        let totalBidsSize = 0.00;
        let totalAsksSize = 0.00;
        let weightedBidsSum = 0.00;
        let weightedAsksSum = 0.00;
        
        bids.forEach(bid => {
            const price = parseFloat(bid[0]);
            const size = parseFloat(bid[1]);
            totalBidsSize += size;
            weightedBidsSum += price * size;
        });
        const avgBidsPrice = totalBidsSize > 0 ? (weightedBidsSum / totalBidsSize).toFixed(2) : '0.00';
        totalBidsSize = parseFloat(totalBidsSize.toFixed(2));
        
        asks.forEach(ask => {
            const price = parseFloat(ask[0]);
            const size = parseFloat(ask[1]);
            totalAsksSize += size;
            weightedAsksSum += price * size;
        });
        const avgAsksPrice = totalAsksSize > 0 ? (weightedAsksSum / totalAsksSize).toFixed(2) : '0.00';
        totalAsksSize = parseFloat(totalAsksSize.toFixed(2));
        
        setAveragesData(prev => ({
            ...prev,
            avgBidsPrice,
            avgAsksPrice,
            totalBidsSize,
            totalAsksSize
        }));
    }

    const prepareDataForFlatList = () => {
        let combinedData = [];
        const maxLength = Math.max(symbolData.bids.length, symbolData.asks.length);
        for (let i = 0; i < maxLength; i++) {
            const bid = symbolData.bids[i] || [];
            const ask = symbolData.asks[i] || [];
            combinedData.push([
                bid[1] || '', // Bid Size
                bid[0] || '', // Bid Price
                ask[0] || '', // Ask Price
                ask[1] || ''  // Ask Size
            ]);
        }

        combinedData = combinedData.filter(entry => {
            const [bidSize, bidPrice, askPrice, askSize] = entry;
            // Replace specified conditions
            if (bidSize === "0.00" && bidPrice === "0") {
                return ["", "", askPrice, askSize];
            }
            if (askSize === "0.00" && askPrice === "0") {
                return [bidSize, bidPrice, "", ""];
            }
            return entry;
        });
        return combinedData;
    };

    const renderRow = ({ item }) => (
        <View style={styles.row}>
            <Text style={styles.cellText}>{item[0]}</Text>
            <Text style={styles.cellText}>{item[1]}</Text>
            <Text style={styles.cellText}>{item[2]}</Text>
            <Text style={styles.cellText}>{item[3]}</Text>
        </View>
    );

    useEffect(() => {
        onDataProcessed(symbolData, averagesData);
    }, [averagesData]);
    
    return (
        <FlatList
            data={prepareDataForFlatList()}
            renderItem={renderRow}
            keyExtractor={(item, index) => index.toString()}
            style={styles.scrollableTable}
        />
    );
};

const styles = StyleSheet.create({
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
});

export default DataTable;
