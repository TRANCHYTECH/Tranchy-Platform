import React, { FC, useCallback, useState } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle } from "react-native"
import { AppStackScreenProps } from "app/navigators"
import { ListView, Screen } from "app/components"
import { useStores } from "app/models"
import { useFocusEffect } from "@react-navigation/native"
import { BlockItem, BlockItemType, ExtraData } from "../UIBlocks/BlockItem"
import { buildBlocks } from "./Blocks"
import { currentLocale } from "app/i18n"

const locale = currentLocale()

interface RecentQuestionsScreenProps extends AppStackScreenProps<"RecentQuestions"> {}

export const RecentQuestionsScreen: FC<RecentQuestionsScreenProps> = observer(
  function RecentQuestionsScreen() {
    const { questionStore, metadataStore } = useStores()
    const [extraData, setExtraData] = useState<ExtraData>()
    const [refreshing, setRefreshing] = useState(false)

    const handleRefresh = useCallback(async () => {
      setRefreshing(true)
      await questionStore.getRecentQuestions(true)
      setRefreshing(false)
    }, [])

    useFocusEffect(
      useCallback(() => {
        async function load() {
          await questionStore.getRecentQuestions(true)
        }
        setExtraData({ categories: metadataStore.questionCategories, locale })
        load()
      }, []),
    )

    return (
      <Screen preset="fixed" safeAreaEdges={["bottom"]} contentContainerStyle={$root}>
        <ListView<BlockItemType>
          estimatedItemSize={120}
          getItemType={(item) => item.type}
          renderItem={({ item, extraData }) => <BlockItem data={item} extraData={extraData} />}
          data={buildBlocks(questionStore.recentQuestions)}
          extraData={extraData}
          onRefresh={handleRefresh}
          refreshing={refreshing}
          onEndReached={() => questionStore.getRecentQuestions()}
        />
      </Screen>
    )
  },
)

const $root: ViewStyle = {
  flex: 1,
}
