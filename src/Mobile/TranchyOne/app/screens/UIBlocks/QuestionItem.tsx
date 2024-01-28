import { Pressable, StyleSheet, View, ViewStyle } from "react-native"
import React from "react"
import { QuestionBrief } from "app/services/ask-api/models"
import FastImage, { ImageStyle } from "react-native-fast-image"
import { Button, Icon, MD3Colors, Text } from "react-native-paper"
import Config from "../../config"
import { colors, spacing, typography } from "app/theme"
import { timeAgo } from "app/utils/formatDate"
import { BlockItemBase, BlockItemPosition, BlockType, ExtraData } from "./BlockItem"
import { getTitle } from "app/utils/localeTitle"

export type QuestionItemData = {
  title: string
  categories: string[]
  createdAt: Date
  saved: boolean
}

export function getPosition(index: number, length: number): BlockItemPosition {
  if (index === 0) {
    return "First"
  }

  return index === length - 1 ? "Last" : "Middle"
}

export class QuestionItem implements BlockItemBase {
  type: BlockType = "QuestionItem"
  data: QuestionBrief
  position: BlockItemPosition
  constructor(data: QuestionBrief, position: BlockItemPosition) {
    this.data = data
    this.position = position
  }
}

export const renderQuestionItem = (
  input: QuestionItem,
  extraData: ExtraData,
  onPressSaving: (id: string) => void,
  onPressQuestion: (id: string) => void,
) => {
  return (
    <Pressable onPress={() => onPressQuestion(input.data.id)}>
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
        </View>
        <View style={{}}>
          <Button onPress={() => onPressSaving(input.data.id)}>
            {extraData.savedQuestions.includes(input.data.id) ? (
              <Icon source="bookmark-multiple" color={MD3Colors.error50} size={20} />
            ) : (
              <Icon source="bookmark-multiple-outline" color={colors.date} size={20} />
            )}
          </Button>
        </View>
      </View>
      <View style={$bottomLine.container}>
        <View style={$bottomLine.categories}>
          {input.data.categories?.map((item, index) => {
            return (
              <Text key={index} style={$bottomLine.categoryTag}>
                #{getTitle(extraData.categories, item, extraData.locale)}
              </Text>
            )
          })}
        </View>
        <View style={$bottomLine.createdAt}>
          <Text style={$bottomLine.createdAtText}>{timeAgo(input.data.createdOn)}</Text>
        </View>
      </View>
      <View
        style={[
          $bottomLine.separate,
          input.position === "Last" ? $bottomLine.separateLast : $bottomLine.separateFirst,
        ]}
      ></View>
    </Pressable>
  )
}

const $bottomLine = StyleSheet.create({
  categories: {
    flex: 1,
    flexDirection: "row",
    flexGrow: 1,
  },
  categoryTag: {
    color: colors.hashTag,
    fontFamily: typography.primary.normal,
    fontSize: 12,
    lineHeight: 16,
    marginHorizontal: spacing.xxs,
    marginVertical: spacing.xxs,
  },
  container: {
    alignItems: "baseline",
    columnGap: spacing.xxs,
    flex: 1,
    flexDirection: "row",
    marginLeft: spacing.xxxl,
    marginRight: spacing.md,
    paddingTop: spacing.xs,
  },
  createdAt: {},
  createdAtText: {
    color: colors.date,
  },
  separate: {
    borderBottomWidth: 1,
    borderColor: colors.borderLight,
    height: 1,
  },
  separateFirst: {
    marginLeft: spacing.xxxl,
    marginRight: spacing.md,
    paddingTop: spacing.xs,
  },
  separateLast: {
    marginHorizontal: spacing.md,
    paddingTop: spacing.xs,
  },
})

const $container: ViewStyle = {
  flex: 1,
  flexDirection: "row",
  paddingTop: spacing.md,
  paddingHorizontal: spacing.md,
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
