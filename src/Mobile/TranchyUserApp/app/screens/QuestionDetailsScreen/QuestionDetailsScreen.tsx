import React, { FC, useCallback, useState } from "react"
import { observer } from "mobx-react-lite"
import { View, ViewStyle } from "react-native"
import { AppStackParamList, AppStackScreenProps } from "app/navigators"
import { Screen } from "app/components"
import { Text, Button } from "react-native-paper"
import { Question, useStores } from "app/models"
import { useFocusEffect, useNavigation } from "@react-navigation/native"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"

interface QuestionDetailsScreenProps extends AppStackScreenProps<"QuestionDetails"> {}

// todo: use observer. https://mobx-state-tree.js.org/intro/getting-started
const QuestionForm = ({ question }: { question: Question }) => {
  return (
    <View>
      <Text>Question: {question.title}</Text>
      <Text>Created by: {question.createdByUserId}</Text>
      <Text>Consultant: {question.consultant?.userId}</Text>
      <Text>Status: {question.status}</Text>
      <Text>Kết luận: {question.consultant?.conclusion}</Text>
    </View>
  )
}
export const QuestionDetailsScreen: FC<QuestionDetailsScreenProps> = observer(
  function QuestionDetailsScreen({ route }) {
    const { id } = route.params
    const { navigate } =
      useNavigation<NativeStackNavigationProp<AppStackParamList, "QuestionDetails">>()
    const { questionStore } = useStores()
    const [question, setQuestion] = useState<Question>()

    const takeConsultation = async () => {
      await question.takeConsultation()
      alert("Congratulation. You are now consultant of this question")
    }

    useFocusEffect(
      useCallback(() => {
        setQuestion(questionStore.getQuestion(id))
      }, []),
    )

    return (
      <Screen style={$root} preset="scroll">
        {question && (
          <View>
            <QuestionForm question={question} />
            {question.permissions.canTakeConsultation && (
              <Button onPress={takeConsultation}>Take Consultation</Button>
            )}
            {question.permissions.canTakeConversation && (
              <Button onPress={() => navigate("QuestionConversation", { id })}>
                Go To Conversation
              </Button>
            )}
          </View>
        )}
      </Screen>
    )
  },
)

const $root: ViewStyle = {
  flex: 1,
}
