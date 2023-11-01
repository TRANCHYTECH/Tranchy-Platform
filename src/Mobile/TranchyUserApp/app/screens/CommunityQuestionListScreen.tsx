import React, { FC } from "react"
import { ViewStyle } from "react-native"
import { Screen } from "app/components"
import { Text } from "react-native-paper"
import { MyTabScreenProps } from "../navigators/BottomNavigator"
import { spacing } from "app/theme"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "app/models"

export const CommunityQuestionListScreen: FC<MyTabScreenProps<"CommunityQuestionList">> =
  function CommunityQuestionListScreen(_props) {
    // Pull in one of our MST stores
    // const { someStore, anotherStore } = useStores()

    // Pull in navigation via hook
    // const navigation = useNavigation()
    return (
      <Screen contentContainerStyle={$container} preset="scroll" safeAreaEdges={["top"]}>
        <Text>tranchy Danh sách câu hỏi từ cộng đồng, và</Text>
      </Screen>
    )
  }

const $container: ViewStyle = {
  paddingTop: spacing.lg + spacing.xl,
  paddingHorizontal: spacing.lg,
}
