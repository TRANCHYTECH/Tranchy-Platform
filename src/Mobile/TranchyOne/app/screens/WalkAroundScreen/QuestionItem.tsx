import { TextStyle, View, ViewStyle } from "react-native"
import React from "react"
import { BlockItemBase, BlockType } from "./BlockItem"
import { QuestionBrief } from "app/services/ask-api/models"
import FastImage, { ImageStyle } from "react-native-fast-image"
import { Chip, Icon, MD3Colors, Text } from "react-native-paper"
import Config from "../../config"
import { colors, spacing, typography } from "app/theme"
import { timeAgo } from "app/utils/formatDate"

export type QuestionItemData = {
  title: string
  categories: string[]
  createdAt: Date
  saved: boolean
}

export class QuestionItem implements BlockItemBase {
  type: BlockType = "QuestionItem"
  data: QuestionBrief
  constructor(data: QuestionBrief) {
    this.data = data
  }
}

export const renderQuestionItem = (input: QuestionItem) => {
  return (
    <View style={$container}>
      <View>
        <FastImage
          style={$avatar}
          source={{
            uri: `${Config.API_URL}/avatar/${input.data.createdBy}.jpg?width=32`,
            priority: FastImage.priority.normal,
          }}
        />
      </View>
      <View style={$question}>
        <Text variant="bodyLarge" ellipsizeMode="tail" numberOfLines={3}>
          {input.data.title}
        </Text>
        <View style={$bottomLine}>
          <View>
            {input.data.categories?.map((item, index) => {
              return (
                <Chip key={index} textStyle={$category} style={$categoryChip}>
                  {item}
                </Chip>
              )
            })}
          </View>
          <View>
            <Chip textStyle={[$category]} style={$categoryChip}>
              todo
              {/* {timeAgo(input.data.createdAt ?? new Date())} */}
            </Chip>
          </View>
        </View>
      </View>
      <View style={{}}>
        {input.data.saved ? (
          <Icon source="bookmark-multiple" color={MD3Colors.error50} size={20} />
        ) : (
          <Icon source="bookmark-multiple-outline" color={MD3Colors.error50} size={20} />
        )}
      </View>
    </View>
  )
}

const $container: ViewStyle = {
  flex: 1,
  flexDirection: "row",
  paddingTop: spacing.md,
  paddingLeft: spacing.md,
  paddingRight: spacing.md,
  columnGap: spacing.md,
}

const $avatar: ImageStyle = {
  width: 32,
  height: 32,
  borderRadius: 50,
}

const $question: ViewStyle = {
  flex: 1,
  flexGrow: 1,
}

// todo (tau): reuse it
const $bottomLine: ViewStyle = {
  flex: 1,
  flexDirection: "row",
  columnGap: spacing.xxs,
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
