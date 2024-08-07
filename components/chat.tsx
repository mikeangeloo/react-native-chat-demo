import { useState } from "react";
import {
  View,
  TextInput,
  Button,
  FlatList,
  ListRenderItem,
} from "react-native";
import { ChatItem } from "./interfaces/chat-item.interface";
import { RenderChatItem } from "./chat-item";
import Styles from "./styles";

type ChatProps = {
  username: string;
  image: string;
};

const Chat = ({ username, image }: ChatProps) => {
  let [chatInput, setChatInput] = useState("");
  let [chatItemList, setChatItemList] = useState<ChatItem[]>([]);

  const renderItem: ListRenderItem<ChatItem> = ({ item }) => (
    <RenderChatItem chatItem={item} username={username} />
  );

  return (
    <View style={Styles.container}>
      <FlatList
        inverted
        data={chatItemList.sort((a, b) => b.timeStamp - a.timeStamp)}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
      <View style={Styles.sendSection}>
        <TextInput
          style={Styles.chatTextInput}
          value={chatInput}
          onChangeText={(text) => setChatInput(text)}
        />
        <Button
          title="Send"
          onPress={() => {
            setChatItemList([
              ...chatItemList,
              {
                id: Math.random().toString(36).substring(7),
                text: chatInput,
                image: image,
                timeStamp: Date.now(),
                by: username,
              },
            ]);
            setChatInput("");
          }}
        />
      </View>
    </View>
  );
};

export default Chat;
