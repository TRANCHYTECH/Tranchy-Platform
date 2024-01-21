import React, { FC, useCallback, useState } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle } from "react-native"
import { MainTabScreenProps } from "app/navigators"
import { ListView, Screen } from "app/components"
import { BlockItem, BlockItemType, ExtraData } from "../UIBlocks/BlockItem"
import { useStores } from "app/models"
import { useFocusEffect } from "@react-navigation/native"
import { buildBlocks } from "./Blocks"
import { currentLocale } from "app/i18n"

const locale = currentLocale()

interface WalkAroundScreenProps extends MainTabScreenProps<"WalkAround"> {}

export const WalkAroundScreen: FC<WalkAroundScreenProps> = observer(function WalkAroundScreen() {
  const { highlightStore, metadataStore } = useStores()
  const [extraData, setExtraData] = useState<ExtraData>()
  const [refreshing, setRefreshing] = useState(false)

  const handleRefresh = useCallback(async () => {
    setRefreshing(true)
    await highlightStore.getUserHighlights()
    setRefreshing(false)
  }, [])

  useFocusEffect(
    useCallback(() => {
      async function load() {
        await highlightStore.getUserHighlights()
      }
      setExtraData({ categories: metadataStore.questionCategories, locale })
      load()
    }, []),
  )

  return (
    <Screen preset="fixed" safeAreaEdges={[]} contentContainerStyle={$root}>
      <ListView<BlockItemType>
        estimatedItemSize={120}
        getItemType={(item) => item.type}
        renderItem={({ item, extraData }) => <BlockItem data={item} extraData={extraData} />}
        data={buildBlocks(highlightStore.userHighlights)}
        extraData={extraData}
        onRefresh={handleRefresh}
        refreshing={refreshing}
      />
    </Screen>
  )
})

const $root: ViewStyle = {
  flex: 1,
}
