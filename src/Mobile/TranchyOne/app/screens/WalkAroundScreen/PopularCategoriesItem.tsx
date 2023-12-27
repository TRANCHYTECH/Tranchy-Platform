import { View } from "react-native"
import React from "react"
import { Text } from "app/components"
import { Button } from "react-native-paper"
import { BlockItemBase, BlockType } from "./BlockItem"

export type PopularCategoriesItemData = {
  text: string
  route: string
}

export class PopularCategoriesItem implements BlockItemBase {
  type: BlockType = "PopularCategories"
  data: PopularCategoriesItemData[]
  constructor(data: PopularCategoriesItemData[]) {
    this.data = data
  }
}

export const renderPopularCategoriesItem = (input: PopularCategoriesItem) => {
  return (
    <View>
      <Text>Khám phá những chủ đề phổ biến nhất đang có tại TranChy One</Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
        {input.data.map((item, index) => {
          return (
            <Button key={index} mode="outlined">
              {item.text}
            </Button>
          )
        })}
      </View>
    </View>
  )
}
