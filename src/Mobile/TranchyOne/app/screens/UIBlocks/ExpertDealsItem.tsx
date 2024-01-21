import { colors, spacing, typography } from "app/theme"
import React from "react"
import { Dimensions, TextStyle, View, ViewStyle } from "react-native"
import Carousel from "react-native-reanimated-carousel"
import { BlockItemBase, BlockType, ExtraData } from "./BlockItem"
import { QuestionBrief } from "app/services/ask-api/models"
import { Chip, Text } from "react-native-paper"
import { getTitle } from "app/utils/localeTitle"
const windowWidth = Dimensions.get("window").width
const baseOptions = {
  vertical: false,
  width: windowWidth * 0.9,
  height: 170,
  loop: false,
  autoPlay: false,
  pagingEnabled: true,
} as const

export class ExpertDealsItem implements BlockItemBase {
  type: BlockType = "ExpertDeals"
  data: QuestionBrief[]
  constructor(data: QuestionBrief[]) {
    this.data = data
  }
}

export type ExpertDealsItemData = {
  title?: string
  categories: string[]
  price: string
}

export const renderExpertDealsItem = (input: ExpertDealsItem, extraData: ExtraData) => {
  return (
    <View style={$container}>
      <Carousel
        {...baseOptions}
        style={$carousel}
        data={input.data}
        renderItem={({ item }) => (
          <View style={$carouselItem}>
            <Chip
              icon="account-circle"
              style={$expertChip}
              textStyle={$expertChipText}
              selectedColor={colors.tint}
            >
              Bạn là chuyên gia
            </Chip>
            <Text variant="bodyLarge" ellipsizeMode="tail" numberOfLines={3} style={$questionText}>
              {item.title}
            </Text>
            <View style={$bottomTagContainer}>
              <View style={$carouselItemCategories}>
                {item.categories?.map((item, index) => {
                  return (
                    <Chip key={index} textStyle={$category} style={$categoryChip}>
                      {getTitle(extraData.categories, item, extraData.locale)}
                    </Chip>
                  )
                })}
              </View>
              <Chip textStyle={[$category, $price]} style={$categoryChip}>
                {item.price ?? "No Price"}
              </Chip>
            </View>
          </View>
        )}
      />
    </View>
  )
}

const $container: ViewStyle = {
  flex: 1,
  paddingBottom: spacing.md,
}

const $carousel: ViewStyle = {
  width: windowWidth,
  height: baseOptions.height,
}

const $carouselItem: ViewStyle = {
  flex: 1,
  marginLeft: "2.5%",
  backgroundColor: colors.palette.accent100,
  borderTopWidth: spacing.xxxs,
  borderTopColor: colors.tint,
  marginTop: spacing.lg,
  paddingTop: spacing.lg,
  paddingLeft: spacing.md,
  paddingRight: spacing.md,
}

const $carouselItemCategories: ViewStyle = {
  flex: 1,
  flexDirection: "row",
  columnGap: spacing.xxs,
}

const $expertChip: ViewStyle = {
  position: "absolute",
  top: -16,
  borderRadius: 24,
  borderColor: colors.tint,
  borderWidth: spacing.xxxs,
  marginLeft: spacing.sm,
  backgroundColor: colors.background,
}

const $expertChipText: TextStyle = {
  fontSize: 12,
  lineHeight: 12,
}

const $questionText: TextStyle = {
  height: spacing.lg * 3,
  lineHeight: spacing.lg,
}

const $bottomTagContainer: ViewStyle = {
  flexDirection: "row",
  paddingTop: spacing.sm,
  paddingBottom: spacing.sm,
}

const $categoryChip: ViewStyle = {
  borderRadius: spacing.lg,
  backgroundColor: colors.palette.accent300,
}

const $category: TextStyle = {
  fontSize: 12,
  fontFamily: typography.primary.light,
  lineHeight: 16,
  marginLeft: spacing.xxs,
  marginRight: spacing.xxs,
  marginTop: spacing.xxs,
  marginBottom: spacing.xxs,
}

const $price: TextStyle = {
  fontFamily: typography.primary.medium,
}
