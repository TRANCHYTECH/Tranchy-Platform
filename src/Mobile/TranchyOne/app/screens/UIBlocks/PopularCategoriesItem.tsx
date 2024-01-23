import { TextStyle, View, ViewStyle } from "react-native"
import React from "react"
import { Text } from "app/components"
import { Button } from "react-native-paper"
import { BlockItemBase, BlockType, ExtraData } from "./BlockItem"
import { CategoryBrief } from "app/services/ask-api/models"
import { colors, spacing, typography } from "app/theme"
import { getTitle } from "app/utils/localeTitle"

export type PopularCategoriesItemData = {
  text: string
  route: string
}

export class PopularCategoriesItem implements BlockItemBase {
  type: BlockType = "PopularCategories"
  data: CategoryBrief[]
  constructor(data: CategoryBrief[]) {
    this.data = data
  }
}

export const renderPopularCategoriesItem = (input: PopularCategoriesItem, extraData: ExtraData) => {
  return (
    <View style={$container}>
      <Text style={$textIntro}>Khám phá những chủ đề phổ biến nhất đang có tại TranChy One</Text>
      <View style={$categoryList}>
        {input.data.map((item, index) => {
          return (
            <Button
              key={index}
              mode="outlined"
              style={$categoryButton}
              textColor={colors.text}
              labelStyle={$categoryButtonText}
            >
              {getTitle(extraData.categories, item.id, extraData.locale)}
            </Button>
          )
        })}
      </View>
    </View>
  )
}

const $container: ViewStyle = {
  marginHorizontal: spacing.md,
  paddingBottom: spacing.md,
}

const $textIntro: TextStyle = {
  color: colors.date,
  fontSize: 12,
}
const $categoryList: ViewStyle = {
  flexDirection: "row",
  flexWrap: "wrap",
  columnGap: spacing.xs,
  rowGap: spacing.xs,
  paddingTop: spacing.sm,
}

const $categoryButton: ViewStyle = {
  borderColor: colors.borderLight,
}

const $categoryButtonText: TextStyle = {
  fontFamily: typography.primary.medium,
  fontSize: 14,
  lineHeight: spacing.md,
  marginHorizontal: spacing.sm,
  marginVertical: spacing.xs,
}
