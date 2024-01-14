import React, { FC, useCallback } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle } from "react-native"
import { AppStackScreenProps } from "app/navigators"
import { ListView, Screen } from "app/components"
import { useStores } from "app/models"
import { useFocusEffect } from "@react-navigation/native"
import { BlockItem, BlockItemType } from "../UIBlocks/BlockItem"
import { buildBlocks } from "./Blocks"

interface RecentQuestionsScreenProps extends AppStackScreenProps<"RecentQuestions"> {}

export const RecentQuestionsScreen: FC<RecentQuestionsScreenProps> = observer(
  function RecentQuestionsScreen() {
    const { questionStore } = useStores()

    useFocusEffect(
      useCallback(() => {
        async function load() {
          await questionStore.getRecentQuestions(true)
        }
        load()
      }, []),
    )

    return (
      <Screen preset="fixed" safeAreaEdges={["bottom"]} contentContainerStyle={$root}>
        <ListView<BlockItemType>
          estimatedItemSize={120}
          getItemType={(item) => item.type}
          renderItem={({ item }) => <BlockItem data={item} />}
          data={buildBlocks(questionStore.recentQuestions)}
          onEndReached={() => questionStore.getRecentQuestions()}
        />
      </Screen>
    )
  },
)

const $root: ViewStyle = {
  flex: 1,
}
