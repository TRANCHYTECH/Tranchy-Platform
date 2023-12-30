import { TextStyle, View, ViewStyle } from "react-native"
import React from "react"
import { Text } from "app/components"
import { colors, spacing } from "app/theme"
import { BlockItemBase, BlockType } from "./BlockItem"

export type SectionTitleItemData = {
  title: string
}

export class SectionTitleItem implements BlockItemBase {
  type: BlockType = "SectionTitle"
  data: SectionTitleItemData
  constructor(data: SectionTitleItemData) {
    this.data = data
  }
}

export const renderSectionTitleItem = (input: SectionTitleItem) => {
  return (
    <View style={$container}>
      <View style={$separate}></View>
      <Text style={$text}>{input.data.title}</Text>
    </View>
  )
}

const $container: ViewStyle = {
  // backgroundColor: colors.blockBackground,
}

const $separate: ViewStyle = {
  height: spacing.xxs,
  backgroundColor: colors.separator,
}

const $text: TextStyle = {
  paddingTop: spacing.md,
  paddingLeft: spacing.md,
  paddingRight: spacing.md,
  fontSize: 16,
  fontWeight: "900",
  lineHeight: spacing.lg,
}
