import React, { FC } from "react"
import { observer } from "mobx-react-lite"
import { View, ViewStyle } from "react-native"
import { AppStackScreenProps } from "app/navigators"
import { Screen } from "app/components"
import { useStores } from "app/models"
import { Text } from "react-native-paper"
import { signalr } from "app/services/signalr/signalr"

interface QuestionConversationScreenProps extends AppStackScreenProps<"QuestionConversation"> {}

export const QuestionConversationScreen: FC<QuestionConversationScreenProps> = observer(
  function QuestionConversationScreen({ route }) {
    const { id } = route.params
    // Pull in one of our MST stores
    // const { someStore, anotherStore } = useStores()

    // Pull in navigation via hook
    // const navigation = useNavigation()
    // const { navigate } = useNavigation<NativeStackNavigationProp<AppStackParamList, "QuestionConversation">>()
    const { questionEventStore } = useStores()
    console.log("Start question conversation screen")
    signalr.registerEvent(id, (data) => questionEventStore.setEvent({ message: data }))
    signalr.start()

    return (
      <Screen style={$root} preset="scroll">
        <View>
          <Text>Conversation</Text>
          {questionEventStore.sortedEvents.map((e, i) => (
            <Text key={i}>
              Number questions {i}: {e.message}
            </Text>
          ))}
        </View>
      </Screen>
    )
  },
)

const $root: ViewStyle = {
  flex: 1,
}
