import { View } from "react-native"
import React from "react"
import { Text } from "app/components"
import { BlockItemBase, BlockType } from "./BlockItem"

export type SeeMoreItemData = {
  route: string
}

export class SeeMoreItem implements BlockItemBase {
  type: BlockType = "SeeMore"
  data: SeeMoreItemData
  constructor(data: SeeMoreItemData) {
    this.data = data
  }
}

export const renderSeeMoreItem = (input: SeeMoreItem) => {
  return (
    <View>
      <Text>Xem thêm {input.data.route}</Text>
    </View>
  )
}
