import React, { FC, useCallback } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle } from "react-native"
import { MainTabScreenProps } from "app/navigators"
import { ListView, Screen } from "app/components"
import { BlockItem, buildBlocks } from "./Blocks"
import { BlockItemType } from "./BlockItem"
import { HighlightSection, useStores } from "app/models"
import { useFocusEffect } from "@react-navigation/native"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "app/models"

interface WalkAroundScreenProps extends MainTabScreenProps<"WalkAround"> {}

export const WalkAroundScreen: FC<WalkAroundScreenProps> = observer(function WalkAroundScreen() {
  // Pull in one of our MST stores
  const { highlightStore } = useStores()

  // Pull in navigation via hook
  // const navigation = useNavigation()
  useFocusEffect(
    useCallback(() => {
      async function load() {
        await highlightStore.fetchHighlights()
        if (__DEV__) {
          console.tron.display({
            name: "Hight light",
            value: highlightStore.highlightSections,
          })
        }
      }
      load()
    }, []),
  )
  return (
    <Screen preset="fixed" safeAreaEdges={["top"]} contentContainerStyle={$root}>
      <ListView<BlockItemType>
        estimatedItemSize={30}
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
