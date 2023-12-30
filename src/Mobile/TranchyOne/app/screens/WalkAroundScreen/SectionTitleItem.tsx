import { TextStyle, View, ViewStyle } from "react-native"
import React from "react"
import { Text } from "app/components"
import { colors, spacing, typography } from "app/theme"
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
      <Text style={$text}>{input.data.title}</Text>
    </View>
  )
}

const $container: ViewStyle = {
  borderTopWidth: spacing.xxs,
  borderTopColor: colors.separator,
}

const $text: TextStyle = {
  fontFamily: typography.primary.medium,
  fontSize: 16,
  paddingTop: spacing.md,
  paddingLeft: spacing.md,
  paddingRight: spacing.md,
  lineHeight: spacing.lg,
}
