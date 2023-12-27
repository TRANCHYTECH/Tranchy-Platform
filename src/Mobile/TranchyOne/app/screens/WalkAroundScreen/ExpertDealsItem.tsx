import { Text } from "app/components"
import { colors, spacing } from "app/theme"
import React from "react"
import { Dimensions, TextStyle, View, ViewStyle } from "react-native"
import Carousel from "react-native-reanimated-carousel"
import { BlockItemBase, BlockType } from "./BlockItem"
const windowWidth = Dimensions.get("window").width
const baseOptions = {
  vertical: false,
  width: windowWidth * 0.9,
  height: 132,
  loop: false,
  autoPlay: false,
  pagingEnabled: true,
} as const

export class ExpertDealsItem implements BlockItemBase {
  type: BlockType = "ExpertDeals"
  data: ExpertDealsItemData[]
  constructor(data: ExpertDealsItemData[]) {
    this.data = data
  }
}

export type ExpertDealsItemData = {
  title: string
  categories: string[]
  price: string
}

export const renderExpertDealsItem = (input: ExpertDealsItem) => {
  return (
    <View style={$container}>
      <Carousel
        {...baseOptions}
        style={$carousel}
        data={input.data}
        renderItem={({ item }) => (
          <View style={$carouselItem}>
            <Text>---Bạn là chuyên gia---</Text>
            <Text>{item.title}</Text>
            <View style={$carouselItemCategories}>
              {item.categories.map((item, index) => {
                return (
                  <Text key={index} style={$category}>
                    {item}
                  </Text>
                )
              })}
              <Text>{item.price}</Text>
            </View>
          </View>
        )}
      />
    </View>
  )
}

const $container: ViewStyle = {
  flex: 1,
}

const $carousel: ViewStyle = {
  width: windowWidth,
  height: baseOptions.height,
}

const $carouselItem: ViewStyle = {
  flex: 1,
  marginLeft: "2.5%",
  backgroundColor: colors.palette.accent200,
}

const $carouselItemCategories: ViewStyle = {
  flex: 1,
  flexDirection: "row",
}

const $category: TextStyle = {
  fontSize: 12,
  backgroundColor: colors.palette.accent100,
  borderRadius: spacing.md,
  // overflow: "hidden",
}
