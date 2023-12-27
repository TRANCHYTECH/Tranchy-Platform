import { View, ViewStyle } from "react-native"
import React from "react"
import { Text } from "app/components"
import { BlockItemBase, BlockType } from "./BlockItem"

export type QuestionItemData = {
  title: string
  categories: string[]
  createdAt: Date
  saved: boolean
}

export class QuestionItem implements BlockItemBase {
  type: BlockType = "QuestionItem"
  data: QuestionItemData
  constructor(data: QuestionItemData) {
    this.data = data
  }
}

export const renderQuestionItem = (input: QuestionItem) => {
  return (
    <View style={$container}>
      <View style={{ width: 50 }}>
        <Text>Avatar</Text>
      </View>
      <View style={{ flex: 1, flexGrow: 1 }}>
        <Text>{input.data.title}</Text>
        {input.data.categories.map((item, index) => {
          return <Text key={index}>{item}</Text>
        })}
      </View>
      <View style={{ width: 50 }}>
        <Text>{input.data.saved ? "Saved" : "Save"}</Text>
      </View>
    </View>
  )
}

const $container: ViewStyle = {
  flex: 1,
  flexDirection: "row",
}
