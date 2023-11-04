import React, { FC } from "react"
import { observer } from "mobx-react-lite"
import { StyleSheet, View, ViewStyle, Image } from "react-native"
import { Text } from "react-native-paper"
import { AppStackScreenProps } from "app/navigators"
import { Screen } from "app/components"
import { useStores, Question } from "app/models"
import { FlashList } from "@shopify/flash-list"
import { spacing, getSupportLevelImage, colors } from "app/theme"
import { timeAgo } from "app/utils/formatDate"

interface QuestionListScreenProps extends AppStackScreenProps<"QuestionList"> {}

export const QuestionItem = ({ item }: { item: Question }) => (
  <View style={styles.questionItem}>
    <Image style={styles.tinyLogo} source={getSupportLevelImage(item.supportLevel)} />
    <View style={styles.row}>
      <View style={styles.questionHeader}>
        <Text variant="titleMedium">{item.supportLevel}</Text>
        <Text variant="titleSmall">Chờ trả lời</Text>
      </View>
      <View style={styles.questionBrief}>
        <Text>{item.title}</Text>
        <Text variant="labelMedium">#{item.questionCategoryIds.join(" #").toUpperCase()}</Text>
        <Text variant="labelSmall">{timeAgo(item.createdOn)}</Text>
      </View>
    </View>
  </View>
)
export const QuestionListScreen: FC<QuestionListScreenProps> = observer(
  function QuestionListScreen() {
    const { questionStore } = useStores()

    React.useEffect(() => {
      console.log("load questions")
      questionStore.listPublicQuestions()
    }, [])

    return (
      <Screen style={$root} preset="scroll">
        <View style={styles.questionListArea}>
          <FlashList<Question>
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
  questionBrief: {
    flex: 1,
    gap: spacing.xs,
  },
  questionHeader: {
    alignItems: "baseline",
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  questionItem: {
    backgroundColor: colors.palette.neutral100,
    flexDirection: "row",
    marginBottom: spacing.xxs,
    paddingBottom: spacing.xs,
    padding: spacing.md,
  },
  questionListArea: {
    flex: 1,
    height: "100%",
    minHeight: 100,
  },
  row: {
    flex: 1,
  },
  tinyLogo: {
    height: 32,
    margin: spacing.xs,
    width: 32,
  },
})
