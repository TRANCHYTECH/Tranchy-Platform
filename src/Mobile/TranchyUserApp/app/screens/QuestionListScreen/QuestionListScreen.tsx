import React, { FC } from "react"
import { observer } from "mobx-react-lite"
import { StyleSheet, View, ViewStyle } from "react-native"
import { IconButton, Text } from "react-native-paper"
import { AppStackScreenProps } from "app/navigators"
import { Screen } from "app/components"
// import { useNavigation } from "@react-navigation/native"
import { useStores, Question } from "app/models"
import { FlashList } from "@shopify/flash-list"
import { spacing } from "app/theme"

interface QuestionListScreenProps extends AppStackScreenProps<"QuestionList"> {}

// todo: destroy list after navigate to another screen
export const QuestionItem = ({ item }: { item: Question }) => (
  <View style={styles.questionItem}>
    <IconButton icon="delete-outline" />
    <View>
      <Text variant="titleSmall">{item.supportLevel}</Text>
      <Text>{item.title}</Text>
      <Text>{item.questionCategoryIds.join("# ")}</Text>
      <Text>{item.createdAt}</Text>
    </View>
  </View>
)
export const QuestionListScreen: FC<QuestionListScreenProps> = observer(
  function QuestionListScreen() {
    // Pull in one of our MST stores
    const { questionStore } = useStores()

    React.useEffect(() => {
      console.log("load questions")
      questionStore.fetchPublicQuestions()
    }, [])
    // Pull in navigation via hook
    // const navigation = useNavigation()
    return (
      <Screen style={$root} preset="scroll" safeAreaEdges={["top"]}>
        <View style={{ flex: 1, minHeight: 2 }}>
          <FlashList<Question>
            contentContainerStyle={{ padding: 12 }}
            data={questionStore.allQuestions}
            renderItem={QuestionItem}
            estimatedItemSize={100}
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
  questionItem: { flex: 1, flexDirection: "row", margin: spacing.xs },
})
