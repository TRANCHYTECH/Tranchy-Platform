import React, { FC, useCallback, useState } from "react"
import { observer } from "mobx-react-lite"
import { View, ViewStyle, StyleSheet, Image } from "react-native"
import { AppStackScreenProps } from "app/navigators"
import { Screen } from "app/components"
import { Button, Text } from "react-native-paper"
import { GiftedChat, IChatMessage } from "react-native-gifted-chat"
import { createQuestionEvent } from "app/services/ask-api/askApi"
import {
  CreateQuestionEventMessageSentInput,
  CreateQuestionEventMessageSentInputType,
} from "app/services/ask-api/models"
import { useConversationHub } from "app/services/signalr/useConversationHub"
import { useFocusEffect } from "@react-navigation/native"
import { QuestionInstance, useStores } from "app/models"
import { finishConsultationImage, spacing } from "app/theme"

interface QuestionConversationScreenProps extends AppStackScreenProps<"QuestionConversation"> {}

export const QuestionConversationScreen: FC<QuestionConversationScreenProps> = observer(
  function QuestionConversationScreen({ navigation, route }) {
    const { id } = route.params
    const { questionStore, metadataStore } = useStores()
    const [messages, setMessages] = useState([])

    useConversationHub({
      receiveEventHandler: (data) => {
        setMessages((previousMessages) => GiftedChat.append(previousMessages, [data], false))
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

    React.useLayoutEffect(() => {
      const question = questionStore.getQuestion(id)
      if (question.consultant?.userId === getUserId()) {
        navigation.setOptions({
          headerRight: () => (
            <Button onPress={() => alert("Se mo man hinh ket thuc ho tro")}>
              <Image style={styles.rightHeaderButton} source={finishConsultationImage} />
            </Button>
          ),
        })
      }
    }, [navigation])

    const onSend = useCallback((messages = []) => {
      const question = questionStore.getQuestion(id)
      const event: CreateQuestionEventMessageSentInput = {
        $type: CreateQuestionEventMessageSentInputType.MessageSent,
        content: (messages[0] as IChatMessage).text,
        metadata: {
          notifiedUserId: question.permissions.directChatTargetUserId,
        },
      }

      // todo: handle case that could not delivery message. such as exception 500.
      createQuestionEvent(id, event)

      // todo: set default status is sending. Then update status after receive
      setMessages((previousMessages) => GiftedChat.append(previousMessages, messages, false))
    }, [])

    const getUserId = () => metadataStore.userId

    return (
      <Screen style={$root} safeAreaEdges={["bottom"]}>
        <View style={styles.questionListArea}>
          <QuestionDetailSection question={questionStore.getQuestion(id)}></QuestionDetailSection>
          <GiftedChat
            isCustomViewBottom={true}
            inverted={false}
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

const QuestionDetailSection = ({ question }: { question: QuestionInstance }) => {
  const { metadataStore } = useStores()

  return (
    <View style={styles.questionDetails}>
      <Text variant="titleMedium">Câu hỏi: {question.title}</Text>
      <Text>
        Người dùng: {metadataStore.email} (
        {question.consultant?.userId === metadataStore.userId ? "Consultant" : "Requester"})
      </Text>
    </View>
  )
}

const $root: ViewStyle = {
  flex: 1,
}

const styles = StyleSheet.create({
  rightHeaderButton: {
    height: 32,
    margin: spacing.xs,
    width: 32,
  },
  questionDetails: {
    padding: spacing.md,
  },
  questionListArea: {
    flex: 1,
    height: "100%",
    minHeight: "100%",
  },
})
