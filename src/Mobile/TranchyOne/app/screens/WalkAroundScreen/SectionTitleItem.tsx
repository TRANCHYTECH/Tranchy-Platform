import { View, ViewStyle } from "react-native"
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
    <View style={$sectionTitleItemOuterStyle}>
      <View style={$sectionTitleItemInnerStyle}>
        <Text>{input.data.title}</Text>
      </View>
    </View>
  )
}

const $sectionTitleItemOuterStyle: ViewStyle = {
  paddingTop: spacing.xxs,
  backgroundColor: "#AFB7C8",
}

const $sectionTitleItemInnerStyle: ViewStyle = {
  backgroundColor: colors.palette.accent500,
}
