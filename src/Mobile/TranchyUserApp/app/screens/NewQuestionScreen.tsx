import { FC } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle } from "react-native"
import { AppStackScreenProps } from "app/navigators"
import { Screen, Text } from "app/components"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "app/models"

interface NewQuestionScreenProps extends AppStackScreenProps<"NewQuestion"> {}

export const NewQuestionScreen: FC<NewQuestionScreenProps> = observer(function NewQuestionScreen() {
  // Pull in one of our MST stores
  // const { someStore, anotherStore } = useStores()

  // Pull in navigation via hook
  // const navigation = useNavigation()
  return (
    <Screen style={$root} preset="scroll">
      <Text text="newQuestion" />
    </Screen>
  )
})

const $root: ViewStyle = {
  flex: 1,
}
