import { TextStyle, View, ViewStyle } from "react-native"
import React from "react"
import { Chip } from "react-native-paper"
import { BlockItemBase, BlockType } from "./BlockItem"
import { spacing } from "app/theme"

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
  borderColor: "#AFB7C8", //todo (tau): move to colors theme
}

export const $questionSectionButtonLabelStyle: TextStyle = {
  fontSize: 12,
  fontWeight: "500",
  lineHeight: spacing.md,
  fontStyle: "normal",
}
