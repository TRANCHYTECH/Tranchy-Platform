import React, { FC } from "react"
import { observer } from "mobx-react-lite"
import { View, ViewStyle } from "react-native"
import { AppStackParamList, AppStackScreenProps } from "app/navigators"
import { Screen } from "app/components"
import { Text, Button } from "react-native-paper"
import { QuestionSnapshotOut, useStores } from "app/models"
import { useNavigation } from "@react-navigation/native"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"

interface QuestionDetailsScreenProps extends AppStackScreenProps<"QuestionDetails"> {}

const QuestionForm = ({ question }: { question: QuestionSnapshotOut }) => {
  return (
    <View>
      <Text>Question: {question?.title}</Text>
      <Text>Status: {question?.status}</Text>
      <Text>Created by: {question?.createdByUserId}</Text>
      <Text>Responder: {question?.responder?.userId}</Text>
    </View>
  )
}
export const QuestionDetailsScreen: FC<QuestionDetailsScreenProps> = observer(
  function QuestionDetailsScreen({ route }) {
    const { id } = route.params
    const { navigate } =
      useNavigation<NativeStackNavigationProp<AppStackParamList, "QuestionDetails">>()
    const { questionStore } = useStores()

    return (
      <Screen style={$root} preset="scroll">
        <View>
          <QuestionForm question={questionStore.getQuestion(id)} />
          <Button onPress={() => navigate("QuestionConversation", { id })}>Accept</Button>
          <Button onPress={() => navigate("QuestionConversation", { id })}>
            Go To Conversation
          </Button>
        </View>
      </Screen>
    )
  },
)

const $root: ViewStyle = {
  flex: 1,
}
