import React, { FC, useCallback, useState } from "react"
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
    const { questionStore, metadataStore } = useStores()
    const [messages, setMessages] = useState([])

    useConversationHub({
      receiveEventHandler: (data) => {
        const receivedEvent = {
          _id: data.id,
          text: data.content,
          createdAt: data.createdOn,
          user: {
            _id: data.createdByUserId,
          },
        }

        setMessages((previousMessages) => GiftedChat.append(previousMessages, [receivedEvent]))
      },
    })

    useFocusEffect(
      useCallback(() => {
        async function loadEvents() {
          const question = questionStore.getQuestion(id)
          await question.loadQuestionEvents()
          setMessages(question.events)
        }

        loadEvents()
      }, []),
    )

    const onSend = useCallback((messages = []) => {
      const question = questionStore.getQuestion(id)
      const event: CreateQuestionEventMessageSentInput = {
        $type: CreateQuestionEventMessageSentInputType.MessageSent,
        content: (messages[0] as IChatMessage).text,
        metadata: {
          notifiedUserId:
            question.permissions.role === "Requester" ? question.responder.userId : getUserId(),
        },
      }
      createQuestionEvent(id, event)

      setMessages((previousMessages) => GiftedChat.append(previousMessages, messages))
    }, [])

    const getUserId = () => metadataStore.userId

    // const testHub = () => {
    //   signalr.createEvent(
    //     id,
    //     getSnapshot(CreateQuestionEventMessageSentInput.create({ content: "hello world" })),
    //   )
    // }

    return (
      <Screen style={$root} safeAreaEdges={["bottom"]}>
        <View style={styles.questionListArea}>
          <Text>Conversation. user: {metadataStore.email}</Text>
          <GiftedChat
            messages={messages}
            onSend={(messages) => onSend(messages)}
            user={{
              _id: getUserId(),
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
