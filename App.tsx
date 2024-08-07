import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native";
import PersonalInfo from "./components/personal-info";
import Styles from "./components/styles";
import React, { useState } from "react";
import Chat from "./components/chat";
import AsycStorage from "@react-native-async-storage/async-storage";
import AppLoading from "expo-app-loading";

export default function App() {
  const storageUserNameKey = "chatapp-username";
  const storageImageKey = "chatapp-image";
  const [username, setUsername] = useState("");
  const [image, setImage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const fetchPersonalData = async () => {
    let fetchedUsername = await AsycStorage.getItem(storageUserNameKey);
    let username = fetchedUsername ?? "";
    let fetchedImage = await AsycStorage.getItem(storageImageKey);
    let iamge = fetchedImage ?? "";
    setUsername(username);
    setImage(iamge);
  };

  const onPersonalInfoClosed = async (name: string, image: string) => {
    setUsername(name);
    await AsycStorage.setItem(storageUserNameKey, name);
    setImage(image);
    await AsycStorage.setItem(storageImageKey, image);
  };

  if (isLoading) {
    return (
      <AppLoading
        startAsync={fetchPersonalData}
        onFinish={() => setIsLoading(false)}
        onError={() => {}}
      />
    );
  }

  let activeComponent =
    username && image != "" ? (
      <Chat username={username} image={image} />
    ) : (
      <PersonalInfo onClosed={onPersonalInfoClosed} />
    );
  console.log("activeComponent --->", activeComponent);
  console.log("username --->", username);
  return (
    <SafeAreaView style={Styles.container}>
      {activeComponent}
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}
