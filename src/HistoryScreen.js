import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { getDatabase, ref, onValue, off } from "firebase/database";
import { FireBaseConfigAPP } from "../firebase/FireBaseConfigAPP";

const History = () => {
  const [historyData, setHistoryData] = useState([]);

  useEffect(() => {
    const db = getDatabase(FireBaseConfigAPP);
    const historyRef = ref(db, "Nha_A/history");

    const unsubscribe = onValue(historyRef, (snapshot) => {
      const historyItems = [];

      snapshot.forEach((childSnapshot) => {
        const item = childSnapshot.val();
        historyItems.push(item);
      });

      setHistoryData(historyItems);
    });

    return () => {
      off(historyRef, "value", unsubscribe);
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lịch sử hoạt động</Text>
      <FlatList
        data={historyData}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.historyItem}>
            <Text style={styles.itemTimestamp}>{item.timestamp}</Text>
            <Text style={styles.itemAction}>{item.action}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  historyItem: {
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    marginBottom: 10,
    paddingBottom: 10,
  },
  itemTimestamp: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  itemAction: {
    fontSize: 16,
  },
});

export default History;
