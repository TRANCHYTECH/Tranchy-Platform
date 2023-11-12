import React, { FC } from "react"
import { observer } from "mobx-react-lite"
import { View, ViewStyle } from "react-native"
import { AppStackScreenProps } from "app/navigators"
import { Screen } from "app/components"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "app/models"
import { Text } from "react-native-paper"

interface QuestionConversationScreenProps extends AppStackScreenProps<"QuestionConversation"> {}

export const QuestionConversationScreen: FC<QuestionConversationScreenProps> = observer(
  function QuestionConversationScreen() {
    // Pull in one of our MST stores
    // const { someStore, anotherStore } = useStores()

    // Pull in navigation via hook
    // const navigation = useNavigation()
    return (
      <Screen style={$root} preset="scroll">
        <View>
          <Text>Conversation</Text>
        </View>
      </Screen>
    )
  },
)

const $root: ViewStyle = {
  flex: 1,
}
