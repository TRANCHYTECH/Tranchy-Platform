import { TextStyle, View, ViewStyle } from "react-native"
import React from "react"
import { Text } from "app/components"
import { colors, spacing, typography } from "app/theme"
import { BlockItemBase, BlockType } from "./BlockItem"
import { Button } from "react-native-paper"

export type SectionTitleItemData = {
  title: string
  route?: string
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
      {input.data.route && (
        <Button mode="text" style={$moreLink} textColor={colors.moreLink}>
          Xem thêm
        </Button>
      )}
    </View>
  )
}

const $container: ViewStyle = {
  borderTopWidth: spacing.xxs,
  borderTopColor: colors.separator,
  flexDirection: "row",
  alignItems: "baseline",
  justifyContent: "space-between",
}

const $text: TextStyle = {
  fontFamily: typography.primary.medium,
  fontSize: 16,
  paddingTop: spacing.md,
  paddingLeft: spacing.md,
  paddingRight: spacing.md,
  lineHeight: spacing.lg,
}

const $moreLink: ViewStyle = {}
