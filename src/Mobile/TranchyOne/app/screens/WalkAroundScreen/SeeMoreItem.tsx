import { TextStyle, View, ViewStyle } from "react-native"
import React from "react"
import { Text } from "app/components"
import { BlockItemBase, BlockType } from "./BlockItem"
import { colors, spacing } from "app/theme"
import { Button, Icon } from "react-native-paper"

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

export const renderSeeMoreItem = (input: SeeMoreItem) => {
  return (
    <View style={$container}>
      <Button icon="chevron-right" mode="text" contentStyle={$moreContent} labelStyle={$moreText}>
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
