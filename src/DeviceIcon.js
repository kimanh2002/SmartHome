import React, { useState } from "react";
import { View, Text, TextInput, Alert, TouchableOpacity } from "react-native";
import { getDatabase, ref, set } from "firebase/database";
import { FireBaseConfigAPP } from "../firebase/FireBaseConfigAPP";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Ionicons from 'react-native-vector-icons/Ionicons';
import RNPickerSelect from "react-native-picker-select";
const AddDevice = () => {
  const [roomId, setRoomId] = useState("");
  const [deviceName, setDeviceName] = useState("");
  const [deviceValue, setDeviceValue] = useState("");
  const [deviceDataType, setDeviceDataType] = useState("");
  const [devices, setDevices] = useState([]);

  const handleAddDevice = () => {
    if (!roomId || !deviceName || !deviceValue) {
      Alert.alert("Error", "Please enter all required information");
      return;
    }
    //Xác định kiểu Data của tb
    let value;

    switch (deviceDataType) {
      case "Number":
        value = Number(deviceValue);
        break;
      case "Boolean":
        value = Boolean(deviceValue);
        break;
      case "Object":
        value = Object(deviceValue);
        break;
      case "String":
        value = String(deviceValue);
        break;
      default:
        value = deviceValue;
        break;
    }
    const database = getDatabase(FireBaseConfigAPP);

    const deviceRef = ref(database, `Nha_A/${roomId}/${deviceName}`);
    //ghi gt thiết bị vào Fb
    set(deviceRef, value)
      .then(() => {
        Alert.alert("Success", "Device added successfully");
        setRoomId("");
        setDeviceName(""); //xóa giá trị đã nhập đặt về mặc định
        setDeviceValue("");
        setDeviceDataType("");

        // Thêm thiết bị vào danh sách
        const newDevice = { name: deviceName, value, dataType: deviceDataType };
        setDevices([...devices, newDevice]);
      })
      .catch((error) => {
        Alert.alert("Error", "An error occurred while adding the device");
      });

    // Map device name to corresponding icon
    let icon;
    switch (deviceName) {
      case "fan":
        icon = "fan";
        break;
      case "điều hòa":
        icon = "air-conditioner";
        break;
      case "Led":
        icon = "lightbulb-on";
        break;
      case "Temperature":
        icon = "thermometer";
        break;
      case "Humidity":
        icon = "water-percent";
        break;
      case "Gas":
        icon = "gas-cylinder";
        break;
      case "Door":
        icon = "door";
        break;
      default:
        icon = "help-circle";
        break;
    }
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
      <Text style={styles.label}>Device Value</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter device value"
        value={deviceValue}
        onChangeText={setDeviceValue}
      />
      <Text style={styles.label}>Device Data Type</Text>
      <RNPickerSelect
        value={deviceDataType}
        onValueChange={setDeviceDataType}
        items={[
          { label: "String", value: "String" },
          { label: "Number", value: "Number" },
          { label: "Boolean", value: "Boolean" },
          { label: "Auto", value: "Auto" },
          { label: "Object", value: "Object" },
        ]}
      />
      <TouchableOpacity style={styles.button} onPress={handleAddDevice}>
        <Text style={styles.buttonText}>Add Device</Text>
      </TouchableOpacity>

      {/* Display the added devices */}
      {devices.map((device, index) => (
        <View key={index} style={styles.deviceContainer}>
          <Icon name={device.icon} size={30} color="#000" />
          <Text style={styles.deviceName}>{device.name}</Text>
        </View>
      ))}
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
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#000066",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  deviceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  deviceName: {
    flex: 1,
    fontSize: 16,
    marginLeft: 10,
  },
};

export default AddDevice;
