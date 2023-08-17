import React, { useState } from 'react';
import moment from 'moment';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import {
  getDatabase,
  ref,
  onValue,
  set,
  push,
} from "firebase/database";
import { FireBaseConfigAPP } from "../firebase/FireBaseConfigAPP";

const App = () => {
  const [isDoorOpen, setDoorOpen] = useState(true);

  // Kết nối tới Firebase Realtime Database
  const db = getDatabase(FireBaseConfigAPP);

  // Hàm để lấy giá trị từ Firebase Realtime Database
  const getDoorStatusFromDatabase = () => {
    const doorRef = ref(db, "Nha_A/Room4/Door");

    onValue(doorRef, (snapshot) => {
      const doorStatus = snapshot.val();
      if (typeof doorStatus === "boolean") {
        setDoorOpen(doorStatus);
      }
    });
  };

  // Hàm để thay đổi giá trị trên Firebase Realtime Database
  const changeDoorStatusOnFirebase = (newStatus) => {
    const doorRef = ref(db, "Nha_A/Room4/Door");
    
    set(doorRef, newStatus).then(() => {
      // Cập nhật trạng thái thành công, ghi lịch sử
      const historyRef = ref(db, "Nha_A/history");
      const newHistoryItem = {
        timestamp: moment().format('YYYY-MM-DD HH:mm:ss'),
        action: `Door ${newStatus ? 'Opened' : 'Closed'}`,
      };
      push(historyRef, newHistoryItem).then(() => {
        // Ghi lịch sử thành công!
      });
    });
  };

  // Hàm xử lý khi người dùng ấn vào nút
  const handleButtonPress = () => {
    const newStatus = isDoorOpen ? 0 : 1;
    
    // Gọi hàm để thay đổi giá trị trên Firebase Realtime Database
    changeDoorStatusOnFirebase(newStatus);
    
    // Cập nhật trạng thái trong ứng dụng
    setDoorOpen(newStatus);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.frame}>
        <Text style={styles.title}>Smart Lock</Text>
        <Text>Door Status: {isDoorOpen ? 'Open' : 'Closed'}</Text>
        <TouchableOpacity style={styles.button} onPress={handleButtonPress}>
          <Text style={styles.buttonText}>{isDoorOpen ? 'Close Door' : 'Open Door'}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  frame: {
    flex: 1,
    borderWidth: 3,
    borderColor: '#ff8080',
    borderRadius: 10,
    padding: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#ff8080',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 4,
    marginTop: 20,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default App;
