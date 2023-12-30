import React, { FC, useCallback } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle } from "react-native"
import { MainTabScreenProps } from "app/navigators"
import { ListView, Screen } from "app/components"
import { BlockItem, buildBlocks } from "./Blocks"
import { BlockItemType } from "./BlockItem"
import { HighlightSection, useStores } from "app/models"
import { useFocusEffect } from "@react-navigation/native"

interface WalkAroundScreenProps extends MainTabScreenProps<"WalkAround"> {}

export const WalkAroundScreen: FC<WalkAroundScreenProps> = observer(function WalkAroundScreen() {
  const { highlightStore } = useStores()

  useFocusEffect(
    useCallback(() => {
      async function load() {
        await highlightStore.fetchHighlights()
        if (__DEV__) {
          console.tron.display({
            name: "loaded Highlights action",
            value: highlightStore.highlightSections,
          })
        }
      }
      load()
    }, []),
  )

  return (
    <Screen preset="fixed" safeAreaEdges={[]} contentContainerStyle={$root}>
      <ListView<BlockItemType>
        estimatedItemSize={120}
        getItemType={(item) => item.type}
        renderItem={({ item }) => <BlockItem data={item} />}
        data={buildBlocks(highlightStore.highlightSections as HighlightSection)}
      />
    </Screen>
  )
})

const $root: ViewStyle = {
  flex: 1,
}
