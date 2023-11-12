import React, { FC } from "react"
import { observer } from "mobx-react-lite"
import { StyleSheet, View, ViewStyle } from "react-native"
import { AppStackScreenProps } from "app/navigators"
import { Screen } from "app/components"
import { useStores, Question } from "app/models"
import { FlashList } from "@shopify/flash-list"
import QuestionItem from "./QuestionItem"

interface QuestionListScreenProps extends AppStackScreenProps<"QuestionList"> {}

export const QuestionListScreen: FC<QuestionListScreenProps> = observer(
  function QuestionListScreen() {
    const { questionStore } = useStores()
    // const navigation = useNavigation()

    React.useEffect(() => {
      console.log("load questions")
      questionStore.listPublicQuestions()
    }, [])

    return (
      <Screen style={$root} preset="scroll">
        <View style={styles.questionListArea}>
          <FlashList<Question>
            data={questionStore.allQuestions}
            renderItem={({ item }) => {
              return <QuestionItem item={item} />
            }}
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

export const styles = StyleSheet.create({
  questionListArea: {
    flex: 1,
    height: "100%",
    minHeight: 100,
  },
})
