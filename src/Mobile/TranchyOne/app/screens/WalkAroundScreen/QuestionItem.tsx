import { View, ViewStyle } from "react-native"
import React from "react"
import { Text } from "app/components"
import { BlockItemBase, BlockType } from "./BlockItem"
import { QuestionBrief } from "app/services/ask-api/models"
import FastImage from "react-native-fast-image"
import { Icon, MD3Colors } from "react-native-paper"

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
      <View style={{ width: 60 }}>
        <FastImage
          style={{ width: 50, height: 50, borderRadius: 50 }}
          source={{
            uri: `http://localhost:7300/avatar/${input.data.createdBy}.jpg?width=50`,
            priority: FastImage.priority.normal,
          }}
        />
      </View>
      <View style={{ flex: 1, flexGrow: 1 }}>
        <Text>{input.data.title}</Text>
        {input.data.categories.map((item, index) => {
          return <Text key={index}>{item}</Text>
        })}
      </View>
      <View style={{ width: 30 }}>
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
}
