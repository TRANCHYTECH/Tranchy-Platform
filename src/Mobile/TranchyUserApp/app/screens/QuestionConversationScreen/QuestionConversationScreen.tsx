import React, { FC, useCallback, useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { View, ViewStyle, StyleSheet } from "react-native"
import { AppStackScreenProps } from "app/navigators"
import { Screen } from "app/components"
import { Text } from "react-native-paper"
import { GiftedChat, IChatMessage } from "react-native-gifted-chat"
import { createQuestionEvent } from "app/services/ask-api/askApi"
import {
  CreateQuestionEventMessageSentInput,
  CreateQuestionEventMessageSentInputType,
} from "app/services/ask-api/models"
import { useConversationHub } from "app/services/signalr/useConversationHub"
import { useFocusEffect } from "@react-navigation/native"
import { useStores } from "app/models"

interface QuestionConversationScreenProps extends AppStackScreenProps<"QuestionConversation"> {}

export const QuestionConversationScreen: FC<QuestionConversationScreenProps> = observer(
  function QuestionConversationScreen({ route }) {
    const { id } = route.params
    const { questionStore } = useStores()
    const [messages, setMessages] = useState([])

    useConversationHub({
      receiveEventHandler: (data) => {
        // test msg
        const newMsg = {
          _id: data.id,
          text: data.content,
          createdAt: data.createdOn,
          user: {
            _id: data.createdByUserId,
          },
        }

        setMessages((previousMessages) => GiftedChat.append(previousMessages, [newMsg]))
        console.log("ON RECEIVE EVENT Chat message", data)
      },
      conversationId: id,
    })

    useFocusEffect(
      useCallback(() => {
        // todo: get current events from store, bind to msg chat.
        // or bind from server by passing format.
        setMessages([
          {
            _id: 1,
            text: "Hello TauDang",
            createdAt: new Date(),
            user: {
              _id: 2,
              name: "React Native",
              avatar: "https://placeimg.com/140/140/any",
            },
          },
        ])
      }, []),
    )

    const onSend = useCallback((messages = []) => {
      const question = questionStore.getQuestion(id)
      const event: CreateQuestionEventMessageSentInput = {
        $type: CreateQuestionEventMessageSentInputType.MessageSent,
        content: (messages[0] as IChatMessage).text,
        metadata: {
          notifiedUserId:
            question.permissions.role === "Requester"
              ? question.responder.userId
              : question.createdByUserId,
        },
      }
      createQuestionEvent(id, event)

      setMessages((previousMessages) => GiftedChat.append(previousMessages, messages))
    }, [])

    // const testHub = () => {
    //   signalr.createEvent(
    //     id,
    //     getSnapshot(CreateQuestionEventMessageSentInput.create({ content: "hello world" })),
    //   )
    // }

    return (
      <Screen style={$root} safeAreaEdges={["bottom"]}>
        <View style={styles.questionListArea}>
          <Text>Conversation</Text>
          <GiftedChat
            messages={messages}
            onSend={(messages) => onSend(messages)}
            user={{
              _id: 1,
            }}
          />
        </View>
      </Screen>
    )
  },
)

const $root: ViewStyle = {
  flex: 1,
}

const styles = StyleSheet.create({
  questionListArea: {
    flex: 1,
    height: "100%",
    minHeight: "100%",
  },
})
