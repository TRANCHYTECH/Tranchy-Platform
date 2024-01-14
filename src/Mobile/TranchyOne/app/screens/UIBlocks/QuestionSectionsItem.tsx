import { TextStyle, View, ViewStyle } from "react-native"
import React from "react"
import { Chip } from "react-native-paper"
import { BlockItemBase, BlockType } from "./BlockItem"
import { colors, spacing, typography } from "app/theme"

export type QuestionSectionsItemData = {
  text: string
  icon?: string
  route: string
}

export class QuestionSectionsItem implements BlockItemBase {
  type: BlockType = "QuestionSections"
  data: QuestionSectionsItemData[]

  constructor(data: QuestionSectionsItemData[]) {
    this.data = data
  }
}

export const renderQuestionSectionsItem = (input: QuestionSectionsItem) => {
  return (
    <View style={$questionSectionsContainer}>
      {input.data.map((item, index) => {
        return (
          <Chip
            style={$questionSectionButtonStyle}
            textStyle={$questionSectionButtonLabelStyle}
            icon={item.icon}
            mode="outlined"
            key={index}
          >
            {item.text}
          </Chip>
        )
      })}
    </View>
  )
}

export const $questionSectionsContainer: ViewStyle = {
  flexDirection: "row",
  justifyContent: "center",
  columnGap: spacing.xxs,
  paddingTop: spacing.sm,
  paddingBottom: spacing.sm,
}

export const $questionSectionButtonStyle: ViewStyle = {
  borderRadius: 24,
  borderColor: colors.borderLight,
}

export const $questionSectionButtonLabelStyle: TextStyle = {
  fontFamily: typography.primary.medium,
  fontSize: 14,
  lineHeight: spacing.md,
  marginLeft: spacing.sm,
  marginRight: spacing.sm,
}
