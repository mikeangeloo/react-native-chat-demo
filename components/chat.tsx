import { useEffect, useState } from "react";
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
import Socket from "./socket";

type ChatProps = {
  username: string;
  image: string;
};

const Chat = ({ username, image }: ChatProps) => {
  let [chatInput, setChatInput] = useState("");
  let [chatItemList, setChatItemList] = useState<ChatItem[]>([]);

  useEffect(() => {
    (async () => {
      try {
        if (Socket.state === "Disconnected") {
          await Socket.start();
        }
      } catch (err) {
        console.log(err);
      }
    })();
    Socket.on("ReceiveMessage", (chatItem: ChatItem) => {
      setChatItemList((chatItemList) => {
        if (chatItemList.find((i) => i.id === chatItem.id)) return chatItemList;
        return [...chatItemList, chatItem];
      });
    });
  }, []);

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
          onPress={async () => {
            await Socket.invoke("SendMessage", {
              id: Math.random().toString(36).substring(7),
              text: chatInput,
              image: image,
              timeStamp: Date.now(),
              by: username,
            });
            setChatInput("");
          }}
        />
      </View>
    </View>
  );
};

export default Chat;
