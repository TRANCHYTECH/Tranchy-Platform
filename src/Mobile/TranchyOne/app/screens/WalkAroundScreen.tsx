import React, { FC } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle } from "react-native"
import { MainTabScreenProps } from "app/navigators"
import { ListView, Screen } from "app/components"
import { BlockItem, orderedList } from "./WalkAroundScreen/Blocks"
import { BlockItemType } from "./WalkAroundScreen/BlockItem"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "app/models"

interface WalkAroundScreenProps extends MainTabScreenProps<"WalkAround"> {}

export const WalkAroundScreen: FC<WalkAroundScreenProps> = observer(function WalkAroundScreen() {
  // Pull in one of our MST stores
  // const { someStore, anotherStore } = useStores()

  // Pull in navigation via hook
  // const navigation = useNavigation()
  return (
    <Screen preset="fixed" safeAreaEdges={["top"]} contentContainerStyle={$root}>
      <ListView<BlockItemType>
        estimatedItemSize={30}
        getItemType={(item) => item.type}
        renderItem={({ item }) => <BlockItem data={item} />}
        data={orderedList}
      />
    </Screen>
  )
})

const $root: ViewStyle = {
  flex: 1,
}
