import React, { useState } from "react";
import moment from 'moment';
import { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableOpacity,
} from "react-native";
import Slider from "@react-native-community/slider";
import Icon from "react-native-vector-icons/FontAwesome";
import {
  getDatabase,
  ref,
  set,
  onValue,
  child,
  get,
  off,
  update,
  push,
} from "firebase/database";
import { FireBaseConfigAPP } from "../firebase/FireBaseConfigAPP";

const Led = () => {
  const [brightnessValues, setBrightnessValues] = useState({
    livingRoom: 0,
    bedRoom: 0,
    kitchen: 0,
    workRoom: 0,
  });

  const updateBrightness = (room, brightness) => {
    // Update the brightness value for the selected room
    console.log("Room:", room, "Brightness:", brightness);
    setBrightnessValues((prevValues) => ({
      ...prevValues,
      [room]: brightness,
    }));

    const db = getDatabase(FireBaseConfigAPP);
    //const starCountRef = ref(db, "Nha_A/Room1/");
    update(ref(db, "Nha_A/" + room + "/"), {
      Led: parseInt((brightness * 255) / 100),
    }).then(() => {
      // Data saved successfully!
    });
    const historyRef = ref(db, "Nha_A/history");
    const newHistoryItem = {
      timestamp: moment().format('YYYY-MM-DD HH:mm:ss'),
      action: `'${room}' brightness set to ${brightness}%`, // Mô tả thao tác
      room: room, // Tên phòng
    };
    push(historyRef, newHistoryItem).then(() => {
      // Lịch sử được lưu thành công!
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.frame}>
        <Text style={styles.title}>
          <Icon name="lightbulb-o" size={30} color="#ffff"/> Light Control
        </Text>
        <View style={styles.logoContainer}>
          <Image source={require("../assets/led.png")} style={styles.logo} />
        </View>
        <View style={styles.row}>
          <View style={styles.roomContainer}>
            <Text>Living Room</Text>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={100}
              value={brightnessValues.livingRoom}
              onValueChange={(value) => updateBrightness("Room4", value)}
            />
          </View>

          <View style={styles.roomContainer}>
            <Text>Bed Room</Text>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={100}
              value={brightnessValues.bedRoom}
              onValueChange={(value) => updateBrightness("Room2", value)}
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.roomContainer}>
            <Text>Kitchen</Text>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={100}
              value={brightnessValues.kitchen}
              onValueChange={(value) => updateBrightness("Room1", value)}
            />
          </View>

          <View style={styles.roomContainer}>
            <Text>Work Room</Text>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={100}
              value={brightnessValues.workRoom}
              onValueChange={(value) => updateBrightness("Room3", value)}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffff",
    padding: 20,
  },
  slider: {
    width: "80%",
    height: 40,
  },
  frame: {
    flex: 1,
    borderWidth: 3,
    borderColor: "#ff8080",
    borderRadius: 10,
    padding: 30,
    marginTop: -20,
    justifyContent: "center",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginTop: 30,
    textAlign: "center",
    color: "#000",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 240,
    height: 240,
  },
  row: {
    flexDirection: "row",
    marginBottom: 40,
  },
  roomContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 5,
    borderColor: "#ff8080",
    marginHorizontal: 5,
    padding: 10,
    borderRadius: 20,
    backgroundColor: "white",
  },
  back: {
    color: "#0000b3",
    marginTop: 15,
    textDecorationLine: "underline",
  },
});

export default Led;
