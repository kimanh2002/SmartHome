import React, { useState,useEffect } from "react";
import { View, StyleSheet, Text, TouchableOpacity,ScrollView , Image,TextInput,srs,Alert, FlatList} from "react-native";
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors } from "../theme";
import Swiper from 'react-native-swiper';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';
import { reverseGeocodeAsync } from 'expo-location';
// Import screens from separate code.js files

import History from "../src/HistoryScreen";
import Notification from "../src/NotificationScreen";
import Settings from "../src/SettingScreen";

import LightScreen from "../src/LightScreen";
import TemperatureScreen from "../src/TemperatureScreen";
import DoorScreen from "../src/DoorScreen";
//import ElectricityScreen from "../src/ElectricityScreen";
import DeleteDeviceScreen from "../src/DeleteDeviceScreen";
import CameraScreen from "../src/CameraScreen";
import AddDeviceScreen from "../src/AddDeviceScreen";
import {
  getDatabase,
  ref,
  onValue,
  set,
  off,
  push
} from "firebase/database";
import { FireBaseConfigAPP } from "../firebase/FireBaseConfigAPP";
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const MainDevice = () => {

  return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarActiveTintColor: "blue",
          tabBarInactiveTintColor: "gray",
          tabBarStyle: [
            {
              display: "flex"
            },
            null
          ],
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === 'MainDevice') {
              iconName = focused ? 'home' : 'home-outline';
      
            } else if (route.name === 'History') {
              iconName = focused ? 'time' : 'time-outline';
            } else if (route.name === 'Notification') {
              iconName = focused ? 'notifications' : 'notifications-outline';
            } else if (route.name === 'Settings') {
              iconName = focused ? 'settings' : 'settings-outline';
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="MainDevice" component={Device} options={{ tabBarLabel: 'MainDevice' }} />

        <Tab.Screen name="History" component={History} options={{ tabBarLabel: 'History' }} />
        <Tab.Screen name="Notification" component={Notification} options={{ tabBarLabel: 'Notifications' }} />
        <Tab.Screen name="Settings" component={Settings} options={{ tabBarLabel: 'Settings' }} />
      </Tab.Navigator>
  );
};
const Device =()=>{
  return (
    <Stack.Navigator initialRouteName="Main">
      <Stack.Screen name="Main" component={MainTab} options={{ headerShown: false }} />
      <Stack.Screen name="LightScreen" component={LightScreen} options={{ title: 'Light' }} />
      <Stack.Screen name="AddDeviceScreen" component={AddDeviceScreen} options={{ title: 'AddDevice' }} />
      <Stack.Screen name="DoorScreen" component={DoorScreen} options={{ title: 'Door' }} />
     
      <Stack.Screen name="DeleteDeviceScreen" component={DeleteDeviceScreen} options={{ title: 'DeleteDevice' }} />
      <Stack.Screen name="CameraScreen" component={CameraScreen} options={{ title: 'Check camera' }} />
    </Stack.Navigator>
);
};

//const db = getDatabase(FireBaseConfigAPP);

const MainTab = ({ navigation }) => {
  const [db, setDb] = useState(null);
  const [temperature, setTemperature] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [address, setAddress] = useState("");
  const [date, setDate] = useState("");
  const [gasLevel, setGasLevel] = useState(0);
  const [alertMessage, setAlertMessage] = useState("");
  const [devices, setDevices] = useState([]);
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      try {
        let loc = await Location.getCurrentPositionAsync({});
        setLocation(loc);

        let result = await Location.reverseGeocodeAsync({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        });

        if (result.length > 0) {
          let { street = "", subregion = "", region = "" } = result[0];
          let address = `${street}, ${subregion || ""}, ${region || ""}`;
          setAddress(address);
        }

        let currentDate = new Date().toLocaleDateString();
        setDate(currentDate);

        const database = getDatabase(FireBaseConfigAPP);
        setDb(database);
      } catch (error) {
        setErrorMsg("Failed to get location");
      }
    })();
  }, []);

  useEffect(() => {
    if (!db) return;

    const temperatureRef = ref(db, "Nha_A/Room1/Temperature/");
    const humidityRef = ref(db, "Nha_A/Room1/Humidity/");

    const temperatureCallback = (snapshot) => {
      const temp = snapshot.val();
      if (typeof temp === "number" && !isNaN(temp)) {
        setTemperature(temp);
      }
    };

    const humidityCallback = (snapshot) => {
      const hum = snapshot.val();
      if (typeof hum === "number" && !isNaN(hum)) {
        setHumidity(hum);
      }
    };1
    const gasRef = ref(db, "Nha_A/Room1/Gas/");
    const gasCallback = (snapshot) => {
      const gas = snapshot.val();
      if (typeof gas === "number" && !isNaN(gas)) {
        setGasLevel(gas);
        if (gas > 100) {
          setAlertMessage("Mức độ khí gas vượt quá ngưỡng an toàn!");
        } else {
          setAlertMessage("Mức độ khí gas an toàn");
        }
      }
    };
    onValue(gasRef, gasCallback);

    onValue(temperatureRef, temperatureCallback);
    onValue(humidityRef, humidityCallback);
    return () => {
      off(temperatureRef, temperatureCallback);
      off(humidityRef, humidityCallback);
      off(gasRef, gasCallback);
    };
  }, [db]);

  let weatherText = "";
  if (temperature > 30) {
    weatherText = "Hot";
  } else if (temperature <= 30 && temperature >= 20) {
    weatherText = "Warm";
  } else if (temperature < 20) {
    weatherText = "Cool";
  }

  const handleLightButtonPress = () => {
    navigation.navigate('LightScreen');
  };

  const handleDoorButtonPress = () => {
    navigation.navigate('DoorScreen');
  };

  const handleElectricityButtonPress = () => {
    navigation.navigate('ElectricityScreen');
  };

  const handleAirQualityButtonPress = () => {
    navigation.navigate('AirQualityScreen');
  };

  const handleCameraButtonPress = () => {
    navigation.navigate('CameraScreen');
  };
  const handleDeleteDeviceButtonPress = () => {
    navigation.navigate('DeleteDeviceScreen');
  };


  return (
    <View style={styles.contentContainer}>
      <View style={styles.content}>
        <Swiper loop={false} style={styles.swiperContainer}>
          <View style={styles.temperatureContainer}>
          <View style={styles.header}>
            <Image source={require('../assets/logo.jpg')} style={styles.logo} />
            <Text style={styles.wellcome}>Wellcome to IOT SmartHome!!!</Text>
          </View>
            <Icon name="map-marker" size={20} color={colors.primary} />
            <Text style={{ fontSize: 16 }}>{address}</Text>
            <Text>{date}</Text>
            <Text style={styles.temperatureText}>{temperature}°C</Text>
            {temperature > 30 && (
              <Icon name="weather-sunny" size={50} color={colors.primary} />
            )}
            {temperature <= 30 && temperature >= 20 && (
              <Icon name="weather-cloudy" size={50} color={colors.primary} />
            )}
            {temperature < 20 && (
              <Icon name="weather-rainy" size={50} color={colors.primary} />
            )}
            <Text style={styles.weatherConditionText}>{weatherText}</Text>
          </View>
          <View style={styles.humidityContainer}>
          <View style={styles.header}>
            <Image source={require('../assets/logo.jpg')} style={styles.logo} />
            <Text style={styles.wellcome}>Wellcome to IOT SmartHome!!!</Text>
          </View>
            <Icon name="map-marker" size={20} color={colors.primary} />
            <Text style={{ fontSize: 16 }}>{address}</Text>
            <Text>{date}</Text>
            <Text style={styles.humidityText}>{humidity}%</Text>
            <Icon name="water-outline" size={50} color={colors.primary} />
          </View>
          <View style={styles.humidityContainer}>
          <View style={styles.header}>
            <Image source={require('../assets/logo.jpg')} style={styles.logo} />
            <Text style={styles.wellcome}>Wellcome to IOT SmartHome!!!</Text>
          </View>
            <Icon name="map-marker" size={20} color={colors.primary} />
            <Text style={{ fontSize: 16 }}>{address}</Text>
            <Text>{date}</Text>
            <Text style={styles.humidityText}>{gasLevel}ppm</Text>
      
            <Icon name="gas-cylinder" size={50} color={colors.primary} />
            {/* Hiển thị dòng thông báo cảnh báo nếu có */}
            {alertMessage ? <Text>{alertMessage}</Text> : null}
          </View>
        </Swiper>
      </View>
      <Text style={styles.deviceText}>Device</Text>
      <ScrollView style={styles.scrollView}>
        <View style={styles.square}>
          <TouchableOpacity style={styles.device} onPress={handleLightButtonPress}>
            <Icon name="lightbulb-on" size={50} color={colors.primary} />
            <Text style={styles.text}>Đèn</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.device} onPress={handleDoorButtonPress}>
            <Icon name="door-open" size={50} color={colors.primary} />
            <Text style={styles.text}>Đóng/mở cửa</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.device} onPress={handleCameraButtonPress}>
            <Icon name="video" size={50} color={colors.primary} />
            <Text style={styles.text}>Kiểm tra camera</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.square}>
          <TouchableOpacity style={styles.device} onPress={() => navigation.navigate("AddDeviceScreen")}>
            <Icon name="plus" size={50} color={colors.primary} />
            <Text style={styles.text}>Thêm thiết bị</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.device} onPress={handleDeleteDeviceButtonPress}>
            <Ionicons name="trash" size={50} color={colors.primary} />
            <Text style={styles.text}>Xóa thiết bị</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    margin: 5,
    
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: 10,
    marginTop:-55,
    marginRight: 30,
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: 50,
    backgroundColor: '#ff8080',
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  wellcome: {
    fontSize: 22,
    fontWeight: 'bold',
    fontStyle: "italic",
  },
  content: {
    flex: 0.9,
  },

  square: {
    margin: 10,
    flexDirection: "row",
    justifyContent: "center",
    height: "25%",
    alignItems: "center",
  },
  squareBottom: {
    marginTop: 10,
  },
  device: {
    backgroundColor: colors.white,
    height: "100%",
    margin: 7,
    borderColor: "#800000",
    borderWidth: 2,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    width: "30%",
    marginTop: 100,
  },
  scrollView: {
    flex: 1,
    marginTop: -30,
  },
  text: {
    marginTop: 10,
    textAlign: "center",
    fontSize: 14,
    fontWeight: "bold",
  },
  swiperContainer: {
    height: "100%",
    backgroundColor: '#ffe6e6',
  },
  temperatureContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: '#ffe6e6',
    borderWidth: 3,
    borderColor: "#ff8080",
    borderRadius: 10,
  },
  humidityContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: '#ffe6e6',
    borderWidth: 3,
    borderColor: "#ff8080",
    borderRadius: 10,
  },
  temperatureText: {
    fontSize: 30,
    fontWeight: "bold",
  },
  humidityText: {
    fontSize: 30,
    fontWeight: "bold",
  },
  deviceText: {
    marginTop:10,
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default MainDevice;

