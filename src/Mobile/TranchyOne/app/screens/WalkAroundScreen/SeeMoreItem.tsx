import { TextStyle, View, ViewStyle } from "react-native"
import React from "react"
import { BlockItemBase, BlockType } from "./BlockItem"
import { colors, spacing } from "app/theme"
import { Button } from "react-native-paper"
import { NavigationContext } from "@react-navigation/core"

export type SeeMoreItemData = {
  route: string
}

export class SeeMoreItem implements BlockItemBase {
  type: BlockType = "SeeMore"
  data: SeeMoreItemData
  constructor(data: SeeMoreItemData) {
    this.data = data
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const renderSeeMoreItem = (input: SeeMoreItem) => {
  const navigation = React.useContext(NavigationContext)
  // const { navigation } = useNavigation<MainTabScreenProps<"WalkAround">>()

  return (
    <View style={$container}>
      <Button
        icon="chevron-right"
        mode="text"
        contentStyle={$moreContent}
        labelStyle={$moreText}
        onPress={() => navigation?.navigate("QuestionList")}
      >
        Xem thêm
      </Button>
    </View>
  )
}

const $container: ViewStyle = {
  flex: 1,
  paddingTop: spacing.sm,
  paddingBottom: spacing.sm,
  flexDirection: "row",
  justifyContent: "center",
}

const $moreContent: ViewStyle = {
  flexDirection: "row-reverse",
}

const $moreText: TextStyle = {
  color: colors.moreLink,
  fontSize: 14,
}
