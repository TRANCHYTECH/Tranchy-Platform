import React, { FC, useCallback, useState } from "react"
import { observer } from "mobx-react-lite"
import { StyleSheet, View, ViewStyle } from "react-native"
import { AppStackScreenProps } from "app/navigators"
import { Screen } from "app/components"
import { useStores, Question } from "app/models"
import { FlashList } from "@shopify/flash-list"
import QuestionItem from "./QuestionItem"
import { useFocusEffect } from "@react-navigation/native"

interface QuestionListScreenProps extends AppStackScreenProps<"QuestionList"> {}

export const QuestionListScreen: FC<QuestionListScreenProps> = observer(
  function QuestionListScreen() {
    const { questionStore } = useStores()
    const [questions, setQuestions] = useState<Question[]>([])
    useFocusEffect(
      useCallback(() => {
        async function load() {
          await questionStore.listPublicQuestions()
          setQuestions([...questionStore.getQuestions()])
        }
        load()
      }, []),
    )

    return (
      <Screen style={$root} preset="scroll">
        <View style={styles.questionListArea}>
          <FlashList<Question>
            data={questions}
            renderItem={({ item }) => {
              return <QuestionItem item={item} />
            }}
            estimatedItemSize={100}
            keyExtractor={(item) => item.id}
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
