import React, { useState } from "react";
import { View, Text, TextInput, Alert, TouchableOpacity, Switch,ScrollView } from "react-native";
import { getDatabase, ref, set,push } from "firebase/database";
import { FireBaseConfigAPP } from "../firebase/FireBaseConfigAPP";
import RNPickerSelect from "react-native-picker-select";

const AddDevice = ({ onDeviceAdded }) => {
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

    const deviceRef = push(ref(database, `Nha_A/${roomId}/${deviceName}`));
    //ghi gt thiết bị vào Fb
    set(deviceRef, { name: deviceName, value, dataType: deviceDataType })
      .then(() => {
        Alert.alert("Success", "Device added successfully");
        setRoomId("");
        setDeviceName(""); //xóa giá trị đã nhập đặt về mặc định
        setDeviceValue("");
        setDeviceDataType("");

        // Thêm thiết bị vào danh sách
        const newDevice = { name: deviceName, value, dataType: deviceDataType };
        setDevices([...devices, newDevice]);
        // Gọi callback function để truyền thông tin thiết bị về màn hình MainDevice
        onDeviceAdded(newDevice);
      })
      .catch((error) => {
        Alert.alert("Error", "An error occurred while adding the device");
      });
  };
  const handleUpdateValue = (index) => {
    // Ghi giá trị mới vào Firebase
    const device = devices[index];
    const database = getDatabase(FireBaseConfigAPP);
    const deviceRef = ref(database, `Nha_A/${roomId}/${device.name}`);
    set(deviceRef, { ...device, value: device.value })
      .then(() => {
        Alert.alert("Success", "Device value updated successfully");
      })
      .catch((error) => {
        Alert.alert("Error", "An error occurred while updating the device value");
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

     {/* Hiển thị các thiết bị đã thêm */}
      <ScrollView>
        {devices.map((device, index) => (
            <View key={index} style={styles.deviceContainer}>
              {/* Hiển thị tên thiết bị */}
              <Text style={styles.deviceName}>{device.name}</Text>
              
              {/* Hiển thị giá trị và nút điều chỉnh */}
              <View style={styles.valueContainer}>
                <TextInput
                  style={styles.input}
                  value={device.value.toString()}
                  onChangeText={(newValue) => {
                    // Cập nhật giá trị của thiết bị trong danh sách
                    const updatedDevices = [...devices];
                    updatedDevices[index].value = newValue;
                    setDevices(updatedDevices);
                  }}
                />
                <TouchableOpacity
                  style={styles.updateButton}
                  onPress={() => handleUpdateValue(index)}
                >
                  <Text style={styles.buttonText}>Update</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
    </View>
  );
};

const styles = {
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
  deviceContainer: {
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  deviceName: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  valueContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 5,
    marginRight: 10,
  },
  updateButton: {
    backgroundColor: "green",
    padding: 8,
    borderRadius: 5,
  },
};

export default AddDevice;
