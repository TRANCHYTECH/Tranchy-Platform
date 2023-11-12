import React, { FC } from "react"
import { observer } from "mobx-react-lite"
import { View, ViewStyle } from "react-native"
import { AppStackParamList, AppStackScreenProps, navigate } from "app/navigators"
import { Screen } from "app/components"
import { Text, Button } from "react-native-paper"
import { QuestionSnapshotOut, useStores } from "app/models"
import { useNavigation } from "@react-navigation/native"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"

interface QuestionDetailsScreenProps extends AppStackScreenProps<"QuestionDetails"> {}

const QuestionForm = ({ question }: { question: QuestionSnapshotOut }) => {
  return (
    <View>
      <Text>{question?.title}</Text>
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
          <Button
            onPress={() => {
              console.log("Confirm")
              navigate("QuestionConversation")
            }}
          >
            Accept
          </Button>
        </View>
      </Screen>
    )
  },
)

const $root: ViewStyle = {
  flex: 1,
}
