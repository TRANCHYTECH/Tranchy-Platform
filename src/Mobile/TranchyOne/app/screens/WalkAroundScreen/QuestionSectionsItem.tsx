import { TextStyle, View, ViewStyle } from "react-native"
import React from "react"
import { Button } from "react-native-paper"
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
          <Button
            style={$questionSectionButtonStyle}
            labelStyle={$questionSectionButtonLabelStyle}
            icon={item.icon}
            mode="outlined"
            key={index}
          >
            {item.text}
          </Button>
        )
      })}
    </View>
  )
}

export const $questionSectionsContainer: ViewStyle = {
  flexDirection: "row",
  paddingLeft: spacing.sm,
  paddingRight: spacing.sm,
}

export const $questionSectionButtonStyle: ViewStyle = {
  flex: 1,
}

export const $questionSectionButtonLabelStyle: TextStyle = { fontSize: 12 }
