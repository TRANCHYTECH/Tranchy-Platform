import { View } from "react-native"
import React from "react"
import { Text } from "app/components"
import { ExpertDealsItem, renderExpertDealsItem } from "./ExpertDealsItem"
import { BlockItemType, PopularCategoriesItem, QuestionItem } from "./BlockItem"
import { observer } from "mobx-react-lite"
import { getPosition, renderQuestionItem } from "./QuestionItem"
import { SectionTitleItem, renderSectionTitleItem } from "./SectionTitleItem"
import { SeeMoreItem, renderSeeMoreItem } from "./SeeMoreItem"
import { QuestionSectionsItem, renderQuestionSectionsItem } from "./QuestionSectionsItem"
import { renderPopularCategoriesItem } from "./PopularCategoriesItem"
import { arrayOrEmptyArray } from "app/utils/arrayHelper"
import { HighlightSectionsResponse } from "app/services/ask-api/models"

export const buildBlocks = (highlights: HighlightSectionsResponse) => {
  const orderedList: BlockItemType[] = []
  orderedList.push(
    new QuestionSectionsItem([
      { text: "Đang trả lời", icon: "comment-outline", route: "route1" },
      { text: "Chờ phản hồi", route: "route1" },
      { text: "Lịch sử câu hỏi", route: "route1" },
    ]),
  )

  const expertExclusiveData = arrayOrEmptyArray(highlights.expertExclusive.data)
  if (expertExclusiveData.length > 0) {
    orderedList.push(new SectionTitleItem({ title: "Nắm bắt cơ hội" }))
    orderedList.push(new ExpertDealsItem(expertExclusiveData))
  }

  const recentData = arrayOrEmptyArray(highlights.recent.data)
  if (recentData.length > 0) {
    orderedList.push(new SectionTitleItem({ title: "Mới đăng gần đây" }))
    orderedList.push(
      ...recentData.map<QuestionItem>(
        (q, index, source) => new QuestionItem(q, getPosition(index, source.length)),
      ),
    )
    orderedList.push(new SeeMoreItem({ route: "questions" }))
  }

  const popularCategoriesData = arrayOrEmptyArray(highlights.popularCategories.data)
  if (popularCategoriesData.length > 0) {
    orderedList.push(new SectionTitleItem({ title: "Chủ đề nổi bật", route: "todo" }))
    orderedList.push(new PopularCategoriesItem(popularCategoriesData))
  }

  const matchProfileData = arrayOrEmptyArray(highlights.matchProfile.data)
  if (matchProfileData.length > 0) {
    orderedList.push(new SectionTitleItem({ title: "Phù hợp với bạn" }))
    orderedList.push(
      ...matchProfileData.map<QuestionItem>(
        (q, i, source) => new QuestionItem(q, getPosition(i, source.length)),
      ),
    )
    orderedList.push(new SeeMoreItem({ route: "questions" }))
  }

  return orderedList
}

const renderSectionSeparateItem = () => {
  return (
    <View>
      <Text></Text>
    </View>
  )
}

const renderLineSeparateItem = () => {
  return (
    <View>
      <Text>separate</Text>
    </View>
  )
}

export const BlockItem = observer(function BlockItem({ data }: { data: BlockItemType }) {
  switch (data.type) {
    case "QuestionSections": {
      return renderQuestionSectionsItem(data as QuestionSectionsItem)
    }
    case "SectionSeparate": {
      return renderSectionSeparateItem()
    }
    case "LineSeparate": {
      return renderLineSeparateItem()
    }
    case "SectionTitle": {
      return renderSectionTitleItem(data as SectionTitleItem)
    }
    case "ExpertDeals": {
      return renderExpertDealsItem(data as ExpertDealsItem)
    }
    case "QuestionItem": {
      return renderQuestionItem(data as QuestionItem)
    }
    case "SeeMore": {
      return renderSeeMoreItem(data as SeeMoreItem)
    }
    case "PopularCategories": {
      return renderPopularCategoriesItem(data as PopularCategoriesItem)
    }
    default:
      throw new Error("Not supported block type")
  }
})
