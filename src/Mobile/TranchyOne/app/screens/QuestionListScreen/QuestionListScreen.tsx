import React, { FC } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle } from "react-native"
import { Screen, Text } from "app/components"
import { MainTabScreenProps } from "app/navigators"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "app/models"

interface QuestionListScreenProps extends MainTabScreenProps<"QuestionList"> {}

export const QuestionListScreen: FC<QuestionListScreenProps> = observer(
  function QuestionListScreen() {
    // Pull in one of our MST stores
    // const { someStore, anotherStore } = useStores()

    // Pull in navigation via hook
    // const navigation = useNavigation()
    return (
      <Screen style={$root} preset="scroll">
        <Text text="questionList" />
      </Screen>
    )
  },
)

const $root: ViewStyle = {
  flex: 1,
}
