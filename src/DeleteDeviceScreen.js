import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert, TouchableOpacity } from "react-native";
import { getDatabase, ref, remove } from "firebase/database";
import { FireBaseConfigAPP } from "../firebase/FireBaseConfigAPP";

const DeleteDevice = () => {
  const [roomId, setRoomId] = useState("");
  const [deviceName, setDeviceName] = useState("");

  const handleDeleteDevice = () => {
    if (!roomId || !deviceName) {
      Alert.alert("Error", "Please enter both room ID and device name");
      return;
    }

    const database = getDatabase(FireBaseConfigAPP);
    const deviceRef = ref(database, `Nha_A/${roomId}/${deviceName}`);

    remove(deviceRef)
      .then(() => {
        Alert.alert("Success", "Device deleted successfully");
        setRoomId("");
        setDeviceName("");
      })
      .catch((error) => {
        Alert.alert("Error", "An error occurred while deleting the device");
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Room ID</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter room ID"
        value={roomId}
        onChangeText={setRoomId}
      />
      <Text style={styles.label}>Device Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter device name"
        value={deviceName}
        onChangeText={setDeviceName}
      />
      <TouchableOpacity style={styles.button} onPress={handleDeleteDevice}>
        <Text style={styles.buttonText}>Delete Device</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = {
  container: {
    flex: 1,
    padding: 20,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: "#ff8080",
    borderRadius: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
  },
  input: {
    borderWidth: 2,
    borderColor: "#ffb3b3",
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#000066",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
};

export default DeleteDevice;
